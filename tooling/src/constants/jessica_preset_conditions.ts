import { BodystatesJessica, Condition, Perceptible } from '../types/Condition';
import { alwaysTrueCondition } from '../types/Layer';
import { Direction, Tree } from '../types/Tree';

export const jessica_opponent_preset_conditions = [
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

export const jessica_my_preset_conditions = [
    {
        elements: [
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
                value: BodystatesJessica.Slash,
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: "I'm Slash (Jessica)",
        type: 'my state',
    },
    {
        elements: [
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
                value: BodystatesJessica.Sidecut,
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: "I'm Sidecut (Jessica)",
        type: 'my state',
    },
    {
        elements: [
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
                value: BodystatesJessica.Upswing,
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: "I'm Upswing (Jessica)",
        type: 'my state',
    },
    {
        elements: [
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
                value: BodystatesJessica.BirdSwing,
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: "I'm Birdswing (Jessica)",
        type: 'my state',
    },
    {
        elements: [
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
                value: BodystatesJessica.Gatotsu,
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: "I'm Gatotsu (Jessica)",
        type: 'my state',
    },
];
