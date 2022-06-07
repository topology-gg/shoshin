%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from contracts.constants import (
    ns_action, ns_stimulus, ns_object_state, ns_character_dimension, ns_state_qualifiers, ns_scene,
    Vec2, CharacterState, Frame, Frames,
    Rectangle, Hitboxes
)
from contracts.object import (
    _compute_object_next_state
)
from contracts.physics import (
    _test_rectangle_overlap
)

func _agent_stub {range_check_ptr} (
    ) -> (agent_action : felt):

    return (ns_action.PUNCH)
end

func _stimulus_stub {range_check_ptr} (
    ) -> (stimulus : felt):

    return (ns_stimulus.HIT_BY_PUNCH)
end

@view
func loop {syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr} (
        len : felt
    ) -> ():
    alloc_locals

    #
    # Preparing starting frame
    #
    let (arr_frames : Frames*) = alloc ()
    let null_rect = Rectangle (Vec2(ns_scene.BIGNUM,ns_scene.BIGNUM), Vec2(0,0))
    let agent_0_origin = Vec2 (-60,0)
    let agent_1_origin = Vec2 (35,0)
    let agent_0_body = Rectangle (agent_0_origin, Vec2(ns_character_dimension.BODY_HITBOX_W, ns_character_dimension.BODY_HITBOX_H))
    let agent_1_body = Rectangle (agent_1_origin, Vec2(ns_character_dimension.BODY_HITBOX_W, ns_character_dimension.BODY_HITBOX_H))
    let character_state_0 = CharacterState (pos = agent_0_origin, dir = 1)
    let character_state_1 = CharacterState (pos = agent_1_origin, dir = 0)

    assert arr_frames[0] = Frames (
        agent_0 = Frame (
            object_state = ns_object_state.IDLE_0,
            character_state = character_state_0,
            hitboxes = Hitboxes (
                action = null_rect,
                body = agent_0_body
            ),
            stimulus = ns_stimulus.NULL
        ),
        agent_1 = Frame (
            object_state = ns_object_state.IDLE_0,
            character_state = character_state_1,
            hitboxes = Hitboxes (
                action = null_rect,
                body = agent_1_body
            ),
            stimulus = ns_stimulus.NULL
        )
    )

    _loop (
        idx = 1,
        len = len,
        arr_frames = arr_frames
    )

    event_array.emit (len, arr_frames)

    return ()
end

func _loop {syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr} (
        idx : felt,
        len : felt,
        arr_frames : Frames*
    ) -> ():
    alloc_locals

    if idx == len:
        return ()
    end

    #
    # Preparation
    #
    let last_frame : Frames = arr_frames[idx-1]

    #
    # Phase A: Encode physicality into perceptibles:
    # p = Percept (P_s1, P_s2)
    #


    #
    # Phase B: Churn the agent state machines:
    # A_si', A_ai = Agent1 (p, A_si), i = 0,1
    #
    let a_0 = ns_action.PUNCH
    let a_1 = ns_action.NULL

    #
    # Phase C: Reset perceptibles:
    # p = 0
    #


    #
    # Phase D: Churn the object state machines:
    # O_si' = Object_i (s, A_ai, O_si), i = 0,1
    #
    let s_0 = last_frame.agent_0.stimulus
    let s_1 = last_frame.agent_1.stimulus

    let (object_state_0) = _compute_object_next_state (
        state = last_frame.agent_0.object_state,
        stimulus = s_0,
        agent_action = a_0
    )
    let (object_state_1) = _compute_object_next_state (
        state = last_frame.agent_1.object_state,
        stimulus = s_1,
        agent_action = a_1
    )

    #
    # Phase E: Reset stimuli:
    # s = 0
    #


    #
    # Phase F: Forward physics & record stimuli:
    # P_s1', P_s2', s = Physics (P_s1, P_s2, O_s1, O_s2)
    # - update character's dynamic (not for this milestone, where characters do not move)
    # - if object state requires placing hitbox, place hitbox in physics scene
    # - perform overlap tests between each agent's {action hitbox, body hitbox}, set stimuli accordingly
    #

    #
    # Phase F1 - compute next character state (not for this milestone)
    #
    let character_state_0 = last_frame.agent_0.character_state
    let character_state_1 = last_frame.agent_1.character_state

    #
    # Phase F2 - compute next hitboxes
    #
    let (bool_in_punch_atk_0) = ns_state_qualifiers.is_state_in_punch_atk (object_state_0)
    let (bool_in_punch_atk_1) = ns_state_qualifiers.is_state_in_punch_atk (object_state_1)

    local action_origin_0 : Vec2
    local action_dimension_0 : Vec2
    local action_origin_1 : Vec2
    local action_dimension_1 : Vec2
    if bool_in_punch_atk_0 == 1:
        if character_state_0.dir == 1:
             ## facing right
            assert action_origin_0 = Vec2 (
                character_state_0.pos.x + ns_character_dimension.BODY_HITBOX_W,
                character_state_0.pos.y + ns_character_dimension.PUNCH_HITBOX_Y
            )
        else:
             ## facing left
            assert action_origin_0 = Vec2 (
                character_state_0.pos.x - ns_character_dimension.PUNCH_HITBOX_W,
                character_state_0.pos.y + ns_character_dimension.PUNCH_HITBOX_Y
            )
        end
        assert action_dimension_0 = Vec2 (ns_character_dimension.PUNCH_HITBOX_W, ns_character_dimension.PUNCH_HITBOX_H)
    else:
        assert action_origin_0 = Vec2 (ns_scene.BIGNUM,ns_scene.BIGNUM)
        assert action_dimension_0 = Vec2 (0,0)
    end

    if bool_in_punch_atk_1 == 1:
        if character_state_1.dir == 1:
             ## facing right
            assert action_origin_1 = Vec2 (
                character_state_1.pos.x + ns_character_dimension.BODY_HITBOX_W,
                character_state_1.pos.y + ns_character_dimension.PUNCH_HITBOX_Y
            )
        else:
             ## facing left
            assert action_origin_1 = Vec2 (
                character_state_1.pos.x - ns_character_dimension.PUNCH_HITBOX_W,
                character_state_1.pos.y + ns_character_dimension.PUNCH_HITBOX_Y
            )
        end
        assert action_dimension_1 = Vec2 (ns_character_dimension.PUNCH_HITBOX_W, ns_character_dimension.PUNCH_HITBOX_H)
    else:
        assert action_origin_1 = Vec2 (ns_scene.BIGNUM,ns_scene.BIGNUM)
        assert action_dimension_1 = Vec2 (0,0)
    end

    local hitboxes_0 : Hitboxes = Hitboxes (
        action = Rectangle (action_origin_0, action_dimension_0),
        body = Rectangle (character_state_0.pos, last_frame.agent_0.hitboxes.body.dimension)
    )

    local hitboxes_1 : Hitboxes = Hitboxes (
        action = Rectangle (action_origin_1, action_dimension_1),
        body = Rectangle (character_state_1.pos, last_frame.agent_1.hitboxes.body.dimension)
    )

    #
    # Phase F3 -test overlap between hitboxes and set stimuli
    #
    ## Agent 1 hit:  action 0 against body 1
    let (bool_agent_1_hit) = _test_rectangle_overlap (hitboxes_0.action, hitboxes_1.body)

    ## Agent 0 hit:  action 1 against body 0
    let (bool_agent_0_hit) = _test_rectangle_overlap (hitboxes_1.action, hitboxes_0.body)

    ## Action clash: action 0 against action 1 (not implemented in this milestone)
    ## Body clash:   body 0 against body 1 (should stop movement; not implemented in this milestone)

    local stimulus_0
    local stimulus_1
    ## TODO: add different stimulus depends on being hit by what kind of action
    if bool_agent_0_hit == 1:
        assert stimulus_0 = ns_stimulus.HIT_BY_PUNCH
    else:
        assert stimulus_0 = ns_stimulus.NULL
    end
    if bool_agent_1_hit == 1:
        assert stimulus_1 = ns_stimulus.HIT_BY_PUNCH
    else:
        assert stimulus_1 = ns_stimulus.NULL
    end

    #
    # Phase G: Record agent frame
    #
    assert arr_frames [idx] = Frames (
        agent_0 = Frame (
            object_state = object_state_0,
            character_state = character_state_0,
            hitboxes = hitboxes_0,
            stimulus = stimulus_0
        ),
        agent_1 = Frame (
            object_state = object_state_1,
            character_state = character_state_1,
            hitboxes = hitboxes_1,
            stimulus = stimulus_1
        )
    )

    #
    # Tail recursion
    #
    _loop (idx + 1, len, arr_frames)
    return ()
end

@event
func event_array (arr_len : felt, arr : Frames*):
end
