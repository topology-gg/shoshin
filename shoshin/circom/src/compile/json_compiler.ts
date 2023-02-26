import {
  CircomMapping,
  IndexedNode,
  LeafNode,
  OpTrace,
  OpCodes,
  Dag,
  DagDict,
  DagNode,
  CircomCompilerOutInfo,
} from '../types';
import {
  deepcopy,
  get_parent_node,
  has_key,
  is_leaf,
  pad_array_to_len,
  range,
} from '../utils';

const dfs_traverse = (
  parent_idx: number,
  dag: IndexedNode[]
): IndexedNode[] => {
  const depth_ordered_visited_non_leafs: IndexedNode[] = [];
  const visited: DagDict = {};

  let i = 0;
  const aug_recursive_dfs = (curr: IndexedNode) => {
    // console.log(i);
    i += 1;
    const left = curr[0][1];
    const right = curr[0][2];

    // We have a left, non-leaf child
    if (left !== -1 && !is_leaf(dag[left][0]) && !has_key(left, visited)) {
      aug_recursive_dfs(dag[left]);
      visited[left] = 1;
    }
    // We have a right child
    if (right !== -1 && !is_leaf(dag[right][0]) && !has_key(right, visited)) {
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

/**
 * @brief Compile a dag to circom inputs
 *
 * Return the circom inputs to specify the trace cells. This function also
 * pads the inputs and dict to the maximum size. The returned trace cells are also
 * padded to the maximum number of tract cells
 */
export const dag_to_circom = (
  dag: Dag,
  dict: number[],
  max_number_constants: number,
  max_number_dict_inputs: number,
  max_number_traces: number
): CircomMapping => {
  const dag_idxed = dag.map((t, i) => [t, i] as IndexedNode);

  const leave_idxs_constants = dag_idxed.filter(
    ([t, i]) => t[1] === -1 && t[2] === -1
  );

  const leave_idxs_dict = dag_idxed.filter(
    ([[op, left, right], i]) => op === OpCodes.DICT
  );

  const leave_idxs = leave_idxs_constants.concat(leave_idxs_dict);
  const n_inputs = leave_idxs.length;

  // The reverse of leave_idxs, maps circom inputs to leaves
  const leaves_to_inputs: DagDict = leave_idxs.reduce((prev_dict, leave, i) => {
    const [_tmp, leave_idx] = leave;
    prev_dict[leave_idx] = i;
    return prev_dict;
  }, {} as DagDict);

  const parent_node_idx = get_parent_node(dag_idxed);

  // Order the nodes by their depth
  const non_leaf_nodes_depth_first_traversal = dfs_traverse(
    parent_node_idx,
    dag_idxed
  );
  // Mapping node indices to their trace indices
  const nodes_to_traces = non_leaf_nodes_depth_first_traversal.reduce(
    (prev_dict, node, i) => {
      const [_tmp, node_idx] = node;
      prev_dict[node_idx] = i;
      return prev_dict;
    },
    {} as DagDict
  );

  const dag_idx_to_circom_selection_idx = (dag_idx: number) => {
    if (is_leaf(dag[dag_idx])) {
      const idx = leaves_to_inputs[dag_idx];
      if (idx >= leave_idxs_constants.length) {
        // We have a dict
        const dict_idx =
          max_number_constants +
          leave_idxs_dict[idx - leave_idxs_constants.length][0][2];
        return dict_idx; // a lookup into the input DICT
      } else {
        return idx; // a lookup into the inputs
      }
    } else if (has_key(dag_idx, nodes_to_traces)) {
      return (
        nodes_to_traces[dag_idx] + max_number_dict_inputs + max_number_constants
      );
    } else {
      throw `An unexpected error occurred, dag idx ${dag_idx} should be in the inputs (leaves) or traces`;
    }
  };

  const op_traces = non_leaf_nodes_depth_first_traversal.map(
    ([[instr, left, right], idx]) => {
      const op_code: OpCodes = instr;
      const sel_left = left === -1 ? 0 : dag_idx_to_circom_selection_idx(left);
      const sel_right =
        right === -1 ? 0 : dag_idx_to_circom_selection_idx(right);

      const sel_a = left === -1 ? sel_right : sel_left;
      const sel_b = left === -1 ? 0 : sel_right;
      return {
        sel_a,
        sel_b,
        op_code,
      };
    }
  );

  // Get the value of the leaves
  const inputs_constant = leave_idxs_constants.map(
    ([[val, _l, _r], _i]) => val
  );

  const op_traces_padded =
    op_traces.length > max_number_traces
      ? op_traces.slice(0, max_number_traces)
      : pad_array_to_len(
          op_traces,
          max_number_traces,
          range(op_traces.length, max_number_traces).map(i => {
            return {
              op_code: 0,
              sel_a: max_number_constants + max_number_dict_inputs + i - 1,
              sel_b: 0,
            };
          })
        );

  // Add info about truncation
  const compiler_info: CircomCompilerOutInfo[] = [];
  if (dict.length > max_number_dict_inputs)
    compiler_info.push(CircomCompilerOutInfo.TRUNCATED_DICT);
  if (op_traces.length > max_number_traces)
    compiler_info.push(CircomCompilerOutInfo.TRUNCATED_TRACES);

  return {
    n_inputs,
    n_traces: dag.length - n_inputs,
    op_traces: op_traces_padded,
    inputs_constant: pad_array_to_len(inputs_constant, max_number_constants, 0),
    dict:
      dict.length > max_number_dict_inputs
        ? dict.slice(0, max_number_dict_inputs)
        : pad_array_to_len(dict, max_number_dict_inputs, 0),
    compiler_info,
  };
};
