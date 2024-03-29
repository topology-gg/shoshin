%lang starknet

from starkware.cairo.common.math_cmp import (is_le, is_nn)
from starkware.cairo.common.bool import (TRUE, FALSE)
from contracts.constants.constants import (ns_common_stamina_effect, ns_stamina, ns_character_type)
from contracts.constants.constants_antoc import (ns_antoc_stamina_effect, ns_antoc_action, ns_antoc_body_state, ns_antoc_body_state_duration, antoc_active_body_state_duration_lookup)
from contracts.constants.constants_jessica import (ns_jessica_stamina_effect, ns_jessica_action, ns_jessica_body_state, ns_jessica_body_state_duration, jessica_active_body_state_duration_lookup)

func player_lost {range_check_ptr} (
    character_type: felt,
    body_state: felt,
    body_counter: felt,
) -> felt {
    // Jessica
    if (character_type == ns_character_type.JESSICA and body_state == ns_jessica_body_state.KO and body_counter == ns_jessica_body_state_duration.KO - 1) {
        return 1;
    }

    // Antoc
    if (character_type == ns_character_type.ANTOC and body_state == ns_antoc_body_state.KO and body_counter == ns_antoc_body_state_duration.KO - 1) {
        return 1;
    }

    return 0;
}

func calculate_integrity_change{range_check_ptr}(integrity: felt, damage: felt) -> felt {
    let new_integrity = integrity - damage;
    let bool_le_0 = is_le (new_integrity, 0);
    if (bool_le_0 == 1) {
        return 0;
    } else {
        return new_integrity;
    }
}

func calculate_default_stamina{range_check_ptr}(stamina : felt, character_type : felt) -> felt {
    if (character_type == ns_character_type.JESSICA) {
        let (updated_stamina_default_recovery, _) = _settle_stamina_change(stamina, ns_common_stamina_effect.NULL, ns_stamina.MAX_STAMINA);
        return updated_stamina_default_recovery;

    } else {
        let ( updated_stamina_default_recovery, _ ) = _settle_stamina_change(stamina, ns_common_stamina_effect.NULL, ns_stamina.MAX_STAMINA);
        return updated_stamina_default_recovery;
    }
}

func calculate_stamina_change{range_check_ptr}(stamina : felt, intent : felt, max_stamina : felt, character_type : felt) -> (felt, felt) {


        if (character_type == ns_character_type.JESSICA) {
            if (intent == ns_jessica_action.SLASH){
                let (updated_stamina, enough_stamina) = _settle_stamina_change(stamina, ns_jessica_stamina_effect.SLASH, max_stamina);
                return (updated_stamina, enough_stamina);
            }
            if (intent == ns_jessica_action.UPSWING){
                let (updated_stamina, enough_stamina) = _settle_stamina_change(stamina, ns_jessica_stamina_effect.UPSWING, max_stamina);
                return (updated_stamina, enough_stamina);
            }
            if (intent == ns_jessica_action.SIDECUT){
                let (updated_stamina, enough_stamina) = _settle_stamina_change(stamina, ns_jessica_stamina_effect.SIDECUT, max_stamina);
                return (updated_stamina, enough_stamina);
            }
            if (intent == ns_jessica_action.LOW_KICK){
                let (updated_stamina, enough_stamina) = _settle_stamina_change(stamina, ns_jessica_stamina_effect.LOW_KICK, max_stamina);
                return (updated_stamina, enough_stamina);
            }
            if (intent == ns_jessica_action.BLOCK) {
                let (updated_stamina, enough_stamina) = _settle_stamina_change(stamina, ns_common_stamina_effect.BLOCK, max_stamina);
                return (updated_stamina, enough_stamina);
            }
            if (intent == ns_jessica_action.DASH_FORWARD) {
                let (updated_stamina, enough_stamina) = _settle_stamina_change(stamina, ns_common_stamina_effect.DASH_FORWARD, max_stamina);
                return (updated_stamina, enough_stamina);
            }
            if (intent == ns_jessica_action.DASH_BACKWARD) {
                let (updated_stamina, enough_stamina) = _settle_stamina_change(stamina, ns_common_stamina_effect.DASH_BACKWARD, max_stamina);
                return (updated_stamina, enough_stamina);
            }
            if (intent == ns_jessica_action.MOVE_FORWARD) {
                let (updated_stamina, enough_stamina) = _settle_stamina_change(stamina, ns_common_stamina_effect.MOVE_FORWARD, max_stamina);
                return (updated_stamina, enough_stamina);
            }
            if (intent == ns_jessica_action.MOVE_BACKWARD) {
                let (updated_stamina, enough_stamina)= _settle_stamina_change(stamina, ns_common_stamina_effect.MOVE_BACKWARD, max_stamina);
                return (updated_stamina, enough_stamina);
            }
            if (intent == ns_jessica_action.JUMP) {
                let (updated_stamina, enough_stamina)= _settle_stamina_change(stamina, ns_common_stamina_effect.JUMP, max_stamina);
                return (updated_stamina, enough_stamina);
            }
            if (intent == ns_jessica_action.GATOTSU){
                let (updated_stamina, enough_stamina) = _settle_stamina_change(stamina, ns_jessica_stamina_effect.GATOTSU, max_stamina);
                return (updated_stamina, enough_stamina);
            }
            if (intent == ns_jessica_action.TAUNT){
                let (updated_stamina, enough_stamina) = _settle_stamina_change(stamina, 0, max_stamina);
                return (updated_stamina, enough_stamina);
            }
            if (intent == ns_jessica_action.NULL){
                let (updated_stamina, enough_stamina) = _settle_stamina_change(stamina, ns_common_stamina_effect.NULL, max_stamina);
                return (updated_stamina, enough_stamina);
            }
        }

        if (character_type == ns_character_type.ANTOC) {
            if (intent == ns_antoc_action.HORI){
                let (updated_stamina, enough_stamina) = _settle_stamina_change(stamina, ns_antoc_stamina_effect.HORI, max_stamina);
                return (updated_stamina, enough_stamina);
            }
            if (intent == ns_antoc_action.VERT){
                let (updated_stamina, enough_stamina) = _settle_stamina_change(stamina, ns_antoc_stamina_effect.VERT, max_stamina);
                return (updated_stamina, enough_stamina);
            }
            if (intent == ns_antoc_action.LOW_KICK){
                let (updated_stamina, enough_stamina) = _settle_stamina_change(stamina, ns_antoc_stamina_effect.LOW_KICK, max_stamina);
                return (updated_stamina, enough_stamina);
            }
            if (intent == ns_antoc_action.BLOCK) {
                let (updated_stamina, enough_stamina) = _settle_stamina_change(stamina, ns_common_stamina_effect.BLOCK, max_stamina);
                return (updated_stamina, enough_stamina);
            }
            if (intent == ns_antoc_action.DASH_FORWARD) {
                let (updated_stamina, enough_stamina) = _settle_stamina_change(stamina, ns_common_stamina_effect.DASH_FORWARD, max_stamina);
                return (updated_stamina, enough_stamina);
            }
            if (intent == ns_antoc_action.DASH_BACKWARD) {
                let (updated_stamina, enough_stamina) = _settle_stamina_change(stamina, ns_common_stamina_effect.DASH_BACKWARD, max_stamina);
                return (updated_stamina, enough_stamina);
            }
            if (intent == ns_antoc_action.MOVE_FORWARD) {
                let (updated_stamina, enough_stamina) = _settle_stamina_change(stamina, ns_common_stamina_effect.MOVE_FORWARD, max_stamina);
                return (updated_stamina, enough_stamina);
            }
            if (intent == ns_antoc_action.MOVE_BACKWARD) {
                let (updated_stamina, enough_stamina)= _settle_stamina_change(stamina, ns_common_stamina_effect.MOVE_BACKWARD, max_stamina);
                return (updated_stamina, enough_stamina);
            }
            if (intent == ns_antoc_action.STEP_FORWARD) {
                let (updated_stamina, enough_stamina)= _settle_stamina_change(stamina, ns_antoc_stamina_effect.STEP_FORWARD, max_stamina);
                return (updated_stamina, enough_stamina);
            }
            if (intent == ns_antoc_action.JUMP) {
                let (updated_stamina, enough_stamina)= _settle_stamina_change(stamina, ns_common_stamina_effect.JUMP, max_stamina);
                return (updated_stamina, enough_stamina);
            }
            if (intent == ns_antoc_action.NULL){
                let (updated_stamina, enough_stamina) = _settle_stamina_change(stamina, ns_common_stamina_effect.NULL, max_stamina);
                return (updated_stamina, enough_stamina);
            }
            if (intent == ns_antoc_action.CYCLONE){
                let (updated_stamina, enough_stamina) = _settle_stamina_change(stamina, ns_antoc_stamina_effect.CYCLONE, max_stamina);
                return (updated_stamina, enough_stamina);
            }
            if (intent == ns_antoc_action.TAUNT){
                let (updated_stamina, enough_stamina) = _settle_stamina_change(stamina, 0, max_stamina);
                return (updated_stamina, enough_stamina);
            }
        }

    with_attr error_message("Intent is not recognized.") {
        assert 0 = 1;
    }
    return (0, FALSE);
}

func _settle_stamina_change{range_check_ptr}(stamina : felt, stamina_change : felt, max_stamina : felt) -> (felt, felt) {
        alloc_locals;
        let is_neg = is_le(stamina_change, 0);
        let updated_stamina = stamina + stamina_change;
        let is_not_negative = is_nn(updated_stamina);
        let is_overflow = is_le(max_stamina, updated_stamina);
        if(is_neg == TRUE) {
            if(is_not_negative == 0) {
                return (0, FALSE);
            }
        } else {
            if(is_overflow == 1) {
                return (max_stamina, TRUE);
            }
        }
        return (updated_stamina, TRUE);
    }

func character_active_body_state_duration_lookup {range_check_ptr}(character: felt, state: felt) -> felt {
    if (character == ns_character_type.JESSICA) {
        return jessica_active_body_state_duration_lookup(state);
    }
    return antoc_active_body_state_duration_lookup(state);
}
