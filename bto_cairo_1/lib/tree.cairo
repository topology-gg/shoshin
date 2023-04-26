// Corelib imports
use array::ArrayTrait;
use array::SpanTrait;
use dict::Felt252DictTrait;
use integer::u128_sqrt;
use option::OptionTrait;
use traits::Into;
use traits::TryInto;

// Library imports

// Internal imports
use bto::constants::opcodes;

type Offset = usize;
type Opcode = u128;

#[derive(Drop)]
struct Node {
    value: Opcode,
    left: Offset,
    right: Offset,
}


// TODO: add ABS once we have signed integers
// TODO: add IS_NN once we have signed integers
// TODO: import quaireaux_math and use it for POW
fn execute(ref tree: Span<Node>, ref stack: Span<u128>, ref heap: Felt252Dict<u128>) -> u128 {
    match gas::withdraw_gas() {
        Option::Some(_) => (),
        Option::None(_) => {
            let mut data = ArrayTrait::new();
            data.append('Out of gas');
            panic(data);
        },
    }

    if tree.is_empty() {
        return 0;
    }
    let length = tree.len();

    let node = tree[0];
    let value = *node.value;
    let left_offset = *node.left;
    let right_offset = *node.right;

    if left_offset == 0_usize & right_offset == 0_usize {
        return value;
    }

    let mut tree_slice_right = tree.slice(right_offset, length - right_offset);
    let value_right = execute(ref tree_slice_right, ref stack, ref heap);

    let mut value_left = 0_u128;
    if left_offset != 0_usize {
        let mut tree_slice_left = tree.slice(left_offset, right_offset - left_offset);
        value_left = execute(ref tree_slice_left, ref stack, ref heap);
    }

    if value == opcodes::ADD {
        return value_right + value_left;
    }

    if value == opcodes::SUB {
        return value_left - value_right;
    }

    if value == opcodes::MUL {
        return value_right * value_left;
    }

    if value == opcodes::DIV {
        return value_left / value_right;
    }

    if value == opcodes::MOD {
        return value_left % value_right;
    }

    if value == opcodes::SQRT {
        return u128_sqrt(value_right);
    }

    if value == opcodes::IS_LE {
        return match value_left <= value_right {
            bool::False(()) => 0_u128,
            bool::True(()) => 1_u128,
        };
    }

    if value == opcodes::NOT {
        if value_right == 0_u128 {
            return 1_u128;
        }
        return 0_u128;
    }

    if value == opcodes::EQ {
        return match value_left == value_right {
            bool::False(()) => 0_u128,
            bool::True(()) => 1_u128,
        };
    }

    if value == opcodes::MEM {
        let index: usize = value_right.into().try_into().unwrap();
        return *stack[index];
    }

    if value == opcodes::DICT {
        return heap.get(value_right.into());
    }

    assert(false, 'Invalid opcode');
    return 0;
}
