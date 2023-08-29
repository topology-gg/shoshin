%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from contracts.constants.constants import (
    ns_character_type, BodyState, FireCommand
)
from contracts.body.body_jessica import _body_jessica
from contracts.body.body_antoc import _body_antoc

func _body{range_check_ptr}(
        character_type: felt,
        body_state: BodyState,
        stimulus: felt,
        intent: felt,
        opponent_body_state_index: felt,
    ) -> (
        fire_command: FireCommand,
        body_state_nxt: BodyState,
) {
    if (character_type == ns_character_type.JESSICA) {
        return _body_jessica (body_state, stimulus, intent, opponent_body_state_index);
    }
    if (character_type == ns_character_type.ANTOC) {
        return _body_antoc (body_state, stimulus, intent, opponent_body_state_index);
    }

    with_attr error_message("Character type is not recognized.") {
        assert 0 = 1;
    }
    return ( fire_command = FireCommand(0,0), body_state_nxt = BodyState(0,0,0,0,0,0,0,0) );
}
