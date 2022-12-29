%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.math_cmp import is_le
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.dict_access import DictAccess
from starkware.cairo.common.dict import dict_read
from starkware.cairo.common.default_dict import default_dict_new, default_dict_finalize
from contracts.constants import (
    ns_action,
    ns_stimulus,
    ns_object_state,
    ns_character_dimension,
    ns_combos,
    ns_scene,
    Vec2,
    CharacterState,
    Frame,
    FrameScene,
    Rectangle,
    Hitboxes,
    Stm,
    Perceptibles,
    ComboBuffer,
)
from contracts.object import _object
from contracts.combo import _combo
from contracts.physics import _physicality, _test_rectangle_overlap
from contracts.perceptibles import update_perceptibles
from lib.bto_cairo.lib.tree import Tree, BinaryOperatorTree
from contracts.utils import fill_dictionary_offsets, fill_dictionary

@view
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
    agent_0_functions_offset_len: felt,
    agent_0_functions_offset: felt*,
    agent_0_functions_len: felt,
    agent_0_functions: Tree*,
    agent_1_functions_offset_len: felt,
    agent_1_functions_offset: felt*,
    agent_1_functions_len: felt,
    agent_1_functions: Tree*,
    actions_0_len: felt,
    actions_0: felt*,
    actions_1_len: felt,
    actions_1: felt*,
) -> () {
    alloc_locals;

    //
    // Preparing starting frame
    //
    let (arr_frames: FrameScene*) = alloc();
    let null_rect = Rectangle(Vec2(ns_scene.BIGNUM, ns_scene.BIGNUM), Vec2(0, 0));
    let agent_0_origin = Vec2(-200, 0);
    let agent_1_origin = Vec2(100, 0);
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
            agent_action=ns_action.NULL,
            agent_state=agent_0_initial_state,
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
            agent_action=ns_action.NULL,
            agent_state=agent_1_initial_state,
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

    let (functions_0) = default_dict_new(default_value=0);
    let (functions_0_new) = fill_dictionary(
        dict=functions_0,
        offsets_len=agent_0_functions_offset_len,
        offsets=agent_0_functions_offset,
        tree=agent_0_functions,
        i=0,
    );
    let (functions_1) = default_dict_new(default_value=0);
    let (functions_1_new) = fill_dictionary(
        dict=functions_1,
        offsets_len=agent_1_functions_offset_len,
        offsets=agent_1_functions_offset,
        tree=agent_1_functions,
        i=0,
    );

    tempvar arr_empty: felt* = new ();
    _loop(
        idx=1,
        len=len,
        arr_frames=arr_frames,
        combos_0=ComboBuffer(combos_offset_0_len, combos_offset_0, combos_0, 0, 0),
        combos_1=ComboBuffer(combos_offset_1_len, combos_offset_1, combos_1, 0, 0),
        mental_state_0=mental_state_0_new,
        mental_state_offsets_0=mental_state_offsets_0_new,
        functions_0=functions_0_new,
        mental_state_1=mental_state_1_new,
        mental_state_offsets_1=mental_state_offsets_1_new,
        functions_1=functions_1_new,
        actions_0=actions_0,
        actions_1=actions_1,
    );

    event_array.emit(len, arr_frames);

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
    functions_0: DictAccess*,
    mental_state_1: DictAccess*,
    mental_state_offsets_1: DictAccess*,
    functions_1: DictAccess*,
    actions_0: felt*,
    actions_1: felt*,
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
    let p_0 = Perceptibles(
        self_character_state=last_frame.agent_0.character_state,
        self_object_state=last_frame.agent_0.object_state,
        opponent_character_state=last_frame.agent_1.character_state,
        opponent_object_state=last_frame.agent_1.object_state,
    );
    let (perceptibles_0) = default_dict_new(default_value=0);
    let (local perceptibles_0) = update_perceptibles(perceptibles_0, p_0);

    let p_1 = Perceptibles(
        self_character_state=last_frame.agent_1.character_state,
        self_object_state=last_frame.agent_1.object_state,
        opponent_character_state=last_frame.agent_0.character_state,
        opponent_object_state=last_frame.agent_0.object_state,
    );
    let (perceptibles_1) = default_dict_new(default_value=0);
    let (local perceptibles_1) = update_perceptibles(perceptibles_1, p_1);

    //
    // Agency Phase:
    // A_i, P => A_i', a_i for i = [0,1]
    //
    let (mem) = alloc();
    let (ptr_tree) = dict_read{dict_ptr=mental_state_0}(key=last_frame.agent_0.agent_state);
    tempvar tree = cast(ptr_tree, Tree*);
    let (ptr_offsets) = dict_read{dict_ptr=mental_state_offsets_0}(
        key=last_frame.agent_0.agent_state
    );
    tempvar offsets = cast(ptr_offsets, felt*);
    let (agent_state_0, functions_0_new, dict_new) = BinaryOperatorTree.execute_tree_chain(
        [offsets], offsets + 1, tree, 0, mem, functions_0, perceptibles_0
    );
    default_dict_finalize(
        dict_accesses_start=dict_new, dict_accesses_end=dict_new, default_value=0
    );

    let agent_state_1 = 0;
    let agent_stm_1 = last_frame.agent_1.agent_stm;

    tempvar agent_action_0 = actions_0[agent_state_0];
    tempvar agent_action_1 = actions_1[agent_state_1];

    //
    // Combo Phase
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
            agent_action=a_0,
            agent_state=agent_state_0,
            agent_stm=last_frame.agent_0.agent_stm,
            object_state=object_state_0,
            object_counter=object_counter_0,
            character_state=character_state_0,
            hitboxes=hitboxes_0,
            stimulus=stimulus_0
            ),
        agent_1=Frame(
            agent_action=a_1,
            agent_state=agent_state_1,
            agent_stm=last_frame.agent_1.agent_stm,
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
    _loop(
        idx + 1,
        len,
        arr_frames,
        combos_0_new,
        combos_1_new,
        mental_state_0=mental_state_0,
        mental_state_offsets_0=mental_state_offsets_0,
        functions_0=functions_0_new,
        mental_state_1=mental_state_1,
        mental_state_offsets_1=mental_state_offsets_1,
        functions_1=functions_1,
        actions_0=actions_0,
        actions_1=actions_1,
    );
    return ();
}

@event
func event_array(arr_len: felt, arr: FrameScene*) {
}
