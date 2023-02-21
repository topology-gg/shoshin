# Introduction

Shoshin agents are currently represented through binary tree operators (see [bto-cairo](https://github.com/greged93/bto-cairo)). This abstraction allows the user to build up complex functions which can then evaluated in the Cairo execution loop. In this document, the basic concept of binary tree operator is presented, along with the representation of a basic agent in a JSON format.

# Binary Tree Operator

A binary tree operator is a way to abstract the representation of a user function by splitting each operation in the function into the node of a binary tree. Note that the tree is not required to be balanced. By flattening the tree and iterating the flattened representation, it is possible to execute the user inputted function.

The following example describes the translation of a user-defined function into a binary tree operator which is then flattened in order to allow it's execution in Cairo.

## Example

The below function is the user-defined input:

$$y = (a^b) * c + \frac{d}{e \ mod\ d} \le abs(g)$$

The above is then translated into the below binary tree operator:

```
            is_le
          /       \
        add       abs
       /   \        \
     mul   div       g
    / \    / \
  pow  c  d  mod
  / \        / \
 a   b      e   f
```

which can be flattened to be executed in Cairo using the following definition for a node of the tree:

```
    struct Tree {
    value: felt,
    left: felt,
    right: felt,
}
```

If `left` and `right` are different from -1, then they hold the offset to the left and right value respectively in the flattened array. If `left` and `right` are -1, then value must be taken as a constant. Keeping the above in mind, we can translate the binary tree operator into the following flattened array:

```
[{is_le, 1, 12}, {add, 1, 6}, {mul, 1, 4}, {pow, 1, 2}, {a, -1, -1}, {b, -1, -1}, {c, -1, -1}, {div, 1, 2}, {d, -1, -1}, {mod, 1, 2}, {e, -1, -1}, {f, -1, -1}, {abs, -1, 1}, {g, -1, -1}]
```

# Agent JSON representation

The below is a JSON representation of a agent:

```
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
```

## Details

In this section, the various fields from the JSON representation of the agent are descripted:

-   "states": holds the various possible states for the agent's mind. In the previous example, the mind (state machine) for the agent can take four states: "MS IDLE", "MS COMBO", "MS BLOCK" and "MS CLOSER".
-   "combos": holds the available combos the agent can execute. A combo is a series of actions that are performed by the agent in the defined order.
-   "mapping": holds a mapping used during parsing to substitute string descriptions with numerical values.
-   "initial_state": initial state of the agent when the Shoshin loop starts.
-   "mental_state_to_action": holds the mapping from agent state to intent.
-   "mental_states": holds the user-defined transition functions for each of the states. This allows the agent to transit between states based on the perceptibles he receives. The semantics for the user functions are defined in [section binary tree operator](#binary-tree-operator). As an example, the flattened function for state "MS IDLE" can be defined to the below binary tree operator:

```
                  add
          /                 \
        mul                  mul
       /   \             /         \
    func  MS BLOCK    sub            add
                      / \        /        \
                     1  mem    mul         mul
                        |     / \           / \
                        0  func  MS COMBO sub  MS CLOSER
                            |              /\
                            1             1  mem
                                              |
                                              1
```

-   "general_purpose_functions": holds the general purpose user-defined functions. These are functions which will be frequently reused across the state transition functions and are thus accessible by the transition function using the "FUNC" opcode to avoid any boilerplate implementation.
