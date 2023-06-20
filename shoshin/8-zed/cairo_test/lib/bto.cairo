%builtins range_check
from cairo_test.lib.tree import Tree, BinaryOperatorTree
from starkware.cairo.common.dict_access import DictAccess
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.default_dict import default_dict_new
from starkware.cairo.common.dict import dict_write

struct KeyValuePair {
    key: felt,
    value: felt,
}

func evaluate_condition{range_check_ptr}(
    condition_len: felt, condition: Tree*, dict_len: felt, dict: KeyValuePair*
) -> (output: felt) {
    alloc_locals;

    let (_unused_dict) = default_dict_new(default_value=0);
    let (_unused_mem) = alloc();

    let (loaded_dict) = default_dict_new(default_value=0);
    let (loaded_dict_new) = load_dict(dict_len, dict, loaded_dict);
    let (output, _, _, _) = BinaryOperatorTree.iterate_tree(
        condition, 0, _unused_mem, _unused_dict, loaded_dict_new
    );
    return (output=output);
}

func load_dict{range_check_ptr}(dict_len: felt, dict: KeyValuePair*, loaded_dict: DictAccess*) -> (
    loaded_dict_new: DictAccess*
) {
    if (dict_len == 0) {
        return (loaded_dict_new=loaded_dict);
    }
    dict_write{dict_ptr=loaded_dict}(key=dict.key, new_value=dict.value);
    return load_dict(dict_len - 1, dict + KeyValuePair.SIZE, loaded_dict);
}
