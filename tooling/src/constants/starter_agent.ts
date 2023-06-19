import Agent, { buildAgent } from '../types/Agent';
import { Direction, Tree } from '../types/Tree';

const conditions = [
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
        key: '0',
        displayName: 'closer than 80',
        type: 'spacing',
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
        key: '1',
        displayName: 'closer than 100',
        type: 'spacing',
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
        key: '2',
        displayName: 'closer than 120',
        type: 'spacing',
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
        ],
        displayName: 'they are attacking',
        key: '3',
        type: 'their state',
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
        key: '4',
        displayName: 'they are blocking',
        type: 'their state',
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
        key: '5',
        displayName: 'my stamina lower than 200',
        type: 'my stats',
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
        key: '6',
        displayName: 'my stamina lower than 300',
        type: 'my stats',
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
        key: '7',
        displayName: 'my stamina lower than 400',
        type: 'my stats',
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
        key: '8',
        displayName: 'my stamina lower than 500',
        type: 'my stats',
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
        key: '9',
        displayName: 'their stamina lower than 200',
        type: 'their stats',
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
        key: '10',
        displayName: 'their stamina lower than 300',
        type: 'their stats',
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
        key: '11',
        displayName: 'their stamina lower than 400',
        type: 'their stats',
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
        key: '12',
        displayName: 'their stamina lower than 500',
        type: 'their stats',
    },
];

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
