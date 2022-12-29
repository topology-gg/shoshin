%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.math_cmp import is_le
from starkware.cairo.common.dict_access import DictAccess
from lib.bto_cairo.lib.tree import Tree

namespace ns_character_type {
    const JESSICA = 0;
    const ANTOC = 1;
}

namespace ns_dynamics {
    const RANGE_CHECK_BOUND = 2 ** 120;
    const SCALE_FP = 10 ** 4;
    const SCALE_FP_SQRT = 10 ** 2;
    const DT_FP = 10 ** 3;  // 0.1
}

struct Stm {
    reg0: felt,
}

namespace ns_scene {
    const X_MAX = 500;
    const X_MIN = -500;
    const BIGNUM = 2000;
}

namespace ns_env {
    const STORM_PENALTY = 10;
}

namespace ns_combos {
    const ENCODING = 100;
}

namespace ns_stimulus {
    const NULL = 0;
    const HURT = 1;
    const KNOCKED = 2;
    const CLASH = 3;
    const BLOCKED = 4;
}

namespace ns_perceptibles {
    const SELF_X_POS = 1;
    const SELF_Y_POS = 2;

    const SELF_VEL_X = 3;
    const SELF_VEL_Y = 4;

    const SELF_ACC_X = 5;
    const SELF_ACC_Y = 6;

    const SELF_DIR = 7;

    const SELF_INT = 8;

    const SELF_STATE = 9;

    const OPPONENT_X_POS = 10;
    const OPPONENT_Y_POS = 11;

    const OPPONENT_VEL_X = 12;
    const OPPONENT_VEL_Y = 13;

    const OPPONENT_ACC_X = 14;
    const OPPONENT_ACC_Y = 15;

    const OPPONENT_DIR = 16;

    const OPPONENT_INT = 17;

    const OPPONENT_STATE = 18;
}

struct Vec2 {
    x: felt,
    y: felt,
}

struct Rectangle {
    origin: Vec2,
    dimension: Vec2,
}

struct ComboBuffer {
    combos_offset_len: felt,
    combos_offset: felt*,
    combos: felt*,
    current_combo: felt,
    combo_counter: felt,
}

struct Hitboxes {
    action: Rectangle,
    body: Rectangle,
}

struct PhysicsScene {
    agent_0: Hitboxes,
    agent_1: Hitboxes,
}

struct BodyState {
    state: felt,
    counter: felt,
    integrity: felt,
    stamina: felt
    dir: felt
}

struct PhysicsState {
    pos: Vec2,
    vel_fp: Vec2,
    acc_fp: Vec2
}

//
// Perceptibles
//
struct Perceptibles {
    self_character_state: CharacterState,
    self_body_state: BodyState,
    opponent_character_state: CharacterState,
    opponent_body_state: BodyState,
}

struct Frame {
    agent_action: felt,
    agent_state: felt,
    agent_stm: Stm,
    object_state: felt,
    object_counter: felt,
    character_state: CharacterState,
    hitboxes: Hitboxes,
    stimulus: felt,
}

struct FrameScene {
    agent_0: Frame,
    agent_1: Frame,
}
