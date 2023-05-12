use cairo_derive::{CairoArgs,};
use cairo_felt::Felt;
use cairo_types::{Base32, mayberelocatable, bigint, Tree, Sizeable};
use cairo_vm::{types::relocatable::MaybeRelocatable, vm::runners::cairo_runner::CairoArg};
use std::{convert::From, fmt::Debug};
use num_bigint::BigInt;

#[derive(Debug, CairoArgs)]
pub struct RealTimeInput {

    pub agent_0_body_state_state: Base32,
    pub agent_0_body_state_counter: Base32,
    pub agent_0_body_state_integrity: Base32,
    pub agent_0_body_state_stamina: Base32,
    pub agent_0_body_state_dir: Base32,
    pub agent_0_body_state_fatigued: Base32,

    pub agent_0_physics_state_pos_x: Base32,
    pub agent_0_physics_state_pos_y: Base32,
    pub agent_0_physics_state_vel_x: Base32,
    pub agent_0_physics_state_vel_y: Base32,
    pub agent_0_physics_state_acc_x: Base32,
    pub agent_0_physics_state_acc_y: Base32,

    pub agent_0_stimulus : Base32,
    pub agent_0_action: Base32,
    pub agent_0_character_type: Base32,
    
    pub agent_1_body_state_state: Base32,
    pub agent_1_body_state_counter: Base32,
    pub agent_1_body_state_integrity: Base32,
    pub agent_1_body_state_stamina: Base32,
    pub agent_1_body_state_dir: Base32,
    pub agent_1_body_state_fatigued: Base32,

    pub agent_1_physics_state_pos_x: Base32,
    pub agent_1_physics_state_pos_y: Base32,
    pub agent_1_physics_state_vel_x: Base32,
    pub agent_1_physics_state_vel_y: Base32,
    pub agent_1_physics_state_acc_x: Base32,
    pub agent_1_physics_state_acc_y: Base32,
    
    pub agent_1_stimulus : Base32,
    pub agent_1_character_type: Base32,

    
    pub _combos_offset_1: Vec<Base32>,
    pub _combos_1: Vec<Base32>,
    pub _state_machine_offset_1: Vec<Base32>,
    pub _state_machine_1: Vec<Tree>,
    pub _agent_1_mental_state: u8,
    pub _functions_offset_1: Vec<Base32>,
    pub _functions_1: Vec<Tree>,
    
    pub _actions_1: Vec<Base32>,
}