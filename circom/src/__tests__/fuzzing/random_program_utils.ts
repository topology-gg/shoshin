import { Dag, DagNode, OpCodes } from '../../types';
import { is_leaf, range, shuffle_arr } from '../../utils';

/**
 * @brief Generate a random, valid DAG whic is used for testing
 *
 * @param n_max_traces - the maximum number of traces. Realistically we will have a lot
 * less than the max as we need to "prune" isolated traces. I.e. we only keep traces which can be reached from the root
 *
 * Random DAG generation is done by having each trace cell's operation be randomly selected (where the trace cell has
 * probability `p_single_inp_trace` of being a trace cell with one child (like ABS of IS_NN). Then, each trace cell's children
 * are randomly selected amongst the inputs and prior trace cells.
 * The function then uses DFS to discard any trace cells not reachable by the root.
 * Finally, the order of the trace cells, inputs, and dict are randomized. A random dict
 * and random inputs are returned alongside the random DAG.
 */
export const gen_random_dag = (
  n_max_constants: number,
  n_max_dict: number,
  n_max_traces: number,
  p_single_inp_trace = 0.2
): { dag: Dag; dict: number[] } => {
  const n_max_nodes = n_max_constants + n_max_dict + n_max_traces;
  // We can now create a dag via a lower triangular matrix.
  // Leaves and dict will be the first rows with no children.

  const dag_ordered: DagNode[] = [];

  const gen_random_const = () => Math.floor(Math.random() * 2000) - 1000;
  const gen_random_dict_idx = () => Math.floor(Math.random() * n_max_dict);

  // Add random constants
  range(0, n_max_constants).forEach(() => {
    dag_ordered.push([gen_random_const(), -1, -1]);
  });

  range(0, n_max_dict).forEach(() => {
    dag_ordered.push([OpCodes.DICT, -1, gen_random_dict_idx()]);
  });

  for (let i = n_max_constants + n_max_dict; i < n_max_nodes; i++) {
    const sub_arr_size = Math.random() < p_single_inp_trace ? 1 : 2;
    const flip_on_edge = get_random_subarray(range(0, i), sub_arr_size);
    // flip_on_edge.forEach(child_node => (lower_triang[i][child_node] = 1));
    const opcode =
      sub_arr_size === 1
        ? get_random_single_trace_opcode()
        : get_random_double_inp_opcode();
    const left = sub_arr_size === 1 ? -1 : flip_on_edge[1];
    const right = flip_on_edge[0];

    dag_ordered.push([opcode, left, right]);
  }

  const node_hit = Array(dag_ordered.length).fill(0);
  // DFS to find dangling nodes
  const dfs_find_hit = (curr_idx: number) => {
    const node = dag_ordered[curr_idx];
    node_hit[curr_idx] = 1;
    if (!is_leaf(node)) {
      const [_op, left, right] = node;
      if (left > -1) {
        dfs_find_hit(left);
      }
      dfs_find_hit(right);
    } else {
      // Mark all leaves as hit
      node_hit[curr_idx] = 1;
    }
  };
  dfs_find_hit(dag_ordered.length - 1);

  // Now we need to prune all trace cells without a parent except the last one (the root)
  const dangling_nodes = node_hit
    .map((t, i) => [t, i])
    .filter(([t, i]) => t === 0)
    .map(([t, i]) => i);

  // We now need to shift the indices of the children of the remaining nodes
  // in order to point towards the correct nodes
  for (let i = 0; i < dag_ordered.length; i++) {
    if (!is_leaf(dag_ordered[i])) {
      const [_op, left, right] = dag_ordered[i];
      if (left !== -1) {
        // Find the first dangling index that is larger than right
        const first_left = dangling_nodes.findIndex(
          dangl_idx => dangl_idx >= left
        );
        const left_sub = first_left === -1 ? dangling_nodes.length : first_left;
        dag_ordered[i][1] -= left_sub;
      }
      // Find the first dangling index that is larger than right
      const first_right = dangling_nodes.findIndex(
        dangl_idx => dangl_idx >= right
      );
      const right_sub =
        first_right === -1 ? dangling_nodes.length : first_right;
      dag_ordered[i][2] -= right_sub;
    }
  }

  // Remove the non-root traces without any parents
  const dag_order_filtered = dag_ordered.filter(
    (_e, i) => !dangling_nodes.includes(i)
  );

  // no_paren dag_ordered.splice(i, 1)

  // Create a random mapping from ordered to unordered
  const ordered_to_random_mapping = shuffle_arr(
    range(0, dag_order_filtered.length)
  );

  // Update the opcodes `left` and `right` to point towards the randomized ordering
  for (let i = 0; i < dag_order_filtered.length; i++) {
    const [_op, left, right] = dag_order_filtered[i];
    if (!is_leaf(dag_order_filtered[i])) {
      if (left !== -1)
        dag_order_filtered[i][1] = ordered_to_random_mapping.indexOf(left);
      dag_order_filtered[i][2] = ordered_to_random_mapping.indexOf(right);
    }
  }

  const dag_randomized = ordered_to_random_mapping.map(
    i => dag_order_filtered[i]
  );
  const random_dict = range(0, n_max_dict).map(() => gen_random_const());

  return { dag: dag_randomized, dict: random_dict };
};

// From https://stackoverflow.com/questions/11935175/sampling-a-random-subset-from-an-array
const get_random_subarray = <T>(arr: T[], size: number): T[] => {
  var shuffled = arr.slice(0),
    i = arr.length,
    temp,
    index;
  while (i--) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(0, size);
};

const get_random_single_trace_opcode = () => {
  const single = [OpCodes.ABS, OpCodes.IS_NN, OpCodes.NOT];
  return single[Math.floor(Math.random() * single.length)];
};
const get_random_double_inp_opcode = () => {
  const double = [
    OpCodes.ADD,
    OpCodes.SUB,
    OpCodes.MUL,
    OpCodes.DIV,
    OpCodes.IS_LE,
    OpCodes.EQ,
  ];
  return double[Math.floor(Math.random() * double.length)];
};
