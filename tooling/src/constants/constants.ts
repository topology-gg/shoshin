import { MechStatus, MechType } from "../types/MechState";
import { OPERATOR_TYPES } from "../types/Operator";
import Solution from "../types/Solution";

export const DIM = 7;
export const PROGRAM_SIZE_MAX = 40

const BLANK_SOLUTION: Solution = {
    mechs: [],
    programs: [],
    operators: []
}

const DEMO_SOLUTION_0: Solution = {
    mechs: [
        {id: 'mech0', typ: MechType.SINGLETON, status: MechStatus.OPEN, index: { x:3, y:3 }, pc_next: 0},
    ],
    programs: [
        'D,S,A,W'
    ],
    operators: []
}

const DEMO_SOLUTION_1: Solution = {
    mechs: [
        {id: 'mech0', typ: MechType.SINGLETON, status: MechStatus.OPEN, index: { x:2, y:2 }, pc_next: 0},
        {id: 'mech1', typ: MechType.SINGLETON, status: MechStatus.OPEN, index: { x:5, y:5 }, pc_next: 0},
    ],
    programs: [
        'D,S,A,W',
        'D,D,S,S,A,A,W,W',
    ],
    operators: [
        { input:[{x:1,y:0}, {x:2,y:0}], output:[{x:3,y:0}], typ:OPERATOR_TYPES.STIR},
    ]
}

const DEMO_SOLUTION_2: Solution = {
    mechs: [
        {id: 'mech0', typ: MechType.SINGLETON, status: MechStatus.OPEN, index: { x:0, y:0 }, pc_next: 0},
        {id: 'mech1', typ: MechType.SINGLETON, status: MechStatus.OPEN, index: { x:0, y:0 }, pc_next: 0},
        {id: 'mech2', typ: MechType.SINGLETON, status: MechStatus.OPEN, index: { x:3, y:0 }, pc_next: 0},
        {id: 'mech3', typ: MechType.SINGLETON, status: MechStatus.OPEN, index: { x:4, y:2 }, pc_next: 0},
        {id: 'mech4', typ: MechType.SINGLETON, status: MechStatus.OPEN, index: { x:3, y:0 }, pc_next: 0},
        {id: 'mech5', typ: MechType.SINGLETON, status: MechStatus.OPEN, index: { x:5, y:4 }, pc_next: 0},
        {id: 'mech6', typ: MechType.SINGLETON, status: MechStatus.OPEN, index: { x:6, y:5 }, pc_next: 0},
        {id: 'mech7', typ: MechType.SINGLETON, status: MechStatus.OPEN, index: { x:6, y:4 }, pc_next: 0},
        {id: 'mech8', typ: MechType.SINGLETON, status: MechStatus.OPEN, index: { x:2, y:5 }, pc_next: 0},
    ],
    programs: [
        'Z,D,X,A,Z,D,D,X,A,A',
        '_,Z,S,D,H,A,W,G,S,D,D,H,A,A,W',
        'G,D,H,A,S,G,D,H,A,W',
        'G,S,X,W,G,S,D,X,A,W',
        'G,S,S,S,X,W,W,W',
        'G,A,A,A,A,S,X,W,D,D,D,D',
        'G,S,X,W',
        'G,S,S,H,W,W',
        'G,S,D,D,D,D,X,A,A,A,W,Z,S,D,D,D,X,A,A,W,Z,S,D,D,X,A,W,Z,S,D,X,A,A,A,A,W',
    ],
    operators: [
        { input:[{x:1,y:0}, {x:2,y:0}], output:[{x:3,y:0}], typ:OPERATOR_TYPES.STIR},
        { input:[{x:1,y:1}, {x:2,y:1}], output:[{x:3,y:1}], typ:OPERATOR_TYPES.STIR},
        { input:[{x:4,y:0}, {x:4,y:1}], output:[{x:4,y:2}], typ:OPERATOR_TYPES.SHAKE},
        { input:[{x:3,y:3}, {x:4,y:3}, {x:5,y:3}], output:[{x:5,y:4},{x:6,y:4}], typ:OPERATOR_TYPES.STEAM},
        { input:[{x:1,y:5}], output:[{x:2,y:5}, {x:3,y:5},{x:4,y:5},{x:5,y:5},{x:6,y:5}], typ:OPERATOR_TYPES.SMASH},
    ]
}

export const DEMO_SOLUTIONS = [
    BLANK_SOLUTION,
    DEMO_SOLUTION_0,
    DEMO_SOLUTION_1,
    DEMO_SOLUTION_2
];

export const INSTRUCTION_ICON_MAP = {
    w: "expand_less",
    a: "chevron_left",
    s: "expand_more",
    d: "chevron_right",
    z: "add",
    x: "close",
    g: "add_circle",
    h: "cancel",
    ".": "minimize",
    _: "minimize",
};