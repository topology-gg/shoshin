%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc

namespace ns_scene {
    const X_MAX = 400;
    const X_MIN = -400;
    const BIGNUM = 1000;
}

namespace ns_character_dimension {
    const BODY_HITBOX_W = 64;
    const BODY_HITBOX_H = 106;
    const PUNCH_HITBOX_W = 112 - 64;
    const PUNCH_HITBOX_H = BODY_HITBOX_H / 2;
    const PUNCH_HITBOX_Y = BODY_HITBOX_H / 2;
}

namespace ns_action {
    const NULL = 0;
    const PUNCH = 1;
}

namespace ns_stimulus {
    const NULL = 0;
    const CLASH_BY_PUNCH = 1;
    const HIT_BY_PUNCH = 2;
}

namespace ns_object_state {
    const IDLE_0 = 0;
    const IDLE_1 = 1;
    const IDLE_2 = 2;
    const IDLE_3 = 3;
    const IDLE_4 = 4;
    const IDLE_5 = 5;
    const IDLE_6 = 6;
    const IDLE_7 = 7;
    const IDLE_8 = 8;
    const IDLE_9 = 9;

    const PUNCH_STA0 = 10;
    const PUNCH_STA1 = 11;
    const PUNCH_STA2 = 12;
    const PUNCH_ATK0 = 13;
    const PUNCH_ATK1 = 14;
    const PUNCH_REC0 = 15;
    const PUNCH_REC1 = 16;

    const HIT_0 = 17;
    const HIT_1 = 18;
    const HIT_2 = 19;
    const HIT_3 = 20;
}

struct Vec2 {
    x: felt,
    y: felt,
}

struct Rectangle {
    origin: Vec2,
    dimension: Vec2,
}

struct Hitboxes {
    action: Rectangle,
    body: Rectangle,
}

struct PhysicsScene {
    agent_0: Hitboxes,
    agent_1: Hitboxes,
}

struct CharacterState {
    pos: Vec2,
    dir: felt,
}

struct Frame {
    object_state: felt,
    character_state: CharacterState,
    hitboxes: Hitboxes,
    stimulus: felt,
}

struct Frames {
    agent_0: Frame,
    agent_1: Frame,
}

namespace ns_state_qualifiers {
    func is_state_in_punch_atk{range_check_ptr}(object_state: felt) -> (bool: felt) {
        if (object_state == ns_object_state.PUNCH_ATK0) {
            return (1,);
        }

        if (object_state == ns_object_state.PUNCH_ATK1) {
            return (1,);
        }

        return (0,);
    }
}
