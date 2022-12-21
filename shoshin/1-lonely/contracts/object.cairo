%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from contracts.constants import ns_action, ns_object_state, Vec2_fp, AgentFrameState

func _compute_object_next_state{range_check_ptr}(state: felt, agent_action: felt) -> (
    state_nxt: felt
) {
    // # what's the generated code pattern for cost-efficient state machine representation?

    if (state == ns_object_state.IDLE_0) {
        // interrupt by environment
        // return ()

        // interrupt by agent action
        if (agent_action == ns_action.PUNCH) {
            return (ns_object_state.PUNCH_STA0,);
        }

        // otherwise
        return (ns_object_state.IDLE_1,);
    }

    if (state == ns_object_state.IDLE_1) {
        // interrupt by agent action
        if (agent_action == ns_action.PUNCH) {
            return (ns_object_state.PUNCH_STA0,);
        }

        // otherwise
        return (ns_object_state.IDLE_2,);
    }

    if (state == ns_object_state.IDLE_2) {
        // interrupt by agent action
        if (agent_action == ns_action.PUNCH) {
            return (ns_object_state.PUNCH_STA0,);
        }

        // otherwise
        return (ns_object_state.IDLE_3,);
    }

    if (state == ns_object_state.IDLE_3) {
        // interrupt by agent action
        if (agent_action == ns_action.PUNCH) {
            return (ns_object_state.PUNCH_STA0,);
        }

        // otherwise
        return (ns_object_state.IDLE_0,);
    }

    if (state == ns_object_state.PUNCH_STA0) {
        return (ns_object_state.PUNCH_STA1,);
    }

    if (state == ns_object_state.PUNCH_STA1) {
        return (ns_object_state.PUNCH_STA2,);
    }

    if (state == ns_object_state.PUNCH_STA2) {
        return (ns_object_state.PUNCH_ATK0,);
    }

    if (state == ns_object_state.PUNCH_ATK0) {
        return (ns_object_state.PUNCH_ATK1,);
    }

    if (state == ns_object_state.PUNCH_ATK1) {
        return (ns_object_state.PUNCH_REC0,);
    }

    if (state == ns_object_state.PUNCH_REC0) {
        return (ns_object_state.PUNCH_REC1,);
    }

    if (state == ns_object_state.PUNCH_REC1) {
        return (ns_object_state.IDLE_0,);
    }

    with_attr error_message("Input state not recognized.") {
        assert 0 = 1;
    }
    return (0,);
}

// @event
// func event_array (arr_len : felt, arr : AgentFrameState*):
// end

// @view
// func trigger_event_array_emission {syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr} (
//     ) -> ():

// let (arr : AgentFrameState*) = alloc ()
//     assert arr[0] = AgentFrameState (0, Vec2_fp(0,1))
//     assert arr[1] = AgentFrameState (0, Vec2_fp(2,3))
//     assert arr[2] = AgentFrameState (0, Vec2_fp(4,5))
//     assert arr[3] = AgentFrameState (0, Vec2_fp(6,7))
//     assert arr[4] = AgentFrameState (0, Vec2_fp(8,9))

// event_array.emit (
//         arr_len = 5,
//         arr = arr
//     )

// return ()
// end
