import { Action, CHARACTERS_ACTIONS } from './Action';
import {
    BodystatesAntoc,
    BodystatesJessica,
    Condition,
    ConditionElement,
    ElementType,
    Operator,
    Perceptible,
} from './Condition';
import { MentalState } from './MentalState';
import { Direction, Tree } from './Tree';
import { actionIntentsInCombo } from './Action';
import { JESSICA } from '../constants/constants';
//Layer conditions have extra metadate while they are being edited
export interface LayerCondition extends Condition {
    isInverted: boolean;
}
export interface Layer {
    conditions: LayerCondition[];
    action: {
        //Id is either that action decimal number or combo decimal number (both are defined in shoshin smart contracts)
        id: number;
        isCombo: boolean;
    };
    sui?: boolean;
    locked?: boolean;
}

const getActionCondition = (
    layer: Layer,
    layerIndex: number,
    character: number
) => {
    const action = CHARACTERS_ACTIONS[character].find(
        (action) => action.id == layer.action.id
    );
    const actionName = action.display.name;
    const duration = action.frames.duration - 1;
    const sui = layer.sui ?? false;

    // Block needs to be handled differently because its body counter saturates at 3 until intent changes
    // when blocking, termination condition is the inverse of the condition for this layer;
    // The same applies to move forward/backward, taunt, and rest; all these actions are intuitively expected to sustain only while the layer's condition stays true
    if (
        sui ||
        actionName.includes('MoveForward') ||
        actionName.includes('MoveBackward') ||
        actionName.includes('Block') ||
        actionName.includes('Taunt') ||
        actionName.includes('Rest')
    ) {
        const inverseCondition = getInverseCondition(
            layerIndex,
            layer.conditions
        );
        return inverseCondition;
    } else {
        return getIsFinishedCondition(duration, layerIndex);
    }
};

//given layers gets all needed mental states, conditions and trees to build an agent using the state machine structure
export const layersToAgentComponents = (
    layers: Layer[],
    character: number,
    combos: Action[][]
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

            const comboDuration = combos[layer.action.id - 101].reduce(
                (acc, a, index, combo) =>
                    acc + actionIntentsInCombo(a, index, combo).length,
                0
            );

            // console.log('combo duration', comboDuration);

            // terminatingCondition = getIsComboFinishedCondition(
            //     comboDuration,
            //     layer.action.id
            // );
            terminatingCondition = getComboCondition(comboDuration, layer, i);
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

    const rootConditions = layersInverted.map((layer, index) => {
        return appendConditions(layer.conditions, index);
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

    return res;
};

const appendConditions = (conditions: Condition[], index) => {
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
        key: `${conditions[0].key}${index}`,
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
                value: Perceptible.SelfBodyCounter,
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

const getComboCondition = (
    comboDuration: number,
    layer: Layer,
    layerIndex: number
) => {
    const sui = layer.sui ?? false;
    if (sui) {
        const inverseCondition = getInverseCondition(
            layerIndex,
            layer.conditions
        );
        return inverseCondition;
    } else {
        return getIsComboFinishedCondition(comboDuration, layer.action.id);
    }
};

const getIsComboFinishedCondition = (comboDuration: number, id: number) => {
    return {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: Perceptible.SelfComboCounter,
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
                value: '(',
                type: 'Operator',
            },
            {
                value: Perceptible.SelfBodyState,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value:
                    character == JESSICA
                        ? BodystatesJessica.Hurt
                        : BodystatesAntoc.Hurt,
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
                value: Perceptible.SelfBodyState,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value:
                    character == JESSICA
                        ? BodystatesJessica.Knocked
                        : BodystatesAntoc.Knocked,
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
                value: Perceptible.SelfBodyState,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                //clash
                value:
                    character == JESSICA
                        ? BodystatesJessica.Clash
                        : BodystatesAntoc.Clash,
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
                value: Perceptible.SelfBodyState,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value:
                    character == JESSICA
                        ? BodystatesJessica.Launched
                        : BodystatesAntoc.Launched,
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
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
export const alwaysTrueCondition = {
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
    displayName: 'Always true',
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
    },
    sui: false,
    locked: false,
};
