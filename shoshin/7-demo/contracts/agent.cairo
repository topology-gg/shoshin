%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.math_cmp import is_le
from contracts.constants import ns_action, Stm, Perceptibles

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
    const IDLE = 0;
    const B_0 = 1;
    const B_1 = 2;
    const B_2 = 3;
    const B_3 = 4;
    const B_4 = 5;
    const B_OFF_0 = 6;
    const B_OFF_1 = 7;
    const B_OFF_2 = 8;
    const B_OFF_3 = 9;
    const B_OFF_4 = 10;
    const B_OFF_5 = 11;
}

func _expression_0{}(perceptibles: Perceptibles) -> (bool: felt) {
    return (0,);
}

func _expression_1{}(perceptibles: Perceptibles) -> (bool: felt) {
    return (1,);
}

func _agent{range_check_ptr}(state: felt, perceptibles: Perceptibles, stm: Stm) -> (
    state_nxt: felt, action: felt, stm_nxt: Stm
) {
    if (state == ns_agent_state.IDLE) {
        let action = ns_action.NULL;

        //
        // Use STM as counter; count to `WAIT` before considering going aggressive
        //
        const WAIT = 10;
        let bool_stm_reg0_le_wait = is_le(stm.reg0, WAIT);
        if (bool_stm_reg0_le_wait == 1) {
            let stm_nxt = Stm(reg0=stm.reg0 + 1);
            return (ns_agent_state.IDLE, action, stm_nxt);
        }

        //
        // E_1 ? B_0 : IDLE
        //
        let (bool_e_1) = _expression_1(perceptibles);
        if (bool_e_1 == 1) {
            let stm_nxt = Stm(reg0=0);
            return (ns_agent_state.B_0, action, stm_nxt);
        } else {
            return (ns_agent_state.IDLE, action, stm);
        }
    }

    if (state == ns_agent_state.B_0) {
        let action = ns_action.FOCUS;

        // B_0 => E_0 ? IDLE : B_1
        let (bool_e_0) = _expression_0(perceptibles);
        if (bool_e_0 == 1) {
            return (ns_agent_state.IDLE, action, stm);
        } else {
            return (ns_agent_state.B_1, action, stm);
        }
    }

    if (state == ns_agent_state.B_1) {
        let action = ns_action.FOCUS;

        // B_1 => E_0 ? IDLE : B_2
        let (bool_e_0) = _expression_0(perceptibles);
        if (bool_e_0 == 1) {
            return (ns_agent_state.IDLE, action, stm);
        } else {
            return (ns_agent_state.B_2, action, stm);
        }
    }

    if (state == ns_agent_state.B_2) {
        let action = ns_action.FOCUS;

        // B_2 => E_0 ? IDLE : B_3
        let (bool_e_0) = _expression_0(perceptibles);
        if (bool_e_0 == 1) {
            return (ns_agent_state.IDLE, action, stm);
        } else {
            return (ns_agent_state.B_3, action, stm);
        }
    }

    if (state == ns_agent_state.B_3) {
        let action = ns_action.FOCUS;

        // B_3 => E_0 ? IDLE : B_4
        let (bool_e_0) = _expression_0(perceptibles);
        if (bool_e_0 == 1) {
            return (ns_agent_state.IDLE, action, stm);
        } else {
            return (ns_agent_state.B_4, action, stm);
        }
    }

    if (state == ns_agent_state.B_4) {
        let action = ns_action.FOCUS;

        // B_4 => E_0 ? IDLE : B_OFF_0
        let (bool_e_0) = _expression_0(perceptibles);
        if (bool_e_0 == 1) {
            return (ns_agent_state.IDLE, action, stm);
        } else {
            return (ns_agent_state.B_OFF_0, action, stm);
        }
    }

    if (state == ns_agent_state.B_OFF_0) {
        let action = ns_action.NULL;

        return (ns_agent_state.B_OFF_1, action, stm);
    }

    if (state == ns_agent_state.B_OFF_1) {
        let action = ns_action.NULL;

        return (ns_agent_state.B_OFF_2, action, stm);
    }

    if (state == ns_agent_state.B_OFF_2) {
        let action = ns_action.NULL;

        return (ns_agent_state.B_OFF_3, action, stm);
    }

    if (state == ns_agent_state.B_OFF_3) {
        let action = ns_action.NULL;

        return (ns_agent_state.B_OFF_4, action, stm);
    }

    if (state == ns_agent_state.B_OFF_4) {
        let action = ns_action.NULL;

        return (ns_agent_state.B_OFF_5, action, stm);
    }

    if (state == ns_agent_state.B_OFF_5) {
        let action = ns_action.NULL;

        return (ns_agent_state.IDLE, action, stm);
    }

    with_attr error_message("Input state not recognized.") {
        assert 0 = 1;
    }
    return (0, 0, Stm(0));
}
