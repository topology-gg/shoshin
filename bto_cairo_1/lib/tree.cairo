// Library imports
use array::ArrayTrait;
use array::SpanTrait;
use debug::PrintTrait;
use option::OptionTrait;

// Internal imports
use bto::constants::opcodes;

type offset = usize;
type opcode = felt252;

#[derive(Drop)]
struct Node {
    value: opcode,
    left: offset,
    right: offset,
}

fn execute(ref tree: Span<Node>) -> felt252 {
    if tree.is_empty() {
        return 0;
    }
    let length = tree.len();

    let node = tree[0];
    let value = *node.value;
    let left = *node.left;
    let right = *node.right;

    if left == 0_usize & right == 0_usize {
        return value;
    }

    let mut tree_slice_left = tree.slice(left, right - left);
    let mut tree_slice_right = tree.slice(right, length - right);

    if *node.value == opcodes::ADD {
        return execute(ref tree_slice_left) + execute(ref tree_slice_right);
    }

    assert(false, 'Invalid opcode');
    return 0;
}
