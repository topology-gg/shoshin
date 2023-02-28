import { OpCodes, Dag } from '../../types';

export const dag_simple: Dag = [
  [OpCodes.IS_LE, 1, 3],
  [OpCodes.ABS, -1, 2],
  [-10, -1, -1],
  [OpCodes.ADD, 4, 5],
  [2, -1, -1],
  [7, -1, -1],
];

export const dag_arithmetic: Dag = [
  [OpCodes.ADD, 1, 4],
  [OpCodes.MUL, 2, 3],
  [3, -1, -1],
  [2, -1, -1],
  [OpCodes.DIV, 5, 6],
  [10, -1, -1],
  [3, -1, -1],
];

// TODO:
export const dag_arithmetic_with_memo: Dag = [
  [OpCodes.ADD, 1, 4],
  [OpCodes.MUL, 2, 3],
  [3, -1, -1],
  [2, -1, -1],
  [OpCodes.DIV, 5, 1],
  [10, -1, -1],
];

export const dag_with_dict: Dag = [
  [OpCodes.ADD, 1, 4],
  [OpCodes.MUL, 2, 3],
  [OpCodes.DICT, -1, 0],
  [2, -1, -1],
  [OpCodes.DIV, 5, 1],
  [10, -1, -1],
];

export const dag_overflow_dict: Dag = [
  [OpCodes.DICT, -1, 0],
  [OpCodes.DICT, -1, 1],
  [OpCodes.DICT, -1, 2],
  [OpCodes.DICT, -1, 3],
  [OpCodes.DICT, -1, 4],
  [OpCodes.DICT, -1, 5],
  [OpCodes.DICT, -1, 6],
  [OpCodes.DICT, -1, 7],
  [OpCodes.DICT, -1, 8],
  [OpCodes.DICT, -1, 9],
  [OpCodes.DICT, -1, 10],
  [OpCodes.ADD, 0, 1],
  [OpCodes.ADD, 11, 2],
  [OpCodes.ADD, 12, 3],
  [OpCodes.ADD, 13, 4],
  [OpCodes.ADD, 14, 5],
  [OpCodes.ADD, 15, 6],
  [OpCodes.ADD, 16, 7],
  [OpCodes.ADD, 17, 8],
  [OpCodes.ADD, 18, 9],
  [OpCodes.ADD, 19, 10],
];

/**
 * An example dag with 30 traces. We assume we have 10 inputs and 10 dict inputs here
 */
export const dag_overflow_traces: Dag = [
  [-10, -2, -2],
  [OpCodes.ABS, -1, 0],
  [OpCodes.ABS, -1, 1],
  [OpCodes.ABS, -1, 2],
  [OpCodes.ABS, -1, 3],
  [OpCodes.ABS, -1, 4],
  [OpCodes.ABS, -1, 5],
  [OpCodes.ABS, -1, 6],
  [OpCodes.ABS, -1, 7],
  [OpCodes.ABS, -1, 8],
  [OpCodes.ABS, -1, 9],
  [OpCodes.ABS, -1, 10],
  [OpCodes.ABS, -1, 11],
  [OpCodes.ABS, -1, 12],
  [OpCodes.ABS, -1, 13],
  [OpCodes.ABS, -1, 14],
  [OpCodes.ABS, -1, 15],
  [OpCodes.ABS, -1, 16],
  [OpCodes.ABS, -1, 17],
  [OpCodes.ABS, -1, 18],
  [OpCodes.ABS, -1, 19],
  [OpCodes.ABS, -1, 20],
  [OpCodes.ABS, -1, 21],
  [OpCodes.ABS, -1, 22],
  [OpCodes.ABS, -1, 23],
  [OpCodes.ABS, -1, 24],
  [OpCodes.ABS, -1, 25],
  [OpCodes.ABS, -1, 26],
  [OpCodes.ABS, -1, 27],
  [OpCodes.ABS, -1, 28],
  [OpCodes.ABS, -1, 29],
  [OpCodes.ABS, -1, 30],
];
