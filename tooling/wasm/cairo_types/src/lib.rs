pub mod utils;

/// Trait defining the size of a cairo struct (amount of felts
/// required to represent the structure)
pub trait Sizeable {
    fn size() -> usize;
}

/// Redefine i32 for trait definition on it
pub type Base32 = i32;

impl Sizeable for Base32 {
    fn size() -> usize {
        1
    }
}

/// A value in the binary tree operator
/// representation of the state machines and functions
/// (see https://github.com/greged93/bto-cairo)
#[derive(Debug)]
pub struct Tree {
    pub _opcode: i32,
    pub _left: i32,
    pub _right: i32,
}

impl Sizeable for Tree {
    fn size() -> usize {
        3
    }
}

#[derive(Debug)]
pub struct KeyValuePair {
    _key: i32,
    _value: i32,
}

impl Sizeable for KeyValuePair {
    fn size() -> usize {
        2
    }
}
