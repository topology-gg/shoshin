import { Character } from '../../../constants/constants';
import { OnlineOpponent } from '../../../types/Opponent';

export const opponent0Jessica = {
    combos: [],
    mentalStatesNames: ['Start'],
    initialState: 0,
    mentalStates: [
        {
            value: 0,
            left: -1,
            right: -1,
        },
    ],
    conditionNames: [],
    conditions: [],
    actions: [0],
    character: 0,
};

const onlineOpponentIdleJessicaJSON = {
    _id: {
        $oid: '64cd0c58e673a48d7ad07d20',
    },
    agent: {
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
                ],
                action: {
                    id: 0,
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
                        icon: './images/actions/dash-forward.png',
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
                                duration: 3,
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
                        icon: './images/actions/upswing.png',
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
                            'An attack that launches the opponent into the air',
                    },
                    bodyState: 20,
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
                    {
                        value: ')',
                        type: 'Operator',
                    },
                ],
                displayName: 'Opponent rage > 500',
                type: 'opponent rage',
                key: -2108473468,
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
                displayName: 'Opponent rage = 1000',
                type: 'opponent rage',
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
                        value: 600,
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
                        value: 700,
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
                        value: 800,
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
        character: 'Jessica',
    },
    mindName: 'Idle Jessica',
    playerName: 'NonCents',
    lastRankTime: 1692114113675,
    rank: 74,
    lastAgentModified: 1692981238431,
};

const {
    conditions: layersJessica,
    combos: combosJessica,
    conditions: conditionsJessica,
} = onlineOpponentIdleJessicaJSON.agent;

export const onlineOpponentIdleJessica: OnlineOpponent = {
    agent: {
        //@ts-ignore
        layers: layersJessica,
        character: Character.Antoc,
        //@ts-ignore
        combos: combosJessica,
        //@ts-ignore
        conditions: conditionsJessica,
    },
    mindName: 'Idle Jessica',
    playerName: 'NonCents',
};

const onlineOpponentIdleAntocJson = {
    _id: {
        $oid: '64cd0c43e673a48d7ad04a7b',
    },
    agent: {
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
                            {
                                value: ')',
                                type: 'Operator',
                            },
                        ],
                        displayName: 'Opponent Block',
                        type: 'opponent state',
                        key: 1901274478,
                        isInverted: true,
                    },
                ],
                action: {
                    id: 0,
                    isCombo: false,
                },
            },
        ],
        combos: [],
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
                        value: 0,
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
                        value: 0,
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
                displayName: 'Opponent Idle',
                type: 'opponent state',
                key: 1175933535,
            },
            {
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
                    {
                        value: ')',
                        type: 'Operator',
                    },
                ],
                displayName: 'Opponent attacking',
                type: 'opponent state',
                key: 1765908832,
            },
            {
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
                    {
                        value: ')',
                        type: 'Operator',
                    },
                ],
                displayName: 'Opponent Block',
                type: 'opponent state',
                key: 1901274478,
            },
            {
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
                    {
                        value: ')',
                        type: 'Operator',
                    },
                ],
                displayName: 'Opponent jumping',
                type: 'opponent state',
                key: 2108950792,
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
                key: 767539148,
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
                key: 239403785,
            },
            {
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
                    {
                        value: ')',
                        type: 'Operator',
                    },
                ],
                displayName: 'Opponent hurt',
                type: 'opponent state',
                key: -1297369485,
            },
            {
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
                    {
                        value: ')',
                        type: 'Operator',
                    },
                ],
                displayName: 'Opponent Launched',
                type: 'opponent state',
                key: 1972176855,
            },
            {
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
                    {
                        value: ')',
                        type: 'Operator',
                    },
                ],
                displayName: 'Opponent DashForward',
                type: 'opponent state',
                key: 227564211,
            },
            {
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
                    {
                        value: ')',
                        type: 'Operator',
                    },
                ],
                displayName: 'Opponent DashBackward',
                type: 'opponent state',
                key: 1262282652,
            },
            {
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
                    {
                        value: ')',
                        type: 'Operator',
                    },
                ],
                displayName: 'Opponent Knocked',
                type: 'opponent state',
                key: -1055854891,
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
                ],
                displayName: 'Opponent Slash (Jessica)',
                type: 'opponent state',
                key: 424909029,
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
                        value: 30,
                        type: 'BodyState',
                    },
                    {
                        value: ')',
                        type: 'Operator',
                    },
                ],
                displayName: 'Opponent Sidecut (Jessica)',
                type: 'opponent state',
                key: -497559372,
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
                        value: 20,
                        type: 'BodyState',
                    },
                    {
                        value: ')',
                        type: 'Operator',
                    },
                ],
                displayName: 'Opponent Upswing (Jessica)',
                type: 'opponent state',
                key: 1162611821,
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
                        value: 160,
                        type: 'BodyState',
                    },
                    {
                        value: ')',
                        type: 'Operator',
                    },
                ],
                displayName: 'Opponent Birdswing (Jessica)',
                type: 'opponent state',
                key: 981072613,
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
                displayName: 'Opponent Gatotsu (Jessica)',
                type: 'opponent state',
                key: 376848162,
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
                        value: 1010,
                        type: 'BodyState',
                    },
                    {
                        value: ')',
                        type: 'Operator',
                    },
                ],
                displayName: 'Opponent Hori (Antoc)',
                type: 'opponent state',
                key: -998406761,
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
                        value: 1020,
                        type: 'BodyState',
                    },
                    {
                        value: ')',
                        type: 'Operator',
                    },
                ],
                displayName: 'Opponent Vert (Antoc)',
                type: 'opponent state',
                key: 861141387,
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
                        value: 1190,
                        type: 'BodyState',
                    },
                    {
                        value: ')',
                        type: 'Operator',
                    },
                ],
                displayName: 'Opponent DropSlash (Antoc)',
                type: 'opponent state',
                key: -1255039101,
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
                displayName: 'Opponent Cyclone (Antoc)',
                type: 'opponent state',
                key: -1164780963,
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
                displayName: 'Opponent StepForward (Antoc)',
                type: 'opponent state',
                key: -957933296,
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
                    {
                        value: ')',
                        type: 'Operator',
                    },
                ],
                displayName: 'My rage > 500',
                type: 'my rage',
                key: 1057502105,
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
                displayName: 'My rage = 1000',
                type: 'my rage',
                key: 860465223,
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
                key: 1001359781,
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
                key: 1003206845,
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
                key: 1005053888,
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
                key: 1006900931,
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
                    {
                        value: ')',
                        type: 'Operator',
                    },
                ],
                displayName: 'Opponent rage > 500',
                type: 'opponent rage',
                key: -2108473437,
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
                displayName: 'Opponent rage = 1000',
                type: 'opponent rage',
                key: 1499470419,
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
                key: -665239954,
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
                key: -664316432,
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
                key: -663392910,
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
                key: -662469388,
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
                key: -661545866,
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
                        value: 600,
                        type: 'Constant',
                    },
                    {
                        value: ')',
                        type: 'Operator',
                    },
                ],
                displayName: 'Opponent health < 600',
                type: 'opponent health',
                key: -660622323,
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
                        value: 700,
                        type: 'Constant',
                    },
                    {
                        value: ')',
                        type: 'Operator',
                    },
                ],
                displayName: 'Opponent health < 700',
                type: 'opponent health',
                key: -659698801,
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
                        value: 800,
                        type: 'Constant',
                    },
                    {
                        value: ')',
                        type: 'Operator',
                    },
                ],
                displayName: 'Opponent health < 800',
                type: 'opponent health',
                key: -658775279,
            },
        ],
        character: 'Antoc',
    },
    mindName: 'Idle Antoc',
    playerName: 'NonCents',
};

const { layers, combos, conditions } = onlineOpponentIdleAntocJson.agent;

export const onlineOpponentIdleAntoc: OnlineOpponent = {
    agent: {
        //@ts-ignore
        layers,
        character: Character.Antoc,
        //@ts-ignore
        combos,
        //@ts-ignore
        conditions,
    },
    mindName: 'Idle Antoc',
    playerName: 'NonCents',
};

export const opponent0Antoc = {
    combos: [],
    mentalStatesNames: ['Start'],
    initialState: 0,
    mentalStates: [
        {
            value: 0,
            left: -1,
            right: -1,
        },
    ],
    conditionNames: [],
    conditions: [],
    actions: [0],
    character: 1,
};
