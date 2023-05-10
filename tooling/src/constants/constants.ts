import Agent, { buildAgent } from "../types/Agent"
import { ElementType, Condition, Operator, Perceptible } from "../types/Condition"
import { MentalState } from "../types/MentalState"
import { Direction, Tree } from "../types/Tree"

// Mongo db name and collection
export const DB_NAME = 'shoshin_indexer_5'
export const COLLECTION_NAME = 'shoshin-dogfooding-submission'
export const PRIME = BigInt(2**251) + BigInt(17) * BigInt(2**192) + BigInt(1)

// Contract entrypoint and address
export const CONTRACT_ADDRESS = "0x01cf7516698237ed0b41440d2849759b88e8a2ad66238ff1267e5143e3ada5b8"
export const ENTRYPOINT_FIGHT = "loop"
export const ENTRYPOINT_AGENT_SUBMISSION = "submit_agent"

// UI-related sizes and enums
export const SIMULATOR_W = 1000
export const SIMULATOR_H = 300
export const CharacterComponentW = 600
export const CharacterComponentH = 300
export const SpriteTopAdjustmentToBg = -10
export enum EditorMode {
    ReadOnly = 'ReadOnly',
    Edit = 'Edit',
}

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
    },
    'antoc': {
        0: 'idle',
        1010: 'hori',
        1020: 'vert',
        1040: 'block',
        1050: 'hurt',
        1060: 'knocked',
        1090: 'walk_forward',
        1100: 'walk_backward',
        1110: 'dash_forward',
        1120: 'dash_backward',
        1130: 'clash',
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

// Simulation related constants
export const FRAME_COUNT = 120;

export const CHARACTERS_ACTIONS: any[] = [ActionsJessica, ActionsAntoc]


interface CharacterAction {
    id : number,
    duration : number,
    
}

interface CharacterActions  {
    [key : string] : CharacterAction
}

export const ActionDetailJessica : CharacterActions = {
    Null : { id : 0, duration : 1},
    Slash : { id : 1, duration : 5},
    Upswing : {id : 2, duration : 5},
    Sidecut : { id : 3, duration : 5},
    Block : { id : 4, duration : 3},
    MoveForward : { id : 5, duration : 1},
    MoveBackward : { id : 5, duration : 1},
    DashForward : { id : 5, duration : 1},
    DashBackward : { id : 5, duration : 1},
}

export const ActionDetailAntoc : CharacterActions = { 
    Null : { id : 0, duration : 1},
    Hori : { id : 1, duration : 7},
    Vert : { id : 2, duration : 10},
    Block : { id : 3, duration : 6},
    MoveForward : { id : 4, duration : 1},
    MoveBackward : { id : 5, duration : 1},
    DashForward : { id : 6, duration : 4},
    DashBackward : { id : 7, duration : 4},
 }

export const CHARACTER_ACTIONS_DETAIL : CharacterActions[] = [ActionDetailJessica, ActionDetailAntoc]

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
            { id: 'F0', isChild: false },
            { id: 'MS BLOCK', isChild: true, branch: Direction.Left },
            { id: 'F1', isChild: false, branch: Direction.Right },
            { id: 'MS COMBO', isChild: true, branch: Direction.Left },
            { id: 'MS CLOSER', isChild: true, branch: Direction.Right },
        ]
    },
    {
        nodes: [
            { id: 'F0', isChild: false },
            { id: 'MS BLOCK', isChild: true, branch: Direction.Left },
            { id: 'F1', isChild: false, branch: Direction.Right },
            { id: 'MS COMBO', isChild: true, branch: Direction.Left },
            { id: 'MS CLOSER', isChild: true, branch: Direction.Right },
        ]
    },
    {
        nodes: [
            { id: 'F0', isChild: false },
            { id: 'MS BLOCK', isChild: true, branch: Direction.Left },
            { id: 'MS IDLE', isChild: true, branch: Direction.Right },
        ]
    },
    {
        nodes: [
            { id: 'F0', isChild: false },
            { id: 'MS BLOCK', isChild: true, branch: Direction.Left },
            { id: 'F1', isChild: false, branch: Direction.Right },
            { id: 'MS COMBO', isChild: true, branch: Direction.Left },
            { id: 'MS CLOSER', isChild: true, branch: Direction.Right },
        ]
    }
]

export const INITIAL_CONDITIONS: Condition[] = [
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
            { value: Operator.Or, type: ElementType.Operator },
            { value: Operator.OpenParenthesis, type: ElementType.Operator },
            { value: Perceptible.OpponentBodyState, type: ElementType.Perceptible },
            { value: Operator.Equal, type: ElementType.Operator },
            { value: 1010, type: ElementType.Constant },
            { value: Operator.CloseParenthesis, type: ElementType.Operator },
            { value: Operator.Or, type: ElementType.Operator },
            { value: Operator.OpenParenthesis, type: ElementType.Operator },
            { value: Perceptible.OpponentBodyState, type: ElementType.Perceptible },
            { value: Operator.Equal, type: ElementType.Operator },
            { value: 1020, type: ElementType.Constant },
            { value: Operator.CloseParenthesis, type: ElementType.Operator },
        ],
        displayName : "oponent_is_attacking",
        key: "1"
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
        ],
        displayName : "closer_than_80px",
        key: "2"
    },
    {
        elements: [
            { value: Operator.OpenAbs, type: ElementType.Operator},
            { value: Perceptible.OpponentVelX, type: ElementType.Perceptible},
            { value: Operator.CloseAbs, type: ElementType.Operator},
            { value: Operator.Lte, type: ElementType.Operator},
            { value: 10, type: ElementType.Constant},
        ],
        displayName : "oponent_velocity_lt_10",
        key: "3"
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
        ],
        displayName : "oponent_300_integrity_and_close",
        key: "4"
    },
    {
        elements: [
            { value: Operator.OpenParenthesis, type: ElementType.Operator},
            { value: Perceptible.SelfInt, type: ElementType.Perceptible},
            { value: Operator.Lte, type: ElementType.Operator},
            { value: 200, type: ElementType.Constant},
            { value: Operator.CloseParenthesis, type: ElementType.Operator},
        ],
        displayName : "self_lte_200_integrity",
        key: "5"
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
            { value: Operator.Or, type: ElementType.Operator},
            { value: Operator.OpenParenthesis, type: ElementType.Operator},
            { value: Perceptible.OpponentBodyState, type: ElementType.Perceptible},
            { value: Operator.Equal, type: ElementType.Operator},
            { value: 1090, type: ElementType.Constant},
            { value: Operator.CloseParenthesis, type: ElementType.Operator},
            { value: Operator.Or, type: ElementType.Operator},
            { value: Operator.OpenParenthesis, type: ElementType.Operator},
            { value: Perceptible.OpponentBodyState, type: ElementType.Perceptible},
            { value: Operator.Equal, type: ElementType.Operator},
            { value: 1110, type: ElementType.Constant},
            { value: Operator.CloseParenthesis, type: ElementType.Operator},
            { value: Operator.CloseParenthesis, type: ElementType.Operator},
            { value: Operator.And, type: ElementType.Operator},
            { value: Operator.OpenParenthesis, type: ElementType.Operator},
            { value: Perceptible.SelfInt, type: ElementType.Perceptible},
            { value: Operator.Lte, type: ElementType.Operator},
            { value: 300, type: ElementType.Constant},
            { value: Operator.CloseParenthesis, type: ElementType.Operator},
        ],

        displayName : "oponent_approaching",
        key: "10"
    },
    {
        elements: [
            { value: Perceptible.SelfBodyState, type: ElementType.Perceptible },
            { value: Operator.Equal, type: ElementType.Operator },
            { value: 0, type: ElementType.Constant },
        ],
        displayName : "self_idle",
        key: "6"
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
            { value: Operator.Or, type: ElementType.Operator },
            { value: Operator.OpenParenthesis, type: ElementType.Operator },
            { value: Perceptible.OpponentBodyState, type: ElementType.Perceptible },
            { value: Operator.Equal, type: ElementType.Operator },
            { value: 1010, type: ElementType.Constant },
            { value: Operator.CloseParenthesis, type: ElementType.Operator },
            { value: Operator.Or, type: ElementType.Operator },
            { value: Operator.OpenParenthesis, type: ElementType.Operator },
            { value: Perceptible.OpponentBodyState, type: ElementType.Perceptible },
            { value: Operator.Equal, type: ElementType.Operator },
            { value: 1020, type: ElementType.Constant },
            { value: Operator.CloseParenthesis, type: ElementType.Operator },
            { value: Operator.CloseParenthesis, type: ElementType.Operator },
        ],

        displayName : "not_attacking",
        key: "7"
    },
    {
        elements: [
            { value: Perceptible.SelfBodyCounter, type: ElementType.Perceptible },
            { value: Operator.Lte, type: ElementType.Operator },
            { value: 4, type: ElementType.Constant },
        ],
        displayName : "self_lte_4_frames",
        key: "7"
    },
    {
        elements: [
            { value: 1, type: ElementType.Constant },
            { value: Operator.Equal, type: ElementType.Operator },
            { value: 1, type: ElementType.Constant },
        ],

        displayName : "one_eq_one",
        key: "8"
    },
    {
        elements: []
    }
]
export const INITIAL_CONDITION_INDEX: number = INITIAL_CONDITIONS.length - 1

const DECISION_TREE_IDLE_AGENT: Tree[] = [
    {
        nodes: [
            { id: 'F9', isChild: false },
            { id: 'MS IDLE', isChild: true, branch: Direction.Left },
            { id: 'MS IDLE', isChild: true, branch: Direction.Right },
        ]
    }
]
const MENTAL_STATES_IDLE_AGENT: MentalState[] = [
    { state: 'MS IDLE', action: ActionsAntoc['Null'] },
]
export const IDLE_AGENT: Agent = buildAgent(MENTAL_STATES_IDLE_AGENT, [], DECISION_TREE_IDLE_AGENT, INITIAL_CONDITIONS, 0, 1)
export const BLANK_AGENT: Agent = buildAgent(MENTAL_STATES_IDLE_AGENT, [], DECISION_TREE_IDLE_AGENT, INITIAL_CONDITIONS, 0, 0)

const DECISION_TREE_OFFENSIVE_AGENT = INITIAL_DECISION_TREES
const MENTAL_STATES_OFFENSIVE_AGENT: MentalState[] = [
    { state: 'MS IDLE', action: ActionsAntoc['Null'] },
    { state: 'MS COMBO', action: 101 },
    { state: 'MS BLOCK', action: ActionsAntoc['Block'] },
    { state: 'MS CLOSER', action: ActionsAntoc['MoveForward'] },
]
const COMBOS_OFFENSIVE_AGENT: number[][] = [[1, 1, 1, 1, 1, 1, 1]]
export const OFFENSIVE_AGENT: Agent = buildAgent(MENTAL_STATES_OFFENSIVE_AGENT, COMBOS_OFFENSIVE_AGENT, DECISION_TREE_OFFENSIVE_AGENT, INITIAL_CONDITIONS, 0, 1)

const DECISION_TREE_DEFENSIVE_AGENT = [
    {
        nodes: [
            { id: 'F0', isChild: false },
            { id: 'MS BLOCK', isChild: true, branch: Direction.Left },
            { id: 'MS IDLE', isChild: true, branch: Direction.Right },
        ]
    },
    {
        nodes: [
            { id: 'F0', isChild: false },
            { id: 'MS BLOCK', isChild: true, branch: Direction.Left },
            { id: 'MS RETRAIT', isChild: true, branch: Direction.Right },
        ]
    },
    {
        nodes: [
            { id: 'F0', isChild: false },
            { id: 'MS BLOCK', isChild: true, branch: Direction.Left },
            { id: 'F8', isChild: false },
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
export const DEFENSIVE_AGENT: Agent = buildAgent(MENTAL_STATES_DEFENSIVE_AGENT, COMBOS_DEFENSIVE_AGENT, DECISION_TREE_DEFENSIVE_AGENT, INITIAL_CONDITIONS, 0, 1)

export const DECISION_TREE_COMBO_AGENT = [
    {
        nodes: [
            { id: 'F0', isChild: false },
            { id: 'MS COMBO', isChild: true, branch: Direction.Left },
            { id: 'MS COMBO', isChild: true, branch: Direction.Right },
        ]
    }
]
export const MENTAL_STATES_COMBO_AGENT: MentalState[] = [
    { state: 'MS COMBO', action: 101 },
]