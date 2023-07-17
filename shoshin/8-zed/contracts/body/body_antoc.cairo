%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.bool import (TRUE, FALSE)
from starkware.cairo.common.math import unsigned_div_rem
from contracts.constants.constants import (
    BodyState, ns_stimulus, ns_stamina, ns_character_type, HURT_EFFECT, KNOCKED_EFFECT, CLASH_EFFECT
)
from contracts.constants.constants_antoc import (
    ns_antoc_action, ns_antoc_body_state, ns_antoc_body_state_duration, ns_antoc_body_state_qualifiers
)
from contracts.body.body_utils import (
    calculate_integrity_change, calculate_stamina_change
)

//
// Antoc's Body State Diagram
//
func _body_antoc {range_check_ptr}(
        body_state: BodyState, stimulus: felt, intent: felt
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

    // Decode stimulus
    let (stimulus_type, stimulus_damage) = unsigned_div_rem (stimulus, ns_stimulus.ENCODING);

    // Calculate new stats and stat flag
    let updated_integrity = calculate_integrity_change (integrity, stimulus_damage);
    let (updated_stamina, enough_stamina) = calculate_stamina_change (stamina, intent, ns_stamina.MAX_STAMINA, ns_character_type.ANTOC);
    let is_fatigued = 1 - enough_stamina;

    //
    // Idle
    //
    if (state == ns_antoc_body_state.IDLE) {
        // body responds to stimulus first
        if (stimulus_type == ns_stimulus.HURT) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.HURT, 0, updated_integrity , stamina, dir, FALSE) );
        }
        if (stimulus_type == ns_stimulus.KNOCKED) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.KNOCKED, 0, updated_integrity, stamina, dir, FALSE) );
        }
        if (stimulus_type == ns_stimulus.LAUNCHED) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.LAUNCHED, 0, updated_integrity, stamina, dir, FALSE) );
        }

        // body responds to intent; locomotive action has lowest priority
        if (intent == ns_antoc_action.MOVE_FORWARD) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.MOVE_FORWARD, 0, integrity, updated_stamina, dir, FALSE) );
        }
        if (intent == ns_antoc_action.MOVE_BACKWARD) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.MOVE_BACKWARD, 0, integrity, updated_stamina, dir, FALSE) );
        }
        if (intent == ns_antoc_action.BLOCK) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.BLOCK, 0, integrity, updated_stamina, dir, FALSE) );
        }
        if(enough_stamina == TRUE){
            if (intent == ns_antoc_action.HORI) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.HORI, 0, integrity, updated_stamina, dir, FALSE) );
            }
            if (intent == ns_antoc_action.VERT) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.VERT, 0, integrity, updated_stamina, dir, FALSE) );
            }
            if (intent == ns_antoc_action.LOW_KICK) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.LOW_KICK, 0, integrity, updated_stamina, dir, FALSE) );
            }
            if (intent == ns_antoc_action.DASH_FORWARD) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.DASH_FORWARD, 0, integrity, updated_stamina, dir, FALSE) );
            }
            if (intent == ns_antoc_action.DASH_BACKWARD) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.DASH_BACKWARD, 0, integrity, updated_stamina, dir, FALSE) );
            }
            if (intent == ns_antoc_action.JUMP) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.JUMP, 0, integrity, updated_stamina, dir, FALSE) );
            }
            if (intent == ns_antoc_action.STEP_FORWARD) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.STEP_FORWARD, 0, integrity, updated_stamina, dir, FALSE) );
            }
            if (intent == ns_antoc_action.CYCLONE) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.CYCLONE, 0, integrity, updated_stamina, dir, FALSE) );
            }
        }

        // otherwise stay in IDLE but increment counter modulo duration
        let (updated_stamina, _) = calculate_stamina_change(stamina, ns_antoc_action.NULL, ns_stamina.MAX_STAMINA, ns_character_type.ANTOC);
        if (counter == ns_antoc_body_state_duration.IDLE - 1) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.IDLE, 0, integrity, updated_stamina, dir, is_fatigued) );
            } else {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.IDLE, counter + 1, integrity, updated_stamina, dir, is_fatigued) );
        }
    }

    //
    // HORI
    //
    if (state == ns_antoc_body_state.HORI) {

        // body responds to stimulus first
        if (stimulus_type == ns_stimulus.HURT) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.HURT, 0, updated_integrity, stamina, dir, FALSE) );
        }
        if (stimulus_type == ns_stimulus.KNOCKED) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.KNOCKED, 0, updated_integrity, stamina, dir, FALSE) );
        }
        if (stimulus_type == ns_stimulus.LAUNCHED) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.LAUNCHED, 0, updated_integrity, stamina, dir, FALSE) );
        }
        if (stimulus_type == ns_stimulus.CLASH) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.CLASH, 0, updated_integrity, stamina, dir, FALSE) );
        }

        // note: clash does not interrupt Antoc's attack because of sword's heaviness;
        //       need to balance this carefully

        // by default finishing the animation; go to frame 1 if intent is HORI at last frame
        if (counter == ns_antoc_body_state_duration.HORI - 1) {
            if (intent == ns_antoc_action.HORI ) {
                // return to first frame
                if(enough_stamina == TRUE){
                    return ( body_state_nxt = BodyState(ns_antoc_body_state.HORI, 0, integrity, updated_stamina, dir, FALSE) );
                } else {
                    return ( body_state_nxt = BodyState(ns_antoc_body_state.IDLE, 0, integrity, stamina, dir, TRUE) );
                }
            }
            // otherwise return to IDLE
            return ( body_state_nxt = BodyState(ns_antoc_body_state.IDLE, 0, integrity, stamina, dir, FALSE) );
        } else {
            // increment counter
            return ( body_state_nxt = BodyState(ns_antoc_body_state.HORI, counter + 1, integrity, stamina, dir, FALSE) );
        }

    }

    //
    // VERT
    //
    if (state == ns_antoc_body_state.VERT) {

        // body responds to stimulus first
        if (stimulus_type == ns_stimulus.HURT) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.HURT, 0, updated_integrity, stamina, dir, FALSE) );
        }
        if (stimulus_type == ns_stimulus.KNOCKED) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.KNOCKED, 0, updated_integrity, stamina, dir, FALSE) );
        }
        if (stimulus_type == ns_stimulus.LAUNCHED) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.LAUNCHED, 0, updated_integrity, stamina, dir, FALSE) );
        }
        if (stimulus_type == ns_stimulus.CLASH) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.CLASH, 0, updated_integrity, stamina, dir, FALSE) );
        }

        // note: clash does not interrupt Antoc's attack because of sword's heaviness;
        //       need to balance this carefully

        // body responds to intent
        // VERT=>HORI fast transition: able to go directly to HORI's first frame at VERT's frame 8, 9, or 10
        if (intent == ns_antoc_action.HORI) {
            if ( (counter-7) * (counter-8) * (counter-9) == 0 ) {
                if(enough_stamina == TRUE) {
                    return ( body_state_nxt = BodyState(ns_antoc_body_state.HORI, 0, integrity, updated_stamina, dir, FALSE) );
                }
            }
        }

        // by default finishing the animation; go to the first frame if intent is VERT at last frame
        if (counter == ns_antoc_body_state_duration.VERT - 1) {
            if (intent == ns_antoc_action.VERT) {
                // return to first frame
                if(enough_stamina == TRUE){
                    return ( body_state_nxt = BodyState(ns_antoc_body_state.VERT, 0, integrity, updated_stamina, dir, FALSE) );
                } else {
                    return ( body_state_nxt = BodyState(ns_antoc_body_state.IDLE, 0, integrity, stamina, dir, TRUE) );
                }
            }
            // otherwise return to IDLE
            return ( body_state_nxt = BodyState(ns_antoc_body_state.IDLE, 0, integrity, stamina, dir, FALSE) );
        } else {
            // If Antoc is too fatigued to perform HORI then and we are not in last frame then signal fatigue and increment counter
            if (intent == ns_antoc_action.HORI) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.VERT, counter + 1, integrity, stamina, dir, TRUE) );
            }
            // increment counter
            return ( body_state_nxt = BodyState(ns_antoc_body_state.VERT, counter + 1, integrity, stamina, dir, FALSE) );
        }

    }

    //
    // Block
    //
    if (state == ns_antoc_body_state.BLOCK) {

        // body responds to stimulus first
        if (stimulus_type == ns_stimulus.HURT) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.HURT, 0, updated_integrity, stamina, dir, FALSE) );
        }
        if (stimulus_type == ns_stimulus.KNOCKED) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.KNOCKED, 0, updated_integrity, stamina, dir, FALSE) );
        }
        if (stimulus_type == ns_stimulus.LAUNCHED) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.LAUNCHED, 0, updated_integrity, stamina, dir, FALSE) );
        }

        // body responds to intent
        if(enough_stamina == TRUE){
            // cancel-able into STEP FORWARD - let's see what happens
            if (intent == ns_antoc_action.STEP_FORWARD) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.STEP_FORWARD, 0, integrity, updated_stamina, dir, FALSE) );
            }

            // if intent remains BLOCK
            if (intent == ns_antoc_action.BLOCK) {
                if (counter == 2) {
                    // if counter reaches active frame (3rd frame; counter == 2) => stay in active frame
                    return ( body_state_nxt = BodyState(ns_antoc_body_state.BLOCK, counter, integrity, updated_stamina, dir, FALSE) );
                } else {
                    // else increment counter
                    return ( body_state_nxt = BodyState(ns_antoc_body_state.BLOCK, counter + 1, integrity, updated_stamina, dir, FALSE) );
                }
            }
        }

        // otherwise return to IDLE
        let (updated_stamina, _) = calculate_stamina_change(stamina, ns_antoc_action.BLOCK, ns_stamina.MAX_STAMINA, ns_character_type.ANTOC);
        return ( body_state_nxt = BodyState(ns_antoc_body_state.IDLE, 0, integrity, updated_stamina, dir, FALSE) );
    }

    //
    // Hurt
    // note: interruptible
    //
    if (state == ns_antoc_body_state.HURT) {

        // interruptible by stimulus
        if (stimulus_type == ns_stimulus.HURT) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.HURT, 0, updated_integrity, stamina, dir, FALSE) );
        }
        if (stimulus_type == ns_stimulus.KNOCKED) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.KNOCKED, 0, updated_integrity, stamina, dir, FALSE) );
        }
        if (stimulus_type == ns_stimulus.LAUNCHED) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.LAUNCHED, 0, updated_integrity, stamina, dir, FALSE) );
        }

        // if counter is full => return to IDLE
        if (counter == ns_antoc_body_state_duration.HURT - 1) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.IDLE, 0, integrity, stamina, dir, FALSE) );
        }

        // else stay in HURT and increment counter
        return ( body_state_nxt = BodyState(ns_antoc_body_state.HURT, counter + 1, integrity, stamina, dir, FALSE) );
    }

    //
    // Knocked
    // note: interruptible
    //
    if (state == ns_antoc_body_state.KNOCKED) {

        // interruptible by stimulus
        if (stimulus_type == ns_stimulus.HURT) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.HURT, 0, updated_integrity, stamina, dir, FALSE) );
        }
        if (stimulus_type == ns_stimulus.KNOCKED) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.KNOCKED, 0, updated_integrity, stamina, dir, FALSE) );
        }
        if (stimulus_type == ns_stimulus.LAUNCHED) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.LAUNCHED, 0, updated_integrity, stamina, dir, FALSE) );
        }

        // if counter is full => return to Idle
        if (counter == ns_antoc_body_state_duration.KNOCKED - 1) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.IDLE, 0, integrity, stamina, dir, FALSE) );
        }

        // if reach counter==6 and still in air => remain in counter==6
        if (counter == 6 and stimulus_type != ns_stimulus.GROUND) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.KNOCKED, counter, integrity, stamina, dir, FALSE) );
        }

        // else stay in KNOCKED and increment counter
        return ( body_state_nxt = BodyState(ns_antoc_body_state.KNOCKED, counter + 1, integrity, stamina, dir, FALSE) );
    }

    //
    // Move forward
    //
    if (state == ns_antoc_body_state.MOVE_FORWARD) {

        // interruptible by stimulus
        if (stimulus_type == ns_stimulus.HURT) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.HURT, 0, updated_integrity, stamina, dir, FALSE) );
        }
        if (stimulus_type == ns_stimulus.KNOCKED) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.KNOCKED, 0, updated_integrity, stamina, dir, FALSE) );
        }
        if (stimulus_type == ns_stimulus.LAUNCHED) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.LAUNCHED, 0, updated_integrity, stamina, dir, FALSE) );
        }

        // interruptible by agent intent (locomotive action has lowest priority)
        if (intent == ns_antoc_action.BLOCK) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.BLOCK, 0, integrity, updated_stamina, dir, FALSE) );
        }
        if(enough_stamina == TRUE){
            if (intent == ns_antoc_action.HORI) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.HORI, 0, integrity, updated_stamina, dir, FALSE) );
            }
            if (intent == ns_antoc_action.VERT) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.VERT, 0, integrity, updated_stamina, dir, FALSE) );
            }
            if (intent == ns_antoc_action.LOW_KICK) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.LOW_KICK, 0, integrity, updated_stamina, dir, FALSE) );
            }
            if (intent == ns_antoc_action.DASH_FORWARD) {
                    return ( body_state_nxt = BodyState(ns_antoc_body_state.DASH_FORWARD, 0, integrity, updated_stamina, dir, FALSE) );
            }
            if (intent == ns_antoc_action.DASH_BACKWARD) {
                    return ( body_state_nxt = BodyState(ns_antoc_body_state.DASH_BACKWARD, 0, integrity, updated_stamina, dir, FALSE) );
            }
            if (intent == ns_antoc_action.JUMP) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.JUMP, 0, integrity, updated_stamina, dir, FALSE) );
            }
            if (intent == ns_antoc_action.STEP_FORWARD) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.STEP_FORWARD, 0, integrity, updated_stamina, dir, FALSE) );
            }
            if (intent == ns_antoc_action.CYCLONE) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.CYCLONE, 0, integrity, updated_stamina, dir, FALSE) );
            }
        }

        // continue moving forward
        if (intent == ns_antoc_action.MOVE_FORWARD) {
            if (counter == ns_antoc_body_state_duration.MOVE_FORWARD - 1) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.MOVE_FORWARD, 0, integrity, updated_stamina, dir, FALSE) );
            } else {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.MOVE_FORWARD, counter + 1, integrity, updated_stamina, dir, FALSE) );
            }
        }

        // able to reverse direction immediately
        if (intent == ns_antoc_action.MOVE_BACKWARD) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.MOVE_BACKWARD, 0, integrity, updated_stamina, dir, FALSE) );
        }

        // otherwise return to idle
        let (updated_stamina, _) = calculate_stamina_change(stamina, ns_antoc_action.MOVE_FORWARD, ns_stamina.MAX_STAMINA, ns_character_type.ANTOC);
        return ( body_state_nxt = BodyState(ns_antoc_body_state.IDLE, 0, integrity, updated_stamina, dir, is_fatigued) );
    }

    //
    // Move backward
    //
    if (state == ns_antoc_body_state.MOVE_BACKWARD) {

        // interruptible by stimulus
        if (stimulus_type == ns_stimulus.HURT) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.HURT, 0, updated_integrity, stamina, dir, FALSE) );
        }
        if (stimulus_type == ns_stimulus.KNOCKED) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.KNOCKED, 0, updated_integrity, stamina, dir, FALSE) );
        }
        if (stimulus_type == ns_stimulus.LAUNCHED) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.LAUNCHED, 0, updated_integrity, stamina, dir, FALSE) );
        }

        // interruptible by agent intent (locomotive action has lowest priority)
        if (intent == ns_antoc_action.BLOCK) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.BLOCK, 0, integrity, updated_stamina, dir, FALSE) );
        }
        if (enough_stamina == TRUE) {
            if (intent == ns_antoc_action.HORI) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.HORI, 0, integrity, updated_stamina, dir, FALSE) );
            }
            if (intent == ns_antoc_action.VERT) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.VERT, 0, integrity, updated_stamina, dir, FALSE) );
            }
            if (intent == ns_antoc_action.LOW_KICK) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.LOW_KICK, 0, integrity, updated_stamina, dir, FALSE) );
            }
            if (intent == ns_antoc_action.DASH_FORWARD) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.DASH_FORWARD, 0, integrity, updated_stamina, dir, FALSE) );
            }
            if (intent == ns_antoc_action.DASH_BACKWARD) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.DASH_BACKWARD, 0, integrity, updated_stamina, dir, FALSE) );
            }
            if (intent == ns_antoc_action.JUMP) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.JUMP, 0, integrity, updated_stamina, dir, FALSE) );
            }
            if (intent == ns_antoc_action.STEP_FORWARD) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.STEP_FORWARD, 0, integrity, updated_stamina, dir, FALSE) );
            }
            if (intent == ns_antoc_action.CYCLONE) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.CYCLONE, 0, integrity, updated_stamina, dir, FALSE) );
            }
        }

        // continue moving forward
        if (intent == ns_antoc_action.MOVE_BACKWARD) {
            if (counter == ns_antoc_body_state_duration.MOVE_BACKWARD - 1) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.MOVE_BACKWARD, 0, integrity, updated_stamina, dir, FALSE) );
            } else {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.MOVE_BACKWARD, counter + 1, integrity, updated_stamina, dir, FALSE) );
            }
        }

        // able to reverse direction immediately
        if (intent == ns_antoc_action.MOVE_FORWARD) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.MOVE_FORWARD, 0, integrity, updated_stamina, dir, FALSE) );
        }

        // otherwise return to idle
        let (updated_stamina, _) = calculate_stamina_change(stamina, ns_antoc_action.MOVE_BACKWARD, ns_stamina.MAX_STAMINA, ns_character_type.ANTOC);
        return ( body_state_nxt = BodyState(ns_antoc_body_state.IDLE, 0, integrity, updated_stamina, dir, is_fatigued) );
    }

    //
    // Dash forward
    // note: DASH is currently uninterruptible by stimulus, meaning it is perfect defense;
    //       need to add cost such as stamina consumption
    //
    if (state == ns_antoc_body_state.DASH_FORWARD) {

        // can cancel dash into JUMP's counter==0 while grounded
        if (enough_stamina == TRUE and stimulus_type == ns_stimulus.GROUND) {
            if (intent == ns_antoc_action.JUMP) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.JUMP, 0, integrity, updated_stamina, dir, FALSE) );
            }
        }

        // can cancel dash into DROP_SLASH's counter==2 while not grounded
        if (enough_stamina == TRUE and stimulus_type != ns_stimulus.GROUND) {
            if (intent == ns_antoc_action.VERT) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.DROP_SLASH, 2, integrity, updated_stamina, dir, FALSE) );
            }
        }

        // last frame reached
        if (counter == ns_antoc_body_state_duration.DASH_FORWARD - 1) {
            // if not grounded => return to JUMP's counter==4
            if (stimulus_type != ns_stimulus.GROUND) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.JUMP, 4, integrity, updated_stamina, dir, FALSE) );
            }

            // continue the dashing if not interrupted by an attack
            // note: not cancellable into attack because of sword's heaviness
            // note: not able to reverse to the opposite dash immediately
            if(enough_stamina == TRUE and intent == ns_antoc_body_state.DASH_FORWARD) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.DASH_FORWARD, 0, integrity, updated_stamina, dir, FALSE) );
            }
            return ( body_state_nxt = BodyState(ns_antoc_body_state.IDLE, 0, integrity, stamina, dir, TRUE) );
        }
        // increment counter
        return ( body_state_nxt = BodyState(ns_antoc_body_state.DASH_FORWARD, counter + 1, integrity, stamina, dir, FALSE) );
    }

    //
    // Dash backward
    //
    if (state == ns_antoc_body_state.DASH_BACKWARD) {

        // can cancel dash into JUMP's counter==0 while grounded
        if (enough_stamina == TRUE and stimulus_type == ns_stimulus.GROUND) {
            if (intent == ns_antoc_action.JUMP) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.JUMP, 0, integrity, updated_stamina, dir, FALSE) );
            }
        }

        // can cancel dash into DROP_SLASH's counter==2 while not grounded
        if (enough_stamina == TRUE and stimulus_type != ns_stimulus.GROUND) {
            if (intent == ns_antoc_action.VERT) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.DROP_SLASH, 2, integrity, updated_stamina, dir, FALSE) );
            }
        }

        // last frame reached
        if (counter == ns_antoc_body_state_duration.DASH_BACKWARD - 1) {
            // if not grounded => return to JUMP's counter==4
            if (stimulus_type != ns_stimulus.GROUND) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.JUMP, 4, integrity, updated_stamina, dir, FALSE) );
            }

            // continue the dashing if not interrupted by an attack
            // note: not cancellable into attack because of sword's heaviness
            // note: not able to reverse to the opposite dash immediately
            if(enough_stamina == TRUE and intent == ns_antoc_body_state.DASH_BACKWARD) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.DASH_BACKWARD, 0, integrity, updated_stamina, dir, FALSE) );
            }
            return ( body_state_nxt = BodyState(ns_antoc_body_state.IDLE, 0, integrity, stamina, dir, TRUE) );
        }
        // increment counter
        return ( body_state_nxt = BodyState(ns_antoc_body_state.DASH_BACKWARD, counter + 1, integrity, stamina, dir, FALSE) );
    }

    //
    // Clash
    // note: interruptible
    //
    if (state == ns_antoc_body_state.CLASH) {

        // interruptible by stimulus
        if (stimulus_type == ns_stimulus.HURT) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.HURT, 0, updated_integrity, stamina, dir, FALSE) );
        }
        if (stimulus_type == ns_stimulus.KNOCKED) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.KNOCKED, 0, updated_integrity, stamina, dir, FALSE) );
        }
        if (stimulus_type == ns_stimulus.LAUNCHED) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.LAUNCHED, 0, updated_integrity, stamina, dir, FALSE) );
        }

        // if counter is full => return to IDLE
        if (counter == ns_antoc_body_state_duration.CLASH - 1) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.IDLE, 0, integrity, stamina, dir, FALSE) );
        }

        // else stay in CLASH and increment counter
        return ( body_state_nxt = BodyState(ns_antoc_body_state.CLASH, counter + 1, integrity, stamina, dir, FALSE) );
    }

    //
    // Jump
    // note: is interruptible
    //
    if ((state-ns_antoc_body_state.JUMP)*(state-ns_antoc_body_state.JUMP_MOVE_FORWARD)*(state-ns_antoc_body_state.JUMP_MOVE_BACKWARD) == 0) {

        // can be knocked
        if (stimulus_type == ns_stimulus.KNOCKED) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.KNOCKED, 0, updated_integrity, stamina, dir, FALSE) );
        }
        // can be launched
        if (stimulus_type == ns_stimulus.LAUNCHED) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.LAUNCHED, 0, updated_integrity, stamina, dir, FALSE) );
        }

        // VERT during counter==1/2/3 can cancel into air attack (drop slash)
        if (intent == ns_antoc_action.VERT and (counter-1)*(counter-2)*(counter-3) == 0) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.DROP_SLASH, 0, integrity, stamina, dir, FALSE) );
        }

        // DASH FORWARD/BACKWARD during counter!=0/4/5 (ie counter==1/2/3) becomes dash forward/backward's counter==0
        // note: this is to prevent multiple air dashes during the same jump
        if ((counter-1) * (counter-2) * (counter-3) == 0) {
            if (intent == ns_antoc_action.DASH_FORWARD) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.DASH_FORWARD, 0, integrity, updated_stamina, dir, FALSE) );
            }
            if (intent == ns_antoc_action.DASH_BACKWARD) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.DASH_BACKWARD, 0, integrity, updated_stamina, dir, FALSE) );
            }
        }

        // if counter is full => return to IDLE
        if (counter == ns_antoc_body_state_duration.JUMP - 1) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.IDLE, 0, integrity, stamina, dir, FALSE) );
        }

        // if reach counter==4 and still in air => remain in counter==4
        if (counter == 4 and stimulus_type != ns_stimulus.GROUND) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.JUMP, counter, integrity, stamina, dir, FALSE) );
        }

        // MOVE FORWARD/BACKWARD during counter!=0/5 (counter == 1/2/3/4) becomes JUMP_MOVE_FORWARD/BACKWARD's counter+1
        if ((counter-1)*(counter-2)*(counter-3)*(counter-4) == 0) {
            if (intent == ns_antoc_action.MOVE_FORWARD) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.JUMP_MOVE_FORWARD, counter+1, integrity, updated_stamina, dir, FALSE) );
            }
            if (intent == ns_antoc_action.MOVE_BACKWARD) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.JUMP_MOVE_BACKWARD, counter+1, integrity, updated_stamina, dir, FALSE) );
            }
        }

        // else stay in JUMP and increment counter
        return ( body_state_nxt = BodyState(ns_antoc_body_state.JUMP, counter + 1, integrity, stamina, dir, FALSE) );
    }

    //
    // Step forward
    // note: is cancel-able into fast VERT
    // note: is interruptible by being hit
    //
    if (state == ns_antoc_body_state.STEP_FORWARD) {

        // interruptible by stimulus
        if (stimulus_type == ns_stimulus.HURT) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.HURT, 0, updated_integrity, stamina, dir, FALSE) );
        }
        if (stimulus_type == ns_stimulus.KNOCKED) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.KNOCKED, 0, updated_integrity, stamina, dir, FALSE) );
        }
        if (stimulus_type == ns_stimulus.LAUNCHED) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.LAUNCHED, 0, updated_integrity, stamina, dir, FALSE) );
        }

        // if having enough stamina => fast cancel into VERT's active frame -1 (counter==2) or LOW_KICK's active frame -1 (counter==2)
        if (enough_stamina == TRUE) {
            if (intent == ns_antoc_action.VERT) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.VERT, 2, integrity, updated_stamina, dir, FALSE) );
            }
            if (intent == ns_antoc_action.LOW_KICK) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.LOW_KICK, 2, integrity, updated_stamina, dir, FALSE) );
            }
        }

        // if counter is full => return to IDLE
        if (counter == ns_antoc_body_state_duration.STEP_FORWARD - 1) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.IDLE, 0, integrity, stamina, dir, FALSE) );
        }

        // else stay in STEP_FORWARD and increment counter
        return ( body_state_nxt = BodyState(ns_antoc_body_state.STEP_FORWARD, counter + 1, integrity, stamina, dir, FALSE) );
    }

    //
    // LOW KICK
    //
    if (state == ns_antoc_body_state.LOW_KICK) {

        // body responds to stimulus first
        if (stimulus_type == ns_stimulus.HURT) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.HURT, 0, updated_integrity, stamina, dir, FALSE) );
        }
        if (stimulus_type == ns_stimulus.KNOCKED) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.KNOCKED, 0, updated_integrity, stamina, dir, FALSE) );
        }
        if (stimulus_type == ns_stimulus.LAUNCHED) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.LAUNCHED, 0, updated_integrity, stamina, dir, FALSE) );
        }
        if (stimulus_type == ns_stimulus.CLASH) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.CLASH, 0, updated_integrity, stamina, dir, FALSE) );
        }

        // body responds to intent
        // LOW_KICK at recovery frame is cancellable into either STEP FORWARD or DASH BACKWARD
        if ((counter-4) * (counter-5) == 0 and enough_stamina == TRUE) {
            if (intent == ns_antoc_action.STEP_FORWARD) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.STEP_FORWARD, 0, integrity, updated_stamina, dir, FALSE) );
            }
            if (intent == ns_antoc_action.DASH_BACKWARD) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.DASH_BACKWARD, 0, integrity, updated_stamina, dir, FALSE) );
            }
        }

        // by default finishing the animation; go to the *second frame* if intent is LOW_KICK at last frame
        if (counter == ns_antoc_body_state_duration.LOW_KICK - 1) {
            if (intent == ns_antoc_action.LOW_KICK and enough_stamina == TRUE) {
                // restart from second frame
                return ( body_state_nxt = BodyState(ns_antoc_body_state.LOW_KICK, 2, integrity, updated_stamina, dir, FALSE) );
            }
            // otherwise return to IDLE
            return ( body_state_nxt = BodyState(ns_antoc_body_state.IDLE, 0, integrity, stamina, dir, FALSE) );
        }

        // otherwise increment counter
        return ( body_state_nxt = BodyState(ns_antoc_body_state.LOW_KICK, counter + 1, integrity, stamina, dir, FALSE) );

    }

    //
    // Launched
    // note: interruptible
    //
    if (state == ns_antoc_body_state.LAUNCHED) {

        // can be knocked
        if (stimulus_type == ns_stimulus.KNOCKED) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.KNOCKED, 0, updated_integrity, stamina, dir, FALSE) );
        }
        // can be juggled
        if (stimulus_type == ns_stimulus.LAUNCHED) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.LAUNCHED, 0, updated_integrity, stamina, dir, FALSE) );
        }

        // if counter is full => return to IDLE
        if (counter == ns_antoc_body_state_duration.LAUNCHED - 1) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.IDLE, 0, integrity, stamina, dir, FALSE) );
        }

        // if reach counter==6 and still in air => remain in counter==6
        if (counter == 6 and stimulus_type != ns_stimulus.GROUND) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.LAUNCHED, counter, integrity, stamina, dir, FALSE) );
        }

        // else stay in LAUNCHED and increment counter
        return ( body_state_nxt = BodyState(ns_antoc_body_state.LAUNCHED, counter + 1, integrity, stamina, dir, FALSE) );
    }

    //
    // DROP SLASH
    // note: is interruptible
    //
    if (state == ns_antoc_body_state.DROP_SLASH) {

        // can be knocked
        if (stimulus_type == ns_stimulus.KNOCKED) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.KNOCKED, 0, updated_integrity, stamina, dir, FALSE) );
        }
        // can be launched
        if (stimulus_type == ns_stimulus.LAUNCHED) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.LAUNCHED, 0, updated_integrity, stamina, dir, FALSE) );
        }

        // if counter is full
        //   not grounded => go to JUMP's counter==4
        //   otherwise return to IDLE
        if (counter == ns_antoc_body_state_duration.DROP_SLASH - 1) {
            if (stimulus_type != ns_stimulus.GROUND) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.JUMP, 4, integrity, stamina, dir, FALSE) );
            } else {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.IDLE, 0, integrity, stamina, dir, FALSE) );
            }
        }

        // else stay in DROP_SLASH and increment counter
        return ( body_state_nxt = BodyState(ns_antoc_body_state.DROP_SLASH, counter + 1, integrity, stamina, dir, FALSE) );
    }

    //
    // CYCLONE
    // note: interruptible by clash
    //
    if (state == ns_antoc_body_state.CYCLONE) {

        if (stimulus_type == ns_stimulus.CLASH) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.CLASH, 0, updated_integrity, stamina, dir, FALSE) );
        }

        // if counter is full => return to IDLE
        if (counter == ns_antoc_body_state_duration.CYCLONE - 1) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.IDLE, 0, integrity, stamina, dir, FALSE) );
        }

        // else stay in CYCLONE and increment counter
        return ( body_state_nxt = BodyState(ns_antoc_body_state.CYCLONE, counter + 1, integrity, stamina, dir, FALSE) );
    }

    // handle exception
    with_attr error_message("Input body state is not recognized.") {
        assert 0 = 1;
    }
    return ( body_state_nxt = BodyState(0,0,0,0,0,0) );
}