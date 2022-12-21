from dataclasses import dataclass
from typing import Union, List, Dict
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
    "FUNC": 15,
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

    def to_tuple(self):
        return (self.value, self.left, self.right)


def parse_mental_to_action(mapping: Dict, actions: List):
    return [mapping.get(a) for a in actions]


def parse_stages(mapping: Dict, state: List[List]):
    output = []
    offsets = []
    for s in state:
        offsets.append(len(s))
        offsets.append(branch_size(s))
    unpacked = []
    for s in state:
        unpacked.append(*s)
    for s in unpacked:
        s = map_values(mapping, s)
        output = output + parse_branch(s)
    return (output, offsets)


def map_values(mapping: Dict, state: Union[List, str]):
    output = []
    if type(state) is str:
        return str(mapping.get(state, state))
    for s in state:
        output.append(map_values(mapping, s))
    return output


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
    singles = ["ABS", "MEM", "DICT", "SQRT", "NOT", "IS_NN", "FUNC"]
    return branch in singles


def import_json(path: str):
    with open(path) as file:
        data = json.load(file)
    return data


def test():
    data = import_json("./experiments/agent.json")

    #
    # Mental state test
    #
    mental_states_keys = data["mental_state_to_action"].keys()
    mental_states = []
    for k in mental_states_keys:
        mental_states.append(data["mental_states"][k]["stages"])
    [output, offsets] = parse_stages(data["mapping"], mental_states)

    # test parse complete
    expected = [
        # first tree
        Node(1, 1, 5),
        Node(3, 1, 3),
        Node(15, -1, 1),
        Node(0, -1, -1),
        Node(2, -1, -1),
        Node(3, 1, 5),
        Node(2, 1, 2),
        Node(1, -1, -1),
        Node(13, -1, 1),
        Node(0, -1, -1),
        Node(1, -1, -1),
        # second tree
        Node(1, 1, 5),
        Node(3, 1, 3),
        Node(15, -1, 1),
        Node(0, -1, -1),
        Node(2, -1, -1),
        Node(3, 1, 5),
        Node(2, 1, 2),
        Node(1, -1, -1),
        Node(13, -1, 1),
        Node(0, -1, -1),
        Node(1, -1, -1),
        # third tree
        Node(1, 1, 5),
        Node(3, 1, 3),
        Node(15, -1, 1),
        Node(0, -1, -1),
        Node(2, -1, -1),
        Node(0, -1, -1),
    ]
    assert offsets == [1, 11, 1, 11, 1, 6], f"offsets error"
    assert output == expected, f"output error"

    #
    # General purpose test
    #
    general_functions = data["general_purpose_functions"]
    [output, offsets] = parse_stages(data["mapping"], general_functions)

    # test parse complete
    expected = [
        # first tree
        Node(1, 1, 5),
        Node(12, 1, 3),
        Node(14, -1, 1),
        Node(18, -1, -1),
        Node(12, -1, -1),
        # eq tree
        Node(1, 1, 5),
        Node(12, 1, 3),
        Node(14, -1, 1),
        Node(18, -1, -1),
        Node(26, -1, -1),
        # eq tree
        Node(1, 1, 5),
        Node(12, 1, 3),
        Node(14, -1, 1),
        Node(18, -1, -1),
        Node(27, -1, -1),
        # eq tree
        Node(1, 1, 5),
        Node(12, 1, 3),
        Node(14, -1, 1),
        Node(18, -1, -1),
        Node(28, -1, -1),
        # eq tree
        Node(1, 1, 5),
        Node(12, 1, 3),
        Node(14, -1, 1),
        Node(18, -1, -1),
        Node(29, -1, -1),
        # eq tree
        Node(1, 1, 5),
        Node(12, 1, 3),
        Node(14, -1, 1),
        Node(18, -1, -1),
        Node(30, -1, -1),
        # eq tree
        Node(1, 1, 5),
        Node(12, 1, 3),
        Node(14, -1, 1),
        Node(18, -1, -1),
        Node(31, -1, -1),
        # eq tree
        Node(1, 1, 5),
        Node(12, 1, 3),
        Node(14, -1, 1),
        Node(18, -1, -1),
        Node(68, -1, -1),
        # last tree
        Node(12, 1, 3),
        Node(14, -1, 1),
        Node(18, -1, -1),
        Node(73, -1, -1),
    ]
    assert offsets == [1, 44], f"offsets error"
    assert output == expected, f"output error"
