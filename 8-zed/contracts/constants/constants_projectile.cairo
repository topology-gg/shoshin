%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.math_cmp import is_le
from contracts.constants.constants import (
    ns_dynamics, Vec2, Rectangle, ns_hitbox, ns_scene, LEFT, RIGHT
)

namespace ns_projectile_dynamics {

    // dt = 0.1; one frame from static to max vel; two frames from minus max vel to positive max vel
    const MOVE_ACC_FP = 1200 * ns_dynamics.SCALE_FP;
    const MAX_VEL_MOVE_FP = 120 * ns_dynamics.SCALE_FP;
    const MIN_VEL_MOVE_FP = (-120) * ns_dynamics.SCALE_FP;

    const MAX_VEL_DASH_FP = 1200 * ns_dynamics.SCALE_FP;
    const MIN_VEL_DASH_FP = (-1200) * ns_dynamics.SCALE_FP;
    const DASH_VEL_FP = 700 * ns_dynamics.SCALE_FP;

    const KNOCK_VEL_X_FP = 150 * ns_dynamics.SCALE_FP;
    const KNOCK_VEL_Y_FP = 350 * ns_dynamics.SCALE_FP;

    const LAUNCHED_VEL_X_FP = 20 * ns_dynamics.SCALE_FP;
    const LAUNCHED_VEL_Y_FP = 600 * ns_dynamics.SCALE_FP;

    const DEACC_FP = 10000 * ns_dynamics.SCALE_FP;

    const JUMP_VEL_Y_FP = 600 * ns_dynamics.SCALE_FP;

    const GATOTSU_VEL_X_FP = 1200 * ns_dynamics.SCALE_FP;
}

namespace ns_projectile_dimension {
    const BODY_HITBOX_W = 50;
    const BODY_HITBOX_W_HALF = 25;
    const BODY_HITBOX_H = 116;
}

namespace ns_projectile_body_state_duration {
    const DORMANT = 1;
    const FLY = 3;
    const BREAK = 3;
}

namespace ns_projectile_body_state {
    const DORMANT = 2000;
    const FLY = 2010;
    const BREAK = 2020;
}

namespace ns_jessica_body_state_qualifiers {

    func is_in_knocked {range_check_ptr}(state: felt) -> felt {
        if (state == ns_jessica_body_state.KNOCKED) {
            return 1;
        }
        return 0;
    }

    func is_in_launched {range_check_ptr}(state: felt) -> felt {
        if (state == ns_jessica_body_state.LAUNCHED) {
            return 1;
        }
        return 0;
    }

    func is_in_various_states {range_check_ptr}(state: felt, counter: felt) -> (
        bool_body_in_atk_active: felt,
        bool_body_in_knocked: felt,
        bool_body_in_block: felt,
        bool_body_in_active: felt,
    ) {
        alloc_locals;

        let bool_body_in_slash_active   = is_in_slash_active (state, counter);
        let bool_body_in_upswing_active = is_in_upswing_active (state, counter);
        let bool_body_in_sidecut_active = is_in_sidecut_active (state, counter);
        let bool_body_in_gatotsu_active = is_in_gatotsu_active (state, counter);
        let bool_body_in_low_kick_active = is_in_low_kick_active (state, counter);
        let bool_body_in_birdswing_active = is_in_birdswing_active (state, counter);
        let bool_body_in_atk_active     = bool_body_in_slash_active + bool_body_in_upswing_active + bool_body_in_sidecut_active + bool_body_in_gatotsu_active + bool_body_in_low_kick_active + bool_body_in_birdswing_active;

        let bool_body_knocked           = is_in_knocked (state);
        let bool_body_launched          = is_in_launched(state);
        let bool_body_in_knocked        = bool_body_knocked + bool_body_launched;
        let bool_body_in_block          = is_in_block_active (state, counter);
        let bool_body_in_active         = bool_body_in_atk_active + bool_body_in_block;

        return (
            bool_body_in_atk_active,
            bool_body_in_knocked,
            bool_body_in_block,
            bool_body_in_active,
        );
    }
}

namespace ns_projectile_hitbox {

    func get_body_hitbox_dimension {range_check_ptr}(
        body_state: felt,
        body_counter: felt
    ) -> (
        body_dimension: Vec2,
        body_half_width: felt
    ) {
        alloc_locals;

        // knocked or launched
        if ( (body_state-ns_jessica_body_state.KNOCKED) * (body_state-ns_jessica_body_state.LAUNCHED) == 0 ) {
            let is_counter_le_1 = is_le(body_counter, 1);
            if (is_counter_le_1 == 1) {
                return (
                    body_dimension = Vec2 (ns_jessica_character_dimension.BODY_KNOCKED_EARLY_HITBOX_W, ns_jessica_character_dimension.BODY_KNOCKED_EARLY_HITBOX_H),
                    body_half_width = ns_jessica_character_dimension.BODY_KNOCKED_EARLY_HITBOX_W_HALF
                );
            }

            let is_counter_le_6 = is_le(body_counter, 6);
            if (is_counter_le_6 == 1) {
                return (
                    body_dimension = Vec2 (ns_jessica_character_dimension.BODY_KNOCKED_LATE_HITBOX_W, ns_jessica_character_dimension.BODY_KNOCKED_LATE_HITBOX_H),
                    body_half_width = ns_jessica_character_dimension.BODY_KNOCKED_LATE_HITBOX_W_HALF
                );
            }

            // the last frame right before idle can use the idle hitbox for now
            if (body_counter == 10) {
                return (
                    body_dimension = Vec2 (ns_jessica_character_dimension.BODY_HITBOX_W, ns_jessica_character_dimension.BODY_HITBOX_H),
                    body_half_width = ns_jessica_character_dimension.BODY_HITBOX_W_HALF
                );
            }

            return (
                body_dimension = Vec2 (ns_jessica_character_dimension.BODY_KNOCKED_GROUND_HITBOX_W, ns_jessica_character_dimension.BODY_KNOCKED_GROUND_HITBOX_H),
                body_half_width = ns_jessica_character_dimension.BODY_KNOCKED_GROUND_HITBOX_W_HALF
            );
        }

        // dash forward
        if (body_state == ns_jessica_body_state.DASH_FORWARD) {
            if (body_counter == 0) {
                return (
                    body_dimension = Vec2 (ns_jessica_character_dimension.BODY_DASH_FORWARD_0_W, ns_jessica_character_dimension.BODY_DASH_FORWARD_0_H),
                    body_half_width = ns_jessica_character_dimension.BODY_DASH_FORWARD_0_W_HALF
                );
            }
            if (body_counter == 1) {
                return (
                    body_dimension = Vec2 (ns_jessica_character_dimension.BODY_DASH_FORWARD_1_W, ns_jessica_character_dimension.BODY_DASH_FORWARD_1_H),
                    body_half_width = ns_jessica_character_dimension.BODY_DASH_FORWARD_1_W_HALF
                );
            }
            if (body_counter == 2) {
                return (
                    body_dimension = Vec2 (ns_jessica_character_dimension.BODY_DASH_FORWARD_2_W, ns_jessica_character_dimension.BODY_DASH_FORWARD_2_H),
                    body_half_width = ns_jessica_character_dimension.BODY_DASH_FORWARD_2_W_HALF
                );
            }
            return (
                body_dimension = Vec2 (ns_jessica_character_dimension.BODY_DASH_FORWARD_3_W, ns_jessica_character_dimension.BODY_DASH_FORWARD_3_H),
                body_half_width = ns_jessica_character_dimension.BODY_DASH_FORWARD_3_W_HALF
            );
        }

        // gatotsu
        // TODO

        // ko
        if (body_state == ns_jessica_body_state.KO) {
            return (
                body_dimension = Vec2 (0, 0),
                body_half_width = 0
            );
        }

        // otherwise
        return (
            body_dimension = Vec2 (ns_jessica_character_dimension.BODY_HITBOX_W, ns_jessica_character_dimension.BODY_HITBOX_H),
            body_half_width = ns_jessica_character_dimension.BODY_HITBOX_W_HALF
        );
    }

    func get_action_hitbox {range_check_ptr}(
        bool_is_active: felt,
        bool_is_attack_active: felt,
        bool_is_block_active: felt,
        dir: felt,
        pos_x: felt,
        pos_y: felt,
        body_hitbox_dimension: Vec2,
        body_state: felt,
        body_counter: felt
    ) -> (
        action_hitbox: Rectangle
    ) {
        alloc_locals;

        if (bool_is_active == 1) {

            // TODO: figure out if we can eliminate this /2 operation
            // note: body_hitbox_dimension.x must be a even number to ensure correct result from /2
            let half_body_width = body_hitbox_dimension.x / 2;

            if (bool_is_attack_active == 1) {

                local ATTACK_HITBOX_Y: felt;
                local ATTACK_HITBOX_W: felt;
                local ATTACK_HITBOX_H: felt;
                if (body_state == ns_jessica_body_state.SLASH) {
                    assert ATTACK_HITBOX_Y = ns_jessica_character_dimension.SLASH_HITBOX_Y;
                    assert ATTACK_HITBOX_W = ns_jessica_character_dimension.SLASH_HITBOX_W;
                    assert ATTACK_HITBOX_H = ns_jessica_character_dimension.SLASH_HITBOX_H;
                } else {
                    if (body_state == ns_jessica_body_state.UPSWING) {
                        assert ATTACK_HITBOX_Y = ns_jessica_character_dimension.UPSWING_HITBOX_Y;
                        assert ATTACK_HITBOX_W = ns_jessica_character_dimension.UPSWING_HITBOX_W;
                        assert ATTACK_HITBOX_H = ns_jessica_character_dimension.UPSWING_HITBOX_H;
                    } else {
                        if (body_state == ns_jessica_body_state.SIDECUT) {
                            assert ATTACK_HITBOX_Y = ns_jessica_character_dimension.SIDECUT_HITBOX_Y;
                            assert ATTACK_HITBOX_W = ns_jessica_character_dimension.SIDECUT_HITBOX_W;
                            assert ATTACK_HITBOX_H = ns_jessica_character_dimension.SIDECUT_HITBOX_H;
                        } else {
                            if (body_state == ns_jessica_body_state.GATOTSU) {
                                assert ATTACK_HITBOX_Y = ns_jessica_character_dimension.GATOTSU_HITBOX_Y;
                                assert ATTACK_HITBOX_W = ns_jessica_character_dimension.GATOTSU_HITBOX_W;
                                assert ATTACK_HITBOX_H = ns_jessica_character_dimension.GATOTSU_HITBOX_H;
                            } else {
                                if (body_state == ns_jessica_body_state.LOW_KICK) {
                                    assert ATTACK_HITBOX_Y = ns_jessica_character_dimension.LOW_KICK_HITBOX_Y;
                                    assert ATTACK_HITBOX_W = ns_jessica_character_dimension.LOW_KICK_HITBOX_W;
                                    assert ATTACK_HITBOX_H = ns_jessica_character_dimension.LOW_KICK_HITBOX_H;
                                } else {
                                    assert ATTACK_HITBOX_Y = ns_jessica_character_dimension.BIRDSWING_HITBOX_Y;
                                    assert ATTACK_HITBOX_W = ns_jessica_character_dimension.BIRDSWING_HITBOX_W;
                                    assert ATTACK_HITBOX_H = ns_jessica_character_dimension.BIRDSWING_HITBOX_H;
                                }
                            }
                        }
                    }
                }

                if (dir == RIGHT) {
                    return (action_hitbox = Rectangle(
                        Vec2(
                            pos_x + half_body_width - ns_hitbox.NUDGE,
                            pos_y + ATTACK_HITBOX_Y
                        ),
                        Vec2 (ATTACK_HITBOX_W, ATTACK_HITBOX_H)
                    ));
                } else {
                    return (action_hitbox = Rectangle(
                        Vec2(
                            pos_x - half_body_width - ATTACK_HITBOX_W + ns_hitbox.NUDGE,
                            pos_y + ATTACK_HITBOX_Y
                        ),
                        Vec2 (ATTACK_HITBOX_W, ATTACK_HITBOX_H)
                    ));
                }
            }

            if (bool_is_block_active == 1) {
                if (dir == RIGHT) {
                    return (action_hitbox = Rectangle(
                        Vec2(
                            pos_x + half_body_width - ns_hitbox.NUDGE,
                            pos_y + ns_jessica_character_dimension.BLOCK_HITBOX_Y
                        ),
                        Vec2 (
                            ns_jessica_character_dimension.BLOCK_HITBOX_W,
                            ns_jessica_character_dimension.BLOCK_HITBOX_H
                        )
                    ));
                } else {
                    return (action_hitbox = Rectangle(
                        Vec2(
                            pos_x - half_body_width - ns_jessica_character_dimension.BLOCK_HITBOX_W + ns_hitbox.NUDGE,
                            pos_y + ns_jessica_character_dimension.BLOCK_HITBOX_Y
                        ),
                        Vec2 (
                            ns_jessica_character_dimension.BLOCK_HITBOX_W,
                            ns_jessica_character_dimension.BLOCK_HITBOX_H
                        )
                    ));
                }
            }

        }

        // otherwise no action hitbox
        return (action_hitbox = Rectangle(
            origin = Vec2(ns_scene.BIGNUM, ns_scene.BIGNUM),
            dimension = Vec2(0, 0)
        ));

    }

}

