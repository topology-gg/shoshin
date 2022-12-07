%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.math import abs_value, unsigned_div_rem, signed_div_rem, sign
from starkware.cairo.common.math_cmp import is_le, is_not_zero
from contracts.constants import (
    ns_dynamics,
    ns_object_state,
    ns_character_dimension,
    Vec2,
    CharacterState,
)
from contracts.numerics import mul_fp, div_fp_ul

func _euler_forward_no_hitbox{range_check_ptr}(
    character_state: CharacterState, object_state: felt, object_count: felt
) -> (character_state_fwd: CharacterState) {
    alloc_locals;

    local vel_fp_nxt: Vec2;

    //
    // Set acceleration (fp) according to object state
    //
    local acc_fp_x;
    let acc_fp_y = 0;  // no jump for now!
    let sign_vel_x = sign(character_state.vel_fp.x);

    if (object_state == ns_object_state.MOVE_FORWARD) {
        if (character_state.dir == 1) {
            assert acc_fp_x = ns_dynamics.MOVE_ACC_FP;
        } else {
            assert acc_fp_x = (-1) * ns_dynamics.MOVE_ACC_FP;
        }
        jmp update_vel_move;
    }

    if (object_state == ns_object_state.MOVE_BACKWARD) {
        if (character_state.dir == 1) {
            assert acc_fp_x = (-1) * ns_dynamics.MOVE_ACC_FP;
        } else {
            assert acc_fp_x = ns_dynamics.MOVE_ACC_FP;
        }
        jmp update_vel_move;
    }

    if (object_state == ns_object_state.DASH_FORWARD) {
        if (character_state.dir == 1) {
            assert acc_fp_x = ns_dynamics.DASH_ACC_FP;
        } else {
            assert acc_fp_x = (-1) * ns_dynamics.DASH_ACC_FP;
        }
        jmp update_vel_dash;
    }

    if (object_state == ns_object_state.DASH_BACKWARD) {
        if (character_state.dir == 1) {
            assert acc_fp_x = (-1) * ns_dynamics.DASH_ACC_FP;
        } else {
            assert acc_fp_x = ns_dynamics.DASH_ACC_FP;
        }
        jmp update_vel_dash;
    }

    if (object_state == ns_object_state.KNOCKED) {
        if (object_count == 0) {
            if (character_state.dir == 1) {
                // # back off the difference between normal body sprite width and knocked sprite width
                return (
                    CharacterState(
                    pos=Vec2(character_state.pos.x - ns_character_dimension.BODY_KNOCKED_ADJUST_W, character_state.pos.y),
                    vel_fp=Vec2(0, 0),
                    acc_fp=Vec2(0, 0),
                    dir=character_state.dir,
                    int=character_state.int
                    ),
                );
            } else {
                return (
                    CharacterState(
                    pos=Vec2(character_state.pos.x + 1, character_state.pos.y),
                    vel_fp=Vec2(0, 0),
                    acc_fp=Vec2(0, 0),
                    dir=character_state.dir,
                    int=character_state.int
                    ),
                );
            }
        } else {
            return (character_state,);
        }
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
        CharacterState(
        pos=Vec2(character_state.pos.x, character_state.pos.y),
        vel_fp=Vec2(0, 0),
        acc_fp=Vec2(0, 0),
        dir=character_state.dir,
        int=character_state.int
        ),
    );

    //
    // Update vel_fp with acc_fp
    //
    update_vel_move:
    let (vel_fp_nxt_: Vec2) = _euler_forward_vel_no_hitbox(
        character_state.vel_fp,
        Vec2(acc_fp_x, acc_fp_y),
        ns_dynamics.MAX_VEL_MOVE_FP,
        ns_dynamics.MIN_VEL_MOVE_FP,
    );
    assert vel_fp_nxt = vel_fp_nxt_;
    jmp update_pos;

    update_vel_dash:
    let (vel_fp_nxt_: Vec2) = _euler_forward_vel_no_hitbox(
        character_state.vel_fp,
        Vec2(acc_fp_x, acc_fp_y),
        ns_dynamics.MAX_VEL_DASH_FP,
        ns_dynamics.MIN_VEL_DASH_FP,
    );
    assert vel_fp_nxt = vel_fp_nxt_;

    //
    // Update pos with vel_fp
    //
    update_pos:
    let (pos_nxt: Vec2) = _euler_forward_pos_no_hitbox(character_state.pos, vel_fp_nxt);

    let character_state_fwd: CharacterState = CharacterState(
        pos=pos_nxt,
        vel_fp=vel_fp_nxt,
        acc_fp=Vec2(acc_fp_x, acc_fp_y),
        dir=character_state.dir,
        int=character_state.int,
    );

    return (character_state_fwd,);
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

//##

func _euler_forward_consider_hitbox{range_check_ptr}(
    character_state_0: CharacterState,
    character_state_cand_0: CharacterState,
    character_state_1: CharacterState,
    character_state_cand_1: CharacterState,
    bool_body_overlap: felt,
) -> (character_state_fwd_0: CharacterState, character_state_fwd_1: CharacterState) {
    alloc_locals;

    if (bool_body_overlap == 1) {
        //
        // Back the character bodies off from candidate positions using reversed candidate velocities;
        // X component first
        //
        let vx_fp_cand_reversed_0 = (-1) * character_state_cand_0.vel_fp.x;
        let vx_fp_cand_reversed_1 = (-1) * character_state_cand_1.vel_fp.x;

        let bool_1_to_the_right_of_0 = sign(character_state_1.pos.x - character_state_0.pos.x);
        local abs_distance;
        if (bool_1_to_the_right_of_0 == 1) {
            assert abs_distance = ns_character_dimension.BODY_HITBOX_W - (character_state_cand_1.pos.x - character_state_cand_0.pos.x);
        } else {
            assert abs_distance = ns_character_dimension.BODY_HITBOX_W - (character_state_cand_0.pos.x - character_state_cand_1.pos.x);
        }
        let abs_distance_fp_fp = abs_distance * ns_dynamics.SCALE_FP * ns_dynamics.SCALE_FP;

        let abs_relative_vx_fp = abs_value(
            character_state_cand_0.vel_fp.x - character_state_cand_1.vel_fp.x
        );
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
        let x_0 = character_state_cand_0.pos.x + back_off_x_0 + sign_0 * 2;  // # back off more to guarantee non-overlap
        let x_1 = character_state_cand_1.pos.x + back_off_x_1 + sign_1 * 2;

        //
        // Y component - do nothing for now
        //

        let character_state_fwd_0: CharacterState = CharacterState(
            pos=Vec2(x_0, character_state_cand_0.pos.y),
            vel_fp=Vec2(0, 0),
            acc_fp=character_state_cand_0.acc_fp,
            dir=character_state_cand_0.dir,
            int=character_state_cand_0.int,
        );
        let character_state_fwd_1: CharacterState = CharacterState(
            pos=Vec2(x_1, character_state_cand_1.pos.y),
            vel_fp=Vec2(0, 0),
            acc_fp=character_state_cand_1.acc_fp,
            dir=character_state_cand_1.dir,
            int=character_state_cand_1.int,
        );

        return (character_state_fwd_0, character_state_fwd_1);
    } else {
        return (character_state_cand_0, character_state_cand_1);
    }
}
