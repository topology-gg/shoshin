import {
    BodystatesAntoc,
    BodystatesJessica,
    Condition,
    Perceptible,
} from '../types/Condition';
import { alwaysTrueCondition } from '../types/Layer';
import { Direction, Tree } from '../types/Tree';

export const y_position_preset_conditions = [
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: '!',
                type: 'Operator',
            },
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: Perceptible.SelfY,
                type: 'Perceptible',
            },
            {
                value: '<=',
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
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'Self Y > 0',
        type: 'spacing',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: '!',
                type: 'Operator',
            },
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: Perceptible.SelfY,
                type: 'Perceptible',
            },
            {
                value: '<=',
                type: 'Operator',
            },
            {
                value: 45,
                type: 'Constant',
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
        displayName: 'Self Y > 45',
        type: 'spacing',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: '!',
                type: 'Operator',
            },
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: Perceptible.SelfY,
                type: 'Perceptible',
            },
            {
                value: '<=',
                type: 'Operator',
            },
            {
                value: 100,
                type: 'Constant',
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
        displayName: 'Self Y > 100',
        type: 'spacing',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: '!',
                type: 'Operator',
            },
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: Perceptible.OpponentY,
                type: 'Perceptible',
            },
            {
                value: '<=',
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
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'Opponent Y > 0',
        type: 'spacing',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: '!',
                type: 'Operator',
            },
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: Perceptible.OpponentY,
                type: 'Perceptible',
            },
            {
                value: '<=',
                type: 'Operator',
            },
            {
                value: 45,
                type: 'Constant',
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
        displayName: 'Opponent Y > 45',
        type: 'spacing',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: '!',
                type: 'Operator',
            },
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: Perceptible.OpponentY,
                type: 'Perceptible',
            },
            {
                value: '<=',
                type: 'Operator',
            },
            {
                value: 100,
                type: 'Constant',
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
        displayName: 'Opponent Y > 100',
        type: 'spacing',
    },
];
