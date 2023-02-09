%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.math_cmp import is_le
from contracts.constants.constants import (
    ns_dynamics
)

namespace ns_jessica_dynamics {

    const MAX_VEL_MOVE_FP = 120 * ns_dynamics.SCALE_FP;
    const MIN_VEL_MOVE_FP = (-120) * ns_dynamics.SCALE_FP;

    const MAX_VEL_DASH_FP = 600 * ns_dynamics.SCALE_FP;
    const MIN_VEL_DASH_FP = (-600) * ns_dynamics.SCALE_FP;

    const MOVE_ACC_FP = 300 * ns_dynamics.SCALE_FP;
    const DASH_ACC_FP = 3000 * ns_dynamics.SCALE_FP;

    const DEACC_FP = 10000 * ns_dynamics.SCALE_FP;
}

namespace ns_jessica_character_dimension {
    const BODY_HITBOX_W = 50;
    const BODY_HITBOX_H = 116;
    const BODY_KNOCKED_EARLY_HITBOX_W = 130;
    const BODY_KNOCKED_LATE_HITBOX_W = 150;
    const BODY_KNOCKED_EARLY_HITBOX_H = 125;
    const BODY_KNOCKED_LATE_HITBOX_H = 50;
    const SLASH_HITBOX_W = 90;
    const SLASH_HITBOX_H = 90;
    const SLASH_HITBOX_Y = BODY_HITBOX_H / 2;
    const BLOCK_HITBOX_W = 20;
    const BLOCK_HITBOX_H = 50;
    const BLOCK_HITBOX_Y = BODY_HITBOX_H / 2;

    const BODY_KNOCKED_ADJUST_W = BODY_KNOCKED_LATE_HITBOX_W - BODY_HITBOX_W;
}

namespace ns_jessica_action {
    const NULL = 0;

    const SLASH = 1;
    const UPSWING = 2;
    const SIDECUT = 3;
    const BLOCK = 4;

    const MOVE_FORWARD  = 5;
    const MOVE_BACKWARD = 6;
    const DASH_FORWARD  = 7;
    const DASH_BACKWARD = 8;

    const COMBO = 10;
}

namespace ns_jessica_stamina_effect {
    const SLASH = 100;
    const UPSWING = 100;
    const SIDECUT = 100;
}


namespace ns_jessica_body_state_duration {
    const IDLE = 5;
    const SLASH = 5;
    const UPSWING = 5;
    const SIDECUT = 5;
    const BLOCK = 3;
    const CLASH = 4;
    const HURT = 3;
    const KNOCKED = 11;
    const MOVE_FORWARD = 8;
    const MOVE_BACKWARD = 6;
    const DASH_FORWARD = 5;
    const DASH_BACKWARD = 5;
}

namespace ns_jessica_body_state {
    const IDLE = 0; // 5 frames
    const SLASH = 10; // 5 frames
    const UPSWING = 20;  // 5 frames
    const SIDECUT = 30;  // 5 frames
    const BLOCK = 40; // 3 frames
    const CLASH = 50; // 4 frames;
    const HURT = 60; // 3 frames
    const KNOCKED = 70; // 11 frames
    const MOVE_FORWARD = 90;  // 8 frames
    const MOVE_BACKWARD = 100;  // 6 frames
    const DASH_FORWARD = 110;  // 5 frames
    const DASH_BACKWARD = 120;  // 5 frames
}

namespace ns_jessica_body_state_qualifiers {

    func is_in_slash_active {range_check_ptr}(state: felt, counter: felt) -> felt {
        if (state == ns_jessica_body_state.SLASH and counter == 2) {
            return 1;
        }
        return 0;
    }

    func is_in_upswing_active {range_check_ptr}(state: felt, counter: felt) -> felt {
        if (state == ns_jessica_body_state.UPSWING and counter == 2) {
            return 1;
        }
        return 0;
    }

    func is_in_sidecut_active {range_check_ptr}(state: felt, counter: felt) -> felt {
        if (state == ns_jessica_body_state.SIDECUT and counter == 2) {
            return 1;
        }
        return 0;
    }

    func is_in_block_active {range_check_ptr}(state: felt, counter: felt) -> felt {
        if (state == ns_jessica_body_state.BLOCK and counter == 1) {
            return 1;
        }
        return 0;
    }

    func is_in_knocked_early {range_check_ptr}(state: felt, counter: felt) -> felt {
        if (state != ns_jessica_body_state.KNOCKED) {
            return 0;
        }

        // counter <= 4
        let bool_counter_le_4 = is_le (counter, 4);
        if (bool_counter_le_4 == 1) {
            return 1;
        }
        return 0;
    }

    func is_in_knocked_late {range_check_ptr}(state: felt, counter: felt) -> felt {
        if (state != ns_jessica_body_state.KNOCKED) {
            return 0;
        }

        // counter >= 5
        let bool_counter_ge_5 = is_le(5, counter);
        if (bool_counter_ge_5 == 1) {
            return 1;
        }
        return 0;
    }

    func is_in_various_states {range_check_ptr}(state: felt, counter: felt) -> (
        bool_body_in_atk_active: felt,
        bool_body_in_knocked_early: felt,
        bool_body_in_knocked_late: felt,
        bool_body_in_block: felt,
        bool_body_in_active: felt,
    ) {
        alloc_locals;

        let bool_body_in_slash_active   = is_in_slash_active (state, counter);
        let bool_body_in_upswing_active = is_in_upswing_active (state, counter);
        let bool_body_in_sidecut_active = is_in_sidecut_active (state, counter);
        let bool_body_in_atk_active    = bool_body_in_slash_active + bool_body_in_upswing_active + bool_body_in_sidecut_active;
        let bool_body_in_knocked_early = is_in_knocked_early (state, counter);
        let bool_body_in_knocked_late  = is_in_knocked_late (state, counter);
        let bool_body_in_block         = is_in_block_active (state, counter);
        let bool_body_in_active        = bool_body_in_atk_active + bool_body_in_block;

        return (
            bool_body_in_atk_active,
            bool_body_in_knocked_early,
            bool_body_in_knocked_late,
            bool_body_in_block,
            bool_body_in_active,
        );
    }
}

