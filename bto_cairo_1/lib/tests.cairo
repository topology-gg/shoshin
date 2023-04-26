// Corelib imports
use array::ArrayTrait;
use dict::Felt252DictTrait;
use option::OptionTrait;

// Internal imports
use bto::tree;
use bto::tree::Node;
use bto::constants::opcodes;

fn execute_tree(
    ref tree: Array<Node>, ref stack: Array<u128>, heap: Option<Felt252Dict<u128>>
) -> u128 {
    let mut tree_span = tree.span();
    let mut stack_span = stack.span();
    let mut heap = match heap {
        Option::Some(h) => h,
        Option::None(()) => Felt252DictTrait::new()
    };
    tree::execute(ref tree_span, ref stack_span, ref heap)
}

impl OptionDestruct<T, impl TDestruct: Destruct<T>> of Destruct<Option<T>> {
    #[inline(always)]
    fn destruct(self: Option<T>) nopanic {
        drop(self);
    }
}

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
    let mut stack: Array<u128> = ArrayTrait::new();
    let mut tree_array: Array<Node> = ArrayTrait::new();
    tree_array.append(Node { value: opcodes::ADD, left: 1_usize, right: 6_usize });
    tree_array.append(Node { value: opcodes::ADD, left: 1_usize, right: 4_usize });
    tree_array.append(Node { value: opcodes::ADD, left: 1_usize, right: 2_usize });
    tree_array.append(Node { value: 1, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 2, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 6, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 8, left: 0_usize, right: 0_usize });

    // When
    let result = execute_tree(ref tree_array, ref stack, Option::None(()));

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
    let mut stack: Array<u128> = ArrayTrait::new();
    let mut tree_array: Array<Node> = ArrayTrait::new();
    tree_array.append(Node { value: opcodes::SUB, left: 1_usize, right: 6_usize });
    tree_array.append(Node { value: opcodes::SUB, left: 1_usize, right: 4_usize });
    tree_array.append(Node { value: opcodes::SUB, left: 1_usize, right: 2_usize });
    tree_array.append(Node { value: 1000, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 15, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 9, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 245, left: 0_usize, right: 0_usize });

    // When
    let result = execute_tree(ref tree_array, ref stack, Option::None(()));

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
    let mut stack: Array<u128> = ArrayTrait::new();
    let mut tree_array: Array<Node> = ArrayTrait::new();
    tree_array.append(Node { value: opcodes::MUL, left: 1_usize, right: 6_usize });
    tree_array.append(Node { value: opcodes::MUL, left: 1_usize, right: 4_usize });
    tree_array.append(Node { value: opcodes::MUL, left: 1_usize, right: 2_usize });
    tree_array.append(Node { value: 13, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 15, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 9, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 2, left: 0_usize, right: 0_usize });

    // When
    let result = execute_tree(ref tree_array, ref stack, Option::None(()));

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
    let mut stack: Array<u128> = ArrayTrait::new();
    let mut tree_array: Array<Node> = ArrayTrait::new();
    tree_array.append(Node { value: opcodes::DIV, left: 1_usize, right: 6_usize });
    tree_array.append(Node { value: opcodes::DIV, left: 1_usize, right: 4_usize });
    tree_array.append(Node { value: opcodes::DIV, left: 1_usize, right: 2_usize });
    tree_array.append(Node { value: 512, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 4, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 2, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 6, left: 0_usize, right: 0_usize });

    // When
    let result = execute_tree(ref tree_array, ref stack, Option::None(()));

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
    let mut stack: Array<u128> = ArrayTrait::new();
    let mut tree_array: Array<Node> = ArrayTrait::new();
    tree_array.append(Node { value: opcodes::MOD, left: 1_usize, right: 6_usize });
    tree_array.append(Node { value: opcodes::MOD, left: 1_usize, right: 4_usize });
    tree_array.append(Node { value: opcodes::MOD, left: 1_usize, right: 2_usize });
    tree_array.append(Node { value: 512, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 104, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 63, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 7, left: 0_usize, right: 0_usize });

    // When
    let result = execute_tree(ref tree_array, ref stack, Option::None(()));

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
    let mut stack: Array<u128> = ArrayTrait::new();
    let mut tree_array: Array<Node> = ArrayTrait::new();
    tree_array.append(Node { value: opcodes::SQRT, left: 0_usize, right: 1_usize });
    tree_array.append(Node { value: opcodes::MUL, left: 1_usize, right: 3_usize });
    tree_array.append(Node { value: opcodes::SQRT, left: 0_usize, right: 1_usize });
    tree_array.append(Node { value: 400, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 5, left: 0_usize, right: 0_usize });

    // When
    let result = execute_tree(ref tree_array, ref stack, Option::None(()));

    // Then
    assert(result == 10, 'incorrect sqrt result');
}

#[test]
#[available_gas(2000000)]
fn test_is_le__should_evaluate_is_le_two_values() {
    // Given 
    // Tree
    //            is_le(0)
    //          /       \
    //         is_le(1)   0(6)
    //       /      \
    //     is_le(2)   2(5)
    //    /   \
    // 2(3) 6(3)
    let mut stack: Array<u128> = ArrayTrait::new();
    let mut tree_array: Array<Node> = ArrayTrait::new();
    tree_array.append(Node { value: opcodes::IS_LE, left: 1_usize, right: 6_usize });
    tree_array.append(Node { value: opcodes::IS_LE, left: 1_usize, right: 4_usize });
    tree_array.append(Node { value: opcodes::IS_LE, left: 1_usize, right: 2_usize });
    tree_array.append(Node { value: 2, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 6, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 2, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 0, left: 0_usize, right: 0_usize });

    // When
    let result = execute_tree(ref tree_array, ref stack, Option::None(()));

    // Then
    assert(result == 0, 'incorrect is less than result');
}

#[test]
#[available_gas(2000000)]
fn test_not__should_evaluate_not_one_value() {
    // Given 
    // Tree
    //           not(0)
    //            |
    //         mul(1)
    //       /      \
    //     not(2)   -1(4)
    //       |
    //      1(3)
    let mut stack: Array<u128> = ArrayTrait::new();
    let mut tree_array: Array<Node> = ArrayTrait::new();
    tree_array.append(Node { value: opcodes::NOT, left: 0_usize, right: 1_usize });
    tree_array.append(Node { value: opcodes::MUL, left: 1_usize, right: 3_usize });
    tree_array.append(Node { value: opcodes::NOT, left: 0_usize, right: 1_usize });
    tree_array.append(Node { value: 1, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 2, left: 0_usize, right: 0_usize });

    // When
    let result = execute_tree(ref tree_array, ref stack, Option::None(()));

    // Then
    assert(result == 1, 'incorrect not result');
}

#[test]
#[available_gas(2000000)]
fn test_eq__should_evaluate_eq_two_value() {
    // Given 
    // Tree
    //            eq(0)
    //          /       \
    //        mul(1)   0(6)
    //       /      \
    //     eq(2)   5(5)
    //    /   \
    // 2(3) 3(3)
    let mut stack: Array<u128> = ArrayTrait::new();
    let mut tree_array: Array<Node> = ArrayTrait::new();
    tree_array.append(Node { value: opcodes::EQ, left: 1_usize, right: 6_usize });
    tree_array.append(Node { value: opcodes::MUL, left: 1_usize, right: 4_usize });
    tree_array.append(Node { value: opcodes::EQ, left: 1_usize, right: 2_usize });
    tree_array.append(Node { value: 2, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 3, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 5, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 0, left: 0_usize, right: 0_usize });

    // When
    let result = execute_tree(ref tree_array, ref stack, Option::None(()));

    // Then
    assert(result == 1, 'incorrect eq result');
}

#[test]
#[available_gas(2000000)]
fn test_mem__should_evaluate_mem_one_value() {
    // Given 
    // Tree
    //           mem(0)
    //            |
    //         mul(1)
    //       /      \
    //     mem(2)   2(4)
    //       |
    //      1(3)
    let mut stack: Array<u128> = ArrayTrait::new();
    stack.append(1_u128);
    stack.append(2_u128);
    stack.append(3_u128);
    stack.append(4_u128);
    stack.append(5_u128);
    stack.append(6_u128);

    let mut tree_array: Array<Node> = ArrayTrait::new();
    tree_array.append(Node { value: opcodes::MEM, left: 0_usize, right: 1_usize });
    tree_array.append(Node { value: opcodes::MUL, left: 1_usize, right: 3_usize });
    tree_array.append(Node { value: opcodes::MEM, left: 0_usize, right: 1_usize });
    tree_array.append(Node { value: 1, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 2, left: 0_usize, right: 0_usize });

    // When
    let result = execute_tree(ref tree_array, ref stack, Option::None(()));

    // Then
    assert(result == 5, 'incorrect mem result');
}

#[test]
#[available_gas(2000000)]
fn test_dict__should_evaluate_dict_one_value() {
    // Given 
    // Tree
    //           dict(0)
    //            |
    //         mul(1)
    //       /      \
    //     dict(2)   2(4)
    //       |
    //      100(3)
    let mut stack: Array<u128> = ArrayTrait::new();
    let mut heap = Felt252DictTrait::new();
    heap.insert(100, 22_u128);
    heap.insert(44, 17_u128);

    let mut tree_array: Array<Node> = ArrayTrait::new();
    tree_array.append(Node { value: opcodes::DICT, left: 0_usize, right: 1_usize });
    tree_array.append(Node { value: opcodes::MUL, left: 1_usize, right: 3_usize });
    tree_array.append(Node { value: opcodes::DICT, left: 0_usize, right: 1_usize });
    tree_array.append(Node { value: 100, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 2, left: 0_usize, right: 0_usize });

    // When
    let result = execute_tree(ref tree_array, ref stack, Option::Some(heap));

    // Then
    assert(result == 17, 'incorrect dict result');
}
