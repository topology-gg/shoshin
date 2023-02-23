//@ts-ignore
import {
  IndexedNode,
  IndexedNodeGen,
  LeafNode,
  Tree,
  TreeGen,
  TreeNode,
} from './types';

const p = BigInt(
  '21888242871839275222246405745257275088548364400416034343698204186575808495617'
);
const tree_to_big_int = (t: Tree): TreeGen<BigInt> => {
  return t.map(
    ([val_or_op, left, right]) =>
      [
        left === -1 && right === -1 ? BigInt(val_or_op) : val_or_op,
        left,
        right,
      ] as TreeNode | LeafNode<BigInt>
  );
};

/**
 * @brief Evaluate the tree through DFS
 *
 * Use DFS to search through the tree. When `exiting` a node, we evaluate it.
 * Essentially, exiting a node means that all children
 */
const dfs_eval = (parent_idx: number, tree: IndexedNodeGen<BigInt>) => {
  const recursive_dfs_eval = (curr: IndexedNodeGen<BigInt>) => {
    const [[val_or_op, left, right], idx] = curr;

    // Return the value
    if (left === -1 && right === -1) return val_or_op as BigInt;

    // We have a left, non-leaf child
    if (left !== -1 && !has_key(left, leave_dict)) {
      recursive_dfs_eval(tree[left]);
    }
    // We have a right child
    if (right !== -1 && !has_key(right, leave_dict)) {
      aug_recursive_dfs(tree[right]);
    }
    depth_ordered_visited_non_leafs.push(deepcopy(curr));
  };
};

// Evaluate the tree in Typescript. This is useful for fuzzing or just getting the output without the circom steps
//
// TODO: big numbers and modding over your the circom Prime
export const ts_tree_evaluator = (tree_inp: Tree) => {
  const tree: TreeGen<BigInt> = tree_to_big_int(tree_inp);
};
