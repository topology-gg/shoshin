%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from contracts.constants import ns_action, ns_stimulus, ns_object_state

func _object{range_check_ptr}(state: felt, stimulus: felt, agent_action: felt) -> (
    state_nxt: felt
) {
    // # what's the generated code pattern for cost-efficient state machine representation?

    if (state == ns_object_state.IDLE_0) {
        // interrupt by stimulus - priority > agent action
        if (stimulus == ns_stimulus.HIT_BY_PUNCH) {
            return (ns_object_state.HIT_0,);
        }

        if (stimulus == ns_stimulus.HIT_BY_POWER) {
            return (ns_object_state.KNOCKED_0,);
        }

        // interrupt by agent action
        if (agent_action == ns_action.PUNCH) {
            return (ns_object_state.PUNCH_STA0,);
        }

        if (agent_action == ns_action.FOCUS) {
            return (ns_object_state.FOCUS_0,);
        }

        if (agent_action == ns_action.BLOCK) {
            return (ns_object_state.BLOCK,);
        }

        // otherwise
        return (ns_object_state.IDLE_1,);
    }

    if (state == ns_object_state.IDLE_1) {
        // interrupt by stimulus - priority > agent action
        if (stimulus == ns_stimulus.HIT_BY_PUNCH) {
            return (ns_object_state.HIT_0,);
        }

        if (stimulus == ns_stimulus.HIT_BY_POWER) {
            return (ns_object_state.KNOCKED_0,);
        }

        // interrupt by agent action
        if (agent_action == ns_action.PUNCH) {
            return (ns_object_state.PUNCH_STA0,);
        }

        if (agent_action == ns_action.FOCUS) {
            return (ns_object_state.FOCUS_0,);
        }

        if (agent_action == ns_action.BLOCK) {
            return (ns_object_state.BLOCK,);
        }

        // otherwise
        return (ns_object_state.IDLE_2,);
    }

    if (state == ns_object_state.IDLE_2) {
        // interrupt by stimulus - priority > agent action
        if (stimulus == ns_stimulus.HIT_BY_PUNCH) {
            return (ns_object_state.HIT_0,);
        }

        if (stimulus == ns_stimulus.HIT_BY_POWER) {
            return (ns_object_state.KNOCKED_0,);
        }

        // interrupt by agent action
        if (agent_action == ns_action.PUNCH) {
            return (ns_object_state.PUNCH_STA0,);
        }

        if (agent_action == ns_action.FOCUS) {
            return (ns_object_state.FOCUS_0,);
        }

        if (agent_action == ns_action.BLOCK) {
            return (ns_object_state.BLOCK,);
        }

        // otherwise
        return (ns_object_state.IDLE_3,);
    }

    if (state == ns_object_state.IDLE_3) {
        // interrupt by stimulus - priority > agent action
        if (stimulus == ns_stimulus.HIT_BY_PUNCH) {
            return (ns_object_state.HIT_0,);
        }

        if (stimulus == ns_stimulus.HIT_BY_POWER) {
            return (ns_object_state.KNOCKED_0,);
        }

        // interrupt by agent action
        if (agent_action == ns_action.PUNCH) {
            return (ns_object_state.PUNCH_STA0,);
        }

        if (agent_action == ns_action.FOCUS) {
            return (ns_object_state.FOCUS_0,);
        }

        if (agent_action == ns_action.BLOCK) {
            return (ns_object_state.BLOCK,);
        }

        // otherwise
        return (ns_object_state.IDLE_4,);
    }

    if (state == ns_object_state.IDLE_4) {
        // interrupt by stimulus - priority > agent action
        if (stimulus == ns_stimulus.HIT_BY_PUNCH) {
            return (ns_object_state.HIT_0,);
        }

        if (stimulus == ns_stimulus.HIT_BY_POWER) {
            return (ns_object_state.KNOCKED_0,);
        }

        // interrupt by agent action
        if (agent_action == ns_action.PUNCH) {
            return (ns_object_state.PUNCH_STA0,);
        }

        if (agent_action == ns_action.FOCUS) {
            return (ns_object_state.FOCUS_0,);
        }

        if (agent_action == ns_action.BLOCK) {
            return (ns_object_state.BLOCK,);
        }

        // otherwise
        return (ns_object_state.IDLE_5,);
    }

    if (state == ns_object_state.IDLE_5) {
        // interrupt by stimulus - priority > agent action
        if (stimulus == ns_stimulus.HIT_BY_PUNCH) {
            return (ns_object_state.HIT_0,);
        }

        if (stimulus == ns_stimulus.HIT_BY_POWER) {
            return (ns_object_state.KNOCKED_0,);
        }

        // interrupt by agent action
        if (agent_action == ns_action.PUNCH) {
            return (ns_object_state.PUNCH_STA0,);
        }

        if (agent_action == ns_action.FOCUS) {
            return (ns_object_state.FOCUS_0,);
        }

        if (agent_action == ns_action.BLOCK) {
            return (ns_object_state.BLOCK,);
        }

        // otherwise
        return (ns_object_state.IDLE_6,);
    }

    if (state == ns_object_state.IDLE_6) {
        // interrupt by stimulus - priority > agent action
        if (stimulus == ns_stimulus.HIT_BY_PUNCH) {
            return (ns_object_state.HIT_0,);
        }

        if (stimulus == ns_stimulus.HIT_BY_POWER) {
            return (ns_object_state.KNOCKED_0,);
        }

        // interrupt by agent action
        if (agent_action == ns_action.PUNCH) {
            return (ns_object_state.PUNCH_STA0,);
        }

        if (agent_action == ns_action.FOCUS) {
            return (ns_object_state.FOCUS_0,);
        }

        if (agent_action == ns_action.BLOCK) {
            return (ns_object_state.BLOCK,);
        }

        // otherwise
        return (ns_object_state.IDLE_7,);
    }

    if (state == ns_object_state.IDLE_7) {
        // interrupt by stimulus - priority > agent action
        if (stimulus == ns_stimulus.HIT_BY_PUNCH) {
            return (ns_object_state.HIT_0,);
        }

        if (stimulus == ns_stimulus.HIT_BY_POWER) {
            return (ns_object_state.KNOCKED_0,);
        }

        // interrupt by agent action
        if (agent_action == ns_action.PUNCH) {
            return (ns_object_state.PUNCH_STA0,);
        }

        if (agent_action == ns_action.FOCUS) {
            return (ns_object_state.FOCUS_0,);
        }

        if (agent_action == ns_action.BLOCK) {
            return (ns_object_state.BLOCK,);
        }

        // otherwise
        return (ns_object_state.IDLE_8,);
    }

    if (state == ns_object_state.IDLE_8) {
        // interrupt by stimulus - priority > agent action
        if (stimulus == ns_stimulus.HIT_BY_PUNCH) {
            return (ns_object_state.HIT_0,);
        }

        if (stimulus == ns_stimulus.HIT_BY_POWER) {
            return (ns_object_state.KNOCKED_0,);
        }

        // interrupt by agent action
        if (agent_action == ns_action.PUNCH) {
            return (ns_object_state.PUNCH_STA0,);
        }

        if (agent_action == ns_action.FOCUS) {
            return (ns_object_state.FOCUS_0,);
        }

        if (agent_action == ns_action.BLOCK) {
            return (ns_object_state.BLOCK,);
        }

        // otherwise
        return (ns_object_state.IDLE_9,);
    }

    if (state == ns_object_state.IDLE_9) {
        // interrupt by stimulus - priority > agent action
        if (stimulus == ns_stimulus.HIT_BY_PUNCH) {
            return (ns_object_state.HIT_0,);
        }

        if (stimulus == ns_stimulus.HIT_BY_POWER) {
            return (ns_object_state.KNOCKED_0,);
        }

        // interrupt by agent action
        if (agent_action == ns_action.PUNCH) {
            return (ns_object_state.PUNCH_STA0,);
        }

        if (agent_action == ns_action.FOCUS) {
            return (ns_object_state.FOCUS_0,);
        }

        if (agent_action == ns_action.BLOCK) {
            return (ns_object_state.BLOCK,);
        }

        // otherwise
        return (ns_object_state.IDLE_0,);
    }

    //
    // Punch
    //
    if (state == ns_object_state.PUNCH_STA0) {
        if (stimulus == ns_stimulus.HIT_BY_PUNCH) {
            return (ns_object_state.HIT_0,);
        }

        if (stimulus == ns_stimulus.HIT_BY_POWER) {
            return (ns_object_state.KNOCKED_0,);
        }

        return (ns_object_state.PUNCH_STA1,);
    }

    if (state == ns_object_state.PUNCH_STA1) {
        if (stimulus == ns_stimulus.HIT_BY_PUNCH) {
            return (ns_object_state.HIT_0,);
        }

        if (stimulus == ns_stimulus.HIT_BY_POWER) {
            return (ns_object_state.KNOCKED_0,);
        }

        return (ns_object_state.PUNCH_STA2,);
    }

    if (state == ns_object_state.PUNCH_STA2) {
        if (stimulus == ns_stimulus.HIT_BY_PUNCH) {
            return (ns_object_state.HIT_0,);
        }

        if (stimulus == ns_stimulus.HIT_BY_POWER) {
            return (ns_object_state.KNOCKED_0,);
        }

        return (ns_object_state.PUNCH_ATK0,);
    }

    if (state == ns_object_state.PUNCH_ATK0) {
        if (stimulus == ns_stimulus.CLASH_BY_PUNCH) {
            return (ns_object_state.HIT_0,);
        }

        return (ns_object_state.PUNCH_ATK1,);
    }

    if (state == ns_object_state.PUNCH_ATK1) {
        return (ns_object_state.PUNCH_REC0,);
    }

    if (state == ns_object_state.PUNCH_REC0) {
        if (stimulus == ns_stimulus.HIT_BY_PUNCH) {
            return (ns_object_state.HIT_0,);
        }

        if (stimulus == ns_stimulus.HIT_BY_POWER) {
            return (ns_object_state.KNOCKED_0,);
        }

        return (ns_object_state.PUNCH_REC1,);
    }

    if (state == ns_object_state.PUNCH_REC1) {
        if (stimulus == ns_stimulus.HIT_BY_PUNCH) {
            return (ns_object_state.HIT_0,);
        }

        if (stimulus == ns_stimulus.HIT_BY_POWER) {
            return (ns_object_state.KNOCKED_0,);
        }

        return (ns_object_state.IDLE_0,);
    }

    //
    // Hit
    //
    // # Consider the case when one combos == land another hit while opponent is in hit state
    if (state == ns_object_state.HIT_0) {
        return (ns_object_state.HIT_1,);
    }

    if (state == ns_object_state.HIT_1) {
        return (ns_object_state.HIT_2,);
    }

    if (state == ns_object_state.HIT_2) {
        return (ns_object_state.HIT_3,);
    }

    if (state == ns_object_state.HIT_3) {
        return (ns_object_state.IDLE_0,);
    }

    //
    // Focus
    //
    if (state == ns_object_state.FOCUS_0) {
        if (agent_action == ns_action.FOCUS) {
            return (ns_object_state.FOCUS_1,);
        } else {
            return (ns_object_state.PUNCH_STA1,);
        }
    }

    if (state == ns_object_state.FOCUS_1) {
        if (agent_action == ns_action.FOCUS) {
            return (ns_object_state.FOCUS_2,);
        } else {
            return (ns_object_state.PUNCH_STA1,);
        }
    }

    if (state == ns_object_state.FOCUS_2) {
        if (agent_action == ns_action.FOCUS) {
            return (ns_object_state.FOCUS_3,);
        } else {
            return (ns_object_state.PUNCH_STA1,);
        }
    }

    if (state == ns_object_state.FOCUS_3) {
        if (agent_action == ns_action.FOCUS) {
            return (ns_object_state.FOCUS_4,);
        } else {
            return (ns_object_state.PUNCH_STA1,);
        }
    }

    if (state == ns_object_state.FOCUS_4) {
        if (agent_action == ns_action.FOCUS) {
            return (ns_object_state.FOCUS_4,);
        } else {
            return (ns_object_state.POWER_ATK0,);
        }
    }

    //
    // Power attack
    //
    if (state == ns_object_state.POWER_ATK0) {
        return (ns_object_state.POWER_ATK1,);
    }

    if (state == ns_object_state.POWER_ATK1) {
        if (stimulus == ns_stimulus.BLOCKED) {
            return (ns_object_state.KNOCKED_0,);
        }

        if (stimulus == ns_stimulus.CLASH_BY_POWER) {
            return (ns_object_state.HIT_0,);
        }

        return (ns_object_state.POWER_ATK2,);
    }

    if (state == ns_object_state.POWER_ATK2) {
        return (ns_object_state.POWER_ATK3,);
    }

    if (state == ns_object_state.POWER_ATK3) {
        if (stimulus == ns_stimulus.BLOCKED) {
            return (ns_object_state.KNOCKED_0,);
        }

        if (stimulus == ns_stimulus.CLASH_BY_POWER) {
            return (ns_object_state.HIT_0,);
        }

        return (ns_object_state.POWER_ATK4,);
    }

    if (state == ns_object_state.POWER_ATK4) {
        return (ns_object_state.POWER_ATK5,);
    }

    if (state == ns_object_state.POWER_ATK5) {
        if (stimulus == ns_stimulus.BLOCKED) {
            return (ns_object_state.KNOCKED_0,);
        }

        if (stimulus == ns_stimulus.CLASH_BY_POWER) {
            return (ns_object_state.HIT_0,);
        }

        return (ns_object_state.PUNCH_REC0,);
    }

    //
    // Knock
    //
    if (state == ns_object_state.KNOCKED_0) {
        return (ns_object_state.KNOCKED_1,);
    }

    if (state == ns_object_state.KNOCKED_1) {
        return (ns_object_state.KNOCKED_2,);
    }

    if (state == ns_object_state.KNOCKED_2) {
        return (ns_object_state.KNOCKED_3,);
    }

    if (state == ns_object_state.KNOCKED_3) {
        return (ns_object_state.KNOCKED_4,);
    }

    if (state == ns_object_state.KNOCKED_4) {
        return (ns_object_state.KNOCKED_5,);
    }

    if (state == ns_object_state.KNOCKED_5) {
        return (ns_object_state.KNOCKED_6,);
    }

    if (state == ns_object_state.KNOCKED_6) {
        return (ns_object_state.KNOCKED_7,);
    }

    if (state == ns_object_state.KNOCKED_7) {
        return (ns_object_state.KNOCKED_8,);
    }

    if (state == ns_object_state.KNOCKED_8) {
        return (ns_object_state.KNOCKED_9,);
    }

    if (state == ns_object_state.KNOCKED_9) {
        return (ns_object_state.KNOCKED_10,);
    }

    if (state == ns_object_state.KNOCKED_10) {
        return (ns_object_state.KNOCKED_11,);
    }

    if (state == ns_object_state.KNOCKED_11) {
        return (ns_object_state.IDLE_0,);
    }

    //
    // Block
    //
    if (state == ns_object_state.BLOCK) {
        if (agent_action == ns_action.BLOCK) {
            return (ns_object_state.BLOCK,);
        }

        return (ns_object_state.IDLE_0,);
    }

    with_attr error_message("Input state not recognized.") {
        assert 0 = 1;
    }
    return (0,);
}
