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
        // The intents of an action in a combo buffer
        intents?: number[];
        active?: number[];
        //Interrupts check if the duration in a combo is changed given the surrounding actions
        // ex : combo 1, 2, 3, 4, 5, for action 3 it is left : [1, 2], right [4, 5]
        interrupts?: {
            // the first element of `left` is the left most element(farthest from the current action)
            left?: number[];
            // the first element of `right` is the left most element(closest to the current action)
            right?: number[];
            duration: number;
            intents?: number[];
        }[];
    };
    bodyState: number;
    key: string;
    tutorial?: {
        video: string;
        description: string;
    };
}

export const defaultAction: Action = {
    id: 0,
    display: { name: 'Rest', unicode: '\u{1F9D8}' },
    frames: { duration: 1 },
    key: '-',
    bodyState: 0,
};

const RestId = 0;
const Rest: Action = {
    id: RestId,
    display: { name: 'Rest', unicode: '\u{1F9D8}' },
    frames: { duration: 1, intents: [RestId] },
    key: '-',
    bodyState: 0,
};

export const Slash: Action = {
    id: 1,
    display: { name: 'Slash', unicode: '\u{1F5E1}' },
    frames: { duration: 5, active: [3] },
    key: 'J',
    tutorial: {
        video: './media/tutorial/slash.mp4',
        description: 'A medium range attack that covers a large area',
    },
    bodyState: 10,
};

const JessicaLowKickId = 11;
export const Upswing: Action = {
    id: 2,
    display: { name: 'Upswing', unicode: '\u{1F5E1}' },
    frames: {
        duration: 8,
        active: [3],
        interrupts: [
            {
                left: [JessicaLowKickId],
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
};

export const Sidecut: Action = {
    id: 3,
    display: { name: 'Sidecut', unicode: '\u{1F5E1}' },
    frames: { duration: 5, active: [3] },
    key: 'L',
    tutorial: {
        video: './media/tutorial/sidecut.mp4',
        description: 'An short range attack that is quick and versatile',
    },
    bodyState: 30,
};

const BlockId = 4;
export const Block: Action = {
    id: BlockId,
    display: { name: 'Block', unicode: '\u{1F6E1}' },
    frames: {
        duration: 2,
        active: [2],
        intents: [BlockId, RestId],
        interrupts: [
            {
                left: [BlockId],
                right: [BlockId],
                duration: 1,
                intents: [BlockId],
            },
            //This next interrupt is actually not an interrupt, rather it just modifies the intents
            {
                right: [BlockId],
                duration: 2,
                intents: [BlockId],
            },
            {
                left: [BlockId],
                duration: 1,
                intents: [BlockId, RestId],
            },
        ],
    },
    key: 'S',
    bodyState: 40,
};

const JessicaMoveForwardId = 5;
export const MoveForward: Action = {
    id: JessicaMoveForwardId,
    display: { name: 'MoveForward', unicode: '\u{1F6B6}' },
    frames: { duration: 1, intents: [JessicaMoveForwardId] },
    key: 'D',
    bodyState: 90,
};

const JessicaMoveBackwardId = 6;
const MoveBackward: Action = {
    id: JessicaMoveBackwardId,
    display: { name: 'MoveBackward', unicode: '\u{1F6B6}' },
    frames: { duration: 1, intents: [JessicaMoveBackwardId] },
    key: 'A',
    bodyState: 100,
};

const JumpId = 9;

export const DashForward: Action = {
    id: 7,
    display: { name: 'DashForward', unicode: '\u{1F406}' },
    frames: {
        duration: 4,
        interrupts: [
            {
                right: [Slash.id],
                duration: 2,
            },
            {
                right: [Upswing.id],
                duration: 3,
            },
            {
                right: [Sidecut.id],
                duration: 2,
            },
            {
                right: [JumpId],
                duration: 2,
            },
        ],
    },
    key: 'E',
    bodyState: 110,
};

const DashBackward: Action = {
    id: 8,
    display: { name: 'DashBackward', unicode: '\u{1F406}' },
    frames: {
        duration: 4,
        interrupts: [
            {
                right: [Slash.id],
                duration: 2,
            },
            {
                right: [Upswing.id],
                duration: 2,
            },
            {
                right: [Sidecut.id],
                duration: 2,
            },
            {
                right: [JumpId],
                duration: 2,
            },
        ],
    },
    key: 'Q',
    bodyState: 120,
};

const Jump: Action = {
    id: JumpId,
    display: { name: 'Jump', unicode: '\u{1F998}' },
    frames: {
        duration: 6,
        interrupts: [
            {
                right: [Sidecut.id],
                duration: 3,
            },
            {
                right: [DashForward.id],
                duration: 3,
            },
            {
                right: [DashBackward.id],
                duration: 3,
            },
        ],
    },
    key: 'W',
    bodyState: 130,
};

export const Gatotsu: Action = {
    id: 10,
    display: { name: 'Gatotsu', unicode: '\u{1F985}' },
    frames: { duration: 7 },
    key: 'N',
    bodyState: 140,
    tutorial: {
        video: './media/tutorial/gatotsu.mp4',
        description:
            "Jessica's special attack, costing 500 (50%) rage to perform",
    },
};

export const JessicaLowKick: Action = {
    id: JessicaLowKickId,
    display: { name: 'LowKick', unicode: '\u{1F9B6}' },
    frames: {
        duration: 6,
        interrupts: [
            {
                right: [Upswing.id],
                duration: 4,
            },
            {
                right: [DashBackward.id],
                duration: 4,
            },
        ],
    },
    key: 'U',
    bodyState: 150,
    tutorial: {
        video: './media/tutorial/jessica-lowkick.mp4',
        description:
            "Kicking the opponent from a low position, which breaks opponent's blocking stance",
    },
};

export const JessicaTaunt: Action = {
    id: 12,
    display: { name: 'Taunt', unicode: '\u{1F956}' },
    frames: { duration: 33 },
    key: 'O',
    bodyState: 200,
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
    JessicaTaunt,
];

const AntocRest: Action = {
    id: RestId,
    display: { name: 'Rest', unicode: '\u{1F9D8}' },
    frames: { duration: 1, intents: [RestId] },
    key: '-',
    bodyState: 0,
};

export const Hori: Action = {
    id: 1,
    display: { name: 'Hori', unicode: '\u{1F5E1}' },
    frames: { duration: 7, active: [2, 3] },
    key: 'J',
    bodyState: 1010,
    tutorial: {
        video: './media/tutorial/hori.mp4',
        description: 'A short-range quick attack',
    },
};

const AntocStepForwardId = 8;
const AntocJumpId = 9;
const AntocDashForwardId = 6;
const AntocDashBackwardId = 7;

const VertId = 2;
const Vert: Action = {
    id: VertId,
    display: { name: 'Vert', unicode: '\u{1F5E1}' },
    frames: {
        duration: 10,
        active: [4, 5],
        interrupts: [
            {
                left: [AntocStepForwardId],
                duration: 8,
            },
            {
                left: [AntocJumpId, AntocDashForwardId],
                duration: 8,
            },
            {
                left: [AntocJumpId, AntocDashBackwardId],
                duration: 8,
            },
        ],
    },
    key: 'K',
    bodyState: 1020,
    tutorial: {
        video: './media/tutorial/vert.mp4',
        description:
            'An attack that launches the opponent into the air, giving Antoc frame advantage',
    },
};

const AntocBlockId = 3;
export const AntocBlock: Action = {
    id: AntocBlockId,
    display: { name: 'Block', unicode: '\u{1F6E1}' },
    frames: {
        duration: 2,
        active: [2],
        intents: [AntocBlockId],
        interrupts: [
            {
                left: [AntocBlockId],
                right: [AntocBlockId],
                duration: 1,
                intents: [AntocBlockId],
            },
            {
                right: [AntocBlockId],
                duration: 2,
                intents: [AntocBlockId, AntocBlockId],
            },
            {
                left: [AntocBlockId],
                duration: 2,
                intents: [AntocBlockId, RestId],
            },
        ],
    },
    key: 'S',
    bodyState: 1040,
};

const AntocMoveForwardId = 4;
const AntocMoveForward: Action = {
    id: AntocMoveForwardId,
    display: { name: 'MoveForward', unicode: '\u{1F6B6}' },
    frames: { duration: 1, intents: [AntocMoveForwardId] },
    key: 'D',
    bodyState: 1110,
};

const AntocMoveBackwardId = 4;
export const AntocMoveBackward: Action = {
    id: AntocMoveBackwardId,
    display: { name: 'MoveBackward', unicode: '\u{1F6B6}' },
    frames: { duration: 1, intents: [AntocMoveBackwardId] },
    key: 'A',
    bodyState: 1120,
};

const AntocDashForward: Action = {
    id: AntocDashForwardId,
    display: { name: 'DashForward', unicode: '\u{1F406}' },
    frames: {
        duration: 4,
        interrupts: [
            {
                left: [JumpId],
                right: [VertId],
                duration: 2,
            },
        ],
    },
    key: 'E',
    bodyState: 1100,
};

const AntocDashBackward: Action = {
    id: AntocDashBackwardId,
    display: { name: 'DashBackward', unicode: '\u{1F406}' },
    frames: {
        duration: 4,
        interrupts: [
            {
                left: [JumpId],
                right: [VertId],
                duration: 2,
            },
        ],
    },
    key: 'Q',
    bodyState: 1120,
};

const StepForward: Action = {
    id: AntocStepForwardId,
    display: { name: 'StepForward', unicode: '\u{1F43E}' },
    frames: {
        duration: 3,
        interrupts: [
            {
                right: [Vert.id],
                duration: 2,
                intents: [AntocStepForwardId, RestId],
            },
        ],
    },
    key: 'F',
    bodyState: 1090,
    tutorial: {
        video: './media/tutorial/antoc-stepforward.mp4',
        description:
            'Taking a quick step forward; can transition into Vert or dash-backward swiftly',
    },
};

const AntocJump: Action = {
    id: AntocJumpId,
    display: { name: 'Jump', unicode: '\u{1F998}' },
    frames: {
        duration: 7,
        interrupts: [
            {
                right: [Vert.id],
                duration: 3,
            },
            {
                right: [AntocDashForward.id],
                duration: 2,
            },
            {
                right: [AntocDashBackward.id],
                duration: 2,
            },
        ],
    },
    key: 'W',
    bodyState: 1150,
};

const AntocLowKickId = 11;
const AntocLowKick: Action = {
    id: AntocLowKickId,
    display: { name: 'LowKick', unicode: '\u{1F9B6}' },
    frames: {
        duration: 6,
        interrupts: [
            {
                left: [AntocStepForwardId],
                duration: 3,
                intents: [AntocLowKickId, RestId, RestId, RestId],
            },
        ],
    },
    key: 'U',
    bodyState: 1160,
    tutorial: {
        video: './media/tutorial/antoc-lowkick.mp4',
        description:
            "Kicking the opponent from a low position, which breaks opponent's blocking stance",
    },
};

const AntocCycloneId = 12;
const AntocCyclone: Action = {
    id: AntocCycloneId,
    display: { name: 'Cyclone', unicode: '\u{1F32A}' },
    frames: {
        duration: 14,
        interrupts: [],
    },
    key: 'N',
    tutorial: {
        video: './media/tutorial/antoc-cyclone.mp4',
        description:
            "Antoc's special attack, costing 500 (50%) rage to perform",
    },
    bodyState: 1220,
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
    AntocCyclone,
];

export const CHARACTERS_ACTIONS = [JessicaActions, AntocActions];

const matchLeftActions = (interrupt, index, combo) => {
    const leftInterruptsLength = interrupt.left ? interrupt.left.length : 0;
    if (leftInterruptsLength == 0) {
        return true;
    }
    if (index - leftInterruptsLength < 0) {
        return false;
    }

    return interrupt.left.every(
        (actionId, subIndex) =>
            actionId == combo[index - (leftInterruptsLength - subIndex)]?.id
    );
};

const matchRightActions = (interrupt, index, combo) => {
    const rightInterruptsLength = interrupt.right ? interrupt.right.length : 0;
    if (rightInterruptsLength == 0) {
        return true;
    }

    if (index + rightInterruptsLength >= combo.length) {
        return false;
    }

    return interrupt.right.every((actionId, subIndex) => {
        return actionId == combo[index + subIndex + 1]?.id;
    });
};

const getActionIntents = (
    action: Action,
    index: number,
    combo: Action[]
): number[] => {
    let actionIntents = action.frames.intents;

    const matchingInterrupt = action.frames.interrupts.find((interrupt) => {
        const isMatchLeft = matchLeftActions(interrupt, index, combo);
        const isMatchRight = matchRightActions(interrupt, index, combo);

        return isMatchLeft && isMatchRight;
    });

    if (matchingInterrupt !== undefined) {
        if (matchingInterrupt.intents !== undefined) {
            actionIntents = matchingInterrupt.intents;
        } else {
            const duration = matchingInterrupt.duration;
            let temp = [action.id];
            for (let i = 0; i < duration; i++) {
                temp.push(0);
            }
            actionIntents = temp;
        }
    }

    if (actionIntents == undefined) {
        actionIntents = getDefaultIntents(action);
    }
    return actionIntents;
};

export const actionIntentsInCombo = (
    action: Action,
    index: number,
    combo: Action[]
): number[] => {
    //Check if next action can interrupt the current action
    if (action.frames.interrupts !== undefined) {
        return getActionIntents(action, index, combo);
    }
    if (action.frames.intents == undefined) {
        return getDefaultIntents(action);
    }
    return action.frames.intents;
};

export const isActionBlock = (character: number, actionId: number) => {
    return (
        (character == 0 && actionId == Block.id) ||
        (character == 1 && actionId == AntocBlock.id)
    );
};

export const getDefaultIntents = (action: Action): number[] => {
    const duration = action.frames.duration;
    let temp = [action.id];
    for (let i = 0; i < duration; i++) {
        temp.push(0);
    }
    return temp;
};
