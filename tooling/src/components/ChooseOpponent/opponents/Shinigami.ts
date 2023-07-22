import { buildAgentFromLayers } from './util';

const json = {
    _id: {
        $oid: '64b9915a1424de43e12e1551',
    },
    layers: [
        {
            conditions: [
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
                    displayName: 'My rage > 500',
                    type: 'my rage',
                    key: 1057502074,
                },
            ],
            action: {
                id: 10,
                isCombo: false,
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
                            value: 160,
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
                            value: 1190,
                            type: 'BodyState',
                        },
                        {
                            value: ')',
                            type: 'Operator',
                        },
                    ],
                    displayName: 'Opponent attacking',
                    type: 'opponent state',
                    key: 1765908831,
                },
            ],
            action: {
                id: 1,
                isCombo: false,
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
                    key: 2108950791,
                },
            ],
            action: {
                id: 7,
                isCombo: false,
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
                    key: 1131842495,
                },
            ],
            action: {
                id: 11,
                isCombo: false,
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
                    key: 501331747,
                },
            ],
            action: {
                id: 11,
                isCombo: false,
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
                    key: -1638793515,
                },
            ],
            action: {
                id: 1,
                isCombo: false,
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
                    key: -1638791592,
                },
            ],
            action: {
                id: 7,
                isCombo: false,
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
                    key: -1638788708,
                },
            ],
            action: {
                id: 7,
                isCombo: false,
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
                    key: 501331747,
                    isInverted: true,
                },
            ],
            action: {
                id: 5,
                isCombo: false,
            },
        },
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
            displayName: 'Within 80',
            type: 'spacing',
            key: 501331747,
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
            key: -1638793515,
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
            key: -1638791592,
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
            key: -1638788708,
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
            key: -1638785824,
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
            key: -1638758915,
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
                    value: 160,
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
                    value: 1190,
                    type: 'BodyState',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'Opponent attacking',
            type: 'opponent state',
            key: 1765908831,
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
            key: 1131842495,
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
            key: 2108950791,
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
            key: -1914903316,
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
            key: 239403784,
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
            key: -1297369486,
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
                    value: 110,
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
                    value: 1110,
                    type: 'BodyState',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'Opponent Dash Forward',
            type: 'opponent state',
            key: -2028083813,
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
                    value: 120,
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
                    value: 1120,
                    type: 'BodyState',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'Opponent Dash Backward',
            type: 'opponent state',
            key: 56670704,
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
                    value: '!',
                    type: 'Operator',
                },
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
            displayName: 'My rage > 500',
            type: 'my rage',
            key: 1057502074,
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
                    value: 9,
                    type: 'Perceptible',
                },
                {
                    value: '==',
                    type: 'Operator',
                },
                {
                    value: 1000,
                    type: 'Constant',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'My rage = 1000',
            type: 'my rage',
            key: 860465192,
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
            key: 1001359750,
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
            key: 1003206814,
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
                    value: 600,
                    type: 'Constant',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'My health < 600',
            type: 'my health',
            key: 1005053857,
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
                    value: 800,
                    type: 'Constant',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'My health < 800',
            type: 'my health',
            key: 1006900900,
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
            displayName: 'Opponent rage > 500',
            type: 'my rage',
            key: -2108473468,
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
                    value: 109,
                    type: 'Perceptible',
                },
                {
                    value: '==',
                    type: 'Operator',
                },
                {
                    value: 1000,
                    type: 'Constant',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'Opponent rage = 1000',
            type: 'my rage',
            key: 1499470388,
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
                    value: 100,
                    type: 'Constant',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'Opponent health < 100',
            type: 'opponent health',
            key: -665239985,
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
            key: -664316463,
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
            key: -663392941,
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
            key: -662469419,
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
            key: -661545897,
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
            displayName: 'Opponent health < 600',
            type: 'opponent health',
            key: -660622354,
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
            displayName: 'Opponent health < 700',
            type: 'opponent health',
            key: -659698832,
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
            displayName: 'Opponent health < 800',
            type: 'opponent health',
            key: -658775310,
        },
    ],
    combos: [
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
                bodyState: 40,
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
                bodyState: 40,
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
                bodyState: 40,
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
                bodyState: 40,
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
                bodyState: 110,
            },
            {
                id: 2,
                display: {
                    name: 'Upswing',
                    unicode: '🗡',
                },
                frames: {
                    duration: 8,
                    active: [3],
                    interrupts: [
                        {
                            left: [11],
                            duration: 4,
                        },
                    ],
                },
                key: 'K',
                tutorial: {
                    video: './media/tutorial/upswing.mp4',
                    description:
                        'An attack that launches the opponent into the air, giving Jessica frame advantage',
                },
                bodyState: 20,
            },
        ],
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
                bodyState: 110,
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
                    video: './media/tutorial/slash.mp4',
                    description:
                        'A medium range attack that covers a large area',
                },
                bodyState: 10,
            },
        ],
    ],
    char: 0,
    agent_name: "Hansun's Shinigami #1",
};

const { layers, char, combos } = json;
export const Shinigami = buildAgentFromLayers(layers, char, combos);
