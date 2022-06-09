%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.math_cmp import is_le

struct Stm:
    member reg0 : felt
end

namespace ns_scene:
    const X_MAX = 400
    const X_MIN = -400
    const BIGNUM = 1000
end

namespace ns_character_dimension:
    const BODY_HITBOX_W = 64
    const BODY_HITBOX_H = 106
    const BODY_KNOCKED_EARLY_HITBOX_W = 130
    const BODY_KNOCKED_LATE_HITBOX_W = 150
    const BODY_KNOCKED_EARLY_HITBOX_H = 125
    const BODY_KNOCKED_LATE_HITBOX_H = 50
    const PUNCH_HITBOX_W = 112 - 64
    const PUNCH_HITBOX_H = BODY_HITBOX_H / 2
    const PUNCH_HITBOX_Y = BODY_HITBOX_H / 2
end

namespace ns_action:
    const NULL = 0
    const PUNCH = 1
    const FOCUS = 2
    const BLOCK = 3
end

namespace ns_stimulus:
    const NULL = 0
    const HIT_BY_PUNCH = 1
    const HIT_BY_POWER = 2
    const CLASH_BY_PUNCH = 3
    const CLASH_BY_POWER = 4
    const BLOCKED = 5
end

namespace ns_object_state_duration:
    const IDLE = 9
    const KNOCKED = 11
end

namespace ns_object_state:
    const IDLE = 0
    # const IDLE_0 = 0
    # const IDLE_1 = 1
    # const IDLE_2 = 2
    # const IDLE_3 = 3
    # const IDLE_4 = 4
    # const IDLE_5 = 5
    # const IDLE_6 = 6
    # const IDLE_7 = 7
    # const IDLE_8 = 8
    # const IDLE_9 = 9

    const PUNCH_STA0 = 10
    const PUNCH_STA1 = 11
    const PUNCH_STA2 = 12
    const PUNCH_ATK0 = 13
    const PUNCH_ATK1 = 14
    const PUNCH_REC0 = 15
    const PUNCH_REC1 = 16

    const HIT_0 = 17
    const HIT_1 = 18
    const HIT_2 = 19
    const HIT_3 = 20

    const FOCUS_0 = 21
    const FOCUS_1 = 22
    const FOCUS_2 = 23
    const FOCUS_3 = 24
    const FOCUS_4 = 25

    const POWER_ATK0 = 26
    const POWER_ATK1 = 27
    const POWER_ATK2 = 28
    const POWER_ATK3 = 29
    const POWER_ATK4 = 30
    const POWER_ATK5 = 31

    const KNOCKED = 32
    # const KNOCKED_0 = 32
    # const KNOCKED_1 = 33
    # const KNOCKED_2 = 34
    # const KNOCKED_3 = 35
    # const KNOCKED_4 = 36
    # const KNOCKED_5 = 37
    # const KNOCKED_6 = 38
    # const KNOCKED_7 = 39
    # const KNOCKED_8 = 40
    # const KNOCKED_9 = 41
    # const KNOCKED_10 = 42
    # const KNOCKED_11 = 43

    const BLOCK = 44
end

struct Vec2:
    member x : felt
    member y : felt
end

struct Rectangle:
    member origin : Vec2
    member dimension : Vec2
end

struct Hitboxes:
    member action : Rectangle
    member body : Rectangle
end

struct PhysicsScene:
    member agent_0 : Hitboxes
    member agent_1 : Hitboxes
end

#
# Character state
# - pos: position
# - dir: direction (1: facing right; 0: facing left)
# - int: integrity (akin to health point)
#
struct CharacterState:
    member pos : Vec2
    member dir : felt
    member int : felt
end

struct Frame:
    member agent_state : felt
    member agent_action : felt
    member agent_stm : Stm
    member object_state : felt
    member object_counter : felt
    member character_state : CharacterState
    member hitboxes : Hitboxes
    member stimulus : felt
end

struct FrameScene:
    member agent_0 : Frame
    member agent_1 : Frame
end

namespace ns_object_qualifiers:

    func is_object_in_punch_atk {range_check_ptr} (
        object_state : felt) -> (bool : felt):

        if object_state == ns_object_state.PUNCH_ATK0:
            return (1)
        end

        return (0)
    end

    func is_object_in_power_atk {range_check_ptr} (
        object_state : felt) -> (bool : felt):

        if object_state == ns_object_state.POWER_ATK1:
            return (1)
        end

        if object_state == ns_object_state.POWER_ATK3:
            return (1)
        end

        if object_state == ns_object_state.POWER_ATK5:
            return (1)
        end

        return (0)
    end

    func is_object_in_hit {range_check_ptr} (
        object_state : felt) -> (bool : felt):

        if object_state == ns_object_state.HIT_0:
            return (1)
        end

        if object_state == ns_object_state.HIT_1:
            return (1)
        end

        if object_state == ns_object_state.HIT_2:
            return (1)
        end

        if object_state == ns_object_state.HIT_3:
            return (1)
        end

        return (0)
    end

    func is_object_in_knocked_early {range_check_ptr} (
        object_state : felt, object_counter) -> (bool : felt):

        if object_state != ns_object_state.KNOCKED:
            return (0)
        end

        #
        # counter <= 4
        #
        let (bool_counter_le_4) = is_le (object_counter, 4)
        if bool_counter_le_4 == 1:
            return (1)
        end

        return (0)
    end

    func is_object_in_knocked_late {range_check_ptr} (
        object_state : felt, object_counter : felt) -> (bool : felt):

        if object_state != ns_object_state.KNOCKED:
            return (0)
        end

        #
        # counter >= 5
        #
        let (bool_counter_ge_5) = is_le (5, object_counter)
        if bool_counter_ge_5 == 1:
            return (1)
        end

        return (0)
    end

    func is_object_in_block {range_check_ptr} (
        object_state : felt) -> (bool : felt):

        if object_state == ns_object_state.BLOCK:
            return (1)
        end

        return (0)
    end

end

