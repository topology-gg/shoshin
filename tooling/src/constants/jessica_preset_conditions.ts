import { BodystatesJessica, Condition, Perceptible } from '../types/Condition';

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
        displayName: 'Opponent Slash',
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
        displayName: 'Opponent Sidecut',
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
        displayName: 'Opponent Upswing',
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
        displayName: 'Opponent Birdswing',
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
        displayName: 'Opponent Gatotsu',
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
        displayName: "I'm Slash",
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
        displayName: "I'm Sidecut",
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
        displayName: "I'm Upswing",
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
        displayName: "I'm Birdswing",
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
        displayName: "I'm Gatotsu",
        type: 'my state',
    },
];
