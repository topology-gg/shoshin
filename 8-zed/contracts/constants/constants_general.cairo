%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from contracts.constants.constants import (
    ns_dynamics, Vec2, Rectangle, ns_hitbox, ns_scene, LEFT, RIGHT
)
from contracts.constants.constants_antoc import (
    ns_antoc_body_state
)
from contracts.constants.constants_jessica import (
    ns_jessica_body_state
)

func should_nudge_body_state {range_check_ptr}(
    state: felt
) -> (
    should_nudge: felt,
    counter_to_nudge: felt,
){
    alloc_locals;

    // Antoc: hori, vert, lowkick
    if (state == ns_antoc_body_state.HORI) {
        return (1,1);
    }
    if (state == ns_antoc_body_state.VERT) {
        return (1,3);
    }
    if (state == ns_antoc_body_state.LOW_KICK) {
        return (1,3);
    }

    // Jessica: slash, upswing, sidecut, lowkick
    if (state == ns_jessica_body_state.SLASH) {
        return (1,2);
    }
    if (state == ns_jessica_body_state.UPSWING) {
        return (1,2);
    }
    if (state == ns_jessica_body_state.SIDECUT) {
        return (1,2);
    }
    if (state == ns_jessica_body_state.LOW_KICK) {
        return (1,3);
    }

    return (0,0);
}
