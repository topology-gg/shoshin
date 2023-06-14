import { CHARACTER_ACTIONS_DETAIL } from '../constants/constants';
import {
    Condition,
    ConditionElement,
    ElementType,
    Operator,
} from './Condition';
import { MentalState } from './MentalState';
import { Direction, Tree } from './Tree';

//Layer conditions have extra metadate while they are being edited
interface LayerCondition extends Condition {
    isInverted: boolean;
}
export interface Layer {
    conditions: LayerCondition[];
    action: {
        //Id is either that action decimal number or combo decimal number (both are defined in shoshin smart contracts)
        id: number;
        isCombo: boolean;
        comboDuration: number;
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

    if (key == 'MoveForward' || key == 'MoveBackward' || key == 'Block') {
        return getInverseCondition(layerIndex, layer.conditions);
    } else {
        return getIsFinishedCondition(duration, layerIndex);
    }
};
//given layers gets all needed mental states, conditions and trees to build an agent using the state machine structure
export const layersToAgentComponents = (
    layers: Layer[],
    character: number
): { mentalStates: MentalState[]; conditions: Condition[]; trees: Tree[] } => {
    const layersInverted = layers.map((layer) => {
        const updatedConditions = layer.conditions.map((condition) => {
            if (condition.isInverted) {
                return {
                    ...condition,
                    elements: getInverseConditionElements(condition.elements),
                };
            }
            return condition;
        });

        return {
            ...layer,
            conditions: updatedConditions,
        };
    });
    const startMentalState: MentalState = {
        state: 'Start',
        action: 0,
    };

    const generatedMentalStates = [
        ...layersInverted.map((layer, i) => {
            return {
                state: `ms_${i}`,
                action: layer.action.id,
            };
        }),
    ];

    let unflattenedConditions = layersInverted.map((layer, i) => {
        let terminatingCondition;
        if (layer.action.isCombo == true) {
            //if combo, we need to get combo length, and put in the action for the node
            terminatingCondition = getIsComboFinishedCondition(
                layer.action.comboDuration,
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

    const rootConditions = layersInverted.map((layer) => {
        return appendConditions(layer.conditions);
    });

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
    interrupt: 909,
    finished: 808,
    inverse: 303,
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

const getAppendedElements = (conditions: Condition[]): any[] => {
    console.log('input conditions', conditions);
    let res = conditions
        .map((condition) => condition.elements)
        .reduce((acc, elements, i) => {
            // indexes [0, 1, 2] and length = 3
            // yes 0, yes 1, no 2
            if (i < conditions.length - 1) {
                const andElement = {
                    value: Operator.And,
                    type: ElementType.Operator,
                };
                return [...acc, ...elements, andElement];
            }
            return [...acc, ...elements];
        }, []);

    console.log('appended elements', res);
    return res;
};

const appendConditions = (conditions: Condition[]) => {
    const elementsAppended = getAppendedElements(conditions);
    return {
        elements: [
            {
                value: Operator.OpenParenthesis,
                type: ElementType.Operator,
            },
            ...elementsAppended,
            {
                value: Operator.CloseParenthesis,
                type: ElementType.Operator,
            },
        ],
        displayName: 'actionCondition',
        key: `${conditions[0].key}`,
    };
};

const getInverseConditionElements = (conditionElements: ConditionElement[]) => {
    return [
        {
            value: Operator.Not,
            type: ElementType.Operator,
        },
        {
            value: Operator.OpenParenthesis,
            type: ElementType.Operator,
        },
        ...conditionElements,
        {
            value: Operator.CloseParenthesis,
            type: ElementType.Operator,
        },
    ];
};

const getInverseCondition = (id: number, conditions: Condition[]) => {
    const elementsAppended = getAppendedElements(conditions);

    return {
        elements: getInverseConditionElements(elementsAppended),
        displayName: 'is_condition_not_false',
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
    isInverted: false,
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
    conditions: [alwaysTrueCondition],
    action: {
        id: 0,
        isCombo: false,
        comboDuration: -1,
    },
};
