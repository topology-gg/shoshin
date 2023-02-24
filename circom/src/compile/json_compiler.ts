import {
  CircomMapping,
  IndexedNode,
  LeafNode,
  OpBuffer,
  OpCodes,
  Dag,
  DagDict,
  DagNode,
} from '../types';
import { deepcopy, get_parent_node, has_key } from '../utils';

interface CircomShoshingParams {
  INPUT_BUFFER_SIZE: number;
  CONDITIONAL_BUFFER_SIZE: number;
  CONSTS_INPUT_SIZE: number;
  PUBLIC_INPUT_SIZE: number;
  N_SIGNLE_CLAUSE_CONDITIONALS: number;
  N_OUTPUT_CONDITIONALS: number;
  N_WORD_BITS: number;
}
// Say we have each leaf

// TODO: notes
// Finding number of leaves / buffers should be straight forward
// I guess we just have to "reorder" our input such that the leaves come first, then the lowest level buffers and so on

// Okay
// 1) Traverse the dag and add all **leaves** to the starting index (with associated lookup). Also, create dup dag w/o the leaves
// 2) Do a depth ordered traversal on the dag w/o leaves to order the buffers. Use this to fill in the op_buffers

const dfs_traverse = (
  parent_idx: number,
  dag: IndexedNode[],
  leave_dict: DagDict
): IndexedNode[] => {
  const depth_ordered_visited_non_leafs: IndexedNode[] = [];
  const visited: DagDict = {};

  const aug_recursive_dfs = (curr: IndexedNode) => {
    const left = curr[0][1];
    const right = curr[0][2];

    // We have a left, non-leaf child
    if (left !== -1 && !has_key(left, leave_dict) && !has_key(left, visited)) {
      aug_recursive_dfs(dag[left]);
      visited[left] = 1;
    }
    // We have a right child
    if (
      right !== -1 &&
      !has_key(right, leave_dict) &&
      !has_key(right, visited)
    ) {
      aug_recursive_dfs(dag[right]);
      visited[right] = 1;
    }

    depth_ordered_visited_non_leafs.push(deepcopy(curr));
  };

  let parent_node = dag.find(([t, i]) => i === parent_idx);
  if (!parent_node) throw `Could not find valid parent node`;

  aug_recursive_dfs(parent_node);

  return depth_ordered_visited_non_leafs;
};

// TODO: support DAG?
export const dag_to_circom = (
  dag: Dag,
  max_number_inputs: number
): CircomMapping => {
  const dag_idxed = dag.map((t, i) => [t, i] as IndexedNode);
  const leave_idxs = dag_idxed.filter(
    ([t, i]) => t[1] === -1 && t[2] === -1
  ) as [LeafNode<number>, number][];
  const n_inputs = leave_idxs.length;

  // The reverse of leave_idxs, maps circom inputs to leaves
  const leaves_to_inputs: DagDict = leave_idxs.reduce((prev_dict, leave, i) => {
    const [_tmp, leave_idx] = leave;
    prev_dict[leave_idx] = i;
    return prev_dict;
  }, {} as DagDict);

  const parent_node_idx = get_parent_node(dag_idxed);

  // Order the nodes by their depth
  const nodes_depth_first_traversal = dfs_traverse(
    parent_node_idx,
    dag_idxed,
    leaves_to_inputs
  );
  // Mapping node indices to their buffer indices
  const nodes_to_buffers = nodes_depth_first_traversal.reduce(
    (prev_dict, node, i) => {
      const [_tmp, node_idx] = node;
      prev_dict[node_idx] = i;
      return prev_dict;
    },
    {} as DagDict
  );

  // Get the value of the leaves
  const inputs = leave_idxs.map(([[val, _l, _r], _i]) => val);

  const dag_idx_to_selection_idx = (dag_idx: number) => {
    if (has_key(dag_idx, leaves_to_inputs)) {
      return leaves_to_inputs[dag_idx];
    } else if (has_key(dag_idx, nodes_to_buffers)) {
      return nodes_to_buffers[dag_idx] + max_number_inputs;
    } else {
      throw `An unexpected error occurred, dag idx ${dag_idx} should be in the inputs (leaves) or buffers`;
    }
  };

  const op_buffers = nodes_depth_first_traversal.map(
    ([[instr, left, right], idx]) => {
      const op_code: OpCodes = instr;
      const sel_a = left === -1 ? 0 : dag_idx_to_selection_idx(left);
      const sel_b = right === -1 ? 0 : dag_idx_to_selection_idx(right);
      return {
        sel_a,
        sel_b,
        op_code,
      };
    }
  );

  return {
    n_inputs,
    n_buffers: dag.length - n_inputs,
    op_buffers,
    inputs,
  };
};
