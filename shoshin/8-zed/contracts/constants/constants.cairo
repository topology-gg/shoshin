%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin

namespace ns_character_type {
    const JESSICA = 0;
    const ANTOC = 1;
}

namespace ns_dynamics {
    const RANGE_CHECK_BOUND = 2 ** 120;
    const SCALE_FP = 10 ** 4;
    const SCALE_FP_SQRT = 10 ** 2;
    const DT_FP = 10 ** 3;  // 0.1

    const GRAVITY_ACC_FP = -2100 * ns_dynamics.SCALE_FP;
}

namespace ns_stamina {
    const INIT_STAMINA = 1000;
}

namespace ns_common_stamina_effect {
    // These values are applied every frame in the body state
    const NULL = 50; // replenish stamina
    const MOVE_FORWARD = 25; // replenish stamina
    const MOVE_BACKWARD = 25; // replenish stamina
    const BLOCK = -25; // consumes stamina
    const JUMP = -25; // consumes stamina

    // These values are applied in the first frame of body state
    const DASH_FORWARD = -200; // consumes stamina
    const DASH_BACKWARD = -200; // consumes stamina
}

namespace ns_integrity {
    const INIT_INTEGRITY = 1000;
    const CRITICAL_INTEGRITY = 400;
}

namespace ns_scene {
    const X_MAX = 400;
    const X_MIN = -400;
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

namespace ns_hitbox {
    const NUDGE = 5;
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
    fatigued : felt,
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
    const SELF_BODY_COUNTER = 11;

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
    const OPPONENT_BODY_COUNTER = 111;
}

//
// Frame
//
struct Combo {
    combo_index: felt,
    action_index: felt,
}

struct Frame {
    mental_state: felt,
    body_state: BodyState,
    physics_state: PhysicsState,
    action: felt,
    stimulus: felt,
    hitboxes: Hitboxes,
    combo: Combo,
}

struct RealTimePlayer {
    body_state: BodyState,
    physics_state: PhysicsState,
    stimulus: felt,
    hitboxes: Hitboxes,
}

struct RealTimeComboInfo {
    current_combo: felt,
    combo_counter: felt,
}
struct RealTimeAgent {
    body_state: BodyState,
    physics_state: PhysicsState,
    stimulus: felt,
    hitboxes: Hitboxes,
    mental_state : felt,
    combo_info : RealTimeComboInfo,
}

struct FrameScene {
    agent_0: Frame,
    agent_1: Frame,
}

struct RealTimeFrameScene {
    agent_0: RealTimePlayer,
    agent_1: RealTimeAgent,
}

//
// Metadata
//
struct Metadata{
    character_type_0 : felt,
    character_type_1 : felt,
}


const HURT_EFFECT = 100;
const KNOCKED_EFFECT = 200;
const CLASH_EFFECT = 25;