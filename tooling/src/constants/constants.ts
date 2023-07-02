import { Action, AntocBlock, AntocMoveBackward, Hori } from '../types/Action';
import Agent, { buildAgent } from '../types/Agent';
import {
    ElementType,
    Condition,
    Operator,
    Perceptible,
} from '../types/Condition';
import {
    RealTimeFrameScene,
    STIMULUS_ENCODING,
    StimulusType,
} from '../types/Frame';
import { MentalState } from '../types/MentalState';
import { Direction, Tree } from '../types/Tree';

// Mongo db name and collection
export const DB_NAME = 'shoshin_indexer_5';
export const COLLECTION_NAME_SUBMISSION = 'shoshin-dogfooding-submission';
export const COLLECTION_NAME_LEAGUE = 'shoshin-league';
export const COLLECTION_NAME_WHITELIST = 'shoshin-whitelist';

export const PRIME =
    BigInt(2 ** 251) + BigInt(17) * BigInt(2 ** 192) + BigInt(1);

// Contract entrypoint and address
export const CONTRACT_ADDRESS =
    '0x01cf7516698237ed0b41440d2849759b88e8a2ad66238ff1267e5143e3ada5b8';
export const ENTRYPOINT_FIGHT = 'loop';
export const ENTRYPOINT_AGENT_SUBMISSION = 'submit_agent';

// Phaser related constans
export const PHASER_CANVAS_W = 1000;
export const PHASER_CANVAS_H = Math.round((PHASER_CANVAS_W / 16) * 9);

// Simulation related constants
export const TICK_IN_SECONDS = 0.07;
export const SIMULATION_TIME_IN_SECONDS = 30;
export const FRAME_COUNT = Math.round(
    SIMULATION_TIME_IN_SECONDS / TICK_IN_SECONDS
);

// UI-related sizes and enums
export const SIMULATOR_W = 1000;
export const SIMULATOR_H = 300;
export const CharacterComponentW = 600;
export const CharacterComponentH = 300;
export const SpriteTopAdjustmentToBg = -10;
export enum EditorMode {
    ReadOnly = 'ReadOnly',
    Edit = 'Edit',
}

// Physics / numerics related constants
export const SCALE_FP = 10 ** 4;
export const DT_FP = 10 ** 3;

export const bodyStateNumberToName = {
    jessica: {
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
        130: 'jump',
        140: 'gatotsu',
        150: 'low_kick',
        160: 'birdswing',
        170: 'launched',
    },
    antoc: {
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
        1140: 'step_forward',
        1150: 'jump',
        1160: 'low_kick',
        1170: 'launched',
        1190: 'drop_slash',
    },
};

const actionsToBodyStateJessica = {
    0: 0,
    1: 10,
    2: 20,
    3: 30,
    4: 40,
    5: 90,
    6: 100,
    7: 110,
    8: 120,
};

const actionsToBodyStateAntoc = {
    0: 0,
    1: 1010,
    2: 1020,
    3: 1040,
    4: 1090,
    5: 1100,
    6: 1110,
    7: 1120,
};

export const LEFT = 0;
export const RIGHT = 1;

export const actionstoBodyState = [
    actionsToBodyStateJessica,
    actionsToBodyStateAntoc,
];

export const adjustmentForCharacter = (
    characterName: string,
    bodyStateName: string,
    bodyStateDir: string
) => {
    if (characterName == 'jessica') {
        // calculate top adjustment
        const top = !(bodyStateName in ['dash_forward', 'dash_backward'])
            ? 8
            : 0;

        // calculate left adjustment
        var left = 0;
        if (bodyStateDir == 'left') {
            left = -25;

            if (bodyStateName == 'hurt') {
                left -= 20;
            } else if (bodyStateName == 'sidecut') {
                left -= 25;
            }
        } else {
            // facing right
            if (bodyStateName == 'sidecut') {
                left -= 55;
            } else if (bodyStateName == 'upswing') {
                left -= 45;
            } else {
                left = -29;
            }
        }

        return { top: top, left: left };
    } else if (characterName == 'antoc') {
        const top = 13;

        var left = 0;
        if (bodyStateDir == 'left') {
            if (bodyStateName == 'idle') {
                left -= 22;
            } else if (['hori', 'vert', 'block'].includes(bodyStateName)) {
                left -= 180;
            }
        }
        return { left: left, top: top };
    }

    // todo: Antoc adjustment
    return { left: 0, top: 0 };
};

export enum Character {
    Jessica = 'Jessica',
    Antoc = 'Antoc',
}

export enum KeysToActionsJessica {
    '-' = 'Rest',
    'J' = 'Slash',
    'K' = 'Upswing',
    'L' = 'Sidecut',
    'S' = 'Block',
    'D' = 'MoveForward',
    'A' = 'MoveBackward',
    'E' = 'DashForward',
    'Q' = 'DashBackward',
    'W' = 'Jump',
    'N' = 'Gatotsu',
    'U' = 'LowKick',
}

export enum KeysToActionsAntoc {
    '-' = 'Rest',
    'J' = 'Hori',
    'K' = 'Vert',
    'S' = 'Block',
    'D' = 'MoveForward',
    'A' = 'MoveBackward',
    'E' = 'DashForward',
    'Q' = 'DashBackward',
    'F' = 'StepForward',
    'W' = 'Jump',
    'U' = 'LowKick',
}

// Mapping such that { 'Rest' : '-' }
let ActionsToKeysJessica = {};
for (const key in KeysToActionsJessica) {
    const value = KeysToActionsJessica[key];
    ActionsToKeysJessica[value] = key;
}

// Mapping such that { 'Rest' : '-' }
let ActionsToKeysAntoc = {};
for (const key in KeysToActionsAntoc) {
    const value = KeysToActionsAntoc[key];
    ActionsToKeysAntoc[value] = key;
}

export const ACTIONS_TO_KEYS = [ActionsToKeysJessica, ActionsToKeysAntoc];

export enum ActionsJessica {
    Rest = 0,
    Slash = 1,
    Upswing = 2,
    Sidecut = 3,
    Block = 4,
    MoveForward = 5,
    MoveBackward = 6,
    DashForward = 7,
    DashBackward = 8,
    Jump = 9,
    Gatotsu = 10,
}

export enum ActionsAntoc {
    Rest = 0,
    Hori = 1,
    Vert = 2,
    Block = 3,
    MoveForward = 4,
    MoveBackward = 5,
    DashForward = 6,
    DashBackward = 7,
    StepForward = 8,
    Jump = 9,
}

export const characterActionToNumber = {
    jessica: {
        Rest: 0,
        Slash: 1,
        Upswing: 2,
        Sidecut: 3,
        Block: 4,
        MoveForward: 5,
        MoveBackward: 6,
        DashForward: 7,
        DashBackward: 8,
        Jump: 9,
        Gatotsu: 10,
        LowKick: 11,
    },
    antoc: {
        Rest: 0,
        Hori: 1,
        Vert: 2,
        Block: 3,
        MoveForward: 4,
        MoveBackward: 5,
        DashForward: 6,
        DashBackward: 7,
        StepForward: 8,
        Jump: 9,
        LowKick: 11,
    },
};
export function getIntentNameByCharacterTypeAndNumber(
    characterType: string,
    number: number
) {
    if (!(characterType in characterActionToNumber))
        throw new Error(
            `Invalid characterType: ${characterType}; accepting: jessica | antoc`
        );
    const object = characterActionToNumber[characterType];
    return Object.keys(object).find((key) => object[key] === number);
}

export const CHARACTERS_ACTION_KEYBINDINGS: any[] = [
    KeysToActionsJessica,
    KeysToActionsAntoc,
];

interface CharacterAction {
    id: number;
    duration: number;
    active?: number[];
}

export interface CharacterActions {
    [key: string]: CharacterAction;
}

export const ActionDetailJessica: CharacterActions = {
    Rest: { id: 0, duration: 1 },
    Slash: { id: 1, duration: 5, active: [3] },
    Upswing: { id: 2, duration: 5, active: [3] },
    Sidecut: { id: 3, duration: 5, active: [3] },
    Block: { id: 4, duration: 3, active: [2] },
    MoveForward: { id: 5, duration: 1 },
    MoveBackward: { id: 6, duration: 1 },
    DashForward: { id: 7, duration: 4 },
    DashBackward: { id: 8, duration: 4 },
    Jump: { id: 9, duration: 6 },
    Gatotsu: { id: 10, duration: 8 },
    LowKick: { id: 11, duration: 6 },
};

export const ActionDetailAntoc: CharacterActions = {
    Rest: { id: 0, duration: 1 },
    Hori: { id: 1, duration: 7, active: [2, 3] },
    Vert: { id: 2, duration: 10, active: [4, 5] },
    Block: { id: 3, duration: 6, active: [2, 3, 4, 5] },
    MoveForward: { id: 4, duration: 1 },
    MoveBackward: { id: 5, duration: 1 },
    DashForward: { id: 6, duration: 4 },
    DashBackward: { id: 7, duration: 4 },
    StepForward: { id: 8, duration: 3 },
    Jump: { id: 9, duration: 6 },
    LowKick: { id: 11, duration: 6 },
};

export const CHARACTER_ACTIONS_DETAIL: CharacterActions[] = [
    ActionDetailJessica,
    ActionDetailAntoc,
];

export const ACTION_UNICODE_MAP = {
    Rest: '\u{1F9D8}',
    Slash: '\u{1F5E1}',
    Upswing: '\u{1F5E1}',
    Sidecut: '\u{1F5E1}',

    Hori: '\u{1F5E1}',
    Vert: '\u{1F5E1}',

    Block: '\u{1F6E1}',

    MoveForward: '\u{1F6B6}',
    MoveBackward: '\u{1F6B6}',
    DashForward: '\u{1F406}',
    DashBackward: '\u{1F406}',

    StepForward: '\u{1F43E}',

    Jump: '\u{1F998}',

    Gatotsu: '\u{1F525}',

    LowKick: '\u{1F986}',
};

export const MAX_COMBO_SIZE = 20;

export const INITIAL_MENTAL_STATES: MentalState[] = [
    { state: 'MS IDLE', action: ActionsJessica['Rest'] },
    { state: 'MS COMBO', action: 101 },
    { state: 'MS BLOCK', action: ActionsJessica['Block'] },
    { state: 'MS CLOSER', action: ActionsJessica['MoveForward'] },
];

export const INITIAL_COMBOS: number[][] = [[7, 7, 2, 2, 2, 2, 2]];

export const INITIAL_DECISION_TREES: Tree[] = [
    {
        nodes: [
            { id: '0', isChild: false },
            { id: 'MS BLOCK', isChild: true, branch: Direction.Left },
            { id: '1', isChild: false, branch: Direction.Right },
            { id: 'MS COMBO', isChild: true, branch: Direction.Left },
            { id: 'MS CLOSER', isChild: true, branch: Direction.Right },
        ],
    },
    {
        nodes: [
            { id: '0', isChild: false },
            { id: 'MS BLOCK', isChild: true, branch: Direction.Left },
            { id: '1', isChild: false, branch: Direction.Right },
            { id: 'MS COMBO', isChild: true, branch: Direction.Left },
            { id: 'MS CLOSER', isChild: true, branch: Direction.Right },
        ],
    },
    {
        nodes: [
            { id: '0', isChild: false },
            { id: 'MS BLOCK', isChild: true, branch: Direction.Left },
            { id: 'MS IDLE', isChild: true, branch: Direction.Right },
        ],
    },
    {
        nodes: [
            { id: '0', isChild: false },
            { id: 'MS BLOCK', isChild: true, branch: Direction.Left },
            { id: '1', isChild: false, branch: Direction.Right },
            { id: 'MS COMBO', isChild: true, branch: Direction.Left },
            { id: 'MS CLOSER', isChild: true, branch: Direction.Right },
        ],
    },
];

export const INITIAL_CONDITIONS: Condition[] = [
    {
        elements: [
            { value: Operator.OpenParenthesis, type: ElementType.Operator },
            {
                value: Perceptible.OpponentBodyState,
                type: ElementType.Perceptible,
            },
            { value: Operator.Equal, type: ElementType.Operator },
            { value: 10, type: ElementType.Constant },
            { value: Operator.CloseParenthesis, type: ElementType.Operator },
            { value: Operator.Or, type: ElementType.Operator },
            { value: Operator.OpenParenthesis, type: ElementType.Operator },
            {
                value: Perceptible.OpponentBodyState,
                type: ElementType.Perceptible,
            },
            { value: Operator.Equal, type: ElementType.Operator },
            { value: 20, type: ElementType.Constant },
            { value: Operator.CloseParenthesis, type: ElementType.Operator },
            { value: Operator.Or, type: ElementType.Operator },
            { value: Operator.OpenParenthesis, type: ElementType.Operator },
            {
                value: Perceptible.OpponentBodyState,
                type: ElementType.Perceptible,
            },
            { value: Operator.Equal, type: ElementType.Operator },
            { value: 30, type: ElementType.Constant },
            { value: Operator.CloseParenthesis, type: ElementType.Operator },
            { value: Operator.Or, type: ElementType.Operator },
            { value: Operator.OpenParenthesis, type: ElementType.Operator },
            {
                value: Perceptible.OpponentBodyState,
                type: ElementType.Perceptible,
            },
            { value: Operator.Equal, type: ElementType.Operator },
            { value: 1010, type: ElementType.Constant },
            { value: Operator.CloseParenthesis, type: ElementType.Operator },
            { value: Operator.Or, type: ElementType.Operator },
            { value: Operator.OpenParenthesis, type: ElementType.Operator },
            {
                value: Perceptible.OpponentBodyState,
                type: ElementType.Perceptible,
            },
            { value: Operator.Equal, type: ElementType.Operator },
            { value: 1020, type: ElementType.Constant },
            { value: Operator.CloseParenthesis, type: ElementType.Operator },
        ],
        displayName: 'F0',
        key: '0',
    },
    {
        elements: [
            { value: Operator.OpenAbs, type: ElementType.Operator },
            { value: Perceptible.SelfX, type: ElementType.Perceptible },
            { value: Operator.Sub, type: ElementType.Operator },
            { value: Perceptible.OpponentX, type: ElementType.Perceptible },
            { value: Operator.CloseAbs, type: ElementType.Operator },
            { value: Operator.Lte, type: ElementType.Operator },
            { value: 80, type: ElementType.Constant },
        ],
        displayName: 'closer_than_80px',
        key: '1',
    },
    {
        elements: [
            { value: Operator.OpenAbs, type: ElementType.Operator },
            { value: Perceptible.OpponentVelX, type: ElementType.Perceptible },
            { value: Operator.CloseAbs, type: ElementType.Operator },
            { value: Operator.Lte, type: ElementType.Operator },
            { value: 10, type: ElementType.Constant },
        ],
        displayName: 'oponent_velocity_lt_10',
        key: '2',
    },
    {
        elements: [
            { value: Operator.OpenParenthesis, type: ElementType.Operator },
            { value: Perceptible.OpponentInt, type: ElementType.Perceptible },
            { value: Operator.Lte, type: ElementType.Operator },
            { value: 300, type: ElementType.Constant },
            { value: Operator.CloseParenthesis, type: ElementType.Operator },
            { value: Operator.And, type: ElementType.Operator },
            { value: Operator.OpenParenthesis, type: ElementType.Operator },
            { value: Operator.OpenAbs, type: ElementType.Operator },
            { value: Perceptible.SelfX, type: ElementType.Perceptible },
            { value: Operator.Sub, type: ElementType.Operator },
            { value: Perceptible.OpponentX, type: ElementType.Perceptible },
            { value: Operator.CloseAbs, type: ElementType.Operator },
            { value: Operator.Lte, type: ElementType.Operator },
            { value: 80, type: ElementType.Constant },
            { value: Operator.CloseParenthesis, type: ElementType.Operator },
        ],
        displayName: 'oponent_300_integrity_and_close',
        key: '3',
    },
    {
        elements: [
            { value: Operator.OpenParenthesis, type: ElementType.Operator },
            { value: Perceptible.SelfInt, type: ElementType.Perceptible },
            { value: Operator.Lte, type: ElementType.Operator },
            { value: 200, type: ElementType.Constant },
            { value: Operator.CloseParenthesis, type: ElementType.Operator },
        ],
        displayName: 'self_lte_200_integrity',
        key: '4',
    },
    {
        elements: [
            { value: Operator.OpenParenthesis, type: ElementType.Operator },
            { value: Operator.OpenParenthesis, type: ElementType.Operator },
            {
                value: Perceptible.OpponentBodyState,
                type: ElementType.Perceptible,
            },
            { value: Operator.Equal, type: ElementType.Operator },
            { value: 90, type: ElementType.Constant },
            { value: Operator.CloseParenthesis, type: ElementType.Operator },
            { value: Operator.Or, type: ElementType.Operator },
            { value: Operator.OpenParenthesis, type: ElementType.Operator },
            {
                value: Perceptible.OpponentBodyState,
                type: ElementType.Perceptible,
            },
            { value: Operator.Equal, type: ElementType.Operator },
            { value: 110, type: ElementType.Constant },
            { value: Operator.CloseParenthesis, type: ElementType.Operator },
            { value: Operator.Or, type: ElementType.Operator },
            { value: Operator.OpenParenthesis, type: ElementType.Operator },
            {
                value: Perceptible.OpponentBodyState,
                type: ElementType.Perceptible,
            },
            { value: Operator.Equal, type: ElementType.Operator },
            { value: 1090, type: ElementType.Constant },
            { value: Operator.CloseParenthesis, type: ElementType.Operator },
            { value: Operator.Or, type: ElementType.Operator },
            { value: Operator.OpenParenthesis, type: ElementType.Operator },
            {
                value: Perceptible.OpponentBodyState,
                type: ElementType.Perceptible,
            },
            { value: Operator.Equal, type: ElementType.Operator },
            { value: 1110, type: ElementType.Constant },
            { value: Operator.CloseParenthesis, type: ElementType.Operator },
            { value: Operator.CloseParenthesis, type: ElementType.Operator },
            { value: Operator.And, type: ElementType.Operator },
            { value: Operator.OpenParenthesis, type: ElementType.Operator },
            { value: Perceptible.SelfInt, type: ElementType.Perceptible },
            { value: Operator.Lte, type: ElementType.Operator },
            { value: 300, type: ElementType.Constant },
            { value: Operator.CloseParenthesis, type: ElementType.Operator },
        ],

        displayName: 'oponent_approaching',
        key: '5',
    },
    {
        elements: [
            { value: Perceptible.SelfBodyState, type: ElementType.Perceptible },
            { value: Operator.Equal, type: ElementType.Operator },
            { value: 0, type: ElementType.Constant },
        ],
        displayName: 'self_idle',
        key: '6',
    },
    {
        elements: [
            { value: Operator.Not, type: ElementType.Operator },
            { value: Operator.OpenParenthesis, type: ElementType.Operator },
            { value: Operator.OpenParenthesis, type: ElementType.Operator },
            {
                value: Perceptible.OpponentBodyState,
                type: ElementType.Perceptible,
            },
            { value: Operator.Equal, type: ElementType.Operator },
            { value: 10, type: ElementType.Constant },
            { value: Operator.CloseParenthesis, type: ElementType.Operator },
            { value: Operator.Or, type: ElementType.Operator },
            { value: Operator.OpenParenthesis, type: ElementType.Operator },
            {
                value: Perceptible.OpponentBodyState,
                type: ElementType.Perceptible,
            },
            { value: Operator.Equal, type: ElementType.Operator },
            { value: 20, type: ElementType.Constant },
            { value: Operator.CloseParenthesis, type: ElementType.Operator },
            { value: Operator.Or, type: ElementType.Operator },
            { value: Operator.OpenParenthesis, type: ElementType.Operator },
            {
                value: Perceptible.OpponentBodyState,
                type: ElementType.Perceptible,
            },
            { value: Operator.Equal, type: ElementType.Operator },
            { value: 30, type: ElementType.Constant },
            { value: Operator.CloseParenthesis, type: ElementType.Operator },
            { value: Operator.Or, type: ElementType.Operator },
            { value: Operator.OpenParenthesis, type: ElementType.Operator },
            {
                value: Perceptible.OpponentBodyState,
                type: ElementType.Perceptible,
            },
            { value: Operator.Equal, type: ElementType.Operator },
            { value: 1010, type: ElementType.Constant },
            { value: Operator.CloseParenthesis, type: ElementType.Operator },
            { value: Operator.Or, type: ElementType.Operator },
            { value: Operator.OpenParenthesis, type: ElementType.Operator },
            {
                value: Perceptible.OpponentBodyState,
                type: ElementType.Perceptible,
            },
            { value: Operator.Equal, type: ElementType.Operator },
            { value: 1020, type: ElementType.Constant },
            { value: Operator.CloseParenthesis, type: ElementType.Operator },
            { value: Operator.CloseParenthesis, type: ElementType.Operator },
        ],

        displayName: 'not_attacking',
        key: '7',
    },
    {
        elements: [
            {
                value: Perceptible.SelfBodyCounter,
                type: ElementType.Perceptible,
            },
            { value: Operator.Lte, type: ElementType.Operator },
            { value: 4, type: ElementType.Constant },
        ],
        displayName: 'self_lte_4_frames',
        key: '8',
    },
    {
        elements: [
            { value: 1, type: ElementType.Constant },
            { value: Operator.Equal, type: ElementType.Operator },
            { value: 1, type: ElementType.Constant },
        ],

        displayName: 'one_eq_one',
        key: '9',
    },
    {
        elements: [],
    },
];
export const INITIAL_CONDITION_INDEX: number = INITIAL_CONDITIONS.length - 1;

const conditions = [
    {
        elements: [
            { value: 1, type: ElementType.Constant },
            { value: Operator.Equal, type: ElementType.Operator },
            { value: 1, type: ElementType.Constant },
        ],

        displayName: 'F0',
        key: '0',
    },
    {
        elements: [
            { value: 1, type: ElementType.Constant },
            { value: Operator.Equal, type: ElementType.Operator },
            { value: 1, type: ElementType.Constant },
        ],

        displayName: 'F1',
        key: '1',
    },
];
const DECISION_TREE_IDLE_AGENT: Tree[] = [
    {
        nodes: [
            { id: '0', isChild: false },
            { id: 'MS Two', isChild: true, branch: Direction.Left },

            { id: 'MS One', isChild: true, branch: Direction.Right },
        ],
    },
    {
        nodes: [
            { id: '1', isChild: false },
            { id: 'MS One', isChild: true, branch: Direction.Left },
            { id: 'MS Two', isChild: true, branch: Direction.Right },
        ],
    },
];
const MENTAL_STATES_IDLE_AGENT: MentalState[] = [
    { state: 'MS One', action: ActionsAntoc['Rest'] },
    { state: 'MS Two', action: ActionsAntoc['Rest'] },
];
//export const IDLE_AGENT: Agent = buildAgent(MENTAL_STATES_IDLE_AGENT, [], DECISION_TREE_IDLE_AGENT, INITIAL_CONDITIONS, 0, 1)
export const IDLE_AGENT: Agent = buildAgent(
    MENTAL_STATES_IDLE_AGENT,
    [],
    DECISION_TREE_IDLE_AGENT,
    conditions,
    0,
    1
);

// used when you select build agent from blank in edit
export const BLANK_AGENT: Agent = buildAgent(
    MENTAL_STATES_IDLE_AGENT,
    [],
    DECISION_TREE_IDLE_AGENT,
    INITIAL_CONDITIONS,
    0,
    1
);

const DECISION_TREE_OFFENSIVE_AGENT = INITIAL_DECISION_TREES;
const MENTAL_STATES_OFFENSIVE_AGENT: MentalState[] = [
    { state: 'MS IDLE', action: ActionsAntoc['Rest'] },
    { state: 'MS COMBO', action: 101 },
    { state: 'MS BLOCK', action: ActionsAntoc['Block'] },
    { state: 'MS CLOSER', action: ActionsAntoc['MoveForward'] },
];
const COMBOS_OFFENSIVE_AGENT: Action[][] = [[Hori]];
export const OFFENSIVE_AGENT: Agent = buildAgent(
    MENTAL_STATES_OFFENSIVE_AGENT,
    COMBOS_OFFENSIVE_AGENT,
    DECISION_TREE_OFFENSIVE_AGENT,
    INITIAL_CONDITIONS,
    0,
    1
);

const DECISION_TREE_DEFENSIVE_AGENT = [
    {
        nodes: [
            { id: '0', isChild: false },
            { id: 'MS BLOCK', isChild: true, branch: Direction.Left },
            { id: 'MS IDLE', isChild: true, branch: Direction.Right },
        ],
    },
    {
        nodes: [
            { id: '0', isChild: false },
            { id: 'MS BLOCK', isChild: true, branch: Direction.Left },
            { id: 'MS RETRAIT', isChild: true, branch: Direction.Right },
        ],
    },
    {
        nodes: [
            { id: '0', isChild: false },
            { id: 'MS BLOCK', isChild: true, branch: Direction.Left },
            { id: '8', isChild: false },
            { id: 'MS RETRAIT', isChild: true, branch: Direction.Right },
            { id: 'MS IDLE', isChild: true, branch: Direction.Right },
        ],
    },
];
const MENTAL_STATES_DEFENSIVE_AGENT: MentalState[] = [
    { state: 'MS IDLE', action: ActionsAntoc['Rest'] },
    { state: 'MS BLOCK', action: 101 },
    { state: 'MS RETRAIT', action: 102 },
];
const COMBOS_DEFENSIVE_AGENT: Action[][] = [
    [AntocBlock, AntocBlock, AntocBlock, , AntocBlock],
    [
        AntocMoveBackward,
        AntocMoveBackward,
        AntocMoveBackward,
        AntocMoveBackward,
        ,
        AntocMoveBackward,
    ],
];
export const DEFENSIVE_AGENT: Agent = buildAgent(
    MENTAL_STATES_DEFENSIVE_AGENT,
    COMBOS_DEFENSIVE_AGENT,
    DECISION_TREE_DEFENSIVE_AGENT,
    INITIAL_CONDITIONS,
    0,
    1
);

export const DECISION_TREE_COMBO_AGENT = [
    {
        nodes: [
            { id: '0', isChild: false },
            { id: 'MS COMBO', isChild: true, branch: Direction.Left },
            { id: 'MS COMBO', isChild: true, branch: Direction.Right },
        ],
    },
];
export const MENTAL_STATES_COMBO_AGENT: MentalState[] = [
    { state: 'MS COMBO', action: 101 },
];

const INIT_STAMINA = 1000;
export const InitialRealTimeFrameScene: RealTimeFrameScene = {
    agent_0: {
        body_state: {
            counter: 0,
            dir: 1,
            integrity: 1000,
            stamina: INIT_STAMINA,
            state: 0,
            fatigued: 0,
        },
        hitboxes: {
            action: {
                origin: {
                    x: 2000,
                    y: 2000,
                },
                dimension: {
                    x: 0,
                    y: 0,
                },
            },
            body: {
                origin: {
                    x: -100,
                    y: 0,
                },
                dimension: {
                    x: 50,
                    y: 116,
                },
            },
        },
        physics_state: {
            pos: {
                x: -100,
                y: 0,
            },
            vel_fp: {
                x: 0,
                y: 0,
            },
            acc_fp: {
                x: 0,
                y: 0,
            },
        },
        stimulus: StimulusType.GROUND * STIMULUS_ENCODING,
    },
    agent_1: {
        body_state: {
            counter: 0,
            dir: 0,
            integrity: 1000,
            stamina: INIT_STAMINA,
            state: 0,
            fatigued: 0,
        },
        hitboxes: {
            action: {
                origin: {
                    x: 2000,
                    y: 2000,
                },
                dimension: {
                    x: 0,
                    y: 0,
                },
            },
            body: {
                origin: {
                    x: 100,
                    y: 0,
                },
                dimension: {
                    x: 50,
                    y: 116,
                },
            },
        },
        physics_state: {
            pos: {
                x: 100,
                y: 0,
            },
            vel_fp: {
                x: 0,
                y: 0,
            },
            acc_fp: {
                x: 0,
                y: 0,
            },
        },
        stimulus: StimulusType.GROUND * STIMULUS_ENCODING,
        mental_state: 0,
        combo_info: {
            combo_counter: 0,
            current_combo: 0,
        },
    },
};
