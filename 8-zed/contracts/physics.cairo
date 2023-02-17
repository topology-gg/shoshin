%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.math_cmp import is_le, is_not_zero
from contracts.constants.constants import (
    ns_character_type,
    ns_scene,
    ns_stimulus,
    ns_integrity,
    Vec2,
    Rectangle,
    PhysicsState,
    BodyState,
    Hitboxes,
)
from contracts.constants.constants_jessica import (
    ns_jessica_character_dimension, ns_jessica_body_state_qualifiers
)
from contracts.constants.constants_antoc import (
    ns_antoc_character_dimension, ns_antoc_body_state_qualifiers
)
from contracts.dynamics import _euler_forward_no_hitbox, _euler_forward_consider_hitbox

func _bool_or{range_check_ptr}(bool_0: felt, bool_1: felt) -> (bool: felt) {
    if (bool_0 + bool_1 == 0) {
        return (0,);
    } else {
        return (1,);
    }
}

func is_in_various_states_given_character_type {range_check_ptr}(
    character_type: felt,
    state: felt,
    counter: felt,
) -> (
    bool_body_in_atk_active: felt,
    bool_body_in_knocked_early: felt,
    bool_body_in_knocked_late: felt,
    bool_body_in_block: felt,
    bool_body_in_active: felt,
) {
    if (character_type == ns_character_type.JESSICA) {
        return ns_jessica_body_state_qualifiers.is_in_various_states (state, counter);
    } else {
        return ns_antoc_body_state_qualifiers.is_in_various_states (state, counter);
    }
}

func _physicality{range_check_ptr}(
    character_type_0: felt,
    character_type_1: felt,
    last_physics_state_0: PhysicsState,
    last_physics_state_1: PhysicsState,
    curr_body_state_0: BodyState,
    curr_body_state_1: BodyState,
) -> (
    curr_physics_state_0: PhysicsState,
    curr_physics_state_1: PhysicsState,
    curr_stimulus_0: felt,
    curr_stimulus_1: felt,
    hitboxes_0: Hitboxes,
    hitboxes_1: Hitboxes,
) {
    alloc_locals;

    // Algorithm:
    // 1. Movement first pass (candidate positions)
    // 2. Create hitboxes (body, action, environment)
    // 3. Test hitbox overlaps
    // 4. Movement second pass, incorporating hitbox overlap (final positions) to produce charcater state
    // 5. Produce stimuli

    //
    // 1. Movement first pass (candidate positions)
    //
    let (candidate_physics_state_0) = _euler_forward_no_hitbox(
        character_type_0, last_physics_state_0, curr_body_state_0
    );
    let (candidate_physics_state_1) = _euler_forward_no_hitbox(
        character_type_1, last_physics_state_1, curr_body_state_1
    );

    //
    // 2. Create hitboxes
    //
    let (
        bool_body_in_atk_active_0: felt,
        bool_body_in_knocked_early_0: felt,
        bool_body_in_knocked_late_0: felt,
        bool_body_in_block_0: felt,
        bool_body_in_active_0: felt,
    ) = is_in_various_states_given_character_type (character_type_0, curr_body_state_0.state, curr_body_state_0.counter);
    let (
        bool_body_in_atk_active_1: felt,
        bool_body_in_knocked_early_1: felt,
        bool_body_in_knocked_late_1: felt,
        bool_body_in_block_1: felt,
        bool_body_in_active_1: felt,
    ) = is_in_various_states_given_character_type (character_type_1, curr_body_state_1.state, curr_body_state_1.counter);

    local action_origin_0: Vec2;
    local action_dimension_0: Vec2;
    local action_origin_1: Vec2;
    local action_dimension_1: Vec2;

    // TODO: hitbox dimensions should be decoded from attack type per character type!!

    if (bool_body_in_active_0 == 1) {
        if (bool_body_in_atk_active_0 == 1) {
            if (curr_body_state_0.dir == 1) {
                // # facing right
                assert action_origin_0 = Vec2(
                    candidate_physics_state_0.pos.x + ns_jessica_character_dimension.BODY_HITBOX_W,
                    candidate_physics_state_0.pos.y + ns_jessica_character_dimension.SLASH_HITBOX_Y
                );
            } else {
                // # facing left
                assert action_origin_0 = Vec2(
                    candidate_physics_state_0.pos.x - ns_jessica_character_dimension.SLASH_HITBOX_W,
                    candidate_physics_state_0.pos.y + ns_jessica_character_dimension.SLASH_HITBOX_Y
                );
            }
            assert action_dimension_0 = Vec2 (ns_jessica_character_dimension.SLASH_HITBOX_W, ns_jessica_character_dimension.SLASH_HITBOX_H);
        } 
        if (bool_body_in_block_0 == 1) {
            if (curr_body_state_0.dir == 1) {
                // # facing right
                assert action_origin_0 = Vec2(
                    candidate_physics_state_0.pos.x + ns_jessica_character_dimension.BODY_HITBOX_W,
                    candidate_physics_state_0.pos.y + ns_jessica_character_dimension.BLOCK_HITBOX_Y
                );
            } else {
                // # facing left
                assert action_origin_0 = Vec2(
                    candidate_physics_state_0.pos.x - ns_jessica_character_dimension.BLOCK_HITBOX_W,
                    candidate_physics_state_0.pos.y + ns_jessica_character_dimension.BLOCK_HITBOX_Y
                );
            }
            assert action_dimension_0 = Vec2 (ns_jessica_character_dimension.BLOCK_HITBOX_W, ns_jessica_character_dimension.BLOCK_HITBOX_H);
        } 
    } else {
        assert action_origin_0 = Vec2 (ns_scene.BIGNUM, ns_scene.BIGNUM);
        assert action_dimension_0 = Vec2 (0, 0);
    }

    if (bool_body_in_active_1 == 1) {
        if (bool_body_in_atk_active_1 == 1) {
            if (curr_body_state_1.dir == 1) {
                // # facing right
                assert action_origin_1 = Vec2(
                    candidate_physics_state_1.pos.x + ns_jessica_character_dimension.BODY_HITBOX_W,
                    candidate_physics_state_1.pos.y + ns_jessica_character_dimension.SLASH_HITBOX_Y
                );
            } else {
                // # facing left
                assert action_origin_1 = Vec2(
                    candidate_physics_state_1.pos.x - ns_jessica_character_dimension.SLASH_HITBOX_W,
                    candidate_physics_state_1.pos.y + ns_jessica_character_dimension.SLASH_HITBOX_Y
                );
            }
            assert action_dimension_1 = Vec2 (ns_jessica_character_dimension.SLASH_HITBOX_W, ns_jessica_character_dimension.SLASH_HITBOX_H);
        } 
        if (bool_body_in_block_1 == 1) {
            if (curr_body_state_1.dir == 1) {
                // # facing right
                assert action_origin_1 = Vec2(
                    candidate_physics_state_1.pos.x + ns_jessica_character_dimension.BODY_HITBOX_W,
                    candidate_physics_state_1.pos.y + ns_jessica_character_dimension.BLOCK_HITBOX_Y
                );
            } else {
                // # facing left
                assert action_origin_1 = Vec2(
                    candidate_physics_state_1.pos.x - ns_jessica_character_dimension.BLOCK_HITBOX_W,
                    candidate_physics_state_1.pos.y + ns_jessica_character_dimension.BLOCK_HITBOX_Y
                );
            }
            assert action_dimension_1 = Vec2 (ns_jessica_character_dimension.BLOCK_HITBOX_W, ns_jessica_character_dimension.BLOCK_HITBOX_H);
        } 
    } else {
        assert action_origin_1 = Vec2 (ns_scene.BIGNUM, ns_scene.BIGNUM);
        assert action_dimension_1 = Vec2 (0, 0);
    }

    // # determine body dimension (knocked state has a wider hitbox)
    local body_dim_0: Vec2;
    local body_dim_1: Vec2;

    if (bool_body_in_knocked_early_0 == 1) {
        assert body_dim_0 = Vec2 (ns_jessica_character_dimension.BODY_KNOCKED_EARLY_HITBOX_W, ns_jessica_character_dimension.BODY_KNOCKED_EARLY_HITBOX_H);
    } else {
        if (bool_body_in_knocked_late_0 == 1) {
            assert body_dim_0 = Vec2 (ns_jessica_character_dimension.BODY_KNOCKED_LATE_HITBOX_W, ns_jessica_character_dimension.BODY_KNOCKED_LATE_HITBOX_H);
        } else {
            assert body_dim_0 = Vec2 (ns_jessica_character_dimension.BODY_HITBOX_W, ns_jessica_character_dimension.BODY_HITBOX_H);
        }
    }

    if (bool_body_in_knocked_early_1 == 1) {
        assert body_dim_1 = Vec2 (ns_jessica_character_dimension.BODY_KNOCKED_EARLY_HITBOX_W, ns_jessica_character_dimension.BODY_KNOCKED_EARLY_HITBOX_H);
    } else {
        if (bool_body_in_knocked_late_1 == 1) {
            assert body_dim_1 = Vec2 (ns_jessica_character_dimension.BODY_KNOCKED_LATE_HITBOX_W, ns_jessica_character_dimension.BODY_KNOCKED_LATE_HITBOX_H);
        } else {
            assert body_dim_1 = Vec2 (ns_jessica_character_dimension.BODY_HITBOX_W, ns_jessica_character_dimension.BODY_HITBOX_H);
        }
    }

    local hitboxes_0: Hitboxes = Hitboxes(
        action = Rectangle (action_origin_0, action_dimension_0),
        body = Rectangle (candidate_physics_state_0.pos, body_dim_0)
    );

    local hitboxes_1: Hitboxes = Hitboxes(
        action = Rectangle (action_origin_1, action_dimension_1),
        body = Rectangle (candidate_physics_state_1.pos, body_dim_1)
    );

    //
    // 3. Test hitbox overlaps
    //

    // # Agent 1 hit:  action 0 against body 1
    let (bool_agent_1_hit) = _test_rectangle_overlap(hitboxes_0.action, hitboxes_1.body);

    // # Agent 0 hit:  action 1 against body 0
    let (bool_agent_0_hit) = _test_rectangle_overlap(hitboxes_1.action, hitboxes_0.body);

    // # Action clash / block: action 0 against action 1
    let (bool_action_overlap) = _test_rectangle_overlap(hitboxes_0.action, hitboxes_1.action);

    // # Body clash:   body 0 against body 1
    let (bool_body_overlap) = _test_rectangle_overlap(hitboxes_0.body, hitboxes_1.body);

    //
    // 4. Movement second pass, incorporating hitbox overlap (final positions) to produce final physics states
    //
    let (curr_physics_state_0, curr_physics_state_1) = _euler_forward_consider_hitbox (
        last_physics_state_0,
        candidate_physics_state_0,
        last_physics_state_1,
        candidate_physics_state_1,
        bool_body_overlap,
    );

    // Hitbox 0 update
    local hitboxes_0: Hitboxes = Hitboxes(
        action = hitboxes_0.action,
        body = Rectangle (curr_physics_state_0.pos, body_dim_0)
    );

    // Hitbox 1 update
    local hitboxes_1: Hitboxes = Hitboxes(
        action = hitboxes_1.action,
        body = Rectangle (curr_physics_state_1.pos, body_dim_1)
    );

    //
    // 5. Produce stimuli
    // (NULL / HURT / KNOCKED / CLASH)
    //
    let curr_stimulus_0 = produce_stimulus_given_conditions (
        bool_self_hit = bool_agent_0_hit,
        bool_opp_hit = bool_agent_1_hit,
        bool_body_overlap = bool_body_overlap,
        bool_action_overlap = bool_action_overlap,
        bool_self_atk_active = bool_body_in_atk_active_0,
        bool_self_block_active = bool_body_in_block_0,
        bool_opp_atk_active = bool_body_in_atk_active_1,
        bool_opp_block_active = bool_body_in_block_1,
        self_integrity = curr_body_state_0.integrity,
        self_character_type = character_type_0,
        opp_character_type = character_type_1,
    );

    let curr_stimulus_1 = produce_stimulus_given_conditions (
        bool_self_hit = bool_agent_1_hit,
        bool_opp_hit = bool_agent_0_hit,
        bool_body_overlap = bool_body_overlap,
        bool_action_overlap = bool_action_overlap,
        bool_self_atk_active = bool_body_in_atk_active_1,
        bool_self_block_active = bool_body_in_block_1,
        bool_opp_atk_active = bool_body_in_atk_active_0,
        bool_opp_block_active = bool_body_in_block_0,
        self_integrity = curr_body_state_1.integrity,
        self_character_type = character_type_1,
        opp_character_type = character_type_0,
    );

    return (
        curr_physics_state_0,
        curr_physics_state_1,
        curr_stimulus_0,
        curr_stimulus_1,
        hitboxes_0,
        hitboxes_1,
    );
}

func produce_stimulus_given_conditions {range_check_ptr} (
    bool_self_hit: felt,
    bool_opp_hit: felt,
    bool_body_overlap: felt,
    bool_action_overlap: felt,
    bool_self_atk_active: felt,
    bool_self_block_active: felt,
    bool_opp_atk_active: felt,
    bool_opp_block_active: felt,
    self_integrity: felt,
    self_character_type: felt,
    opp_character_type: felt,
) -> felt {
    alloc_locals;

    let is_integrity_critical = is_le (self_integrity, ns_integrity.CRITICAL_INTEGRITY);

    // when hit, HURT if not in critical integrity, KNOCKED otherwise
    if (bool_self_hit == 1) {
        if (bool_self_block_active == 1) {
            return ns_stimulus.NULL;
        }
        if (is_integrity_critical == 1) {
            return ns_stimulus.KNOCKED;
        } else {
            return ns_stimulus.HURT;
        }
    }

    // when blocked, antoc-blocking-jessica knocks jessica away; otherwise HURT
    if (bool_self_atk_active == 1 and bool_opp_block_active == 1 and bool_action_overlap == 1) {
        if (self_character_type == ns_character_type.JESSICA and opp_character_type == ns_character_type.ANTOC) {
            return ns_stimulus.KNOCKED;
        }
        return ns_stimulus.HURT;
    }

    // when clashing:
    // - antoc is hurt if clashing with antoc
    // - antoc is clashed if clashing with jessica
    // - jessica is knocked if clashing with antoc
    // - jessica is clashed if clashing with jessica
    if (bool_self_atk_active == 1 and bool_opp_atk_active == 1 and bool_action_overlap == 1) {
        if (self_character_type == ns_character_type.ANTOC) {
            // I am Antoc
            if (opp_character_type == ns_character_type.ANTOC) {
                return ns_stimulus.HURT;
            } else {
                return ns_stimulus.CLASH;
            }
        } else {
            // I am Jessica
            if (opp_character_type == ns_character_type.ANTOC) {
                return ns_stimulus.KNOCKED;
            } else {
                return ns_stimulus.CLASH;
            }
        }
    }

    // null stimulus otherwise
    return ns_stimulus.NULL;
}

func _test_rectangle_overlap {range_check_ptr}(rect_0: Rectangle, rect_1: Rectangle) -> (
    bool: felt
) {
    alloc_locals;

    let (bool_x_overlap) = _test_segment_overlap(
        rect_0.origin.x,
        rect_0.origin.x + rect_0.dimension.x,
        rect_1.origin.x,
        rect_1.origin.x + rect_1.dimension.x,
    );

    let (bool_y_overlap) = _test_segment_overlap(
        rect_0.origin.y,
        rect_0.origin.y + rect_0.dimension.y,
        rect_1.origin.y,
        rect_1.origin.y + rect_1.dimension.y,
    );

    return (bool_x_overlap * bool_y_overlap,);
}

func _test_segment_overlap {range_check_ptr}(
    x0_left: felt, x0_right: felt, x1_left: felt, x1_right: felt
) -> (bool: felt) {
    //
    // Algorithm:
    // find the segment whose left point is the smaller than the left point of the other segment;
    // call it segment-left (SL), and the other one segment-right (SR);
    // to overlap, the left point of SR should < the right point of SL.
    //

    let x0_is_sl = is_le(x0_left, x1_left);

    if (x0_is_sl == 1) {
        // # x0 is SL
        let bool = is_le(x1_left + 1, x0_right);
        return (bool,);
    } else {
        // # x1 is SL
        let bool = is_le(x0_left + 1, x1_right);
        return (bool,);
    }
}
