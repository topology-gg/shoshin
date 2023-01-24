use cairo_felt::FIELD;
use lazy_static::lazy_static;
use num_bigint::BigInt;
use serde::{Deserialize, Serialize};
use std::fmt::Debug;
use std::{collections::VecDeque, convert::From};

lazy_static! {
    pub static ref PRIME: BigInt = (BigInt::from(FIELD.0) << 128) + BigInt::from(FIELD.1);
    pub static ref PRIME_HALF: BigInt = &*PRIME >> 1;
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
