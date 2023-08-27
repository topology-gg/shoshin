%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.math_cmp import is_le
from contracts.constants.constants import (
    ns_dynamics, Vec2, Rectangle, ns_hitbox, ns_scene, LEFT, RIGHT, ns_character_type
)

namespace ns_projectile_dynamics {
    // dt = 0.1; one frame from static to max vel; two frames from minus max vel to positive max vel
    const FLY_VEL_FP = 350 * ns_dynamics.SCALE_FP;
}

namespace ns_projectile_dimension {
    const BOLT_HITBOX_W = 76;
    const BOLT_HITBOX_W_HALF = 38;
    const BOLT_HITBOX_H = 10;

    const MOON_HITBOX_W = 16;
    const MOON_HITBOX_W_HALF =8;
    const MOON_HITBOX_H = 160;
}

namespace ns_projectile_position {
    const BOLT_SPAWN_Y = 70;
    const MOON_SPAWN_Y = 40;
}

namespace ns_projectile_body_state_duration {
    const DORMANT = 1;
    const FLY = 3;
    const CRASH = 3;
}

namespace ns_projectile_body_state {
    const DORMANT = 2000;
    const FLY = 2010;
    const CRASH = 2020;
}

namespace ns_projectile_body_state_qualifiers {
}

func get_projectile_dimension_by_character {range_check_ptr}(
        character_type: felt
    ) -> (
        width: felt, half_width: felt, height: felt
) {
    if (character_type == ns_character_type.JESSICA) {
        return (
            width = ns_projectile_dimension.BOLT_HITBOX_W,
            half_width = ns_projectile_dimension.BOLT_HITBOX_W_HALF,
            height = ns_projectile_dimension.BOLT_HITBOX_H,
        );
    } else {
        return (
            width = ns_projectile_dimension.MOON_HITBOX_W,
            half_width = ns_projectile_dimension.MOON_HITBOX_W_HALF,
            height = ns_projectile_dimension.MOON_HITBOX_H,
        );
    }
}

func get_projectile_spawn_y_by_character {range_check_ptr}(
    character_type: felt
) -> felt {
    if (character_type == ns_character_type.JESSICA) {
        return ns_projectile_position.BOLT_SPAWN_Y;
    } else {
        return ns_projectile_position.MOON_SPAWN_Y;
    }
}