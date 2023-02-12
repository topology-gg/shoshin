import Agent, { buildAgent } from "../types/Agent"
import { ElementType, Function, Operator, Perceptible } from "../types/Function"
import { MentalState } from "../types/MentalState"
import { Direction, Tree } from "../types/Tree"

export const SIMULATOR_W = 1000
export const SIMULATOR_H = 300

export const CharacterComponentW = 600
export const CharacterComponentH = 300

export const SpriteTopAdjustmentToBg = -5

export const bodyStateNumberToName = {
    'jessica':{
        0: 'idle',
        10: 'slash',
        20: 'upswing',
        30: 'sidecut',
        40: 'block',
        50: 'clash',
        60: 'hurt',
        70: 'knocked',
        90: 'walk_forward',
        100: 'walk_backward',
        110: 'dash_forward',
        120: 'dash_backward',

        // namespace ns_jessica_body_state {
        //     const IDLE = 0; // 5 frames
        //     const SLASH = 10; // 5 frames
        //     const UPSWING = 20;  // 5 frames
        //     const SIDECUT = 30;  // 5 frames
        //     const BLOCK = 40; // 3 frames
        //     const CLASH = 50; // 4 frames;
        //     const HURT = 60; // 3 frames
        //     const KNOCKED = 70; // 11 frames
        //     const MOVE_FORWARD = 90;  // 8 frames
        //     const MOVE_BACKWARD = 100;  // 6 frames
        //     const DASH_FORWARD = 110;  // 5 frames
        //     const DASH_BACKWARD = 120;  // 5 frames
        // }
    },
    'antoc': {
        0: 'idle',
        10: 'hori',
        20: 'vert',
        40: 'block',
        50: 'hurt',
        60: 'knocked',
        90: 'walk_forward',
        100: 'walk_backward',
        110: 'dash_forward',
        120: 'dash_backward',

        // namespace ns_antoc_body_state {
        //     const IDLE = 0;      // 5 frames
        //     const HORI = 10;     // 7 frames
        //     const VERT = 20;  // 10 frames
        //     const BLOCK = 40;    // 6 frames
        //     const HURT = 50;     // 3 frames
        //     const KNOCKED = 60;  // 20 frames
        //     const MOVE_FORWARD = 90;  // 7 frames
        //     const MOVE_BACKWARD = 100;  // 6 frames
        //     const DASH_FORWARD = 110;  // 9 frames
        //     const DASH_BACKWARD = 120;  // 9 frames
        // }
    }

}

export const adjustmentForCharacter = (characterName: string, bodyStateName: string, bodyStateDir: string) => {
    if (characterName == 'jessica') {

        // calculate top adjustment
        const top = !(bodyStateName in ['dash_forward', 'dash_backward']) ? 8 : 0;

        // calculate left adjustment
        var left = 0;
        if (bodyStateDir == 'left') {
            left = -25

            if (bodyStateName == 'hurt') { left -= 20; }
            else if (bodyStateName == 'sidecut') { left -= 25; }
        }
        else {
            // facing right
            if (bodyStateName == 'sidecut') { left -= 55; }
            else if (bodyStateName == 'upswing') { left -= 45; }
            else { left = -29; }
        }

        return {'top': top, 'left':left};
    }
    else if (characterName == 'antoc') {

        const top = 13;

        var left = 0;
        if (bodyStateDir == 'left') {
            if (bodyStateName == 'idle'){ left -= 22; }
            else if ( ['hori', 'vert', 'block'].includes(bodyStateName) ){ left -= 180; }
        }
        return {'left':left, 'top':top}
    }

    // todo: Antoc adjustment
    return {'left':0, 'top':0}
}

export enum Character {
    Jessica = 'Jessica',
    Antoc = 'Antoc',
}

export enum ActionsJessica {
    Null = 0,
    Slash = 1,
    Upswing = 2,
    Sidecut = 3,
    Block = 4,
    MoveForward  = 5,
    MoveBackward = 6,
    DashForward  = 7,
    DashBackward = 8,
}

export enum ActionsAntoc {
    Null = 0,
    Hori = 1,
    Vert = 2,
    Block = 3,
    MoveForward = 4,
    MoveBackward = 5,
    DashForward = 6,
    DashBackward = 7,
}

export const CHARACTERS_ACTIONS: any[] = [ActionsJessica, ActionsAntoc]

export const ACTIONS_ICON_MAP = {
    Null: 'close',

    Slash : 'local_dining',
    Upswing : 'swipe_vertical',
    Sidecut : 'swipe_left',

    Hori : 'local_dining',
    Vert : 'swipe_vertical',

    Block : 'block',
    MoveForward  : 'arrow_forward',
    MoveBackward : 'arrow_back',
    DashForward  : 'keyboard_double_arrow_right',
    DashBackward : 'keyboard_double_arrow_left',
}

export const OPERATOR_VALUE = {
    '+': 1,
    'OR': 1,
    '-': 2,
    '*': 3,
    'AND': 3,
    '/': 4,
    '%': 5,
    'ABS': 6,
    'SQRT': 7,
    'POW': 8,
    'IS_NN': 9,
    '<=': 10,
    '!': 11,
    '==': 12,
    'MEM': 13,
    'DICT': 14,
    'FUNC': 15,
}

export const MAX_COMBO_SIZE = 10;

export const INITIAL_MENTAL_STATES: MentalState[] = [
    { state: 'MS IDLE', action: ActionsJessica['Null'] },
    { state: 'MS COMBO', action: 101 },
    { state: 'MS BLOCK', action: ActionsJessica['Block'] },
    { state: 'MS CLOSER', action: ActionsJessica['MoveForward'] },
]

export const INITIAL_COMBOS: number[][] = [[7, 7, 2, 2, 2, 2, 2]]

export const INITIAL_DECISION_TREES: Tree[] = [
    {
        nodes: [
            { id: 'if F0', isChild: false },
            { id: 'MS BLOCK', isChild: true, branch: Direction.Left },
            { id: 'if F1', isChild: false, branch: Direction.Right },
            { id: 'MS COMBO', isChild: true, branch: Direction.Left },
            { id: 'MS CLOSER', isChild: true, branch: Direction.Right },
        ]
    },
    {
        nodes: [
            { id: 'if F0', isChild: false },
            { id: 'MS BLOCK', isChild: true, branch: Direction.Left },
            { id: 'if F1', isChild: false, branch: Direction.Right },
            { id: 'MS COMBO', isChild: true, branch: Direction.Left },
            { id: 'MS CLOSER', isChild: true, branch: Direction.Right },
        ]
    },
    {
        nodes: [
            { id: 'if F0', isChild: false },
            { id: 'MS BLOCK', isChild: true, branch: Direction.Left },
            { id: 'MS IDLE', isChild: true, branch: Direction.Right },
        ]
    },
    {
        nodes: [
            { id: 'if F0', isChild: false },
            { id: 'MS BLOCK', isChild: true, branch: Direction.Left },
            { id: 'if F1', isChild: false, branch: Direction.Right },
            { id: 'MS COMBO', isChild: true, branch: Direction.Left },
            { id: 'MS CLOSER', isChild: true, branch: Direction.Right },
        ]
    }
]

export const INITIAL_FUNCTIONS: Function[] = [
    {
        elements: [
            { value: Operator.OpenParenthesis, type: ElementType.Operator },
            { value: Perceptible.OpponentBodyState, type: ElementType.Perceptible },
            { value: Operator.Equal, type: ElementType.Operator },
            { value: 10, type: ElementType.Constant },
            { value: Operator.CloseParenthesis, type: ElementType.Operator },
            { value: Operator.Or, type: ElementType.Operator },
            { value: Operator.OpenParenthesis, type: ElementType.Operator },
            { value: Perceptible.OpponentBodyState, type: ElementType.Perceptible },
            { value: Operator.Equal, type: ElementType.Operator },
            { value: 20, type: ElementType.Constant },
            { value: Operator.CloseParenthesis, type: ElementType.Operator },
            { value: Operator.Or, type: ElementType.Operator },
            { value: Operator.OpenParenthesis, type: ElementType.Operator },
            { value: Perceptible.OpponentBodyState, type: ElementType.Perceptible },
            { value: Operator.Equal, type: ElementType.Operator },
            { value: 30, type: ElementType.Constant },
            { value: Operator.CloseParenthesis, type: ElementType.Operator },
        ]
    },
    {
        elements: [
            { value: Operator.OpenAbs, type: ElementType.Operator},
            { value: Perceptible.SelfX, type: ElementType.Perceptible},
            { value: Operator.Sub, type: ElementType.Operator},
            { value: Perceptible.OpponentX, type: ElementType.Perceptible},
            { value: Operator.CloseAbs, type: ElementType.Operator},
            { value: Operator.Lte, type: ElementType.Operator},
            { value: 80, type: ElementType.Constant},
        ]
    },
    {
        elements: [
            { value: Operator.OpenAbs, type: ElementType.Operator},
            { value: Perceptible.OpponentVelX, type: ElementType.Perceptible},
            { value: Operator.CloseAbs, type: ElementType.Operator},
            { value: Operator.Lte, type: ElementType.Operator},
            { value: 10, type: ElementType.Constant},
        ]
    },
    {
        elements: [
            { value: Operator.OpenParenthesis, type: ElementType.Operator},
            { value: Perceptible.OpponentInt, type: ElementType.Perceptible},
            { value: Operator.Lte, type: ElementType.Operator},
            { value: 300, type: ElementType.Constant},
            { value: Operator.CloseParenthesis, type: ElementType.Operator},
            { value: Operator.And, type: ElementType.Operator},
            { value: Operator.OpenParenthesis, type: ElementType.Operator},
            { value: Operator.OpenAbs, type: ElementType.Operator},
            { value: Perceptible.SelfX, type: ElementType.Perceptible},
            { value: Operator.Sub, type: ElementType.Operator},
            { value: Perceptible.OpponentX, type: ElementType.Perceptible},
            { value: Operator.CloseAbs, type: ElementType.Operator},
            { value: Operator.Lte, type: ElementType.Operator},
            { value: 80, type: ElementType.Constant},
            { value: Operator.CloseParenthesis, type: ElementType.Operator},
        ]
    },
    {
        elements: [
            { value: Operator.OpenParenthesis, type: ElementType.Operator},
            { value: Perceptible.SelfInt, type: ElementType.Perceptible},
            { value: Operator.Lte, type: ElementType.Operator},
            { value: 200, type: ElementType.Constant},
            { value: Operator.CloseParenthesis, type: ElementType.Operator},
        ]
    },
    {
        elements: [
            { value: Operator.OpenParenthesis, type: ElementType.Operator},
            { value: Operator.OpenParenthesis, type: ElementType.Operator},
            { value: Perceptible.OpponentBodyState, type: ElementType.Perceptible},
            { value: Operator.Equal, type: ElementType.Operator},
            { value: 90, type: ElementType.Constant},
            { value: Operator.CloseParenthesis, type: ElementType.Operator},
            { value: Operator.Or, type: ElementType.Operator},
            { value: Operator.OpenParenthesis, type: ElementType.Operator},
            { value: Perceptible.OpponentBodyState, type: ElementType.Perceptible},
            { value: Operator.Equal, type: ElementType.Operator},
            { value: 110, type: ElementType.Constant},
            { value: Operator.CloseParenthesis, type: ElementType.Operator},
            { value: Operator.CloseParenthesis, type: ElementType.Operator},
            { value: Operator.And, type: ElementType.Operator},
            { value: Operator.OpenParenthesis, type: ElementType.Operator},
            { value: Perceptible.SelfInt, type: ElementType.Perceptible},
            { value: Operator.Lte, type: ElementType.Operator},
            { value: 300, type: ElementType.Constant},
            { value: Operator.CloseParenthesis, type: ElementType.Operator},
        ]
    },
    {
        elements: [
            { value: Perceptible.SelfBodyState, type: ElementType.Perceptible },
            { value: Operator.Equal, type: ElementType.Operator },
            { value: 0, type: ElementType.Constant },
        ]
    },
    {
        elements: [
            { value: Operator.Not, type: ElementType.Operator },
            { value: Operator.OpenParenthesis, type: ElementType.Operator },
            { value: Operator.OpenParenthesis, type: ElementType.Operator },
            { value: Perceptible.OpponentBodyState, type: ElementType.Perceptible },
            { value: Operator.Equal, type: ElementType.Operator },
            { value: 10, type: ElementType.Constant },
            { value: Operator.CloseParenthesis, type: ElementType.Operator },
            { value: Operator.Or, type: ElementType.Operator },
            { value: Operator.OpenParenthesis, type: ElementType.Operator },
            { value: Perceptible.OpponentBodyState, type: ElementType.Perceptible },
            { value: Operator.Equal, type: ElementType.Operator },
            { value: 20, type: ElementType.Constant },
            { value: Operator.CloseParenthesis, type: ElementType.Operator },
            { value: Operator.Or, type: ElementType.Operator },
            { value: Operator.OpenParenthesis, type: ElementType.Operator },
            { value: Perceptible.OpponentBodyState, type: ElementType.Perceptible },
            { value: Operator.Equal, type: ElementType.Operator },
            { value: 30, type: ElementType.Constant },
            { value: Operator.CloseParenthesis, type: ElementType.Operator },
            { value: Operator.CloseParenthesis, type: ElementType.Operator },
        ]
    },
    {
        elements: [
            { value: Perceptible.SelfBodyCounter, type: ElementType.Perceptible },
            { value: Operator.Lte, type: ElementType.Operator },
            { value: 4, type: ElementType.Constant },
        ]
    },
    {
        elements: []
    }
]
export const INITIAL_FUNCTIONS_INDEX: number = INITIAL_FUNCTIONS.length - 1

const DECISION_TREE_OFFENSIVE_AGENT = INITIAL_DECISION_TREES
const MENTAL_STATES_OFFENSIVE_AGENT: MentalState[] = [
    { state: 'MS IDLE', action: ActionsAntoc['Null'] },
    { state: 'MS COMBO', action: 101 },
    { state: 'MS BLOCK', action: ActionsAntoc['Block'] },
    { state: 'MS CLOSER', action: ActionsAntoc['MoveForward'] },
]
const COMBOS_OFFENSIVE_AGENT: number[][] = [[1, 1, 1, 1, 1, 1, 1]]
export const OFFENSIVE_AGENT: Agent = buildAgent(MENTAL_STATES_OFFENSIVE_AGENT, COMBOS_OFFENSIVE_AGENT, DECISION_TREE_OFFENSIVE_AGENT, INITIAL_FUNCTIONS, 0, 1)

const DECISION_TREE_DEFENSIVE_AGENT = [
    {
        nodes: [
            { id: 'if F0', isChild: false },
            { id: 'MS BLOCK', isChild: true, branch: Direction.Left },
            { id: 'MS IDLE', isChild: true, branch: Direction.Right },
        ]
    },
    {
        nodes: [
            { id: 'if F0', isChild: false },
            { id: 'MS BLOCK', isChild: true, branch: Direction.Left },
            { id: 'MS RETRAIT', isChild: true, branch: Direction.Right },
        ]
    },
    {
        nodes: [
            { id: 'if F0', isChild: false },
            { id: 'MS BLOCK', isChild: true, branch: Direction.Left },
            { id: 'if F8', isChild: false },
            { id: 'MS RETRAIT', isChild: true, branch: Direction.Right },
            { id: 'MS IDLE', isChild: true, branch: Direction.Right },
        ]
    },
]
const MENTAL_STATES_DEFENSIVE_AGENT: MentalState[] = [
    { state: 'MS IDLE', action: ActionsAntoc['Null'] },
    { state: 'MS BLOCK', action: 101 },
    { state: 'MS RETRAIT', action: 102 },
]
const COMBOS_DEFENSIVE_AGENT: number[][] = [[3, 3, 3, 3, 3, 3], [5, 5, 5, 5, 5, 5]]
export const DEFENSIVE_AGENT: Agent = buildAgent(MENTAL_STATES_DEFENSIVE_AGENT, COMBOS_DEFENSIVE_AGENT, DECISION_TREE_DEFENSIVE_AGENT, INITIAL_FUNCTIONS, 0, 1)