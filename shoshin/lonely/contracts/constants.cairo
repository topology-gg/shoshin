%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc

namespace ns_action:
    const NULL = 0
    const PUNCH = 1
end

namespace ns_object_state:
    const IDLE_0 = 0
    const IDLE_1 = 1
    const IDLE_2 = 2
    const IDLE_3 = 3
    const IDLE_4 = 4
    const IDLE_5 = 5
    const IDLE_6 = 6
    const IDLE_7 = 7
    const IDLE_8 = 8
    const IDLE_9 = 9
    const PUNCH_STA0 = 10
    const PUNCH_STA1 = 11
    const PUNCH_STA2 = 12
    const PUNCH_ATK0 = 13
    const PUNCH_ATK1 = 14
    const PUNCH_REC0 = 15
    const PUNCH_REC1 = 16
end

struct Vec2_fp:
    member x : felt
    member y : felt
end

struct AgentFrameState:
    member object_state : felt
    member location : Vec2_fp
end
