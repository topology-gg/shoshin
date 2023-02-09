%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.bool import (TRUE, FALSE)
from contracts.constants.constants import (
    BodyState, ns_stimulus, ns_common_stamina_effect, ns_stamina, ns_character_type
)
from contracts.constants.constants_antoc import (
    ns_antoc_action, ns_antoc_body_state, ns_antoc_body_state_duration, ns_antoc_body_state_qualifiers
)
from contracts.body.body_utils import (
    _settle_stamina_change
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

    // Unpack
    let state = body_state.state;
    let counter = body_state.counter;
    let integrity = body_state.integrity;
    let stamina = body_state.stamina;
    let dir = body_state.dir;

    let hurt_integrity = integrity - 100;
    let knocked_integrity = integrity - 100;

    let default_stamina = calculate_default_stamina(stamina, ns_character_type.ANTOC);
    let updated_stamina = calculate_stamina_change(stamina, intent, ns_stamina.INIT_STAMINA, ns_character_type.ANTOC);

    //
    // Idle
    //
    if (state == ns_antoc_body_state.IDLE) {
        // body responds to stimulus first
        if (stimulus == ns_stimulus.HURT) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.HURT, 0, hurt_integrity , stamina, dir) );
        }
        if (stimulus == ns_stimulus.KNOCKED) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.KNOCKED, 0, knocked_integrity, stamina, dir) );
        }

        // body responds to intent; locomotive action has lowest priority
        if (intent == ns_antoc_action.HORI) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.HORI, 0, integrity, stamina, dir) );
        }
        if (intent == ns_antoc_action.VERT) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.VERT, 0, integrity, stamina, dir) );
        }
        if (intent == ns_antoc_action.BLOCK) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.BLOCK, 0, integrity, stamina, dir) );
        }
        if (intent == ns_antoc_action.DASH_FORWARD) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.DASH_FORWARD, 0, integrity, stamina, dir) );
        }
        if (intent == ns_antoc_action.DASH_BACKWARD) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.DASH_BACKWARD, 0, integrity, stamina, dir) );
        }
        if (intent == ns_antoc_action.MOVE_FORWARD) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.MOVE_FORWARD, 0, integrity, stamina, dir) );
        }
        if (intent == ns_antoc_action.MOVE_BACKWARD) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.MOVE_BACKWARD, 0, integrity, stamina, dir) );
        }

        // otherwise stay in IDLE but increment counter modulo duration
        if (counter == ns_antoc_body_state_duration.IDLE - 1) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.IDLE, 0, integrity, stamina, dir) );
        } else {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.IDLE, counter + 1, integrity, stamina, dir) );
        }
    }

    //
    // HORI
    //
    if (state == ns_antoc_body_state.HORI) {

        // body responds to stimulus first
        if (stimulus == ns_stimulus.HURT) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.HURT, 0, hurt_integrity, stamina, dir) );
        }
        if (stimulus == ns_stimulus.KNOCKED) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.KNOCKED, 0, knocked_integrity, stamina, dir) );
        }

        // note: clash does not interrupt Antoc's attack because of sword's heaviness;
        //       need to balance this carefully
        // if (stimulus == ns_stimulus.CLASH) {

        // by default finishing the animation; go to frame 1 if intent is HORI at last frame
        if (counter == ns_antoc_body_state_duration.HORI - 1) {
            if (intent == ns_antoc_action.HORI) {
                // return to first frame
                return ( body_state_nxt = BodyState(ns_antoc_body_state.HORI, 0, integrity, stamina, dir) );
            } else {
                // otherwise return to IDLE
                return ( body_state_nxt = BodyState(ns_antoc_body_state.IDLE, 0, integrity, stamina, dir) );
            }
        } else {
            // increment counter
            return ( body_state_nxt = BodyState(ns_antoc_body_state.HORI, counter + 1, integrity, stamina, dir) );
        }

    }

    //
    // VERT
    //
    if (state == ns_antoc_body_state.VERT) {

        // body responds to stimulus first
        if (stimulus == ns_stimulus.HURT) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.HURT, 0, hurt_integrity, stamina, dir) );
        }
        if (stimulus == ns_stimulus.KNOCKED) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.KNOCKED, 0, knocked_integrity, stamina, dir) );
        }

        // note: clash does not interrupt Antoc's attack because of sword's heaviness;
        //       need to balance this carefully
        // if (stimulus == ns_stimulus.CLASH) {

        // body responds to intent
        // VERT=>HORI fast transition: able to go directly to HORI's first frame at VERT's frame 8, 9, or 10
        if (intent == ns_antoc_action.HORI) {
            if ( (counter-7) * (counter-8) * (counter-9) == 0 ) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.HORI, 0, integrity, stamina, dir) );
            }
        }

        // by default finishing the animation; go to frame 1 if intent is VERT at last frame
        if (counter == ns_antoc_body_state_duration.VERT - 1) {
            if (intent == ns_antoc_action.VERT) {
                // return to first frame
                return ( body_state_nxt = BodyState(ns_antoc_body_state.VERT, 0, integrity, stamina, dir) );
            } else {
                // otherwise return to IDLE
                return ( body_state_nxt = BodyState(ns_antoc_body_state.IDLE, 0, integrity, stamina, dir) );
            }
        } else {
            // increment counter
            return ( body_state_nxt = BodyState(ns_antoc_body_state.VERT, counter + 1, integrity, stamina, dir) );
        }

    }

    //
    // Block
    //
    if (state == ns_antoc_body_state.BLOCK) {

        // interruptable by being attacked
        let is_in_block_active = ns_antoc_body_state_qualifiers.is_in_block_active(state, counter);
        if (is_in_block_active == 0) {
            if (stimulus == ns_stimulus.HURT) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.HURT, 0, hurt_integrity, stamina, dir) );
            }
            if (stimulus == ns_stimulus.KNOCKED) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.KNOCKED, 0, knocked_integrity, stamina, dir) );
            }
        }

        // if intent remains BLOCK
        if (intent == ns_antoc_action.BLOCK) {
            if (counter == ns_antoc_body_state_duration.BLOCK - 1) {
                // reset counter
                return ( body_state_nxt = BodyState(ns_antoc_body_state.BLOCK, 0, integrity, stamina, dir) );
            } else {
                // increment counter
                return ( body_state_nxt = BodyState(ns_antoc_body_state.BLOCK, counter + 1, integrity, stamina, dir) );
            }
        }

        // otherwise return to IDLE
        return ( body_state_nxt = BodyState(ns_antoc_body_state.IDLE, 0, integrity, stamina, dir) );
    }

    //
    // Hurt
    //
    if (state == ns_antoc_body_state.HURT) {

        // check for interruption
        if (stimulus == ns_stimulus.HURT) {
            // hurt again while in hurt => stay in hurt but reset counter
            return ( body_state_nxt = BodyState(ns_antoc_body_state.HURT, 0, hurt_integrity, stamina, dir) );
        }
        if (stimulus == ns_stimulus.KNOCKED) {
            // knocked while in hurt => worsen into knocked
            return ( body_state_nxt = BodyState(ns_antoc_body_state.KNOCKED, 0, knocked_integrity, stamina, dir) );
        }

        // if counter is full => return to IDLE
        if (counter == ns_antoc_body_state_duration.HURT - 1) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.IDLE, 0, integrity, stamina, dir) );
        }

        // else stay in HURT and increment counter
        return ( body_state_nxt = BodyState(ns_antoc_body_state.HURT, counter + 1, integrity, stamina, dir) );
    }

    //
    // Knocked
    //
    if (state == ns_antoc_body_state.KNOCKED) {

        // check for interruption
        if (stimulus == ns_stimulus.HURT) {
            // hurt while in knocked => stay in knocked and reset counter to a small number
            return ( body_state_nxt = BodyState(ns_antoc_body_state.KNOCKED, 3, hurt_integrity, stamina, dir) );
        }
        if (stimulus == ns_stimulus.KNOCKED) {
            // hurt while in knocked => stay in knocked and reset counter to a small number
            return ( body_state_nxt = BodyState(ns_antoc_body_state.KNOCKED, 3, knocked_integrity, stamina, dir) );
        }

        // if counter is full => return to Idle
        if (counter == ns_antoc_body_state_duration.KNOCKED - 1) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.IDLE, 0, integrity, stamina, dir) );
        }

        // else stay in KNOCKED and increment counter
        return ( body_state_nxt = BodyState(ns_antoc_body_state.KNOCKED, counter + 1, integrity, stamina, dir) );
    }

    //
    // Move forward
    //
    if (state == ns_antoc_body_state.MOVE_FORWARD) {

        // interruptible by stimulus
        if (stimulus == ns_stimulus.HURT) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.HURT, 0, hurt_integrity, stamina, dir) );
        }
        if (stimulus == ns_stimulus.KNOCKED) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.KNOCKED, 0, knocked_integrity, stamina, dir) );
        }

        // interruptible by agent intent (locomotive action has lowest priority)
        if (intent == ns_antoc_action.HORI) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.HORI, 0, integrity, stamina, dir) );
        }
        if (intent == ns_antoc_action.VERT) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.VERT, 0, integrity, stamina, dir) );
        }
        if (intent == ns_antoc_action.BLOCK) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.BLOCK, 0, integrity, stamina, dir) );
        }
        if (intent == ns_antoc_action.DASH_FORWARD) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.DASH_FORWARD, 0, integrity, stamina, dir) );
        }
        if (intent == ns_antoc_action.DASH_BACKWARD) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.DASH_BACKWARD, 0, integrity, stamina, dir) );
        }

        // continue moving forward
        if (intent == ns_antoc_action.MOVE_FORWARD) {
            if (counter == ns_antoc_body_state_duration.MOVE_FORWARD - 1) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.MOVE_FORWARD, 0, integrity, stamina, dir) );
            } else {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.MOVE_FORWARD, counter + 1, integrity, stamina, dir) );
            }
        }

        // able to reverse direction immediately
        if (intent == ns_antoc_action.MOVE_BACKWARD) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.MOVE_BACKWARD, 0, integrity, stamina, dir) );
        }

        // otherwise return to idle
        return ( body_state_nxt = BodyState(ns_antoc_body_state.IDLE, 0, integrity, stamina, dir) );
    }

    //
    // Move backward
    //
    if (state == ns_antoc_body_state.MOVE_BACKWARD) {

        // interruptible by stimulus
        if (stimulus == ns_stimulus.HURT) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.HURT, 0, hurt_integrity, stamina, dir) );
        }
        if (stimulus == ns_stimulus.KNOCKED) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.KNOCKED, 0, knocked_integrity, stamina, dir) );
        }

        // interruptible by agent intent (locomotive action has lowest priority)
        if (intent == ns_antoc_action.HORI) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.HORI, 0, integrity, stamina, dir) );
        }
        if (intent == ns_antoc_action.VERT) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.VERT, 0, integrity, stamina, dir) );
        }
        if (intent == ns_antoc_action.BLOCK) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.BLOCK, 0, integrity, stamina, dir) );
        }
        if (intent == ns_antoc_action.DASH_FORWARD) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.DASH_FORWARD, 0, integrity, stamina, dir) );
        }
        if (intent == ns_antoc_action.DASH_BACKWARD) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.DASH_BACKWARD, 0, integrity, stamina, dir) );
        }

        // continue moving forward
        if (intent == ns_antoc_action.MOVE_BACKWARD) {
            if (counter == ns_antoc_body_state_duration.MOVE_BACKWARD - 1) {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.MOVE_BACKWARD, 0, integrity, stamina, dir) );
            } else {
                return ( body_state_nxt = BodyState(ns_antoc_body_state.MOVE_BACKWARD, counter + 1, integrity, stamina, dir) );
            }
        }

        // able to reverse direction immediately
        if (intent == ns_antoc_action.MOVE_FORWARD) {
            return ( body_state_nxt = BodyState(ns_antoc_body_state.MOVE_FORWARD, 0, integrity, stamina, dir) );
        }

        // otherwise return to idle
        return ( body_state_nxt = BodyState(ns_antoc_body_state.IDLE, 0, integrity, stamina, dir) );
    }

    //
    // Dash forward
    // note: DASH is currently uninterruptible by stimulus, meaning it is perfect defense;
    //       need to add cost such as stamina consumption
    //
    if (state == ns_antoc_body_state.DASH_FORWARD) {

        // note: not cancellable into attack because of sword's heaviness
        // note: not able to reverse to the opposite dash immediately

        // if intent remains DASH_FORWARD
        if (intent == ns_antoc_action.DASH_FORWARD) {
            if (counter == ns_antoc_body_state_duration.DASH_FORWARD - 1) {
                // reset counter
                return ( body_state_nxt = BodyState(ns_antoc_body_state.DASH_FORWARD, 0, integrity, stamina, dir) );
            } else {
                // increment counter
                return ( body_state_nxt = BodyState(ns_antoc_body_state.DASH_FORWARD, counter + 1, integrity, stamina, dir) );
            }
        }

        // otherwise return to IDLE
        return ( body_state_nxt = BodyState(ns_antoc_body_state.IDLE, 0, integrity, stamina, dir) );
    }

    //
    // Dash backward
    //
    if (state == ns_antoc_body_state.DASH_BACKWARD) {

        // note: not cancellable into attack because of sword's heaviness
        // note: not able to reverse to the opposite dash immediately

        // if intent remains DASH_BACKWARD
        if (intent == ns_antoc_action.DASH_BACKWARD) {
            if (counter == ns_antoc_body_state_duration.DASH_BACKWARD - 1) {
                // reset counter
                return ( body_state_nxt = BodyState(ns_antoc_body_state.DASH_BACKWARD, 0, integrity, stamina, dir) );
            } else {
                // increment counter
                return ( body_state_nxt = BodyState(ns_antoc_body_state.DASH_BACKWARD, counter + 1, integrity, stamina, dir) );
            }
        }

        // otherwise return to IDLE
        return ( body_state_nxt = BodyState(ns_antoc_body_state.IDLE, 0, integrity, stamina, dir) );
    }

    with_attr error_message("Input body state is not recognized.") {
        assert 0 = 1;
    }
    return ( body_state_nxt = BodyState(0,0,0,0,0) );
}
