import { buildAgentFromLayers } from '../components/ChooseOpponent/opponents/util';
import Agent, { buildAgent } from '../types/Agent';
import {
    BodystatesAntoc,
    BodystatesJessica,
    Condition,
    Perceptible,
} from '../types/Condition';
import { alwaysTrueCondition } from '../types/Layer';
import { Direction, Tree } from '../types/Tree';
import {
    antoc_opponent_preset_conditions,
    antoc_my_preset_conditions,
} from './antoc_preset_conditions';
import {
    jessica_opponent_preset_conditions,
    jessica_my_preset_conditions,
} from './jessica_preset_conditions';
import { ANTOC, JESSICA } from './constants';
import { my_frame_preset_conditions } from './my_frame_preset_conditions';
import { opponent_frame_preset_conditions } from './opponent_frame_preset_conditions';
import { spacing_preset_conditions } from './spacing_preset_conditions';
import { y_position_preset_conditions } from './y_position_preset_conditions';
import { simpleHash } from '../types/utils';

const common_my_stats_preset_conditions = [
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
                value: Perceptible.SelfSta,
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
        displayName: 'My Rage > 500',
        type: 'my rage',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: Perceptible.SelfSta,
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
        displayName: 'My Rage = 1000',
        type: 'my rage',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: Perceptible.SelfInt,
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
        displayName: 'My Health < 200',
        type: 'my health',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: Perceptible.SelfInt,
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
        displayName: 'My Health < 400',
        type: 'my health',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: Perceptible.SelfInt,
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
        displayName: 'My Health < 600',
        type: 'my health',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: Perceptible.SelfInt,
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
        displayName: 'My Health < 800',
        type: 'my health',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: Perceptible.SelfInt,
                type: 'Perceptible',
            },
            {
                value: '<=',
                type: 'Operator',
            },
            {
                value: 900,
                type: 'Constant',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'My health < X',
        type: 'my health',
    },
];

const common_opponent_stats_preset_conditions = [
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
                value: Perceptible.OpponentSta,
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
        displayName: 'Opponent Rage > 500',
        type: 'opponent rage',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: Perceptible.OpponentSta,
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
        displayName: 'Opponent Rage = 1000',
        type: 'opponent rage',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: Perceptible.OpponentInt,
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
        displayName: 'Opponent Health < 100',
        type: 'opponent health',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: Perceptible.OpponentInt,
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
        displayName: 'Opponent Health < 200',
        type: 'opponent health',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: Perceptible.OpponentInt,
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
        displayName: 'Opponent Health < 300',
        type: 'opponent health',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: Perceptible.OpponentInt,
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
        displayName: 'Opponent Health < 400',
        type: 'opponent health',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: Perceptible.OpponentInt,
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
        displayName: 'Opponent Health < 500',
        type: 'opponent health',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: Perceptible.OpponentInt,
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
        displayName: 'Opponent Health < 600',
        type: 'opponent health',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: Perceptible.OpponentInt,
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
        displayName: 'Opponent Health < 700',
        type: 'opponent health',
    },
    {
        elements: [
            {
                value: '(',
                type: 'Operator',
            },
            {
                value: Perceptible.OpponentInt,
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
        displayName: 'Opponent Health < 800',
        type: 'opponent health',
    },
];

const common_opponent_body_state_preset_conditions = [
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
                // note: BodystatesJessica.Idle and BodystatesAntoc.Idle are both 0
                value: BodystatesJessica.Idle,
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'Opponent Idle',
        type: 'opponent state',
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
            {
                value: 'OR',
                type: 'Operator',
            },
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
            {
                value: 'OR',
                type: 'Operator',
            },
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
            {
                value: 'OR',
                type: 'Operator',
            },
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
                value: BodystatesAntoc.HorizontalSwing,
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
                value: Perceptible.OpponentBodyState,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: BodystatesAntoc.VerticalSwing,
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
            {
                value: 'OR',
                type: 'Operator',
            },
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
                value: BodystatesJessica.LowKick,
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
                value: Perceptible.OpponentBodyState,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: BodystatesAntoc.LowKick,
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
            {
                value: 'OR',
                type: 'Operator',
            },
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
                value: BodystatesAntoc.DropSlash,
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
                value: Perceptible.OpponentBodyState,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: BodystatesAntoc.Cyclone,
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
        displayName: 'Opponent Attacking',
        type: 'opponent state',
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
                value: Perceptible.OpponentBodyState,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: BodystatesJessica.MoveForward,
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
                value: Perceptible.OpponentBodyState,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: BodystatesAntoc.MoveForward,
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
        displayName: 'Opponent Moving Forward',
        type: 'opponent state',
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
                value: Perceptible.OpponentBodyState,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: BodystatesJessica.MoveBackward,
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
                value: Perceptible.OpponentBodyState,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: BodystatesAntoc.MoveBackward,
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
        displayName: 'Opponent Moving Backward',
        type: 'opponent state',
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
                value: Perceptible.OpponentBodyState,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: BodystatesJessica.Block,
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
                value: Perceptible.OpponentBodyState,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: BodystatesAntoc.Block,
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
                value: Perceptible.OpponentBodyState,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: BodystatesJessica.Jump,
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
                value: Perceptible.OpponentBodyState,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: BodystatesJessica.JumpMoveForward,
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
                value: Perceptible.OpponentBodyState,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: BodystatesJessica.JumpMoveBackward,
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
                value: Perceptible.OpponentBodyState,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: BodystatesAntoc.Jump,
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
                value: Perceptible.OpponentBodyState,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: BodystatesAntoc.JumpMoveForward,
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
                value: Perceptible.OpponentBodyState,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: BodystatesAntoc.JumpMoveBackward,
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
        displayName: 'Opponent Jumping',
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
                value: Perceptible.OpponentBodyState,
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
        displayName: 'Opponent LowKicking',
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
                value: BodystatesJessica.Clash,
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
                value: Perceptible.OpponentBodyState,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: BodystatesAntoc.Clash,
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: 'Opponent Clashed',
        type: 'opponent state',
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
                value: Perceptible.OpponentBodyState,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: BodystatesJessica.Hurt,
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
                value: Perceptible.OpponentBodyState,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: BodystatesAntoc.Hurt,
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
        displayName: 'Opponent Hurt',
        type: 'opponent state',
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
                value: Perceptible.OpponentBodyState,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: BodystatesJessica.Launched,
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
                value: Perceptible.OpponentBodyState,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: BodystatesAntoc.Launched,
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
                value: Perceptible.OpponentBodyState,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: BodystatesJessica.DashForward,
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
                value: Perceptible.OpponentBodyState,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: BodystatesAntoc.DashForward,
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
                value: Perceptible.OpponentBodyState,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: BodystatesJessica.DashBackward,
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
                value: Perceptible.OpponentBodyState,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: BodystatesAntoc.DashBackward,
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
                value: Perceptible.OpponentBodyState,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: BodystatesJessica.Knocked,
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
                value: Perceptible.OpponentBodyState,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: BodystatesAntoc.Knocked,
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
    },
];

const common_my_body_state_preset_conditions = [
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
                // note: BodystatesJessica.Idle and BodystatesAntoc.Idle are both 0
                value: BodystatesJessica.Idle,
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: "I'm Idle",
        type: 'my state',
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
                value: Perceptible.SelfBodyState,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: BodystatesJessica.Block,
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
                value: BodystatesAntoc.Block,
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
        displayName: "I'm Blocking",
        type: 'my state',
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
                value: Perceptible.SelfBodyState,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: BodystatesJessica.Jump,
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
                value: BodystatesJessica.JumpMoveForward,
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
                value: BodystatesJessica.JumpMoveBackward,
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
                value: BodystatesAntoc.Jump,
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
                value: BodystatesAntoc.JumpMoveForward,
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
                value: BodystatesAntoc.JumpMoveBackward,
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
        displayName: "I'm Jumping",
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
                value: BodystatesJessica.Clash,
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
                value: BodystatesAntoc.Clash,
                type: 'BodyState',
            },
            {
                value: ')',
                type: 'Operator',
            },
        ],
        displayName: "I'm Clashed",
        type: 'my state',
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
                value: Perceptible.SelfBodyState,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: BodystatesJessica.Hurt,
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
                value: BodystatesAntoc.Hurt,
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
        displayName: "I'm Hurt",
        type: 'my state',
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
                value: Perceptible.SelfBodyState,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: BodystatesJessica.Launched,
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
                value: BodystatesAntoc.Launched,
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
        displayName: "I'm Launched",
        type: 'my state',
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
                value: Perceptible.SelfBodyState,
                type: 'Perceptible',
            },
            {
                value: '==',
                type: 'Operator',
            },
            {
                value: BodystatesJessica.Knocked,
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
                value: BodystatesAntoc.Knocked,
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
        displayName: "I'm Knocked",
        type: 'my state',
    },
];

// spacing
let preset_conditions = spacing_preset_conditions;
preset_conditions = preset_conditions.concat(y_position_preset_conditions);

// opponent
preset_conditions = preset_conditions.concat(
    common_opponent_body_state_preset_conditions
);
preset_conditions = preset_conditions.concat(
    jessica_opponent_preset_conditions
);
preset_conditions = preset_conditions.concat(antoc_opponent_preset_conditions);
preset_conditions = preset_conditions.concat(opponent_frame_preset_conditions);
preset_conditions = preset_conditions.concat(
    common_opponent_stats_preset_conditions
);

// mine
preset_conditions = preset_conditions.concat(
    common_my_body_state_preset_conditions
);
preset_conditions = preset_conditions.concat(jessica_my_preset_conditions);
preset_conditions = preset_conditions.concat(antoc_my_preset_conditions);
preset_conditions = preset_conditions.concat(my_frame_preset_conditions);
preset_conditions = preset_conditions.concat(common_my_stats_preset_conditions);

preset_conditions = preset_conditions.map((condition, i) => ({
    ...condition,
    key: simpleHash(condition.displayName + i),
}));

const conditions: Condition[] = [alwaysTrueCondition as Condition].concat(
    preset_conditions as Condition[]
);

//
// Build an empty Jessica agent and an empty Antoc agent here
//
export const EMPTY_JESSICA = buildAgentFromLayers([], JESSICA, []);
export const EMPTY_ANTOC = buildAgentFromLayers([], ANTOC, []);

const trees: Tree[] = [
    {
        nodes: [
            {
                id: '0',
                isChild: false,
            },
            {
                id: 'Attack',
                isChild: true,
                branch: Direction.Left,
            },
            {
                id: 'Start',
                isChild: true,
                branch: Direction.Right,
            },
        ],
    },
    {
        nodes: [
            {
                id: '2',
                isChild: false,
            },
            {
                id: 'Defend',
                isChild: true,
                branch: Direction.Left,
            },
            {
                id: 'Attack',
                isChild: true,
                branch: Direction.Right,
            },
        ],
    },
    {
        nodes: [
            {
                id: '6',
                isChild: false,
            },
            {
                id: 'Defend',
                isChild: true,
                branch: Direction.Left,
            },
            {
                id: 'Attack',
                isChild: true,
                branch: Direction.Right,
            },
        ],
    },

    {
        nodes: [
            {
                id: '0',
                isChild: false,
            },
            {
                id: 'Ignore',
                isChild: true,
                branch: Direction.Left,
            },
            {
                id: '1',
                isChild: false,
            },
            {
                id: 'Ignore',
                isChild: true,
                branch: Direction.Left,
            },
            {
                id: '2',
                isChild: false,
            },
            {
                id: 'Ignore',
                isChild: true,
                branch: Direction.Left,
            },
            {
                id: '3',
                isChild: false,
            },
            {
                id: 'Ignore',
                isChild: true,
                branch: Direction.Left,
            },
            {
                id: '4',
                isChild: false,
            },
            {
                id: 'Ignore',
                isChild: true,
                branch: Direction.Left,
            },
            {
                id: '5',
                isChild: false,
            },
            {
                id: 'Ignore',
                isChild: true,
                branch: Direction.Left,
            },
            {
                id: '6',
                isChild: false,
            },
            {
                id: 'Ignore',
                isChild: true,
                branch: Direction.Left,
            },
            {
                id: 'Ignore',
                isChild: true,
                branch: Direction.Right,
            },
        ],
    },
];

const mentalStates = [
    { state: 'Start', action: 5 },
    { state: 'Attack', action: 1 },
    { state: 'Defend', action: 4 },
    { state: 'Ignore', action: 0 },
];

export const INITIAL_AGENT_COMPONENTS = {
    mentalStates,
    trees,
    conditions,
    combos: [],
};

export const STARTER_AGENT: Agent = buildAgent(
    mentalStates,
    [],
    trees,
    //@ts-ignore
    //Copying from console.log removes enums which build will complain about
    conditions,
    0,
    0
);

export const PRESET_CONDITIONS: Condition[] = conditions as Condition[];
