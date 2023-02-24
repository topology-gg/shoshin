%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.math_cmp import is_le
from contracts.constants.constants import (
    ns_dynamics, Vec2
)

namespace ns_antoc_dynamics {

    const MAX_VEL_MOVE_FP = 100 * ns_dynamics.SCALE_FP;
    const MIN_VEL_MOVE_FP = (-100) * ns_dynamics.SCALE_FP;

    const MAX_VEL_DASH_FP = 450 * ns_dynamics.SCALE_FP;
    const MIN_VEL_DASH_FP = (-450) * ns_dynamics.SCALE_FP;

    const MOVE_ACC_FP = 300 * ns_dynamics.SCALE_FP;
    const DASH_ACC_FP = 3000 * ns_dynamics.SCALE_FP;

    const KNOCK_VEL_X_FP = 120 * ns_dynamics.SCALE_FP;
    const KNOCK_VEL_Y_FP = 400 * ns_dynamics.SCALE_FP;

    const DEACC_FP = 10000 * ns_dynamics.SCALE_FP;
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
    const HORI_HITBOX_W = 90;
    const HORI_HITBOX_H = 90;
    const HORI_HITBOX_Y = BODY_HITBOX_H / 2;
    const BLOCK_HITBOX_W = 60;
    const BLOCK_HITBOX_H = 90;
    const BLOCK_HITBOX_Y = BODY_HITBOX_H / 4;

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

    // noncents : can this action be removed?
    const COMBO = 10;
}

namespace ns_antoc_stamina_effect {
    const HORI = -100;
    const VERT = -100;
}

namespace ns_antoc_body_state_duration {
    const IDLE = 5;
    const HORI = 7;
    const VERT = 10;
    const BLOCK = 6; // active for counter == 1,2,3,4
    const HURT = 3;
    const KNOCKED = 11;
    const MOVE_FORWARD = 7;
    const MOVE_BACKWARD = 6;
    const DASH_FORWARD = 9;
    const DASH_BACKWARD = 9;
}

namespace ns_antoc_body_state {
    const IDLE = 0;      // 5 frames
    const HORI = 10;     // 7 frames
    const VERT = 20;  // 10 frames
    const BLOCK = 40;    // 6 frames
    const HURT = 50;     // 3 frames
    const KNOCKED = 60;  // 11 frames
    const MOVE_FORWARD = 90;  // 7 frames
    const MOVE_BACKWARD = 100;  // 6 frames
    const DASH_FORWARD = 110;  // 9 frames
    const DASH_BACKWARD = 120;  // 9 frames
}

namespace ns_antoc_body_state_qualifiers {

    func is_in_hori_active {range_check_ptr}(state: felt, counter: felt) -> felt {
        if (state == ns_antoc_body_state.HORI) {
            if (counter == 1) {
                return 1;
            }
            if (counter == 2) {
                return 1;
            }
        }
        return 0;
    }

    func is_in_vert_active {range_check_ptr}(state: felt, counter: felt) -> felt {
        if (state == ns_antoc_body_state.VERT) {
            if (counter == 3) {
                return 1;
            }
            if (counter == 4) {
                return 1;
            }
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
    func get_body_hitbox_dimension {range_check_ptr}(counter: felt) -> (
        body_dimension: Vec2
    ) {
        alloc_locals;

        let is_counter_le_0 = is_le(counter, 0);
        if (is_counter_le_0== 1) {
            return (body_dimension = Vec2 (ns_antoc_character_dimension.BODY_KNOCKED_EARLY_HITBOX_W, ns_antoc_character_dimension.BODY_KNOCKED_EARLY_HITBOX_H));
        }

        let is_counter_le_7 = is_le(counter, 7);
        if (is_counter_le_7 == 1) {
            return (body_dimension = Vec2 (ns_antoc_character_dimension.BODY_KNOCKED_LATE_HITBOX_W, ns_antoc_character_dimension.BODY_KNOCKED_LATE_HITBOX_H));
        }

        if (counter == 8) {
            return (body_dimension = Vec2 (ns_antoc_character_dimension.BODY_KNOCKED_GROUND_HITBOX_W, ns_antoc_character_dimension.BODY_KNOCKED_GROUND_HITBOX_H));
        }

        return (body_dimension = Vec2 (ns_antoc_character_dimension.BODY_HITBOX_W, ns_antoc_character_dimension.BODY_HITBOX_H));
    }
}