%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.math import signed_div_rem, sqrt
from starkware.cairo.common.math_cmp import is_le
from contracts.constants import ns_dynamics

const SCALE_FP = ns_dynamics.SCALE_FP;
const SCALE_FP_SQRT = ns_dynamics.SCALE_FP_SQRT;
const RANGE_CHECK_BOUND = ns_dynamics.RANGE_CHECK_BOUND;

//
// Utility functions for fixed-point arithmetic
//
func sqrt_fp{range_check_ptr}(x: felt) -> (y: felt) {
    let x_ = sqrt(x);
    let y = x_ * SCALE_FP_SQRT;  // compensate for the square root
    return (y,);
}

func mul_fp{range_check_ptr}(a: felt, b: felt) -> (c: felt) {
    // signed_div_rem by SCALE_FP after multiplication
    tempvar product = a * b;
    let (c, _) = signed_div_rem(product, SCALE_FP, RANGE_CHECK_BOUND);
    return (c,);
}

func div_fp{range_check_ptr}(a: felt, b: felt) -> (c: felt) {
    // multiply by SCALE_FP before signed_div_rem
    tempvar a_scaled = a * SCALE_FP;
    let (c, _) = signed_div_rem(a_scaled, b, RANGE_CHECK_BOUND);
    return (c,);
}

func mul_fp_ul{range_check_ptr}(a: felt, b_ul: felt) -> (c: felt) {
    let c = a * b_ul;
    return (c,);
}

func div_fp_ul{range_check_ptr}(a: felt, b_ul: felt) -> (c: felt) {
    let (c, _) = signed_div_rem(a, b_ul, RANGE_CHECK_BOUND);
    return (c,);
}
