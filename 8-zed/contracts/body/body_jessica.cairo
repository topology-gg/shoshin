%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.bool import (TRUE, FALSE)
from starkware.cairo.common.math import unsigned_div_rem
from starkware.cairo.common.math_cmp import is_le, is_nn_le, is_not_zero
from contracts.constants.constants import (
    BodyState, ns_stimulus, ns_stamina, ns_character_type, HURT_EFFECT, KNOCKED_EFFECT, CLASH_EFFECT
)
from contracts.constants.constants_jessica import (
    ns_jessica_action, ns_jessica_body_state, ns_jessica_body_state_duration, ns_jessica_body_state_qualifiers
)
from contracts.body.body_utils import (
    calculate_integrity_change, calculate_stamina_change
)
//
// Jessica's Body State Diagram
//
func _body_jessica {range_check_ptr}(
        body_state: BodyState,
        stimulus: felt,
        intent: felt,
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
    let (stimulus_type, residue) = unsigned_div_rem (stimulus, ns_stimulus.ENCODING);
    let (grounded, stimulus_damage) = unsigned_div_rem (residue, ns_stimulus.GROUND_ENCODING);

    // Calculate new stats and stat flag
    let updated_integrity = calculate_integrity_change (integrity, stimulus_damage);
    let (updated_stamina, enough_stamina) = calculate_stamina_change (stamina, intent, ns_stamina.MAX_STAMINA, ns_character_type.JESSICA);
    let is_fatigued = 1 - enough_stamina;

    // Check if opponent's state_index has progressed from opponent_state_index_last_hit;
    // for preventing incorrectly registering more than one hit per attack move
    let opponent_state_index_has_progressed = is_not_zero (opponent_body_state_index - opponent_state_index_last_hit);

    //
    // KO
    // not interruptible; not responding to intent
    //
    if (updated_integrity == 0 and state != ns_jessica_body_state.KO) {
        return ( body_state_nxt = BodyState(ns_jessica_body_state.KO, 0, updated_integrity , stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
    }
    if (state == ns_jessica_body_state.KO) {
        if (counter == ns_jessica_body_state_duration.KO - 1) {
            // stop at last frame
            return ( body_state_nxt = BodyState(ns_jessica_body_state.KO, counter, updated_integrity, updated_stamina, dir, is_fatigued, state_index, opponent_state_index_last_hit) );
        }

        // if reach counter==2 and still in air => remain in counter==2
        if (counter == 2 and grounded == 0) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.KO, counter, updated_integrity, updated_stamina, dir, is_fatigued, state_index, opponent_state_index_last_hit) );
        }

        // increment
        return ( body_state_nxt = BodyState(ns_jessica_body_state.KO, counter + 1, updated_integrity, updated_stamina, dir, is_fatigued, state_index, opponent_state_index_last_hit) );
    }

    //
    // Idle
    //
    if (state == ns_jessica_body_state.IDLE) {

        // body responds to stimulus first
        if (opponent_state_index_has_progressed == 1) {
            if (stimulus_type == ns_stimulus.HURT) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.HURT, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
            }
            if (stimulus_type == ns_stimulus.KNOCKED) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.KNOCKED, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
            }
            if (stimulus_type == ns_stimulus.LAUNCHED) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.LAUNCHED, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
            }
        }

        // body responds to intent
        if (intent == ns_jessica_action.TAUNT) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.TAUNT_PARIS23, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
        }
        if (intent == ns_jessica_action.MOVE_FORWARD) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.MOVE_FORWARD, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
        }
        if (intent == ns_jessica_action.MOVE_BACKWARD) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.MOVE_BACKWARD, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
        }
        if(enough_stamina == TRUE){
            if (intent == ns_jessica_action.BLOCK) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.BLOCK, 0, integrity, stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
            if (intent == ns_jessica_action.SLASH) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.SLASH, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
            if (intent == ns_jessica_action.UPSWING) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.UPSWING, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
            if (intent == ns_jessica_action.SIDECUT) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.SIDECUT, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
            if (intent == ns_jessica_action.LOW_KICK) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.LOW_KICK, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
            if (intent == ns_jessica_action.DASH_FORWARD) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.DASH_FORWARD, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
            if (intent == ns_jessica_action.DASH_BACKWARD) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.DASH_BACKWARD, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
            if (intent == ns_jessica_action.JUMP) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.JUMP, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
            if (intent == ns_jessica_action.GATOTSU) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.GATOTSU, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
        }

        // otherwise stay in IDLE but increment counter modulo duration
        let (updated_stamina, _) = calculate_stamina_change(stamina, ns_jessica_action.NULL, ns_stamina.MAX_STAMINA, ns_character_type.JESSICA);
        if (counter == ns_jessica_body_state_duration.IDLE - 1) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.IDLE, 0, integrity, updated_stamina, dir, is_fatigued, state_index, opponent_state_index_last_hit) );
        } else {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.IDLE, counter + 1, integrity, updated_stamina, dir, is_fatigued, state_index, opponent_state_index_last_hit) );
        }
    }

    //
    // Slash
    //
    if (state == ns_jessica_body_state.SLASH) {

        // clash does not depend on opponent having progressed on state index
        if (stimulus_type == ns_stimulus.CLASH) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.CLASH, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
        }

        // attacker getting knocked does not depend on opponent having progressed on state index
        if (stimulus_type == ns_stimulus.KNOCKED) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.KNOCKED, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
        }

        // body responds to stimulus first
        if (opponent_state_index_has_progressed == 1) {
            if (stimulus_type == ns_stimulus.HURT) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.HURT, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
            }
            if (stimulus_type == ns_stimulus.LAUNCHED) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.LAUNCHED, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
            }
        }

        // by default finishing the animation; go to frame 1 if intent is SLASH at last frame
        if (counter == ns_jessica_body_state_duration.SLASH - 1) {
            if (intent == ns_jessica_action.SLASH) {
                // return to first frame
                if(enough_stamina == TRUE){
                    return ( body_state_nxt = BodyState(ns_jessica_body_state.SLASH, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
                } else {
                    return ( body_state_nxt = BodyState(ns_jessica_body_state.IDLE, 0, integrity, stamina, dir, TRUE, state_index+1, opponent_state_index_last_hit) );
                }
            }
            // otherwise return to IDLE
            return ( body_state_nxt = BodyState(ns_jessica_body_state.IDLE, 0, integrity, stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
        } else {
            // increment counter
            return ( body_state_nxt = BodyState(ns_jessica_body_state.SLASH, counter + 1, integrity, stamina, dir, FALSE, state_index, opponent_state_index_last_hit) );
        }

    }


    //
    // Upswing
    //
    if (state == ns_jessica_body_state.UPSWING) {

        // clash does not depend on opponent having progressed on state index
        if (stimulus_type == ns_stimulus.CLASH) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.CLASH, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
        }

        // attacker getting knocked does not depend on opponent having progressed on state index
        if (stimulus_type == ns_stimulus.KNOCKED) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.KNOCKED, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
        }

        // body responds to stimulus first
        if (opponent_state_index_has_progressed == 1) {
            if (stimulus_type == ns_stimulus.HURT) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.HURT, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
            }
            if (stimulus_type == ns_stimulus.LAUNCHED) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.LAUNCHED, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
            }
        }

        // by default finishing the animation; go to frame 1 if intent is UPSWING at last frame
        if (counter == ns_jessica_body_state_duration.UPSWING - 1) {
            if (intent == ns_jessica_action.UPSWING) {
                if (enough_stamina == TRUE) {
                    // return to first frame
                    return ( body_state_nxt = BodyState(ns_jessica_body_state.UPSWING, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
                } else {
                    return ( body_state_nxt = BodyState(ns_jessica_body_state.IDLE, 0, integrity, stamina, dir, TRUE, state_index+1, opponent_state_index_last_hit) );
                }
            }
            // otherwise return to IDLE
            return ( body_state_nxt = BodyState(ns_jessica_body_state.IDLE, 0, integrity, stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
        } else {
            // increment counter
            return ( body_state_nxt = BodyState(ns_jessica_body_state.UPSWING, counter + 1, integrity, stamina, dir, FALSE, state_index, opponent_state_index_last_hit) );
        }

    }

    //
    // Sidecut
    //
    if (state == ns_jessica_body_state.SIDECUT) {

        // clash does not depend on opponent having progressed on state index
        if (stimulus_type == ns_stimulus.CLASH) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.CLASH, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
        }

        // attacker getting knocked does not depend on opponent having progressed on state index
        if (stimulus_type == ns_stimulus.KNOCKED) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.KNOCKED, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
        }

        // body responds to stimulus first
        if (opponent_state_index_has_progressed == 1) {
            if (stimulus_type == ns_stimulus.HURT) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.HURT, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
            }
            if (stimulus_type == ns_stimulus.LAUNCHED) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.LAUNCHED, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
            }
        }

        // by default finishing the animation; go to frame 1 if intent is SIDECUT at last frame
        if (counter == ns_jessica_body_state_duration.SIDECUT - 1) {
            if (intent == ns_jessica_action.SIDECUT) {
                if (enough_stamina == TRUE) {
                    // return to first frame
                    return ( body_state_nxt = BodyState(ns_jessica_body_state.SIDECUT, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
                } else {
                    return ( body_state_nxt = BodyState(ns_jessica_body_state.IDLE, 0, integrity, stamina, dir, TRUE, state_index+1, opponent_state_index_last_hit) );
                }
            }
            // otherwise return to IDLE
            return ( body_state_nxt = BodyState(ns_jessica_body_state.IDLE, 0, integrity, stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
        } else {
            // increment counter
            return ( body_state_nxt = BodyState(ns_jessica_body_state.SIDECUT, counter + 1, integrity, stamina, dir, FALSE, state_index, opponent_state_index_last_hit) );
        }

    }

    //
    // Block
    //
    if (state == ns_jessica_body_state.BLOCK) {

        // body responds to stimulus first
        if (opponent_state_index_has_progressed == 1) {
            if (stimulus_type == ns_stimulus.HURT) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.HURT, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
            }
            if (stimulus_type == ns_stimulus.KNOCKED) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.KNOCKED, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
            }
            if (stimulus_type == ns_stimulus.LAUNCHED) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.LAUNCHED, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
            }
        }

        // body responds to intent
        if (intent == ns_jessica_action.BLOCK) {
            // check stamina
            if(enough_stamina == TRUE){
                if (counter == 1) {
                    // if counter reaches active frame (2nd frame; counter == 1) => stay in active frame
                    return ( body_state_nxt = BodyState(ns_jessica_body_state.BLOCK, counter, integrity, updated_stamina, dir, FALSE, state_index, opponent_state_index_last_hit) );
                } else {
                    // else increment counter
                    return ( body_state_nxt = BodyState(ns_jessica_body_state.BLOCK, counter + 1, integrity, updated_stamina, dir, FALSE, state_index, opponent_state_index_last_hit) );
                }
            }
        }

        // otherwise return to IDLE
        let (updated_stamina, _) = calculate_stamina_change(stamina, ns_jessica_action.BLOCK, ns_stamina.MAX_STAMINA, ns_character_type.JESSICA);
        return ( body_state_nxt = BodyState(ns_jessica_body_state.IDLE, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
    }

    //
    // Clash
    // note: is interruptible
    //
    if (state == ns_jessica_body_state.CLASH) {

        // body responds to stimulus first
        if (opponent_state_index_has_progressed == 1) {
            if (stimulus_type == ns_stimulus.HURT) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.HURT, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
            }
            if (stimulus_type == ns_stimulus.KNOCKED) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.KNOCKED, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
            }
            if (stimulus_type == ns_stimulus.LAUNCHED) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.LAUNCHED, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
            }
        }

        // if counter is full => return to IDLE
        if (counter == ns_jessica_body_state_duration.CLASH - 1) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.IDLE, 0, integrity, stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
        }

        // else stay in CLASH and increment counter
        return ( body_state_nxt = BodyState(ns_jessica_body_state.CLASH, counter + 1, integrity, stamina, dir, FALSE, state_index, opponent_state_index_last_hit) );
    }

    //
    // Hurt
    // note: uninterruptible
    //
    if (state == ns_jessica_body_state.HURT) {

        // if counter is full => return to IDLE
        if (counter == ns_jessica_body_state_duration.HURT - 1) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.IDLE, 0, integrity, stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
        }

        // else stay in HURT and increment counter
        return ( body_state_nxt = BodyState(ns_jessica_body_state.HURT, counter + 1, integrity, stamina, dir, FALSE, state_index, opponent_state_index_last_hit) );
    }

    //
    // Knocked
    // note: hurtable!
    //
    if (state == ns_jessica_body_state.KNOCKED) {

        // interruptible by stimulus
        if (opponent_state_index_has_progressed == 1) {
            if (stimulus_type == ns_stimulus.HURT) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.HURT, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
            }
            if (stimulus_type == ns_stimulus.KNOCKED) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.KNOCKED, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
            }
            if (stimulus_type == ns_stimulus.LAUNCHED) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.LAUNCHED, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
            }
        }

        // if counter is full => cancellable with the right actions, otherwise return to Idle
        if (counter == ns_jessica_body_state_duration.KNOCKED - 1) {
            // cancellable into dash backward's first frame
            if (intent == ns_jessica_action.DASH_BACKWARD) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.DASH_BACKWARD, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }

            // cancellable into lowkick's ACTIVE frame
            if (intent == ns_jessica_action.LOW_KICK) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.LOW_KICK, 3, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }

            // return to IDLE otherwise
            return ( body_state_nxt = BodyState(ns_jessica_body_state.IDLE, 0, integrity, stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
        }

        // if reach counter==5 and still in air => remain in counter==5
        if (counter == 5 and grounded == 0) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.KNOCKED, counter, integrity, stamina, dir, FALSE, state_index, opponent_state_index_last_hit) );
        }

        // else increment counter
        return ( body_state_nxt = BodyState(ns_jessica_body_state.KNOCKED, counter + 1, integrity, stamina, dir, FALSE, state_index, opponent_state_index_last_hit) );
    }

    //
    // Move forward
    //
    if (state == ns_jessica_body_state.MOVE_FORWARD) {

        // interruptible by stimulus
        if (opponent_state_index_has_progressed == 1) {
            if (stimulus_type == ns_stimulus.HURT) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.HURT, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
            }
            if (stimulus_type == ns_stimulus.KNOCKED) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.KNOCKED, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
            }
            if (stimulus_type == ns_stimulus.LAUNCHED) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.LAUNCHED, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
            }
        }

        // interruptible by agent intent (locomotive action has lowest priority)
        if (intent == ns_jessica_action.TAUNT) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.TAUNT_PARIS23, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
        }
        if(enough_stamina == TRUE){
            if (intent == ns_jessica_action.BLOCK) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.BLOCK, 0, integrity, stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
            if (intent == ns_jessica_action.SLASH) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.SLASH, 0, integrity, stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
            if (intent == ns_jessica_action.UPSWING) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.UPSWING, 0, integrity, stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
            if (intent == ns_jessica_action.SIDECUT) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.SIDECUT, 0, integrity, stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
            if (intent == ns_jessica_action.LOW_KICK) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.LOW_KICK, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
            if (intent == ns_jessica_action.JUMP) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.JUMP, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
        }

        // continue moving forward
        if (intent == ns_jessica_action.MOVE_FORWARD) {
            if (counter == ns_jessica_body_state_duration.MOVE_FORWARD - 1) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.MOVE_FORWARD, 0, integrity, updated_stamina, dir, is_fatigued, state_index, opponent_state_index_last_hit) );
            } else {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.MOVE_FORWARD, counter + 1, integrity, updated_stamina, dir, is_fatigued, state_index, opponent_state_index_last_hit) );
            }
        }

        // able to reverse direction immediately
        if (intent == ns_jessica_action.MOVE_BACKWARD) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.MOVE_BACKWARD, 0, integrity, updated_stamina, dir, is_fatigued, state_index+1, opponent_state_index_last_hit) );
        }

        // otherwise return to idle
        let (updated_stamina, _) = calculate_stamina_change(stamina, ns_jessica_action.MOVE_FORWARD, ns_stamina.MAX_STAMINA, ns_character_type.JESSICA);
        return ( body_state_nxt = BodyState(ns_jessica_body_state.IDLE, 0, integrity, updated_stamina, dir, is_fatigued, state_index+1, opponent_state_index_last_hit) );
    }

    //
    // Move backward
    //
    if (state == ns_jessica_body_state.MOVE_BACKWARD) {

        // interruptible by stimulus
        if (opponent_state_index_has_progressed == 1) {
            if (stimulus_type == ns_stimulus.HURT) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.HURT, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
            }
            if (stimulus_type == ns_stimulus.KNOCKED) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.KNOCKED, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
            }
            if (stimulus_type == ns_stimulus.LAUNCHED) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.LAUNCHED, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
            }
        }

        // interruptible by agent intent (locomotive action has lowest priority)
        if (intent == ns_jessica_action.TAUNT) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.TAUNT_PARIS23, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
        }
        if(enough_stamina == TRUE){
            if (intent == ns_jessica_action.BLOCK) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.BLOCK, 0, integrity, stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
            if (intent == ns_jessica_action.SLASH) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.SLASH, 0, integrity, stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
            if (intent == ns_jessica_action.UPSWING) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.UPSWING, 0, integrity, stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
            if (intent == ns_jessica_action.SIDECUT) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.SIDECUT, 0, integrity, stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
            if (intent == ns_jessica_action.LOW_KICK) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.LOW_KICK, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
            if (intent == ns_jessica_action.JUMP) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.JUMP, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
        }

        // continue moving forward
        if (intent == ns_jessica_action.MOVE_BACKWARD) {
            if (counter == ns_jessica_body_state_duration.MOVE_BACKWARD - 1) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.MOVE_BACKWARD, 0, integrity, updated_stamina, dir, is_fatigued, state_index, opponent_state_index_last_hit) );
            } else {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.MOVE_BACKWARD, counter + 1, integrity, updated_stamina, dir, is_fatigued, state_index, opponent_state_index_last_hit) );
            }
        }

        // able to reverse direction immediately
        if (intent == ns_jessica_action.MOVE_FORWARD) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.MOVE_FORWARD, 0, integrity, updated_stamina, dir, is_fatigued, state_index+1, opponent_state_index_last_hit) );
        }

        // otherwise return to idle
        let (updated_stamina, _) = calculate_stamina_change(stamina, ns_jessica_action.MOVE_BACKWARD, ns_stamina.MAX_STAMINA, ns_character_type.JESSICA);
        return ( body_state_nxt = BodyState(ns_jessica_body_state.IDLE, 0, integrity, updated_stamina, dir, is_fatigued, state_index+1, opponent_state_index_last_hit) );
    }

    //
    // Dash forward
    // note: DASH is currently uninterruptible by stimulus, meaning it is perfect defense;
    //       plus it can be canceled directly into the active frame of various attacks, making it insanely powerful;
    //       need to add cost such as stamina consumption
    //
    if (state == ns_jessica_body_state.DASH_FORWARD) {

        // can cancel dash into grounded attacks / JUMP while grounded
        if(enough_stamina == TRUE and grounded == 1) {
            // interruptible by offensive intent
            if (intent == ns_jessica_action.SLASH) {
                // go straight to SLASH's active frame - 1
                return ( body_state_nxt = BodyState(ns_jessica_body_state.SLASH, 1, integrity, stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
            if (intent == ns_jessica_action.UPSWING) {
                // go straight to UPSWING's active frame - 1
                return ( body_state_nxt = BodyState(ns_jessica_body_state.UPSWING, 1, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
            if (intent == ns_jessica_action.SIDECUT) {
                // go straight to SIDECUT's active frame - 1
                return ( body_state_nxt = BodyState(ns_jessica_body_state.SIDECUT, 1, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }

            // interruptible by jump
            if (intent == ns_jessica_action.JUMP) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.JUMP, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
        }

        // can cancel dash into BIRDSWING's counter==2 while not grounded
        if(enough_stamina == TRUE and grounded == 0) {
            if (intent == ns_jessica_action.SIDECUT) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.BIRDSWING, 2, integrity, stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
        }

        // last frame reached
        if (counter == ns_jessica_body_state_duration.DASH_FORWARD - 1) {
            // if not grounded => return to JUMP's counter==4
            if (grounded == 0) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.JUMP, 4, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }

            // continue the dashing if not interrupted by an attack
            if(enough_stamina == TRUE and intent == ns_jessica_body_state_duration.DASH_FORWARD){
                // reset counter
                return ( body_state_nxt = BodyState(ns_jessica_body_state.DASH_FORWARD, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
            return ( body_state_nxt = BodyState(ns_jessica_body_state.IDLE, 0, integrity, stamina, dir, TRUE, state_index+1, opponent_state_index_last_hit) );
        }
        // increment counter
        return ( body_state_nxt = BodyState(ns_jessica_body_state.DASH_FORWARD, counter + 1, integrity, stamina, dir, FALSE, state_index, opponent_state_index_last_hit) );
    }

    //
    // Dash backward
    //
    if (state == ns_jessica_body_state.DASH_BACKWARD) {

        // can cancel dash into grounded attacks / JUMP while grounded
        if(enough_stamina == TRUE and grounded == 1){
            // interruptible by offensive intent
            if (intent == ns_jessica_action.SLASH) {
                // go straight to SLASH's active frame - 1
                return ( body_state_nxt = BodyState(ns_jessica_body_state.SLASH, 1, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
            if (intent == ns_jessica_action.UPSWING) {
                // go straight to UPSWING's active frame
                return ( body_state_nxt = BodyState(ns_jessica_body_state.UPSWING, 1, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
            if (intent == ns_jessica_action.SIDECUT) {
                // go straight to SIDECUT's active frame
                return ( body_state_nxt = BodyState(ns_jessica_body_state.SIDECUT, 1, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }

            // interruptible by jump
            if (intent == ns_jessica_action.JUMP) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.JUMP, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
        }

        // can cancel dash into BIRDSWING's counter==2 while not grounded
        if(enough_stamina == TRUE and grounded == 0) {
            if (intent == ns_jessica_action.SIDECUT) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.BIRDSWING, 2, integrity, stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
        }

        // last frame reached
        if (counter == ns_jessica_body_state_duration.DASH_BACKWARD - 1) {
            // if not grounded => return to JUMP's counter==4
            if (grounded == 0) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.JUMP, 4, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }

            // continue the dashing if not interrupted by an attack
            if(enough_stamina == TRUE and intent == ns_jessica_body_state_duration.DASH_BACKWARD) {
                // reset counter
                return ( body_state_nxt = BodyState(ns_jessica_body_state.DASH_BACKWARD, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
            return ( body_state_nxt = BodyState(ns_jessica_body_state.IDLE, 0, integrity, stamina, dir, TRUE, state_index+1, opponent_state_index_last_hit) );
        }
        // increment counter
        return ( body_state_nxt = BodyState(ns_jessica_body_state.DASH_BACKWARD, counter + 1, integrity, stamina, dir, FALSE, state_index, opponent_state_index_last_hit) );
    }

    //
    // Jump / Jump Move Foward / Jump Move Backward
    // note: is interruptible
    //
    if ((state-ns_jessica_body_state.JUMP)*(state-ns_jessica_body_state.JUMP_MOVE_FORWARD)*(state-ns_jessica_body_state.JUMP_MOVE_BACKWARD) == 0) {

        if (opponent_state_index_has_progressed == 1) {
            // can be knocked
            if (stimulus_type == ns_stimulus.KNOCKED) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.KNOCKED, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
            }
            if (stimulus_type == ns_stimulus.LAUNCHED) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.LAUNCHED, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
            }
        }

        // SIDECUT during counter!=0 becomes birdswing's counter==0
        if (intent == ns_jessica_action.SIDECUT and counter != 0) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.BIRDSWING, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
        }

        // DASH FORWARD/BACKWARD during counter!=0/4/5 (ie counter==1/2/3) becomes dash forward/backward's counter==0
        // note: this is to prevent multiple air dashes during the same jump
        if ((counter-1) * (counter-2) * (counter-3) == 0) {
            if (intent == ns_jessica_action.DASH_FORWARD) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.DASH_FORWARD, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
            if (intent == ns_jessica_action.DASH_BACKWARD) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.DASH_BACKWARD, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
        }

        // if counter is full => return to IDLE
        if (counter == ns_jessica_body_state_duration.JUMP - 1) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.IDLE, 0, integrity, stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
        }

        // if reach counter==4 and still in air => remain in the same state with counter==4
        if (counter == 4 and grounded == 0) {
            return ( body_state_nxt = BodyState(state, counter, integrity, stamina, dir, FALSE, state_index, opponent_state_index_last_hit) );
        }

        // MOVE FORWARD/BACKWARD during counter!=0/5 (counter == 1/2/3/4) becomes JUMP_MOVE_FORWARD/BACKWARD's counter+1
        if ((counter-1)*(counter-2)*(counter-3)*(counter-4) == 0) {
            if (intent == ns_jessica_action.MOVE_FORWARD) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.JUMP_MOVE_FORWARD, counter+1, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
            if (intent == ns_jessica_action.MOVE_BACKWARD) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.JUMP_MOVE_BACKWARD, counter+1, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
        }

        // else stay in the same state and increment counter
        return ( body_state_nxt = BodyState(state, counter + 1, integrity, stamina, dir, FALSE, state_index, opponent_state_index_last_hit) );
    }

    //
    // Gatotsu
    // note: interruptible by clash
    //
    if (state == ns_jessica_body_state.GATOTSU) {

        // clash does not depend on opponent having progressed on state index
        if (stimulus_type == ns_stimulus.CLASH) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.CLASH, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
        }

        // if counter is full => return to IDLE
        if (counter == ns_jessica_body_state_duration.GATOTSU - 1) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.IDLE, 0, integrity, stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
        }

        // else stay in GATOTSU and increment counter
        return ( body_state_nxt = BodyState(ns_jessica_body_state.GATOTSU, counter + 1, integrity, stamina, dir, FALSE, state_index, opponent_state_index_last_hit) );
    }

    //
    // Low kick
    //
    if (state == ns_jessica_body_state.LOW_KICK) {

        // clash does not depend on opponent having progressed on state index
        if (stimulus_type == ns_stimulus.CLASH) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.CLASH, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
        }

        // attacker getting knocked does not depend on opponent having progressed on state index
        if (stimulus_type == ns_stimulus.KNOCKED) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.KNOCKED, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
        }

        // body responds to stimulus first
        if (opponent_state_index_has_progressed == 1) {
            if (stimulus_type == ns_stimulus.HURT) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.HURT, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
            }
            if (stimulus_type == ns_stimulus.LAUNCHED) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.LAUNCHED, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
            }
        }

        // body responds to intent
        // LOW_KICK at recovery frame is cancellable into UPSWING's counter==1 or DASH_BACKWARD's counter==0
        if ((counter-4) * (counter-5) == 0 and enough_stamina == TRUE) {
            if (intent == ns_jessica_action.UPSWING) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.UPSWING, 1, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
            if (intent == ns_jessica_action.DASH_BACKWARD) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.DASH_BACKWARD, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
        }

        // after the last frame, go to *second frame* if intent is LOW_KICK
        if (counter == ns_jessica_body_state_duration.LOW_KICK - 1) {
            if (intent == ns_jessica_action.LOW_KICK and enough_stamina == TRUE) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.LOW_KICK, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
            // otherwise return to IDLE
            return ( body_state_nxt = BodyState(ns_jessica_body_state.IDLE, 0, integrity, stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
        } else {
            // increment counter
            return ( body_state_nxt = BodyState(ns_jessica_body_state.LOW_KICK, counter + 1, integrity, stamina, dir, FALSE, state_index, opponent_state_index_last_hit) );
        }

    }

    //
    // Birdswing
    //
    if (state == ns_jessica_body_state.BIRDSWING) {

        // attacker getting knocked does not depend on opponent having progressed on state index
        if (stimulus_type == ns_stimulus.KNOCKED) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.KNOCKED, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
        }

        if (opponent_state_index_has_progressed == 1) {
            if (stimulus_type == ns_stimulus.LAUNCHED) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.LAUNCHED, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
            }
        }

        // if counter is full =>
        //   not grounded => go to JUMP's counter==4
        //   otherwise return to IDLE
        if (counter == ns_jessica_body_state_duration.BIRDSWING - 1) {
            if (grounded == 0) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.JUMP, 4, integrity, stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            } else {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.IDLE, 0, integrity, stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
        }

        // else stay in BIRDSWING and increment counter
        return ( body_state_nxt = BodyState(ns_jessica_body_state.BIRDSWING, counter + 1, integrity, stamina, dir, FALSE, state_index, opponent_state_index_last_hit) );
    }

    //
    // Launched
    // note: interruptible
    //
    if (state == ns_jessica_body_state.LAUNCHED) {

        // if within first 6 frames => can be interrupted
        if ((counter-0) * (counter-1) * (counter-2) * (counter-3) * (counter-4) * (counter-5) == 0 and opponent_state_index_has_progressed == 1) {
            // can be knocked
            if (stimulus_type == ns_stimulus.KNOCKED) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.KNOCKED, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
            }
            // can be juggled
            if (stimulus_type == ns_stimulus.LAUNCHED) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.LAUNCHED, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
            }
        }

        // if counter is full => cancellable with the right actions, otherwise return to IDLE
        if (counter == ns_jessica_body_state_duration.LAUNCHED - 1) {
            // cancellable into dash backward's first frame
            if (intent == ns_jessica_action.DASH_BACKWARD) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.DASH_BACKWARD, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }

            // cancellable into lowkick's ACTIVE frame
            if (intent == ns_jessica_action.LOW_KICK) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.LOW_KICK, 3, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }

            // return to IDLE otherwise
            return ( body_state_nxt = BodyState(ns_jessica_body_state.IDLE, 0, integrity, stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
        }

        // if reach counter==5 and still in air => remain in counter==5
        if (counter == 5 and grounded == 0) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.LAUNCHED, counter, integrity, stamina, dir, FALSE, state_index, opponent_state_index_last_hit) );
        }

        // else stay in LAUNCHED and increment counter
        return ( body_state_nxt = BodyState(ns_jessica_body_state.LAUNCHED, counter + 1, integrity, stamina, dir, FALSE, state_index, opponent_state_index_last_hit) );
    }

    //
    // Taunt
    //
    if (state == ns_jessica_body_state.TAUNT_PARIS23) {

        // body responds to stimulus first
        if (opponent_state_index_has_progressed == 1) {
            if (stimulus_type == ns_stimulus.HURT) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.HURT, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
            }
            if (stimulus_type == ns_stimulus.KNOCKED) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.KNOCKED, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
            }
            if (stimulus_type == ns_stimulus.LAUNCHED) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.LAUNCHED, 0, updated_integrity, stamina, dir, FALSE, state_index+1, opponent_body_state_index) );
            }
        }

        // body responds to intent; locomotive action has lowest priority
        if (intent == ns_jessica_action.MOVE_FORWARD) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.MOVE_FORWARD, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
        }
        if (intent == ns_jessica_action.MOVE_BACKWARD) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.MOVE_BACKWARD, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
        }
        if(enough_stamina == TRUE){
            if (intent == ns_jessica_action.BLOCK) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.BLOCK, 0, integrity, stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
            if (intent == ns_jessica_action.SLASH) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.SLASH, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
            if (intent == ns_jessica_action.UPSWING) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.UPSWING, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
            if (intent == ns_jessica_action.SIDECUT) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.SIDECUT, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
            if (intent == ns_jessica_action.LOW_KICK) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.LOW_KICK, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
            if (intent == ns_jessica_action.DASH_FORWARD) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.DASH_FORWARD, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
            if (intent == ns_jessica_action.DASH_BACKWARD) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.DASH_BACKWARD, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
            if (intent == ns_jessica_action.JUMP) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.JUMP, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
            if (intent == ns_jessica_action.GATOTSU) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.GATOTSU, 0, integrity, updated_stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
            }
        }

        // if counter is full => return to IDLE
        if (counter == ns_jessica_body_state_duration.TAUNT_PARIS23 - 1) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.IDLE, 0, integrity, stamina, dir, FALSE, state_index+1, opponent_state_index_last_hit) );
        }

        // else stay and increment counter
        return ( body_state_nxt = BodyState(ns_jessica_body_state.TAUNT_PARIS23, counter + 1, integrity, stamina, dir, FALSE, state_index, opponent_state_index_last_hit) );
    }

    with_attr error_message("Input body state is not recognized.") {
        assert 0 = 1;
    }
    return ( body_state_nxt = BodyState(0,0,0,0,0,0,0,0) );
}
