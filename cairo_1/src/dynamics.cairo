// Placeholder functions to check compilation, will be replaced.

fn mul_fp(a: felt252, b: felt252) -> felt252 {
    return 0;
}

const GRAVITY_ACC_FP: felt252 = 0;
const DT_FP: felt252 = 0;
const SCALE_FP: felt252 = 0;

// Placeholder end.

enum CharacterType {
    Antoc: (),
    Jessica: (),
}

#[derive(Copy, Drop)]
struct Vec2 {
    x: felt252,
    y: felt252,
}

struct PhysicsState {
    pos: Vec2,
    vel_fp: Vec2,
    acc_fp: Vec2,
}

trait CharacterPhysics<T> {
    // Dynamics related constants
    fn MAX_VEL_MOVE_FP() -> felt252;
    fn MIB_VEL_MOVE_FP() -> felt252;

    fn MAX_VEL_DASH_FP() -> felt252;
    fn MIN_VEL_DASH_FP() -> felt252;

    fn MOVE_ACC_FP() -> felt252;
    fn DASH_ACC_FP() -> felt252;

    fn KNOCK_VEL_X_FP() -> felt252;
    fn KNOCK_VEL_Y_FP() -> felt252;

    fn DEACC_FP() -> felt252;

    // Dimension related constants
    fn BODY_KNOCKED_ADJUST_W() -> felt252;
    // TODO

    // Action related constants
    // TODO

    // Stamina effects related constants
    // TODO

    // Body state related constants
    // TODO

    //

    // common body state getters
    fn is_in_move_forward(ref self: T) -> bool;
    fn is_in_move_backward(ref self: T) -> bool;
    fn is_in_dash_forward(ref self: T) -> bool;
    fn is_in_dash_backward(ref self: T) -> bool;
    fn is_in_knocked(ref self: T) -> bool;

    fn dir(ref self: T) -> felt252;
    fn counter(ref self: T) -> felt252;
}

#[derive(PartialEq, Copy, Drop)]
enum AntocBodyState {
    Idle: (),
    Hori: (),
    Vert: (),
    Block: (),
    Hurt: (),
    Knocked: (),
    MoveForward: (),
    MoveBackward: (),
    DashForward: (),
    DashBackward: (),
}

#[derive(Copy, Drop)]
struct Antoc {
    body_state: AntocBodyState,
    dir: felt252,
    counter: felt252,
}

impl AntocPhysics of CharacterPhysics::<Antoc> {
    // Dynamics
    // Note: https://github.com/starkware-libs/cairo/pull/2563
    fn MAX_VEL_MOVE_FP() -> felt252 {
        100 * SCALE_FP
    }
    fn MIB_VEL_MOVE_FP() -> felt252 {
        (-100) * SCALE_FP
    }

    fn MAX_VEL_DASH_FP() -> felt252 {
        900 * SCALE_FP
    }
    fn MIN_VEL_DASH_FP() -> felt252 {
        (-900) * SCALE_FP
    }

    fn MOVE_ACC_FP() -> felt252 {
        300 * SCALE_FP
    }
    fn DASH_ACC_FP() -> felt252 {
        900 * SCALE_FP
    }

    fn KNOCK_VEL_X_FP() -> felt252 {
        150 * SCALE_FP
    }
    fn KNOCK_VEL_Y_FP() -> felt252 {
        400 * SCALE_FP
    }

    fn DEACC_FP() -> felt252 {
        10000 * SCALE_FP
    }

    // Dimension

    fn BODY_KNOCKED_ADJUST_W() -> felt252 {
        0 // TODO // Self::BODY_KNOCKED_LATE_HITBOX_W - Self::BODY_HITBOX_W;
    }

    // body state
    fn is_in_move_forward(ref self: Antoc) -> bool {
        match self.body_state {
            AntocBodyState::MoveForward(()) 
        }
        self.body_state == AntocBodyState::MoveForward(())
    }

    fn is_in_move_backward(ref self: Antoc) -> bool {
        self.body_state == AntocBodyState::MoveBackward(())
    }

    fn is_in_dash_forward(ref self: Antoc) -> bool {
        self.body_state == AntocBodyState::DashForward(())
    }

    fn is_in_dash_backward(ref self: Antoc) -> bool {
        self.body_state == AntocBodyState::DashBackward(())
    }

    fn is_in_knocked(ref self: Antoc) -> bool {
        self.body_state == AntocBodyState::Knocked(())
    }

    fn dir(ref self: Antoc) -> felt252 {
        self.dir
    }

    fn counter(ref self: Antoc) -> felt252 {
        self.counter
    }
}

fn euler_forward_no_hitbox<C, impl T: CharacterPhysics<C>>(mut character: C, physics_state: PhysicsState) -> PhysicsState {
    // TODO: using mut variables initialized may cause memory override instead of circuit assertion, which may cause significant overhead
    // find out cairo 1.0 syntax how to handle this(the compiler complains if no initial value is provided)
    let mut vel_fp_next: Vec2 = Vec2{x: 0, y: 0};
    let mut acc_fp_x: felt252 = 0;
    let mut acc_fp_y: felt252 = 0;
    let mut vel_fp_x: felt252 = 0;
    let mut vel_fp_y: felt252 = 0;

    if (character.is_in_move_forward()) {
        acc_fp_x = character.dir() * C::MOVE_ACC_FP();
        // jmp update_vel_move;
    }
    
    else if (character.is_in_move_backward()) {
        acc_fp_x = character.dir() * C::MOVE_ACC_FP() * (-1);
        // jmp update_vel_move;
    } 
    
    else if (character.is_in_dash_forward()) {
        let vel = character.dir() * C::DASH_VEL_FP();
        if (character.counter() == 1) {
            vel_fp_next = Vec2{x: vel, y: 0};
        } else {
            vel_fp_next = Vec2{x: 0, y: 0};
        }
        acc_fp_x = 0;
        acc_fp_y = 0;
        // jmp update_pos;
    } 
    
    else if (character.is_in_dash_backward()) {
        let vel = character.dir() * T::DASH_VEL_FP() * (-1);
        if (character.counter() == 1) {
            vel_fp_next = Vec2{x: vel, y: 0};
        } else {
            vel_fp_next = Vec2{x: 0, y: 0};
        }
        // jmp update_pos;
    }

    else if (character.is_in_knocked()) {
        if (character.counter() == 0) {
            vel_fp_y = T::KNOCK_VEL_Y_FP();
            vel_fp_x = character.dir() * T::KNOCK_VEL_X_FP() * (-1);
            acc_fp_y = 0;
            acc_fp_x = 0;
        } else {
            acc_fp_y = GRAVITY_ACC_FP;
            acc_fp_x = 0;
            vel_fp_y = physics_state.vel_fp.y;
            if (character.counter() == 9) {
                vel_fp_x = 0;
            } else {
                vel_fp_x = physics_state.vel_fp.x;
            }
        }

        // jmp update_vel_knocked;
    }

    else {
        return PhysicsState {
            pos: Vec2{x: physics_state.pos.x, y: physics_state.pos.y},
            vel_fp: Vec2{x: 0, y: 0},
            acc_fp: Vec2{x: 0, y: 0},
        };
    }

    // TODO
}

fn euler_forward_vel_no_hitbox(
    vel_fp: Vec2, acc_fp: Vec2, max_vel_x_fp: felt252, min_vel_x_fp: felt252
) -> Vec2 {
    let delta_vel_x = mul_fp(acc_fp.x, DT_FP);
    let delta_vel_y = mul_fp(acc_fp.y, DT_FP);

    let vel_fp_next_x = cap_fp(vel_fp.x + delta_vel_x, max_vel_x_fp, min_vel_x_fp);
    let vel_fp_next_y = vel_fp.y + delta_vel_y;

    return Vec2{x: vel_fp_next_x, y: vel_fp_next_y};
}

fn cap_fp(x_fp: felt252, max_fp: felt252, min_fp: felt252) -> felt252 {
    // TODO: comparison may need importing corelib traits
    if (max_fp < x_fp) {
        return max_fp;
    }

    if (x_fp < min_fp) {
        return min_fp;
    }

    return x_fp;
}

fn is_cap_fp(x_fp: felt252, max_fp: felt252, min_fp: felt252) -> bool {
    // TODO
}

fn euler_forward_consider_hitbox(
    physics_state_0: PhysicsState,
    physics_state_cand_0: PhysicsState,
    physics_state_1: PhysicsState,
    physics_state_cand_1: PhysicsState,
    body_dim_0: Vec2,
    body_dim_1: Vec2,
    body_overlap: bool,
    agent_0_ground: bool,
    agent_1_ground: bool,
    agent_0_knocked: bool,
    agent_1_knocked: bool,
) -> (PhysicsState, PhysicsState) {
    let mut y_0_ground_handled: felt252 = 0;
    let mut y_1_ground_handled: felt252 = 0;
    let mut vy_fp_0_ground_handled: felt252 = 0;
    let mut vy_fp_1_ground_handled: felt252 = 0;

    if (agent_0_ground) {
        y_0_ground_handled = 0;
        vy_fp_0_ground_handled = 0;
    } else {
        y_0_ground_handled = physics_state_cand_0.pos.y;
        vy_fp_0_ground_handled = physics_state_cand_0.vel_fp.y
    }

    if (!body_overlap) {
        let physics_state_fwd_0 = PhysicsState {
            pos: Vec2{x: physics_state_cand_0.pos.x, y: y_0_ground_handled},
            vel_fp: Vec2{x: physics_state_cand_0.vel_fp.x, y: vy_fp_0_ground_handled},
            acc_fp :physics_state_cand_0.acc_fp,
        };

        let physics_state_fwd_1 = PhysicsState {
            pos: Vec2{x: physics_state_cand_1.pos.x, y: y_1_ground_handled},
            vec_fp: Vec2{x: physics_state_cand_1}
        };
    }

    //
    // Handle X component only in case body-body overlaps
    // Back the character bodies off from candidate positions using reversed candidate velocities;
    //

    let mut move_0: felt252 = 0;
    let mut move_1: felt252 = 0;
    let mut abs_relative_vx_fp: felt252 = 0;

    if (is_cap_fp(physics_state_cand_0.pos.x, X_MAX, ns_scene.X_MIN)) {
        move_0 = 0;
        move_1 = 1;
        abs_relative_vx_fp = abs_value(physics_state_cand_1.vel_fp.x);
    } else if (is_cap_fp(physics_state_cand_1.pos.x, X_MAX, X_MIN)) {
        move_0 = 1;
        move_1 = 0;
        abs_relative_vx_fp = abs_value(physics_state_cand_0.vel_fp.x);
    } else {
        move_0 = 1;
        move_1 = 1;
        abs_relative_vx_fp = abs_value(physics_state_cand_1.vel_fp.x)
    }

    let mut direction: felt252 = 0;

    // note: body_dim_i contains the current body dimension
    // fix direction of backoff based on how agents are placed
    // TODO: comparison needs traits
    if (physics_state_1.pos.x > physics_state_0.pos.x) {
        abs_distance = body_dim_0.x - (physics_state_cand_1.pos.x - physics_state_cand_0.pos.x);
        direction = -1;
    } else {
        abs_distance = body_dim_1.x - (physics_state_cand_0.pos.x - physics_state_cand_1.pox.x);
        direction = 1;
    }

    // abs(physics_state_cand_0.vel_fp.x) = sign_vx_cand_0 * physics_state_cand_0.vel_fp.x;
    // direction = -1 if 1 to the right of 0 else 1 
    let vx_fp_cand_reversed_0: felt252 = direction * sign_vx_cand_0 * physics_state_cand_0.vel_fp.x;
    let vx_fp_cand_reversed_1: felt252 = (-direction) * sign_vx_cand_1 * physics_state_cand_1.vel_fp.x;
    let abs_distance_fp_fp = abs_distance * SCALE_FP * SCALE_FP;

    let mut back_off_x_0_scaled: felt252 = 0;
    let mut back_off_x_1_scaled: felt252 = 0;

    // avoid division by 0 if abs_relative_vx_fp == 0 
    // use direction in order to set the sign for back_off_x_i_scaled
    if (abs_relative_vx_fp == 0) {
        let abs_distance_fp_half = abs_distance_fp_fp / 2;
        back_off_x_0_scaled = (direction) * abs_distance_fp_half * (2 * move_0 - move_1);
        let back_off_x_1_scaled = (-direction) * abs_distance_fp_half * (2 * move_1 - move_0);
    } else {
        let time_required_to_separate_fp = unsigned_div_rem(abs_distance_fp_fp, abs_relative_vx_fp);
        back_off_x_0_scaled = vx_fp_cand_reversed_0 * time_required_to_separate_fp;
        back_off_x_1_scaled = vx_fp_cand_reversed_1 * time_required_to_separate_fp;
    }

    let back_off_x_0 = signed_div_rem(
        back_off_x_0_scaled,
        SCALE_FP * SCALE_FP,
        RANGE_CHECK_BOUND,
    );

    let back_off_x_1 = signed_div_rem(
        back_off_x_1_scaled,
        SCALE_FP * SCALE_FP,
        RANGE_CHECK_BOUND,
    );

    let mut vx_fp_0_final: felt252 = 0;
    let mut vx_fp_1_final: felt252 = 1;
    if (agent_0_knocked) {
        vx_fp_0_final = physics_state_cand_0.vel_fp.x;
    } else {
        vx_fp_0_final = 0;
    }
    if (agent_1_knocked) {
        vx_fp_1_final = physics_state_cand_1.vel_fp.x;
    } else {
        vx_fp_1_final = 0;
    }

    let physics_state_fwd_0: PhysicsState = PhysicsState {
        pos: Vec2{x: x_0, y: y_0_ground_handled},
        vel_fp: Vec2{x: vx_fp_0_final, y: vy_fp_0_ground_handled},
        acc_fp: physics_state_cand_0.acc_fp,
    };
    let physics_state_fwd_1: PhysicsState = PhysicsState {
        pos: Vec2{x: x_1, y: y_1_ground_handled},
        vel_fp: Vec2{x: vx_fp_1_final, y: vy_fp_1_ground_handled},
        acc_fp: physics_state_cand_1.acc_fp,
    };

    return (physics_state_fwd_0, physics_state_fwd_1);
}