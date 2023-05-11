%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.math_cmp import is_le, is_in_range
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.dict_access import DictAccess
from starkware.cairo.common.dict import dict_read
from starkware.cairo.common.default_dict import default_dict_new, default_dict_finalize
from contracts.constants.constants import (
    ns_stimulus,
    ns_combos,
    ns_scene,
    ns_stamina,
    ns_integrity,
    Vec2,
    PhysicsState,
    BodyState,
    Frame,
    FrameScene,
    Combo,
    Metadata,
    Rectangle,
    Hitboxes,
    Perceptibles,
    ComboBuffer,
    RealTimeAgent,
    RealTimePlayer,
    RealTimeFrameScene
)
from contracts.constants.constants_jessica import ns_jessica_character_dimension
from contracts.body.body import _body
from contracts.combo import _combo
from contracts.physics import _physicality, _test_rectangle_overlap
from contracts.perceptibles import update_perceptibles
from lib.bto_cairo_git.lib.tree import Tree, BinaryOperatorTree
from contracts.utils import fill_dictionary_offsets, fill_dictionary

@external
func submit_agent{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    combos_offset_len: felt,
    combos_offset: felt*,
    combos_len: felt,
    combos: felt*,
    agent_state_machine_offset_len: felt,
    agent_state_machine_offset: felt*,
    agent_state_machine_len: felt,
    agent_state_machine: Tree*,
    agent_states_names_len: felt,
    agent_states_names: felt*,
    agent_initial_state: felt,
    agent_conditions_offset_len: felt,
    agent_conditions_offset: felt*,
    agent_conditions_len: felt,
    agent_conditions: Tree*,
    agent_conditions_names_len: felt,
    agent_conditions_names: felt*,
    actions_len: felt,
    actions: felt*,
    character_type: felt,
){
    //
    // Emit metadata
    //
    // cairo -D 1
    event_single_metadata.emit(
        combos_offset_len,
        combos_offset,
        combos_len,
        combos,
        agent_state_machine_offset_len,
        agent_state_machine_offset,
        agent_state_machine_len,
        agent_state_machine,
        agent_states_names_len,
        agent_states_names,
        agent_initial_state,
        agent_conditions_offset_len,
        agent_conditions_offset,
        agent_conditions_len,
        agent_conditions,
        agent_conditions_names_len,
        agent_conditions_names,
        actions_len,
        actions,
        character_type,
    );
    return();
}

@external
func loop{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    len: felt,
    combos_offset_0_len: felt,
    combos_offset_0: felt*,
    combos_0_len: felt,
    combos_0: felt*,
    combos_offset_1_len: felt,
    combos_offset_1: felt*,
    combos_1_len: felt,
    combos_1: felt*,
    agent_0_state_machine_offset_len: felt,
    agent_0_state_machine_offset: felt*,
    agent_0_state_machine_len: felt,
    agent_0_state_machine: Tree*,
    agent_0_initial_state: felt,
    agent_1_state_machine_offset_len: felt,
    agent_1_state_machine_offset: felt*,
    agent_1_state_machine_len: felt,
    agent_1_state_machine: Tree*,
    agent_1_initial_state: felt,
    agent_0_conditions_offset_len: felt,
    agent_0_conditions_offset: felt*,
    agent_0_conditions_len: felt,
    agent_0_conditions: Tree*,
    agent_1_conditions_offset_len: felt,
    agent_1_conditions_offset: felt*,
    agent_1_conditions_len: felt,
    agent_1_conditions: Tree*,
    actions_0_len: felt,
    actions_0: felt*,
    actions_1_len: felt,
    actions_1: felt*,
    character_type_0: felt,
    character_type_1: felt,
) -> () {
    // cairo --return (frames_len: felt, frames: FrameScene*)
    alloc_locals;

    //
    // Emit metadata
    //
    // cairo -D 1
    event_metadata.emit(
        combos_offset_0_len,
        combos_offset_0,
        combos_0_len,
        combos_0,
        combos_offset_1_len,
        combos_offset_1,
        combos_1_len,
        combos_1,
        agent_0_state_machine_offset_len,
        agent_0_state_machine_offset,
        agent_0_state_machine_len,
        agent_0_state_machine,
        agent_0_initial_state,
        agent_1_state_machine_offset_len,
        agent_1_state_machine_offset,
        agent_1_state_machine_len,
        agent_1_state_machine,
        agent_1_initial_state,
        agent_0_conditions_offset_len,
        agent_0_conditions_offset,
        agent_0_conditions_len,
        agent_0_conditions,
        agent_1_conditions_offset_len,
        agent_1_conditions_offset,
        agent_1_conditions_len,
        agent_1_conditions,
        actions_0_len,
        actions_0,
        actions_1_len,
        actions_1,
        character_type_0,
        character_type_1,
    );



    //
    // Preparing starting frame
    // Note: assuming same BODY_HITBOX_W for both Jessica and Antoc !!!
    //
    let (arr_frames: FrameScene*) = alloc();
    let null_rect = Rectangle(Vec2(ns_scene.BIGNUM, ns_scene.BIGNUM), Vec2(0, 0));
    let agent_0_origin = Vec2(-100, 0);
    let agent_1_origin = Vec2(100, 0);
    let agent_0_body = Rectangle(
        agent_0_origin,
        Vec2(ns_jessica_character_dimension.BODY_HITBOX_W, ns_jessica_character_dimension.BODY_HITBOX_H),
    );
    let agent_1_body = Rectangle(
        agent_1_origin,
        Vec2(ns_jessica_character_dimension.BODY_HITBOX_W, ns_jessica_character_dimension.BODY_HITBOX_H),
    );
    let physics_state_0 = PhysicsState(
        pos=agent_0_origin, vel_fp=Vec2(0, 0), acc_fp=Vec2(0, 0)
    );
    let physics_state_1 = PhysicsState(
        pos=agent_1_origin, vel_fp=Vec2(0, 0), acc_fp=Vec2(0, 0)
    );

    // IDLE body state is 0 for both Jessica and Antoc; right is 1
    // NULL action is 0 for both Jessica and Antoc
    assert arr_frames[0] = FrameScene(
        agent_0 = Frame(
            mental_state  = agent_0_initial_state,
            body_state    = BodyState(0, 0, ns_integrity.INIT_INTEGRITY, ns_stamina.INIT_STAMINA, 1, 0), 
            physics_state = physics_state_0,
            action        = 0, 
            stimulus      = ns_stimulus.NULL,
            hitboxes      = Hitboxes(
                action = null_rect,
                body   = agent_0_body
                ),
            combo         = Combo(
                combo_index   = 0,
                action_index = 0,
                ),
            ),
        agent_1 = Frame(
            mental_state  = agent_1_initial_state,
            body_state    = BodyState(0, 0, ns_integrity.INIT_INTEGRITY, ns_stamina.INIT_STAMINA, 0, 0), 
            physics_state = physics_state_1,
            action        = 0, 
            stimulus      = ns_stimulus.NULL,
            hitboxes      = Hitboxes(
                action = null_rect,
                body   = agent_1_body
                ),
            combo         = Combo(
                combo_index   = 0,
                action_index = 0,
                ),
            ),
        );

    //
    // Preparing dictionaries
    //
    let (mental_state_0) = default_dict_new(default_value=0);
    let (mental_state_offsets_0) = default_dict_new(default_value=0);
    let (mental_state_0_new, mental_state_offsets_0_new) = fill_dictionary_offsets(
        tree_dict=mental_state_0,
        offsets_dict=mental_state_offsets_0,
        offsets_len=agent_0_state_machine_offset_len,
        offsets=agent_0_state_machine_offset,
        tree=agent_0_state_machine,
        i=0,
    );
    let (mental_state_1) = default_dict_new(default_value=0);
    let (mental_state_offsets_1) = default_dict_new(default_value=0);
    let (mental_state_1_new, mental_state_offsets_1_new) = fill_dictionary_offsets(
        tree_dict=mental_state_1,
        offsets_dict=mental_state_offsets_1,
        offsets_len=agent_1_state_machine_offset_len,
        offsets=agent_1_state_machine_offset,
        tree=agent_1_state_machine,
        i=0,
    );

    let (conditions_0) = default_dict_new(default_value=0);
    let (conditions_0_new) = fill_dictionary(
        dict=conditions_0,
        offsets_len=agent_0_conditions_offset_len,
        offsets=agent_0_conditions_offset,
        tree=agent_0_conditions,
        i=0,
    );
    let (conditions_1) = default_dict_new(default_value=0);
    let (conditions_1_new) = fill_dictionary(
        dict=conditions_1,
        offsets_len=agent_1_conditions_offset_len,
        offsets=agent_1_conditions_offset,
        tree=agent_1_conditions,
        i=0,
    );

    tempvar arr_empty: felt* = new ();
    // cairo -i return _loop(
    // cairo -d 
    let (idx) = _loop(
        idx = 1,
        len = len,
        arr_frames = arr_frames,
        combos_0 = ComboBuffer(combos_offset_0_len, combos_offset_0, combos_0, 0, 0),
        combos_1 = ComboBuffer(combos_offset_1_len, combos_offset_1, combos_1, 0, 0),
        mental_state_0 = mental_state_0_new,
        mental_state_offsets_0 = mental_state_offsets_0_new,
        conditions_0 = conditions_0_new,
        mental_state_1 = mental_state_1_new,
        mental_state_offsets_1 = mental_state_offsets_1_new,
        conditions_1 = conditions_1_new,
        actions_0 = actions_0,
        actions_1 = actions_1,
        character_type_0 = character_type_0,
        character_type_1 = character_type_1,
    );

    event_array.emit(idx, arr_frames);
    // cairo -d
    return ();
}

func _loop{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
    idx: felt,
    len: felt,
    arr_frames: FrameScene*,
    combos_0: ComboBuffer,
    combos_1: ComboBuffer,
    mental_state_0: DictAccess*,
    mental_state_offsets_0: DictAccess*,
    conditions_0: DictAccess*,
    mental_state_1: DictAccess*,
    mental_state_offsets_1: DictAccess*,
    conditions_1: DictAccess*,
    actions_0: felt*,
    actions_1: felt*,
    character_type_0: felt,
    character_type_1: felt,
) -> (idx: felt) {
    // cairo --return (frames_len: felt, frames: FrameScene*) 
    alloc_locals;
    if (idx == len) {
        // cairo -i return(frames_len=len, frames=arr_frames);
        // cairo -d 
        return (idx=len);
    }

    //
    // Preparation
    //
    let last_frame: FrameScene = arr_frames[idx - 1];
    

    //
    /// See if a player has health <= 0
    //

    let agent_0_standing = is_in_range(last_frame.agent_0.body_state.integrity, 0, 1001);
    let agent_1_standing = is_in_range(last_frame.agent_0.body_state.integrity, 0, 1001);

    
    if (agent_0_standing == 0) {
        // cairo -i return(frames_len=idx, frames=arr_frames);
        // cairo -d 
       return (idx=idx);
    }
    if (agent_1_standing == 0) {
        // cairo -i return(frames_len=idx, frames=arr_frames);
        // cairo -d 
       return (idx=idx);
    }


    //
    // Perception Phase
    // (given physics states and body states, produce perceptibles)
    //
    let p_0 = Perceptibles(
        self_physics_state     = last_frame.agent_0.physics_state,
        self_body_state        = last_frame.agent_0.body_state,
        opponent_physics_state = last_frame.agent_1.physics_state,
        opponent_body_state    = last_frame.agent_1.body_state,
    );
    let (perceptibles_0) = default_dict_new(default_value=0);
    let (local perceptibles_0) = update_perceptibles(perceptibles_0, p_0);

    let p_1 = Perceptibles(
        self_physics_state     = last_frame.agent_1.physics_state,
        self_body_state        = last_frame.agent_1.body_state,
        opponent_physics_state = last_frame.agent_0.physics_state,
        opponent_body_state    = last_frame.agent_0.body_state,
    );
    let (perceptibles_1) = default_dict_new(default_value=0);
    let (local perceptibles_1) = update_perceptibles(perceptibles_1, p_1);

    //
    // Agency Phase
    // (given perceptibles, produce agent action / "intent")
    //
    let (mem) = alloc();
    let (ptr_tree) = dict_read{dict_ptr=mental_state_0}(key=last_frame.agent_0.mental_state);
    tempvar tree = cast(ptr_tree, Tree*);
    let (ptr_offsets) = dict_read{dict_ptr=mental_state_offsets_0}(
        key=last_frame.agent_0.mental_state
    );
    tempvar offsets = cast(ptr_offsets, felt*);
    let (agent_state_0, conditions_0_new, dict_new) = BinaryOperatorTree.execute_tree_chain(
        [offsets], offsets + 1, tree, 0, mem, conditions_0, perceptibles_0
    );
    default_dict_finalize(
        dict_accesses_start=dict_new, dict_accesses_end=dict_new, default_value=0
    );

    let (mem) = alloc();
    let (ptr_tree) = dict_read{dict_ptr=mental_state_1}(key=last_frame.agent_1.mental_state);
    tempvar tree = cast(ptr_tree, Tree*);
    let (ptr_offsets) = dict_read{dict_ptr=mental_state_offsets_1}(
        key=last_frame.agent_1.mental_state
    );
    tempvar offsets = cast(ptr_offsets, felt*);
    let (agent_state_1, conditions_1_new, dict_new) = BinaryOperatorTree.execute_tree_chain(
        [offsets], offsets + 1, tree, 0, mem, conditions_1, perceptibles_1
    );
    default_dict_finalize(
        dict_accesses_start=dict_new, dict_accesses_end=dict_new, default_value=0
    );

    tempvar agent_action_0 = actions_0 [agent_state_0];
    tempvar agent_action_1 = actions_1 [agent_state_1];

    //
    // Combo Phase
    // (determine agent's actual intent to be an atomic action or an action from combo buffer)
    //
    local a_0;
    local combos_0_new: ComboBuffer;
    let is_combo = is_le(ns_combos.ENCODING, agent_action_0);

    if (is_combo == 1) {
        let (a, c) = _combo(agent_action_0 - ns_combos.ENCODING, combos_0);
        assert a_0 = a;
        assert combos_0_new = c;
        tempvar range_check_ptr = range_check_ptr;
    } else {
        assert a_0 = agent_action_0;
        assert combos_0_new = ComboBuffer(combos_0.combos_offset_len, combos_0.combos_offset, combos_0.combos, 0, 0);
        tempvar range_check_ptr = range_check_ptr;
    }

    local a_1;
    local combos_1_new: ComboBuffer;
    let is_combo = is_le(ns_combos.ENCODING, agent_action_1);

    if (is_combo == 1) {
        let (a, c) = _combo(agent_action_1 - ns_combos.ENCODING, combos_1);
        assert a_1 = a;
        assert combos_1_new = c;
        tempvar range_check_ptr = range_check_ptr;
    } else {
        assert a_1 = agent_action_1;
        assert combos_1_new = ComboBuffer(combos_1.combos_offset_len, combos_1.combos_offset, combos_1.combos, 0, 0);
        tempvar range_check_ptr = range_check_ptr;
    }

    //
    // Body Phase
    // (given agent intent, stimulus, and last frame's body state, produce this frame's body state)
    //
    let (body_state_0 : BodyState) = _body (
        character_type = character_type_0,
        body_state     = last_frame.agent_0.body_state,
        stimulus       = last_frame.agent_0.stimulus,
        intent         = a_0,
    );
    let (body_state_1 : BodyState) = _body (
        character_type = character_type_1,
        body_state     = last_frame.agent_1.body_state,
        stimulus       = last_frame.agent_1.stimulus,
        intent         = a_1,
    );

    //
    // Physicality Phase:
    // (given this frame's body state and last frame's physics state, produce this frame's physics state along with new stimulus and hitboxes)
    //
    let (
        physics_state_0: PhysicsState,
        physics_state_1: PhysicsState,
        stimulus_0: felt,
        stimulus_1: felt,
        hitboxes_0: Hitboxes,
        hitboxes_1: Hitboxes,
    ) = _physicality(
        character_type_0     = character_type_0,
        character_type_1     = character_type_1,
        last_physics_state_0 = last_frame.agent_0.physics_state,
        last_physics_state_1 = last_frame.agent_1.physics_state,
        curr_body_state_0    = body_state_0,
        curr_body_state_1    = body_state_1,
    );

    //
    // Recording Phase:
    //
    assert arr_frames[idx] = FrameScene(
        agent_0 = Frame (
            mental_state  = agent_state_0,
            body_state    = body_state_0,
            physics_state = physics_state_0,
            action        = a_0,
            stimulus      = stimulus_0,
            hitboxes      = hitboxes_0,
            combo         = Combo(
                combo_index   = combos_0_new.current_combo, 
                action_index  = combos_0_new.combo_counter
                ),
        ),
        agent_1 = Frame (
            mental_state  = agent_state_1,
            body_state    = body_state_1,
            physics_state = physics_state_1,
            action        = a_1,
            stimulus      = stimulus_1,
            hitboxes      = hitboxes_1,
            combo         = Combo(
                combo_index   = combos_1_new.current_combo, 
                action_index  = combos_1_new.combo_counter
                ),
        )
    );

    //
    // Tail recursion
    //
    return _loop(
        idx = idx + 1,
        len = len,
        arr_frames = arr_frames,
        combos_0 = combos_0_new,
        combos_1 = combos_1_new,
        mental_state_0 = mental_state_0,
        mental_state_offsets_0 = mental_state_offsets_0,
        conditions_0 = conditions_0_new,
        mental_state_1 = mental_state_1,
        mental_state_offsets_1 = mental_state_offsets_1,
        conditions_1 = conditions_1_new,
        actions_0 = actions_0,
        actions_1 = actions_1,
        character_type_0 = character_type_0,
        character_type_1 = character_type_1,
    );
}


func playerInLoop{syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr}(
        agent_0_body_state_state: felt,
        agent_0_body_state_counter: felt,
        agent_0_body_state_integrity: felt,
        agent_0_body_state_stamina: felt,
        agent_0_body_state_dir: felt,
        agent_0_body_state_fatigued: felt,

        agent_0_physics_state_pos_x: felt,
        agent_0_physics_state_pos_y: felt,
        agent_0_physics_state_vel_x: felt,
        agent_0_physics_state_vel_y: felt,
        agent_0_physics_state_acc_x: felt,
        agent_0_physics_state_acc_y: felt,

        agent_0_stimulus : felt,
        agent_0_action: felt,
        agent_0_character_type: felt,
        
        agent_1_body_state_state: felt,
        agent_1_body_state_counter: felt,
        agent_1_body_state_integrity: felt,
        agent_1_body_state_stamina: felt,
        agent_1_body_state_dir: felt,
        agent_1_body_state_fatigued: felt,

        agent_1_physics_state_pos_x: felt,
        agent_1_physics_state_pos_y: felt,
        agent_1_physics_state_vel_x: felt,
        agent_1_physics_state_vel_y: felt,
        agent_1_physics_state_acc_x: felt,
        agent_1_physics_state_acc_y: felt,
        
        agent_1_stimulus : felt,
        agent_1_character_type: felt,

        
        combos_offset_1_len: felt,
        combos_offset_1: felt*,
        combos_1_len: felt,
        combos_1: felt*,
        agent_1_state_machine_offset_len: felt,
        agent_1_state_machine_offset: felt*,
        agent_1_state_machine_len: felt,
        agent_1_state_machine: Tree*,
        
        agent_1_mental_state: felt,
        agent_1_conditions_offset_len: felt,
        agent_1_conditions_offset: felt*,
        agent_1_conditions_len: felt,
        agent_1_conditions: Tree*,
        actions_1_len: felt,
        actions_1: felt*,

)  -> (len : felt, scene: RealTimeFrameScene*) {
    alloc_locals;


    //
    // Preparing dictionaries
    //

    let (mental_state_1) = default_dict_new(default_value=0);
    let (mental_state_offsets_1) = default_dict_new(default_value=0);
    let (mental_state_1_filled, mental_state_offsets_1_filled) = fill_dictionary_offsets(
        tree_dict=mental_state_1,
        offsets_dict=mental_state_offsets_1,
        offsets_len=agent_1_state_machine_offset_len,
        offsets=agent_1_state_machine_offset,
        tree=agent_1_state_machine,
        i=0,
    );

    let (conditions_1) = default_dict_new(default_value=0);
    let (conditions_1_filled) = fill_dictionary(
        dict=conditions_1,
        offsets_len=agent_1_conditions_offset_len,
        offsets=agent_1_conditions_offset,
        tree=agent_1_conditions,
        i=0,
    );


    // create agent 0 body and physics
    let agent_0_body_state  = BodyState(
        state=agent_0_body_state_state,
        counter=agent_0_body_state_counter,
        integrity=agent_0_body_state_integrity,
        stamina=agent_0_body_state_stamina,
        dir=agent_0_body_state_dir,
        fatigued=agent_0_body_state_fatigued,
    );

    let agent_0_position = Vec2(agent_0_physics_state_pos_x, agent_0_physics_state_pos_y);
    let agent_0_vel = Vec2(agent_0_physics_state_vel_x, agent_0_physics_state_vel_y);
    let agent_0_acc = Vec2(agent_0_physics_state_acc_x, agent_0_physics_state_acc_y);

    let agent_0_physics_state = PhysicsState(
        agent_0_position,agent_0_vel, agent_0_acc
    );

    // create agent 1 body and physics
    let agent_1_body_state  = BodyState(
        agent_1_body_state_state,
        agent_1_body_state_counter,
        agent_1_body_state_integrity,
        agent_1_body_state_stamina,
        agent_1_body_state_dir,
        agent_1_body_state_fatigued
    );

    let agent_1_position = Vec2(agent_1_physics_state_pos_x, agent_1_physics_state_pos_y);
    let agent_1_vel = Vec2(agent_1_physics_state_vel_x, agent_1_physics_state_vel_y);
    let agent_1_acc = Vec2(agent_1_physics_state_acc_x, agent_1_physics_state_acc_y);

    let agent_1_physics_state = PhysicsState(
        agent_1_position,agent_1_vel, agent_1_acc
    );


    //
    // Perception Phase
    // (given physics states and body states, produce perceptibles)
    //

    let p_1 = Perceptibles(
        self_physics_state     = agent_1_physics_state,
        self_body_state        = agent_1_body_state,
        opponent_physics_state = agent_0_physics_state,
        opponent_body_state    = agent_0_body_state,
    );
    let (perceptibles_1) = default_dict_new(default_value=0);
    let (local perceptibles_1) = update_perceptibles(perceptibles_1, p_1);

    //
    // Agency Phase
    // (given perceptibles, produce agent action / "intent")
    //

    let (mem) = alloc();
    let (ptr_tree) = dict_read{dict_ptr=mental_state_1_filled}(key=agent_1_mental_state);
    tempvar tree = cast(ptr_tree, Tree*);
    let (ptr_offsets) = dict_read{dict_ptr=mental_state_offsets_1_filled}(
        key=agent_1_mental_state
    );
    tempvar offsets = cast(ptr_offsets, felt*);
    let (agent_state_1, conditions_1_new, dict_new) = BinaryOperatorTree.execute_tree_chain(
        [offsets], offsets + 1, tree, 0, mem, conditions_1_filled, perceptibles_1
    );
    default_dict_finalize(
        dict_accesses_start=dict_new, dict_accesses_end=dict_new, default_value=0
    );

    tempvar agent_action_1 = actions_1 [agent_state_1];

    //
    // Combo Phase
    // (determine agent's actual intent to be an atomic action or an action from combo buffer)
    //


    // Combo buffer might need to come from outside too
    local agent_1_action;
    tempvar combo_buffer = ComboBuffer(combos_offset_1_len, combos_offset_1, combos_1, 0, 0);
    local combos_1_new: ComboBuffer;
    let is_combo = is_le(ns_combos.ENCODING, agent_action_1);

    if (is_combo == 1) {
        let (a, c) = _combo(agent_action_1 - ns_combos.ENCODING, combo_buffer);
        assert agent_1_action = a;
        assert combos_1_new = c;
        tempvar range_check_ptr = range_check_ptr;
    } else {
        assert agent_1_action = agent_action_1;
        assert combos_1_new = ComboBuffer(combo_buffer.combos_offset_len, combo_buffer.combos_offset, combo_buffer.combos, 0, 0);
        tempvar range_check_ptr = range_check_ptr;
    }

    //
    // Body Phase
    // (given agent intent, stimulus, and last frame's body state, produce this frame's body state)
    //
    let (body_state_0 : BodyState) = _body (
        character_type = agent_0_character_type,
        body_state     = agent_0_body_state,
        stimulus       = agent_0_stimulus,
        intent         = agent_0_action,
    );
    let (body_state_1 : BodyState) = _body (
        character_type = agent_1_character_type,
        body_state     = agent_1_body_state,
        stimulus       = agent_1_stimulus,
        intent         = agent_1_action,
    );

    //
    // Physicality Phase:
    // (given this frame's body state and last frame's physics state, produce this frame's physics state along with new stimulus and hitboxes)
    //
    let (
        physics_state_0: PhysicsState,
        physics_state_1: PhysicsState,
        stimulus_0: felt,
        stimulus_1: felt,
        hitboxes_0: Hitboxes,
        hitboxes_1: Hitboxes,
    ) = _physicality(
        character_type_0     = agent_0_character_type,
        character_type_1     = agent_1_character_type,
        last_physics_state_0 = agent_0_physics_state,
        last_physics_state_1 = agent_1_physics_state,
        curr_body_state_0    = body_state_0,
        curr_body_state_1    = body_state_1,
    );

    //Easier to recover the RealTimeFrame in rust by using an array
    let (real_time_frame_scenes: RealTimeFrameScene*) = alloc();

    // For player agent mental_state and other frame members are not relevent
    assert real_time_frame_scenes[0] = RealTimeFrameScene(
        agent_0=RealTimePlayer(
            body_state=body_state_0,
            physics_state=physics_state_0,
            stimulus=stimulus_0,
            hitboxes=hitboxes_0,
        ),
        agent_1=RealTimeAgent(
            body_state=body_state_1,
            physics_state=physics_state_1,
            stimulus=stimulus_1,
            hitboxes=hitboxes_1,
            mental_state=agent_state_1,
        ),
    );

    return (len=1, scene=real_time_frame_scenes);

}


@event
func event_array(arr_len: felt, arr: FrameScene*) {
}

@event
func event_realtime(scene: RealTimeFrameScene) {
}

// emit both agents' description
@event
func event_metadata(
    combos_offset_0_len: felt,
    combos_offset_0: felt*,
    combos_0_len: felt,
    combos_0: felt*,
    combos_offset_1_len: felt,
    combos_offset_1: felt*,
    combos_1_len: felt,
    combos_1: felt*,
    agent_0_state_machine_offset_len: felt,
    agent_0_state_machine_offset: felt*,
    agent_0_state_machine_len: felt,
    agent_0_state_machine: Tree*,
    agent_0_initial_state: felt,
    agent_1_state_machine_offset_len: felt,
    agent_1_state_machine_offset: felt*,
    agent_1_state_machine_len: felt,
    agent_1_state_machine: Tree*,
    agent_1_initial_state: felt,
    agent_0_conditions_offset_len: felt,
    agent_0_conditions_offset: felt*,
    agent_0_conditions_len: felt,
    agent_0_conditions: Tree*,
    agent_1_conditions_offset_len: felt,
    agent_1_conditions_offset: felt*,
    agent_1_conditions_len: felt,
    agent_1_conditions: Tree*,
    actions_0_len: felt,
    actions_0: felt*,
    actions_1_len: felt,
    actions_1: felt*,
    character_type_0: felt,
    character_type_1: felt,
) {
}

// emit a single agent's metadata
@event
func event_single_metadata(
    combos_offset_len: felt,
    combos_offset: felt*,
    combos_len: felt,
    combos: felt*,
    agent_state_machine_offset_len: felt,
    agent_state_machine_offset: felt*,
    agent_state_machine_len: felt,
    agent_state_machine: Tree*,
    agent_states_names_len: felt,
    agent_states_names: felt*,
    agent_initial_state: felt,
    agent_conditions_offset_len: felt,
    agent_conditions_offset: felt*,
    agent_conditions_len: felt,
    agent_conditions: Tree*,
    agent_conditions_names_len: felt,
    agent_conditions_names: felt*,
    actions_len: felt,
    actions: felt*,
    character_type: felt,
) {
}
