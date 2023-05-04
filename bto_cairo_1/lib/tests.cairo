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
        Option::Some(s) => s,
        Option::None(()) => ArrayTrait::new()
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
fn test_stack__should_evaluate_stack() {
    // Given 
    // Tree
    //           stack(0)
    //            |
    //         mul(1)
    //       /      \
    //     stack(2)   2(4)
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
    tree_array.append(Node { value: opcodes::STACK, left: 0_usize, right: 1_usize });
    tree_array.append(Node { value: opcodes::MUL, left: 1_usize, right: 3_usize });
    tree_array.append(Node { value: opcodes::STACK, left: 0_usize, right: 1_usize });
    tree_array.append(Node { value: 1, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 2, left: 0_usize, right: 0_usize });

    // When
    let result = execute_tree(
        ref tree_array, Option::Some(stack), Option::None(()), Option::None(())
    );

    // Then
    assert(result == 5, 'incorrect stack result');
}

#[test]
#[available_gas(2000000)]
fn test_heap__should_evaluate_heap() {
    // Given 
    // Tree
    //         heap(0)
    //            |
    //         mul(1)
    //       /      \
    //     heap(2)   2(4)
    //       |
    //      100(3)
    let mut heap = Felt252DictTrait::new();
    heap.insert(100, 22_u128);
    heap.insert(44, 17_u128);

    let mut tree_array: Array<Node> = ArrayTrait::new();
    tree_array.append(Node { value: opcodes::HEAP, left: 0_usize, right: 1_usize });
    tree_array.append(Node { value: opcodes::MUL, left: 1_usize, right: 3_usize });
    tree_array.append(Node { value: opcodes::HEAP, left: 0_usize, right: 1_usize });
    tree_array.append(Node { value: 100, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 2, left: 0_usize, right: 0_usize });

    // When
    let result = execute_tree(
        ref tree_array, Option::None(()), Option::Some(heap), Option::None(())
    );

    // Then
    assert(result == 17, 'incorrect heap result');
}

#[test]
#[available_gas(20000000)]
fn test_precompiles__should_evaluate_precompile() {
    // Given 
    // Tree:
    //              add(0)
    //            /        \
    //        precomp(1)  mem(6)
    //            |         |
    //         div(2)       0
    //       /      \
    //  precomp(3)   99(5)
    //       |
    //      0(4)
    //
    // Precompile 0 (output = 99):
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
    // Precompile 1 (output = 70):
    //                 mul(0)
    //               /       \
    //            mul(1)     add(8)
    //           /     \      /   \
    //       mod(2)  sub(5)  3(9)  4(10)
    //      /  \     /    \          
    // 47(3)  7(4) 30(6) 28(7)   

    let mut stack: Array<u128> = ArrayTrait::new();
    let mut precompiles: Felt252Dict<Nullable<Span<Node>>> = Felt252DictTrait::new();

    let mut precompile_one: Array<Node> = ArrayTrait::new();
    precompile_one.append(Node { value: opcodes::MUL, left: 1_usize, right: 12_usize });
    precompile_one.append(Node { value: opcodes::MUL, left: 1_usize, right: 6_usize });
    precompile_one.append(Node { value: opcodes::IS_LE, left: 1_usize, right: 4_usize });
    precompile_one.append(Node { value: opcodes::MUL, left: 1_usize, right: 2_usize });
    precompile_one.append(Node { value: 2, left: 0_usize, right: 0_usize });
    precompile_one.append(Node { value: 32, left: 0_usize, right: 0_usize });
    precompile_one.append(Node { value: 65, left: 0_usize, right: 0_usize });
    precompile_one.append(Node { value: opcodes::SUB, left: 1_usize, right: 2_usize });
    precompile_one.append(Node { value: 30, left: 0_usize, right: 0_usize });
    precompile_one.append(Node { value: opcodes::MOD, left: 1_usize, right: 2_usize });
    precompile_one.append(Node { value: 350, left: 0_usize, right: 0_usize });
    precompile_one.append(Node { value: 47, left: 0_usize, right: 0_usize });
    precompile_one.append(Node { value: opcodes::SUB, left: 1_usize, right: 3_usize });
    precompile_one.append(Node { value: opcodes::SQRT, left: 0_usize, right: 1_usize });
    precompile_one.append(Node { value: 150, left: 0_usize, right: 0_usize });
    precompile_one.append(Node { value: opcodes::NOT, left: 0_usize, right: 1_usize });
    precompile_one.append(Node { value: 0, left: 0_usize, right: 0_usize });

    let mut precompile_one: Box<Span<Node>> = BoxTrait::new(precompile_one.span());
    precompiles.insert(0, nullable_from_box(precompile_one));

    let mut precompile_two: Array<Node> = ArrayTrait::new();
    precompile_two.append(Node { value: opcodes::MUL, left: 1_usize, right: 8_usize });
    precompile_two.append(Node { value: opcodes::MUL, left: 1_usize, right: 4_usize });
    precompile_two.append(Node { value: opcodes::MOD, left: 1_usize, right: 2_usize });
    precompile_two.append(Node { value: 47, left: 0_usize, right: 0_usize });
    precompile_two.append(Node { value: 7, left: 0_usize, right: 0_usize });
    precompile_two.append(Node { value: opcodes::SUB, left: 1_usize, right: 2_usize });
    precompile_two.append(Node { value: 30, left: 0_usize, right: 0_usize });
    precompile_two.append(Node { value: 28, left: 0_usize, right: 0_usize });
    precompile_two.append(Node { value: opcodes::ADD, left: 1_usize, right: 2_usize });
    precompile_two.append(Node { value: 3, left: 0_usize, right: 0_usize });
    precompile_two.append(Node { value: 4, left: 0_usize, right: 0_usize });

    let mut precompile_two: Box<Span<Node>> = BoxTrait::new(precompile_two.span());
    precompiles.insert(1, nullable_from_box(precompile_two));

    let mut tree_array: Array<Node> = ArrayTrait::new();
    tree_array.append(Node { value: opcodes::ADD, left: 1_usize, right: 6_usize });
    tree_array.append(Node { value: opcodes::PRECOMP, left: 0_usize, right: 1_usize });
    tree_array.append(Node { value: opcodes::DIV, left: 1_usize, right: 3_usize });
    tree_array.append(Node { value: opcodes::PRECOMP, left: 0_usize, right: 1_usize });
    tree_array.append(Node { value: 0, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: 99, left: 0_usize, right: 0_usize });
    tree_array.append(Node { value: opcodes::STACK, left: 0_usize, right: 1_usize });
    tree_array.append(Node { value: 0, left: 0_usize, right: 0_usize });

    // When
    let result = execute_tree(
        ref tree_array, Option::None(()), Option::None(()), Option::Some(precompiles)
    );

    // Then
    assert(result == 169, 'incorrect precompile result');
}

