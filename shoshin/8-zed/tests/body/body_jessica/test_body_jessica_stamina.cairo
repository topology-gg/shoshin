%lang starknet
from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.cairo_builtins import BitwiseBuiltin
from starkware.cairo.common.bool import (TRUE, FALSE)
from contracts.constants.constants_jessica import (ns_jessica_action, ns_jessica_body_state, ns_jessica_stamina_effect, ns_jessica_body_state_duration)
from contracts.constants.constants import (BodyState, ns_stimulus, HURT_EFFECT, KNOCKED_EFFECT, ns_common_stamina_effect)
from contracts.body.body_jessica import _body_jessica


func assert_fatigue_effect{range_check_ptr}(stamina_effect : felt, intent : felt, state : felt, fallback_action_stamina_effect : felt){
    alloc_locals;
    let stamina = stamina_effect - 1;
    tempvar body_state = BodyState(state, 0, 1000, stamina, 0, FALSE);
    
    let stimulus = ns_stimulus.NULL;
    let (body_state_nxt) = _body_jessica(body_state = body_state, stimulus = stimulus, intent = intent);

    assert body_state_nxt.state = body_state.state;
    assert body_state_nxt.integrity = body_state.integrity;
    assert body_state_nxt.stamina = body_state.stamina + fallback_action_stamina_effect;
    assert body_state_nxt.dir = body_state.dir;
    assert body_state_nxt.fatigued = TRUE;
    assert body_state_nxt.counter = body_state.counter + 1;
    

    return();
}
func assert_fatigue_effect_idle{range_check_ptr}(stamina_effect : felt, intent : felt){
    assert_fatigue_effect(stamina_effect, intent, ns_jessica_body_state.IDLE, ns_common_stamina_effect.NULL);
    return();
}

func assert_fatigue_effect_move_forward_or_backward{range_check_ptr}(stamina_effect : felt, intent : felt, state : felt, fallback_action_stamina_effect : felt){
    alloc_locals;
    let stamina = stamina_effect - 1;
    tempvar body_state = BodyState(state, 0, 1000, stamina, 0, FALSE);

    let stimulus = ns_stimulus.NULL;
    let (body_state_nxt) = _body_jessica(body_state = body_state, stimulus = stimulus, intent = intent);

    assert body_state_nxt.state = ns_jessica_body_state.IDLE;
    assert body_state_nxt.integrity = body_state.integrity;
    assert body_state_nxt.stamina = body_state.stamina + fallback_action_stamina_effect;
    assert body_state_nxt.dir = body_state.dir;
    assert body_state_nxt.fatigued = TRUE;
    assert body_state_nxt.counter = 0;
    
    return();
}


func assert_fatigue_effect_move_forward{range_check_ptr}(stamina_effect : felt, intent : felt){
    assert_fatigue_effect_move_forward_or_backward(stamina_effect=stamina_effect, intent=intent, state=ns_jessica_body_state.MOVE_FORWARD,  fallback_action_stamina_effect=ns_common_stamina_effect.MOVE_FORWARD);
    return();
}

func assert_fatigue_effect_move_backward{range_check_ptr}(stamina_effect : felt, intent : felt){
    assert_fatigue_effect_move_forward_or_backward(stamina_effect=stamina_effect, intent=intent, state=ns_jessica_body_state.MOVE_BACKWARD,  fallback_action_stamina_effect=ns_common_stamina_effect.MOVE_BACKWARD);
    return();
}

func assert_fatigue_effect_slash{range_check_ptr}(stamina_effect : felt, intent : felt){
    alloc_locals;
    let stamina = stamina_effect - 1;
    tempvar body_state = BodyState(ns_jessica_body_state.SLASH, ns_jessica_body_state_duration.SLASH - 1, 1000, stamina, 0, FALSE);
    let stimulus = ns_stimulus.NULL;
    let (body_state_nxt) = _body_jessica(body_state = body_state, stimulus = stimulus, intent = intent);

    assert body_state_nxt.state = ns_jessica_body_state.IDLE;
    assert body_state_nxt.integrity = body_state.integrity;
    assert body_state_nxt.stamina = body_state.stamina;
    assert body_state_nxt.dir = body_state.dir;
    assert body_state_nxt.fatigued = TRUE;
    assert body_state_nxt.counter = 0;

    return();
}

func assert_upswing_fatigue{range_check_ptr}(body_state_nxt : BodyState, body_state : BodyState) {
    assert body_state_nxt.state = ns_jessica_body_state.IDLE;
    assert body_state_nxt.integrity = body_state.integrity;
    assert body_state_nxt.stamina = body_state.stamina;
    assert body_state_nxt.dir = body_state.dir;
    assert body_state_nxt.fatigued = TRUE;
    assert body_state_nxt.counter = 0;
    return();
}


// Every jessica intent is interruptible by a hurt or knocked stimulus, includes hurt
@external
func test_body_jessica_idle_fatigue{
    syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr, bitwise_ptr: BitwiseBuiltin*
}() {
    alloc_locals;    
    assert_fatigue_effect_idle(ns_jessica_stamina_effect.SLASH, ns_jessica_action.SLASH);
    assert_fatigue_effect_idle(ns_jessica_stamina_effect.UPSWING, ns_jessica_action.UPSWING);
    assert_fatigue_effect_idle(ns_jessica_stamina_effect.SIDECUT, ns_jessica_action.SIDECUT);
    assert_fatigue_effect_idle(ns_common_stamina_effect.DASH_FORWARD, ns_jessica_action.DASH_FORWARD);
    assert_fatigue_effect_idle(ns_common_stamina_effect.DASH_BACKWARD, ns_jessica_action.DASH_BACKWARD);
    return();

}


@external
func test_body_jessica_move_forward_fatigue{
    syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr, bitwise_ptr: BitwiseBuiltin*
}() {
    alloc_locals;    
    assert_fatigue_effect_move_forward(ns_jessica_stamina_effect.SLASH, ns_jessica_action.SLASH);
    assert_fatigue_effect_move_forward(ns_jessica_stamina_effect.UPSWING, ns_jessica_action.UPSWING);
    assert_fatigue_effect_move_forward(ns_jessica_stamina_effect.SIDECUT, ns_jessica_action.SIDECUT);
    assert_fatigue_effect_move_forward(ns_common_stamina_effect.DASH_FORWARD, ns_jessica_action.DASH_FORWARD);
    assert_fatigue_effect_move_forward(ns_common_stamina_effect.DASH_BACKWARD, ns_jessica_action.DASH_BACKWARD);
    return();

}

@external
func test_body_jessica_move_backward_fatigue{
    syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr, bitwise_ptr: BitwiseBuiltin*
}() {
    alloc_locals;    
    assert_fatigue_effect_move_backward(ns_jessica_stamina_effect.SLASH, ns_jessica_action.SLASH);
    assert_fatigue_effect_move_backward(ns_jessica_stamina_effect.UPSWING, ns_jessica_action.UPSWING);
    assert_fatigue_effect_move_backward(ns_jessica_stamina_effect.SIDECUT, ns_jessica_action.SIDECUT);
    assert_fatigue_effect_move_backward(ns_common_stamina_effect.DASH_FORWARD, ns_jessica_action.DASH_FORWARD);
    assert_fatigue_effect_move_backward(ns_common_stamina_effect.DASH_BACKWARD, ns_jessica_action.DASH_BACKWARD);
    return();
}


@external
func test_body_jessica_slash_fatigue{
    syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr, bitwise_ptr: BitwiseBuiltin*
}() {
    alloc_locals;    
    assert_fatigue_effect_slash(ns_jessica_stamina_effect.SLASH, ns_jessica_action.SLASH);
    return();
}


@external
func test_body_jessica_upswing_fatigue{
    syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr, bitwise_ptr: BitwiseBuiltin*
}() {
    alloc_locals;
    // Testing fatigue in the 3 frames of VERT which we can perform HORI
    let stamina = ns_jessica_stamina_effect.UPSWING - 1;
    let intent = ns_jessica_action.UPSWING;
    tempvar body_state = BodyState(ns_jessica_body_state.UPSWING, ns_jessica_body_state_duration.UPSWING - 1, 1000, stamina, 0, FALSE);
    let stimulus = ns_stimulus.NULL;
    let (body_state_nxt) = _body_jessica(body_state = body_state, stimulus = stimulus, intent = intent);

    assert_upswing_fatigue(body_state_nxt, body_state);

    return();
}

@external
func test_body_jessica_dash_forward_fatigue{
    syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr, bitwise_ptr: BitwiseBuiltin*
}() {
    alloc_locals;
    let stamina = ns_common_stamina_effect.DASH_FORWARD - 1;
    let intent = ns_jessica_action.DASH_FORWARD;
    tempvar body_state = BodyState(ns_jessica_body_state.DASH_FORWARD, ns_jessica_body_state_duration.DASH_FORWARD - 1, 1000, stamina, 0, FALSE);
    let stimulus = ns_stimulus.NULL;
    let (body_state_nxt) = _body_jessica(body_state = body_state, stimulus = stimulus, intent = intent);

    
    assert body_state_nxt.state = ns_jessica_body_state.IDLE;
    assert body_state_nxt.integrity = body_state.integrity;
    assert body_state_nxt.stamina = body_state.stamina;
    assert body_state_nxt.dir = body_state.dir;
    assert body_state_nxt.fatigued = TRUE;
    assert body_state_nxt.counter = 0;

    return();
}


@external
func test_body_jessica_dash_backward_fatigue{
    syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr, bitwise_ptr: BitwiseBuiltin*
}() {
    alloc_locals;
    // Testing fatigue in the 3 frames of VERT which we can perform HORI
    let stamina = ns_common_stamina_effect.DASH_BACKWARD - 1;
    let intent = ns_jessica_action.DASH_BACKWARD;
    tempvar body_state = BodyState(ns_jessica_body_state.DASH_BACKWARD, ns_jessica_body_state_duration.DASH_BACKWARD - 1, 1000, stamina, 0, FALSE);
    let stimulus = ns_stimulus.NULL;
    let (body_state_nxt) = _body_jessica(body_state = body_state, stimulus = stimulus, intent = intent);

    
    assert body_state_nxt.state = ns_jessica_body_state.IDLE;
    assert body_state_nxt.integrity = body_state.integrity;
    assert body_state_nxt.stamina = body_state.stamina;
    assert body_state_nxt.dir = body_state.dir;
    assert body_state_nxt.fatigued = TRUE;
    assert body_state_nxt.counter = 0;

    return();
}