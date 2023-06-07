import {
    CHARACTER_ACTIONS_DETAIL,
    actionstoBodyState,
} from '../constants/constants';
import { Condition, generateConditionKey } from './Condition';
import { MentalState } from './MentalState';
import { Direction, Tree } from './Tree';

//TODO - make conditions appendable, allow actions to be combos
export interface Layer {
    condition: Condition;
    action: number;
}

const defaultLayer: Layer = {
    //@ts-ignore
    condition: alwaysTrueCondition,
    action: 0,
};

const layersToAgentComponents = (
    layers: Layer[],
    character: number
): { mentalStates: MentalState[]; conditions: Condition[]; trees: Tree[] } => {
    const mentalStates = layers.map((layer) => {
        return {
            state: generateConditionKey(),
            action: layer.action,
        };
    });

    let unflattenedConditions = layers.map((layer) => {
        //action to bodystate
        const bodyState = actionstoBodyState[character][layer.action];
        //get amount of frames to wait
        const duration =
            CHARACTER_ACTIONS_DETAIL[character][layer.action].duration;

        const isFinished = getIsFinishedCondition(duration);
        // get character specific bodystates
        const isInterrupted = getInterruptedCondition(character);

        return [isFinished, isInterrupted];
    });

    const nodes = layers.map((layer, index) => {
        return {
            nodes: getNode(
                'FILL',
                unflattenedConditions[index][0].key,
                unflattenedConditions[index][1].key
            ),
        };
    });

    const conditions = unflattenedConditions.flat();

    //@ts-ignore
    const trees = [{ nodes: getRootNode(conditions, mentalStates) }, ...nodes];

    //@ts-ignore
    return { mentalStates, conditions, trees };
};

//condtions to transition to action
//ms names to transition to
const getRootNode = (conditions: Condition[], mentalStates: MentalState[]) => {
    const leftNodes = conditions
        .map((condition, index) => {
            return [
                {
                    id: condition.key,
                    isChild: false,
                },
                {
                    id: mentalStates[index].state,
                    isChild: false,
                    branch: Direction.Left,
                },
            ];
        })
        .flat();

    return [
        ...leftNodes,
        {
            id: 'Start',
            isChild: true,
            branch: 'right',
        },
    ];
};

const getNode = (
    msName: string,
    conditionKey0: string,
    conditionKey1: string
) => {
    return [
        {
            id: conditionKey0,
            isChild: false,
        },
        {
            id: 'Start',
            isChild: true,
            branch: 'left',
        },
        {
            id: conditionKey1,
            isChild: false,
        },
        {
            id: 'Start',
            isChild: true,
            branch: 'left',
        },
        {
            id: msName,
            isChild: true,
            branch: 'right',
        },
    ];
};

const getIsFinishedCondition = (duration: number) => {
    return {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 11,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: duration,
                type: 'Constant',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'is_action_finished',
        key: generateConditionKey(),
    };
};

const getInterruptedCondition = (character: number) => {
    return {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 10,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                //hurt
                value: character == 0 ? 60 : 1050,
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
            {
                value: 'OR',
                type: 'Operator',
            },
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 10,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                //knocked
                value: character == 0 ? 70 : 1060,
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
            {
                value: 'OR',
                type: 'Operator',
            },
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: 10,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                //clash
                value: character == 0 ? 50 : 1130,
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'is_interrupted',
        key: generateConditionKey(),
    };
};

// These are conditions but typescript wants enum
const alwaysTrueCondition = {
    elements: [
        {
            value: '(',
            type: 'Operator',
        },
        {
            value: 1,
            type: 'Constant',
        },
        {
            value: '==',
            type: 'Operator',
        },
        {
            value: 1,
            type: 'Constant',
        },
        {
            value: ')',
            type: 'Operator',
        },
    ],
    displayName: 'always_true',
    key: '1686113964152',
};

const interruptCondtions = {
    elements: [
        {
            value: '(',
            type: 'Operator',
        },
        {
            value: 10,
            type: 'Perceptible',
        },
        {
            value: '==',
            type: 'Operator',
        },
        {
            value: 70,
            type: 'BodyState',
        },
        {
            value: ')',
            type: 'Operator',
        },
        {
            value: 'OR',
            type: 'Operator',
        },
        {
            value: '(',
            type: 'Operator',
        },
        {
            value: 10,
            type: 'Perceptible',
        },
        {
            value: '==',
            type: 'Operator',
        },
        {
            value: 60,
            type: 'BodyState',
        },
        {
            value: ')',
            type: 'Operator',
        },
    ],
    displayName: 'is_interrupted',
    key: '1686113964152',
};

const actionFinished = {
    elements: [
        {
            value: '(',
            type: 'Operator',
        },
        {
            value: 11,
            type: 'Perceptible',
        },
        {
            value: '==',
            type: 'Operator',
        },
        {
            value: 4,
            type: 'Constant',
        },
        {
            value: ')',
            type: 'Operator',
        },
    ],
    displayName: 'is_action_finished',
    key: '1686113990185',
};

const exampleTree = [
    {
        nodes: [
            {
                id: '6',
                isChild: false,
            },
            {
                id: 'attack',
                isChild: true,
                branch: 'left',
            },
            {
                id: 'Start',
                isChild: true,
                branch: 'right',
            },
        ],
    },
    {
        nodes: [
            {
                id: '1686113964152',
                isChild: false,
            },
            {
                id: 'Start',
                isChild: true,
                branch: 'left',
            },
            {
                id: '1686113990185',
                isChild: false,
            },
            {
                id: 'Start',
                isChild: true,
                branch: 'left',
            },
            {
                id: 'attack',
                isChild: true,
                branch: 'right',
            },
        ],
    },
];

const exampleMS = [
    {
        state: 'Start',
        action: 5,
    },
    {
        state: 'attack',
        action: 1,
    },
];
