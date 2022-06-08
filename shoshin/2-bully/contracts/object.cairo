%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from contracts.constants import (
    ns_action, ns_stimulus, ns_object_state
)

func _compute_object_next_state {range_check_ptr} (
        state : felt,
        stimulus : felt,
        agent_action : felt
    ) -> (state_nxt : felt):

    ## what's the generated code pattern for cost-efficient state machine representation?

    if state == ns_object_state.IDLE_0:
        # interrupt by stimulus - priority > agent action
        if stimulus == ns_stimulus.HIT_BY_PUNCH:
            return (ns_object_state.HIT_0)
        end

        # interrupt by agent action
        if agent_action == ns_action.PUNCH:
            return (ns_object_state.PUNCH_STA0)
        end

        # otherwise
        return (ns_object_state.IDLE_1)
    end

    if state == ns_object_state.IDLE_1:
        # interrupt by stimulus - priority > agent action
        if stimulus == ns_stimulus.HIT_BY_PUNCH:
            return (ns_object_state.HIT_0)
        end

        # interrupt by agent action
        if agent_action == ns_action.PUNCH:
            return (ns_object_state.PUNCH_STA0)
        end

        # otherwise
        return (ns_object_state.IDLE_2)
    end

    if state == ns_object_state.IDLE_2:
        # interrupt by stimulus - priority > agent action
        if stimulus == ns_stimulus.HIT_BY_PUNCH:
            return (ns_object_state.HIT_0)
        end

        # interrupt by agent action
        if agent_action == ns_action.PUNCH:
            return (ns_object_state.PUNCH_STA0)
        end

        # otherwise
        return (ns_object_state.IDLE_3)
    end

    if state == ns_object_state.IDLE_3:
        # interrupt by stimulus - priority > agent action
        if stimulus == ns_stimulus.HIT_BY_PUNCH:
            return (ns_object_state.HIT_0)
        end

        # interrupt by agent action
        if agent_action == ns_action.PUNCH:
            return (ns_object_state.PUNCH_STA0)
        end

        # otherwise
        return (ns_object_state.IDLE_4)
    end

    if state == ns_object_state.IDLE_4:
        # interrupt by stimulus - priority > agent action
        if stimulus == ns_stimulus.HIT_BY_PUNCH:
            return (ns_object_state.HIT_0)
        end

        # interrupt by agent action
        if agent_action == ns_action.PUNCH:
            return (ns_object_state.PUNCH_STA0)
        end

        # otherwise
        return (ns_object_state.IDLE_5)
    end

    if state == ns_object_state.IDLE_5:
        # interrupt by stimulus - priority > agent action
        if stimulus == ns_stimulus.HIT_BY_PUNCH:
            return (ns_object_state.HIT_0)
        end

        # interrupt by agent action
        if agent_action == ns_action.PUNCH:
            return (ns_object_state.PUNCH_STA0)
        end

        # otherwise
        return (ns_object_state.IDLE_6)
    end

    if state == ns_object_state.IDLE_6:
        # interrupt by stimulus - priority > agent action
        if stimulus == ns_stimulus.HIT_BY_PUNCH:
            return (ns_object_state.HIT_0)
        end

        # interrupt by agent action
        if agent_action == ns_action.PUNCH:
            return (ns_object_state.PUNCH_STA0)
        end

        # otherwise
        return (ns_object_state.IDLE_7)
    end

    if state == ns_object_state.IDLE_7:
        # interrupt by stimulus - priority > agent action
        if stimulus == ns_stimulus.HIT_BY_PUNCH:
            return (ns_object_state.HIT_0)
        end

        # interrupt by agent action
        if agent_action == ns_action.PUNCH:
            return (ns_object_state.PUNCH_STA0)
        end

        # otherwise
        return (ns_object_state.IDLE_8)
    end

    if state == ns_object_state.IDLE_8:
        # interrupt by stimulus - priority > agent action
        if stimulus == ns_stimulus.HIT_BY_PUNCH:
            return (ns_object_state.HIT_0)
        end

        # interrupt by agent action
        if agent_action == ns_action.PUNCH:
            return (ns_object_state.PUNCH_STA0)
        end

        # otherwise
        return (ns_object_state.IDLE_9)
    end

    if state == ns_object_state.IDLE_9:
        # interrupt by stimulus - priority > agent action
        if stimulus == ns_stimulus.HIT_BY_PUNCH:
            return (ns_object_state.HIT_0)
        end

        # interrupt by agent action
        if agent_action == ns_action.PUNCH:
            return (ns_object_state.PUNCH_STA0)
        end

        # otherwise
        return (ns_object_state.IDLE_0)
    end

    if state == ns_object_state.PUNCH_STA0:
        return (ns_object_state.PUNCH_STA1)
    end

    if state == ns_object_state.PUNCH_STA1:
        return (ns_object_state.PUNCH_STA2)
    end

    if state == ns_object_state.PUNCH_STA2:
        return (ns_object_state.PUNCH_ATK0)
    end

    if state == ns_object_state.PUNCH_ATK0:
        return (ns_object_state.PUNCH_ATK1)
    end

    if state == ns_object_state.PUNCH_ATK1:
        return (ns_object_state.PUNCH_REC0)
    end

    if state == ns_object_state.PUNCH_REC0:
        return (ns_object_state.PUNCH_REC1)
    end

    if state == ns_object_state.PUNCH_REC1:
        return (ns_object_state.IDLE_0)
    end

    ## Consider the case when one combos == land another hit while opponent is in hit state
    if state == ns_object_state.HIT_0:
        return (ns_object_state.HIT_1)
    end

    if state == ns_object_state.HIT_1:
        return (ns_object_state.HIT_2)
    end

    if state == ns_object_state.HIT_2:
        return (ns_object_state.HIT_3)
    end

    if state == ns_object_state.HIT_3:
        return (ns_object_state.IDLE_0)
    end

    with_attr error_message ("Input state not recognized."):
        assert 0 = 1
    end
    return (0)
end
