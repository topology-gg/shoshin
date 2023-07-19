import { buildAgentFromLayers } from './util';

const json = {
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
                    isInverted: true,
                },
            ],
            action: {
                id: 4,
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
                    key: -1638793513,
                },
            ],
            action: {
                id: 11,
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
                    value: 1190,
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
                    value: 1220,
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
                    value: 180,
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
                    value: 190,
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
                    value: 1200,
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
                    value: 1210,
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
                    value: 170,
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
                    value: 1170,
                    type: 'BodyState',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'Opponent launched',
            type: 'opponent state',
            key: -21288007,
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
            displayName: 'Opponent stepping forward (Antoc)',
            type: 'opponent state',
            key: -539496447,
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
            displayName: 'Opponent in Gatotsu (Jessica)',
            type: 'opponent state',
            key: -197416780,
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
                    value: 1220,
                    type: 'BodyState',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'Opponent in Cyclone (Antoc)',
            type: 'opponent state',
            key: 1735176876,
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
            displayName: 'My rage < 500',
            type: 'my rage',
            key: -717505286,
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
            displayName: 'My rage is full (1000)',
            type: 'my rage',
            key: 869500250,
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
                    value: 500,
                    type: 'Constant',
                },
                {
                    value: ')',
                    type: 'Operator',
                },
            ],
            displayName: 'Opponent rage < 500',
            type: 'opponent rage',
            key: 411486468,
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
            displayName: 'Opponent rage is full (1000)',
            type: 'opponent rage',
            key: -1386908079,
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
            key: -664316462,
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
            key: -663392940,
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
            key: -662469418,
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
            key: -661545875,
        },
    ],
    combos: [],
    char: 1,
};

const { layers, char, combos } = json;
export const AutoLowKick = buildAgentFromLayers(layers, char, combos);
