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
use bto::constants::opcodes;
use bto::tree;
use bto::tree::Node;
use bto::types::i129;
use bto::types::i129Trait;

// TODO remove all the _usize (since Cairo 1.0 has inference)

fn execute_tree(
    ref tree: Array<Node>,
    stack: Option<Array<i129>>,
    heap: Option<Felt252Dict<Nullable<i129>>>,
    precompiles: Option<Felt252Dict<Nullable<Span<Node>>>>
) -> i129 {
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
    tree_array.append(Node { value: i129Trait::new(opcodes::ADD), left: 1, right: 6 });
    tree_array.append(Node { value: i129Trait::new(opcodes::ADD), left: 1, right: 4 });
    tree_array.append(Node { value: i129Trait::new(opcodes::ADD), left: 1, right: 2 });
    tree_array.append(Node { value: i129Trait::new(1_u128), left: 0, right: 0 });
    tree_array.append(Node { value: i129Trait::new(2_u128), left: 0, right: 0 });
    tree_array.append(Node { value: i129Trait::new(6_u128), left: 0, right: 0 });
    tree_array.append(Node { value: i129Trait::new(8_u128), left: 0, right: 0 });

    // When
    let result = execute_tree(ref tree_array, Option::None(()), Option::None(()), Option::None(()));

    // Then
    assert(result.inner == 17, 'incorrect addition result');
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
    tree_array.append(Node { value: i129Trait::new(opcodes::SUB), left: 1, right: 6 });
    tree_array.append(Node { value: i129Trait::new(opcodes::SUB), left: 1, right: 4 });
    tree_array.append(Node { value: i129Trait::new(opcodes::SUB), left: 1, right: 2 });
    tree_array.append(Node { value: i129Trait::new(1000_u128), left: 0, right: 0 });
    tree_array.append(Node { value: i129Trait::new(15_u128), left: 0, right: 0 });
    tree_array.append(Node { value: i129Trait::new(9_u128), left: 0, right: 0 });
    tree_array.append(Node { value: i129Trait::new(245_u128), left: 0, right: 0 });

    // When
    let result = execute_tree(ref tree_array, Option::None(()), Option::None(()), Option::None(()));

    // Then
    assert(result.inner == 731, 'incorrect substraction result');
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
    tree_array.append(Node { value: i129Trait::new(opcodes::MUL), left: 1, right: 6 });
    tree_array.append(Node { value: i129Trait::new(opcodes::MUL), left: 1, right: 4 });
    tree_array.append(Node { value: i129Trait::new(opcodes::MUL), left: 1, right: 2 });
    tree_array.append(Node { value: i129Trait::new(13_u128), left: 0, right: 0 });
    tree_array.append(Node { value: i129Trait::new(15_u128), left: 0, right: 0 });
    tree_array.append(Node { value: i129Trait::new(9_u128), left: 0, right: 0 });
    tree_array.append(Node { value: i129Trait::new(2_u128), left: 0, right: 0 });

    // When
    let result = execute_tree(ref tree_array, Option::None(()), Option::None(()), Option::None(()));

    // Then
    assert(result.inner == 3510, 'incorrect multiplication result');
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
    tree_array.append(Node { value: i129Trait::new(opcodes::DIV), left: 1, right: 6 });
    tree_array.append(Node { value: i129Trait::new(opcodes::DIV), left: 1, right: 4 });
    tree_array.append(Node { value: i129Trait::new(opcodes::DIV), left: 1, right: 2 });
    tree_array.append(Node { value: i129Trait::new(512_u128), left: 0, right: 0 });
    tree_array.append(Node { value: i129Trait::new(4_u128), left: 0, right: 0 });
    tree_array.append(Node { value: i129Trait::new(2_u128), left: 0, right: 0 });
    tree_array.append(Node { value: i129Trait::new(6_u128), left: 0, right: 0 });

    // When
    let result = execute_tree(ref tree_array, Option::None(()), Option::None(()), Option::None(()));

    // Then
    assert(result.inner == 10, 'incorrect division result');
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
    tree_array.append(Node { value: i129Trait::new(opcodes::MOD), left: 1, right: 6 });
    tree_array.append(Node { value: i129Trait::new(opcodes::MOD), left: 1, right: 4 });
    tree_array.append(Node { value: i129Trait::new(opcodes::MOD), left: 1, right: 2 });
    tree_array.append(Node { value: i129Trait::new(512_u128), left: 0, right: 0 });
    tree_array.append(Node { value: i129Trait::new(104_u128), left: 0, right: 0 });
    tree_array.append(Node { value: i129Trait::new(63_u128), left: 0, right: 0 });
    tree_array.append(Node { value: i129Trait::new(7_u128), left: 0, right: 0 });

    // When
    let result = execute_tree(ref tree_array, Option::None(()), Option::None(()), Option::None(()));

    // Then
    assert(result.inner == 5, 'incorrect modulo result');
}

#[test]
#[available_gas(2000000)]
fn test_mod__should_abs() {
    // Given 
    // Tree
    //           abs(0)
    //            |
    //         mult(1)
    //       /      \
    //     abs(2)   -2(4)
    //       |
    //      -100(3)
    let mut tree_array: Array<Node> = ArrayTrait::new();
    tree_array.append(Node { value: i129Trait::new(opcodes::ABS), left: 0, right: 1 });
    tree_array.append(Node { value: i129Trait::new(opcodes::MUL), left: 1, right: 3 });
    tree_array.append(Node { value: i129Trait::new(opcodes::ABS), left: 0, right: 1 });
    tree_array.append(Node { value: -i129Trait::new(100_u128), left: 0, right: 0 });
    tree_array.append(Node { value: -i129Trait::new(2_u128), left: 0, right: 0 });

    // When
    let result = execute_tree(ref tree_array, Option::None(()), Option::None(()), Option::None(()));

    // Then
    assert(result.inner == 200, 'incorrect abs result');
    assert(!result.sign, 'incorrect abs result');
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
    tree_array.append(Node { value: i129Trait::new(opcodes::SQRT), left: 0, right: 1 });
    tree_array.append(Node { value: i129Trait::new(opcodes::MUL), left: 1, right: 3 });
    tree_array.append(Node { value: i129Trait::new(opcodes::SQRT), left: 0, right: 1 });
    tree_array.append(Node { value: i129Trait::new(400_u128), left: 0, right: 0 });
    tree_array.append(Node { value: i129Trait::new(5_u128), left: 0, right: 0 });

    // When
    let result = execute_tree(ref tree_array, Option::None(()), Option::None(()), Option::None(()));

    // Then
    assert(result.inner == 10, 'incorrect sqrt result');
}

#[test]
#[available_gas(2000000)]
fn test_mod__should_pow() {
    // Given 
    // Tree
    //            pow(0)
    //          /       \
    //         pow(1)   2(6)
    //       /      \
    //     pow(2)   2(5)
    //    /   \
    // 2(3)   6(4)
    let mut tree_array: Array<Node> = ArrayTrait::new();
    tree_array.append(Node { value: i129Trait::new(opcodes::POW), left: 1, right: 6 });
    tree_array.append(Node { value: i129Trait::new(opcodes::POW), left: 1, right: 4 });
    tree_array.append(Node { value: i129Trait::new(opcodes::POW), left: 1, right: 2 });
    tree_array.append(Node { value: i129Trait::new(2_u128), left: 0, right: 0 });
    tree_array.append(Node { value: i129Trait::new(6_u128), left: 0, right: 0 });
    tree_array.append(Node { value: i129Trait::new(2_u128), left: 0, right: 0 });
    tree_array.append(Node { value: i129Trait::new(2_u128), left: 0, right: 0 });

    // When
    let result = execute_tree(ref tree_array, Option::None(()), Option::None(()), Option::None(()));

    // Then
    assert(result.inner == 16777216, 'incorrect pow result');
}

#[test]
#[available_gas(2000000)]
fn test_mod__should_is_nn() {
    // Given 
    // Tree
    //           is_nn(0)
    //            |
    //         mul(1)
    //       /      \
    //     is_nn(2)   -1(4)
    //       |
    //      10(3)
    let mut tree_array: Array<Node> = ArrayTrait::new();
    tree_array.append(Node { value: i129Trait::new(opcodes::IS_NN), left: 0, right: 1 });
    tree_array.append(Node { value: i129Trait::new(opcodes::MUL), left: 1, right: 3 });
    tree_array.append(Node { value: i129Trait::new(opcodes::IS_NN), left: 0, right: 1 });
    tree_array.append(Node { value: i129Trait::new(10_u128), left: 0, right: 0 });
    tree_array.append(Node { value: -i129Trait::new(1_u128), left: 0, right: 0 });

    // When
    let result = execute_tree(ref tree_array, Option::None(()), Option::None(()), Option::None(()));

    // Then
    assert(result.inner == 0, 'incorrect abs result');
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
    tree_array.append(Node { value: i129Trait::new(opcodes::IS_LE), left: 1, right: 6 });
    tree_array.append(Node { value: i129Trait::new(opcodes::IS_LE), left: 1, right: 4 });
    tree_array.append(Node { value: i129Trait::new(opcodes::IS_LE), left: 1, right: 2 });
    tree_array.append(Node { value: i129Trait::new(2_u128), left: 0, right: 0 });
    tree_array.append(Node { value: i129Trait::new(6_u128), left: 0, right: 0 });
    tree_array.append(Node { value: i129Trait::new(2_u128), left: 0, right: 0 });
    tree_array.append(Node { value: i129Trait::new(0_u128), left: 0, right: 0 });

    // When
    let result = execute_tree(ref tree_array, Option::None(()), Option::None(()), Option::None(()));

    // Then
    assert(result.inner == 0, 'incorrect is less than result');
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
    tree_array.append(Node { value: i129Trait::new(opcodes::NOT), left: 0, right: 1 });
    tree_array.append(Node { value: i129Trait::new(opcodes::MUL), left: 1, right: 3 });
    tree_array.append(Node { value: i129Trait::new(opcodes::NOT), left: 0, right: 1 });
    tree_array.append(Node { value: i129Trait::new(1_u128), left: 0, right: 0 });
    tree_array.append(Node { value: i129Trait::new(2_u128), left: 0, right: 0 });

    // When
    let result = execute_tree(ref tree_array, Option::None(()), Option::None(()), Option::None(()));

    // Then
    assert(result.inner == 1, 'incorrect not result');
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
    tree_array.append(Node { value: i129Trait::new(opcodes::EQ), left: 1, right: 6 });
    tree_array.append(Node { value: i129Trait::new(opcodes::MUL), left: 1, right: 4 });
    tree_array.append(Node { value: i129Trait::new(opcodes::EQ), left: 1, right: 2 });
    tree_array.append(Node { value: i129Trait::new(2_u128), left: 0, right: 0 });
    tree_array.append(Node { value: i129Trait::new(3_u128), left: 0, right: 0 });
    tree_array.append(Node { value: i129Trait::new(5_u128), left: 0, right: 0 });
    tree_array.append(Node { value: i129Trait::new(0_u128), left: 0, right: 0 });

    // When
    let result = execute_tree(ref tree_array, Option::None(()), Option::None(()), Option::None(()));

    // Then
    assert(result.inner == 1, 'incorrect eq result');
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
    let mut stack: Array<i129> = ArrayTrait::new();
    stack.append(i129Trait::new(1_u128));
    stack.append(i129Trait::new(2_u128));
    stack.append(i129Trait::new(3_u128));
    stack.append(i129Trait::new(4_u128));
    stack.append(i129Trait::new(5_u128));
    stack.append(i129Trait::new(6_u128));

    let mut tree_array: Array<Node> = ArrayTrait::new();
    tree_array.append(Node { value: i129Trait::new(opcodes::STACK), left: 0, right: 1 });
    tree_array.append(Node { value: i129Trait::new(opcodes::MUL), left: 1, right: 3 });
    tree_array.append(Node { value: i129Trait::new(opcodes::STACK), left: 0, right: 1 });
    tree_array.append(Node { value: i129Trait::new(1_u128), left: 0, right: 0 });
    tree_array.append(Node { value: i129Trait::new(2_u128), left: 0, right: 0 });

    // When
    let result = execute_tree(
        ref tree_array, Option::Some(stack), Option::None(()), Option::None(())
    );

    // Then
    assert(result.inner == 5, 'incorrect stack result');
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
    heap.insert(100, i129Trait::new(22_u128).into());
    heap.insert(44, i129Trait::new(17_u128).into());

    let mut tree_array: Array<Node> = ArrayTrait::new();
    tree_array.append(Node { value: i129Trait::new(opcodes::HEAP), left: 0, right: 1 });
    tree_array.append(Node { value: i129Trait::new(opcodes::MUL), left: 1, right: 3 });
    tree_array.append(Node { value: i129Trait::new(opcodes::HEAP), left: 0, right: 1 });
    tree_array.append(Node { value: i129Trait::new(100_u128), left: 0, right: 0 });
    tree_array.append(Node { value: i129Trait::new(2_u128), left: 0, right: 0 });

    // When
    let result = execute_tree(
        ref tree_array, Option::None(()), Option::Some(heap), Option::None(())
    );

    // Then
    assert(result.inner == 17, 'incorrect heap result');
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

    let mut precompiles: Felt252Dict<Nullable<Span<Node>>> = Felt252DictTrait::new();

    let mut precompile_one: Array<Node> = ArrayTrait::new();
    precompile_one.append(Node { value: i129Trait::new(opcodes::MUL), left: 1, right: 12 });
    precompile_one.append(Node { value: i129Trait::new(opcodes::MUL), left: 1, right: 6 });
    precompile_one.append(Node { value: i129Trait::new(opcodes::IS_LE), left: 1, right: 4 });
    precompile_one.append(Node { value: i129Trait::new(opcodes::MUL), left: 1, right: 2 });
    precompile_one.append(Node { value: i129Trait::new(2_u128), left: 0, right: 0 });
    precompile_one.append(Node { value: i129Trait::new(32_u128), left: 0, right: 0 });
    precompile_one.append(Node { value: i129Trait::new(65_u128), left: 0, right: 0 });
    precompile_one.append(Node { value: i129Trait::new(opcodes::SUB), left: 1, right: 2 });
    precompile_one.append(Node { value: i129Trait::new(30_u128), left: 0, right: 0 });
    precompile_one.append(Node { value: i129Trait::new(opcodes::MOD), left: 1, right: 2 });
    precompile_one.append(Node { value: i129Trait::new(350_u128), left: 0, right: 0 });
    precompile_one.append(Node { value: i129Trait::new(47_u128), left: 0, right: 0 });
    precompile_one.append(Node { value: i129Trait::new(opcodes::SUB), left: 1, right: 3 });
    precompile_one.append(Node { value: i129Trait::new(opcodes::SQRT), left: 0, right: 1 });
    precompile_one.append(Node { value: i129Trait::new(150_u128), left: 0, right: 0 });
    precompile_one.append(Node { value: i129Trait::new(opcodes::NOT), left: 0, right: 1 });
    precompile_one.append(Node { value: i129Trait::new(0_u128), left: 0, right: 0 });

    let mut precompile_one: Box<Span<Node>> = BoxTrait::new(precompile_one.span());
    precompiles.insert(0, nullable_from_box(precompile_one));

    let mut precompile_two: Array<Node> = ArrayTrait::new();
    precompile_two.append(Node { value: i129Trait::new(opcodes::MUL), left: 1, right: 8 });
    precompile_two.append(Node { value: i129Trait::new(opcodes::MUL), left: 1, right: 4 });
    precompile_two.append(Node { value: i129Trait::new(opcodes::MOD), left: 1, right: 2 });
    precompile_two.append(Node { value: i129Trait::new(47_u128), left: 0, right: 0 });
    precompile_two.append(Node { value: i129Trait::new(7_u128), left: 0, right: 0 });
    precompile_two.append(Node { value: i129Trait::new(opcodes::SUB), left: 1, right: 2 });
    precompile_two.append(Node { value: i129Trait::new(30_u128), left: 0, right: 0 });
    precompile_two.append(Node { value: i129Trait::new(28_u128), left: 0, right: 0 });
    precompile_two.append(Node { value: i129Trait::new(opcodes::ADD), left: 1, right: 2 });
    precompile_two.append(Node { value: i129Trait::new(3_u128), left: 0, right: 0 });
    precompile_two.append(Node { value: i129Trait::new(4_u128), left: 0, right: 0 });

    let mut precompile_two: Box<Span<Node>> = BoxTrait::new(precompile_two.span());
    precompiles.insert(1, nullable_from_box(precompile_two));

    let mut tree_array: Array<Node> = ArrayTrait::new();
    tree_array.append(Node { value: i129Trait::new(opcodes::ADD), left: 1, right: 6 });
    tree_array.append(Node { value: i129Trait::new(opcodes::PRECOMP), left: 0, right: 1 });
    tree_array.append(Node { value: i129Trait::new(opcodes::DIV), left: 1, right: 3 });
    tree_array.append(Node { value: i129Trait::new(opcodes::PRECOMP), left: 0, right: 1 });
    tree_array.append(Node { value: i129Trait::new(0_u128), left: 0, right: 0 });
    tree_array.append(Node { value: i129Trait::new(99_u128), left: 0, right: 0 });
    tree_array.append(Node { value: i129Trait::new(opcodes::STACK), left: 0, right: 1 });
    tree_array.append(Node { value: i129Trait::new(0_u128), left: 0, right: 0 });

    // When
    let result = execute_tree(
        ref tree_array, Option::None(()), Option::None(()), Option::Some(precompiles)
    );

    // Then
    assert(result.inner == 169, 'incorrect precompile result');
}

