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

//given layers gets all needed mental states, conditions and trees to build an agent using the state machine structure
export const layersToAgentComponents = (
    layers: Layer[],
    character: number
): { mentalStates: MentalState[]; conditions: Condition[]; trees: Tree[] } => {
    const startMentalState: MentalState = {
        state: 'Start',
        action: 0,
    };

    const generatedMentalStates = [
        ...layers.map((layer, i) => {
            return {
                state: `ms_${i}`,
                action: layer.action,
            };
        }),
    ];

    let unflattenedConditions = layers.map((layer, i) => {
        //action to bodystate
        const bodyState = actionstoBodyState[character][layer.action];
        //get amount of frames to wait

        let key = Object.keys(CHARACTER_ACTIONS_DETAIL[character]).find(
            (key) => {
                return (
                    CHARACTER_ACTIONS_DETAIL[character][key].id == layer.action
                );
            }
        );
        const duration = CHARACTER_ACTIONS_DETAIL[character][key].duration - 1;

        const isFinished = getIsFinishedCondition(duration, i);
        // get character specific bodystates
        const isInterrupted = getInterruptedCondition(character, i);

        return [isFinished, isInterrupted];
    });

    const nodes = generatedMentalStates.map((ms, index) => {
        return {
            nodes: getNode(
                ms.state,
                unflattenedConditions[index][0].key,
                unflattenedConditions[index][1].key
            ),
        };
    });

    const generatedConditions = unflattenedConditions.length
        ? unflattenedConditions.flat()
        : [];

    const rootConditions = layers.map((layer) => layer.condition);

    //@ts-ignore
    const trees = [
        { nodes: getRootNode(rootConditions, generatedMentalStates) },
        ...nodes,
    ];

    const combined = [...rootConditions, ...generatedConditions];
    const mentalStates = [startMentalState, ...generatedMentalStates];

    //@ts-ignore
    return { mentalStates, conditions: combined, trees };
};

// Condition keys have to be a number, and unique
// Unique encoding for each condition type and condition per index
const conditionKeyEncoding = {
    interrupt: 555,
    finished: 444,
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
                    isChild: true,
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

const getIsFinishedCondition = (duration: number, id: number) => {
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
        key: `${conditionKeyEncoding.finished}${id}`,
    };
};

const getInterruptedCondition = (character: number, id: number) => {
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
        key: `${conditionKeyEncoding.interrupt}${id}`,
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

export const defaultLayer: Layer = {
    //@ts-ignore
    condition: alwaysTrueCondition,
    action: 0,
};
