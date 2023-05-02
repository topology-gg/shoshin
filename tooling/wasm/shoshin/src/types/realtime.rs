use cairo_derive::{CairoArgs, CairoStruct};
use cairo_felt::Felt;
use cairo_types::{Base32, mayberelocatable, bigint};
use cairo_vm::{types::relocatable::MaybeRelocatable, vm::runners::cairo_runner::CairoArg};
use serde::{Deserialize, Serialize};
use std::{convert::From, fmt::Debug};
use num_bigint::BigInt;

#[derive(Debug, CairoArgs)]
pub struct RealTimeInput {
    pub state : RealTimeFrameScene,
    pub player_action : i32,
    pub character_type_0 : i32,
    pub character_type_1 : i32
}


#[derive(Debug)]
pub struct RealTimeFrameScene {
    pub agent_0: RealTimeAgent,
    pub agent_1: RealTimeAgent,
}


#[derive(Debug)]
pub struct RealTimeAgent {
    pub body_state: BodyState,
    pub physics_state: PhysicsState,
    pub action: Base32,
    pub stimulus: Base32,
    pub hitboxes: Hitboxes,
}

#[derive(Debug)]
pub struct BodyState {
    pub state: Base32,
    pub counter: Base32,
    pub integrity: Base32,
    pub stamina: Base32,
    pub dir: Base32,
    pub fatigued: Base32,
}


#[derive(Debug)]
pub struct PhysicsState {
    pub pos: Vector,
    pub vel_fp: Vector,
    pub acc_fp: Vector,
}


#[derive(Debug)]
pub struct Hitboxes {
    pub action: Rectangle,
    pub body: Rectangle,
}


#[derive(Debug)]
pub struct Rectangle {
    pub origin: Vector,
    pub dimension: Vector,
}

#[derive(Debug)]
pub struct Vector {
    pub x: Base32,
    pub y: Base32,
}



#[derive(Default, Debug, Serialize, Deserialize, CairoStruct)]
pub struct Temp {
    pub temp: BigInt,
}
