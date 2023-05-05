// Corelib imports
use array::ArrayTrait;
use array::SpanTrait;
use dict::Felt252DictTrait;
use integer::u128_sqrt;
use nullable::NullableTrait;
use option::OptionTrait;
use traits::Into;
use traits::TryInto;

// Library imports

// Internal imports
use bto::constants::opcodes;
use bto::types::i129;
use bto::types::i129Trait;

type Offset = usize;
type Opcode = i129;

#[derive(Drop)]
struct Node {
    value: Opcode,
    left: Offset,
    right: Offset,
}


// TODO: import quaireaux_math and use it for POW
fn execute(
    ref tree: Span<Node>,
    ref stack: Array<i129>,
    ref heap: Felt252Dict<Nullable<i129>>,
    ref precompiles: Felt252Dict<Nullable<Span<Node>>>
) -> i129 {
    match gas::withdraw_gas() {
        Option::Some(_) => (),
        Option::None(_) => {
            let mut data = ArrayTrait::new();
            data.append('Out of gas');
            panic(data);
        },
    }
    if tree.is_empty() {
        return i129Trait::new(0_u128);
    }
    let length = tree.len();

    let node = tree[0];
    let value = *node.value;
    let opcode = value.inner;
    let left_offset = *node.left;
    let right_offset = *node.right;

    if left_offset == 0_usize & right_offset == 0_usize {
        return value;
    }

    // if offset on left != 0, execute left
    let mut value_left = i129Trait::new(0_u128);
    if left_offset != 0_usize {
        let mut tree_slice_left = tree.slice(left_offset, right_offset - left_offset);
        value_left = execute(ref tree_slice_left, ref stack, ref heap, ref precompiles);
    }

    let mut tree_slice_right = tree.slice(right_offset, length - right_offset);
    let value_right = execute(ref tree_slice_right, ref stack, ref heap, ref precompiles);

    if opcode == opcodes::ADD {
        return value_right + value_left;
    }

    if opcode == opcodes::SUB {
        return value_left - value_right;
    }

    if opcode == opcodes::MUL {
        return value_right * value_left;
    }

    if opcode == opcodes::DIV {
        return value_left / value_right;
    }

    if opcode == opcodes::MOD {
        return value_left % value_right;
    }

    // TODO: add ABS

    if opcode == opcodes::SQRT {
        assert(value_right >= i129Trait::new(0_u128), 'sqrt(x) with x<0');
        let sqrt: u128 = integer::upcast(u128_sqrt(value_right.inner));
        return i129Trait::new(sqrt);
    }

    // TODO: add IS_NN

    if opcode == opcodes::IS_LE {
        return match value_left <= value_right {
            bool::False(()) => i129Trait::zero(),
            bool::True(()) => i129Trait::one(),
        };
    }

    if opcode == opcodes::NOT {
        if value_right == i129Trait::zero() {
            return i129Trait::one();
        }
        return i129Trait::zero();
    }

    if opcode == opcodes::EQ {
        return match value_left == value_right {
            bool::False(()) => i129Trait::zero(),
            bool::True(()) => i129Trait::one(),
        };
    }

    // read value in stack
    if opcode == opcodes::STACK {
        let index: usize = value_right.into();
        return *stack[index];
    }

    // read value in heap
    if opcode == opcodes::HEAP {
        let key: felt252 = value_right.into();
        return heap.get(key).deref();
    }

    // evaluate precompile
    if opcode == opcodes::PRECOMP {
        let mut precompile = precompiles.get(value_right.into()).deref();
        let precompile_evaluation = execute(ref precompile, ref stack, ref heap, ref precompiles);
        stack.append(precompile_evaluation);
        return precompile_evaluation;
    }

    assert(false, 'Invalid opcode');
    return i129Trait::new(0_u128);
}
