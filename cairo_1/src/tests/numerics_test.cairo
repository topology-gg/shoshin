#[cfg(test)]
mod tests {
    use shoshin_cairo_1::numerics::Fixed;
    use shoshin_cairo_1::numerics::ONE_u128;

    #[test]
    // Tests trait implementation for native arithmetics; add/sub/mul/div
    fn arithmetic() {
        assert(Fixed::new(1_u128, false) + Fixed::new(1_u128, false) == Fixed::new(2_u128, false), 'addition1');
        assert(Fixed::new(1_u128, true) + Fixed::new(1_u128, false) == Fixed::new(0_u128, false), 'addition2');
        assert(Fixed::new(1_u128, false) - Fixed::new(1_u128, false) == Fixed::new(0_u128, false), 'subtraction1');
        assert(Fixed::new(2_u128, false) - Fixed::new(1_u128, true) == Fixed::new(3_u128, false), 'subtraction2');
        assert(Fixed::new_unscaled(2_u128, false) * Fixed::new_unscaled(2_u128, false) == Fixed::new_unscaled(4_u128, false), 'multiplication1');
        assert(Fixed::new_unscaled(2_u128, true) * Fixed::new_unscaled(3_u128, true) == Fixed::new_unscaled(6_u128, false), 'multiplication2');
        //assert(Fixed::new_unscaled(1_u128, false) * Fixed::new(ONE_u128 / 2, false) == Fixed::new(ONE_u128 / 2, false), 'multiplication3');
        //assert(Fixed::new_unscaled(1_u128, false) / Fixed::new_unscaled(2_u128, false) == Fixed::new(ONE_u128 / 2, false), 'division1');
    }

    #[test]
    // Tests PartialOrd implementations; eq and ne
    fn partial_ord() {
        assert(Fixed::new(1, false) == Fixed::new(1, false), 'equal');
        assert(Fixed::new(2, true) == Fixed::new(2, true), 'equal');
        assert(Fixed::new(1, true) != Fixed::new(1, false), 'not equal');
        assert(Fixed::new(1, true) != Fixed::new(2, true), 'not equal');
    }
}