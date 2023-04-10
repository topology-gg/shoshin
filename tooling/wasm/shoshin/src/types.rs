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
pub struct FrameScene {
    pub _agent_0: Agent,
    pub _agent_1: Agent,
}

#[derive(Default, Debug, Serialize, Deserialize, CairoStruct)]
pub struct Agent {
    pub _mental_state: BigInt,
    pub _body_state: BodyState,
    pub _physics_state: PhysicsState,
    pub _action: BigInt,
    pub _stimulus: BigInt,
    pub _hitboxes: Hitboxes,
    pub _combo: Combo,
}

#[derive(Default, Debug, Serialize, Deserialize, CairoStruct)]
pub struct BodyState {
    pub _state: BigInt,
    pub _counter: BigInt,
    pub _integrity: BigInt,
    pub _stamina: BigInt,
    pub _dir: BigInt,
    pub _fatigued: BigInt,
}

#[derive(Default, Debug, Serialize, Deserialize, CairoStruct)]
pub struct PhysicsState {
    pub _pos: Vector,
    pub _vel_fp: Vector,
    pub _acc_fp: Vector,
}

#[derive(Default, Debug, Serialize, Deserialize, CairoStruct)]
pub struct Hitboxes {
    pub _action: Rectangle,
    pub _body: Rectangle,
}

#[derive(Default, Debug, Serialize, Deserialize, CairoStruct)]
pub struct Rectangle {
    pub _origin: Vector,
    pub _dimension: Vector,
}

#[derive(Default, Debug, Serialize, Deserialize, CairoStruct)]
pub struct Vector {
    pub _x: BigInt,
    pub _y: BigInt,
}

#[derive(Default, Debug, Serialize, Deserialize, CairoStruct)]
pub struct Combo {
    pub _combo_index: BigInt,
    pub _action_index: BigInt,
}

impl Sizeable for FrameScene {
    fn size() -> usize {
        50
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
                self._agent_0._mental_state,
                self._agent_0._body_state._state,
                self._agent_0._body_state._counter,
                self._agent_0._body_state._integrity,
                self._agent_0._body_state._stamina,
                self._agent_0._body_state._dir,
                self._agent_0._body_state._fatigued,
                self._agent_0._physics_state._pos._x,
                self._agent_0._physics_state._pos._y,
                self._agent_0._physics_state._vel_fp._x,
                self._agent_0._physics_state._vel_fp._y,
                self._agent_0._physics_state._acc_fp._x,
                self._agent_0._physics_state._acc_fp._y,
                self._agent_0._action,
                self._agent_0._stimulus,
                self._agent_0._hitboxes._action._origin._x,
                self._agent_0._hitboxes._action._origin._y,
                self._agent_0._hitboxes._action._dimension._x,
                self._agent_0._hitboxes._action._dimension._y,
                self._agent_0._hitboxes._body._origin._x,
                self._agent_0._hitboxes._body._origin._y,
                self._agent_0._hitboxes._body._dimension._x,
                self._agent_0._hitboxes._body._dimension._y,
                self._agent_0._combo._combo_index,
                self._agent_0._combo._action_index,
                self._agent_1._mental_state,
                self._agent_1._body_state._state,
                self._agent_1._body_state._counter,
                self._agent_1._body_state._integrity,
                self._agent_1._body_state._stamina,
                self._agent_1._body_state._dir,
                self._agent_1._body_state._fatigued,
                self._agent_1._physics_state._pos._x,
                self._agent_1._physics_state._pos._y,
                self._agent_1._physics_state._vel_fp._x,
                self._agent_1._physics_state._vel_fp._y,
                self._agent_1._physics_state._acc_fp._x,
                self._agent_1._physics_state._acc_fp._y,
                self._agent_1._action,
                self._agent_1._stimulus,
                self._agent_1._hitboxes._action._origin._x,
                self._agent_1._hitboxes._action._origin._y,
                self._agent_1._hitboxes._action._dimension._x,
                self._agent_1._hitboxes._action._dimension._y,
                self._agent_1._hitboxes._body._origin._x,
                self._agent_1._hitboxes._body._origin._y,
                self._agent_1._hitboxes._body._dimension._x,
                self._agent_1._hitboxes._body._dimension._y,
                self._agent_1._combo._combo_index,
                self._agent_1._combo._action_index,
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
