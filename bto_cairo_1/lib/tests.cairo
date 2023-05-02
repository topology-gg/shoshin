// Corelib imports
use array::ArrayTrait;
use array::SpanTrait;
use box::BoxTrait;
use debug::PrintTrait;
use dict::Felt252DictTrait;
use nullable::nullable_from_box;
use option::OptionTrait;
use traits::Into;

// Internal imports
use bto::tree;
use bto::tree::Node;
use bto::constants::opcodes;

fn execute_tree(
    ref tree: Array<Node>,
    stack: Option<Array<u128>>,
    heap: Option<Felt252Dict<u128>>,
    precompiles: Option<Felt252Dict<Nullable<Span<Node>>>>
) -> u128 {
    let mut tree_span = tree.span();

    let mut stack = match stack {
        Option::Some(s) => s.span(),
        Option::None(()) => ArrayTrait::new().span()
    };
    let mut heap = match heap {
        Option::Some(h) => h,
        Option::None(()) => Felt252DictTrait::new()
    };
    let mut precompiles = match precompiles {
        Option::Some(p) => p,
        Option::None(()) => Felt252DictTrait::new()
    };
    tree::execute(ref tree_span, ref stack, ref heap, ref precompiles)
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
    let mut tree_array: Array<Node> = ArrayTrait::new();
    tree_array.append(Node { value: opcodes::ADD, left: 1_usize, right: 6_usize });
    tree_array.append(Node { value: opcodes::ADD, left: 1_usize, right: 4_usize });
    tree_array.append(Node { value: opcodes::ADD, left: 1_usize, right: 2_usize });
    tree_array.append(Node { value: 1, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 2, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 6, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 8, left: 0_usize, right: 0_usize });

    // When
    let result = execute_tree(ref tree_array, Option::None(()), Option::None(()), Option::None(()));

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
    let result = execute_tree(ref tree_array, Option::None(()), Option::None(()), Option::None(()));

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
    let result = execute_tree(ref tree_array, Option::None(()), Option::None(()), Option::None(()));

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
    let result = execute_tree(ref tree_array, Option::None(()), Option::None(()), Option::None(()));

    // Then
    assert(result == 10, 'incorrect division result');
}

#[test]
#[available_gas(2000000)]
fn test_mod__should_mod() {
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
    let result = execute_tree(ref tree_array, Option::None(()), Option::None(()), Option::None(()));

    // Then
    assert(result == 5, 'incorrect modulo result');
}

#[test]
#[available_gas(2000000)]
fn test_sqrt__should_sqrt() {
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
    let result = execute_tree(ref tree_array, Option::None(()), Option::None(()), Option::None(()));

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
    let mut tree_array: Array<Node> = ArrayTrait::new();
    tree_array.append(Node { value: opcodes::IS_LE, left: 1_usize, right: 6_usize });
    tree_array.append(Node { value: opcodes::IS_LE, left: 1_usize, right: 4_usize });
    tree_array.append(Node { value: opcodes::IS_LE, left: 1_usize, right: 2_usize });
    tree_array.append(Node { value: 2, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 6, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 2, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 0, left: 0_usize, right: 0_usize });

    // When
    let result = execute_tree(ref tree_array, Option::None(()), Option::None(()), Option::None(()));

    // Then
    assert(result == 0, 'incorrect is less than result');
}

#[test]
#[available_gas(2000000)]
fn test_not__should_evaluate_not() {
    // Given 
    // Tree
    //           not(0)
    //            |
    //         mul(1)
    //       /      \
    //     not(2)   -1(4)
    //       |
    //      1(3)
    let mut tree_array: Array<Node> = ArrayTrait::new();
    tree_array.append(Node { value: opcodes::NOT, left: 0_usize, right: 1_usize });
    tree_array.append(Node { value: opcodes::MUL, left: 1_usize, right: 3_usize });
    tree_array.append(Node { value: opcodes::NOT, left: 0_usize, right: 1_usize });
    tree_array.append(Node { value: 1, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 2, left: 0_usize, right: 0_usize });

    // When
    let result = execute_tree(ref tree_array, Option::None(()), Option::None(()), Option::None(()));

    // Then
    assert(result == 1, 'incorrect not result');
}

#[test]
#[available_gas(2000000)]
fn test_eq__should_evaluate_eq() {
    // Given 
    // Tree
    //            eq(0)
    //          /       \
    //        mul(1)   0(6)
    //       /      \
    //     eq(2)   5(5)
    //    /   \
    // 2(3) 3(3)
    let mut tree_array: Array<Node> = ArrayTrait::new();
    tree_array.append(Node { value: opcodes::EQ, left: 1_usize, right: 6_usize });
    tree_array.append(Node { value: opcodes::MUL, left: 1_usize, right: 4_usize });
    tree_array.append(Node { value: opcodes::EQ, left: 1_usize, right: 2_usize });
    tree_array.append(Node { value: 2, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 3, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 5, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 0, left: 0_usize, right: 0_usize });

    // When
    let result = execute_tree(ref tree_array, Option::None(()), Option::None(()), Option::None(()));

    // Then
    assert(result == 1, 'incorrect eq result');
}

#[test]
#[available_gas(2000000)]
fn test_mem__should_evaluate_mem() {
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
    let result = execute_tree(
        ref tree_array, Option::Some(stack), Option::None(()), Option::None(())
    );

    // Then
    assert(result == 5, 'incorrect mem result');
}

#[test]
#[available_gas(2000000)]
fn test_dict__should_evaluate_dict() {
    // Given 
    // Tree
    //           dict(0)
    //            |
    //         mul(1)
    //       /      \
    //     dict(2)   2(4)
    //       |
    //      100(3)
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
    let result = execute_tree(
        ref tree_array, Option::None(()), Option::Some(heap), Option::None(())
    );

    // Then
    assert(result == 17, 'incorrect dict result');
}

#[test]
#[available_gas(20000000)]
fn test_precompiles__should_evaluate_precompile() {
    // Given 
    // Tree 1:
    //           func(0)
    //            |
    //         div(1)
    //       /      \
    //     func(2)   99(4)
    //       |
    //      0(3)
    //
    // Func 0 (output = 99):
    //                     mul(0)
    //               /              \
    //            mul(1)           sub(13)
    //           /     \            /   \    
    //       is_le(2)  sub(7)   sqrt(16) not(14) 
    //      /  \         /  \     |       |      
    // mul(3) 65(6) 30(8) mod(9) 150(17) 0(15)  
    //   / \                 /   \      
    // 2(4) 32(5)      350(10) 47(11)   
    //
    // Func 1 (output = 70):
    //                 mul(0)
    //               /       \
    //            mul(1)     add(8)
    //           /     \      /   \
    //       mod(2)  sub(5)  3(9)  4(10)
    //      /  \     /    \          
    // 47(3)  7(4) 30(6) 28(7)   

    let mut stack: Array<u128> = ArrayTrait::new();
    let mut precompiles: Felt252Dict<Nullable<Span<Node>>> = Felt252DictTrait::new();

    let mut precompiles_first: Array<Node> = ArrayTrait::new();
    precompiles_first.append(Node { value: opcodes::MUL, left: 1_usize, right: 12_usize });
    precompiles_first.append(Node { value: opcodes::MUL, left: 1_usize, right: 6_usize });
    precompiles_first.append(Node { value: opcodes::IS_LE, left: 1_usize, right: 4_usize });
    precompiles_first.append(Node { value: opcodes::MUL, left: 1_usize, right: 2_usize });
    precompiles_first.append(Node { value: 2, left: 0_usize, right: 0_usize });
    precompiles_first.append(Node { value: 32, left: 0_usize, right: 0_usize });
    precompiles_first.append(Node { value: 65, left: 0_usize, right: 0_usize });
    precompiles_first.append(Node { value: opcodes::SUB, left: 1_usize, right: 2_usize });
    precompiles_first.append(Node { value: 30, left: 0_usize, right: 0_usize });
    precompiles_first.append(Node { value: opcodes::MOD, left: 1_usize, right: 2_usize });
    precompiles_first.append(Node { value: 350, left: 0_usize, right: 0_usize });
    precompiles_first.append(Node { value: 47, left: 0_usize, right: 0_usize });
    precompiles_first.append(Node { value: opcodes::SUB, left: 1_usize, right: 3_usize });
    precompiles_first.append(Node { value: opcodes::SQRT, left: 0_usize, right: 1_usize });
    precompiles_first.append(Node { value: 150, left: 0_usize, right: 0_usize });
    precompiles_first.append(Node { value: opcodes::NOT, left: 0_usize, right: 1_usize });
    precompiles_first.append(Node { value: 0, left: 0_usize, right: 0_usize });

    let mut precompile_first: Box<Span<Node>> = BoxTrait::new(precompiles_first.span());
    precompiles.insert(0, nullable_from_box(precompile_first));

    let mut precompiles_second: Array<Node> = ArrayTrait::new();
    precompiles_second.append(Node { value: opcodes::MUL, left: 1_usize, right: 8_usize });
    precompiles_second.append(Node { value: opcodes::MUL, left: 1_usize, right: 4_usize });
    precompiles_second.append(Node { value: opcodes::MOD, left: 1_usize, right: 2_usize });
    precompiles_second.append(Node { value: 47, left: 0_usize, right: 0_usize });
    precompiles_second.append(Node { value: 7, left: 0_usize, right: 0_usize });
    precompiles_second.append(Node { value: opcodes::SUB, left: 1_usize, right: 2_usize });
    precompiles_second.append(Node { value: 30, left: 0_usize, right: 0_usize });
    precompiles_second.append(Node { value: 28, left: 0_usize, right: 0_usize });
    precompiles_second.append(Node { value: opcodes::ADD, left: 1_usize, right: 2_usize });
    precompiles_second.append(Node { value: 3, left: 0_usize, right: 0_usize });
    precompiles_second.append(Node { value: 4, left: 0_usize, right: 0_usize });

    let mut precompile_second: Box<Span<Node>> = BoxTrait::new(precompiles_second.span());
    precompiles.insert(1, nullable_from_box(precompile_second));

    let mut tree_array: Array<Node> = ArrayTrait::new();
    tree_array.append(Node { value: opcodes::FUNC, left: 0_usize, right: 1_usize });
    tree_array.append(Node { value: opcodes::DIV, left: 1_usize, right: 3_usize });
    tree_array.append(Node { value: opcodes::FUNC, left: 0_usize, right: 1_usize });
    tree_array.append(Node { value: 0, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 99, left: 0_usize, right: 0_usize });

    // When
    let result = execute_tree(
        ref tree_array, Option::None(()), Option::None(()), Option::Some(precompiles)
    );

    // Then
    assert(result == 70, 'incorrect precompile result');
}

