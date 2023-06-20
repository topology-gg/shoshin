from starkware.cairo.common.dict_access import DictAccess
from starkware.cairo.common.dict import dict_write
from starkware.cairo.common.memcpy import memcpy
from starkware.cairo.common.alloc import alloc
from cairo_test.lib.tree import Tree
from cairo_test.lib.constants import ns_tree

func fill_dictionary_offsets{range_check_ptr}(
    tree_dict: DictAccess*,
    offsets_dict: DictAccess*,
    offsets_len: felt,
    offsets: felt*,
    tree: Tree*,
    i: felt,
) -> (tree_dict_new: DictAccess*, offsets_dict_new: DictAccess*) {
    alloc_locals;
    if (offsets_len == 0) {
        return (tree_dict_new=tree_dict, offsets_dict_new=offsets_dict);
    }
    dict_write{dict_ptr=tree_dict}(key=i, new_value=cast(tree, felt));

    tempvar amount_trees = [offsets];
    let (local arr) = alloc();
    memcpy(arr, offsets, amount_trees);
    assert [arr + amount_trees] = 0;
    dict_write{dict_ptr=offsets_dict}(key=i, new_value=cast(arr, felt));
    let sum = sum_arr(amount_trees, 0, offsets + 1);

    return fill_dictionary_offsets(
        tree_dict,
        offsets_dict,
        offsets_len - 1 - amount_trees,
        offsets + 1 + amount_trees,
        tree + sum * ns_tree.TREE_SIZE,
        i + 1,
    );
}

func fill_dictionary{range_check_ptr}(
    dict: DictAccess*, offsets_len: felt, offsets: felt*, tree: Tree*, i: felt
) -> (dict_new: DictAccess*) {
    if (offsets_len == 0) {
        return (dict_new=dict);
    }
    dict_write{dict_ptr=dict}(key=i, new_value=cast(tree, felt));

    tempvar offset = [offsets];

    return fill_dictionary(
        dict, offsets_len - 1, offsets + 1, tree + offset * ns_tree.TREE_SIZE, i + 1
    );
}

func sum_arr{range_check_ptr}(len: felt, sum: felt, arr: felt*) -> felt {
    if (len == 0) {
        return sum;
    }
    return sum_arr(len - 1, sum + [arr], arr + 1);
}
