import {
    BodystatesAntoc,
    BodystatesJessica,
    Condition,
    Perceptible,
} from '../types/Condition';
import { alwaysTrueCondition } from '../types/Layer';
import { Direction, Tree } from '../types/Tree';

export const opponent_frame_preset_conditions = [
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: Perceptible.OpponentBodyCounter,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: 0,
                type: 'Constant',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'Opponent Frame = 1',
        type: 'opponent state',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: Perceptible.OpponentBodyCounter,
                type: 'Perceptible',
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
        displayName: 'Opponent Frame = 2',
        type: 'opponent state',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: Perceptible.OpponentBodyCounter,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: 2,
                type: 'Constant',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'Opponent Frame = 3',
        type: 'opponent state',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: Perceptible.OpponentBodyCounter,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: 3,
                type: 'Constant',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'Opponent Frame = 4',
        type: 'opponent state',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: Perceptible.OpponentBodyCounter,
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
        displayName: 'Opponent Frame = 5',
        type: 'opponent state',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: Perceptible.OpponentBodyCounter,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: 5,
                type: 'Constant',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'Opponent Frame = 6',
        type: 'opponent state',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: Perceptible.OpponentBodyCounter,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: 6,
                type: 'Constant',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'Opponent Frame = 7',
        type: 'opponent state',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: Perceptible.OpponentBodyCounter,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: 7,
                type: 'Constant',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'Opponent Frame = 8',
        type: 'opponent state',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: Perceptible.OpponentBodyCounter,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: 8,
                type: 'Constant',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'Opponent Frame = 9',
        type: 'opponent state',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: Perceptible.OpponentBodyCounter,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: 9,
                type: 'Constant',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'Opponent Frame = 10',
        type: 'opponent state',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: Perceptible.OpponentBodyCounter,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: 10,
                type: 'Constant',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'Opponent Frame = 11',
        type: 'opponent state',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: Perceptible.OpponentBodyCounter,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: 17,
                type: 'Constant',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'Opponent Frame = 18',
        type: 'opponent state',
    },
];
