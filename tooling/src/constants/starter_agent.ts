import Agent, { buildAgent } from "../types/Agent";
import { Direction, Tree } from "../types/Tree";

const conditions = [
    {
        elements: [
            {
                value: "(",
                type: "Operator",
            },
            {
                value: "Abs(",
                type: "Operator",
            },
            {
                value: "(",
                type: "Operator",
            },
            {
                value: 1,
                type: "Perceptible",
            },
            {
                value: "-",
                type: "Operator",
            },
            {
                value: 101,
                type: "Perceptible",
            },
            {
                value: ")",
                type: "Operator",
            },
            {
                value: "|",
                type: "Operator",
            },
            {
                value: "<=",
                type: "Operator",
            },
            {
                value: 80,
                type: "Constant",
            },
            {
                value: ")",
                type: "Operator",
            },
        ],
        key: "0",
        displayName: "close",
    },
    {
        elements: [
            {
                value: 80,
                type: "Constant",
            },
            {
                value: "<=",
                type: "Operator",
            },
            {
                value: "Abs(",
                type: "Operator",
            },
            {
                value: "(",
                type: "Operator",
            },
            {
                value: 1,
                type: "Perceptible",
            },
            {
                value: "-",
                type: "Operator",
            },
            {
                value: 101,
                type: "Perceptible",
            },
            {
                value: ")",
                type: "Operator",
            },
            {
                value: "|",
                type: "Operator",
            },
        ],
        displayName: "not_close",
        key: "1",
    },
    {
        elements: [
            {
                value: "(",
                type: "Operator",
            },
            {
                value: "(",
                type: "Operator",
            },
            {
                value: "(",
                type: "Operator",
            },
            {
                value: 110,
                type: "Perceptible",
            },
            {
                value: "==",
                type: "Operator",
            },
            {
                value: 10,
                type: "BodyState",
            },
            {
                value: ")",
                type: "Operator",
            },
            {
                value: "OR",
                type: "Operator",
            },
            {
                value: "(",
                type: "Operator",
            },
            {
                value: "(",
                type: "Operator",
            },
            {
                value: 110,
                type: "Perceptible",
            },
            {
                value: "==",
                type: "Operator",
            },
            {
                value: 20,
                type: "BodyState",
            },
            {
                value: ")",
                type: "Operator",
            },
            {
                value: "OR",
                type: "Operator",
            },
            {
                value: "(",
                type: "Operator",
            },
            {
                value: "(",
                type: "Operator",
            },
            {
                value: 110,
                type: "Perceptible",
            },
            {
                value: "==",
                type: "Operator",
            },
            {
                value: 30,
                type: "BodyState",
            },
            {
                value: ")",
                type: "Operator",
            },
            {
                value: "OR",
                type: "Operator",
            },
            {
                value: "(",
                type: "Operator",
            },
            {
                value: "(",
                type: "Operator",
            },
            {
                value: 110,
                type: "Perceptible",
            },
            {
                value: "==",
                type: "Operator",
            },
            {
                value: 1010,
                type: "BodyState",
            },
            {
                value: ")",
                type: "Operator",
            },
            {
                value: "OR",
                type: "Operator",
            },
            {
                value: "(",
                type: "Operator",
            },
            {
                value: 110,
                type: "Perceptible",
            },
            {
                value: "==",
                type: "Operator",
            },
            {
                value: 1020,
                type: "BodyState",
            },
            {
                value: ")",
                type: "Operator",
            },
            {
                value: ")",
                type: "Operator",
            },
            {
                value: ")",
                type: "Operator",
            },
            {
                value: ")",
                type: "Operator",
            },
            {
                value: ")",
                type: "Operator",
            },
            {
                value: "AND",
                type: "Operator",
            },
            {
                value: "(",
                type: "Operator",
            },
            {
                value: "Abs(",
                type: "Operator",
            },
            {
                value: "(",
                type: "Operator",
            },
            {
                value: 1,
                type: "Perceptible",
            },
            {
                value: "-",
                type: "Operator",
            },
            {
                value: 101,
                type: "Perceptible",
            },
            {
                value: ")",
                type: "Operator",
            },
            {
                value: "|",
                type: "Operator",
            },
            {
                value: "<=",
                type: "Operator",
            },
            {
                value: 80,
                type: "Constant",
            },
            {
                value: ")",
                type: "Operator",
            },
            {
                value: ")",
                type: "Operator",
            },
        ],
        key: "2",
        displayName: "close_and_opp_attacking",
    },
    {
        elements: [
            {
                value: "!",
                type: "Operator",
            },
            {
                value: "(",
                type: "Operator",
            },
            {
                value: "(",
                type: "Operator",
            },
            {
                value: 110,
                type: "Perceptible",
            },
            {
                value: "==",
                type: "Operator",
            },
            {
                value: 10,
                type: "BodyState",
            },
            {
                value: ")",
                type: "Operator",
            },
            {
                value: "OR",
                type: "Operator",
            },
            {
                value: "(",
                type: "Operator",
            },
            {
                value: 110,
                type: "Perceptible",
            },
            {
                value: "==",
                type: "Operator",
            },
            {
                value: 20,
                type: "BodyState",
            },
            {
                value: ")",
                type: "Operator",
            },
            {
                value: "OR",
                type: "Operator",
            },
            {
                value: "(",
                type: "Operator",
            },
            {
                value: 110,
                type: "Perceptible",
            },
            {
                value: "==",
                type: "Operator",
            },
            {
                value: 30,
                type: "BodyState",
            },
            {
                value: ")",
                type: "Operator",
            },
            {
                value: "OR",
                type: "Operator",
            },
            {
                value: "(",
                type: "Operator",
            },
            {
                value: 110,
                type: "Perceptible",
            },
            {
                value: "==",
                type: "Operator",
            },
            {
                value: 1010,
                type: "BodyState",
            },
            {
                value: ")",
                type: "Operator",
            },
            {
                value: "OR",
                type: "Operator",
            },
            {
                value: "(",
                type: "Operator",
            },
            {
                value: 110,
                type: "Perceptible",
            },
            {
                value: "==",
                type: "Operator",
            },
            {
                value: 1020,
                type: "BodyState",
            },
            {
                value: ")",
                type: "Operator",
            },
            {
                value: ")",
                type: "Operator",
            },
        ],
        displayName: "opp_not_attacking",
        key: "3",
    },
    {
        elements: [
            {
                value: "(",
                type: "Operator",
            },
            {
                value: 110,
                type: "Perceptible",
            },
            {
                value: "==",
                type: "Operator",
            },
            {
                value: 40,
                type: "BodyState",
            },
            {
                value: ")",
                type: "Operator",
            },
            {
                value: "OR",
                type: "Operator",
            },
            {
                value: "(",
                type: "Operator",
            },
            {
                value: 110,
                type: "Perceptible",
            },
            {
                value: "==",
                type: "Operator",
            },
            {
                value: 1040,
                type: "BodyState",
            },
            {
                value: ")",
                type: "Operator",
            },
        ],
        key: "4",
        displayName: "blocking",
    },
    {
        elements: [
            {
                value: "(",
                type: "Operator",
            },
            {
                value: 9,
                type: "Perceptible",
            },
            {
                value: "<=",
                type: "Operator",
            },
            {
                value: 300,
                type: "Constant",
            },
            {
                value: ")",
                type: "Operator",
            },
        ],
        key: "5",
        displayName: "self_low_stamina",
    },
    {
        elements: [
            {
                value: "(",
                type: "Operator",
            },
            {
                value: 109,
                type: "Perceptible",
            },
            {
                value: "<=",
                type: "Operator",
            },
            {
                value: 300,
                type: "Constant",
            },
            {
                value: ")",
                type: "Operator",
            },
        ],
        key: "6",
        displayName: "opp_low_stamina",
    },
];

const trees: Tree[] = [
    {
        nodes: [
            {
                id: "0",
                isChild: false,
            },
            {
                id: "Attack",
                isChild: true,
                branch: Direction.Left,
            },
            {
                id: "Start",
                isChild: true,
                branch: Direction.Right,
            },
        ],
    },
    {
        nodes: [
            {
                id: "2",
                isChild: false,
            },
            {
                id: "Defend",
                isChild: true,
                branch: Direction.Left,
            },
            {
                id: "Attack",
                isChild: true,
                branch: Direction.Right,
            },
        ],
    },
    {
        nodes: [
            {
                id: "6",
                isChild: false,
            },
            {
                id: "Defend",
                isChild: true,
                branch: Direction.Left,
            },
            {
                id: "Attack",
                isChild: true,
                branch: Direction.Right,
            },
        ],
    },

    {
        nodes: [
            {
                id: "0",
                isChild: false,
            },
            {
                id: "Ignore",
                isChild: true,
                branch: Direction.Left,
            },
            {
                id: "1",
                isChild: false,
            },
            {
                id: "Ignore",
                isChild: true,
                branch: Direction.Left,
            },
            {
                id: "2",
                isChild: false,
            },
            {
                id: "Ignore",
                isChild: true,
                branch: Direction.Left,
            },
            {
                id: "3",
                isChild: false,
            },
            {
                id: "Ignore",
                isChild: true,
                branch: Direction.Left,
            },
            {
                id: "4",
                isChild: false,
            },
            {
                id: "Ignore",
                isChild: true,
                branch: Direction.Left,
            },
            {
                id: "5",
                isChild: false,
            },
            {
                id: "Ignore",
                isChild: true,
                branch: Direction.Left,
            },
            {
                id: "6",
                isChild: false,
            },
            {
                id: "Ignore",
                isChild: true,
                branch: Direction.Left,
            },
            {
                id: "Ignore",
                isChild: true,
                branch: Direction.Right,
            },
        ],
    },
];

const mentalStates = [
    { state: "Start", action: 0 },
    { state: "Attack", action: 0 },
    { state: "Defend", action: 0 },
    { state: "Ignore", action: 0 },
];

export const INITIAL_AGENT_COMPONENTS = {
    mentalStates,
    trees,
    conditions,
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
