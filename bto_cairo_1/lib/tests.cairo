// Corelib imports
use array::ArrayTrait;
use debug::PrintTrait;

// Internal imports
use bto::tree;
use bto::tree::Node;
use bto::constants::opcodes;

#[test]
#[available_gas(2000000)]
fn test_add__should_add_two_values() {
    // Given 
    // test case:
    //            add(0)
    //          /       \
    //         add(1)   8(6)
    //       /      \
    //     add(2)   6(5)
    //    /   \
    // 1(3)   2(3)
    let mut tree_array: Array<Node> = ArrayTrait::new();
    tree_array.append(Node { value: opcodes::ADD, left: 1_usize, right: 6_usize });
    tree_array.append(Node { value: opcodes::ADD, left: 1_usize, right: 4_usize });
    tree_array.append(Node { value: opcodes::ADD, left: 1_usize, right: 2_usize });
    tree_array.append(Node { value: 1, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 2, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 6, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 8, left: 0_usize, right: 0_usize });

    // When
    let mut tree_span = tree_array.span();
    let result = tree::execute(ref tree_span);

    // Then
    assert(result == 17, 'incorrect addition result');
}

#[test]
#[available_gas(2000000)]
fn test_sub__should_sub_two_values() {
    // Given 
    // test case:
    //            sub(0)
    //          /       \
    //         sub(1)   245(6)
    //       /      \
    //     sub(2)   9(5)
    //    /   \
    // 1000(3) 15(3)
    let mut tree_array: Array<Node> = ArrayTrait::new();
    tree_array.append(Node { value: opcodes::SUB, left: 1_usize, right: 6_usize });
    tree_array.append(Node { value: opcodes::SUB, left: 1_usize, right: 4_usize });
    tree_array.append(Node { value: opcodes::SUB, left: 1_usize, right: 2_usize });
    tree_array.append(Node { value: 1000, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 15, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 9, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 245, left: 0_usize, right: 0_usize });

    // When
    let mut tree_span = tree_array.span();
    let result = tree::execute(ref tree_span);

    // Then
    assert(result == 731, 'incorrect substraction result');
}

#[test]
#[available_gas(2000000)]
fn test_mul__should_mul_two_values() {
    // Given 
    // test case:
    //            mul(0)
    //          /       \
    //         mul(1)   2(6)
    //       /      \
    //     mul(2)   9(5)
    //    /   \
    // 13(3) 15(3)
    let mut tree_array: Array<Node> = ArrayTrait::new();
    tree_array.append(Node { value: opcodes::MUL, left: 1_usize, right: 6_usize });
    tree_array.append(Node { value: opcodes::MUL, left: 1_usize, right: 4_usize });
    tree_array.append(Node { value: opcodes::MUL, left: 1_usize, right: 2_usize });
    tree_array.append(Node { value: 13, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 15, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 9, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 2, left: 0_usize, right: 0_usize });

    // When
    let mut tree_span = tree_array.span();
    let result = tree::execute(ref tree_span);

    // Then
    assert(result == 3510, 'incorrect multiplication result');
}

#[test]
#[available_gas(2000000)]
fn test_div__should_div_two_values() {
    // Given 
    // test case:
    //            div(0)
    //          /       \
    //         div(1)   6(6)
    //       /      \
    //     div(2)   2(5)
    //    /   \
    // 512(3) 4(3)
    let mut tree_array: Array<Node> = ArrayTrait::new();
    tree_array.append(Node { value: opcodes::DIV, left: 1_usize, right: 6_usize });
    tree_array.append(Node { value: opcodes::DIV, left: 1_usize, right: 4_usize });
    tree_array.append(Node { value: opcodes::DIV, left: 1_usize, right: 2_usize });
    tree_array.append(Node { value: 512, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 4, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 2, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 6, left: 0_usize, right: 0_usize });

    // When
    let mut tree_span = tree_array.span();
    let result = tree::execute(ref tree_span);

    // Then
    assert(result == 10, 'incorrect division result');
}

#[test]
#[available_gas(2000000)]
fn test_mod__should_mod_two_values() {
    // Given 
    // test case:
    //            mod(0)
    //          /       \
    //         mod(1)   7(6)
    //       /      \
    //     mod(2)   63(5)
    //    /   \
    // 512(3) 104(3)
    let mut tree_array: Array<Node> = ArrayTrait::new();
    tree_array.append(Node { value: opcodes::MOD, left: 1_usize, right: 6_usize });
    tree_array.append(Node { value: opcodes::MOD, left: 1_usize, right: 4_usize });
    tree_array.append(Node { value: opcodes::MOD, left: 1_usize, right: 2_usize });
    tree_array.append(Node { value: 512, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 104, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 63, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 7, left: 0_usize, right: 0_usize });

    // When
    let mut tree_span = tree_array.span();
    let result = tree::execute(ref tree_span);

    // Then
    assert(result == 5, 'incorrect modulo result');
}

#[test]
#[available_gas(2000000)]
fn test_sqrt__should_sqrt_one_value() {
    // Given 
    // Tree
    //           sqrt(0)
    //            |
    //         mul(1)
    //       /      \
    //     sqrt(2)   5(4)
    //       |
    //      400(3)
    let mut tree_array: Array<Node> = ArrayTrait::new();
    tree_array.append(Node { value: opcodes::SQRT, left: 0_usize, right: 1_usize });
    tree_array.append(Node { value: opcodes::MUL, left: 1_usize, right: 3_usize });
    tree_array.append(Node { value: opcodes::SQRT, left: 0_usize, right: 1_usize });
    tree_array.append(Node { value: 400, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 5, left: 0_usize, right: 0_usize });

    // When
    let mut tree_span = tree_array.span();
    let result = tree::execute(ref tree_span);

    // Then
    assert(result == 10, 'incorrect modulo result');
}
