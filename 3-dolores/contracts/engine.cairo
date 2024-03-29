%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from contracts.constants import (
    ns_action,
    ns_stimulus,
    ns_object_state,
    ns_character_dimension,
    ns_scene,
    Vec2,
    CharacterState,
    Frame,
    FrameScene,
    Rectangle,
    Hitboxes,
    Stm,
)
from contracts.object import _object
from contracts.physics import _physicality, _test_rectangle_overlap
from contracts.agent import _agent, ns_agent_state

@view
func loop{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(len: felt) -> () {
    alloc_locals;

    //
    // Preparing starting frame
    //
    let (arr_frames: FrameScene*) = alloc();
    let null_rect = Rectangle(Vec2(ns_scene.BIGNUM, ns_scene.BIGNUM), Vec2(0, 0));
    let agent_0_origin = Vec2(-30, 0);
    let agent_1_origin = Vec2(65, 0);
    let agent_0_body = Rectangle(
        agent_0_origin,
        Vec2(ns_character_dimension.BODY_HITBOX_W, ns_character_dimension.BODY_HITBOX_H),
    );
    let agent_1_body = Rectangle(
        agent_1_origin,
        Vec2(ns_character_dimension.BODY_HITBOX_W, ns_character_dimension.BODY_HITBOX_H),
    );
    let character_state_0 = CharacterState(pos=agent_0_origin, dir=1, int=1000);
    let character_state_1 = CharacterState(pos=agent_1_origin, dir=0, int=1000);

    assert arr_frames[0] = FrameScene(
        agent_0=Frame(
            agent_state=ns_agent_state.IDLE,
            agent_action=ns_action.NULL,
            agent_stm=Stm(reg0=0),
            object_state=ns_object_state.IDLE_0,
            character_state=character_state_0,
            hitboxes=Hitboxes(
                action=null_rect,
                body=agent_0_body
                ),
            stimulus=ns_stimulus.NULL
            ),
        agent_1=Frame(
            agent_state=ns_agent_state.IDLE,
            agent_action=ns_action.NULL,
            agent_stm=Stm(reg0=0),
            object_state=ns_object_state.IDLE_0,
            character_state=character_state_1,
            hitboxes=Hitboxes(
                action=null_rect,
                body=agent_1_body
                ),
            stimulus=ns_stimulus.NULL
            )
        );

    _loop(idx=1, len=len, arr_frames=arr_frames);

    event_array.emit(len, arr_frames);

    return ();
}

func _loop{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    idx: felt, len: felt, arr_frames: FrameScene*
) -> () {
    alloc_locals;

    if (idx == len) {
        return ();
    }

    //
    // Preparation
    //
    let last_frame: FrameScene = arr_frames[idx - 1];

    //
    // Perception Phase:
    // C_1, C_2 => P
    //
    let perceptibles = 0;

    //
    // Agency Phase:
    // A_i, P => A_i', a_i for i = [0,1]
    //
    let (agent_state_0, a_0, agent_stm_0) = _agent(
        last_frame.agent_0.agent_state, perceptibles, last_frame.agent_0.agent_stm
    );
    // let (agent_state_1, a_1, agent_stm_1) = _agent (last_frame.agent_1.agent_state, perceptibles, last_frame.agent_1.agent_stm)

    // # Null mind for agent 1
    let agent_state_1 = last_frame.agent_1.agent_state;
    let a_1 = ns_action.NULL;
    let agent_stm_1 = last_frame.agent_1.agent_stm;

    //
    // Object Phase:
    // O_i' = Object_i (s, ai, O_i), i = 0,1
    //
    let (object_state_0) = _object(
        state=last_frame.agent_0.object_state,
        stimulus=last_frame.agent_0.stimulus,
        agent_action=a_0,
    );
    let (object_state_1) = _object(
        state=last_frame.agent_1.object_state,
        stimulus=last_frame.agent_1.stimulus,
        agent_action=a_1,
    );

    //
    // Physicality Phase:
    // C_1', C_2', S_1, S_2 = Physics (C_1, C_2, O_1', O_2')
    //
    let (
        character_state_0: CharacterState,
        character_state_1: CharacterState,
        stimulus_0: felt,
        stimulus_1: felt,
        hitboxes_0: Hitboxes,
        hitboxes_1: Hitboxes,
    ) = _physicality(
        last_character_state_0=last_frame.agent_0.character_state,
        last_character_state_1=last_frame.agent_1.character_state,
        curr_object_state_0=object_state_0,
        curr_object_state_1=object_state_1,
    );

    //
    // Recording Phase:
    //
    assert arr_frames[idx] = FrameScene(
        agent_0=Frame(
            agent_state=agent_state_0,
            agent_action=a_0,
            agent_stm=agent_stm_0,
            object_state=object_state_0,
            character_state=character_state_0,
            hitboxes=hitboxes_0,
            stimulus=stimulus_0
            ),
        agent_1=Frame(
            agent_state=agent_state_1,
            agent_action=a_1,
            agent_stm=agent_stm_1,
            object_state=object_state_1,
            character_state=character_state_1,
            hitboxes=hitboxes_1,
            stimulus=stimulus_1
            )
        );

    //
    // Tail recursion
    //
    _loop(idx + 1, len, arr_frames);
    return ();
}

@event
func event_array(arr_len: felt, arr: FrameScene*) {
}
