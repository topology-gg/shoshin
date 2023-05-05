use box::BoxTrait;
use nullable::nullable_from_box;
use option::OptionTrait;
use traits::Into;
use traits::TryInto;
// ====================== INT 129 ======================

// i129 represents a 129-bit integer.
// The inner field holds the absolute value of the integer.
// The sign field is true for negative integers, and false for non-negative integers.
#[derive(Copy, Drop)]
struct i129 {
    inner: u128,
    sign: bool,
}

/// i129 trait
trait i129Trait {
    fn new<T, impl TIntoU128: Into<T, u128>>(inner: T) -> i129;
    fn zero() -> i129;
    fn one() -> i129;
}

impl i129Impl of i129Trait {
    fn new<T, impl TIntoU128: Into<T, u128>>(inner: T) -> i129 {
        i129 { inner: inner.into(), sign: bool::False(()) }
    }
    fn zero() -> i129 {
        i129 { inner: 0_u128, sign: bool::False(()) }
    }
    fn one() -> i129 {
        i129 { inner: 1_u128, sign: bool::False(()) }
    }
}

impl i129IntoFelt252 of Into<i129, felt252> {
    fn into(self: i129) -> felt252 {
        Into::<u128, felt252>::into(self.inner)
    }
}

impl i129IntoUsize of Into<i129, usize> {
    fn into(self: i129) -> usize {
        Into::<u128, felt252>::into(self.inner).try_into().unwrap()
    }
}

impl i129IntoNullable of Into<i129, Nullable<i129>> {
    fn into(self: i129) -> Nullable<i129> {
        nullable_from_box(BoxTrait::new(self))
    }
}

// Checks if the given i129 integer is zero and has the correct sign.
// # Arguments
// * `x` - The i129 integer to check.
// # Panics
// Panics if `x` is zero and has a sign that is not false.
fn i129_check_sign_zero(x: i129) {
    if x.inner == 0 {
        assert(x.sign == false, 'sign of 0 must be false');
    }
}

// Adds two i129 integers.
// # Arguments
// * `a` - The first i129 to add.
// * `b` - The second i129 to add.
// # Returns
// * `i129` - The sum of `a` and `b`.
fn i129_add(a: i129, b: i129) -> i129 {
    i129_check_sign_zero(a);
    i129_check_sign_zero(b);
    // If both integers have the same sign, 
    // the sum of their absolute values can be returned.
    if a.sign == b.sign {
        let sum = a.inner + b.inner;
        return i129 { inner: sum, sign: a.sign };
    } else {
        // If the integers have different signs, 
        // the larger absolute value is subtracted from the smaller one.
        let (larger, smaller) = if a.inner >= b.inner {
            (a, b)
        } else {
            (b, a)
        };
        let difference = larger.inner - smaller.inner;

        return i129 { inner: difference, sign: larger.sign };
    }
}

// Implements the Add trait for i129.
impl i129Add of Add<i129> {
    fn add(lhs: i129, rhs: i129) -> i129 {
        i129_add(lhs, rhs)
    }
}

// Implements the AddEq trait for i129.
impl i129AddEq of AddEq<i129> {
    #[inline(always)]
    fn add_eq(ref self: i129, other: i129) {
        self = Add::add(self, other);
    }
}

// Subtracts two i129 integers.
// # Arguments
// * `a` - The first i129 to subtract.
// * `b` - The second i129 to subtract.
// # Returns
// * `i129` - The difference of `a` and `b`.
fn i129_sub(a: i129, b: i129) -> i129 {
    i129_check_sign_zero(a);
    i129_check_sign_zero(b);

    if (b.inner == 0) {
        return a;
    }

    // The subtraction of `a` to `b` is achieved by negating `b` sign and adding it to `a`.
    let neg_b = i129 { inner: b.inner, sign: !b.sign };
    return a + neg_b;
}

// Implements the Sub trait for i129.
impl i129Sub of Sub<i129> {
    fn sub(lhs: i129, rhs: i129) -> i129 {
        i129_sub(lhs, rhs)
    }
}

// Implements the SubEq trait for i129.
impl i129SubEq of SubEq<i129> {
    #[inline(always)]
    fn sub_eq(ref self: i129, other: i129) {
        self = Sub::sub(self, other);
    }
}

// Multiplies two i129 integers.
// 
// # Arguments
//
// * `a` - The first i129 to multiply.
// * `b` - The second i129 to multiply.
//
// # Returns
//
// * `i129` - The product of `a` and `b`.
fn i129_mul(a: i129, b: i129) -> i129 {
    i129_check_sign_zero(a);
    i129_check_sign_zero(b);

    // The sign of the product is the XOR of the signs of the operands.
    let sign = a.sign ^ b.sign;
    // The product is the product of the absolute values of the operands.
    let inner = a.inner * b.inner;
    return i129 { inner, sign };
}

// Implements the Mul trait for i129.
impl i129Mul of Mul<i129> {
    fn mul(lhs: i129, rhs: i129) -> i129 {
        i129_mul(lhs, rhs)
    }
}

// Implements the MulEq trait for i129.
impl i129MulEq of MulEq<i129> {
    #[inline(always)]
    fn mul_eq(ref self: i129, other: i129) {
        self = Mul::mul(self, other);
    }
}

// Divides the first i129 by the second i129.
// # Arguments
// * `a` - The i129 dividend.
// * `b` - The i129 divisor.
// # Returns
// * `i129` - The quotient of `a` and `b`.
fn i129_div(a: i129, b: i129) -> i129 {
    i129_check_sign_zero(a);
    // Check that the divisor is not zero.
    assert(b.inner != 0, 'b can not be 0');

    // The sign of the quotient is the XOR of the signs of the operands.
    let sign = a.sign ^ b.sign;

    if (sign == false) {
        // If the operands are positive, the quotient is simply their absolute value quotient.
        return i129 { inner: a.inner / b.inner, sign: sign };
    }

    // If the operands have different signs, rounding is necessary.
    // First, check if the quotient is an integer.
    if (a.inner % b.inner == 0) {
        return i129 { inner: a.inner / b.inner, sign: sign };
    }

    // If the quotient is not an integer, multiply the dividend by 10 to move the decimal point over.
    let quotient = (a.inner * 10) / b.inner;
    let last_digit = quotient % 10;

    // Check the last digit to determine rounding direction.
    if (last_digit <= 5) {
        return i129 { inner: quotient / 10, sign: sign };
    } else {
        return i129 { inner: (quotient / 10) + 1, sign: sign };
    }
}

// Implements the Div trait for i129.
impl i129Div of Div<i129> {
    fn div(lhs: i129, rhs: i129) -> i129 {
        i129_div(lhs, rhs)
    }
}

// Implements the DivEq trait for i129.
impl i129DivEq of DivEq<i129> {
    #[inline(always)]
    fn div_eq(ref self: i129, other: i129) {
        self = Div::div(self, other);
    }
}

// Calculates the remainder of the division of a first i129 by a second i129.
// # Arguments
// * `a` - The i129 dividend.
// * `b` - The i129 divisor.
// # Returns
// * `i129` - The remainder of dividing `a` by `b`.
fn i129_rem(a: i129, b: i129) -> i129 {
    i129_check_sign_zero(a);
    // Check that the divisor is not zero.
    assert(b.inner != 0, 'b can not be 0');

    return a - (b * (a / b));
}

// Implements the Rem trait for i129.
impl i129Rem of Rem<i129> {
    fn rem(lhs: i129, rhs: i129) -> i129 {
        i129_rem(lhs, rhs)
    }
}

// Implements the RemEq trait for i129.
impl i129RemEq of RemEq<i129> {
    #[inline(always)]
    fn rem_eq(ref self: i129, other: i129) {
        self = Rem::rem(self, other);
    }
}

// Calculates both the quotient and the remainder of the division of a first i129 by a second i129.
// # Arguments
// * `a` - The i129 dividend.
// * `b` - The i129 divisor.
// # Returns
// * `(i129, i129)` - A tuple containing the quotient and the remainder of dividing `a` by `b`.
fn i129_div_rem(a: i129, b: i129) -> (i129, i129) {
    let quotient = i129_div(a, b);
    let remainder = i129_rem(a, b);

    return (quotient, remainder);
}

// Compares two i129 integers for equality.
// # Arguments
// * `a` - The first i129 integer to compare.
// * `b` - The second i129 integer to compare.
// # Returns
// * `bool` - `true` if the two integers are equal, `false` otherwise.
fn i129_eq(a: i129, b: i129) -> bool {
    // Check if the two integers have the same sign and the same absolute value.
    if a.sign == b.sign & a.inner == b.inner {
        return true;
    }

    return false;
}

// Compares two i129 integers for inequality.
// # Arguments
// * `a` - The first i129 integer to compare.
// * `b` - The second i129 integer to compare.
// # Returns
// * `bool` - `true` if the two integers are not equal, `false` otherwise.
fn i129_ne(a: i129, b: i129) -> bool {
    // The result is the inverse of the equal function.
    return !i129_eq(a, b);
}

// Implements the PartialEq trait for i129.
impl i129PartialEq of PartialEq<i129> {
    fn eq(lhs: i129, rhs: i129) -> bool {
        i129_eq(lhs, rhs)
    }

    fn ne(lhs: i129, rhs: i129) -> bool {
        i129_ne(lhs, rhs)
    }
}

// Compares two i129 integers for greater than.
// # Arguments
// * `a` - The first i129 integer to compare.
// * `b` - The second i129 integer to compare.
// # Returns
// * `bool` - `true` if `a` is greater than `b`, `false` otherwise.
fn i129_gt(a: i129, b: i129) -> bool {
    // Check if `a` is negative and `b` is positive.
    if (a.sign & !b.sign) {
        return false;
    }
    // Check if `a` is positive and `b` is negative.
    if (!a.sign & b.sign) {
        return true;
    }
    // If `a` and `b` have the same sign, compare their absolute values.
    if (a.sign & b.sign) {
        return a.inner < b.inner;
    } else {
        return a.inner > b.inner;
    }
}

// Determines whether the first i129 is less than the second i129.
// # Arguments
// * `a` - The i129 to compare against the second i129.
// * `b` - The i129 to compare against the first i129.
// # Returns
// * `bool` - `true` if `a` is less than `b`, `false` otherwise.
fn i129_lt(a: i129, b: i129) -> bool {
    // The result is the inverse of the greater than function.
    return !i129_gt(a, b);
}

// Checks if the first i129 integer is less than or equal to the second.
// # Arguments
// * `a` - The first i129 integer to compare.
// * `b` - The second i129 integer to compare.
// # Returns
// * `bool` - `true` if `a` is less than or equal to `b`, `false` otherwise.
fn i129_le(a: i129, b: i129) -> bool {
    if (a == b | i129_lt(a, b) == true) {
        return true;
    } else {
        return false;
    }
}

// Checks if the first i129 integer is greater than or equal to the second.
// # Arguments
// * `a` - The first i129 integer to compare.
// * `b` - The second i129 integer to compare.
// # Returns
// * `bool` - `true` if `a` is greater than or equal to `b`, `false` otherwise.
fn i129_ge(a: i129, b: i129) -> bool {
    if (a == b | i129_gt(a, b) == true) {
        return true;
    } else {
        return false;
    }
}

// Implements the PartialOrd trait for i129.
impl i129PartialOrd of PartialOrd<i129> {
    fn le(lhs: i129, rhs: i129) -> bool {
        i129_le(lhs, rhs)
    }
    fn ge(lhs: i129, rhs: i129) -> bool {
        i129_ge(lhs, rhs)
    }

    fn lt(lhs: i129, rhs: i129) -> bool {
        i129_lt(lhs, rhs)
    }
    fn gt(lhs: i129, rhs: i129) -> bool {
        i129_gt(lhs, rhs)
    }
}

// Negates the given i129 integer.
// # Arguments
// * `x` - The i129 integer to negate.
// # Returns
// * `i129` - The negation of `x`.
fn i129_neg(x: i129) -> i129 {
    // The negation of an integer is obtained by flipping its sign.
    return i129 { inner: x.inner, sign: !x.sign };
}

// Implements the Neg trait for i129.
impl i129Neg of Neg<i129> {
    fn neg(a: i129) -> i129 {
        i129_neg(a)
    }
}

// Computes the absolute value of the given i129 integer.
// # Arguments
// * `x` - The i129 integer to compute the absolute value of.
// # Returns
// * `i129` - The absolute value of `x`.
fn i129_abs(x: i129) -> i129 {
    return i129 { inner: x.inner, sign: false };
}

// Computes the maximum between two i129 integers.
// # Arguments
// * `a` - The first i129 integer to compare.
// * `b` - The second i129 integer to compare.
// # Returns
// * `i129` - The maximum between `a` and `b`.
fn i129_max(a: i129, b: i129) -> i129 {
    if (a > b) {
        return a;
    } else {
        return b;
    }
}

// Computes the minimum between two i129 integers.
// # Arguments
// * `a` - The first i129 integer to compare.
// * `b` - The second i129 integer to compare.
// # Returns
// * `i129` - The minimum between `a` and `b`.
fn i129_min(a: i129, b: i129) -> i129 {
    if (a < b) {
        return a;
    } else {
        return b;
    }
}

#[cfg(test)]
mod tests {
    use super::i129Trait;

    #[test]
    fn test_i129_new() {
        let x = i129Trait::new(0_u8);
        assert(x.inner == 0, 'expected inner 0');
        assert(!x.sign, 'expected sign false');

        let x = i129Trait::new(1_u8);
        assert(x.inner == 1, 'expected inner 1');
        assert(!x.sign, 'expected sign false');

        let x = -i129Trait::new(1_u8);
        assert(x.inner == 1, 'expected inner 1');
        assert(x.sign, 'expected sign true');

        let x = i129Trait::new(0xffffffffffffffffffffffffffffffff_u128);
        assert(x.inner == 0xffffffffffffffffffffffffffffffff, 'expected inner 2**128');
        assert(!x.sign, 'expected sign false');

        let x = -i129Trait::new(0xffffffffffffffffffffffffffffffff_u128);
        assert(x.inner == 0xffffffffffffffffffffffffffffffff, 'expected inner 2**128');
        assert(x.sign, 'expected sign true');
    }
}
