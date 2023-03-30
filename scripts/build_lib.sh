#!/bin/sh

NEW_PATH="$1"
echo "from cairo_test.lib.tree import Tree, BinaryOperatorTree
from starkware.cairo.common.dict_access import DictAccess

func execute_tree_chain{range_check_ptr}(
        trees_offset_len: felt,
        trees_offset: felt*,
        trees: Tree*,
        mem_len: felt,
        mem: felt*,
        functions: DictAccess*,
        dict: DictAccess*,
    ) -> felt {
    let (output, _, _) = BinaryOperatorTree.execute_tree_chain(
        trees_offset_len,
        trees_offset,
        trees,
        mem_len,
        mem,
        functions,
        dict,
    );
    return output;
}" > "$NEW_PATH"