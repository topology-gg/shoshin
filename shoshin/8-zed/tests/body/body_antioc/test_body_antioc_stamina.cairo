%lang starknet
from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.cairo_builtins import BitwiseBuiltin
from starkware.cairo.common.bool import (TRUE, FALSE)
from contracts.constants.constants_antoc import (ns_antoc_action, ns_antoc_body_state, ns_antoc_stamina_effect, ns_antoc_body_state_duration)
from contracts.constants.constants import (BodyState, ns_stimulus, HURT_EFFECT, KNOCKED_EFFECT, ns_common_stamina_effect)
from contracts.body.body_antoc import _body_antoc


func assert_fatigue_effect{range_check_ptr}(stamina_effect : felt, intent : felt, state : felt, fallback_action_stamina_effect : felt){
    alloc_locals;
    let stamina = stamina_effect - 1;
    tempvar body_state = BodyState(state, 0, 1000, stamina, 0, FALSE);
    let stimulus = ns_stimulus.NULL;
    let (body_state_nxt) = _body_antoc(body_state = body_state, stimulus = stimulus, intent = intent);

    assert body_state_nxt.state = body_state.state;
    assert body_state_nxt.integrity = body_state.integrity;
    assert body_state_nxt.stamina = body_state.stamina + fallback_action_stamina_effect;
    assert body_state_nxt.dir = body_state.dir;
    assert body_state_nxt.fatigued = TRUE;
    assert body_state_nxt.counter = body_state.counter + 1;
    

    return();
}
func assert_fatigue_effect_idle{range_check_ptr}(stamina_effect : felt, intent : felt){
    assert_fatigue_effect(stamina_effect, intent, ns_antoc_body_state.IDLE, ns_common_stamina_effect.NULL);
    return();
}

func assert_fatigue_effect_move_forward{range_check_ptr}(stamina_effect : felt, intent : felt){
    assert_fatigue_effect(stamina_effect=stamina_effect, intent=intent, state=ns_antoc_body_state.MOVE_FORWARD, fallback_action_stamina_effect=ns_common_stamina_effect.MOVE_FORWARD);
    return();
}

func assert_fatigue_effect_move_backward{range_check_ptr}(stamina_effect : felt, intent : felt){
    assert_fatigue_effect(stamina_effect=stamina_effect, intent=intent, state=ns_antoc_body_state.MOVE_BACKWARD,  fallback_action_stamina_effect=ns_common_stamina_effect.MOVE_BACKWARD);
    return();
}

func assert_fatigue_effect_hori{range_check_ptr}(stamina_effect : felt, intent : felt){
    alloc_locals;
    let stamina = stamina_effect - 1;
    tempvar body_state = BodyState(ns_antoc_body_state.HORI, ns_antoc_body_state_duration.HORI - 1, 1000, stamina, 0, FALSE);
    let stimulus = ns_stimulus.NULL;
    let (body_state_nxt) = _body_antoc(body_state = body_state, stimulus = stimulus, intent = intent);

    assert body_state_nxt.state = ns_antoc_body_state.IDLE;
    assert body_state_nxt.integrity = body_state.integrity;
    assert body_state_nxt.stamina = body_state.stamina;
    assert body_state_nxt.dir = body_state.dir;
    assert body_state_nxt.fatigued = TRUE;
    assert body_state_nxt.counter = 0;

    return();
}

func assert_vert_fatigue{range_check_ptr}(body_state_nxt : BodyState, body_state : BodyState) {
    assert body_state_nxt.state = ns_antoc_body_state.VERT;
    assert body_state_nxt.integrity = body_state.integrity;
    assert body_state_nxt.stamina = body_state.stamina;
    assert body_state_nxt.dir = body_state.dir;
    assert body_state_nxt.fatigued = TRUE;
    assert body_state_nxt.counter = body_state.counter + 1;
    return();
}


// Every antioc intent is interruptible by a hurt or knocked stimulus, includes hurt
@external
func test_body_antoc_idle_fatigue{
    syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr, bitwise_ptr: BitwiseBuiltin*
}() {
    alloc_locals;    
    assert_fatigue_effect_idle(ns_antoc_stamina_effect.HORI, ns_antoc_action.HORI);
    assert_fatigue_effect_idle(ns_antoc_stamina_effect.VERT, ns_antoc_action.VERT);
    assert_fatigue_effect_idle(ns_common_stamina_effect.DASH_FORWARD, ns_antoc_action.DASH_FORWARD);
    assert_fatigue_effect_idle(ns_common_stamina_effect.DASH_BACKWARD, ns_antoc_action.DASH_BACKWARD);
    return();

}


@external
func test_body_antoc_move_forward_fatigue{
    syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr, bitwise_ptr: BitwiseBuiltin*
}() {
    alloc_locals;    
    assert_fatigue_effect_move_forward(ns_antoc_stamina_effect.HORI, ns_antoc_action.HORI);
    assert_fatigue_effect_move_forward(ns_antoc_stamina_effect.VERT, ns_antoc_action.VERT);
    assert_fatigue_effect_move_forward(ns_common_stamina_effect.DASH_FORWARD, ns_antoc_action.DASH_FORWARD);
    assert_fatigue_effect_move_forward(ns_common_stamina_effect.DASH_BACKWARD, ns_antoc_action.DASH_BACKWARD);
    return();

}

@external
func test_body_antoc_move_backward_fatigue{
    syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr, bitwise_ptr: BitwiseBuiltin*
}() {
    alloc_locals;    
    assert_fatigue_effect_move_backward(ns_antoc_stamina_effect.HORI, ns_antoc_action.HORI);
    assert_fatigue_effect_move_backward(ns_antoc_stamina_effect.VERT, ns_antoc_action.VERT);
    assert_fatigue_effect_move_backward(ns_common_stamina_effect.DASH_FORWARD, ns_antoc_action.DASH_FORWARD);
    assert_fatigue_effect_move_backward(ns_common_stamina_effect.DASH_BACKWARD, ns_antoc_action.DASH_BACKWARD);
    return();
}


@external
func test_body_antoc_hori_fatigue{
    syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr, bitwise_ptr: BitwiseBuiltin*
}() {
    alloc_locals;    
    assert_fatigue_effect_hori(ns_antoc_stamina_effect.HORI, ns_antoc_action.HORI);
    return();
}


@external
func test_body_antoc_vert_fatigue{
    syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr, bitwise_ptr: BitwiseBuiltin*
}() {
    alloc_locals;
    // Testing fatigue in the 3 frames of VERT which we can perform HORI
    let stamina = ns_antoc_stamina_effect.HORI - 1;
    let intent = ns_antoc_action.HORI;
    tempvar body_state = BodyState(ns_antoc_body_state.VERT, ns_antoc_body_state_duration.VERT - 7, 1000, stamina, 0, FALSE);
    let stimulus = ns_stimulus.NULL;
    let (body_state_nxt) = _body_antoc(body_state = body_state, stimulus = stimulus, intent = intent);

    assert_vert_fatigue(body_state_nxt, body_state);

    tempvar body_state = BodyState(ns_antoc_body_state.VERT, ns_antoc_body_state_duration.VERT - 8, 1000, stamina, 0, FALSE);
    let stimulus = ns_stimulus.NULL;
    let (body_state_nxt) = _body_antoc(body_state = body_state, stimulus = stimulus, intent = intent);

    assert_vert_fatigue(body_state_nxt, body_state);

    tempvar body_state = BodyState(ns_antoc_body_state.VERT, ns_antoc_body_state_duration.VERT - 9, 1000, stamina, 0, FALSE);
    let stimulus = ns_stimulus.NULL;
    let (body_state_nxt) = _body_antoc(body_state = body_state, stimulus = stimulus, intent = intent);

    assert_vert_fatigue(body_state_nxt, body_state);
    
    // Testing fatigue when attempting additional VERT in last frame of VERT
    let stamina = ns_antoc_stamina_effect.VERT - 1;
    let intent = ns_antoc_action.VERT;
    tempvar body_state = BodyState(ns_antoc_body_state.VERT, ns_antoc_body_state_duration.VERT - 1, 1000, stamina, 0, FALSE);
    let stimulus = ns_stimulus.NULL;
    let (body_state_nxt) = _body_antoc(body_state = body_state, stimulus = stimulus, intent = intent);

    assert body_state_nxt.state = ns_antoc_body_state.IDLE;
    assert body_state_nxt.integrity = body_state.integrity;
    assert body_state_nxt.stamina = body_state.stamina;
    assert body_state_nxt.dir = body_state.dir;
    assert body_state_nxt.fatigued = TRUE;
    assert body_state_nxt.counter = 0;

    return();
}

@external
func test_body_antoc_dash_forward_fatigue{
    syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr, bitwise_ptr: BitwiseBuiltin*
}() {
    alloc_locals;
    // Testing fatigue in the 3 frames of VERT which we can perform HORI
    let stamina = ns_common_stamina_effect.DASH_FORWARD - 1;
    let intent = ns_antoc_action.DASH_FORWARD;
    tempvar body_state = BodyState(ns_antoc_body_state.DASH_FORWARD, ns_antoc_body_state_duration.DASH_FORWARD - 1, 1000, stamina, 0, FALSE);
    let stimulus = ns_stimulus.NULL;
    let (body_state_nxt) = _body_antoc(body_state = body_state, stimulus = stimulus, intent = intent);

    
    assert body_state_nxt.state = ns_antoc_body_state.IDLE;
    assert body_state_nxt.integrity = body_state.integrity;
    assert body_state_nxt.stamina = body_state.stamina;
    assert body_state_nxt.dir = body_state.dir;
    assert body_state_nxt.fatigued = TRUE;
    assert body_state_nxt.counter = 0;

    return();
}


@external
func test_body_antoc_dash_backward_fatigue{
    syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr, bitwise_ptr: BitwiseBuiltin*
}() {
    alloc_locals;
    // Testing fatigue in the 3 frames of VERT which we can perform HORI
    let stamina = ns_common_stamina_effect.DASH_BACKWARD - 1;
    let intent = ns_antoc_action.DASH_BACKWARD;
    tempvar body_state = BodyState(ns_antoc_body_state.DASH_BACKWARD, ns_antoc_body_state_duration.DASH_BACKWARD - 1, 1000, stamina, 0, FALSE);
    let stimulus = ns_stimulus.NULL;
    let (body_state_nxt) = _body_antoc(body_state = body_state, stimulus = stimulus, intent = intent);

    
    assert body_state_nxt.state = ns_antoc_body_state.IDLE;
    assert body_state_nxt.integrity = body_state.integrity;
    assert body_state_nxt.stamina = body_state.stamina;
    assert body_state_nxt.dir = body_state.dir;
    assert body_state_nxt.fatigued = TRUE;
    assert body_state_nxt.counter = 0;

    return();
}