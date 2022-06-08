%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from contracts.constants import (
    ns_action, ns_object_state,
    Vec2_fp, AgentFrameState
)
from contracts.object import (
    _compute_object_next_state
)

func _agent_stub {range_check_ptr} (
    ) -> (agent_action : felt):

    return (ns_action.PUNCH)
end

@view
func loop {syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr} (
        len : felt
    ) -> ():
    alloc_locals

    let (arr : AgentFrameState*) = alloc ()
    _loop (
        idx = 0,
        len = len,
        arr = arr,
        obj_state = ns_object_state.IDLE_0
    )

    event_array.emit (len, arr)

    return ()
end

func _loop {syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr} (
        idx : felt,
        len : felt,
        arr : AgentFrameState*,
        obj_state : felt
    ) -> ():
    alloc_locals

    if idx == len:
        return ()
    end

    assert arr[idx] = AgentFrameState (
        object_state = obj_state,
        location = Vec2_fp (0,0)
    )
    let (a) = _agent_stub ()
    let (obj_state_nxt) = _compute_object_next_state (
        state = obj_state,
        agent_action = a
    )

    _loop (idx + 1, len, arr, obj_state_nxt)
    return ()
end

@event
func event_array (arr_len : felt, arr : AgentFrameState*):
end

# @view
# func trigger_event_array_emission {syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr} (
#     ) -> ():

#     let (arr : AgentFrameState*) = alloc ()
#     assert arr[0] = AgentFrameState (0, Vec2_fp(0,1))
#     assert arr[1] = AgentFrameState (0, Vec2_fp(2,3))
#     assert arr[2] = AgentFrameState (0, Vec2_fp(4,5))
#     assert arr[3] = AgentFrameState (0, Vec2_fp(6,7))
#     assert arr[4] = AgentFrameState (0, Vec2_fp(8,9))

#     event_array.emit (
#         arr_len = 5,
#         arr = arr
#     )

#     return ()
# end
