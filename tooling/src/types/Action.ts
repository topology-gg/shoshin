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
};

const RestId = 0;
const Rest: Action = {
    id: RestId,
    display: { name: 'Rest', unicode: '\u{1F9D8}' },
    frames: { duration: 1, intents: [RestId] },
    key: '-',
};

const Slash: Action = {
    id: 1,
    display: { name: 'Slash', unicode: '\u{1F5E1}' },
    frames: { duration: 5, active: [3] },
    key: 'J',
    tutorial: {
        video: './media/fight-intro.mp4',
        description: 'A medium range attack that covers a large area',
    },
};

const Upswing: Action = {
    id: 2,
    display: { name: 'Upswing', unicode: '\u{1F5E1}' },
    frames: { duration: 5, active: [3] },
    key: 'K',
    tutorial: {
        video: './media/tutorial/upswing.mp4',
        description: 'Loren ipsum and whatnot',
    },
};

const Sidecut: Action = {
    id: 3,
    display: { name: 'Sidecut', unicode: '\u{1F5E1}' },
    frames: { duration: 5, active: [3] },
    key: 'L',
    tutorial: {
        video: './media/tutorial/sidecut.mp4',
        description: 'A different lore ipsum',
    },
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
};

const JessicaMoveForwardId = 5;
const MoveForward: Action = {
    id: JessicaMoveForwardId,
    display: { name: 'MoveForward', unicode: '\u{1F6B6}' },
    frames: { duration: 1, intents: [JessicaMoveForwardId] },
    key: 'D',
};

const JessicaMoveBackwardId = 6;
const MoveBackward: Action = {
    id: JessicaMoveBackwardId,
    display: { name: 'MoveBackward', unicode: '\u{1F6B6}' },
    frames: { duration: 1, intents: [JessicaMoveBackwardId] },
    key: 'A',
};

const Jump: Action = {
    id: 9,
    display: { name: 'Jump', unicode: '\u{1F998}' },
    frames: {
        duration: 6,
        interrupts: [
            {
                right: [Sidecut.id],
                duration: 3,
            },
        ],
    },
    key: 'W',
};

const DashForward: Action = {
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
                duration: 2,
            },
            {
                right: [Sidecut.id],
                duration: 2,
            },
            {
                right: [Jump.id],
                duration: 2,
            },
        ],
    },
    key: 'E',
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
                right: [Jump.id],
                duration: 2,
            },
        ],
    },
    key: 'Q',
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
    id: RestId,
    display: { name: 'Rest', unicode: '\u{1F9D8}' },
    frames: { duration: 1, intents: [RestId] },
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
};

const AntocMoveForwardId = 4;
const AntocMoveForward: Action = {
    id: AntocMoveForwardId,
    display: { name: 'MoveForward', unicode: '\u{1F6B6}' },
    frames: { duration: 1, intents: [AntocMoveForwardId] },
    key: 'D',
};

const AntocMoveBackwardId = 4;
export const AntocMoveBackward: Action = {
    id: AntocMoveBackwardId,
    display: { name: 'MoveBackward', unicode: '\u{1F6B6}' },
    frames: { duration: 1, intents: [AntocMoveBackwardId] },
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
    frames: {
        duration: 3,
        interrupts: [
            {
                right: [Vert.id],
                duration: 2,
            },
        ],
    },
    key: 'F',
};

const AntocJump: Action = {
    id: 9,
    display: { name: 'Jump', unicode: '\u{1F998}' },
    frames: {
        duration: 7,
        interrupts: [
            {
                right: [Vert.id],
                duration: 4,
            },
            {
                right: [AntocDashForward.id],
                duration: 4,
            },
            {
                right: [AntocDashBackward.id],
                duration: 4,
            },
        ],
    },
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
