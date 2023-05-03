///! Implements all traits and types required for running the shoshin cairo loop
use cairo_derive::{CairoArgs, CairoStruct};
use cairo_felt::Felt;
use cairo_types::{bigint, mayberelocatable, Base32, Sizeable, Tree};
use cairo_vm::{types::relocatable::MaybeRelocatable, vm::runners::cairo_runner::CairoArg};
use num_bigint::BigInt;
use serde::{Deserialize, Serialize};
use std::{convert::From, fmt::Debug};

#[derive(Debug, CairoArgs)]
pub struct ShoshinInput {
    pub _frames_count: i32,
    pub _combos_offset_0: Vec<Base32>,
    pub _combos_0: Vec<Base32>,
    pub _combos_offset_1: Vec<Base32>,
    pub _combos_1: Vec<Base32>,
    pub _state_machine_offset_0: Vec<Base32>,
    pub _state_machine_0: Vec<Tree>,
    pub _initial_state_0: u8,
    pub _state_machine_offset_1: Vec<Base32>,
    pub _state_machine_1: Vec<Tree>,
    pub _initial_state_1: u8,
    pub _functions_offset_0: Vec<Base32>,
    pub _functions_0: Vec<Tree>,
    pub _functions_offset_1: Vec<Base32>,
    pub _functions_1: Vec<Tree>,
    pub _actions_0: Vec<Base32>,
    pub _actions_1: Vec<Base32>,
    pub _char_0: u8,
    pub _char_1: u8,
}

#[derive(Default, Debug, Serialize, Deserialize, CairoStruct)]
pub struct RealTimeFrameScene {
    pub agent_0: RealTimePlayer,
    pub agent_1: RealTimeAgent,
}

#[derive(Default, Debug, Serialize, Deserialize, CairoStruct)]
pub struct FrameScene {
    pub agent_0: Agent,
    pub agent_1: Agent,
}

#[derive(Default, Debug, Serialize, Deserialize, CairoStruct)]
pub struct RealTimeAgent {
    pub body_state: BodyState,
    pub physics_state: PhysicsState,
    pub stimulus: BigInt,
    pub hitboxes: Hitboxes,
    pub mental_state : BigInt
}

#[derive(Default, Debug, Serialize, Deserialize, CairoStruct)]
pub struct RealTimePlayer {
    pub body_state: BodyState,
    pub physics_state: PhysicsState,
    pub stimulus: BigInt,
    pub hitboxes: Hitboxes,
}


#[derive(Default, Debug, Serialize, Deserialize, CairoStruct)]
pub struct Agent {
    pub mental_state: BigInt,
    pub body_state: BodyState,
    pub physics_state: PhysicsState,
    pub action: BigInt,
    pub stimulus: BigInt,
    pub hitboxes: Hitboxes,
    pub combo: Combo,
}

#[derive(Default, Debug, Serialize, Deserialize, CairoStruct)]
pub struct BodyState {
    pub state: BigInt,
    pub counter: BigInt,
    pub integrity: BigInt,
    pub stamina: BigInt,
    pub dir: BigInt,
    pub fatigued: BigInt,
}

#[derive(Default, Debug, Serialize, Deserialize, CairoStruct)]
pub struct PhysicsState {
    pub pos: Vector,
    pub vel_fp: Vector,
    pub acc_fp: Vector,
}

#[derive(Default, Debug, Serialize, Deserialize, CairoStruct)]
pub struct Hitboxes {
    pub action: Rectangle,
    pub body: Rectangle,
}

#[derive(Default, Debug, Serialize, Deserialize, CairoStruct)]
pub struct Rectangle {
    pub origin: Vector,
    pub dimension: Vector,
}

#[derive(Default, Debug, Serialize, Deserialize, CairoStruct)]
pub struct Vector {
    pub x: BigInt,
    pub y: BigInt,
}

#[derive(Default, Debug, Serialize, Deserialize, CairoStruct)]
pub struct Combo {
    pub combo_index: BigInt,
    pub action_index: BigInt,
}

impl Sizeable for FrameScene {
    fn size() -> usize {
        50
    }
}
impl Sizeable for RealTimeFrameScene {
    fn size() -> usize {
        43
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use rand::Rng;

    fn get_random_input_data(len: usize) -> Vec<BigInt> {
        let mut rng = rand::thread_rng();
        (0..len).map(|_| bigint!(rng.gen::<u32>())).collect()
    }

    impl Into<Vec<BigInt>> for FrameScene {
        fn into(self) -> Vec<BigInt> {
            vec![
                self.agent_0.mental_state,
                self.agent_0.body_state.state,
                self.agent_0.body_state.counter,
                self.agent_0.body_state.integrity,
                self.agent_0.body_state.stamina,
                self.agent_0.body_state.dir,
                self.agent_0.body_state.fatigued,
                self.agent_0.physics_state.pos.x,
                self.agent_0.physics_state.pos.y,
                self.agent_0.physics_state.vel_fp.x,
                self.agent_0.physics_state.vel_fp.y,
                self.agent_0.physics_state.acc_fp.x,
                self.agent_0.physics_state.acc_fp.y,
                self.agent_0.action,
                self.agent_0.stimulus,
                self.agent_0.hitboxes.action.origin.x,
                self.agent_0.hitboxes.action.origin.y,
                self.agent_0.hitboxes.action.dimension.x,
                self.agent_0.hitboxes.action.dimension.y,
                self.agent_0.hitboxes.body.origin.x,
                self.agent_0.hitboxes.body.origin.y,
                self.agent_0.hitboxes.body.dimension.x,
                self.agent_0.hitboxes.body.dimension.y,
                self.agent_0.combo.combo_index,
                self.agent_0.combo.action_index,
                self.agent_1.mental_state,
                self.agent_1.body_state.state,
                self.agent_1.body_state.counter,
                self.agent_1.body_state.integrity,
                self.agent_1.body_state.stamina,
                self.agent_1.body_state.dir,
                self.agent_1.body_state.fatigued,
                self.agent_1.physics_state.pos.x,
                self.agent_1.physics_state.pos.y,
                self.agent_1.physics_state.vel_fp.x,
                self.agent_1.physics_state.vel_fp.y,
                self.agent_1.physics_state.acc_fp.x,
                self.agent_1.physics_state.acc_fp.y,
                self.agent_1.action,
                self.agent_1.stimulus,
                self.agent_1.hitboxes.action.origin.x,
                self.agent_1.hitboxes.action.origin.y,
                self.agent_1.hitboxes.action.dimension.x,
                self.agent_1.hitboxes.action.dimension.y,
                self.agent_1.hitboxes.body.origin.x,
                self.agent_1.hitboxes.body.origin.y,
                self.agent_1.hitboxes.body.dimension.x,
                self.agent_1.hitboxes.body.dimension.y,
                self.agent_1.combo.combo_index,
                self.agent_1.combo.action_index,
            ]
        }
    }
    
    #[test]
    fn test_framescene_from_raw_ptr() {
        let data = get_random_input_data(FrameScene::size());
        let mut expected = data.clone();
        expected.reverse();

        let ptr = Box::into_raw(Box::new(data));
        let actual: FrameScene = From::<*mut Vec<BigInt>>::from(ptr);

        assert_eq!(
            expected,
            Into::<Vec<BigInt>>::into(actual),
            "incorrect framescene conversion"
        );
    }
}
