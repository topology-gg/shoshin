%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.bool import (TRUE, FALSE)
from starkware.cairo.common.math import unsigned_div_rem
from starkware.cairo.common.math_cmp import is_le, is_nn_le, is_not_zero
from contracts.constants.constants import (
    ProjectileBodyState, ns_stimulus, FireCommand
)
from contracts.constants.constants_projectile import (
    ns_projectile_body_state, ns_projectile_body_state_duration
)

//
// Projectile's Body State Diagram
//
func _body_projectile {range_check_ptr}(
        body_state: ProjectileBodyState,
        stimulus: felt,
        fire_command: FireCommand
    ) -> (
        body_state_nxt: ProjectileBodyState
) {
    alloc_locals;

    // Unpack stats
    let state = body_state.state;
    let counter = body_state.counter;
    let dir = body_state.dir;

    // Unpack FireCommand
    let fire = fire_command.fire;
    let fire_dir = fire_command.fire_dir;

    // (Decode stimulus is not needed)

    //
    // Dormant state
    //
    if (state == ns_projectile_body_state.DORMANT) {
        // start flying with the given direction if agent fires the projectile
        if (fire == 1) {
            return ( body_state_nxt = ProjectileBodyState(ns_projectile_body_state.FLY, 0, fire_dir) );
        }
        // stay Dormant
        return ( body_state_nxt = ProjectileBodyState(ns_projectile_body_state.DORMANT, 0, dir) );
    }

    //
    // Fly state
    //
    if (state == ns_projectile_body_state.FLY) {
        // If crashed => go to Crash
        if (stimulus != 0) {
            return ( body_state_nxt = ProjectileBodyState(ns_projectile_body_state.CRASH, 0, dir) );
        }

        // if reach last frame => go to 2nd frame (first frame is for summoning at master's position)
        if (counter == ns_projectile_body_state_duration.FLY - 1) {
            return ( body_state_nxt = ProjectileBodyState(ns_projectile_body_state.FLY, 1, dir) );
        }
        // increment
        return ( body_state_nxt = ProjectileBodyState(ns_projectile_body_state.FLY, counter+1, dir) );
    }

    //
    // Crash state
    //
    if (state == ns_projectile_body_state.CRASH) {
        // if reach last frame => go to Dormant
        if (counter == ns_projectile_body_state_duration.CRASH - 1) {
            return ( body_state_nxt = ProjectileBodyState(ns_projectile_body_state.DORMANT, 0, dir) );
        }
        // increment
        return ( body_state_nxt = ProjectileBodyState(ns_projectile_body_state.CRASH, counter+1, dir) );
    }

    with_attr error_message("Input body state is not recognized.") {
        assert 0 = 1;
    }
    return ( body_state_nxt = ProjectileBodyState(0,0,0) );
}
