use shoshin_cairo_1::numerics;

#[cfg(test)]
mod tests {
    #[test]
    // Tests trait implementation for native arithmetics; add/sub/mul/div
    fn arithmetic() {
        assert(Fixed::new(1_u128, false) + Fixed::new(1_u128, false) == Fixed::new(2_u128, false), 'positive number addition');
        assert(Fixed::new(1_u128, true) + Fixed::new(1_u128, false) == Fixed::new(0_u128, false), 'addition, zero result must have no sign');
        assert(Fixed::new(1_u128, false) - Fixed::new(1_u128, false) == Fixed::new(0_u128, false), 'subtraction, zero result must have no sign');
        assert(Fixed::new(2_u128, false) - Fixed::new(1_u128, true) == Fixed::new(3_u128, false), 'subtracting negative number should result addition');
        assert(Fixed::new_unscaled(2_u128, false) * Fixed::new_unscaled(2_u128, false) == Fixed::new(4_u128, false), 'basic multiplication');
        assert(Fixed::new_unscaled(2_u128, true) * Fixed::new_unscaled(3_u128, true) == Fixed::new(6_u128, false), 'multiplication with negative numbers should result positive number');
        assert(Fixed::new_unscaled(1_u128, false) * Fixed::new(ONE_u128 / 2, false) == Fixed::new(ONE_u128 / 2, false), "1 * 0.5 should be 0.5");
        assert(Fixed::new_unscaled(1_u128, false) / Fixed::new_unscaled(2_u128, false) == Fixed::new(ONE_u128 / 2, false), "1 / 2 should be 0.5");
    }

    // Tests PartialOrd implementations; eq and ne
    fn partial_ord() {
        assert(Fixed::new(1, false) == Fixed::new(1, false), 'should be equal');
        assert(Fixed::new(2, true) == Fixed::new(2, true), 'should be equal');
        assert(Fixed::new(1, true) != Fixed::new(1, false), 'different sign should be not equal');
        assert(Fixed::new(1, true) != Fixed::new(2, true), 'different magnitude should be not equal');
    }
}