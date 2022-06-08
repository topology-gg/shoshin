%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.math_cmp import is_le, is_not_zero
from contracts.constants import (
    ns_scene, ns_character_dimension, ns_stimulus, ns_object_qualifiers,
    Vec2, Rectangle, CharacterState, Hitboxes
)

func _bool_or {range_check_ptr} (
    bool_0 : felt,
    bool_1 : felt) -> (bool : felt):

    if bool_0 + bool_1 == 0:
        return (0)
    else:
        return (1)
    end
end

func _physicality {range_check_ptr} (
        last_character_state_0 : CharacterState,
        last_character_state_1 : CharacterState,
        curr_object_state_0 : felt,
        curr_object_state_1 : felt
    ) -> (
        curr_character_state_0 : CharacterState,
        curr_character_state_1 : CharacterState,
        curr_stimulus_0 : felt,
        curr_stimulus_1 : felt,
        hitboxes_0 : Hitboxes,
        hitboxes_1 : Hitboxes
    ):
    alloc_locals

    ## TODO: should also take locomotion action as input, for computing movement

    #
    # Algorithm:
    # 1. Movement first pass (candidate positions)
    # 2. Create hitboxes (body, action, environment)
    # 3. Test hitbox overlaps
    # 4. Movement second pass, incorporating hitbox overlap (final positions)
    # 5. Compute character integrity
    # 6. Produce charcater state
    # 7. Produce stimuli
    #

    #
    # 1. Movement first pass (candidate positions)
    #
    let candidate_character_state_0 = last_character_state_0
    let candidate_character_state_1 = last_character_state_1

    #
    # 2. Create hitboxes
    #
    let (bool_object_in_punch_atk_0) = ns_object_qualifiers.is_object_in_punch_atk (curr_object_state_0)
    let (bool_object_in_punch_atk_1) = ns_object_qualifiers.is_object_in_punch_atk (curr_object_state_1)
    let (bool_object_in_power_atk_0) = ns_object_qualifiers.is_object_in_power_atk (curr_object_state_0)
    let (bool_object_in_power_atk_1) = ns_object_qualifiers.is_object_in_power_atk (curr_object_state_1)
    let (bool_object_in_atk_0) = _bool_or (bool_object_in_punch_atk_0, bool_object_in_power_atk_0)
    let (bool_object_in_atk_1) = _bool_or (bool_object_in_punch_atk_1, bool_object_in_power_atk_1)

    let (bool_object_in_knocked_early_0) = ns_object_qualifiers.is_object_in_knocked_early (curr_object_state_0)
    let (bool_object_in_knocked_early_1) = ns_object_qualifiers.is_object_in_knocked_early (curr_object_state_1)
    let (bool_object_in_knocked_late_0) = ns_object_qualifiers.is_object_in_knocked_late (curr_object_state_0)
    let (bool_object_in_knocked_late_1) = ns_object_qualifiers.is_object_in_knocked_late (curr_object_state_1)

    local action_origin_0 : Vec2
    local action_dimension_0 : Vec2
    local action_origin_1 : Vec2
    local action_dimension_1 : Vec2

    if bool_object_in_atk_0 == 1:
        if candidate_character_state_0.dir == 1:
             ## facing right
            assert action_origin_0 = Vec2 (
                candidate_character_state_0.pos.x + ns_character_dimension.BODY_HITBOX_W,
                candidate_character_state_0.pos.y + ns_character_dimension.PUNCH_HITBOX_Y
            )
        else:
             ## facing left
            assert action_origin_0 = Vec2 (
                candidate_character_state_0.pos.x - ns_character_dimension.PUNCH_HITBOX_W,
                candidate_character_state_0.pos.y + ns_character_dimension.PUNCH_HITBOX_Y
            )
        end
        assert action_dimension_0 = Vec2 (ns_character_dimension.PUNCH_HITBOX_W, ns_character_dimension.PUNCH_HITBOX_H)
    else:
        assert action_origin_0 = Vec2 (ns_scene.BIGNUM,ns_scene.BIGNUM)
        assert action_dimension_0 = Vec2 (0,0)
    end

    if bool_object_in_atk_1 == 1:
        if candidate_character_state_1.dir == 1:
             ## facing right
            assert action_origin_1 = Vec2 (
                candidate_character_state_1.pos.x + ns_character_dimension.BODY_HITBOX_W,
                candidate_character_state_1.pos.y + ns_character_dimension.PUNCH_HITBOX_Y
            )
        else:
             ## facing left
            assert action_origin_1 = Vec2 (
                candidate_character_state_1.pos.x - ns_character_dimension.PUNCH_HITBOX_W,
                candidate_character_state_1.pos.y + ns_character_dimension.PUNCH_HITBOX_Y
            )
        end
        assert action_dimension_1 = Vec2 (ns_character_dimension.PUNCH_HITBOX_W, ns_character_dimension.PUNCH_HITBOX_H)
    else:
        assert action_origin_1 = Vec2 (ns_scene.BIGNUM,ns_scene.BIGNUM)
        assert action_dimension_1 = Vec2 (0,0)
    end

    ## determine body dimension (knocked state has a wider hitbox)
    local body_dim_0 : Vec2
    local body_dim_1 : Vec2

    if bool_object_in_knocked_early_0 == 1:
        assert body_dim_0 = Vec2 (ns_character_dimension.BODY_KNOCKED_EARLY_HITBOX_W, ns_character_dimension.BODY_KNOCKED_EARLY_HITBOX_H)
    else:
        if bool_object_in_knocked_late_0 == 1:
            assert body_dim_0 = Vec2 (ns_character_dimension.BODY_KNOCKED_LATE_HITBOX_W, ns_character_dimension.BODY_KNOCKED_LATE_HITBOX_H)
        else:
            assert body_dim_0 = Vec2 (ns_character_dimension.BODY_HITBOX_W, ns_character_dimension.BODY_HITBOX_H)
        end
    end

    if bool_object_in_knocked_early_1 == 1:
        assert body_dim_1 = Vec2 (ns_character_dimension.BODY_KNOCKED_EARLY_HITBOX_W, ns_character_dimension.BODY_KNOCKED_EARLY_HITBOX_H)
    else:
        if bool_object_in_knocked_late_1 == 1:
            assert body_dim_1 = Vec2 (ns_character_dimension.BODY_KNOCKED_LATE_HITBOX_W, ns_character_dimension.BODY_KNOCKED_LATE_HITBOX_H)
        else:
            assert body_dim_1 = Vec2 (ns_character_dimension.BODY_HITBOX_W, ns_character_dimension.BODY_HITBOX_H)
        end
    end

    local hitboxes_0 : Hitboxes = Hitboxes (
        action = Rectangle (action_origin_0, action_dimension_0),
        body = Rectangle (candidate_character_state_0.pos, body_dim_0)
    )

    local hitboxes_1 : Hitboxes = Hitboxes (
        action = Rectangle (action_origin_1, action_dimension_1),
        body = Rectangle (candidate_character_state_1.pos, body_dim_1)
    )

    #
    # 3. Test hitbox overlaps
    #

    ## Agent 1 hit:  action 0 against body 1
    let (bool_agent_1_hit) = _test_rectangle_overlap (hitboxes_0.action, hitboxes_1.body)

    ## Agent 0 hit:  action 1 against body 0
    let (bool_agent_0_hit) = _test_rectangle_overlap (hitboxes_1.action, hitboxes_0.body)

    ## Action clash: action 0 against action 1 (not implemented in this milestone)
    ## Body clash:   body 0 against body 1 (should stop movement; not implemented in this milestone)
    ## Enviroment clash: body 0/1 against environment blocker (floor, walls); should stop movement; not implemented in this milestone


    #
    # 4. Movement second pass, incorporating hitbox overlap (final positions)
    #
    let pos_0 = candidate_character_state_0.pos
    let pos_1 = candidate_character_state_1.pos

    #
    # 5. Compute character integrity
    #
    let int_0 = candidate_character_state_0.int - bool_agent_0_hit
    let int_1 = candidate_character_state_1.int - bool_agent_1_hit

    #
    # 6. Produce charcater state
    #
    let curr_character_state_0 = CharacterState (
        pos = pos_0,
        dir = candidate_character_state_0.dir,
        int = int_0
    )
    let curr_character_state_1 = CharacterState (
        pos = pos_1,
        dir = candidate_character_state_1.dir,
        int = int_1
    )

    #
    # 7. Produce stimuli
    #
    let curr_stimulus_0 = bool_agent_0_hit * (bool_object_in_punch_atk_1 * ns_stimulus.HIT_BY_PUNCH + bool_object_in_power_atk_1 * ns_stimulus.HIT_BY_POWER)
    let curr_stimulus_1 = bool_agent_1_hit * (bool_object_in_punch_atk_0 * ns_stimulus.HIT_BY_PUNCH + bool_object_in_power_atk_0 * ns_stimulus.HIT_BY_POWER)

    return (curr_character_state_0, curr_character_state_1, curr_stimulus_0, curr_stimulus_1, hitboxes_0, hitboxes_1)
end

func _test_rectangle_overlap {range_check_ptr} (
        rect_0 : Rectangle,
        rect_1 : Rectangle
    ) -> (bool : felt):
    alloc_locals

    let (bool_x_overlap) = _test_segment_overlap (
        rect_0.origin.x,
        rect_0.origin.x + rect_0.dimension.x,
        rect_1.origin.x,
        rect_1.origin.x + rect_1.dimension.x
    )

    let (bool_y_overlap) = _test_segment_overlap (
        rect_0.origin.y,
        rect_0.origin.y + rect_0.dimension.y,
        rect_1.origin.y,
        rect_1.origin.y + rect_1.dimension.y
    )

    return (bool_x_overlap * bool_y_overlap)
end

func _test_segment_overlap {range_check_ptr} (
        x0_left : felt,
        x0_right : felt,
        x1_left : felt,
        x1_right : felt
    ) -> (bool : felt):

    #
    # Algorithm:
    # find the segment whose left point is the smaller than the left point of the other segment;
    # call it segment-left (SL), and the other one segment-right (SR);
    # to overlap, the left point of SR should <= the right point of SL.
    #

    let (x0_is_sl) = is_le (x0_left, x1_left)

    if x0_is_sl == 1:
        ## x0 is SL
        let (bool) = is_le (x1_left, x0_right)
        return (bool)
    else:
        ## x1 is SL
        let (bool) = is_le (x0_left, x1_right)
        return (bool)
    end
end
