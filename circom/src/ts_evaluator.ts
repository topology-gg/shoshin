//@ts-ignore
import {
  IndexedNode,
  IndexedNodeGen,
  LeafNode,
  OpCodes,
  Tree,
  TreeGen,
  TreeNode,
} from './types';
import { get_parent_node, has_key } from './utils';

const p = BigInt(
  '21888242871839275222246405745257275088548364400416034343698204186575808495617'
);
const tree_to_big_int = (t: IndexedNode[]): IndexedNodeGen<BigInt>[] => {
  return t.map(
    ([[val_or_op, left, right], idx]) =>
      [
        [
          left === -1 && right === -1 ? BigInt(val_or_op) : val_or_op,
          left,
          right,
        ],
        idx,
      ] as IndexedNodeGen<BigInt>
  );
};

const eval_single_op = (op: OpCodes, val: bigint) => {
  switch (op) {
    case OpCodes.ABS:
      return val < 0 ? val * BigInt(-1) : val;
      break;
    case OpCodes.IS_NN:
      return val >= 0 ? 1 : 0;
    case OpCodes.NOT:
      return val === BigInt(0).valueOf() ? val >= 1 : 0;
    default:
      throw `Opcode ${op} is not a single input opcode`;
  }
};

const eval_double_inp_op = (op: OpCodes, a: bigint, b: bigint) => {
  switch (op) {
    case OpCodes.ADD:
      return (a + b) % p.valueOf();
    case OpCodes.SUB:
      return a - (b % p.valueOf());
    case OpCodes.MUL:
      return (a * b) % p.valueOf();
    case OpCodes.DIV:
      // Automatically gives integer division as we are working with big ints
      return (BigInt(a).valueOf() / BigInt(b).valueOf()) % p.valueOf();
    case OpCodes.IS_LE:
      return a < b ? 1 : 0;
    case OpCodes.EQ:
      return a === b ? 1 : 0;
    default:
      throw `Opcode ${op} is not a double input opcode`;
  }
};

/**
 * @brief Evaluate the tree through DFS
 *
 * Use DFS to search through the tree. When `exiting` a node, we evaluate it.
 * Essentially, exiting a node means that all children
 */
const dfs_eval = (parent_idx: number, tree: IndexedNodeGen<BigInt>[]) => {
  const memo: { [k: number]: BigInt } = {};
  const recursive_dfs_eval = (curr: IndexedNodeGen<BigInt>): BigInt => {
    const [[val_or_op, left, right], idx] = curr;

    if (has_key(idx, memo)) return memo[idx];

    // Return the value
    if (left === -1 && right === -1) {
      memo[idx] = val_or_op as BigInt;
      return val_or_op as BigInt;
    }

    let ret = BigInt(0);
    // We have a single child node
    if (left === -1) {
      const right_val = recursive_dfs_eval(tree[right]);
      ret = BigInt(eval_single_op(val_or_op as number, right_val.valueOf()));
    }

    // We have a dual child node
    else {
      const left_val = recursive_dfs_eval(tree[left]);
      const right_val = recursive_dfs_eval(tree[right]);
      ret = BigInt(
        eval_double_inp_op(
          val_or_op as number,
          left_val.valueOf(),
          right_val.valueOf()
        )
      );
    }
    memo[idx] = ret;
    return ret;
  };
  return recursive_dfs_eval(tree[parent_idx]);
};

// Evaluate the tree in Typescript. This is useful for fuzzing or just getting the output without the circom steps
//
// TODO: big numbers and modding over your the circom Prime
export const ts_tree_evaluator = (tree_inp: Tree): BigInt => {
  const tree_idxed = tree_inp.map((t, i) => [t, i] as IndexedNode);
  const parent_idx = get_parent_node(tree_idxed);
  const tree = tree_to_big_int(tree_idxed);
  return dfs_eval(parent_idx, tree);
};
