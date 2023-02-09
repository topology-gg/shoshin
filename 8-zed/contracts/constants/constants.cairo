%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.math_cmp import is_le
from starkware.cairo.common.dict_access import DictAccess
from lib.bto_cairo_git.lib.tree import Tree

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

namespace ns_stamina {
    const INIT_STAMINA = 1000;
}


namespace ns_common_stamina_effect {
    // These values are added to the players stamina
    const NULL = 50;
    const MOVE_FORWARD = 50;
    const MOVE_BACKWARD = 50;
    const BLOCK = 25;
    // These values are removed from the players stamina
    const DASH_FORWARD = 50;
    const DASH_BACKWARD = 50;
}

namespace ns_integrity {
    const INIT_INTEGRITY = 1000;
    const CRITICAL_INTEGRITY = 400;
}

namespace ns_scene {
    const X_MAX = 500;
    const X_MIN = -500;
    const BIGNUM = 2000;
}

namespace ns_combos {
    const ENCODING = 100;
}

namespace ns_stimulus {
    const NULL = 0;
    const HURT = 1;
    const KNOCKED = 2;
    const CLASH = 3;
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
    stamina: felt,
    dir: felt,
}

struct PhysicsState {
    pos: Vec2,
    vel_fp: Vec2,
    acc_fp: Vec2,
}

//
// Perceptibles
//
struct Perceptibles {
    self_physics_state: PhysicsState,
    self_body_state: BodyState,
    opponent_physics_state: PhysicsState,
    opponent_body_state: BodyState,
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
    const SELF_STA = 9;
    const SELF_BODY_STATE = 10;

    const OPPONENT_X_POS = 101;
    const OPPONENT_Y_POS = 102;
    const OPPONENT_VEL_X = 103;
    const OPPONENT_VEL_Y = 104;
    const OPPONENT_ACC_X = 105;
    const OPPONENT_ACC_Y = 106;
    const OPPONENT_DIR = 107;
    const OPPONENT_INT = 108;
    const OPPONENT_STA = 109;
    const OPPONENT_BODY_STATE = 110;
}

//
// Frame
//
struct Frame {
    mental_state: felt,
    body_state: BodyState,
    physics_state: PhysicsState,
    action: felt,
    stimulus: felt,
    hitboxes: Hitboxes,
}

struct FrameScene {
    agent_0: Frame,
    agent_1: Frame,
}

//
// Metadata
//
struct Metadata{
    character_type_0 : felt,
    character_type_1 : felt,
}
