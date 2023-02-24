import { OpCodes, Tree } from '../../types';

export const tree_simple: Tree = [
  [OpCodes.IS_LE, 1, 3],
  [OpCodes.ABS, -1, 2],
  [-10, -1, -1],
  [OpCodes.ADD, 4, 5],
  [2, -1, -1],
  [7, -1, -1],
];
