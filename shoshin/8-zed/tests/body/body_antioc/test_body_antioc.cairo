%lang starknet
from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.cairo_builtins import BitwiseBuiltin
from starkware.cairo.common.bool import (TRUE, FALSE)
from contracts.constants.constants_antoc import (ns_antoc_action, ns_antoc_body_state)
from contracts.constants.constants import (BodyState, ns_stimulus, HURT_EFFECT, KNOCKED_EFFECT)
from contracts.body.body_antoc import _body_antoc



func assert_body_states_eq(a : BodyState, b : BodyState){
    assert a.state = b.state;
    assert a.counter = b.counter;
    assert a.integrity = b.integrity;
    assert a.stamina = b.stamina;
    assert a.dir = b.dir;
    assert a.fatigued = b.fatigued;

    return();
}

@external
func test_body_antoc_vanilla{
    syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr, bitwise_ptr: BitwiseBuiltin*
}() {
    alloc_locals;
    tempvar body_state = BodyState(ns_antoc_body_state.IDLE, 0, 1000, 1000, 0, FALSE);
    let stimulus = ns_stimulus.NULL;
    let intent = ns_antoc_action.NULL;

    let (body_state_nxt) = _body_antoc(body_state = body_state, stimulus = stimulus, intent = intent);

    assert body_state_nxt.state = body_state.state;
    assert body_state_nxt.counter = body_state.counter + 1;
    assert body_state_nxt.integrity = body_state.integrity;
    assert body_state_nxt.stamina = body_state.stamina;
    assert body_state_nxt.dir = body_state.dir;
    assert body_state_nxt.fatigued = body_state.fatigued;

    return ();
}



// Every antioc intent is interupable by a hurt or knocked stimulus
@external
func test_body_antoc_idle_hurt{
    syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr, bitwise_ptr: BitwiseBuiltin*
}() {
    alloc_locals;
    tempvar body_state = BodyState(ns_antoc_body_state.IDLE, 0, 1000, 1000, 0, FALSE);
    let stimulus = ns_stimulus.HURT;
    let intent = ns_antoc_action.NULL;

    let (body_state_nxt) = _body_antoc(body_state = body_state, stimulus = stimulus, intent = intent);

    assert body_state_nxt.state = ns_antoc_body_state.HURT;
    assert body_state_nxt.counter = 0;
    assert body_state_nxt.integrity = body_state.integrity - HURT_EFFECT;
    assert body_state_nxt.stamina = body_state.stamina;
    assert body_state_nxt.dir = body_state.dir;
    assert body_state_nxt.fatigued = body_state.fatigued;

    return ();
}

@external
func test_body_antoc_idle_knocked{
    syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr, bitwise_ptr: BitwiseBuiltin*
}() {
    alloc_locals;
    tempvar body_state = BodyState(ns_antoc_body_state.IDLE, 0, 1000, 1000, 0, FALSE);
    let stimulus = ns_stimulus.KNOCKED;
    let intent = ns_antoc_action.NULL;

    let (body_state_nxt) = _body_antoc(body_state = body_state, stimulus = stimulus, intent = intent);

    assert body_state_nxt.state = ns_antoc_body_state.KNOCKED;
    assert body_state_nxt.counter = 0;
    assert body_state_nxt.integrity = body_state.integrity - HURT_EFFECT;
    assert body_state_nxt.stamina = body_state.stamina;
    assert body_state_nxt.dir = body_state.dir;
    assert body_state_nxt.fatigued = body_state.fatigued;

    return ();
}