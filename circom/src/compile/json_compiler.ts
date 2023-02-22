interface CircomShoshingParams {
  INPUT_BUFFER_SIZE: number;
  CONDITIONAL_BUFFER_SIZE: number;
  CONSTS_INPUT_SIZE: number;
  PUBLIC_INPUT_SIZE: number;
  N_SIGNLE_CLAUSE_CONDITIONALS: number;
  N_OUTPUT_CONDITIONALS: number;
  N_WORD_BITS: number;
}

interface TreeLeaf {
  e: 'Leaf';
}

type Instr = string;

// Leaf index
type LeafMemLookupIdx = number;
type LeftNode = number;
type RightNode = number;

type TreeNode = [Instr, LeftNode, RightNode];
type LeafNode = [LeafMemLookupIdx, -1, -1];

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
}

const treeToMappings = (tree: Tree): CircomMapping => {};

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
