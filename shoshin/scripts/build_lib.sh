#!/bin/sh

NEW_PATH="$1"
echo "
%builtins range_check
from cairo_test.lib.tree import Tree, BinaryOperatorTree
from starkware.cairo.common.dict_access import DictAccess
from starkware.cairo.common.default_dict import default_dict_new
from starkware.cairo.common.dict import dict_write

struct KeyValuePair {
    key: felt,
    value: felt,
}

func evaluate_condition{range_check_ptr}(
    condition_len: felt,
    condition: Tree*,
    mem_len: felt,
    mem: felt*,
    dict_len: felt,
    dict: KeyValuePair*,
) -> (output: felt, mem_len: felt, mem: felt*) {
    alloc_locals;

    let (_unused) = default_dict_new(default_value=0);

    let (loaded_dict) = default_dict_new(default_value=0);
    let (loaded_dict_new) = load_dict(dict_len, dict, loaded_dict);
    let (output, _, _, mem_len_new) = BinaryOperatorTree.iterate_tree(
        condition,
        mem_len,
        mem,
        _unused,
        loaded_dict_new,
    );
    return (output=output, mem_len=mem_len_new, mem=mem);
}

func load_dict{range_check_ptr}(dict_len: felt, dict: KeyValuePair*, loaded_dict: DictAccess*) -> (loaded_dict_new: DictAccess*) {
    if (dict_len == 0) {
        return (loaded_dict_new=loaded_dict);
    }
    dict_write{dict_ptr=loaded_dict}(key=dict.key, new_value=dict.value);
    return load_dict(dict_len - 1, dict + KeyValuePair.SIZE, loaded_dict);
}

" > "$NEW_PATH"