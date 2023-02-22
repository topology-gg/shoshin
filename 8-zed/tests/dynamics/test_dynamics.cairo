%lang starknet
from starkware.cairo.common.math import abs_value
from contracts.constants.constants import (
    ns_dynamics,
    ns_character_type,
    Vec2,
    PhysicsState,
    BodyState,
)
from contracts.dynamics import _euler_forward_consider_hitbox

const PRIME = 2 ** 251 + 17 * 2 ** 192 + 1;

func get_euler_forward_consider_hitbox_example{}(
    pos_x: felt, pos_y: felt, vel_fp_x: felt, vel_fp_y: felt, acc_fp_x: felt, acc_fp_y: felt
) -> (physics_state: PhysicsState) {
    return (
        physics_state=PhysicsState(pos=Vec2(pos_x, pos_y), vel_fp=Vec2(vel_fp_x, vel_fp_y), acc_fp=Vec2(acc_fp_y, acc_fp_y)),
    );
}

@external
func test_euler_forward_consider_hitbox{range_check_ptr}() {
    alloc_locals;
    // Given
    let (physics_state_0) = get_euler_forward_consider_hitbox_example(-50, 0, 1000, 0, 0, 0);
    let (physics_state_cand_0) = get_euler_forward_consider_hitbox_example(10, 0, 1000, 0, 0, 0);
    let (physics_state_1) = get_euler_forward_consider_hitbox_example(0, 0, 0, 0, 0, 0);
    let (physics_state_cand_1) = get_euler_forward_consider_hitbox_example(0, 0, 0, 0, 0, 0);
    // When
    let (p_fwd_0, p_fwd_1) = _euler_forward_consider_hitbox(
        physics_state_0, physics_state_cand_0, physics_state_1, physics_state_cand_1, 1
    );
    // Then
    tempvar diff_pos_x = p_fwd_0.pos.x - p_fwd_1.pos.x;
    tempvar abs_diff_pos_x = abs_value(diff_pos_x);
    assert abs_diff_pos_x = 52;
    assert p_fwd_0.vel_fp.x = 0;
    assert p_fwd_1.vel_fp.x = 0;

    // Given
    let (physics_state_0) = get_euler_forward_consider_hitbox_example(0, 0, 0, 0, 0, 0);
    let (physics_state_cand_0) = get_euler_forward_consider_hitbox_example(0, 0, 0, 0, 0, 0);
    let (physics_state_1) = get_euler_forward_consider_hitbox_example(10, 0, -1000, 0, 0, 0);
    let (physics_state_cand_1) = get_euler_forward_consider_hitbox_example(-40, 0, -1000, 0, 0, 0);
    // When
    let (p_fwd_0, p_fwd_1) = _euler_forward_consider_hitbox(
        physics_state_0, physics_state_cand_0, physics_state_1, physics_state_cand_1, 1
    );
    // Then
    tempvar diff_pos_x = p_fwd_0.pos.x - p_fwd_1.pos.x;
    tempvar abs_diff_pos_x = abs_value(diff_pos_x);
    assert abs_diff_pos_x = 52;
    assert p_fwd_0.vel_fp.x = 0;
    assert p_fwd_1.vel_fp.x = 0;

    // Given
    let (physics_state_0) = get_euler_forward_consider_hitbox_example(0, 0, 1000, 0, 0, 0);
    let (physics_state_cand_0) = get_euler_forward_consider_hitbox_example(20, 0, 1000, 0, 0, 0);
    let (physics_state_1) = get_euler_forward_consider_hitbox_example(10, 0, -1000, 0, 0, 0);
    let (physics_state_cand_1) = get_euler_forward_consider_hitbox_example(-20, 0, -1000, 0, 0, 0);
    // When
    let (p_fwd_0, p_fwd_1) = _euler_forward_consider_hitbox(
        physics_state_0, physics_state_cand_0, physics_state_1, physics_state_cand_1, 1
    );
    // Then
    tempvar diff_pos_x = p_fwd_0.pos.x - p_fwd_1.pos.x;
    tempvar abs_diff_pos_x = abs_value(diff_pos_x);
    assert abs_diff_pos_x = 54;
    assert p_fwd_0.vel_fp.x = 0;
    assert p_fwd_1.vel_fp.x = 0;
    return ();
}
