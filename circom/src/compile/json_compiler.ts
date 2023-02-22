interface CircomShoshingParams {
  INPUT_BUFFER_SIZE: number;
  CONDITIONAL_BUFFER_SIZE: number;
  CONSTS_INPUT_SIZE: number;
  PUBLIC_INPUT_SIZE: number;
  N_SIGNLE_CLAUSE_CONDITIONALS: number;
  N_OUTPUT_CONDITIONALS: number;
  N_WORD_BITS: number;
}

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
