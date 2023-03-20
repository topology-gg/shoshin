///! Implements all traits and types required for running the shoshin cairo loop
use crate::{bigint, mayberelocatable};
use cairo_felt::{Felt, FIELD_HIGH, FIELD_LOW};
use cairo_vm::{types::relocatable::MaybeRelocatable, vm::runners::cairo_runner::CairoArg};
use lazy_static::lazy_static;
use num_bigint::BigInt;
use serde::{Deserialize, Serialize};
use shoshin_derive::{CairoArgs, CairoStruct};
use std::{convert::From, fmt::Debug};

lazy_static! {
    pub static ref PRIME: BigInt = (BigInt::from(FIELD_HIGH) << 128) + BigInt::from(FIELD_LOW);
    pub static ref PRIME_HALF: BigInt = &*PRIME >> 1;
}

/// Trait defining how to convert a type to CairoArg
trait IntoCairoArgs {
    fn into(self) -> CairoArg;
}

/// Trait defining how to convert &[i32] into our type
trait FromSliceBase32 {
    fn from(input: &[i32]) -> Self;
}

/// Trait defining the size of a cairo struct (amount of felts
/// required to represent the structure)
pub trait Sizeable {
    fn size(&self) -> usize;
}

#[derive(Debug, PartialEq, CairoArgs, CairoStruct)]
pub struct ShoshinInput {
    pub combos_offset_0: Vec<Base32>,
    pub combos_0: Vec<Base32>,
    pub combos_offset_1: Vec<Base32>,
    pub combos_1: Vec<Base32>,
    pub state_machine_offset_0: Vec<Base32>,
    pub state_machine_0: Vec<Tree>,
    pub initial_state_0: u8,
    pub state_machine_offset_1: Vec<Base32>,
    pub state_machine_1: Vec<Tree>,
    pub initial_state_1: u8,
    pub functions_offset_0: Vec<Base32>,
    pub functions_0: Vec<Tree>,
    pub functions_offset_1: Vec<Base32>,
    pub functions_1: Vec<Tree>,
    pub actions_0: Vec<Base32>,
    pub actions_1: Vec<Base32>,
    pub char_0: u8,
    pub char_1: u8,
}

// Implement the default trait for the Cairo struct and
// assure that all vectors have a length of 1. Allows to
// call self.xxx[0].size() on any iterable field of the
// structure
impl Default for ShoshinInput {
    fn default() -> Self {
        Self {
            combos_offset_0: vec![0],
            combos_0: vec![0],
            combos_offset_1: vec![0],
            combos_1: vec![0],
            state_machine_offset_0: vec![0],
            state_machine_0: vec![Tree::default()],
            initial_state_0: Default::default(),
            state_machine_offset_1: vec![0],
            state_machine_1: vec![Tree::default()],
            initial_state_1: Default::default(),
            functions_offset_0: vec![0],
            functions_0: vec![Tree::default()],
            functions_offset_1: vec![0],
            functions_1: vec![Tree::default()],
            actions_0: vec![0],
            actions_1: vec![0],
            char_0: Default::default(),
            char_1: Default::default(),
        }
    }
}

/// Redefine i32 for trait definition on it
type Base32 = i32;

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

#[derive(Default, Debug, Serialize, Deserialize)]
pub struct FrameScene {
    pub agent_0: Agent,
    pub agent_1: Agent,
}

#[derive(Default, Debug, Serialize, Deserialize)]
pub struct Agent {
    pub mental_state: BigInt,
    pub body_state: BodyState,
    pub physics_state: PhysicsState,
    pub action: BigInt,
    pub stimulus: BigInt,
    pub hitboxes: Hitboxes,
    pub combo: Combo,
}

#[derive(Default, Debug, Serialize, Deserialize)]
pub struct BodyState {
    pub state: BigInt,
    pub counter: BigInt,
    pub integrity: BigInt,
    pub stamina: BigInt,
    pub dir: BigInt,
    pub fatigued: BigInt,
}

#[derive(Default, Debug, Serialize, Deserialize)]
pub struct PhysicsState {
    pub pos: Vector,
    pub vel_fp: Vector,
    pub acc_fp: Vector,
}

#[derive(Default, Debug, Serialize, Deserialize)]
pub struct Hitboxes {
    pub action: Rectangle,
    pub body: Rectangle,
}

#[derive(Default, Debug, Serialize, Deserialize)]
pub struct Rectangle {
    pub origin: Vector,
    pub dimension: Vector,
}

#[derive(Default, Debug, Serialize, Deserialize)]
pub struct Vector {
    pub x: BigInt,
    pub y: BigInt,
}

#[derive(Default, Debug, Serialize, Deserialize)]
pub struct Combo {
    pub combo_index: BigInt,
    pub action_index: BigInt,
}

impl Sizeable for FrameScene {
    fn size(&self) -> usize {
        50
    }
}

// TODO improve the From<Vec<BigInt>> implementation to make it generic via a macro
impl From<Vec<BigInt>> for FrameScene {
    fn from(value: Vec<BigInt>) -> Self {
        let mut value_mod: Vec<BigInt> = value.into_iter().map(mod_prime).collect();
        let agent_0 = Agent {
            mental_state: value_mod.pop().unwrap(),
            body_state: BodyState {
                state: value_mod.pop().unwrap(),
                counter: value_mod.pop().unwrap(),
                integrity: value_mod.pop().unwrap(),
                stamina: value_mod.pop().unwrap(),
                dir: value_mod.pop().unwrap(),
                fatigued: value_mod.pop().unwrap(),
            },
            physics_state: PhysicsState {
                pos: Vector {
                    x: value_mod.pop().unwrap(),
                    y: value_mod.pop().unwrap(),
                },
                vel_fp: Vector {
                    x: value_mod.pop().unwrap(),
                    y: value_mod.pop().unwrap(),
                },
                acc_fp: Vector {
                    x: value_mod.pop().unwrap(),
                    y: value_mod.pop().unwrap(),
                },
            },
            action: value_mod.pop().unwrap(),
            stimulus: value_mod.pop().unwrap(),
            hitboxes: Hitboxes {
                action: Rectangle {
                    origin: Vector {
                        x: value_mod.pop().unwrap(),
                        y: value_mod.pop().unwrap(),
                    },
                    dimension: Vector {
                        x: value_mod.pop().unwrap(),
                        y: value_mod.pop().unwrap(),
                    },
                },
                body: Rectangle {
                    origin: Vector {
                        x: value_mod.pop().unwrap(),
                        y: value_mod.pop().unwrap(),
                    },
                    dimension: Vector {
                        x: value_mod.pop().unwrap(),
                        y: value_mod.pop().unwrap(),
                    },
                },
            },
            combo: Combo {
                combo_index: value_mod.pop().unwrap(),
                action_index: value_mod.pop().unwrap(),
            },
        };
        let agent_1 = Agent {
            mental_state: value_mod.pop().unwrap(),
            body_state: BodyState {
                state: value_mod.pop().unwrap(),
                counter: value_mod.pop().unwrap(),
                integrity: value_mod.pop().unwrap(),
                stamina: value_mod.pop().unwrap(),
                dir: value_mod.pop().unwrap(),
                fatigued: value_mod.pop().unwrap(),
            },
            physics_state: PhysicsState {
                pos: Vector {
                    x: value_mod.pop().unwrap(),
                    y: value_mod.pop().unwrap(),
                },
                vel_fp: Vector {
                    x: value_mod.pop().unwrap(),
                    y: value_mod.pop().unwrap(),
                },
                acc_fp: Vector {
                    x: value_mod.pop().unwrap(),
                    y: value_mod.pop().unwrap(),
                },
            },
            action: value_mod.pop().unwrap(),
            stimulus: value_mod.pop().unwrap(),
            hitboxes: Hitboxes {
                action: Rectangle {
                    origin: Vector {
                        x: value_mod.pop().unwrap(),
                        y: value_mod.pop().unwrap(),
                    },
                    dimension: Vector {
                        x: value_mod.pop().unwrap(),
                        y: value_mod.pop().unwrap(),
                    },
                },
                body: Rectangle {
                    origin: Vector {
                        x: value_mod.pop().unwrap(),
                        y: value_mod.pop().unwrap(),
                    },
                    dimension: Vector {
                        x: value_mod.pop().unwrap(),
                        y: value_mod.pop().unwrap(),
                    },
                },
            },
            combo: Combo {
                combo_index: value_mod.pop().unwrap(),
                action_index: value_mod.pop().unwrap(),
            },
        };
        FrameScene { agent_0, agent_1 }
    }
}

fn mod_prime(x: BigInt) -> BigInt {
    if x > *PRIME_HALF {
        return BigInt::new(num_bigint::Sign::Minus, (&*PRIME - x).to_u32_digits().1);
    }
    x
}

#[cfg(test)]
mod tests {
    use super::*;

    fn get_shoshin_test_input() -> Vec<i32> {
        vec![
            1, 0, 5, 2, 2, 2, 2, 2, 1, 0, 5, 2, 2, 2, 2, 2, 2, 1, 1, 1, 0, -1, -1, 0, 2, 1, 1, 1,
            0, -1, -1, 0, 1, 1, 1, 0, -1, -1, 1, 1, 1, 0, -1, -1, 1, 101, 1, 101, 0, 1,
        ]
    }

    #[test]
    fn test_from_vec_i32() {
        let actual = ShoshinInput::from(get_shoshin_test_input());
        let expected = ShoshinInput {
            combos_offset_0: vec![0],
            combos_0: vec![2, 2, 2, 2, 2],
            combos_offset_1: vec![0],
            combos_1: vec![2, 2, 2, 2, 2],
            state_machine_offset_0: vec![1, 1],
            state_machine_0: vec![Tree {
                opcode: 0,
                first_value: -1,
                second_value: -1,
            }],
            initial_state_0: 0,
            state_machine_offset_1: vec![1, 1],
            state_machine_1: vec![Tree {
                opcode: 0,
                first_value: -1,
                second_value: -1,
            }],
            initial_state_1: 0,
            functions_offset_0: vec![1],
            functions_0: vec![Tree {
                opcode: 0,
                first_value: -1,
                second_value: -1,
            }],
            functions_offset_1: vec![1],
            functions_1: vec![Tree {
                opcode: 0,
                first_value: -1,
                second_value: -1,
            }],
            actions_0: vec![101],
            actions_1: vec![101],
            char_0: 0,
            char_1: 1,
        };
        assert_eq!(expected, actual);
    }

    #[test]
    fn test_into_cairo_args() {
        let input = ShoshinInput::from(get_shoshin_test_input());
        let actual: Vec<CairoArg> = input.into();

        let expected = vec![
            CairoArg::from(mayberelocatable!(1)),
            CairoArg::from(vec![mayberelocatable!(0)]),
            CairoArg::from(mayberelocatable!(5)),
            CairoArg::from(vec![
                mayberelocatable!(2),
                mayberelocatable!(2),
                mayberelocatable!(2),
                mayberelocatable!(2),
                mayberelocatable!(2),
            ]),
            CairoArg::from(mayberelocatable!(1)),
            CairoArg::from(vec![mayberelocatable!(0)]),
            CairoArg::from(mayberelocatable!(5)),
            CairoArg::from(vec![
                mayberelocatable!(2),
                mayberelocatable!(2),
                mayberelocatable!(2),
                mayberelocatable!(2),
                mayberelocatable!(2),
            ]),
            CairoArg::from(mayberelocatable!(2)),
            CairoArg::from(vec![mayberelocatable!(1), mayberelocatable!(1)]),
            CairoArg::from(mayberelocatable!(1)),
            CairoArg::from(vec![
                mayberelocatable!(0),
                mayberelocatable!(-1),
                mayberelocatable!(-1),
            ]),
            CairoArg::from(mayberelocatable!(0)),
            CairoArg::from(mayberelocatable!(2)),
            CairoArg::from(vec![mayberelocatable!(1), mayberelocatable!(1)]),
            CairoArg::from(mayberelocatable!(1)),
            CairoArg::from(vec![
                mayberelocatable!(0),
                mayberelocatable!(-1),
                mayberelocatable!(-1),
            ]),
            CairoArg::from(mayberelocatable!(0)),
            CairoArg::from(mayberelocatable!(1)),
            CairoArg::from(vec![mayberelocatable!(1)]),
            CairoArg::from(mayberelocatable!(1)),
            CairoArg::from(vec![
                mayberelocatable!(0),
                mayberelocatable!(-1),
                mayberelocatable!(-1),
            ]),
            CairoArg::from(mayberelocatable!(1)),
            CairoArg::from(vec![mayberelocatable!(1)]),
            CairoArg::from(mayberelocatable!(1)),
            CairoArg::from(vec![
                mayberelocatable!(0),
                mayberelocatable!(-1),
                mayberelocatable!(-1),
            ]),
            CairoArg::from(mayberelocatable!(1)),
            CairoArg::from(vec![mayberelocatable!(101)]),
            CairoArg::from(mayberelocatable!(1)),
            CairoArg::from(vec![mayberelocatable!(101)]),
            CairoArg::from(mayberelocatable!(0)),
            CairoArg::from(mayberelocatable!(1)),
        ];
        assert_eq!(expected, actual);
    }
}
