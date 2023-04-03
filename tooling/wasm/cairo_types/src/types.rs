use crate::traits::{FromSliceBase32, IntoCairoArgs, Sizeable};
use cairo_execution::{bigint, mayberelocatable};
use cairo_felt::Felt;
use cairo_vm::{types::relocatable::MaybeRelocatable, vm::runners::cairo_runner::CairoArg};
use num_bigint::BigInt;

/// Redefine i32 for trait definition on it
pub type Base32 = i32;

impl Sizeable for Base32 {
    fn size(&self) -> usize {
        1
    }
}

impl FromSliceBase32 for Base32 {
    fn from(value: &[i32]) -> Self {
        value[0]
    }
}

impl IntoCairoArgs for Vec<i32> {
    fn into(self) -> CairoArg {
        let mut temp = vec![];
        for x in self {
            temp.push(mayberelocatable!(x));
        }
        CairoArg::from(temp)
    }
}

/// A value in the binary tree operator
/// representation of the state machines and functions
/// (see https://github.com/greged93/bto-cairo)
#[derive(Debug, PartialEq, Default)]
pub struct Tree {
    pub opcode: i32,
    pub first_value: i32,
    pub second_value: i32,
}

impl FromSliceBase32 for Tree {
    fn from(value: &[i32]) -> Self {
        Tree {
            opcode: value[0],
            first_value: value[1],
            second_value: value[2],
        }
    }
}

impl Sizeable for Tree {
    fn size(&self) -> usize {
        3
    }
}

impl IntoCairoArgs for Vec<Tree> {
    fn into(self) -> CairoArg {
        let mut temp: Vec<MaybeRelocatable> = vec![];
        for x in self {
            temp.append(&mut vec![
                mayberelocatable!(x.opcode),
                mayberelocatable!(x.first_value),
                mayberelocatable!(x.second_value),
            ]);
        }
        CairoArg::from(temp)
    }
}
