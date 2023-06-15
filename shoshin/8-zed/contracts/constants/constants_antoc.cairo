%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.math_cmp import is_le
from contracts.constants.constants import (
    ns_dynamics, Vec2, Rectangle, ns_hitbox, ns_scene
)

namespace ns_antoc_dynamics {

    // dt = 0.1; one frame from static to max vel; two frames from minus max vel to positive max vel
    const MOVE_ACC_FP = 1000 * ns_dynamics.SCALE_FP;
    const MAX_VEL_MOVE_FP = 100 * ns_dynamics.SCALE_FP;
    const MIN_VEL_MOVE_FP = (-100) * ns_dynamics.SCALE_FP;

    const MAX_VEL_DASH_FP = 900 * ns_dynamics.SCALE_FP;
    const MIN_VEL_DASH_FP = (-900) * ns_dynamics.SCALE_FP;
    const DASH_VEL_FP = 900 * ns_dynamics.SCALE_FP;

    const KNOCK_VEL_X_FP = 150 * ns_dynamics.SCALE_FP;
    const KNOCK_VEL_Y_FP = 400 * ns_dynamics.SCALE_FP;

    const DEACC_FP = 10000 * ns_dynamics.SCALE_FP;

    const STEP_FORWARD_VEL_X_FP = 600 * ns_dynamics.SCALE_FP;

    const JUMP_VEL_Y_FP = 275 * ns_dynamics.SCALE_FP;
}

namespace ns_antoc_character_dimension {
    const BODY_HITBOX_W = 50;
    const BODY_HITBOX_H = 116;

    const BODY_KNOCKED_EARLY_HITBOX_W = 60;
    const BODY_KNOCKED_LATE_HITBOX_W = 116;
    const BODY_KNOCKED_GROUND_HITBOX_W = 70;
    const BODY_KNOCKED_EARLY_HITBOX_H = 120;
    const BODY_KNOCKED_LATE_HITBOX_H = 50;
    const BODY_KNOCKED_GROUND_HITBOX_H = 100;

    const BODY_DASH_FORWARD_0_W = 70;
    const BODY_DASH_FORWARD_1_W = 80;
    const BODY_DASH_FORWARD_2_W = 80;
    const BODY_DASH_FORWARD_3_W = 67;
    const BODY_DASH_FORWARD_0_H = 105;
    const BODY_DASH_FORWARD_1_H = 97;
    const BODY_DASH_FORWARD_2_H = 97;
    const BODY_DASH_FORWARD_3_H = 100;

    const BODY_STEP_FORWARD_0_W = 72;
    const BODY_STEP_FORWARD_1_W = 72;
    const BODY_STEP_FORWARD_0_H = 89;
    const BODY_STEP_FORWARD_1_H = 107;

    const HORI_HITBOX_W = 45;
    const HORI_HITBOX_H = 45;
    const HORI_HITBOX_Y = BODY_HITBOX_H * 3 / 4;

    const VERT_HITBOX_W = BODY_HITBOX_W * 2;
    const VERT_HITBOX_H = BODY_HITBOX_H + 35;
    const VERT_HITBOX_Y = 0;

    const BLOCK_HITBOX_W = 30;
    const BLOCK_HITBOX_H = 85;
    const BLOCK_HITBOX_Y = BODY_HITBOX_H / 2;

    const BODY_KNOCKED_ADJUST_W = BODY_KNOCKED_LATE_HITBOX_W - BODY_HITBOX_W;
}

namespace ns_antoc_action {
    const NULL = 0;

    const HORI = 1;
    const VERT = 2;
    const BLOCK = 3;

    const MOVE_FORWARD = 4;
    const MOVE_BACKWARD = 5;
    const DASH_FORWARD = 6;
    const DASH_BACKWARD = 7;

    const STEP_FORWARD = 8;
    const JUMP = 9;

    // noncents : can this action be removed?
    const COMBO = 10;
}

namespace ns_antoc_stamina_effect {
    const HORI = -100;
    const VERT = -100;
    const STEP_FORWARD = -75;
}

namespace ns_antoc_body_state_duration {
    const IDLE = 5;
    const HORI = 7;
    const VERT = 10;
    const BLOCK = 6; // active for counter == 1,2,3,4
    const HURT = 2;
    const KNOCKED = 11;
    const MOVE_FORWARD = 7;
    const MOVE_BACKWARD = 6;
    const DASH_FORWARD = 4;
    const DASH_BACKWARD = 4;
    const CLASH = 5;
    const STEP_FORWARD = 2;
    const JUMP = 7;
}

namespace ns_antoc_body_state {
    const IDLE = 0;      // 5 frames
    const HORI = 1010;     // 7 frames
    const VERT = 1020;  // 10 frames
    const BLOCK = 1040;    // 6 frames
    const HURT = 1050;     // 3 frames
    const KNOCKED = 1060;  // 11 frames
    const MOVE_FORWARD = 1090;  // 7 frames
    const MOVE_BACKWARD = 1100;  // 6 frames
    const DASH_FORWARD = 1110;  // 9 frames
    const DASH_BACKWARD = 1120;  // 9 frames
    const CLASH = 1130; // 5 frames
    const STEP_FORWARD = 1140; // 2 frames
    const JUMP = 1150; // 7 frames
}

namespace ns_antoc_body_state_qualifiers {

    func is_in_hori_active {range_check_ptr}(state: felt, counter: felt) -> felt {
        if (state == ns_antoc_body_state.HORI) {
            if (counter == 1) {
                return 1;
            }
            // if (counter == 2) {
            //     return 1;
            // }
        }
        return 0;
    }

    func is_in_vert_active {range_check_ptr}(state: felt, counter: felt) -> felt {
        if (state == ns_antoc_body_state.VERT) {
            if (counter == 3) {
                return 1;
            }
            // if (counter == 4) {
            //     return 1;
            // }
        }
        return 0;
    }

    func is_in_block_active {range_check_ptr}(state: felt, counter: felt) -> felt {
        if (state == ns_antoc_body_state.BLOCK) {
            if (counter == 1) {
                return 1;
            }
            if (counter == 2) {
                return 1;
            }
            if (counter == 3) {
                return 1;
            }
            if (counter == 4) {
                return 1;
            }
        }
        return 0;
    }

    func is_in_knocked {range_check_ptr}(state: felt) -> felt {
        if (state != ns_antoc_body_state.KNOCKED) {
            return 0;
        }
        return 1;
    }

    func is_in_various_states {range_check_ptr}(state: felt, counter: felt) -> (
        bool_body_in_atk_active: felt,
        bool_body_in_knocked: felt,
        bool_body_in_block: felt,
        bool_body_in_active: felt,
    ) {
        alloc_locals;

        let bool_body_in_hori_active   = is_in_hori_active (state, counter);
        let bool_body_in_vert_active   = is_in_vert_active (state, counter);
        let bool_body_in_atk_active    = bool_body_in_hori_active + bool_body_in_vert_active;
        let bool_body_in_knocked       = is_in_knocked (state);
        let bool_body_in_block         = is_in_block_active (state, counter);
        let bool_body_in_active        = bool_body_in_atk_active + bool_body_in_block;

        return (
            bool_body_in_atk_active,
            bool_body_in_knocked,
            bool_body_in_block,
            bool_body_in_active,
        );
    }
}

namespace ns_antoc_hitbox {

    func get_body_hitbox_dimension {range_check_ptr}(
        body_state: felt,
        body_counter: felt
    ) -> (
        body_dimension: Vec2
    ) {
        alloc_locals;

        // knocked
        if (body_state == ns_antoc_body_state.KNOCKED) {
            let is_counter_le_0 = is_le(body_counter, 0);
            if (is_counter_le_0== 1) {
                return (body_dimension = Vec2 (ns_antoc_character_dimension.BODY_KNOCKED_EARLY_HITBOX_W, ns_antoc_character_dimension.BODY_KNOCKED_EARLY_HITBOX_H));
            }

            let is_counter_le_7 = is_le(body_counter, 7);
            if (is_counter_le_7 == 1) {
                return (body_dimension = Vec2 (ns_antoc_character_dimension.BODY_KNOCKED_LATE_HITBOX_W, ns_antoc_character_dimension.BODY_KNOCKED_LATE_HITBOX_H));
            }

            if (body_counter == 8) {
                return (body_dimension = Vec2 (ns_antoc_character_dimension.BODY_KNOCKED_GROUND_HITBOX_W, ns_antoc_character_dimension.BODY_KNOCKED_GROUND_HITBOX_H));
            }

            return (body_dimension = Vec2 (ns_antoc_character_dimension.BODY_HITBOX_W, ns_antoc_character_dimension.BODY_HITBOX_H));
        }

        // dash forward
        if (body_state == ns_antoc_body_state.DASH_FORWARD) {
            if (body_counter == 0) {
                return (body_dimension = Vec2 (ns_antoc_character_dimension.BODY_DASH_FORWARD_0_W, ns_antoc_character_dimension.BODY_DASH_FORWARD_0_H));
            }
            if (body_counter == 1) {
                return (body_dimension = Vec2 (ns_antoc_character_dimension.BODY_DASH_FORWARD_1_W, ns_antoc_character_dimension.BODY_DASH_FORWARD_1_H));
            }
            if (body_counter == 2) {
                return (body_dimension = Vec2 (ns_antoc_character_dimension.BODY_DASH_FORWARD_2_W, ns_antoc_character_dimension.BODY_DASH_FORWARD_2_H));
            }
            return (body_dimension = Vec2 (ns_antoc_character_dimension.BODY_DASH_FORWARD_3_W, ns_antoc_character_dimension.BODY_DASH_FORWARD_3_H));
        }

        // step forward
        if (body_state == ns_antoc_body_state.STEP_FORWARD) {
            if (body_counter == 0) {
                return (body_dimension = Vec2 (ns_antoc_character_dimension.BODY_STEP_FORWARD_0_W, ns_antoc_character_dimension.BODY_STEP_FORWARD_0_H));
            }
            return (body_dimension = Vec2 (ns_antoc_character_dimension.BODY_STEP_FORWARD_1_W, ns_antoc_character_dimension.BODY_STEP_FORWARD_1_H));
        }

        // otherwise
        return (body_dimension = Vec2 (ns_antoc_character_dimension.BODY_HITBOX_W, ns_antoc_character_dimension.BODY_HITBOX_H));
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

            if (bool_is_attack_active == 1) {

                local ATTACK_HITBOX_Y: felt;
                local ATTACK_HITBOX_W: felt;
                local ATTACK_HITBOX_H: felt;
                if (body_state == ns_antoc_body_state.HORI) {
                    assert ATTACK_HITBOX_Y = ns_antoc_character_dimension.HORI_HITBOX_Y;
                    assert ATTACK_HITBOX_W = ns_antoc_character_dimension.HORI_HITBOX_W;
                    assert ATTACK_HITBOX_H = ns_antoc_character_dimension.HORI_HITBOX_H;
                } else {
                    assert ATTACK_HITBOX_Y = ns_antoc_character_dimension.VERT_HITBOX_Y;
                    assert ATTACK_HITBOX_W = ns_antoc_character_dimension.VERT_HITBOX_W;
                    assert ATTACK_HITBOX_H = ns_antoc_character_dimension.VERT_HITBOX_H;
                }

                if (dir == 1) {
                    return (action_hitbox = Rectangle(
                        Vec2(
                            pos_x + body_hitbox_dimension.x - ns_hitbox.NUDGE,
                            pos_y + ATTACK_HITBOX_Y
                        ),
                        Vec2 (ATTACK_HITBOX_W, ATTACK_HITBOX_H)
                    ));
                } else {
                    return (action_hitbox = Rectangle(
                        Vec2(
                            pos_x - ATTACK_HITBOX_W + ns_hitbox.NUDGE,
                            pos_y + ATTACK_HITBOX_Y
                        ),
                        Vec2 (ATTACK_HITBOX_W, ATTACK_HITBOX_H)
                    ));
                }
            }

            if (bool_is_block_active == 1) {
                if (dir == 1) {
                    return (action_hitbox = Rectangle(
                        Vec2(
                            pos_x + body_hitbox_dimension.x - ns_hitbox.NUDGE,
                            pos_y + ns_antoc_character_dimension.BLOCK_HITBOX_Y
                        ),
                        Vec2 (
                            ns_antoc_character_dimension.BLOCK_HITBOX_W,
                            ns_antoc_character_dimension.BLOCK_HITBOX_H
                        )
                    ));
                } else {
                    return (action_hitbox = Rectangle(
                        Vec2(
                            pos_x - ns_antoc_character_dimension.BLOCK_HITBOX_W + ns_hitbox.NUDGE,
                            pos_y + ns_antoc_character_dimension.BLOCK_HITBOX_Y
                        ),
                        Vec2 (
                            ns_antoc_character_dimension.BLOCK_HITBOX_W,
                            ns_antoc_character_dimension.BLOCK_HITBOX_H
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