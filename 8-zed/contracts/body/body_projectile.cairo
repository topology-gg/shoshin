%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.bool import (TRUE, FALSE)
from starkware.cairo.common.math import unsigned_div_rem
from starkware.cairo.common.math_cmp import is_le, is_nn_le, is_not_zero
from contracts.constants.constants import (
    BodyState, ns_stimulus, ns_stamina, ns_character_type, HURT_EFFECT, KNOCKED_EFFECT, CLASH_EFFECT
)
from contracts.constants.constants_projectile import (
    ns_projectile_body_state, ns_projectile_body_state_duration, ns_jessica_body_state_qualifiers
)
from contracts.body.body_utils import (
    calculate_integrity_change, calculate_stamina_change
)
//
// Projectile's Body State Diagram
//
func _body_projectile {range_check_ptr}(
        body_state: BodyState,
        stimulus: felt,
        opponent_body_state_index: felt,
    ) -> (
        body_state_nxt: BodyState
) {
    alloc_locals;

    // Unpack stats
    let state = body_state.state;
    let counter = body_state.counter;
    let integrity = body_state.integrity;
    let stamina = body_state.stamina;
    let dir = body_state.dir;
    let state_index = body_state.state_index;
    let opponent_state_index_last_hit = body_state.opponent_state_index_last_hit;

    // Decode stimulus
    let (stimulus_type, stimulus_damage) = unsigned_div_rem (stimulus, ns_stimulus.ENCODING);

    // Check if opponent's state_index has progressed from opponent_state_index_last_hit;
    // for preventing incorrectly registering more than one hit per attack move
    let opponent_state_index_has_progressed = is_not_zero (opponent_body_state_index - opponent_state_index_last_hit);

    with_attr error_message("Input body state is not recognized.") {
        assert 0 = 1;
    }
    return ( body_state_nxt = BodyState(0,0,0,0,0,0,0,0) );
}
