

#[cfg(test)]
mod tests {
    const PRECISION: u128 = 1844674407370_u128; // 1e-7

    use option::OptionTrait;
    use traits::Into;

    use shoshin_cairo_1::numerics;
    use shoshin_cairo_1::numerics::Fixed;
    use shoshin_cairo_1::numerics::FixedType;
    use shoshin_cairo_1::numerics::ONE_u128;
    use shoshin_cairo_1::numerics::ONE;
    use shoshin_cairo_1::numerics::HALF;

    use gas::withdraw_gas;
    use debug::PrintTrait;

    use array::array_append;
    use array::array_new;

    fn assert_precise(result: FixedType, expected: felt252, msg: felt252) {
        let diff = (result - Fixed::from_felt(expected)).mag;

        if (diff > PRECISION) {
            match withdraw_gas() {
                Option::Some(_) => {},
                Option::None(_) => {
                    let mut data = array_new::<felt252>();
                    array_append::<felt252>(ref data, 'OOG');
                    panic(data);
                },
            }

            result.print();
            assert(diff <= PRECISION, msg);
        }
    }

    #[test]
    fn test_ceil() {
        let a = Fixed::from_felt(53495557813757699680); // 2.9
        assert(numerics::ceil(a).into() == 3 * ONE, 'invalid pos decimal');

        let a = Fixed::from_felt(-53495557813757699680); // -2.9
        assert(numerics::ceil(a).into() == -2 * ONE, 'invalid neg decimal');

        let a = Fixed::from_unscaled_felt(4);
        assert(numerics::ceil(a).into() == 4 * ONE, 'invalid pos integer');

        let a = Fixed::from_unscaled_felt(-4);
        assert(numerics::ceil(a).into() == -4 * ONE, 'invalid neg integer');

        let a = Fixed::from_unscaled_felt(0);
        assert(numerics::ceil(a).into() == 0, 'invalid zero');

        let a = Fixed::from_felt(HALF);
        assert(numerics::ceil(a).into() == 1 * ONE, 'invalid pos half');

        let a = Fixed::from_felt(-1 * HALF);
        assert(numerics::ceil(a).into() == 0, 'invalid neg half');
    }

    #[test]
    fn test_floor() {
        let a = Fixed::from_felt(53495557813757699680); // 2.9
        assert(numerics::floor(a).into() == 2 * ONE, 'invalid pos decimal');

        let a = Fixed::from_felt(-53495557813757699680); // -2.9
        assert(numerics::floor(a).into() == -3 * ONE, 'invalid neg decimal');

        let a = Fixed::from_unscaled_felt(4);
        assert(numerics::floor(a).into() == 4 * ONE, 'invalid pos integer');

        let a = Fixed::from_unscaled_felt(-4);
        assert(numerics::floor(a).into() == -4 * ONE, 'invalid neg integer');

        let a = Fixed::from_unscaled_felt(0);
        assert(numerics::floor(a).into() == 0, 'invalid zero');

        let a = Fixed::from_felt(HALF);
        assert(numerics::floor(a).into() == 0, 'invalid pos half');

        let a = Fixed::from_felt(-1 * HALF);
        assert(numerics::floor(a).into() == -1 * ONE, 'invalid neg half');
    }

    #[test]
    fn test_round() {
        let a = Fixed::from_felt(53495557813757699680); // 2.9
        assert(numerics::round(a).into() == 3 * ONE, 'invalid pos decimal');

        let a = Fixed::from_felt(-53495557813757699680); // -2.9
        assert(numerics::round(a).into() == -3 * ONE, 'invalid neg decimal');

        let a = Fixed::from_unscaled_felt(4);
        assert(numerics::round(a).into() == 4 * ONE, 'invalid pos integer');

        let a = Fixed::from_unscaled_felt(-4);
        assert(numerics::round(a).into() == -4 * ONE, 'invalid neg integer');

        let a = Fixed::from_unscaled_felt(0);
        assert(numerics::round(a).into() == 0, 'invalid zero');

        let a = Fixed::from_felt(HALF);
        assert(numerics::round(a).into() == 1 * ONE, 'invalid pos half');

        let a = Fixed::from_felt(-1 * HALF);
        assert(numerics::round(a).into() == -1 * ONE, 'invalid neg half');
    }

    #[test]
    fn test_eq() {
        let a = Fixed::from_unscaled_felt(42);
        let b = Fixed::from_unscaled_felt(42);
        let c = numerics::eq(a, b);
        assert(c == true, 'invalid result');

        let a = Fixed::from_unscaled_felt(42);
        let b = Fixed::from_unscaled_felt(-42);
        let c = numerics::eq(a, b);
        assert(c == false, 'invalid result');
    }

    #[test]
    fn test_ne() {
        let a = Fixed::from_unscaled_felt(42);
        let b = Fixed::from_unscaled_felt(42);
        let c = numerics::ne(a, b);
        assert(c == false, 'invalid result');

        let a = Fixed::from_unscaled_felt(42);
        let b = Fixed::from_unscaled_felt(-42);
        let c = numerics::ne(a, b);
        assert(c == true, 'invalid result');
    }

    #[test]
    fn test_add() {
        let a = Fixed::from_unscaled_felt(1);
        let b = Fixed::from_unscaled_felt(2);
        assert(numerics::add(a, b) == Fixed::from_unscaled_felt(3), 'invalid result');
    }

    #[test]
    fn test_sub() {
        let a = Fixed::from_unscaled_felt(5);
        let b = Fixed::from_unscaled_felt(2);
        let c = numerics::sub(a, b);
        assert(c.into() == 3 * ONE, 'false result invalid');

        let c = numerics::sub(b, a);
        assert(c.into() == -3 * ONE, 'true result invalid');
    }

    #[test]
    fn test_mul_pos() {
        let a = Fixed::from_unscaled_felt(5);
        let b = Fixed::from_unscaled_felt(2);
        let c = numerics::mul(a, b);
        assert(c.into() == 10 * ONE, 'invalid result');

        let a = Fixed::from_unscaled_felt(9);
        let b = Fixed::from_unscaled_felt(9);
        let c = numerics::mul(a, b);
        assert(c.into() == 81 * ONE, 'invalid result');

        let a = Fixed::from_unscaled_felt(4294967295);
        let b = Fixed::from_unscaled_felt(4294967295);
        let c = numerics::mul(a, b);
        assert(c.into() == 18446744065119617025 * ONE, 'invalid huge mul');

        let a = Fixed::from_felt(23058430092136939520); // 1.25
        let b = Fixed::from_felt(42427511369531968716); // 2.3
        let c = numerics::mul(a, b);
        assert(c.into() == 53034389211914960895, 'invalid result'); // 2.875

        let a = Fixed::from_unscaled_felt(0);
        let b = Fixed::from_felt(42427511369531968716); // 2.3
        let c = numerics::mul(a, b);
        assert(c.into() == 0, 'invalid result');
    }

    #[test]
    fn test_mul_neg() {
        let a = Fixed::from_unscaled_felt(5);
        let b = Fixed::from_unscaled_felt(-2);
        let c = numerics::mul(a, b);
        assert(c.into() == -10 * ONE, 'true result invalid');

        let a = Fixed::from_unscaled_felt(-5);
        let b = Fixed::from_unscaled_felt(-2);
        let c = numerics::mul(a, b);
        assert(c.into() == 10 * ONE, 'false result invalid');
    }

    #[test]
    fn test_div() {
        let a = Fixed::from_unscaled_felt(10);
        let b = Fixed::from_felt(53495557813757699680); // 2.9
        let c = numerics::div(a, b);
        assert_precise(c, 63609462323136390000, 'invalid pos decimal'); // 3.4482758620689657

        let a = Fixed::from_unscaled_felt(10);
        let b = Fixed::from_unscaled_felt(5);
        let c = numerics::div(a, b);
        assert(c.into() == 2 * ONE, 'invalid pos integer'); // 2

        let a = Fixed::from_unscaled_felt(-2);
        let b = Fixed::from_unscaled_felt(5);
        let c = numerics::div(a, b);
        assert(c.into() == -7378697629483820646, 'invalid neg decimal'); // 0.4

        let a = Fixed::from_unscaled_felt(-1000);
        let b = Fixed::from_unscaled_felt(12500);
        let c = numerics::div(a, b);
        assert(c.into() == -1475739525896764129, 'invalid neg decimal'); // 0.08

        let a = Fixed::from_unscaled_felt(-10);
        let b = Fixed::from_unscaled_felt(123456789);
        let c = numerics::div(a, b);
        assert_precise(c, -1494186283568, 'invalid neg decimal'); // 8.100000073706917e-8

        let a = Fixed::from_unscaled_felt(123456789);
        let b = Fixed::from_unscaled_felt(-10);
        let c = numerics::div(a, b);
        assert_precise(c, -227737579084496056114112102, 'invalid neg decimal'); // -12345678.9
    }

    #[test]
    fn test_le() {
        let a = Fixed::from_unscaled_felt(1);
        let b = Fixed::from_unscaled_felt(0);
        let c = Fixed::from_unscaled_felt(-1);

        assert(numerics::le(a, a), 'a <= a');
        assert(numerics::le(a, b) == false, 'a <= b');
        assert(numerics::le(a, c) == false, 'a <= c');

        assert(numerics::le(b, a), 'b <= a');
        assert(numerics::le(b, b), 'b <= b');
        assert(numerics::le(b, c) == false, 'b <= c');

        assert(numerics::le(c, a), 'c <= a');
        assert(numerics::le(c, b), 'c <= b');
        assert(numerics::le(c, c), 'c <= c');
    }

    #[test]
    fn test_lt() {
        let a = Fixed::from_unscaled_felt(1);
        let b = Fixed::from_unscaled_felt(0);
        let c = Fixed::from_unscaled_felt(-1);

        assert(numerics::lt(a, a) == false, 'a < a');
        assert(numerics::lt(a, b) == false, 'a < b');
        assert(numerics::lt(a, c) == false, 'a < c');

        assert(numerics::lt(b, a), 'b < a');
        assert(numerics::lt(b, b) == false, 'b < b');
        assert(numerics::lt(b, c) == false, 'b < c');

        assert(numerics::lt(c, a), 'c < a');
        assert(numerics::lt(c, b), 'c < b');
        assert(numerics::lt(c, c) == false, 'c < c');
    }

    #[test]
    fn test_ge() {
        let a = Fixed::from_unscaled_felt(1);
        let b = Fixed::from_unscaled_felt(0);
        let c = Fixed::from_unscaled_felt(-1);

        assert(numerics::ge(a, a), 'a >= a');
        assert(numerics::ge(a, b), 'a >= b');
        assert(numerics::ge(a, c), 'a >= c');

        assert(numerics::ge(b, a) == false, 'b >= a');
        assert(numerics::ge(b, b), 'b >= b');
        assert(numerics::ge(b, c), 'b >= c');

        assert(numerics::ge(c, a) == false, 'c >= a');
        assert(numerics::ge(c, b) == false, 'c >= b');
        assert(numerics::ge(c, c), 'c >= c');
    }

    #[test]
    fn test_gt() {
        let a = Fixed::from_unscaled_felt(1);
        let b = Fixed::from_unscaled_felt(0);
        let c = Fixed::from_unscaled_felt(-1);

        assert(numerics::gt(a, a) == false, 'a > a');
        assert(numerics::gt(a, b), 'a > b');
        assert(numerics::gt(a, c), 'a > c');

        assert(numerics::gt(b, a) == false, 'b > a');
        assert(numerics::gt(b, b) == false, 'b > b');
        assert(numerics::gt(b, c), 'b > c');

        assert(numerics::gt(c, a) == false, 'c > a');
        assert(numerics::gt(c, b) == false, 'c > b');
        assert(numerics::gt(c, c) == false, 'c > c');
    }
}