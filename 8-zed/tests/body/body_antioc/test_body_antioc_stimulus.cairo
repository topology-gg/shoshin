%lang starknet
from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.cairo_builtins import BitwiseBuiltin
from starkware.cairo.common.bool import (TRUE, FALSE)
from contracts.constants.constants_antoc import (ns_antoc_action, ns_antoc_body_state)
from contracts.constants.constants import (BodyState, ns_stimulus, HURT_EFFECT, KNOCKED_EFFECT)
from contracts.body.body_antoc import _body_antoc



func assert_body_effected(a : BodyState, b : BodyState, stimulus : felt){
    if(stimulus ==  ns_stimulus.HURT){
        assert a.state = ns_antoc_body_state.HURT;
    } else {
        assert a.state = ns_antoc_body_state.KNOCKED;
    }
    assert a.counter = 0;
    if(stimulus ==  ns_stimulus.HURT){
        assert a.integrity = b.integrity - HURT_EFFECT;
    } else {
        assert a.integrity = b.integrity - KNOCKED_EFFECT;
    }
    assert a.stamina = b.stamina;
    assert a.dir = b.dir;
    assert a.fatigued = b.fatigued;
    assert a.counter = 0;

    return();
}

func assert_body_uneffected(a : BodyState, b : BodyState){
    assert a.state = b.state;
    assert a.counter = b.counter + 1;
    assert a.integrity = b.integrity;
    assert a.stamina = b.stamina;
    assert a.dir = b.dir;
    assert a.fatigued = b.fatigued;

    return();
}

// Every antoc intent is interruptible by a hurt or knocked stimulus, includes hurt
@external
func test_body_antoc_hurt{
    syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr, bitwise_ptr: BitwiseBuiltin*
}() {
    alloc_locals;
    tempvar body_state = BodyState(ns_antoc_body_state.IDLE, 0, 1000, 1000, 0, FALSE);
    let stimulus = ns_stimulus.HURT;
    let intent = ns_antoc_action.NULL;

    // idle
    let (body_state_nxt) = _body_antoc(body_state = body_state, stimulus = stimulus, intent = intent);
    assert_body_effected(body_state_nxt, body_state, stimulus);

    // hori
    tempvar body_state = BodyState(ns_antoc_body_state.HORI, 0, 1000, 1000, 0, FALSE);
    let (body_state_nxt) = _body_antoc(body_state = body_state, stimulus = stimulus, intent = intent);
    assert_body_effected(body_state_nxt, body_state, stimulus);

    // vert
    tempvar body_state = BodyState(ns_antoc_body_state.VERT, 0, 1000, 1000, 0, FALSE);
    let (body_state_nxt) = _body_antoc(body_state = body_state, stimulus = stimulus, intent = intent);
    assert_body_effected(body_state_nxt, body_state, stimulus);

    // block
    tempvar body_state = BodyState(ns_antoc_body_state.BLOCK, 0, 1000, 1000, 0, FALSE);
    let (body_state_nxt) = _body_antoc(body_state = body_state, stimulus = stimulus, intent = intent);
    assert_body_effected(body_state_nxt, body_state, stimulus);

    // hurt
    tempvar body_state = BodyState(ns_antoc_body_state.HURT, 0, 1000, 1000, 0, FALSE);
    let (body_state_nxt) = _body_antoc(body_state = body_state, stimulus = stimulus, intent = intent);
    assert_body_effected(body_state_nxt, body_state, stimulus);

    // move forward
    tempvar body_state = BodyState(ns_antoc_body_state.MOVE_FORWARD, 0, 1000, 1000, 0, FALSE);
    let (body_state_nxt) = _body_antoc(body_state = body_state, stimulus = stimulus, intent = intent);
    assert_body_effected(body_state_nxt, body_state, stimulus);

    // move backward
    tempvar body_state = BodyState(ns_antoc_body_state.MOVE_BACKWARD, 0, 1000, 1000, 0, FALSE);
    let (body_state_nxt) = _body_antoc(body_state = body_state, stimulus = stimulus, intent = intent);
    assert_body_effected(body_state_nxt, body_state, stimulus);

    return ();
}

// Knocked antoc's should remain knocked when hurt
@external
func test_body_antoc_knocked_hurt{
    syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr, bitwise_ptr: BitwiseBuiltin*
}() {
    alloc_locals;
    tempvar body_state = BodyState(ns_antoc_body_state.KNOCKED, 0, 1000, 1000, 0, FALSE);
    let stimulus = ns_stimulus.HURT;
    let intent = ns_antoc_action.NULL;
    
    let (body_state_nxt) = _body_antoc(body_state = body_state, stimulus = stimulus, intent = intent);

    assert body_state_nxt.state = ns_antoc_body_state.KNOCKED;
    assert body_state_nxt.integrity = body_state.integrity - KNOCKED_EFFECT;
    assert body_state_nxt.stamina = body_state.stamina;
    assert body_state_nxt.dir = body_state.dir;
    assert body_state_nxt.fatigued = body_state.fatigued;
    assert body_state_nxt.counter = 3;

    return();
}

@external
func test_body_antoc_dash_hurt{
    syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr, bitwise_ptr: BitwiseBuiltin*
}() {
    alloc_locals;
    let stimulus = ns_stimulus.HURT;
   
    // dash forward
    tempvar body_state = BodyState(ns_antoc_body_state.DASH_FORWARD, 0, 1000, 1000, 0, FALSE);
    let (body_state_nxt) = _body_antoc(body_state = body_state, stimulus = stimulus, intent = ns_antoc_action.DASH_FORWARD);
    assert_body_uneffected(body_state_nxt, body_state);

    // dash backward
    tempvar body_state = BodyState(ns_antoc_body_state.DASH_BACKWARD, 0, 1000, 1000, 0, FALSE);
    let (body_state_nxt) = _body_antoc(body_state = body_state, stimulus = stimulus, intent = ns_antoc_action.DASH_BACKWARD);
    assert_body_uneffected(body_state_nxt, body_state);


    return();
}

@external
func test_body_antoc_idle_knocked{
    syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr, bitwise_ptr: BitwiseBuiltin*
}() {
    alloc_locals;
    tempvar body_state = BodyState(ns_antoc_body_state.IDLE, 0, 1000, 1000, 0, FALSE);
    let stimulus = ns_stimulus.KNOCKED;
    let intent = ns_antoc_action.NULL;

    // idle
    let (body_state_nxt) = _body_antoc(body_state = body_state, stimulus = stimulus, intent = intent);
    assert_body_effected(body_state_nxt, body_state, stimulus);

    // hori
    tempvar body_state = BodyState(ns_antoc_body_state.HORI, 0, 1000, 1000, 0, FALSE);
    let (body_state_nxt) = _body_antoc(body_state = body_state, stimulus = stimulus, intent = intent);
    assert_body_effected(body_state_nxt, body_state, stimulus);

    // vert
    tempvar body_state = BodyState(ns_antoc_body_state.VERT, 0, 1000, 1000, 0, FALSE);
    let (body_state_nxt) = _body_antoc(body_state = body_state, stimulus = stimulus, intent = intent);
    assert_body_effected(body_state_nxt, body_state, stimulus);

    // block
    tempvar body_state = BodyState(ns_antoc_body_state.BLOCK, 0, 1000, 1000, 0, FALSE);
    let (body_state_nxt) = _body_antoc(body_state = body_state, stimulus = stimulus, intent = intent);
    assert_body_effected(body_state_nxt, body_state, stimulus);

    // hurt
    tempvar body_state = BodyState(ns_antoc_body_state.HURT, 0, 1000, 1000, 0, FALSE);
    let (body_state_nxt) = _body_antoc(body_state = body_state, stimulus = stimulus, intent = intent);
    assert_body_effected(body_state_nxt, body_state, stimulus);

    // move forward
    tempvar body_state = BodyState(ns_antoc_body_state.MOVE_FORWARD, 0, 1000, 1000, 0, FALSE);
    let (body_state_nxt) = _body_antoc(body_state = body_state, stimulus = stimulus, intent = intent);
    assert_body_effected(body_state_nxt, body_state, stimulus);

    // move backward
    tempvar body_state = BodyState(ns_antoc_body_state.MOVE_BACKWARD, 0, 1000, 1000, 0, FALSE);
    let (body_state_nxt) = _body_antoc(body_state = body_state, stimulus = stimulus, intent = intent);
    assert_body_effected(body_state_nxt, body_state, stimulus);

    return ();
}

// Knocked antoc's should remain knocked when hurt
@external
func test_body_antoc_knocked_knocked{
    syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr, bitwise_ptr: BitwiseBuiltin*
}() {
    alloc_locals;
    tempvar body_state = BodyState(ns_antoc_body_state.KNOCKED, 0, 1000, 1000, 0, FALSE);
    let stimulus = ns_stimulus.HURT;
    let intent = ns_antoc_action.NULL;
    
    let (body_state_nxt) = _body_antoc(body_state = body_state, stimulus = stimulus, intent = intent);

    assert body_state_nxt.state = ns_antoc_body_state.KNOCKED;
    assert body_state_nxt.integrity = body_state.integrity - KNOCKED_EFFECT;
    assert body_state_nxt.stamina = body_state.stamina;
    assert body_state_nxt.dir = body_state.dir;
    assert body_state_nxt.fatigued = body_state.fatigued;
    assert body_state_nxt.counter = 3;

    return();
}

@external
func test_body_antoc_dash_knocked{
    syscall_ptr: felt*, pedersen_ptr: HashBuiltin*, range_check_ptr, bitwise_ptr: BitwiseBuiltin*
}() {
    alloc_locals;
    let stimulus = ns_stimulus.HURT;
   
    // dash forward
    tempvar body_state = BodyState(ns_antoc_body_state.DASH_FORWARD, 0, 1000, 1000, 0, FALSE);
    let (body_state_nxt) = _body_antoc(body_state = body_state, stimulus = stimulus, intent = ns_antoc_action.DASH_FORWARD);
    assert_body_uneffected(body_state_nxt, body_state);

    // dash backward
    tempvar body_state = BodyState(ns_antoc_body_state.DASH_BACKWARD, 0, 1000, 1000, 0, FALSE);
    let (body_state_nxt) = _body_antoc(body_state = body_state, stimulus = stimulus, intent = ns_antoc_action.DASH_BACKWARD);
    assert_body_uneffected(body_state_nxt, body_state);


    return();
}