import { deepcopy } from '../utils';

interface CircomShoshingParams {
  INPUT_BUFFER_SIZE: number;
  CONDITIONAL_BUFFER_SIZE: number;
  CONSTS_INPUT_SIZE: number;
  PUBLIC_INPUT_SIZE: number;
  N_SIGNLE_CLAUSE_CONDITIONALS: number;
  N_OUTPUT_CONDITIONALS: number;
  N_WORD_BITS: number;
}

type Instr = OpCodes;

// Leaf index
type LeafValue = number;
type LeftNode = number;
type RightNode = number;

type TreeNode = [Instr, LeftNode, RightNode];
type LeafNode = [LeafValue, -1, -1];

type Tree = (TreeNode | LeafNode)[];

// Say we have each leaf

// TODO: notes
// Finding number of leaves / buffers should be straight forward
// I guess we just have to "reorder" our input such that the leaves come first, then the lowest level buffers and so on

// Okay
// 1) Traverse the tree and add all **leaves** to the starting index (with associated lookup). Also, create dup tree w/o the leaves
// 2) Do a depth ordered traversal on the tree w/o leaves to order the buffers. Use this to fill in the op_buffers

enum OpCodes {
  ABS = 0,
  INTEGER_DIV = 1,
  ADD = 2,
  MUL = 3,
  EQ = 4,
  LT = 5,
  LTE = 6,
  OR = 7,
}

interface OpBuffer {
  // Select input/ buffer output left
  sel_a: number;
  // Select input/ buffer output right
  sel_b: number;
  op_code: OpCodes;
}

interface CircomMapping {
  n_inputs: number;
  n_buffers: number;
  op_buffers: OpBuffer[];
  inputs: number[];
}

type TreeDict = { [leaf_key: number]: number };
type IndexedNode = [TreeNode | LeafNode, number];

const has_key = (key: number, dict: TreeDict) =>
  !(dict[key] === undefined || dict[key] === null);

const dfs_traverse = (
  parent_idx: number,
  tree: IndexedNode[],
  leave_dict: TreeDict
): IndexedNode[] => {
  const depth_ordered_visited_non_leafs: IndexedNode[] = [];
  const aug_recursive_dfs = (curr: IndexedNode) => {
    const left = curr[0][1];
    const right = curr[0][2];

    // We have a left, non-leaf child
    if (left !== -1 && !has_key(left, leave_dict)) {
      aug_recursive_dfs(tree[left]);
    }
    // We have a right child
    if (right !== -1 && !has_key(right, leave_dict)) {
      aug_recursive_dfs(tree[right]);
    }
    depth_ordered_visited_non_leafs.push(deepcopy(curr));
  };

  let parent_node = tree.find(([t, i]) => i === parent_idx);
  if (!parent_node) throw `Could not find valid parent node`;

  aug_recursive_dfs(parent_node);

  console.debug(
    `Have recursive tree ordered as ${depth_ordered_visited_non_leafs}}`
  );

  return depth_ordered_visited_non_leafs;
};

const get_parent_node = (tree_idxed: IndexedNode[]) => {
  const n_pointers_to = Array(tree_idxed.length).fill(0);

  tree_idxed.forEach(([[_, left, right], i]) => {
    if (left !== -1) n_pointers_to[left] += 1;
    if (right !== -1) n_pointers_to[right] += 1;
  });

  const idx = n_pointers_to.findIndex(x => x === 0);
  const idxRev = n_pointers_to.reverse().findIndex(x => x === 0);
  if (idx === -1) throw `No root of tree found`;
  if (idx !== idxRev)
    throw `The tree has more than one root and is thus invalid`;
  return idx;
};

const tree_to_circom = (
  parent_idx: number,
  tree: Tree,
  max_number_inputs: number
): CircomMapping => {
  const dup_tree_kv: { [ind: string]: TreeNode | LeafNode } = Object.assign(
    {},
    tree
  ) as any;

  const tree_idxed = tree.map((t, i) => [t, i] as IndexedNode);
  const leave_idxs = tree_idxed.filter(
    ([t, i]) => t[1] === -1 && t[2] === -1
  ) as [LeafNode, number][];
  const n_inputs = leave_idxs.length;

  // The reverse of leave_idxs, maps circom inputs to leaves
  const leaves_to_inputs: TreeDict = leave_idxs.reduce(
    (prev_dict, leave, i) => {
      const [_tmp, leave_idx] = leave;
      prev_dict[leave_idx] = i;
      return prev_dict;
    },
    {} as TreeDict
  );

  const parent_node_idx = get_parent_node(tree_idxed);

  // Order the nodes by their depth
  const nodes_depth_first_traversal = dfs_traverse(
    parent_node_idx,
    tree_idxed,
    leaves_to_inputs
  );
  // Mapping node indices to their buffer indices
  const nodes_to_buffers = nodes_depth_first_traversal.reduce(
    (prev_dict, node, i) => {
      const [_tmp, node_idx] = node;
      prev_dict[node_idx] = 1;
      return prev_dict;
    },
    {} as TreeDict
  );

  // Get the value of the leaves
  const inputs = leave_idxs.map(([[val, _l, _r], _i]) => val);

  const tree_idx_to_selection_idx = (tree_idx: number) => {
    if (has_key(tree_idx, leaves_to_inputs)) {
      return leaves_to_inputs[tree_idx];
    } else if (has_key(tree_idx, nodes_to_buffers)) {
      return nodes_to_buffers[tree_idx];
    } else {
      throw `An unexpected error occurred, tree idx ${tree_idx} should be in the inputs (leaves) or buffers`;
    }
  };

  const op_buffers = nodes_depth_first_traversal.map(
    ([[instr, left, right], idx]) => {
      const op_code: OpCodes = instr;
      const sel_a = left === -1 ? 0 : tree_idx_to_selection_idx(left);
      const sel_b = right === -1 ? 0 : tree_idx_to_selection_idx(right);
      return {
        sel_a,
        sel_b,
        op_code,
      };
    }
  );

  return {
    n_inputs,
    n_buffers: tree.length - n_inputs,
    op_buffers,
    inputs,
  };
};

const getCompiler = (params: CircomShoshingParams) => {
  const default_true_sel =
    params.CONDITIONAL_BUFFER_SIZE + params.N_SIGNLE_CLAUSE_CONDITIONALS;
  const default_false_sel =
    params.CONDITIONAL_BUFFER_SIZE + params.N_SIGNLE_CLAUSE_CONDITIONALS + 1;

  // Flatten a function to remove abstraction
  const flatten_FD = (shoshin_per_metnal_state: any) => {};

  /*
	 "MS BLOCK": {
            "stages": [
                ["ADD", ["MUL", [
									 			[					
                					"ADD",
                					["EQ", ["DICT", "", "110"], "BS SLASH"],
                					[
                    					"ADD",
                    					["EQ", ["DICT", "", "110"], "BS UPSWING"],
                    					["EQ", ["DICT", "", "110"], "BS SIDECUT"]
                					]
            					]
								], "MS BLOCK"], "MS IDLE"]
            ]
	*/
  const flattened_to_circom = (flattened_shoshin: any) => {};

  return {
    flatten_FD,
    flattened_to_circom,
  };
};

/**
{
    "states": ["MS IDLE", "MS COMBO", "MS BLOCK", "MS CLOSER"],
    "combos": [
        [1, 1, 1, 1, 1, 1, 1],
        [4, 4, 4, 4, 4, 4, 4],
        [1, 0, 0, 0, 0, 0]
    ],
    "mapping": {
        "MS IDLE": 0,
        "MS COMBO": 1,
        "MS BLOCK": 2,
        "MS CLOSER": 3,
        "AC IDLE": 0,
        "AC BLOCK": 3,
        "BS HORI": 10,
        "BS SLASH": 10,
        "BS VERT": 20,
        "BS UPSWING": 20,
        "BS SIDECUT": 30,
        "COMBO 1": 101,
        "COMBO 2": 102
    },
    "initial state": "MS IDLE",
    "mental_state_to_action": {
        "MS IDLE": "AC IDLE",
        "MS COMBO": "COMBO 1",
        "MS BLOCK": "AC BLOCK",
        "MS CLOSER": "COMBO 2"
    },
    "mental_states": {
        "MS IDLE": {
            "stages": [
                [
                    "ADD",
                    ["MUL", ["FUNC", "", "0"], "MS BLOCK"],
                    [
                        "MUL",
                        ["SUB", "1", ["MEM", "", "0"]],
                        [
                            "ADD",
                            ["MUL", ["FUNC", "", "1"], "MS COMBO"],
                            ["MUL", ["SUB", "1", ["MEM", "", "1"]], "MS CLOSER"]
                        ]
                    ]
                ]
            ]
        },
        "MS COMBO": {
            "stages": [
                [
                    "ADD",
                    ["MUL", ["FUNC", "", "0"], "MS BLOCK"],
                    [
                        "MUL",
                        ["SUB", "1", ["MEM", "", "0"]],
                        [
                            "ADD",
                            ["MUL", ["FUNC", "", "1"], "MS COMBO"],
                            ["MUL", ["SUB", "1", ["MEM", "", "1"]], "MS CLOSER"]
                        ]
                    ]
                ]
            ]
        },
        "MS BLOCK": {
            "stages": [
                ["ADD", ["MUL", ["FUNC", "", "0"], "MS BLOCK"], "MS IDLE"]
            ]
        },
        "MS CLOSER": {
            "stages": [
                [
                    "ADD",
                    ["MUL", ["FUNC", "", "0"], "MS BLOCK"],
                    [
                        "MUL",
                        ["SUB", "1", ["MEM", "", "0"]],
                        [
                            "ADD",
                            ["MUL", ["FUNC", "", "1"], "MS COMBO"],
                            ["MUL", ["SUB", "1", ["MEM", "", "1"]], "MS CLOSER"]
                        ]
                    ]
                ]
            ]
        }
    },
    "general_purpose_functions": [
        [
            [
                "ADD",
                ["EQ", ["DICT", "", "110"], "BS SLASH"],
                [
                    "ADD",
                    ["EQ", ["DICT", "", "110"], "BS UPSWING"],
                    ["EQ", ["DICT", "", "110"], "BS SIDECUT"]
                ]
            ]
        ],
        [
            [
                "IS_LE",
                ["ABS", "", ["SUB", ["DICT", "", "1"], ["DICT", "", "101"]]],
                "80"
            ]
        ]
    ]
}
*/
