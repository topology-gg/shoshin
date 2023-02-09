%lang starknet

from starkware.cairo.common.math_cmp import (is_le, is_nn)
from starkware.cairo.common.bool import (TRUE, FALSE)
from contracts.constants.constants import ns_common_stamina_effect
from contracts.constants.constants_antoc import ns_antoc_stamina_effect
from contracts.constants.constants_jessica import ns_jessica_stamina_effect

func calculate_default_stamina{range_check_ptr}(stamina : felt, character_type : felt) -> felt {
    if (character_type == ns_character_type.JESSICA) {
        let updated_stamina_default_recovery = _settle_stamina_change(stamina, ns_jessica_stamina_effect.NULL, max_stamina, TRUE);
        return updated_stamina_default_recovery;

    }else{
        let updated_stamina_default_recovery = _settle_stamina_change(stamina, ns_antoc_stamina_effect.NULL, max_stamina, TRUE);
        return updated_stamina_default_recovery;
    }
}

func calculate_stamina_change{range_check_ptr}(stamina : felt, intent : felt, max_stamina : felt, character_type : felt) -> felt {

        if (intent == ns_antoc_action.HORI) {
            let updated_stamina = _settle_stamina_change(stamina, ns_antoc_stamina_effect.HORI, max_stamina, FALSE);
            return updated_stamina;
        }
        if (intent == ns_antoc_action.VERT) {
            let updated_stamina = _settle_stamina_change(stamina, ns_antoc_stamina_effect.VERT, max_stamina, FALSE);
            let updated_stamina_default_recovery = _settle_stamina_change(stamina, ns_antoc_stamina_effect.NULL, max_stamina, TRUE);
            return updated_stamina;
        }
        if (intent == ns_antoc_action.BLOCK) {
            let updated_stamina = _settle_stamina_change(stamina, ns_common_stamina_effect.BLOCK, max_stamina, TRUE);
            let updated_stamina_default_recovery = _settle_stamina_change(stamina, ns_antoc_stamina_effect.NULL, max_stamina, TRUE);
            return updated_stamina;
        }
        if (intent == ns_antoc_action.DASH_FORWARD) {
            let updated_stamina = _settle_stamina_change(stamina, ns_common_stamina_effect.DASH_FORWARD, max_stamina, FALSE);
            let updated_stamina_default_recovery = _settle_stamina_change(stamina, ns_antoc_stamina_effect.NULL, max_stamina, TRUE);
            return updated_stamina;
        }
        if (intent == ns_antoc_action.DASH_BACKWARD) {
            let updated_stamina = _settle_stamina_change(stamina, ns_common_stamina_effect.DASH_BACKWARD, max_stamina, FALSE);
            return updated_stamina;
        }
        if (intent == ns_antoc_action.MOVE_FORWARD) {
            let updated_stamina = _settle_stamina_change(stamina, ns_common_stamina_effect.MOVE_FORWARD, max_stamina, TRUE);
            return updated_stamina;
        }
        if (intent == ns_antoc_action.MOVE_BACKWARD) {
            let updated_stamina = _settle_stamina_change(stamina, ns_common_stamina_effect.MOVE_BACKWARD, max_stamina, TRUE);
            return updated_stamina;
        }
        if (intent == ns_antoc_action.NULL){
            let updated_stamina = _settle_stamina_change(stamina, ns_common_stamina_effect.NULL, max_stamina, TRUE);
            return updated_stamina;
        }

        if (character_type == ns_character_type.JESSICA) {
            if (intent == ns_jessica_action.SLASH){
                let updated_stamina = _settle_stamina_change(stamina, ns_jessica_stamina_effect.SLASH, max_stamina, FALSE);
                return updated_stamina;
            }
            if (intent == ns_jessica_action.UPSWING){
                let updated_stamina = _settle_stamina_change(stamina, ns_jessica_stamina_effect.UPSWING, max_stamina, FALSE);
                return updated_stamina;
            }
            if (intent == ns_jessica_action.SIDECUT){
                let updated_stamina = _settle_stamina_change(stamina, ns_jessica_stamina_effect.SIDECUT, max_stamina, FALSE);
                return updated_stamina;
            }
        }

        if (character_type == ns_character_type.ANTIOC) {
            if (intent == ns_antoc_action.HORI){
                let updated_stamina = _settle_stamina_change(stamina, ns_antioc_stamina_effect.HORI, max_stamina, FALSE);
                return updated_stamina;
            }
            if (intent == ns_antoc_action.VERT){
                let updated_stamina = _settle_stamina_change(stamina, ns_antioc_stamina_effect.VERT, max_stamina, FALSE);
                return updated_stamina;
            }
        }

}

func _settle_stamina_change{range_check_ptr}(stamina : felt, stamina_change : felt, max_stamina : felt, is_add : felt) -> felt{
        if(is_add == 1){
            let updated_stamina = stamina + stamina_change;
            let is_valid_stamina = is_le(updated_stamina, max_stamina);
            if(is_valid_stamina == 1) {
                return updated_stamina;
            } else {
                return max_stamina;
            }
        } else {
            let updated_stamina = stamina - stamina_change;
            let is_valid_stamina = is_nn(updated_stamina);
            if(is_valid_stamina == 1) {
                return updated_stamina;
            } else {
                return 0;
            }
        }
    }