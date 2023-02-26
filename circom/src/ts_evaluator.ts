//@ts-ignore
import {
  IndexedNode,
  IndexedNodeGen,
  LeafNode,
  OpCodes,
  Dag,
  DagGen,
  DagNode,
} from './types';
import { get_parent_node, has_key } from './utils';

const p = BigInt(
  '21888242871839275222246405745257275088548364400416034343698204186575808495617'
);

const zero = BigInt(0).valueOf();
const one = BigInt(1).valueOf();

const dag_to_big_int = (t: IndexedNode[]): IndexedNodeGen<BigInt>[] => {
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
      return val >= 0 ? one : zero;
    case OpCodes.NOT:
      return val === BigInt(0).valueOf() ? val >= one : zero;
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
      // Handle division by 0 by setting div by 0 to 0
      return b === zero
        ? zero
        : (BigInt(a).valueOf() / BigInt(b).valueOf()) % p.valueOf();
    case OpCodes.IS_LE:
      return a < b ? one : zero;
    case OpCodes.EQ:
      return a === b ? one : zero;
    default:
      throw `Opcode ${op} is not a double input opcode`;
  }
};

/**
 * @brief Evaluate the dag through DFS
 *
 * Use DFS to search through the dag. When `exiting` a node, we evaluate it.
 * Essentially, exiting a node means that all children
 */
const dfs_eval = (
  parent_idx: number,
  dag: IndexedNodeGen<BigInt>[],
  dict: BigInt[]
) => {
  const memo: { [k: number]: BigInt } = {};
  const recursive_dfs_eval = (curr: IndexedNodeGen<BigInt>): BigInt => {
    const [[val_or_op, left, right], idx] = curr;

    if (has_key(idx, memo)) return memo[idx];

    // Return the value as we have a constant
    if (left === -1 && right === -1) {
      memo[idx] = val_or_op as BigInt;
      return val_or_op as BigInt;
    }

    if (val_or_op === OpCodes.DICT) {
      memo[idx] = dict[right];
      return dict[right];
    }

    let ret = BigInt(0);
    // We have a single child node
    if (left === -1) {
      const right_val = recursive_dfs_eval(dag[right]);
      ret = BigInt(eval_single_op(val_or_op as number, right_val.valueOf()));
    }

    // We have a dual child node
    else {
      const left_val = recursive_dfs_eval(dag[left]);
      const right_val = recursive_dfs_eval(dag[right]);
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
  return recursive_dfs_eval(dag[parent_idx]);
};

// Evaluate the dag in Typescript. This is useful for fuzzing or just getting the output without the circom steps
//
// TODO: big numbers and modding over your the circom Prime
export const ts_dag_evaluator = (dag_inp: Dag, dict: number[]): BigInt => {
  const dict_big_int = dict.map(BigInt);
  const dag_idxed = dag_inp.map((t, i) => [t, i] as IndexedNode);
  const parent_idx = get_parent_node(dag_idxed);
  const dag = dag_to_big_int(dag_idxed);
  // TODO: dict...

  // DICT:
  /*

  */
  return dfs_eval(parent_idx, dag, dict_big_int);
};
