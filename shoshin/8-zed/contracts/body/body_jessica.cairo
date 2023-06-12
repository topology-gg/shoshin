%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.bool import (TRUE, FALSE)
from contracts.constants.constants import (
    BodyState, ns_stimulus, ns_stamina, ns_character_type, HURT_EFFECT, KNOCKED_EFFECT, CLASH_EFFECT
)
from contracts.constants.constants_jessica import (
    ns_jessica_action, ns_jessica_body_state, ns_jessica_body_state_duration, ns_jessica_body_state_qualifiers
)
from contracts.body.body_utils import (
    calculate_stamina_change
)
//
// Jessica's Body State Diagram
//
func _body_jessica {range_check_ptr}(
        body_state: BodyState, stimulus: felt, intent: felt
    ) -> (
        body_state_nxt: BodyState
) {
    alloc_locals;

    // Unpack
    let state = body_state.state;
    let counter = body_state.counter;
    let integrity = body_state.integrity;
    let stamina = body_state.stamina;
    let dir = body_state.dir;

    let hurt_integrity = integrity - HURT_EFFECT;
    let knocked_integrity = integrity - KNOCKED_EFFECT;
    let clash_integrity = integrity - CLASH_EFFECT;

    let (updated_stamina, enough_stamina) = calculate_stamina_change(stamina, intent, ns_stamina.INIT_STAMINA, ns_character_type.JESSICA);

    let is_fatigued = 1 - enough_stamina;

    //
    // Idle
    //
    if (state == ns_jessica_body_state.IDLE) {

        // body responds to stimulus first
        if (stimulus == ns_stimulus.HURT) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.HURT, 0, hurt_integrity, stamina, dir, FALSE) );
        }
        if (stimulus == ns_stimulus.KNOCKED) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.KNOCKED, 0, knocked_integrity, stamina, dir, FALSE) );
        }

        // body responds to intent; locomotive action has lowest priority
        if (intent == ns_jessica_action.MOVE_FORWARD) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.MOVE_FORWARD, 0, integrity, updated_stamina, dir, FALSE) );
        }
        if (intent == ns_jessica_action.MOVE_BACKWARD) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.MOVE_BACKWARD, 0, integrity, updated_stamina, dir, FALSE) );
        }
        if(enough_stamina == TRUE){
            if (intent == ns_jessica_action.BLOCK) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.BLOCK, 0, integrity, stamina, dir, FALSE) );
            }
            if (intent == ns_jessica_action.SLASH) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.SLASH, 0, integrity, updated_stamina, dir, FALSE) );
            }
            if (intent == ns_jessica_action.UPSWING) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.UPSWING, 0, integrity, updated_stamina, dir, FALSE) );
            }
            if (intent == ns_jessica_action.SIDECUT) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.SIDECUT, 0, integrity, updated_stamina, dir, FALSE) );
            }
            if (intent == ns_jessica_action.DASH_FORWARD) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.DASH_FORWARD, 0, integrity, updated_stamina, dir, FALSE) );
            }
            if (intent == ns_jessica_action.DASH_BACKWARD) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.DASH_BACKWARD, 0, integrity, updated_stamina, dir, FALSE) );
            }
            if (intent == ns_jessica_action.JUMP) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.JUMP, 0, integrity, updated_stamina, dir, FALSE) );
            }
        }

        // otherwise stay in IDLE but increment counter modulo duration
        let (updated_stamina, _) = calculate_stamina_change(stamina, ns_jessica_action.NULL, ns_stamina.INIT_STAMINA, ns_character_type.JESSICA);
        if (counter == ns_jessica_body_state_duration.IDLE - 1) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.IDLE, 0, integrity, updated_stamina, dir, is_fatigued) );
        } else {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.IDLE, counter + 1, integrity, updated_stamina, dir, is_fatigued) );
        }
    }

    //
    // Slash
    //
    if (state == ns_jessica_body_state.SLASH) {

        // body responds to stimulus first
        if (stimulus == ns_stimulus.HURT) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.HURT, 0, hurt_integrity, stamina, dir, FALSE) );
        }
        if (stimulus == ns_stimulus.KNOCKED) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.KNOCKED, 0, knocked_integrity, stamina, dir, FALSE) );
        }
        if (stimulus == ns_stimulus.CLASH) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.CLASH, 0, clash_integrity, stamina, dir, FALSE) );
        }

        // by default finishing the animation; go to frame 1 if intent is SLASH at last frame
        if (counter == ns_jessica_body_state_duration.SLASH - 1) {
            if (intent == ns_jessica_action.SLASH) {
                // return to first frame
                if(enough_stamina == TRUE){
                    return ( body_state_nxt = BodyState(ns_jessica_body_state.SLASH, 0, integrity, updated_stamina, dir, FALSE) );
                } else {
                    return ( body_state_nxt = BodyState(ns_jessica_body_state.IDLE, 0, integrity, stamina, dir, TRUE) );
                }
            }
            // otherwise return to IDLE
            return ( body_state_nxt = BodyState(ns_jessica_body_state.IDLE, 0, integrity, stamina, dir, FALSE) );
        } else {
            // increment counter
            return ( body_state_nxt = BodyState(ns_jessica_body_state.SLASH, counter + 1, integrity, stamina, dir, FALSE) );
        }

    }


    //
    // Upswing
    //
    if (state == ns_jessica_body_state.UPSWING) {

        // body responds to stimulus first
        if (stimulus == ns_stimulus.HURT) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.HURT, 0, hurt_integrity, stamina, dir, FALSE) );
        }
        if (stimulus == ns_stimulus.KNOCKED) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.KNOCKED, 0, knocked_integrity, stamina, dir, FALSE) );
        }
        if (stimulus == ns_stimulus.CLASH) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.CLASH, 0, clash_integrity, stamina, dir, FALSE) );
        }

        // by default finishing the animation; go to frame 1 if intent is UPSWING at last frame
        if (counter == ns_jessica_body_state_duration.UPSWING - 1) {
            if (intent == ns_jessica_action.UPSWING) {
                if (enough_stamina == TRUE) {
                    // return to first frame
                    return ( body_state_nxt = BodyState(ns_jessica_body_state.UPSWING, 0, integrity, updated_stamina, dir, FALSE) );
                } else {
                    return ( body_state_nxt = BodyState(ns_jessica_body_state.IDLE, 0, integrity, stamina, dir, TRUE) );
                }
            }
            // otherwise return to IDLE
            return ( body_state_nxt = BodyState(ns_jessica_body_state.IDLE, 0, integrity, stamina, dir, FALSE) );
        } else {
            // increment counter
            return ( body_state_nxt = BodyState(ns_jessica_body_state.UPSWING, counter + 1, integrity, stamina, dir, FALSE) );
        }

    }

    //
    // Sidecut
    //
    if (state == ns_jessica_body_state.SIDECUT) {

        // body responds to stimulus first
        if (stimulus == ns_stimulus.HURT) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.HURT, 0, hurt_integrity, stamina, dir, FALSE) );
        }
        if (stimulus == ns_stimulus.KNOCKED) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.KNOCKED, 0, knocked_integrity, stamina, dir, FALSE) );
        }
        if (stimulus == ns_stimulus.CLASH) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.CLASH, 0, clash_integrity, stamina, dir, FALSE) );
        }

        // by default finishing the animation; go to frame 1 if intent is SIDECUT at last frame
        if (counter == ns_jessica_body_state_duration.SIDECUT - 1) {
            if (intent == ns_jessica_action.SIDECUT) {
                if (enough_stamina == TRUE) {
                    // return to first frame
                    return ( body_state_nxt = BodyState(ns_jessica_body_state.SIDECUT, 0, integrity, updated_stamina, dir, FALSE) );
                } else {
                    return ( body_state_nxt = BodyState(ns_jessica_body_state.IDLE, 0, integrity, stamina, dir, TRUE) );
                }
            }
            // otherwise return to IDLE
            return ( body_state_nxt = BodyState(ns_jessica_body_state.IDLE, 0, integrity, stamina, dir, FALSE) );
        } else {
            // increment counter
            return ( body_state_nxt = BodyState(ns_jessica_body_state.SIDECUT, counter + 1, integrity, stamina, dir, FALSE) );
        }

    }

    //
    // Block
    //
    if (state == ns_jessica_body_state.BLOCK) {

        // body responds to stimulus first
        if (stimulus == ns_stimulus.HURT) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.HURT, 0, hurt_integrity, stamina, dir, FALSE) );
        }
        if (stimulus == ns_stimulus.KNOCKED) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.KNOCKED, 0, knocked_integrity, stamina, dir, FALSE) );
        }

        // body responds to intent
        if (intent == ns_jessica_action.BLOCK) {
            // check stamina
            if(enough_stamina == TRUE){
                if (counter == 1) {
                    // if counter reaches active frame (2nd frame; counter == 1) => stay in active frame
                    return ( body_state_nxt = BodyState(ns_jessica_body_state.BLOCK, counter, integrity, updated_stamina, dir, FALSE) );
                } else {
                    // else increment counter
                    return ( body_state_nxt = BodyState(ns_jessica_body_state.BLOCK, counter + 1, integrity, updated_stamina, dir, FALSE) );
                }
            }
        }

        // otherwise return to IDLE
        let (updated_stamina, _) = calculate_stamina_change(stamina, ns_jessica_action.BLOCK, ns_stamina.INIT_STAMINA, ns_character_type.JESSICA);
        return ( body_state_nxt = BodyState(ns_jessica_body_state.IDLE, 0, integrity, updated_stamina, dir, FALSE) );
    }

    //
    // Clash
    // note: is interruptible
    //
    if (state == ns_jessica_body_state.CLASH) {

        // body responds to stimulus first
        if (stimulus == ns_stimulus.HURT) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.HURT, 0, hurt_integrity, stamina, dir, FALSE) );
        }
        if (stimulus == ns_stimulus.KNOCKED) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.KNOCKED, 0, knocked_integrity, stamina, dir, FALSE) );
        }

        // if counter is full => return to IDLE
        if (counter == ns_jessica_body_state_duration.CLASH - 1) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.IDLE, 0, integrity, stamina, dir, FALSE) );
        }

        // else stay in CLASH and increment counter
        return ( body_state_nxt = BodyState(ns_jessica_body_state.CLASH, counter + 1, integrity, stamina, dir, FALSE) );
    }

    //
    // Hurt
    // note: uninterruptible
    //
    if (state == ns_jessica_body_state.HURT) {

        // if counter is full => return to IDLE
        if (counter == ns_jessica_body_state_duration.HURT - 1) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.IDLE, 0, integrity, stamina, dir, FALSE) );
        }

        // else stay in HURT and increment counter
        return ( body_state_nxt = BodyState(ns_jessica_body_state.HURT, counter + 1, integrity, stamina, dir, FALSE) );
    }

    //
    // Knocked
    // note: uninterruptible
    //
    if (state == ns_jessica_body_state.KNOCKED) {

        // if counter is full => return to Idle
        if (counter == ns_jessica_body_state_duration.KNOCKED - 1) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.IDLE, 0, integrity, stamina, dir, FALSE) );
        }

        // if reach counter==5 and still in air => remain in counter==5
        if (counter == 5 and stimulus != ns_stimulus.GROUND) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.KNOCKED, counter, integrity, stamina, dir, FALSE) );
        }

        // else increment counter
        return ( body_state_nxt = BodyState(ns_jessica_body_state.KNOCKED, counter + 1, integrity, stamina, dir, FALSE) );
    }

    //
    // Move forward
    //
    if (state == ns_jessica_body_state.MOVE_FORWARD) {

        // interruptible by stimulus
        if (stimulus == ns_stimulus.HURT) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.HURT, 0, hurt_integrity, stamina, dir, FALSE) );
        }
        if (stimulus == ns_stimulus.KNOCKED) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.KNOCKED, 0, knocked_integrity, stamina, dir, FALSE) );
        }

        // interruptible by agent intent (locomotive action has lowest priority)
        if(enough_stamina == TRUE){
            if (intent == ns_jessica_action.BLOCK) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.BLOCK, 0, integrity, stamina, dir, FALSE) );
            }
            if (intent == ns_jessica_action.SLASH) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.SLASH, 0, integrity, stamina, dir, FALSE) );
            }
            if (intent == ns_jessica_action.UPSWING) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.UPSWING, 0, integrity, stamina, dir, FALSE) );
            }
            if (intent == ns_jessica_action.SIDECUT) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.SIDECUT, 0, integrity, stamina, dir, FALSE) );
            }
            if (intent == ns_jessica_action.JUMP) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.JUMP, 0, integrity, updated_stamina, dir, FALSE) );
            }
        }

        // continue moving forward
        if (intent == ns_jessica_action.MOVE_FORWARD) {
            if (counter == ns_jessica_body_state_duration.MOVE_FORWARD - 1) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.MOVE_FORWARD, 0, integrity, updated_stamina, dir, is_fatigued) );
            } else {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.MOVE_FORWARD, counter + 1, integrity, updated_stamina, dir, is_fatigued) );
            }
        }

        // able to reverse direction immediately
        if (intent == ns_jessica_action.MOVE_BACKWARD) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.MOVE_BACKWARD, 0, integrity, updated_stamina, dir, is_fatigued) );
        }

        // otherwise return to idle
        let (updated_stamina, _) = calculate_stamina_change(stamina, ns_jessica_action.MOVE_FORWARD, ns_stamina.INIT_STAMINA, ns_character_type.JESSICA);
        return ( body_state_nxt = BodyState(ns_jessica_body_state.IDLE, 0, integrity, updated_stamina, dir, is_fatigued) );
    }

    //
    // Move backward
    //
    if (state == ns_jessica_body_state.MOVE_BACKWARD) {

        // interruptible by stimulus
        if (stimulus == ns_stimulus.HURT) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.HURT, 0, hurt_integrity, stamina, dir, FALSE) );
        }
        if (stimulus == ns_stimulus.KNOCKED) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.KNOCKED, 0, knocked_integrity, stamina, dir, FALSE) );
        }

        // interruptible by agent intent (locomotive action has lowest priority)
        if(enough_stamina == TRUE){
            if (intent == ns_jessica_action.BLOCK) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.BLOCK, 0, integrity, stamina, dir, FALSE) );
            }
            if (intent == ns_jessica_action.SLASH) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.SLASH, 0, integrity, stamina, dir, FALSE) );
            }
            if (intent == ns_jessica_action.UPSWING) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.UPSWING, 0, integrity, stamina, dir, FALSE) );
            }
            if (intent == ns_jessica_action.SIDECUT) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.SIDECUT, 0, integrity, stamina, dir, FALSE) );
            }
            if (intent == ns_jessica_action.JUMP) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.JUMP, 0, integrity, updated_stamina, dir, FALSE) );
            }
        }

        // continue moving forward
        if (intent == ns_jessica_action.MOVE_BACKWARD) {
            if (counter == ns_jessica_body_state_duration.MOVE_BACKWARD - 1) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.MOVE_BACKWARD, 0, integrity, updated_stamina, dir, is_fatigued) );
            } else {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.MOVE_BACKWARD, counter + 1, integrity, updated_stamina, dir, is_fatigued) );
            }
        }

        // able to reverse direction immediately
        if (intent == ns_jessica_action.MOVE_FORWARD) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.MOVE_FORWARD, 0, integrity, updated_stamina, dir, is_fatigued) );
        }

        // otherwise return to idle
        let (updated_stamina, _) = calculate_stamina_change(stamina, ns_jessica_action.MOVE_BACKWARD, ns_stamina.INIT_STAMINA, ns_character_type.JESSICA);
        return ( body_state_nxt = BodyState(ns_jessica_body_state.IDLE, 0, integrity, updated_stamina, dir, is_fatigued) );
    }

    //
    // Dash forward
    // note: DASH is currently uninterruptible by stimulus, meaning it is perfect defense;
    //       plus it can be canceled directly into the active frame of various attacks, making it insanely powerful;
    //       need to add cost such as stamina consumption
    //
    if (state == ns_jessica_body_state.DASH_FORWARD) {


        if(enough_stamina == TRUE) {
            // interruptible by offensive intent
            if (intent == ns_jessica_action.SLASH) {
                // go straight to SLASH's active frame
                return ( body_state_nxt = BodyState(ns_jessica_body_state.SLASH, 2, integrity, stamina, dir, FALSE) );
            }
            if (intent == ns_jessica_action.UPSWING) {
                // go straight to UPSWING's active frame
                return ( body_state_nxt = BodyState(ns_jessica_body_state.UPSWING, 2, integrity, updated_stamina, dir, FALSE) );
            }
            if (intent == ns_jessica_action.SIDECUT) {
                // go straight to SIDECUT's active frame
                return ( body_state_nxt = BodyState(ns_jessica_body_state.SIDECUT, 2, integrity, updated_stamina, dir, FALSE) );
            }

            // interruptible by jump
            if (intent == ns_jessica_action.JUMP) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.JUMP, 0, integrity, updated_stamina, dir, FALSE) );
            }
        }


        // continue the dashing if not interrupted by an attack
        if (counter == ns_jessica_body_state_duration.DASH_FORWARD - 1) {
            if(enough_stamina == TRUE and intent == ns_jessica_body_state_duration.DASH_FORWARD){
                // reset counter
                return ( body_state_nxt = BodyState(ns_jessica_body_state.DASH_FORWARD, 0, integrity, updated_stamina, dir, FALSE) );
            }
            return ( body_state_nxt = BodyState(ns_jessica_body_state.IDLE, 0, integrity, stamina, dir, TRUE) );
        }
        // increment counter
        return ( body_state_nxt = BodyState(ns_jessica_body_state.DASH_FORWARD, counter + 1, integrity, stamina, dir, FALSE) );
    }

    //
    // Dash backward
    //
    if (state == ns_jessica_body_state.DASH_BACKWARD) {

        if(enough_stamina == TRUE){
            // interruptible by offensive intent
            if (intent == ns_jessica_action.SLASH) {
                // go straight to SLASH's active frame
                return ( body_state_nxt = BodyState(ns_jessica_body_state.SLASH, 2, integrity, updated_stamina, dir, FALSE) );
            }
            if (intent == ns_jessica_action.UPSWING) {
                // go straight to UPSWING's active frame
                return ( body_state_nxt = BodyState(ns_jessica_body_state.UPSWING, 2, integrity, updated_stamina, dir, FALSE) );
            }
            if (intent == ns_jessica_action.SIDECUT) {
                // go straight to SIDECUT's active frame
                return ( body_state_nxt = BodyState(ns_jessica_body_state.SIDECUT, 2, integrity, updated_stamina, dir, FALSE) );
            }

            // interruptible by jump
            if (intent == ns_jessica_action.JUMP) {
                return ( body_state_nxt = BodyState(ns_jessica_body_state.JUMP, 0, integrity, updated_stamina, dir, FALSE) );
            }
        }

        // continue the dashing if not interrupted by an attack
        if (counter == ns_jessica_body_state_duration.DASH_BACKWARD - 1) {
            if(enough_stamina == TRUE and intent == ns_jessica_body_state_duration.DASH_BACKWARD) {
                // reset counter
                return ( body_state_nxt = BodyState(ns_jessica_body_state.DASH_BACKWARD, 0, integrity, updated_stamina, dir, FALSE) );
            }
            return ( body_state_nxt = BodyState(ns_jessica_body_state.IDLE, 0, integrity, stamina, dir, TRUE) );
        }
        // increment counter
        return ( body_state_nxt = BodyState(ns_jessica_body_state.DASH_BACKWARD, counter + 1, integrity, stamina, dir, FALSE) );
    }

    //
    // Jump
    // note: is interruptible
    //
    if (state == ns_jessica_body_state.JUMP) {

        // can be knocked
        if (stimulus == ns_stimulus.KNOCKED) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.KNOCKED, 0, knocked_integrity, stamina, dir, FALSE) );
        }

        // if counter is full => return to IDLE
        if (counter == ns_jessica_body_state_duration.JUMP - 1) {
            return ( body_state_nxt = BodyState(ns_jessica_body_state.IDLE, 0, integrity, stamina, dir, FALSE) );
        }

        // else stay in CLASH and increment counter
        return ( body_state_nxt = BodyState(ns_jessica_body_state.JUMP, counter + 1, integrity, stamina, dir, FALSE) );
    }


    with_attr error_message("Input body state is not recognized.") {
        assert 0 = 1;
    }
    return ( body_state_nxt = BodyState(0,0,0,0,0, 0) );
}
