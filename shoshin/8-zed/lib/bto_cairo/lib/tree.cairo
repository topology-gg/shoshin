%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.math import unsigned_div_rem, abs_value, sqrt
from starkware.cairo.common.math_cmp import is_nn, is_le
from starkware.cairo.common.pow import pow
from starkware.cairo.common.dict_access import DictAccess
from starkware.cairo.common.dict import dict_read

from lib.constants import ns_opcodes, ns_tree

struct Tree {
    value: felt,
    left: felt,
    right: felt,
}

namespace BinaryOperatorTree {
    // @param trees_offset The offset of each tree in the array
    // @param trees The binary operator trees to chain
    // @param mem The chain memory used to retain tree outputs
    // @param functions The dictionary used to access general purpose functions
    // @param dict The dictionary used to access additional input
    // @return The final evaluation of the binary tree operator chain
    func execute_tree_chain{range_check_ptr}(
        trees_offset_len: felt,
        trees_offset: felt*,
        trees: Tree*,
        mem_len: felt,
        mem: felt*,
        functions: DictAccess*,
        dict: DictAccess*,
    ) -> (output: felt, functions_new: DictAccess*, dict_new: DictAccess*) {
        if (trees_offset_len == 0) {
            return (output=[mem + mem_len - 1], functions_new=functions, dict_new=dict);
        }
        let (output, functions_new, dict_new, mem_len_new) = iterate_tree(
            trees, mem_len, mem, functions, dict
        );
        assert [mem + mem_len_new] = output;
        tempvar offset = [trees_offset];
        return execute_tree_chain(
            trees_offset_len=trees_offset_len - 1,
            trees_offset=trees_offset + 1,
            trees=trees + ns_tree.TREE_SIZE * offset,
            mem_len=mem_len_new + 1,
            mem=mem,
            functions=functions_new,
            dict=dict_new,
        );
    }
    // @param tree The binary operator tree to iterate
    // @param mem The memory used to retain previous tree outputs
    // @param functions The dictionary used to access general purpose functions
    // @param dict The dictionary used to access additional input
    // @return output The final evaluation of the binary tree operator
    // @return functions_new The updated dictionary pointer
    // @return dict_new The updated dictionary pointer
    // @return mem_len_new The new length of the memory
    func iterate_tree{range_check_ptr}(
        tree: Tree*, mem_len: felt, mem: felt*, functions: DictAccess*, dict: DictAccess*
    ) -> (output: felt, functions_new: DictAccess*, dict_new: DictAccess*, mem_len_new: felt) {
        alloc_locals;
        tempvar branch = tree[0];
        local value = branch.value;
        tempvar left = branch.left;
        tempvar right = branch.right;
        if (left == -1 and right == -1) {
            return (output=value, functions_new=functions, dict_new=dict, mem_len_new=mem_len);
        }
        if (value == ns_opcodes.ADD) {
            let (value_left, functions_new, dict_new, mem_len_new) = iterate_tree(
                tree + left * ns_tree.TREE_SIZE, mem_len, mem, functions, dict
            );
            let (value_right, functions_new, dict_new, mem_len_new) = iterate_tree(
                tree + right * ns_tree.TREE_SIZE, mem_len_new, mem, functions_new, dict_new
            );
            return (
                output=value_left + value_right,
                functions_new=functions_new,
                dict_new=dict_new,
                mem_len_new=mem_len_new,
            );
        }
        if (value == ns_opcodes.SUB) {
            let (value_left, functions_new, dict_new, mem_len_new) = iterate_tree(
                tree + left * ns_tree.TREE_SIZE, mem_len, mem, functions, dict
            );
            let (value_right, functions_new, dict_new, mem_len_new) = iterate_tree(
                tree + right * ns_tree.TREE_SIZE, mem_len_new, mem, functions_new, dict_new
            );
            return (
                output=value_left - value_right,
                functions_new=functions_new,
                dict_new=dict_new,
                mem_len_new=mem_len_new,
            );
        }
        if (value == ns_opcodes.MUL) {
            let (value_left, functions_new, dict_new, mem_len_new) = iterate_tree(
                tree + left * ns_tree.TREE_SIZE, mem_len, mem, functions, dict
            );
            let (value_right, functions_new, dict_new, mem_len_new) = iterate_tree(
                tree + right * ns_tree.TREE_SIZE, mem_len_new, mem, functions_new, dict_new
            );
            return (
                output=value_left * value_right,
                functions_new=functions_new,
                dict_new=dict_new,
                mem_len_new=mem_len_new,
            );
        }
        if (value == ns_opcodes.DIV) {
            let (value_left, functions_new, dict_new, mem_len_new) = iterate_tree(
                tree + left * ns_tree.TREE_SIZE, mem_len, mem, functions, dict
            );
            let (value_right, functions_new, dict_new, mem_len_new) = iterate_tree(
                tree + right * ns_tree.TREE_SIZE, mem_len_new, mem, functions_new, dict_new
            );
            let (q, _) = unsigned_div_rem(value_left, value_right);
            return (
                output=q, functions_new=functions_new, dict_new=dict_new, mem_len_new=mem_len_new
            );
        }
        if (value == ns_opcodes.MOD) {
            let (value_left, functions_new, dict_new, mem_len_new) = iterate_tree(
                tree + left * ns_tree.TREE_SIZE, mem_len, mem, functions, dict
            );
            let (value_right, functions_new, dict_new, mem_len_new) = iterate_tree(
                tree + right * ns_tree.TREE_SIZE, mem_len_new, mem, functions_new, dict_new
            );
            let (_, r) = unsigned_div_rem(value_left, value_right);
            return (
                output=r, functions_new=functions_new, dict_new=dict_new, mem_len_new=mem_len_new
            );
        }
        if (value == ns_opcodes.ABS and left == -1) {
            let (value_right, functions_new, dict_new, mem_len_new) = iterate_tree(
                tree + right * ns_tree.TREE_SIZE, mem_len, mem, functions, dict
            );
            let value = abs_value(value_right);
            return (
                output=value,
                functions_new=functions_new,
                dict_new=dict_new,
                mem_len_new=mem_len_new,
            );
        }
        if (value == ns_opcodes.SQRT and left == -1) {
            let (value_right, functions_new, dict_new, mem_len_new) = iterate_tree(
                tree + right * ns_tree.TREE_SIZE, mem_len, mem, functions, dict
            );
            let value = sqrt(value_right);
            return (
                output=value,
                functions_new=functions_new,
                dict_new=dict_new,
                mem_len_new=mem_len_new,
            );
        }
        if (value == ns_opcodes.POW) {
            let (value_left, functions_new, dict_new, mem_len_new) = iterate_tree(
                tree + left * ns_tree.TREE_SIZE, mem_len, mem, functions, dict
            );
            let (value_right, functions_new, dict_new, mem_len_new) = iterate_tree(
                tree + right * ns_tree.TREE_SIZE, mem_len_new, mem, functions_new, dict_new
            );
            let (p) = pow(value_left, value_right);
            return (
                output=p, functions_new=functions_new, dict_new=dict_new, mem_len_new=mem_len_new
            );
        }
        if (value == ns_opcodes.IS_NN and left == -1) {
            let (value_right, functions_new, dict_new, mem_len_new) = iterate_tree(
                tree + right * ns_tree.TREE_SIZE, mem_len, mem, functions, dict
            );
            let value = is_nn(value_right);
            return (
                output=value,
                functions_new=functions_new,
                dict_new=dict_new,
                mem_len_new=mem_len_new,
            );
        }
        if (value == ns_opcodes.IS_LE) {
            let (value_left, functions_new, dict_new, mem_len_new) = iterate_tree(
                tree + left * ns_tree.TREE_SIZE, mem_len, mem, functions, dict
            );
            let (value_right, functions_new, dict_new, mem_len_new) = iterate_tree(
                tree + right * ns_tree.TREE_SIZE, mem_len_new, mem, functions_new, dict_new
            );
            let value = is_le(value_left, value_right);
            return (
                output=value,
                functions_new=functions_new,
                dict_new=dict_new,
                mem_len_new=mem_len_new,
            );
        }
        if (value == ns_opcodes.NOT and left == -1) {
            let (value_right, functions_new, dict_new, mem_len_new) = iterate_tree(
                tree + right * ns_tree.TREE_SIZE, mem_len, mem, functions, dict
            );
            if (value_right == 0) {
                return (
                    output=1,
                    functions_new=functions_new,
                    dict_new=dict_new,
                    mem_len_new=mem_len_new,
                );
            }
            return (
                output=0, functions_new=functions_new, dict_new=dict_new, mem_len_new=mem_len_new
            );
        }
        if (value == ns_opcodes.EQ) {
            let (value_left, functions_new, dict_new, mem_len_new) = iterate_tree(
                tree + left * ns_tree.TREE_SIZE, mem_len, mem, functions, dict
            );
            let (value_right, functions_new, dict_new, mem_len_new) = iterate_tree(
                tree + right * ns_tree.TREE_SIZE, mem_len_new, mem, functions_new, dict_new
            );
            if (value_right == value_left) {
                return (
                    output=1,
                    functions_new=functions_new,
                    dict_new=dict_new,
                    mem_len_new=mem_len_new,
                );
            }
            return (
                output=0, functions_new=functions_new, dict_new=dict_new, mem_len_new=mem_len_new
            );
        }
        if (value == ns_opcodes.MEM and left == -1) {
            let (value_right, functions_new, dict_new, mem_len_new) = iterate_tree(
                tree + right * ns_tree.TREE_SIZE, mem_len, mem, functions, dict
            );
            with_attr error_message("incorrect input value to mem {value_right}") {
                return (
                    output=[mem + value_right],
                    functions_new=functions_new,
                    dict_new=dict_new,
                    mem_len_new=mem_len_new,
                );
            }
        }
        if (value == ns_opcodes.DICT and left == -1) {
            let (value_right, functions_new, dict_new, mem_len_new) = iterate_tree(
                tree + right * ns_tree.TREE_SIZE, mem_len, mem, functions, dict
            );
            let (value) = dict_read{dict_ptr=dict_new}(key=value_right);
            return (
                output=value,
                functions_new=functions_new,
                dict_new=dict_new,
                mem_len_new=mem_len_new,
            );
        }
        if (value == ns_opcodes.FUNC and left == -1) {
            let (value_right, functions_new, dict_new, mem_len_new) = iterate_tree(
                tree + right * ns_tree.TREE_SIZE, mem_len, mem, functions, dict
            );
            let (ptr) = dict_read{dict_ptr=functions_new}(key=value_right);
            tempvar f = cast(ptr, Tree*);
            let (output, functions_new, dict_new, mem_len_new) = iterate_tree(
                f, mem_len_new, mem, functions_new, dict_new
            );
            assert [mem + mem_len_new] = output;
            return (
                output=output,
                functions_new=functions_new,
                dict_new=dict_new,
                mem_len_new=mem_len_new + 1,
            );
        }
        with_attr error_message("unknown opcode {value}") {
            assert 0 = 1;
        }
        return (output=0, functions_new=functions, dict_new=dict, mem_len_new=mem_len);
    }
}
