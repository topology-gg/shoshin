%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.math import abs_value, unsigned_div_rem, signed_div_rem, sign
from starkware.cairo.common.math_cmp import is_le, is_not_zero
from contracts.constants.constants import (
    ns_dynamics, ns_character_type, ns_scene,
    Vec2, PhysicsState, BodyState,
)
from contracts.constants.constants_jessica import (
    ns_jessica_dynamics, ns_jessica_character_dimension, ns_jessica_action, ns_jessica_body_state
)
from contracts.constants.constants_antoc import (
    ns_antoc_dynamics, ns_antoc_character_dimension, ns_antoc_action, ns_antoc_body_state
)
from contracts.numerics import mul_fp, div_fp_ul

func _character_specific_constants {range_check_ptr}(character_type: felt) -> (
    MOVE_FORWARD: felt,
    MOVE_BACKWARD: felt,
    DASH_FORWARD: felt,
    DASH_BACKWARD: felt,
    KNOCKED: felt,
    MAX_VEL_MOVE_FP: felt,
    MIN_VEL_MOVE_FP: felt,
    MAX_VEL_DASH_FP: felt,
    MIN_VEL_DASH_FP: felt,
    MOVE_ACC_FP: felt,
    DASH_ACC_FP: felt,
    KNOCK_ACC_X_FP: felt,
    KNOCK_ACC_Y_FP: felt,
    DEACC_FP: felt,
    BODY_KNOCKED_ADJUST_W: felt,
) {
    if (character_type == ns_character_type.JESSICA) {
        return (
            ns_jessica_body_state.MOVE_FORWARD,
            ns_jessica_body_state.MOVE_BACKWARD,
            ns_jessica_body_state.DASH_FORWARD,
            ns_jessica_body_state.DASH_BACKWARD,
            ns_jessica_body_state.KNOCKED,
            ns_jessica_dynamics.MAX_VEL_MOVE_FP,
            ns_jessica_dynamics.MIN_VEL_MOVE_FP,
            ns_jessica_dynamics.MAX_VEL_DASH_FP,
            ns_jessica_dynamics.MIN_VEL_DASH_FP,
            ns_jessica_dynamics.MOVE_ACC_FP,
            ns_jessica_dynamics.DASH_ACC_FP,
            ns_jessica_dynamics.KNOCK_ACC_X_FP,
            ns_jessica_dynamics.KNOCK_ACC_Y_FP,
            ns_jessica_dynamics.DEACC_FP,
            ns_jessica_character_dimension.BODY_KNOCKED_ADJUST_W,
        );
    } else {
        return (
            ns_antoc_body_state.MOVE_FORWARD,
            ns_antoc_body_state.MOVE_BACKWARD,
            ns_antoc_body_state.DASH_FORWARD,
            ns_antoc_body_state.DASH_BACKWARD,
            ns_antoc_body_state.KNOCKED,
            ns_antoc_dynamics.MAX_VEL_MOVE_FP,
            ns_antoc_dynamics.MIN_VEL_MOVE_FP,
            ns_antoc_dynamics.MAX_VEL_DASH_FP,
            ns_antoc_dynamics.MIN_VEL_DASH_FP,
            ns_antoc_dynamics.MOVE_ACC_FP,
            ns_antoc_dynamics.DASH_ACC_FP,
            ns_antoc_dynamics.KNOCK_ACC_X_FP,
            ns_antoc_dynamics.KNOCK_ACC_Y_FP,
            ns_antoc_dynamics.DEACC_FP,
            ns_antoc_character_dimension.BODY_KNOCKED_ADJUST_W,
        );
    }
}

func _euler_forward_no_hitbox {range_check_ptr}(
    character_type: felt,
    physics_state: PhysicsState,
    body_state: BodyState,
) -> (
    physics_state_fwd: PhysicsState
) {
    alloc_locals;

    local vel_fp_nxt: Vec2;

    // unpack
    let state   = body_state.state;
    let counter = body_state.counter;
    let dir     = body_state.dir;

    // get character-specific constants for dynamics
    let (
        MOVE_FORWARD: felt,
        MOVE_BACKWARD: felt,
        DASH_FORWARD: felt,
        DASH_BACKWARD: felt,
        KNOCKED: felt,
        MAX_VEL_MOVE_FP: felt,
        MIN_VEL_MOVE_FP: felt,
        MAX_VEL_DASH_FP: felt,
        MIN_VEL_DASH_FP: felt,
        MOVE_ACC_FP: felt,
        DASH_ACC_FP: felt,
        KNOCK_ACC_X_FP: felt,
        KNOCK_ACC_Y_FP: felt,
        DEACC_FP: felt,
        BODY_KNOCKED_ADJUST_W: felt,
    ) = _character_specific_constants (character_type);

    //
    // Set acceleration (fp) according to body state
    //
    local acc_fp_x;
    local acc_fp_y;
    let sign_vel_x = sign(physics_state.vel_fp.x);
    local physics_state_fwd: PhysicsState;

    if (state == MOVE_FORWARD) {
        if (dir == 1) {
            assert acc_fp_x = MOVE_ACC_FP;
        } else {
            assert acc_fp_x = (-1) * MOVE_ACC_FP;
        }
        assert acc_fp_y = 0;
        jmp update_vel_move;
    }

    if (state == MOVE_BACKWARD) {
        if (dir == 1) {
            assert acc_fp_x = (-1) * MOVE_ACC_FP;
        } else {
            assert acc_fp_x = MOVE_ACC_FP;
        }
        assert acc_fp_y = 0;
        jmp update_vel_move;
    }

    if (state == DASH_FORWARD) {
        if (dir == 1) {
            assert acc_fp_x = DASH_ACC_FP;
        } else {
            assert acc_fp_x = (-1) * DASH_ACC_FP;
        }
        assert acc_fp_y = 0;
        jmp update_vel_dash;
    }

    if (state == DASH_BACKWARD) {
        if (dir == 1) {
            assert acc_fp_x = (-1) * DASH_ACC_FP;
        } else {
            assert acc_fp_x = DASH_ACC_FP;
        }
        assert acc_fp_y = 0;
        jmp update_vel_dash;
    }

    if (state == KNOCKED) {

        if (counter == 0) {
            // apply momentum at first frame depending on direction
            if (dir == 1) {
                // facing right
                assert acc_fp_y = KNOCK_ACC_Y_FP;
                assert acc_fp_x = (-1) * KNOCK_ACC_X_FP;
            } else {
                // facing left
                assert acc_fp_y = KNOCK_ACC_Y_FP;
                assert acc_fp_x = KNOCK_ACC_X_FP;
            }
        } else {
            // apply gravity
            assert acc_fp_x = 0;
            assert acc_fp_y = ns_dynamics.GRAVITY_ACC_FP;
        }

        jmp update_vel_knocked;
    }

    // # otherwise, deaccelerate dramatically
    // if sign_vel_x == 1:
    //     assert acc_fp_x = -1 * ns_dynamics.DEACC_FP
    // else:
    //     if sign_vel_x == -1:
    //         assert acc_fp_x = ns_dynamics.DEACC_FP
    //     else:
    //         assert acc_fp_x = 0
    //     end
    // end

    // otherwise, set velocity to zero (instant stop)
    return (
        PhysicsState(
            pos=Vec2(physics_state.pos.x, physics_state.pos.y),
            vel_fp=Vec2(0, 0),
            acc_fp=Vec2(0, 0),
        ),
    );

    //
    // Update vel_fp with acc_fp
    //
    update_vel_move:
    let (vel_fp_nxt_: Vec2) = _euler_forward_vel_no_hitbox(
        physics_state.vel_fp,
        Vec2(acc_fp_x, acc_fp_y),
        MAX_VEL_MOVE_FP,
        MIN_VEL_MOVE_FP,
    );
    assert vel_fp_nxt = vel_fp_nxt_;
    jmp update_pos;

    update_vel_dash:
    let (vel_fp_nxt_: Vec2) = _euler_forward_vel_no_hitbox(
        physics_state.vel_fp,
        Vec2(acc_fp_x, acc_fp_y),
        MAX_VEL_DASH_FP,
        MIN_VEL_DASH_FP,
    );
    assert vel_fp_nxt = vel_fp_nxt_;
    jmp update_pos;

    update_vel_knocked:
    // reusing dash's max & min velocity for knocked physics for now
    // note: only x-axis velocity is capped by max & min
    let (vel_fp_nxt_: Vec2) = _euler_forward_vel_no_hitbox(
        physics_state.vel_fp,
        Vec2(acc_fp_x, acc_fp_y),
        MAX_VEL_DASH_FP,
        MIN_VEL_DASH_FP,
    );
    assert vel_fp_nxt = vel_fp_nxt_;
    jmp update_pos;

    //
    // Update pos with vel_fp
    //
    update_pos:
    let (pos_nxt: Vec2) = _euler_forward_pos_no_hitbox(physics_state.pos, vel_fp_nxt);
    assert physics_state_fwd = PhysicsState(
        pos=pos_nxt,
        vel_fp=vel_fp_nxt,
        acc_fp=Vec2(acc_fp_x, acc_fp_y),
    );
    tempvar range_check_ptr = range_check_ptr;

    cap:
    let (x_cap) = _cap_fp(physics_state_fwd.pos.x, ns_scene.X_MAX, ns_scene.X_MIN);
    let physics_state_fwd: PhysicsState = PhysicsState(
        pos=Vec2(x=x_cap, y=physics_state_fwd.pos.y),
        vel_fp=physics_state_fwd.vel_fp,
        acc_fp=physics_state_fwd.acc_fp,
    );

    return (physics_state_fwd,);
}

func _euler_forward_vel_no_hitbox{range_check_ptr}(
    vel_fp: Vec2, acc_fp: Vec2, max_vel_x_fp: felt, min_vel_x_fp: felt
) -> (vel_fp_nxt: Vec2) {
    alloc_locals;

    let (delta_vel_x) = mul_fp(acc_fp.x, ns_dynamics.DT_FP);
    let (delta_vel_y) = mul_fp(acc_fp.y, ns_dynamics.DT_FP);

    let (vel_fp_nxt_x) = _cap_fp(vel_fp.x + delta_vel_x, max_vel_x_fp, min_vel_x_fp);
    let vel_fp_nxt_y = vel_fp.y + delta_vel_y;  // # not capping on y axis for now

    return (Vec2(vel_fp_nxt_x, vel_fp_nxt_y),);
}

func _euler_forward_pos_no_hitbox{range_check_ptr}(pos: Vec2, vel_fp: Vec2) -> (pos_nxt: Vec2) {
    alloc_locals;

    let (delta_pos_x_) = mul_fp(vel_fp.x, ns_dynamics.DT_FP);
    let (delta_pos_y_) = mul_fp(vel_fp.y, ns_dynamics.DT_FP);
    let (delta_pos_x) = div_fp_ul(delta_pos_x_, ns_dynamics.SCALE_FP);
    let (delta_pos_y) = div_fp_ul(delta_pos_y_, ns_dynamics.SCALE_FP);

    return (Vec2(
        pos.x + delta_pos_x,
        pos.y + delta_pos_y
        ),);
}

func _cap_fp{range_check_ptr}(x_fp: felt, max_fp: felt, min_fp: felt) -> (x_fp_capped: felt) {
    alloc_locals;

    let bool_ge_max = is_le(max_fp, x_fp);
    let bool_le_min = is_le(x_fp, min_fp);

    if (bool_ge_max == 1) {
        return (max_fp,);
    }

    if (bool_le_min == 1) {
        return (min_fp,);
    }

    return (x_fp,);
}

func _is_cap_fp{range_check_ptr}(x_fp: felt, max_fp: felt, min_fp: felt) -> (is_x_fp_capped: felt) {
    let is_max = x_fp - max_fp;
    if (is_max == 0) {
        return (is_x_fp_capped=1);
    }

    let is_min = x_fp - min_fp;
    if (is_min == 0) {
        return (is_x_fp_capped=1);
    }

    return (is_x_fp_capped=0);
}

//##

func _euler_forward_consider_hitbox{range_check_ptr}(
    physics_state_0: PhysicsState,
    physics_state_cand_0: PhysicsState,
    physics_state_1: PhysicsState,
    physics_state_cand_1: PhysicsState,
    body_dim_0: Vec2,
    body_dim_1: Vec2,
    bool_body_overlap: felt,
    bool_agent_0_ground: felt,
    bool_agent_1_ground: felt,
    bool_agent_0_knocked: felt,
    bool_agent_1_knocked: felt,
) -> (
    physics_state_fwd_0: PhysicsState,
    physics_state_fwd_1: PhysicsState,
) {
    alloc_locals;

    //
    // Y component first
    // If overlapping with ground, snap body to ground and set y-axis velocity to 0
    //
    local y_0_ground_handled;
    local y_1_ground_handled;
    local vy_fp_0_ground_handled;
    local vy_fp_1_ground_handled;

    if (bool_agent_0_ground == 1) {
        assert y_0_ground_handled = 0;
        assert vy_fp_0_ground_handled = 0;
    } else {
        assert y_0_ground_handled = physics_state_cand_0.pos.y;
        assert vy_fp_0_ground_handled = physics_state_cand_0.vel_fp.y;
    }

    if (bool_agent_1_ground == 1) {
        assert y_1_ground_handled = 0;
        assert vy_fp_1_ground_handled = 0;
    } else {
        assert y_1_ground_handled = physics_state_cand_1.pos.y;
        assert vy_fp_1_ground_handled = physics_state_cand_1.vel_fp.y;
    }

    if (bool_body_overlap == 1) {
        //
        // Handle X component only in case body-body overlaps
        // Back the character bodies off from candidate positions using reversed candidate velocities;
        //
        let sign_vx_cand_0 = sign(physics_state_cand_0.vel_fp.x);
        let sign_vx_cand_1 = sign(physics_state_cand_1.vel_fp.x);
        local vx_fp_cand_reversed_0;
        local vx_fp_cand_reversed_1;
        let bool_1_to_the_right_of_0 = sign(physics_state_1.pos.x - physics_state_0.pos.x);

        local abs_distance;
        local move_0;
        local move_1;
        local abs_relative_vx_fp;

        // check if agent against the boundaries
        // only use the speed of unbounded agents
        let (is_capped_0) = _is_cap_fp(physics_state_cand_0.pos.x, ns_scene.X_MAX, ns_scene.X_MIN);
        let (is_capped_1) = _is_cap_fp(physics_state_cand_1.pos.x, ns_scene.X_MAX, ns_scene.X_MIN);
        if (is_capped_0 == 1) {
            assert move_0 = 0;
            assert move_1 = 1;
            assert abs_relative_vx_fp = abs_value(physics_state_cand_1.vel_fp.x);
        } else {
            if (is_capped_1 == 1) {
                assert move_0 = 1;
                assert move_1 = 0;
                assert abs_relative_vx_fp = abs_value(physics_state_cand_0.vel_fp.x);
            } else {
                assert move_0 = 1;
                assert move_1 = 1;
                assert abs_relative_vx_fp = abs_value(
                    physics_state_cand_0.vel_fp.x - physics_state_cand_1.vel_fp.x
                );
            }
        }
        tempvar range_check_ptr = range_check_ptr;

        // note: assuming Jessica and Antoc shares the same BODY_HITBOX_W !
        if (bool_1_to_the_right_of_0 == 1) {
            assert abs_distance = body_dim_0.x - (physics_state_cand_1.pos.x - physics_state_cand_0.pos.x);
            assert vx_fp_cand_reversed_0 = (-1) * sign_vx_cand_0 * physics_state_cand_0.vel_fp.x;
            assert vx_fp_cand_reversed_1 = (-1) * sign_vx_cand_1 * physics_state_cand_1.vel_fp.x;
        } else {
            assert abs_distance = body_dim_1.x - (physics_state_cand_0.pos.x - physics_state_cand_1.pos.x);
            assert vx_fp_cand_reversed_0 = sign_vx_cand_0 * physics_state_cand_0.vel_fp.x;
            assert vx_fp_cand_reversed_1 = sign_vx_cand_1 * physics_state_cand_1.vel_fp.x;
        }
        let abs_distance_fp_fp = abs_distance * ns_dynamics.SCALE_FP * ns_dynamics.SCALE_FP;

        let (time_required_to_separate_fp, _) = unsigned_div_rem(
            abs_distance_fp_fp, abs_relative_vx_fp
        );

        let back_off_x_0_scaled = vx_fp_cand_reversed_0 * time_required_to_separate_fp;
        let back_off_x_1_scaled = vx_fp_cand_reversed_1 * time_required_to_separate_fp;
        let (back_off_x_0, _) = signed_div_rem(
            back_off_x_0_scaled,
            ns_dynamics.SCALE_FP * ns_dynamics.SCALE_FP,
            ns_dynamics.RANGE_CHECK_BOUND,
        );
        let (back_off_x_1, _) = signed_div_rem(
            back_off_x_1_scaled,
            ns_dynamics.SCALE_FP * ns_dynamics.SCALE_FP,
            ns_dynamics.RANGE_CHECK_BOUND,
        );

        let sign_0 = sign(back_off_x_0);
        let sign_1 = sign(back_off_x_1);
        // prevent backing off if against boundaries
        let x_0 = physics_state_cand_0.pos.x + (back_off_x_0 + sign_0 * 2) * move_0;  // # back off more to guarantee non-overlap
        let x_1 = physics_state_cand_1.pos.x + (back_off_x_1 + sign_1 * 2) * move_1;

        //
        // If knocked, keep candidate X velocity, otherwise set to 0
        //
        local vx_fp_0_final;
        local vx_fp_1_final;
        if (bool_agent_0_knocked == 1) {
            assert vx_fp_0_final = physics_state_cand_0.vel_fp.x;
        } else {
            assert vx_fp_0_final = 0;
        }
        if (bool_agent_1_knocked == 1) {
            assert vx_fp_1_final = physics_state_cand_1.vel_fp.x;
        } else {
            assert vx_fp_1_final = 0;
        }

        let physics_state_fwd_0: PhysicsState = PhysicsState(
            pos = Vec2(x_0, y_0_ground_handled),
            vel_fp = Vec2(vx_fp_0_final, vy_fp_0_ground_handled),
            acc_fp = physics_state_cand_0.acc_fp,
        );
        let physics_state_fwd_1: PhysicsState = PhysicsState(
            pos = Vec2(x_1, y_1_ground_handled),
            vel_fp = Vec2(vx_fp_1_final, vy_fp_1_ground_handled),
            acc_fp = physics_state_cand_1.acc_fp,
        );

        return (physics_state_fwd_0, physics_state_fwd_1);
    } else {

        let physics_state_fwd_0: PhysicsState = PhysicsState(
            pos = Vec2(physics_state_cand_0.pos.x, y_0_ground_handled),
            vel_fp = Vec2(physics_state_cand_0.vel_fp.x, vy_fp_0_ground_handled),
            acc_fp = physics_state_cand_0.acc_fp,
        );
        let physics_state_fwd_1: PhysicsState = PhysicsState(
            pos = Vec2(physics_state_cand_1.pos.x, y_1_ground_handled),
            vel_fp = Vec2(physics_state_cand_1.vel_fp.x, vy_fp_1_ground_handled),
            acc_fp = physics_state_cand_1.acc_fp,
        );

        return (physics_state_fwd_0, physics_state_fwd_1);
    }
}
