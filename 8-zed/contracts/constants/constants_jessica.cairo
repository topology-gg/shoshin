%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.math_cmp import is_le
from contracts.constants.constants import (
    ns_dynamics, Vec2, Rectangle, ns_hitbox, ns_scene
)

namespace ns_jessica_dynamics {

    // dt = 0.1; one frame from static to max vel; two frames from minus max vel to positive max vel
    const MOVE_ACC_FP = 1200 * ns_dynamics.SCALE_FP;
    const MAX_VEL_MOVE_FP = 120 * ns_dynamics.SCALE_FP;
    const MIN_VEL_MOVE_FP = (-120) * ns_dynamics.SCALE_FP;

    const MAX_VEL_DASH_FP = 1200 * ns_dynamics.SCALE_FP;
    const MIN_VEL_DASH_FP = (-1200) * ns_dynamics.SCALE_FP;
    const DASH_VEL_FP = 900 * ns_dynamics.SCALE_FP;

    const KNOCK_VEL_X_FP = 150 * ns_dynamics.SCALE_FP;
    const KNOCK_VEL_Y_FP = 350 * ns_dynamics.SCALE_FP;

    const LAUNCHED_VEL_X_FP = 20 * ns_dynamics.SCALE_FP;
    const LAUNCHED_VEL_Y_FP = 600 * ns_dynamics.SCALE_FP;

    const DEACC_FP = 10000 * ns_dynamics.SCALE_FP;

    const JUMP_VEL_Y_FP = 600 * ns_dynamics.SCALE_FP;

    const GATOTSU_VEL_X_FP = 1200 * ns_dynamics.SCALE_FP;
}

namespace ns_jessica_character_dimension {
    const BODY_HITBOX_W = 50;
    const BODY_HITBOX_H = 116;

    const BODY_KNOCKED_EARLY_HITBOX_W = 70;
    const BODY_KNOCKED_LATE_HITBOX_W = 100;
    const BODY_KNOCKED_GROUND_HITBOX_W = 50;
    const BODY_KNOCKED_EARLY_HITBOX_H = 120;
    const BODY_KNOCKED_LATE_HITBOX_H = 50;
    const BODY_KNOCKED_GROUND_HITBOX_H = 70;

    const BODY_DASH_FORWARD_0_W = 55;
    const BODY_DASH_FORWARD_1_W = 70;
    const BODY_DASH_FORWARD_2_W = 85;
    const BODY_DASH_FORWARD_3_W = 85;
    const BODY_DASH_FORWARD_0_H = 100;
    const BODY_DASH_FORWARD_1_H = 95;
    const BODY_DASH_FORWARD_2_H = 90;
    const BODY_DASH_FORWARD_3_H = 90;

    const SLASH_HITBOX_W = 75;
    const SLASH_HITBOX_H = 90;
    const SLASH_HITBOX_Y = BODY_HITBOX_H / 2 - 20;

    const UPSWING_HITBOX_W = 70;
    const UPSWING_HITBOX_H = BODY_HITBOX_H + 15;
    const UPSWING_HITBOX_Y = 20;

    const SIDECUT_HITBOX_W = 70;
    const SIDECUT_HITBOX_H = BODY_HITBOX_H * 2 / 4;
    const SIDECUT_HITBOX_Y = BODY_HITBOX_H / 4;

    const LOW_KICK_HITBOX_W = 45;
    const LOW_KICK_HITBOX_H = 20;
    const LOW_KICK_HITBOX_Y = 7;

    const BLOCK_HITBOX_W = 20;
    const BLOCK_HITBOX_H = 60;
    const BLOCK_HITBOX_Y = BODY_HITBOX_H / 2;

    const GATOTSU_HITBOX_W = 80;
    const GATOTSU_HITBOX_H = 20;
    const GATOTSU_HITBOX_Y = BODY_HITBOX_H / 2 + 10;

    const BIRDSWING_HITBOX_W = 70;
    const BIRDSWING_HITBOX_H = BODY_HITBOX_H * 2 / 4;
    const BIRDSWING_HITBOX_Y = BODY_HITBOX_H / 4;

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
    const JUMP = 9;
    const GATOTSU = 10;
    const LOW_KICK = 11;
    const TAUNT = 12;
}

namespace ns_jessica_stamina_effect {

    // whiff gives rage gain too
    const SLASH = 5;
    const UPSWING = 5;
    const SIDECUT = 5;
    const LOW_KICK = 5;
    const BIRDSWING = 5;

    // character special consumes rage, whether hit or whiff
    const GATOTSU = -500;
}

namespace ns_jessica_stimulus {
    // note: 1/2 of damage inflicted becomes rage gain;
    // damage value needs to be even number for modulo division to work

    const SLASH_DAMAGE = 80;
    const UPSWING_DAMAGE = 80;
    const SIDECUT_DAMAGE = 80;
    const LOW_KICK_DAMAGE = 50;
    const BIRDSWING_DAMAGE = 80;

    // character special
    const GATOTSU_DAMAGE = 300;
}

namespace ns_jessica_body_state_duration {
    const IDLE = 5;
    const SLASH = 5;
    const UPSWING = 8;
    const SIDECUT = 5;
    const BLOCK = 3;
    const CLASH = 4;
    const HURT = 2;
    const KNOCKED = 11;
    const MOVE_FORWARD = 8;
    const MOVE_BACKWARD = 6;
    const DASH_FORWARD = 4;
    const DASH_BACKWARD = 4;
    const JUMP = 6;
    const GATOTSU = 7;
    const LOW_KICK = 6;
    const BIRDSWING = 6;
    const LAUNCHED = 11;
    const TAUNT_PARIS23 = 33;
    const KO = 14;
}

namespace ns_jessica_body_state {
    const IDLE = 0; // 5 frames
    const SLASH = 10; // 5 frames
    const UPSWING = 20;  // 8 frames
    const SIDECUT = 30;  // 5 frames
    const BLOCK = 40; // 3 frames
    const CLASH = 50; // 4 frames;
    const HURT = 60; // 3 frames
    const KNOCKED = 70; // 11 frames
    const MOVE_FORWARD = 90;  // 8 frames
    const MOVE_BACKWARD = 100;  // 6 frames
    const DASH_FORWARD = 110;  // 5 frames
    const DASH_BACKWARD = 120;  // 5 frames
    const JUMP = 130; // 7 frames
    const GATOTSU = 140;
    const LOW_KICK = 150;
    const BIRDSWING = 160;
    const LAUNCHED = 170; // 11 frames
    const JUMP_MOVE_FORWARD = 180;
    const JUMP_MOVE_BACKWARD = 190;
    const TAUNT_PARIS23 = 200; // 33 frames
    const KO = 240; // 14 frames
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

    func is_in_gatotsu_active {range_check_ptr}(state: felt, counter: felt) -> felt {
        if (state != ns_jessica_body_state.GATOTSU) {
            return 0;
        }

        if (counter == 3) {
            return 1;
        }

        if (counter == 4) {
            return 1;
        }

        return 0;
    }

    func is_in_low_kick_active {range_check_ptr}(state: felt, counter: felt) -> felt {
        if (state == ns_jessica_body_state.LOW_KICK and counter == 3) {
            return 1;
        }
        return 0;
    }

    func is_in_birdswing_active {range_check_ptr}(state: felt, counter: felt) -> felt {
        if (state == ns_jessica_body_state.BIRDSWING and counter == 3) {
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

namespace ns_jessica_hitbox {

    func get_body_hitbox_dimension {range_check_ptr}(
        body_state: felt,
        body_counter: felt
    ) -> (
        body_dimension: Vec2
    ) {
        alloc_locals;

        // knocked or launched
        if ( (body_state-ns_jessica_body_state.KNOCKED) * (body_state-ns_jessica_body_state.LAUNCHED) == 0 ) {
            let is_counter_le_1 = is_le(body_counter, 1);
            if (is_counter_le_1 == 1) {
                return (body_dimension = Vec2 (ns_jessica_character_dimension.BODY_KNOCKED_EARLY_HITBOX_W, ns_jessica_character_dimension.BODY_KNOCKED_EARLY_HITBOX_H));
            }

            let is_counter_le_6 = is_le(body_counter, 6);
            if (is_counter_le_6 == 1) {
                return (body_dimension = Vec2 (ns_jessica_character_dimension.BODY_KNOCKED_LATE_HITBOX_W, ns_jessica_character_dimension.BODY_KNOCKED_LATE_HITBOX_H));
            }

            // the last frame right before idle can use the idle hitbox for now
            if (body_counter == 10) {
                return (body_dimension = Vec2 (ns_jessica_character_dimension.BODY_HITBOX_W, ns_jessica_character_dimension.BODY_HITBOX_H));
            }

            return (body_dimension = Vec2 (ns_jessica_character_dimension.BODY_KNOCKED_GROUND_HITBOX_W, ns_jessica_character_dimension.BODY_KNOCKED_GROUND_HITBOX_H));
        }

        // dash forward
        if (body_state == ns_jessica_body_state.DASH_FORWARD) {
            if (body_counter == 0) {
                return (body_dimension = Vec2 (ns_jessica_character_dimension.BODY_DASH_FORWARD_0_W, ns_jessica_character_dimension.BODY_DASH_FORWARD_0_H));
            }
            if (body_counter == 1) {
                return (body_dimension = Vec2 (ns_jessica_character_dimension.BODY_DASH_FORWARD_1_W, ns_jessica_character_dimension.BODY_DASH_FORWARD_1_H));
            }
            if (body_counter == 2) {
                return (body_dimension = Vec2 (ns_jessica_character_dimension.BODY_DASH_FORWARD_2_W, ns_jessica_character_dimension.BODY_DASH_FORWARD_2_H));
            }
            return (body_dimension = Vec2 (ns_jessica_character_dimension.BODY_DASH_FORWARD_3_W, ns_jessica_character_dimension.BODY_DASH_FORWARD_3_H));
        }

        // gatotsu
        // TODO

        // ko
        if (body_state == ns_jessica_body_state.KO) {
            return (body_dimension = Vec2 (0, 0));
        }

        // otherwise
        return (body_dimension = Vec2 (ns_jessica_character_dimension.BODY_HITBOX_W, ns_jessica_character_dimension.BODY_HITBOX_H));
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
                            pos_x - ns_jessica_character_dimension.BLOCK_HITBOX_W + ns_hitbox.NUDGE,
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

