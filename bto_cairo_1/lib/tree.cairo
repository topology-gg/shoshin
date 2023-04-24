// Corelib imports
use array::ArrayTrait;
use array::SpanTrait;
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
fn execute(ref tree: Span<Node>) -> u128 {
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

    let mut tree_slice_left = tree.slice(left_offset, right_offset - left_offset);
    let mut tree_slice_right = tree.slice(right_offset, length - right_offset);

    if value == opcodes::ADD {
        return execute(ref tree_slice_left) + execute(ref tree_slice_right);
    }

    if value == opcodes::SUB {
        return execute(ref tree_slice_left) - execute(ref tree_slice_right);
    }

    if value == opcodes::MUL {
        return execute(ref tree_slice_left) * execute(ref tree_slice_right);
    }

    if value == opcodes::DIV {
        return execute(ref tree_slice_left) / execute(ref tree_slice_right);
    }

    if value == opcodes::MOD {
        return execute(ref tree_slice_left) % execute(ref tree_slice_right);
    }

    if value == opcodes::SQRT {
        let value = execute(ref tree_slice_right);
        return u128_sqrt(value);
    }

    assert(false, 'Invalid opcode');
    return 0;
}
