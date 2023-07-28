import { buildAgentFromLayers } from './util';

const json = {
    _id: {
        $oid: '64add9ce1ccd8d8c1ca33c78',
    },
    agent_name: 'eve',
    char: 0,
    layers: [
        {
            conditions: [
                {
                    elements: [
                        {
                            value: '(',
                            type: 'Operator',
                        },
                        {
                            value: 'Abs(',
                            type: 'Operator',
                        },
                        {
                            value: '(',
                            type: 'Operator',
                        },
                        {
                            value: 1,
                            type: 'Perceptible',
                        },
                        {
                            value: '-',
                            type: 'Operator',
                        },
                        {
                            value: 101,
                            type: 'Perceptible',
                        },
                        {
                            value: ')',
                            type: 'Operator',
                        },
                        {
                            value: '|',
                            type: 'Operator',
                        },
                        {
                            value: '<=',
                            type: 'Operator',
                        },
                        {
                            value: 150,
                            type: 'Constant',
                        },
                        {
                            value: ')',
                            type: 'Operator',
                        },
                    ],
                    displayName: 'Within 150',
                    type: 'spacing',
                    key: -1638788706,
                    isInverted: true,
                },
            ],
            action: {
                id: 101,
                isCombo: true,
            },
        },
        {
            conditions: [
                {
                    elements: [
                        {
                            value: '(',
                            type: 'Operator',
                        },
                        {
                            value: 110,
                            type: 'Perceptible',
                        },
                        {
                            value: '==',
                            type: 'Operator',
                        },
                        {
                            value: 10,
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
                            value: 110,
                            type: 'Perceptible',
                        },
                        {
                            value: '==',
                            type: 'Operator',
                        },
                        {
                            value: 20,
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
                            value: 110,
                            type: 'Perceptible',
                        },
                        {
                            value: '==',
                            type: 'Operator',
                        },
                        {
                            value: 30,
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
                            value: 110,
                            type: 'Perceptible',
                        },
                        {
                            value: '==',
                            type: 'Operator',
                        },
                        {
                            value: 1010,
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
                            value: 110,
                            type: 'Perceptible',
                        },
                        {
                            value: '==',
                            type: 'Operator',
                        },
                        {
                            value: 1020,
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
                            value: 110,
                            type: 'Perceptible',
                        },
                        {
                            value: '==',
                            type: 'Operator',
                        },
                        {
                            value: 140,
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
                            value: 110,
                            type: 'Perceptible',
                        },
                        {
                            value: '==',
                            type: 'Operator',
                        },
                        {
                            value: 150,
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
                            value: 110,
                            type: 'Perceptible',
                        },
                        {
                            value: '==',
                            type: 'Operator',
                        },
                        {
                            value: 1160,
                            type: 'BodyState',
                        },
                        {
                            value: ')',
                            type: 'Operator',
                        },
                    ],
                    displayName: 'Opponent attacking',
                    type: 'opponent state',
                    key: 1765908833,
                    isInverted: true,
                },
                {
                    elements: [
                        {
                            value: '(',
                            type: 'Operator',
                        },
                        {
                            value: 110,
                            type: 'Perceptible',
                        },
                        {
                            value: '==',
                            type: 'Operator',
                        },
                        {
                            value: 40,
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
                            value: 110,
                            type: 'Perceptible',
                        },
                        {
                            value: '==',
                            type: 'Operator',
                        },
                        {
                            value: 1040,
                            type: 'BodyState',
                        },
                        {
                            value: ')',
                            type: 'Operator',
                        },
                    ],
                    displayName: 'Opponent blocking',
                    type: 'opponent state',
                    key: 1131842497,
                    isInverted: true,
                },
            ],
            action: {
                id: 102,
                isCombo: true,
            },
        },
        {
            conditions: [
                {
                    elements: [
                        {
                            value: '(',
                            type: 'Operator',
                        },
                        {
                            value: 9,
                            type: 'Perceptible',
                        },
                        {
                            value: '<=',
                            type: 'Operator',
                        },
                        {
                            value: 500,
                            type: 'Constant',
                        },
                        {
                            value: ')',
                            type: 'Operator',
                        },
                    ],
                    displayName: 'My stamina < 500',
                    type: 'my stamina',
                    key: -1581146614,
                    isInverted: true,
                },
            ],
            action: {
                id: 10,
                isCombo: false,
            },
        },
    ],
    combos: [
        [
            {
                id: 7,
                display: {
                    name: 'DashForward',
                    unicode: '🐆',
                },
                frames: {
                    duration: 4,
                    interrupts: [
                        {
                            right: [1],
                            duration: 2,
                        },
                        {
                            right: [2],
                            duration: 2,
                        },
                        {
                            right: [3],
                            duration: 2,
                        },
                        {
                            right: [9],
                            duration: 2,
                        },
                    ],
                },
                key: 'E',
            },
            {
                id: 1,
                display: {
                    name: 'Slash',
                    unicode: '🗡',
                },
                frames: {
                    duration: 5,
                    active: [3],
                },
                key: 'J',
                tutorial: {
                    video: './media/fight-intro.mp4',
                    description:
                        'A medium range attack that covers a large area',
                },
            },
        ],
        [
            {
                id: 4,
                display: {
                    name: 'Block',
                    unicode: '🛡',
                },
                frames: {
                    duration: 2,
                    active: [2],
                    intents: [4, 0],
                    interrupts: [
                        {
                            left: [4],
                            right: [4],
                            duration: 1,
                            intents: [4],
                        },
                        {
                            right: [4],
                            duration: 2,
                            intents: [4],
                        },
                        {
                            left: [4],
                            duration: 1,
                            intents: [4, 0],
                        },
                    ],
                },
                key: 'S',
            },
            {
                id: 4,
                display: {
                    name: 'Block',
                    unicode: '🛡',
                },
                frames: {
                    duration: 2,
                    active: [2],
                    intents: [4, 0],
                    interrupts: [
                        {
                            left: [4],
                            right: [4],
                            duration: 1,
                            intents: [4],
                        },
                        {
                            right: [4],
                            duration: 2,
                            intents: [4],
                        },
                        {
                            left: [4],
                            duration: 1,
                            intents: [4, 0],
                        },
                    ],
                },
                key: 'S',
            },
            {
                id: 4,
                display: {
                    name: 'Block',
                    unicode: '🛡',
                },
                frames: {
                    duration: 2,
                    active: [2],
                    intents: [4, 0],
                    interrupts: [
                        {
                            left: [4],
                            right: [4],
                            duration: 1,
                            intents: [4],
                        },
                        {
                            right: [4],
                            duration: 2,
                            intents: [4],
                        },
                        {
                            left: [4],
                            duration: 1,
                            intents: [4, 0],
                        },
                    ],
                },
                key: 'S',
            },
            {
                id: 4,
                display: {
                    name: 'Block',
                    unicode: '🛡',
                },
                frames: {
                    duration: 2,
                    active: [2],
                    intents: [4, 0],
                    interrupts: [
                        {
                            left: [4],
                            right: [4],
                            duration: 1,
                            intents: [4],
                        },
                        {
                            right: [4],
                            duration: 2,
                            intents: [4],
                        },
                        {
                            left: [4],
                            duration: 1,
                            intents: [4, 0],
                        },
                    ],
                },
                key: 'S',
            },
            {
                id: 4,
                display: {
                    name: 'Block',
                    unicode: '🛡',
                },
                frames: {
                    duration: 2,
                    active: [2],
                    intents: [4, 0],
                    interrupts: [
                        {
                            left: [4],
                            right: [4],
                            duration: 1,
                            intents: [4],
                        },
                        {
                            right: [4],
                            duration: 2,
                            intents: [4],
                        },
                        {
                            left: [4],
                            duration: 1,
                            intents: [4, 0],
                        },
                    ],
                },
                key: 'S',
            },
            {
                id: 7,
                display: {
                    name: 'DashForward',
                    unicode: '🐆',
                },
                frames: {
                    duration: 4,
                    interrupts: [
                        {
                            right: [1],
                            duration: 2,
                        },
                        {
                            right: [2],
                            duration: 2,
                        },
                        {
                            right: [3],
                            duration: 2,
                        },
                        {
                            right: [9],
                            duration: 2,
                        },
                    ],
                },
                key: 'E',
            },
            {
                id: 1,
                display: {
                    name: 'Slash',
                    unicode: '🗡',
                },
                frames: {
                    duration: 5,
                    active: [3],
                },
                key: 'J',
                tutorial: {
                    video: './media/fight-intro.mp4',
                    description:
                        'A medium range attack that covers a large area',
                },
            },
        ],
    ],
    conditions: [
        {
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
        },
        {
            elements: [
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 'Abs(',
                    type: 'Operator',
                },
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 1,
                    type: 'Perceptible',
                },
                {
                    value: '-',
                    type: 'Operator',
                },
                {
                    value: 101,
                    type: 'Perceptible',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
                {
                    value: '|',
                    type: 'Operator',
                },
                {
                    value: '<=',
                    type: 'Operator',
                },
                {
                    value: 80,
                    type: 'Constant',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'Close',
            type: 'spacing',
            key: 2021313880,
        },
        {
            elements: [
                {
                    value: '!',
                    type: 'Operator',
                },
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 'Abs(',
                    type: 'Operator',
                },
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 1,
                    type: 'Perceptible',
                },
                {
                    value: '-',
                    type: 'Operator',
                },
                {
                    value: 101,
                    type: 'Perceptible',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
                {
                    value: '|',
                    type: 'Operator',
                },
                {
                    value: '<=',
                    type: 'Operator',
                },
                {
                    value: 300,
                    type: 'Constant',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'Far',
            type: 'spacing',
            key: 2182170,
        },
        {
            elements: [
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 'Abs(',
                    type: 'Operator',
                },
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 1,
                    type: 'Perceptible',
                },
                {
                    value: '-',
                    type: 'Operator',
                },
                {
                    value: 101,
                    type: 'Perceptible',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
                {
                    value: '|',
                    type: 'Operator',
                },
                {
                    value: '<=',
                    type: 'Operator',
                },
                {
                    value: 80,
                    type: 'Constant',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'Within 80',
            type: 'spacing',
            key: 501331749,
        },
        {
            elements: [
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 'Abs(',
                    type: 'Operator',
                },
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 1,
                    type: 'Perceptible',
                },
                {
                    value: '-',
                    type: 'Operator',
                },
                {
                    value: 101,
                    type: 'Perceptible',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
                {
                    value: '|',
                    type: 'Operator',
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
            ],
            displayName: 'Within 100',
            type: 'spacing',
            key: -1638793513,
        },
        {
            elements: [
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 'Abs(',
                    type: 'Operator',
                },
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 1,
                    type: 'Perceptible',
                },
                {
                    value: '-',
                    type: 'Operator',
                },
                {
                    value: 101,
                    type: 'Perceptible',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
                {
                    value: '|',
                    type: 'Operator',
                },
                {
                    value: '<=',
                    type: 'Operator',
                },
                {
                    value: 120,
                    type: 'Constant',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'Within 120',
            type: 'spacing',
            key: -1638791590,
        },
        {
            elements: [
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 'Abs(',
                    type: 'Operator',
                },
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 1,
                    type: 'Perceptible',
                },
                {
                    value: '-',
                    type: 'Operator',
                },
                {
                    value: 101,
                    type: 'Perceptible',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
                {
                    value: '|',
                    type: 'Operator',
                },
                {
                    value: '<=',
                    type: 'Operator',
                },
                {
                    value: 150,
                    type: 'Constant',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'Within 150',
            type: 'spacing',
            key: -1638788706,
        },
        {
            elements: [
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 'Abs(',
                    type: 'Operator',
                },
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 1,
                    type: 'Perceptible',
                },
                {
                    value: '-',
                    type: 'Operator',
                },
                {
                    value: 101,
                    type: 'Perceptible',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
                {
                    value: '|',
                    type: 'Operator',
                },
                {
                    value: '<=',
                    type: 'Operator',
                },
                {
                    value: 180,
                    type: 'Constant',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'Within 180',
            type: 'spacing',
            key: -1638785822,
        },
        {
            elements: [
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 'Abs(',
                    type: 'Operator',
                },
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 1,
                    type: 'Perceptible',
                },
                {
                    value: '-',
                    type: 'Operator',
                },
                {
                    value: 101,
                    type: 'Perceptible',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
                {
                    value: '|',
                    type: 'Operator',
                },
                {
                    value: '<=',
                    type: 'Operator',
                },
                {
                    value: 250,
                    type: 'Constant',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'Within 250',
            type: 'spacing',
            key: -1638758913,
        },
        {
            elements: [
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 110,
                    type: 'Perceptible',
                },
                {
                    value: '==',
                    type: 'Operator',
                },
                {
                    value: 10,
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
                    value: 110,
                    type: 'Perceptible',
                },
                {
                    value: '==',
                    type: 'Operator',
                },
                {
                    value: 20,
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
                    value: 110,
                    type: 'Perceptible',
                },
                {
                    value: '==',
                    type: 'Operator',
                },
                {
                    value: 30,
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
                    value: 110,
                    type: 'Perceptible',
                },
                {
                    value: '==',
                    type: 'Operator',
                },
                {
                    value: 1010,
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
                    value: 110,
                    type: 'Perceptible',
                },
                {
                    value: '==',
                    type: 'Operator',
                },
                {
                    value: 1020,
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
                    value: 110,
                    type: 'Perceptible',
                },
                {
                    value: '==',
                    type: 'Operator',
                },
                {
                    value: 140,
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
                    value: 110,
                    type: 'Perceptible',
                },
                {
                    value: '==',
                    type: 'Operator',
                },
                {
                    value: 150,
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
                    value: 110,
                    type: 'Perceptible',
                },
                {
                    value: '==',
                    type: 'Operator',
                },
                {
                    value: 1160,
                    type: 'BodyState',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'Opponent attacking',
            type: 'opponent state',
            key: 1765908833,
        },
        {
            elements: [
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 110,
                    type: 'Perceptible',
                },
                {
                    value: '==',
                    type: 'Operator',
                },
                {
                    value: 40,
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
                    value: 110,
                    type: 'Perceptible',
                },
                {
                    value: '==',
                    type: 'Operator',
                },
                {
                    value: 1040,
                    type: 'BodyState',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'Opponent blocking',
            type: 'opponent state',
            key: 1131842497,
        },
        {
            elements: [
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 110,
                    type: 'Perceptible',
                },
                {
                    value: '==',
                    type: 'Operator',
                },
                {
                    value: 130,
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
                    value: 110,
                    type: 'Perceptible',
                },
                {
                    value: '==',
                    type: 'Operator',
                },
                {
                    value: 1150,
                    type: 'BodyState',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'Opponent jumping',
            type: 'opponent state',
            key: 952964912,
        },
        {
            elements: [
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 110,
                    type: 'Perceptible',
                },
                {
                    value: '==',
                    type: 'Operator',
                },
                {
                    value: 150,
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
                    value: 110,
                    type: 'Perceptible',
                },
                {
                    value: '==',
                    type: 'Operator',
                },
                {
                    value: 1160,
                    type: 'BodyState',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'Opponent low kicking',
            type: 'opponent state',
            key: 767539149,
        },
        {
            elements: [
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 110,
                    type: 'Perceptible',
                },
                {
                    value: '==',
                    type: 'Operator',
                },
                {
                    value: 50,
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
                    value: 110,
                    type: 'Perceptible',
                },
                {
                    value: '==',
                    type: 'Operator',
                },
                {
                    value: 1130,
                    type: 'BodyState',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'Opponent clashed',
            type: 'opponent state',
            key: 239403786,
        },
        {
            elements: [
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 110,
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
                {
                    value: 'OR',
                    type: 'Operator',
                },
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 110,
                    type: 'Perceptible',
                },
                {
                    value: '==',
                    type: 'Operator',
                },
                {
                    value: 1050,
                    type: 'BodyState',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'Opponent hurt',
            type: 'opponent state',
            key: -1297369484,
        },
        {
            elements: [
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 110,
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
                    value: 110,
                    type: 'Perceptible',
                },
                {
                    value: '==',
                    type: 'Operator',
                },
                {
                    value: 1060,
                    type: 'BodyState',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'Opponent knocked',
            type: 'opponent state',
            key: 1235144435,
        },
        {
            elements: [
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 110,
                    type: 'Perceptible',
                },
                {
                    value: '==',
                    type: 'Operator',
                },
                {
                    value: 1140,
                    type: 'BodyState',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'Opponent steping forward (Antoc)',
            type: 'opponent state',
            key: 289103858,
        },
        {
            elements: [
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 110,
                    type: 'Perceptible',
                },
                {
                    value: '==',
                    type: 'Operator',
                },
                {
                    value: 140,
                    type: 'BodyState',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'Opponent in gatotsu (Jessica)',
            type: 'opponent state',
            key: -1450712877,
        },
        {
            elements: [
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 9,
                    type: 'Perceptible',
                },
                {
                    value: '<=',
                    type: 'Operator',
                },
                {
                    value: 200,
                    type: 'Constant',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'My stamina < 200',
            type: 'my stamina',
            key: -1583917201,
        },
        {
            elements: [
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 9,
                    type: 'Perceptible',
                },
                {
                    value: '<=',
                    type: 'Operator',
                },
                {
                    value: 300,
                    type: 'Constant',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'My stamina < 300',
            type: 'my stamina',
            key: -1582993679,
        },
        {
            elements: [
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 9,
                    type: 'Perceptible',
                },
                {
                    value: '<=',
                    type: 'Operator',
                },
                {
                    value: 400,
                    type: 'Constant',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'My stamina < 400',
            type: 'my stamina',
            key: -1582070157,
        },
        {
            elements: [
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 9,
                    type: 'Perceptible',
                },
                {
                    value: '<=',
                    type: 'Operator',
                },
                {
                    value: 500,
                    type: 'Constant',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'My stamina < 500',
            type: 'my stamina',
            key: -1581146614,
        },
        {
            elements: [
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 8,
                    type: 'Perceptible',
                },
                {
                    value: '<=',
                    type: 'Operator',
                },
                {
                    value: 200,
                    type: 'Constant',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'My health < 200',
            type: 'my health',
            key: 1001359773,
        },
        {
            elements: [
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 8,
                    type: 'Perceptible',
                },
                {
                    value: '<=',
                    type: 'Operator',
                },
                {
                    value: 300,
                    type: 'Constant',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'My health < 300',
            type: 'my health',
            key: 1002283295,
        },
        {
            elements: [
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 8,
                    type: 'Perceptible',
                },
                {
                    value: '<=',
                    type: 'Operator',
                },
                {
                    value: 400,
                    type: 'Constant',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'My health < 400',
            type: 'my health',
            key: 1003206817,
        },
        {
            elements: [
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 8,
                    type: 'Perceptible',
                },
                {
                    value: '<=',
                    type: 'Operator',
                },
                {
                    value: 500,
                    type: 'Constant',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'My health < 500',
            type: 'my health',
            key: 1004130339,
        },
        {
            elements: [
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 109,
                    type: 'Perceptible',
                },
                {
                    value: '<=',
                    type: 'Operator',
                },
                {
                    value: 200,
                    type: 'Constant',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'Opponent stamina < 200',
            type: 'opponent stamina',
            key: -1680273091,
        },
        {
            elements: [
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 109,
                    type: 'Perceptible',
                },
                {
                    value: '<=',
                    type: 'Operator',
                },
                {
                    value: 300,
                    type: 'Constant',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'Opponent stamina < 300',
            type: 'opponent stamina',
            key: -1679349569,
        },
        {
            elements: [
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 109,
                    type: 'Perceptible',
                },
                {
                    value: '<=',
                    type: 'Operator',
                },
                {
                    value: 400,
                    type: 'Constant',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'Opponent stamina < 400',
            type: 'opponent stamina',
            key: -1678426047,
        },
        {
            elements: [
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 109,
                    type: 'Perceptible',
                },
                {
                    value: '<=',
                    type: 'Operator',
                },
                {
                    value: 500,
                    type: 'Constant',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'Opponent stamina < 500',
            type: 'opponent stamina',
            key: -1677502525,
        },
        {
            elements: [
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 108,
                    type: 'Perceptible',
                },
                {
                    value: '<=',
                    type: 'Operator',
                },
                {
                    value: 200,
                    type: 'Constant',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'Opponent health < 200',
            type: 'opponent health',
            key: -664316460,
        },
        {
            elements: [
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 108,
                    type: 'Perceptible',
                },
                {
                    value: '<=',
                    type: 'Operator',
                },
                {
                    value: 300,
                    type: 'Constant',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'Opponent health < 300',
            type: 'opponent health',
            key: -663392917,
        },
        {
            elements: [
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 108,
                    type: 'Perceptible',
                },
                {
                    value: '<=',
                    type: 'Operator',
                },
                {
                    value: 400,
                    type: 'Constant',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'Opponent health < 400',
            type: 'opponent health',
            key: -662469395,
        },
        {
            elements: [
                {
                    value: '(',
                    type: 'Operator',
                },
                {
                    value: 108,
                    type: 'Perceptible',
                },
                {
                    value: '<=',
                    type: 'Operator',
                },
                {
                    value: 500,
                    type: 'Constant',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'Opponent health < 500',
            type: 'opponent health',
            key: -661545873,
        },
    ],
};
const { layers, char, combos } = json;
//@ts-ignore
export const Eve = buildAgentFromLayers(layers, char, combos);
