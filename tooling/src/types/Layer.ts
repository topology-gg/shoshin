import {
    CHARACTER_ACTIONS_DETAIL,
    actionstoBodyState,
} from '../constants/constants';
import { Action, CHARACTERS_ACTIONS } from './Action';
import { customDurations } from './Combos';
import {
    Condition,
    ElementType,
    Operator,
    generateConditionKey,
} from './Condition';
import { MentalState } from './MentalState';
import { Direction, Tree } from './Tree';

//TODO - make conditions appendable,
export interface Layer {
    condition: Condition;
    action: {
        //Id is either that action decimal number or combo decimal number (both are defined in shoshin smart contracts)
        id: number;
        isCombo: boolean;
    };
}

const getActionCondition = (
    layer: Layer,
    layerIndex: number,
    character: number
) => {
    let key = Object.keys(CHARACTER_ACTIONS_DETAIL[character]).find((key) => {
        return CHARACTER_ACTIONS_DETAIL[character][key].id == layer.action.id;
    });

    const duration = CHARACTER_ACTIONS_DETAIL[character][key].duration - 1;
    console.log(character, key, duration);

    let terminatingCondition;
    if (key == 'MoveForward' || key == 'MoveBackward' || key == 'Block') {
        return (terminatingCondition = getNotCondition(
            layerIndex,
            layer.condition
        ));
    } else {
        return (terminatingCondition = getIsFinishedCondition(
            duration,
            layerIndex
        ));
    }
};

//given layers gets all needed mental states, conditions and trees to build an agent using the state machine structure
export const layersToAgentComponents = (
    layers: Layer[],
    character: number,
    combos: Action[][]
): { mentalStates: MentalState[]; conditions: Condition[]; trees: Tree[] } => {
    const startMentalState: MentalState = {
        state: 'Start',
        action: 0,
    };

    const generatedMentalStates = [
        ...layers.map((layer, i) => {
            return {
                state: `ms_${i}`,
                action: layer.action.id,
            };
        }),
    ];

    let unflattenedConditions = layers.map((layer, i) => {
        let terminatingCondition;
        const action_name = CHARACTERS_ACTIONS[character].find(
            (action) => action.id
        ).display.name;
        if (action_name == 'Block') {
            // block needs to be handled differently because its body counter saturates at 3 until intent changes
            // when blocking, termination condition is the inverse of the condition for this layer
            terminatingCondition = getInverseCondition(
                layer.condition,
                layer.action.id
            );
        } else if (layer.action.isCombo == true) {
            //if combo, we need to get combo length, and put in the action for the node

            console.log('character', character);
            console.log('action.id', layer.action.id);
            const comboDuration = combos[layer.action.id - 101].reduce(
                (acc, a) =>
                    acc +
                    (customDurations[character][a.id] == undefined
                        ? a.frames.duration + 1
                        : a.frames.duration),
                0
            );

            console.log('combo duration', comboDuration);
            terminatingCondition = getIsComboFinishedCondition(
                comboDuration,
                layer.action.id
            );
        } else {
            terminatingCondition = getActionCondition(layer, i, character);
        }

        // get character specific bodystates
        const isInterrupted = getInterruptedCondition(character, i);

        return [terminatingCondition, isInterrupted];
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

// Condition keys have to be a unique number
// Unique encoding for each condition type and layer index is unique amongst layers
const conditionKeyEncoding = {
    inverse: 12321,
    interrupt: 909,
    finished: 808,
    not: 303,
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

const getNotCondition = (id: number, condition: Condition) => {
    return {
        elements: [
            {
                value: '!',
                type: 'Operator',
            },
            {
                value: '(',
                type: 'Operator',
            },
            ...condition.elements,
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'is_condition_not_false',
        key: `${conditionKeyEncoding.finished}${id}`,
    };
};

const getInverseCondition = (condition: Condition, id: number): Condition => {
    // create and return !(condition)
    return {
        elements: [
            {
                value: Operator.Not,
                type: ElementType.Operator,
            },
            {
                value: Operator.OpenParenthesis,
                type: ElementType.Operator,
            },
            ...condition.elements,
            {
                value: Operator.CloseParenthesis,
                type: ElementType.Operator,
            },
        ],
        displayName: 'inverse_'.concat(condition.displayName),
        key: `${conditionKeyEncoding.inverse}${id}`,
    };
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

const getIsComboFinishedCondition = (comboDuration: number, id: number) => {
    return {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: '13',
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: comboDuration,
                type: 'Constant',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'is_combo_finished',
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
    action: {
        id: 0,
        isCombo: false,
    },
};
