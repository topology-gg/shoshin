import { BodystatesJessica, Condition, Perceptible } from '../types/Condition';
import { alwaysTrueCondition } from '../types/Layer';
import { Direction, Tree } from '../types/Tree';

export const jessica_preset_conditions = [
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: Perceptible.OpponentBodyState,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: BodystatesJessica.Slash,
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'Opponent Slash (Jessica)',
        type: 'opponent state',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: Perceptible.OpponentBodyState,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: BodystatesJessica.Sidecut,
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'Opponent Sidecut (Jessica)',
        type: 'opponent state',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: Perceptible.OpponentBodyState,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: BodystatesJessica.Upswing,
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'Opponent Upswing (Jessica)',
        type: 'opponent state',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: Perceptible.OpponentBodyState,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: BodystatesJessica.BirdSwing,
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'Opponent Birdswing (Jessica)',
        type: 'opponent state',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: Perceptible.OpponentBodyState,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: BodystatesJessica.Gatotsu,
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'Opponent Gatotsu (Jessica)',
        type: 'opponent state',
    },
];
