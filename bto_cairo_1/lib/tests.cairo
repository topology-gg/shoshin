// Library imports
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
    assert(result == 731, 'incorrect addition result');
}
