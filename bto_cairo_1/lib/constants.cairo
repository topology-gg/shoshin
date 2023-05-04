mod opcodes {
    const ADD: u128 = 1_u128;
    const SUB: u128 = 2_u128;
    const MUL: u128 = 3_u128;
    const DIV: u128 = 4_u128;
    const MOD: u128 = 5_u128;
    const ABS: u128 = 6_u128;
    const SQRT: u128 = 7_u128;
    const POW: u128 = 8_u128;

    const IS_NN: u128 = 9_u128;
    const IS_LE: u128 = 10_u128;
    const NOT: u128 = 11_u128;
    const EQ: u128 = 12_u128;

    const STACK: u128 = 13_u128;
    const HEAP: u128 = 14_u128;
    const PRECOMP: u128 = 15_u128;
}
