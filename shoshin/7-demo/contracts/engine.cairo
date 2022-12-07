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
    Perceptibles,
    InputBuffer,
)
from contracts.object import _object
from contracts.physics import _physicality, _test_rectangle_overlap
from contracts.agent_ib import _agent, ns_agent_state

@view
func loop{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(len: felt) -> () {
    alloc_locals;

    //
    // Preparing starting frame
    //
    let (arr_frames: FrameScene*) = alloc();
    let null_rect = Rectangle(Vec2(ns_scene.BIGNUM, ns_scene.BIGNUM), Vec2(0, 0));
    let agent_0_origin = Vec2(-200, 0);
    let agent_1_origin = Vec2(400, 0);
    let agent_0_body = Rectangle(
        agent_0_origin,
        Vec2(ns_character_dimension.BODY_HITBOX_W, ns_character_dimension.BODY_HITBOX_H),
    );
    let agent_1_body = Rectangle(
        agent_1_origin,
        Vec2(ns_character_dimension.BODY_HITBOX_W, ns_character_dimension.BODY_HITBOX_H),
    );
    let character_state_0 = CharacterState(
        pos=agent_0_origin, vel_fp=Vec2(0, 0), acc_fp=Vec2(0, 0), dir=1, int=1000
    );
    let character_state_1 = CharacterState(
        pos=agent_1_origin, vel_fp=Vec2(0, 0), acc_fp=Vec2(0, 0), dir=0, int=1000
    );

    assert arr_frames[0] = FrameScene(
        agent_0=Frame(
            agent_state=ns_agent_state.DEMO,
            agent_action=ns_action.NULL,
            agent_stm=Stm(reg0=0),
            object_state=ns_object_state.IDLE,
            object_counter=0,
            character_state=character_state_0,
            hitboxes=Hitboxes(
                action=null_rect,
                body=agent_0_body
                ),
            stimulus=ns_stimulus.NULL
            ),
        agent_1=Frame(
            agent_state=ns_agent_state.DEMO,
            agent_action=ns_action.NULL,
            agent_stm=Stm(reg0=0),
            object_state=ns_object_state.IDLE,
            object_counter=0,
            character_state=character_state_1,
            hitboxes=Hitboxes(
                action=null_rect,
                body=agent_1_body
                ),
            stimulus=ns_stimulus.NULL
            )
        );

    tempvar arr_empty: felt* = new ();
    _loop(
        idx=1,
        len=len,
        arr_frames=arr_frames,
        input_buffer_0=InputBuffer(0, arr_empty),
        input_buffer_1=InputBuffer(0, arr_empty),
    );

    event_array.emit(len, arr_frames);

    return ();
}

func _loop{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    idx: felt,
    len: felt,
    arr_frames: FrameScene*,
    input_buffer_0: InputBuffer,
    input_buffer_1: InputBuffer,
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
    let perceptibles_0 = Perceptibles(
        self_character_state=last_frame.agent_0.character_state,
        self_object_state=last_frame.agent_0.object_state,
        opponent_character_state=last_frame.agent_1.character_state,
        opponent_object_state=last_frame.agent_1.object_state,
    );
    let perceptibles_1 = Perceptibles(
        self_character_state=last_frame.agent_1.character_state,
        self_object_state=last_frame.agent_1.object_state,
        opponent_character_state=last_frame.agent_0.character_state,
        opponent_object_state=last_frame.agent_0.object_state,
    );

    //
    // Agency Phase:
    // A_i, P => A_i', a_i for i = [0,1]
    //
    let (agent_state_0, agent_stm_0, agent_input_buffer_0_) = _agent(
        last_frame.agent_0.agent_state, last_frame.agent_0.agent_stm, perceptibles_0, input_buffer_0
    );
    let a_0 = agent_input_buffer_0_.arr_actions[0];
    let agent_input_buffer_0 = InputBuffer(
        agent_input_buffer_0_.arr_actions_len - 1, &agent_input_buffer_0_.arr_actions[1]
    );
    // let (agent_state_1, a_1, agent_stm_1) = _agent (last_frame.agent_1.agent_state, perceptibles_1, last_frame.agent_1.agent_stm)

    // let agent_state_0 = last_frame.agent_0.agent_state
    // let a_0 = ns_action.DASH_FORWARD
    // let agent_stm_0 = last_frame.agent_0.agent_stm

    let agent_state_1 = last_frame.agent_1.agent_state;
    let a_1 = ns_action.NULL;
    let agent_stm_1 = last_frame.agent_1.agent_stm;

    //
    // Object Phase:
    // O_i' = Object_i (s, ai, O_i), i = 0,1
    //
    let (object_state_0, object_counter_0) = _object(
        state=last_frame.agent_0.object_state,
        counter=last_frame.agent_0.object_counter,
        stimulus=last_frame.agent_0.stimulus,
        agent_action=a_0,
    );
    let (object_state_1, object_counter_1) = _object(
        state=last_frame.agent_1.object_state,
        counter=last_frame.agent_1.object_counter,
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
        curr_object_counter_0=object_counter_0,
        curr_object_state_1=object_state_1,
        curr_object_counter_1=object_counter_1,
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
            object_counter=object_counter_0,
            character_state=character_state_0,
            hitboxes=hitboxes_0,
            stimulus=stimulus_0
            ),
        agent_1=Frame(
            agent_state=agent_state_1,
            agent_action=a_1,
            agent_stm=agent_stm_1,
            object_state=object_state_1,
            object_counter=object_counter_1,
            character_state=character_state_1,
            hitboxes=hitboxes_1,
            stimulus=stimulus_1
            )
        );

    //
    // Tail recursion
    //
    tempvar arr_empty: felt* = new ();
    _loop(idx + 1, len, arr_frames, agent_input_buffer_0, InputBuffer(0, arr_empty));
    return ();
}

@event
func event_array(arr_len: felt, arr: FrameScene*) {
}
