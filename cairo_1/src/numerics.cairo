// https://github.com/influenceth/cubit
use traits::Into;
use option::OptionTrait;

const ONE: felt252 = 18446744073709551616; // 2 ** 64
const ONE_u128: u128 = 18446744073709551616_u128; // 2 ** 64
const HALF_PRIME: felt252 = 1809251394333065606848661391547535052811553607665798349986546028067936010240;
const HALF_u128: u128 = 9223372036854775808_u128; // 2 ** 63

#[derive(Copy, Drop)]
struct FixedType { mag: u128, sign: bool }

trait Fixed {
    // Constructors
    fn new(mag: u128, sign: bool) -> FixedType;
    fn new_unscaled(mag: u128, sign: bool) -> FixedType;
    fn from_felt(val: felt252) -> FixedType;
    fn from_unscaled_felt(val: felt252) -> FixedType;

    // Math
    fn abs(self: FixedType) -> FixedType;
    fn ceil(self: FixedType) -> FixedType;
    fn floor(self: FixedType) -> FixedType;
    fn round(self: FixedType) -> FixedType;
}

impl FixedImpl of Fixed {
    fn new(mag: u128, sign: bool) -> FixedType {
        return FixedType { mag: mag, sign: sign };
    }

    fn new_unscaled(mag: u128, sign: bool) -> FixedType {
        return Fixed::new(mag * ONE_u128, sign);
    }

    fn from_felt(val: felt252) -> FixedType {
        let mag = integer::u128_try_from_felt252(_felt_abs(val)).unwrap();
        return Fixed::new(mag, _felt_sign(val));
    }

    fn from_unscaled_felt(val: felt252) -> FixedType {
        return Fixed::from_felt(val * ONE);
    }

    fn abs(self: FixedType) -> FixedType {
        return abs(self);
    }

    fn ceil(self: FixedType) -> FixedType {
        return ceil(self);
    }

    fn floor(self: FixedType) -> FixedType {
        return floor(self);
    }

    fn round(self: FixedType) -> FixedType {
        return round(self);
    }
}

impl FixedPartialEq of PartialEq::<FixedType> {
    #[inline(always)]
    fn eq(a: FixedType, b: FixedType) -> bool {
        return eq(a, b);
    }

    #[inline(always)]
    fn ne(a: FixedType, b: FixedType) -> bool {
        return ne(a, b);
    }
}

impl FixedAdd of Add::<FixedType> {
    fn add(a: FixedType, b: FixedType) -> FixedType {
        return add(a, b);
    }
}

impl FixedAddEq of AddEq::<FixedType> {
    #[inline(always)]
    fn add_eq(ref self: FixedType, other: FixedType) {
        self = add(self, other);
    }
}

impl FixedSub of Sub::<FixedType> {
    fn sub(a: FixedType, b: FixedType) -> FixedType {
        return sub(a, b);
    }
}

impl FixedSubEq of SubEq::<FixedType> {
    #[inline(always)]
    fn sub_eq(ref self: FixedType, other: FixedType) {
        self = Sub::sub(self, other);
    }
}

impl FixedMul of Mul::<FixedType> {
    fn mul(a: FixedType, b: FixedType) -> FixedType {
        return mul(a, b);
    }
}

impl FixedMulEq of MulEq::<FixedType> {
    #[inline(always)]
    fn mul_eq(ref self: FixedType, other: FixedType) {
        self = mul(self, other);
    }
}

impl FixedDiv of Div::<FixedType> {
    fn div(a: FixedType, b: FixedType) -> FixedType {
        return div(a, b);
    }
}

impl FixedDivEq of DivEq::<FixedType> {
    #[inline(always)]
    fn div_eq(ref self: FixedType, other: FixedType) {
        self = div(self, other);
    }
}

impl FixedPartialOrd of PartialOrd::<FixedType> {
    #[inline(always)]
    fn ge(a: FixedType, b: FixedType) -> bool {
        return ge(a, b);
    }

    #[inline(always)]
    fn gt(a: FixedType, b: FixedType) -> bool {
        return gt(a, b);
    }

    #[inline(always)]
    fn le(a: FixedType, b: FixedType) -> bool {
        return le(a, b);
    }

    #[inline(always)]
    fn lt(a: FixedType, b: FixedType) -> bool {
        return lt(a, b);
    }
}

impl FixedNeg of Neg::<FixedType> {
    #[inline(always)]
    fn neg(a: FixedType) -> FixedType {
        return neg(a);
    }
}

// INTERNAL

// Returns the sign of a signed `felt252` as with signed magnitude representation
// true = negative
// false = positive
fn _felt_sign(a: felt252) -> bool {
    return integer::u256_from_felt252(a) > integer::u256_from_felt252(HALF_PRIME);
}

// Returns the absolute value of a signed `felt252`
fn _felt_abs(a: felt252) -> felt252 {
    let a_sign = _felt_sign(a);

    if (a_sign == true) {
        return a * -1;
    } else {
        return a;
    }
}

// Ignores sign and always returns false
fn _split_unsigned(a: FixedType) -> (u128, u128) {
    return integer::u128_safe_divmod(a.mag, integer::u128_as_non_zero(ONE_u128));
}

impl FixedInto of Into::<FixedType, felt252> {
    fn into(self: FixedType) -> felt252 {
        let mag_felt = self.mag.into();

        if (self.sign == true) {
            return mag_felt * -1;
        } else {
            return mag_felt;
        }
    }
}

fn abs(a: FixedType) -> FixedType {
    return Fixed::new(a.mag, false);
}

fn add(a: FixedType, b: FixedType) -> FixedType {
    return Fixed::from_felt(a.into() + b.into());
}

fn ceil(a: FixedType) -> FixedType {
    let (div_u128, rem_u128) = _split_unsigned(a);

    if (rem_u128 == 0_u128) {
        return a;
    } else if (a.sign == false) {
        return Fixed::new_unscaled(div_u128 + 1_u128, false);
    } else {
        return Fixed::from_unscaled_felt(div_u128.into() * -1);
    }
}

fn div(a: FixedType, b: FixedType) -> FixedType {
    let res_sign = a.sign ^ b.sign;
    let (a_high, a_low) = integer::u128_wide_mul(a.mag, ONE_u128);
    let a_u256 = u256 { low: a_low, high: a_high };
    let b_u256 = u256 { low: b.mag, high: 0_u128 };
    let res_u256 = a_u256 / b_u256;

    assert(res_u256.high == 0_u128, 'result overflow');

    // Re-apply sign
    return Fixed::new(res_u256.low, res_sign);
}

fn eq(a: FixedType, b: FixedType) -> bool {
    return a.mag == b.mag & a.sign == b.sign;
}

fn ge(a: FixedType, b: FixedType) -> bool {
    if (a.sign != b.sign) {
        return !a.sign;
    } else {
        return (a.mag == b.mag) | ((a.mag > b.mag) ^ a.sign);
    }
}

fn gt(a: FixedType, b: FixedType) -> bool {
    if (a.sign != b.sign) {
        return !a.sign;
    } else {
        return (a.mag != b.mag) & ((a.mag > b.mag) ^ a.sign);
    }
}

fn floor(a: FixedType) -> FixedType {
    let (div_u128, rem_u128) = _split_unsigned(a);

    if (rem_u128 == 0_u128) {
        return a;
    } else if (a.sign == false) {
        return Fixed::new_unscaled(div_u128, false);
    } else {
        return Fixed::from_unscaled_felt(-1 * div_u128.into() - 1);
    }
}

fn le(a: FixedType, b: FixedType) -> bool {
    if (a.sign != b.sign) {
        return a.sign;
    } else {
        return (a.mag == b.mag) | ((a.mag < b.mag) ^ a.sign);
    }
}

fn lt(a: FixedType, b: FixedType) -> bool {
    if (a.sign != b.sign) {
        return a.sign;
    } else {
        return (a.mag != b.mag) & ((a.mag < b.mag) ^ a.sign);
    }
}

fn round(a: FixedType) -> FixedType {
    let (div_u128, rem_u128) = _split_unsigned(a);

    if (HALF_u128 <= rem_u128) {
        return Fixed::new(ONE_u128 * (div_u128 + 1_u128), a.sign);
    } else {
        return Fixed::new(ONE_u128 * div_u128, a.sign);
    }
}

fn mul(a: FixedType, b: FixedType) -> FixedType {
    let res_sign = a.sign ^ b.sign;
    let (high, low) = integer::u128_wide_mul(a.mag, b.mag);
    let res_u256 = u256 { low: low, high: high };
    let ONE_u256 = u256 { low: ONE_u128, high: 0_u128 };
    let (scaled_u256, r) = integer::u256_safe_divmod(res_u256, integer::u256_as_non_zero(ONE_u256));

    assert(scaled_u256.high == 0_u128, 'result overflow');

    // Re-apply sign
    return Fixed::new(scaled_u256.low, res_sign);
}

fn ne(a: FixedType, b: FixedType) -> bool {
    return a.mag != b.mag | a.sign != b.sign;
}

fn neg(a: FixedType) -> FixedType {
    if (a.sign == false) {
        return Fixed::new(a.mag, true);
    } else {
        return Fixed::new(a.mag, false);
    }
}

fn sub(a: FixedType, b: FixedType) -> FixedType {
    return Fixed::from_felt(a.into() - b.into());
}