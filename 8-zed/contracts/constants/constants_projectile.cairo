%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.math_cmp import is_le
from contracts.constants.constants import (
    ns_dynamics, Vec2, Rectangle, ns_hitbox, ns_scene, LEFT, RIGHT
)

namespace ns_projectile_dynamics {
    // dt = 0.1; one frame from static to max vel; two frames from minus max vel to positive max vel
    const FLY_VEL_FP = 350 * ns_dynamics.SCALE_FP;
}

namespace ns_projectile_dimension {
    const BODY_HITBOX_W = 50;
    const BODY_HITBOX_W_HALF = 25;
    const BODY_HITBOX_H = 50;
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

namespace ns_projectile_hitbox {
}

