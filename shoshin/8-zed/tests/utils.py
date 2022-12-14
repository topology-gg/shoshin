from dataclasses import dataclass
from typing import Union, List
import json
import logging

LOGGER = logging.getLogger(__name__)
LOGGER.setLevel(5)

OPCODES = {
    "ADD": 1,
    "SUB": 2,
    "MUL": 3,
    "DIV": 4,
    "MOD": 5,
    "ABS": 6,
    "SQRT": 7,
    "POW": 8,
    "IS_NN": 9,
    "IS_LE": 10,
    "NOT": 11,
    "EQ": 12,
    "MEM": 13,
    "DICT": 14,
}


@dataclass
class Node:
    value: int
    left: int
    right: int

    def __init__(self, value, left, right):
        self.value = value
        self.left = left
        self.right = right

    def to_array(self):
        return [self.value, self.left, self.right]


@dataclass
class StateFunction:
    stages: list

    def __init__(self, **entries):
        self.__dict__.update(entries)


@dataclass
class StateMachine:
    inputs: List[str]
    state_function: StateFunction

    def __init__(self, **entries):
        self.__dict__.update(entries)
        self.state_function = StateFunction(**self.state_function)


def parse_stages(state: StateMachine):
    output = []
    offsets = [branch_size(s) for s in state.state_function.stages]
    offsets.append(0)
    for s in state.state_function.stages:
        output = output + parse_branch(s)
    return (output, offsets)


def parse_branch(branch: List):
    output = []
    size = branch_size(branch[1])
    right_size = size if is_single_branch(branch[0]) else size + 1
    left_size = -1 if is_single_branch(branch[0]) else 1
    output.append(Node(string_to_value(branch[0]), left_size, right_size))
    if type(branch[1]) is str and branch[1] != "":
        output.append(Node(string_to_value(branch[1]), -1, -1))
    if type(branch[1]) is list:
        output = output + parse_branch(branch[1])

    if type(branch[2]) is str and branch[2] != "":
        output.append(Node(string_to_value(branch[2]), -1, -1))
    if type(branch[2]) is list:
        output = output + parse_branch(branch[2])

    return output


def branch_size(branch):
    count = 0
    if type(branch) is str:
        return 1
    for b in branch:
        if type(b) is str:
            count += 1 if b != "" else 0
        else:
            count += branch_size(b)
    return count


def string_to_value(value: str):
    if not value.isnumeric():
        return OPCODES[value]
    return int(value)


def is_single_branch(branch: str):
    singles = ["ABS", "MEM", "DICT", "SQRT", "NOT", "IS_NN"]
    return branch in singles


def import_json(path: str):
    with open(path) as file:
        data = json.load(file)
    return data


def test():
    data = import_json("./lib/bto_cairo_git/parser/src/test/input_test.json")
    state_machine = StateMachine(**data["state_machine"])

    # test branch size
    size_0 = branch_size(state_machine.state_function.stages[0])
    size_1 = branch_size(state_machine.state_function.stages[1])
    size_2 = branch_size(state_machine.state_function.stages[2])
    assert size_0 == 44, f"branch size error"
    assert size_1 == 18, f"branch size error"
    assert size_2 == 12, f"branch size error"

    # test parse simple
    input = [
        [
            "ADD",
            [
                "MUL",
                [
                    "ADD",
                    ["EQ", ["DICT", "", "9"], "0"],
                    ["EQ", ["DICT", "", "9"], "10"],
                ],
                "10",
            ],
            ["MUL", "0", ["EQ", ["DICT", "", "9"], "3"]],
        ],
    ]
    stm = StateMachine(**{"state_function": {"stages": []}})
    stm.state_function.stages = input
    expected = [
        Node(1, 1, 12),
        Node(3, 1, 10),
        Node(1, 1, 5),
        Node(12, 1, 3),
        Node(14, -1, 1),
        Node(9, -1, -1),
        Node(0, -1, -1),
        Node(12, 1, 3),
        Node(14, -1, 1),
        Node(9, -1, -1),
        Node(10, -1, -1),
        Node(10, -1, -1),
        Node(3, 1, 2),
        Node(0, -1, -1),
        Node(12, 1, 3),
        Node(14, -1, 1),
        Node(9, -1, -1),
        Node(3, -1, -1),
    ]
    (output, offsets) = parse_stages(stm)
    assert offsets == [18, 0], f"offsets error"
    assert output == expected, f"output error"

    # test parse complete
    expected = [
        # first tree
        Node(1, 1, 5),
        Node(12, 1, 3),
        Node(14, -1, 1),
        Node(18, -1, -1),
        Node(12, -1, -1),
        Node(1, 1, 5),
        Node(12, 1, 3),
        Node(14, -1, 1),
        Node(18, -1, -1),
        Node(26, -1, -1),
        Node(1, 1, 5),
        Node(12, 1, 3),
        Node(14, -1, 1),
        Node(18, -1, -1),
        Node(27, -1, -1),
        Node(1, 1, 5),
        Node(12, 1, 3),
        Node(14, -1, 1),
        Node(18, -1, -1),
        Node(28, -1, -1),
        Node(1, 1, 5),
        Node(12, 1, 3),
        Node(14, -1, 1),
        Node(18, -1, -1),
        Node(29, -1, -1),
        Node(1, 1, 5),
        Node(12, 1, 3),
        Node(14, -1, 1),
        Node(18, -1, -1),
        Node(30, -1, -1),
        Node(1, 1, 5),
        Node(12, 1, 3),
        Node(14, -1, 1),
        Node(18, -1, -1),
        Node(31, -1, -1),
        Node(1, 1, 5),
        Node(12, 1, 3),
        Node(14, -1, 1),
        Node(18, -1, -1),
        Node(68, -1, -1),
        Node(12, 1, 3),
        Node(14, -1, 1),
        Node(18, -1, -1),
        Node(73, -1, -1),
        # second tr),
        Node(1, 1, 12),
        Node(3, 1, 10),
        Node(1, 1, 5),
        Node(12, 1, 3),
        Node(14, -1, 1),
        Node(9, -1, -1),
        Node(0, -1, -1),
        Node(12, 1, 3),
        Node(14, -1, 1),
        Node(9, -1, -1),
        Node(10, -1, -1),
        Node(10, -1, -1),
        Node(3, 1, 2),
        Node(0, -1, -1),
        Node(12, 1, 3),
        Node(14, -1, 1),
        Node(9, -1, -1),
        Node(3, -1, -1),
        # third tr),
        Node(1, 1, 8),
        Node(3, 1, 5),
        Node(2, 1, 3),
        Node(13, -1, 1),
        Node(0, -1, -1),
        Node(1, -1, -1),
        Node(13, -1, 1),
        Node(1, -1, -1),
        Node(3, 1, 2),
        Node(3, -1, -1),
        Node(13, -1, 1),
        Node(0, -1, -1),
    ]
    (output, offsets) = parse_stages(state_machine)
    assert offsets == [44, 18, 12, 0], f"offsets error"
    assert output == expected, f"output error"
