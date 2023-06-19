// TODO : this type should have hitbox and active,inactive data
// TODO : add keyboard keys for realtime
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
    };
}

export const defaultAction: Action = {
    id: 0,
    display: { name: 'Rest', unicode: '\u{1F9D8}' },
    frames: { duration: 1 },
};

const Rest: Action = {
    id: 0,
    display: { name: 'Rest', unicode: '\u{1F9D8}' },
    frames: { duration: 1 },
};
const Slash: Action = {
    id: 1,
    display: { name: 'Slash', unicode: '\u{1F5E1}' },
    frames: { duration: 5, active: [3] },
};
const Upswing: Action = {
    id: 2,
    display: { name: 'Upswing', unicode: '\u{1F5E1}' },
    frames: { duration: 5, active: [3] },
};
const Sidecut: Action = {
    id: 3,
    display: { name: 'Sidecut', unicode: '\u{1F5E1}' },
    frames: { duration: 5, active: [3] },
};
const Block: Action = {
    id: 4,
    display: { name: 'Block', unicode: '\u{1F6E1}' },
    frames: { duration: 3, active: [2] },
};
const MoveForward: Action = {
    id: 5,
    display: { name: 'MoveForward', unicode: '\u{1F6B6}' },
    frames: { duration: 1 },
};
const MoveBackward: Action = {
    id: 6,
    display: { name: 'MoveBackward', unicode: '\u{1F6B6}' },
    frames: { duration: 1 },
};
const DashForward: Action = {
    id: 7,
    display: { name: 'DashForward', unicode: '\u{1F406}' },
    frames: { duration: 4 },
};
const DashBackward: Action = {
    id: 8,
    display: { name: 'DashBackward', unicode: '\u{1F406}' },
    frames: { duration: 4 },
};
const StepForward: Action = {
    id: 9,
    display: { name: 'StepForward', unicode: '\u{1F43E}' },
    frames: { duration: 3 },
};
const Jump: Action = {
    id: 10,
    display: { name: 'Jump', unicode: '\u{1F998}' },
    frames: { duration: 6 },
};
const Gatotsu: Action = {
    id: 11,
    display: { name: 'Gatotsu', unicode: '' },
    frames: { duration: 8 },
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
];

const AntocRest: Action = {
    id: 0,
    display: { name: 'Rest', unicode: '\u{1F9D8}' },
    frames: { duration: 1 },
};
export const Hori: Action = {
    id: 1,
    display: { name: 'Hori', unicode: '\u{1F5E1}' },
    frames: { duration: 7, active: [2, 3] },
};
const Vert: Action = {
    id: 2,
    display: { name: 'Vert', unicode: '\u{1F5E1}' },
    frames: { duration: 10, active: [4, 5] },
};
export const AntocBlock: Action = {
    id: 3,
    display: { name: 'Block', unicode: '\u{1F6E1}' },
    frames: { duration: 6, active: [2, 3, 4, 5] },
};
const AntocMoveForward: Action = {
    id: 4,
    display: { name: 'MoveForward', unicode: '\u{1F6B6}' },
    frames: { duration: 1 },
};
export const AntocMoveBackward: Action = {
    id: 5,
    display: { name: 'MoveBackward', unicode: '\u{1F6B6}' },
    frames: { duration: 1 },
};
const AntocDashForward: Action = {
    id: 6,
    display: { name: 'DashForward', unicode: '\u{1F406}' },
    frames: { duration: 4 },
};
const AntocDashBackward: Action = {
    id: 7,
    display: { name: 'DashBackward', unicode: '\u{1F406}' },
    frames: { duration: 4 },
};
const AntocJump: Action = {
    id: 9,
    display: { name: 'Jump', unicode: '\u{1F998}' },
    frames: { duration: 6 },
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
];

export const CHARACTERS_ACTIONS = [JessicaActions, AntocActions];
