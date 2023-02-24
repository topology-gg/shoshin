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
  [OpCodes.IS_LE, 1, 3],
  [OpCodes.ABS, -1, 2],
  [-10, -1, -1],
  [OpCodes.ADD, 4, 5],
  [2, -1, -1],
  [7, -1, -1],
];
