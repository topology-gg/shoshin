use crate::{bigint, mayberelocatable};
use cairo_felt::{Felt, NewFelt, FIELD};
use cairo_vm::{types::relocatable::MaybeRelocatable, vm::runners::cairo_runner::CairoArg};
use lazy_static::lazy_static;
use num_bigint::BigInt;
use serde::{Deserialize, Serialize};
use std::fmt::Debug;
use std::marker::Copy;
use std::{collections::VecDeque, convert::From};
use wasm_bindgen::prelude::*;

lazy_static! {
    pub static ref PRIME: BigInt = (BigInt::from(FIELD.0) << 128) + BigInt::from(FIELD.1);
    pub static ref PRIME_HALF: BigInt = &*PRIME >> 1;
}

#[macro_export]
macro_rules! input_args {
        ($(($x: expr, $y: expr, $z: expr)),*) => {{
            let mut temp_vec = vec![];
            $(
                temp_vec.push(InputArgs::Triple($x, $y, $z));
            )*
            temp_vec
        }};
        ($($x: expr),*) => {{
            let mut temp_vec = vec![];
            $(
                temp_vec.push(InputArgs::Simple($x));
            )*
            temp_vec
        }};
}

#[macro_export]
macro_rules! input_vec {
    ($v: expr, simple) => {{
        let mut temp_vec = vec![];
        for i in $v {
            temp_vec.push(InputArgs::Simple(i));
        }
        temp_vec
    }};
    ($v: expr, triple) => {{
        let mut temp_vec = vec![];
        for x in $v.chunks(3) {
            temp_vec.push(InputArgs::Triple(x[0], x[1], x[2]));
        }
        temp_vec
    }};
}

#[wasm_bindgen]
#[derive(Debug)]
pub struct ShoshinInput {
    combos_offset_0: Vec<InputArgs>,
    combos_0: Vec<InputArgs>,
    combos_offset_1: Vec<InputArgs>,
    combos_1: Vec<InputArgs>,
    state_machine_offset_0: Vec<InputArgs>,
    state_machine_0: Vec<InputArgs>,
    state_machine_offset_1: Vec<InputArgs>,
    state_machine_1: Vec<InputArgs>,
    functions_offset_0: Vec<InputArgs>,
    functions_0: Vec<InputArgs>,
    functions_offset_1: Vec<InputArgs>,
    functions_1: Vec<InputArgs>,
    actions_0: Vec<InputArgs>,
    actions_1: Vec<InputArgs>,
    pub char_0: u8,
    pub char_1: u8,
}

#[derive(Debug, PartialEq)]
pub enum InputArgs {
    Simple(i32),
    Triple(i32, i32, i32),
}

impl ShoshinInput {
    fn get_vector_arguments(self) -> Vec<Vec<InputArgs>> {
        vec![
            self.combos_offset_0,
            self.combos_0,
            self.combos_offset_1,
            self.combos_1,
            self.state_machine_offset_0,
            self.state_machine_0,
            self.state_machine_offset_1,
            self.state_machine_1,
            self.functions_offset_0,
            self.functions_0,
            self.functions_offset_1,
            self.functions_1,
            self.actions_0,
            self.actions_1,
        ]
    }
    pub fn get_vm_args(self) -> Vec<CairoArg> {
        let char_0 = self.char_0;
        let char_1 = self.char_1;
        let inputs = self.get_vector_arguments();
        let mut args = vec![];
        for x in inputs {
            args.push(CairoArg::from(mayberelocatable!(x.len())));
            let vals = input_arg_into_mayberelocatable(x);
            args.push(CairoArg::from(vals));
        }
        args.insert(12, CairoArg::Single(mayberelocatable!(0)));
        args.insert(17, CairoArg::Single(mayberelocatable!(0)));
        args.push(CairoArg::from(mayberelocatable!(char_0)));
        args.push(CairoArg::from(mayberelocatable!(char_1)));
        args
    }
}

fn input_arg_into_mayberelocatable(x: Vec<InputArgs>) -> Vec<MaybeRelocatable> {
    let mut out = vec![];
    for i in x {
        match i {
            InputArgs::Simple(x) => out.push(mayberelocatable!(x)),
            InputArgs::Triple(x, y, z) => out.append(&mut vec![
                mayberelocatable!(x),
                mayberelocatable!(y),
                mayberelocatable!(z),
            ]),
        }
    }
    out
}

impl From<Vec<Vec<InputArgs>>> for ShoshinInput {
    fn from(mut value: Vec<Vec<InputArgs>>) -> Self {
        ShoshinInput {
            actions_1: value.pop().unwrap(),
            actions_0: value.pop().unwrap(),
            functions_1: value.pop().unwrap(),
            functions_offset_1: value.pop().unwrap(),
            functions_0: value.pop().unwrap(),
            functions_offset_0: value.pop().unwrap(),
            state_machine_1: value.pop().unwrap(),
            state_machine_offset_1: value.pop().unwrap(),
            state_machine_0: value.pop().unwrap(),
            state_machine_offset_0: value.pop().unwrap(),
            combos_1: value.pop().unwrap(),
            combos_offset_1: value.pop().unwrap(),
            combos_0: value.pop().unwrap(),
            combos_offset_0: value.pop().unwrap(),
            char_0: 0,
            char_1: 0,
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct FrameScene {
    pub agent_0: Agent,
    pub agent_1: Agent,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Agent {
    pub mental_state: BigInt,
    pub body_state: BodyState,
    pub physics_state: PhysicsState,
    pub action: BigInt,
    pub stimulus: BigInt,
    pub hitboxes: Hitboxes,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct BodyState {
    pub state: BigInt,
    pub counter: BigInt,
    pub integrity: BigInt,
    pub stamina: BigInt,
    pub dir: BigInt,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct PhysicsState {
    pub pos: Vector,
    pub vel_fp: Vector,
    pub acc_fp: Vector,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Hitboxes {
    pub action: Rectangle,
    pub body: Rectangle,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Rectangle {
    pub origin: Vector,
    pub dimension: Vector,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Vector {
    pub x: BigInt,
    pub y: BigInt,
}

impl From<VecDeque<BigInt>> for FrameScene {
    fn from(value: VecDeque<BigInt>) -> Self {
        let mut value_mod: VecDeque<BigInt> = value.into_iter().map(mod_prime).collect();
        let agent_0 = Agent {
            mental_state: value_mod.pop_front().unwrap(),
            body_state: BodyState {
                state: value_mod.pop_front().unwrap(),
                counter: value_mod.pop_front().unwrap(),
                integrity: value_mod.pop_front().unwrap(),
                stamina: value_mod.pop_front().unwrap(),
                dir: value_mod.pop_front().unwrap(),
            },
            physics_state: PhysicsState {
                pos: Vector {
                    x: value_mod.pop_front().unwrap(),
                    y: value_mod.pop_front().unwrap(),
                },
                vel_fp: Vector {
                    x: value_mod.pop_front().unwrap(),
                    y: value_mod.pop_front().unwrap(),
                },
                acc_fp: Vector {
                    x: value_mod.pop_front().unwrap(),
                    y: value_mod.pop_front().unwrap(),
                },
            },
            action: value_mod.pop_front().unwrap(),
            stimulus: value_mod.pop_front().unwrap(),
            hitboxes: Hitboxes {
                action: Rectangle {
                    origin: Vector {
                        x: value_mod.pop_front().unwrap(),
                        y: value_mod.pop_front().unwrap(),
                    },
                    dimension: Vector {
                        x: value_mod.pop_front().unwrap(),
                        y: value_mod.pop_front().unwrap(),
                    },
                },
                body: Rectangle {
                    origin: Vector {
                        x: value_mod.pop_front().unwrap(),
                        y: value_mod.pop_front().unwrap(),
                    },
                    dimension: Vector {
                        x: value_mod.pop_front().unwrap(),
                        y: value_mod.pop_front().unwrap(),
                    },
                },
            },
        };
        let agent_1 = Agent {
            mental_state: value_mod.pop_front().unwrap(),
            body_state: BodyState {
                state: value_mod.pop_front().unwrap(),
                counter: value_mod.pop_front().unwrap(),
                integrity: value_mod.pop_front().unwrap(),
                stamina: value_mod.pop_front().unwrap(),
                dir: value_mod.pop_front().unwrap(),
            },
            physics_state: PhysicsState {
                pos: Vector {
                    x: value_mod.pop_front().unwrap(),
                    y: value_mod.pop_front().unwrap(),
                },
                vel_fp: Vector {
                    x: value_mod.pop_front().unwrap(),
                    y: value_mod.pop_front().unwrap(),
                },
                acc_fp: Vector {
                    x: value_mod.pop_front().unwrap(),
                    y: value_mod.pop_front().unwrap(),
                },
            },
            action: value_mod.pop_front().unwrap(),
            stimulus: value_mod.pop_front().unwrap(),
            hitboxes: Hitboxes {
                action: Rectangle {
                    origin: Vector {
                        x: value_mod.pop_front().unwrap(),
                        y: value_mod.pop_front().unwrap(),
                    },
                    dimension: Vector {
                        x: value_mod.pop_front().unwrap(),
                        y: value_mod.pop_front().unwrap(),
                    },
                },
                body: Rectangle {
                    origin: Vector {
                        x: value_mod.pop_front().unwrap(),
                        y: value_mod.pop_front().unwrap(),
                    },
                    dimension: Vector {
                        x: value_mod.pop_front().unwrap(),
                        y: value_mod.pop_front().unwrap(),
                    },
                },
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
