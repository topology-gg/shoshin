%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.math_cmp import is_le
from contracts.constants import ns_action, Stm, Perceptibles, InputBuffer

// Expressions:
// - E_0 : perceptibles => bool
// - E_1 : perceptibles => bool

// Agent:
// - IDLE => "increment counter in STM if counter <= 5; otherwise E_1 ? B_0 : IDLE"
// - B_0 => E_0 ? IDLE : B_1
// - B_1 => E_0 ? IDLE : B_2
// - B_2 => E_0 ? IDLE : B_3
// - B_3 => E_0 ? IDLE : B_4
// - B_4 => E_0 ? IDLE : B_OFF_0
// - B_OFF_0 => B_OFF_1
// - B_OFF_1 => B_OFF_2
// - B_OFF_2 => B_OFF_3
// - B_OFF_3 => B_OFF_4
// - B_OFF_4 => B_OFF_5
// - B_OFF_5 => IDLE

namespace ns_agent_state {
    const DEMO = 0;
}

func _agent{range_check_ptr}(
    state: felt, stm: Stm, perceptibles: Perceptibles, input_buffer: InputBuffer
) -> (state_nxt: felt, stm_nxt: Stm, input_buffer_nxt: InputBuffer) {
    alloc_locals;

    local state_nxt: felt;
    local stm_nxt: Stm;
    local input_buffer_nxt: InputBuffer;

    if (state == ns_agent_state.DEMO) {
        assert state_nxt = ns_agent_state.DEMO;
        assert stm_nxt = stm;

        if (input_buffer.arr_actions_len == 0) {
            let arr_actions: felt* = alloc();
            assert arr_actions[0] = ns_action.DASH_FORWARD;
            assert arr_actions[1] = ns_action.NULL;
            assert arr_actions[2] = ns_action.NULL;
            assert arr_actions[3] = ns_action.NULL;
            assert arr_actions[4] = ns_action.NULL;
            assert arr_actions[5] = ns_action.NULL;

            assert arr_actions[6] = ns_action.SIDECUT;
            assert arr_actions[7] = ns_action.NULL;
            assert arr_actions[8] = ns_action.NULL;
            assert arr_actions[9] = ns_action.NULL;
            assert arr_actions[10] = ns_action.NULL;
            assert arr_actions[11] = ns_action.NULL;

            assert arr_actions[12] = ns_action.DASH_BACKWARD;
            assert arr_actions[13] = ns_action.NULL;
            assert arr_actions[14] = ns_action.NULL;
            assert arr_actions[15] = ns_action.NULL;
            assert arr_actions[16] = ns_action.NULL;
            assert arr_actions[17] = ns_action.NULL;

            assert arr_actions[18] = ns_action.SIDECUT;
            assert arr_actions[19] = ns_action.NULL;
            assert arr_actions[20] = ns_action.NULL;
            assert arr_actions[21] = ns_action.NULL;
            assert arr_actions[22] = ns_action.NULL;
            assert arr_actions[23] = ns_action.NULL;

            assert arr_actions[24] = ns_action.DASH_FORWARD;
            assert arr_actions[25] = ns_action.NULL;
            assert arr_actions[26] = ns_action.NULL;

            // # Interrupt dash_forward with upswing
            assert arr_actions[27] = ns_action.UPSWING;
            assert arr_actions[28] = ns_action.NULL;
            assert arr_actions[29] = ns_action.NULL;
            assert arr_actions[30] = ns_action.NULL;

            assert arr_actions[31] = ns_action.SLASH;
            assert arr_actions[32] = ns_action.NULL;
            assert arr_actions[33] = ns_action.NULL;
            assert arr_actions[34] = ns_action.NULL;
            assert arr_actions[35] = ns_action.NULL;
            assert arr_actions[36] = ns_action.NULL;

            assert arr_actions[37] = ns_action.NULL;
            assert arr_actions[38] = ns_action.NULL;
            assert arr_actions[39] = ns_action.NULL;
            assert arr_actions[40] = ns_action.NULL;
            assert arr_actions[41] = ns_action.NULL;
            assert arr_actions[42] = ns_action.NULL;
            assert arr_actions[43] = ns_action.NULL;
            assert arr_actions[44] = ns_action.NULL;

            assert input_buffer_nxt = InputBuffer(
                arr_actions_len=45,
                arr_actions=arr_actions
                );
        } else {
            assert input_buffer_nxt = input_buffer;
        }

        return (state_nxt, stm_nxt, input_buffer_nxt);
    }

    with_attr error_message("Input state not recognized.") {
        assert 0 = 1;
    }
    let arr_empty: felt* = alloc();
    return (0, Stm(0), InputBuffer(0, arr_empty));
}
