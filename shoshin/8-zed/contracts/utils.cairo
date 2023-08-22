%lang starknet

from starkware.cairo.common.dict_access import DictAccess
from starkware.cairo.common.dict import dict_write
from starkware.cairo.common.memcpy import memcpy
from starkware.cairo.common.alloc import alloc
from lib.bto_cairo_git.lib.tree import Tree
from lib.bto_cairo_git.lib.constants import ns_tree
from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.hash import hash2
from starkware.cairo.common.math import assert_not_zero, unsigned_div_rem, split_felt


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

//
// Get hard-to-predict values as pseudorandom number
// Credit: @eth_worm at https://github.com/dopedao/RYO/blob/main/contracts/GameEngineV1.cairo
//
func get_prn {hash_ptr: HashBuiltin*, range_check_ptr} (
    old_seed: felt,
    entropy : felt
) -> (
    new_seed : felt
){
    alloc_locals;
    let (hash_ptr: HashBuiltin*) = alloc();
    // Seed is fed to linear congruential generator.
    // seed = (multiplier * seed + increment) % modulus.
    // Params from GCC. (https://en.wikipedia.org/wiki/Linear_congruential_generator).
    // Snip in half to a manageable size for unsigned_div_rem.
    let (_, low) = split_felt (old_seed);
    let (_, new_seed_) = unsigned_div_rem (1103515245 * low + 1, 2**31);

    // Number has form: 10**9 (xxxxxxxxxx).
    // Should be okay to write multiple times to same variable
    // without increasing storage costs of this transaction.
    if (entropy == 0){
        return (new_seed = new_seed_);
    } else {
        let (new_seed) = hash2 {hash_ptr=hash_ptr} (new_seed_, entropy);
        return (new_seed = new_seed);
    }
}

func get_prn_mod {hash_ptr: HashBuiltin*, range_check_ptr} (
    old_seed: felt,
    entropy : felt,
    mod : felt,
) -> (
    new_seed : felt,
    new_seed_mod: felt,
){
    alloc_locals;

    with_attr error_message ("get_prn_mod(): mod = 0 is not allowed") {
        assert_not_zero (mod);
    }

    let (new_seed) = get_prn (old_seed, entropy);

    // split in half, then modulo
    let (_, prn_low) = split_felt (new_seed);
    let (_, new_seed_mod) = unsigned_div_rem (prn_low, mod);

    return (
        new_seed = new_seed,
        new_seed_mod = new_seed_mod
    );
}
