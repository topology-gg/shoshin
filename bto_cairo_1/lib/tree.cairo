// Library imports
use array::ArrayTrait;
use array::SpanTrait;
use debug::PrintTrait;
use option::OptionTrait;

// Internal imports
use bto::constants::opcodes;

type Offset = usize;
type Opcode = felt252;

#[derive(Drop)]
struct Node {
    value: Opcode,
    left: Offset,
    right: Offset,
}

fn execute(ref tree: Span<Node>) -> felt252 {
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

    assert(false, 'Invalid opcode');
    return 0;
}
