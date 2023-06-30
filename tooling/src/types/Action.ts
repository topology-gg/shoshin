// TODO : this type should have hitbox and active,inactive data
export interface Action {
    // Id used to represent in Shoshin
    id: number;
    display: {
        name: string;
        unicode: string;
    };
    // How long the action takes
    frames: {
        duration: number;
        active?: number[];
        interrupts?: { [key: number]: number };
    };
    key: string;
}

export const defaultAction: Action = {
    id: 0,
    display: { name: 'Rest', unicode: '\u{1F9D8}' },
    frames: { duration: 1 },
    key: '-',
};

const Rest: Action = {
    id: 0,
    display: { name: 'Rest', unicode: '\u{1F9D8}' },
    frames: { duration: 1 },
    key: '-',
};
const Slash: Action = {
    id: 1,
    display: { name: 'Slash', unicode: '\u{1F5E1}' },
    frames: { duration: 5, active: [3] },
    key: 'J',
};

const Upswing: Action = {
    id: 2,
    display: { name: 'Upswing', unicode: '\u{1F5E1}' },
    frames: { duration: 5, active: [3] },
    key: 'K',
};

const Sidecut: Action = {
    id: 3,
    display: { name: 'Sidecut', unicode: '\u{1F5E1}' },
    frames: { duration: 5, active: [3] },
    key: 'L',
};

const Block: Action = {
    id: 4,
    display: { name: 'Block', unicode: '\u{1F6E1}' },
    frames: { duration: 3, active: [2] },
    key: 'S',
};

const MoveForward: Action = {
    id: 5,
    display: { name: 'MoveForward', unicode: '\u{1F6B6}' },
    frames: { duration: 1 },
    key: 'D',
};

const MoveBackward: Action = {
    id: 6,
    display: { name: 'MoveBackward', unicode: '\u{1F6B6}' },
    frames: { duration: 1 },
    key: 'A',
};

const DashForward: Action = {
    id: 7,
    display: { name: 'DashForward', unicode: '\u{1F406}' },
    frames: {
        duration: 4,
        interrupts: {
            [Slash.id]: 2,
            [Upswing.id]: 2,
            [Sidecut.id]: 2,
        },
    },
    key: 'E',
};

const DashBackward: Action = {
    id: 8,
    display: { name: 'DashBackward', unicode: '\u{1F406}' },
    frames: { duration: 4 },
    key: 'Q',
};

const Jump: Action = {
    id: 9,
    display: { name: 'Jump', unicode: '\u{1F998}' },
    frames: { duration: 6 },
    key: 'W',
};

const Gatotsu: Action = {
    id: 10,
    display: { name: 'Gatotsu', unicode: '\u{1F985}' },
    frames: { duration: 7 },
    key: 'N',
};
const JessicaLowKick: Action = {
    id: 11,
    display: { name: 'LowKick', unicode: '\u{1F9B6}' },
    frames: { duration: 6 },
    key: 'U',
};

const JessicaActions = [
    Rest,
    Slash,
    Upswing,
    Sidecut,
    Block,
    MoveForward,
    MoveBackward,
    DashForward,
    DashBackward,
    Jump,
    Gatotsu,
    JessicaLowKick,
];

const AntocRest: Action = {
    id: 0,
    display: { name: 'Rest', unicode: '\u{1F9D8}' },
    frames: { duration: 1 },
    key: '-',
};

export const Hori: Action = {
    id: 1,
    display: { name: 'Hori', unicode: '\u{1F5E1}' },
    frames: { duration: 7, active: [2, 3] },
    key: 'J',
};

const Vert: Action = {
    id: 2,
    display: { name: 'Vert', unicode: '\u{1F5E1}' },
    frames: { duration: 10, active: [4, 5] },
    key: 'K',
};

export const AntocBlock: Action = {
    id: 3,
    display: { name: 'Block', unicode: '\u{1F6E1}' },
    frames: { duration: 6, active: [2, 3, 4, 5] },
    key: 'S',
};

const AntocMoveForward: Action = {
    id: 4,
    display: { name: 'MoveForward', unicode: '\u{1F6B6}' },
    frames: { duration: 1 },
    key: 'D',
};

export const AntocMoveBackward: Action = {
    id: 5,
    display: { name: 'MoveBackward', unicode: '\u{1F6B6}' },
    frames: { duration: 1 },
    key: 'A',
};

const AntocDashForward: Action = {
    id: 6,
    display: { name: 'DashForward', unicode: '\u{1F406}' },
    frames: { duration: 4 },
    key: 'E',
};

const AntocDashBackward: Action = {
    id: 7,
    display: { name: 'DashBackward', unicode: '\u{1F406}' },
    frames: { duration: 4 },
    key: 'Q',
};

const StepForward: Action = {
    id: 8,
    display: { name: 'StepForward', unicode: '\u{1F43E}' },
    frames: { duration: 3 },
    key: 'F',
};

const AntocJump: Action = {
    id: 9,
    display: { name: 'Jump', unicode: '\u{1F998}' },
    frames: { duration: 7 },
    key: 'W',
};

const AntocLowKick: Action = {
    id: 11,
    display: { name: 'LowKick', unicode: '\u{1F9B6}' },
    frames: { duration: 6 },
    key: 'U',
};

const AntocActions = [
    AntocRest,
    Hori,
    Vert,
    AntocBlock,
    AntocMoveForward,
    AntocMoveBackward,
    AntocDashForward,
    AntocDashBackward,
    StepForward,
    AntocJump,
    AntocLowKick,
];

export const CHARACTERS_ACTIONS = [JessicaActions, AntocActions];

const getActionDuration = (leftAction: Action, rightAction: Action) => {
    let actionDuration = leftAction.frames.duration;
    const shortenedDuration = leftAction.frames.interrupts[rightAction.id];
    if (shortenedDuration !== undefined) {
        actionDuration = shortenedDuration;
    }
    return actionDuration;
};

export const actionDurationInCombo = (
    action: Action,
    index: number,
    combo: Action[]
) => {
    //Check if next action can interrupt the current action
    if (index + 1 < combo.length && action.frames.interrupts !== undefined) {
        return getActionDuration(action, combo[index + 1]);
    }
    return action.frames.duration;
};
