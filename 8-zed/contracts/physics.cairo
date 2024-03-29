%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.math import sign
from starkware.cairo.common.math_cmp import is_le, is_not_zero, is_nn
from contracts.constants.constants import (
    LEFT,
    RIGHT,
    ns_character_type,
    ns_scene,
    ns_stimulus,
    ns_stamina,
    ns_integrity,
    Vec2,
    Rectangle,
    PhysicsState,
    BodyState,
    Hitboxes,
    ns_hitbox,
)
from contracts.constants.constants_jessica import (
    ns_jessica_character_dimension, ns_jessica_body_state_qualifiers, ns_jessica_hitbox, ns_jessica_stimulus, ns_jessica_body_state
)
from contracts.constants.constants_antoc import (
    ns_antoc_character_dimension, ns_antoc_body_state_qualifiers, ns_antoc_hitbox, ns_antoc_stimulus, ns_antoc_body_state
)
from contracts.body.body_utils import (
    _settle_stamina_change
)
from contracts.dynamics import _euler_forward_no_hitbox, _euler_forward_consider_hitbox

func _bool_or{range_check_ptr}(bool_0: felt, bool_1: felt) -> (bool: felt) {
    if (bool_0 + bool_1 == 0) {
        return (0,);
    } else {
        return (1,);
    }
}

func is_in_various_states_given_character_type {range_check_ptr}(
    character_type: felt,
    state: felt,
    counter: felt,
) -> (
    bool_body_in_atk_active: felt,
    bool_body_in_knocked: felt,
    bool_body_in_block: felt,
    bool_body_in_active: felt,
) {
    if (character_type == ns_character_type.JESSICA) {
        return ns_jessica_body_state_qualifiers.is_in_various_states (state, counter);
    } else {
        return ns_antoc_body_state_qualifiers.is_in_various_states (state, counter);
    }
}

func get_body_hitbox_dimension{range_check_ptr} (
    character_type: felt,
    body_state: felt,
    body_counter: felt
) -> (
    body_dimension: Vec2,
    body_half_width: felt
) {
    alloc_locals;

    if (character_type == ns_character_type.JESSICA) {
        // Jessica
        let (body_dimension, body_half_width) = ns_jessica_hitbox.get_body_hitbox_dimension(body_state, body_counter);
        return (body_dimension = body_dimension, body_half_width = body_half_width);
    } else {
        // Antoc
        let (body_dimension, body_half_width) = ns_antoc_hitbox.get_body_hitbox_dimension(body_state, body_counter);
        return (body_dimension = body_dimension, body_half_width = body_half_width);
    }
}

func get_action_hitbox{range_check_ptr} (
    character_type: felt,
    bool_is_active: felt,
    bool_is_attack_active: felt,
    bool_is_block_active: felt,
    dir: felt,
    pos_x: felt,
    pos_y: felt,
    body_hitbox_dimension: Vec2,
    body_state: felt,
    body_counter: felt
) -> (
    action_hitbox: Rectangle
) {

    if (character_type == ns_character_type.JESSICA) {
        return ns_jessica_hitbox.get_action_hitbox(
            bool_is_active,
            bool_is_attack_active,
            bool_is_block_active,
            dir,
            pos_x,
            pos_y,
            body_hitbox_dimension,
            body_state,
            body_counter
        );
    }
    if (character_type == ns_character_type.ANTOC) {
        return ns_antoc_hitbox.get_action_hitbox(
            bool_is_active,
            bool_is_attack_active,
            bool_is_block_active,
            dir,
            pos_x,
            pos_y,
            body_hitbox_dimension,
            body_state,
            body_counter
        );
    }

    with_attr error_message("Character type is not recognized.") {
        assert 0 = 1;
    }
    return (action_hitbox = Rectangle(
            Vec2(0, 0),
            Vec2(ns_scene.BIGNUM, ns_scene.BIGNUM),
    ));

}

func _physicality{range_check_ptr}(
    character_type_0: felt,
    character_type_1: felt,
    last_physics_state_0: PhysicsState,
    last_physics_state_1: PhysicsState,
    curr_body_state_0: BodyState,
    curr_body_state_1: BodyState,
    curr_stimulus_0: felt,
    curr_stimulus_1: felt,
) -> (
    curr_physics_state_0: PhysicsState,
    curr_physics_state_1: PhysicsState,
    curr_stimulus_0: felt,
    curr_stimulus_1: felt,
    hitboxes_0: Hitboxes,
    hitboxes_1: Hitboxes,
    new_dir_0: felt,
    new_dir_1: felt,
    new_rage_0: felt,
    new_rage_1: felt,
) {
    alloc_locals;

    // Algorithm:
    // 1. Movement first pass (candidate positions)
    // 2. Create hitboxes (body, action, environment)
    // 3. Test hitbox overlaps
    // 4. Movement second pass, incorporating hitbox overlap (final positions) to produce charcater state
    // 5. Handle direction switching
    // 6. Produce stimuli

    //
    // 1. Movement first pass (candidate positions)
    //
    let (candidate_physics_state_0) = _euler_forward_no_hitbox(
        character_type_0, last_physics_state_0, curr_body_state_0, curr_stimulus_0
    );
    let (candidate_physics_state_1) = _euler_forward_no_hitbox(
        character_type_1, last_physics_state_1, curr_body_state_1, curr_stimulus_1
    );

    //
    // 2. Create hitboxes
    //
    let (
        bool_body_in_atk_active_0: felt,
        bool_body_in_knocked_0: felt,
        bool_body_in_block_0: felt,
        bool_body_in_active_0: felt,
    ) = is_in_various_states_given_character_type (character_type_0, curr_body_state_0.state, curr_body_state_0.counter);
    let (
        bool_body_in_atk_active_1: felt,
        bool_body_in_knocked_1: felt,
        bool_body_in_block_1: felt,
        bool_body_in_active_1: felt,
    ) = is_in_various_states_given_character_type (character_type_1, curr_body_state_1.state, curr_body_state_1.counter);

    // compute body hitboxes
    let (body_dim_0: Vec2, body_half_width_0: felt) = get_body_hitbox_dimension (
        character_type_0,
        curr_body_state_0.state,
        curr_body_state_0.counter
    );
    let (body_dim_1: Vec2, body_half_width_1: felt) = get_body_hitbox_dimension (
        character_type_1,
        curr_body_state_1.state,
        curr_body_state_1.counter
    );

    // compute is_action_x_attack flags
    local is_action_0_attack: felt;
    local is_action_1_attack: felt;
    if (bool_body_in_active_0 == 1) {
        if (bool_body_in_atk_active_0 == 1) {
            assert is_action_0_attack = 1;
        }
        if (bool_body_in_block_0 == 1) {
            assert is_action_0_attack = 0;
        }
    } else {
        assert is_action_0_attack = 0;
    }

    if (bool_body_in_active_1 == 1) {
        if (bool_body_in_atk_active_1 == 1) {
            assert is_action_1_attack = 1;
        }
        if (bool_body_in_block_1 == 1) {
            assert is_action_1_attack = 0;
        }
    } else {
        assert is_action_1_attack = 0;
    }

    // Create candidate body hitboxes
    let body_0_cand: Rectangle = Rectangle (
        Vec2(candidate_physics_state_0.pos.x - body_half_width_0, candidate_physics_state_0.pos.y),
        body_dim_0
    );
    let body_1_cand: Rectangle = Rectangle (
        Vec2(candidate_physics_state_1.pos.x - body_half_width_1, candidate_physics_state_1.pos.y),
        body_dim_1
    );

    //
    // 3. Test body hitbox overlaps
    //

    // Body clash:   body 0 against body 1
    let (bool_body_overlap) = _test_rectangle_overlap(body_0_cand, body_1_cand);

    // Agent 0 clashes against ground
    let bool_agent_0_ground = is_le (candidate_physics_state_0.pos.y, 0);

    // Agent 1 clashes against ground
    let bool_agent_1_ground = is_le (candidate_physics_state_1.pos.y, 0);

    //
    // 4. Movement second pass, incorporating hitbox overlap (final positions) to produce final physics states
    //
    let (curr_physics_state_0, curr_physics_state_1) = _euler_forward_consider_hitbox (
        last_physics_state_0,
        candidate_physics_state_0,
        last_physics_state_1,
        candidate_physics_state_1,
        body_dim_0,
        body_dim_1,
        bool_body_overlap,
        bool_agent_0_ground,
        bool_agent_1_ground,
        bool_body_in_knocked_0,
        bool_body_in_knocked_1,
    );

    // Create final body hitboxes
    let body_0: Rectangle = Rectangle (
        Vec2(curr_physics_state_0.pos.x - body_half_width_0, curr_physics_state_0.pos.y),
        body_dim_0
    );
    let body_1: Rectangle = Rectangle (
        Vec2(curr_physics_state_1.pos.x - body_half_width_1, curr_physics_state_1.pos.y),
        body_dim_1
    );

    // Compute final action hitboxes
    let (action_0: Rectangle) = get_action_hitbox (
        character_type_0,
        bool_body_in_active_0,
        bool_body_in_atk_active_0,
        bool_body_in_block_0,
        curr_body_state_0.dir,
        curr_physics_state_0.pos.x,
        curr_physics_state_0.pos.y,
        body_dim_0,
        curr_body_state_0.state,
        curr_body_state_0.counter
    );
    let (action_1: Rectangle) = get_action_hitbox (
        character_type_1,
        bool_body_in_active_1,
        bool_body_in_atk_active_1,
        bool_body_in_block_1,
        curr_body_state_1.dir,
        curr_physics_state_1.pos.x,
        curr_physics_state_1.pos.y,
        body_dim_1,
        curr_body_state_1.state,
        curr_body_state_1.counter
    );

    // Hitbox 0 update
    local hitboxes_0: Hitboxes = Hitboxes(
        action = action_0,
        body = body_0
    );

    // Hitbox 1 update
    local hitboxes_1: Hitboxes = Hitboxes(
        action = action_1,
        body = body_1
    );

    // Test action hitbox overlaps

    // Agent 1 hit:  action 0 against body 1
    let (bool_agent_1_hit) = _test_rectangle_overlap(hitboxes_0.action, hitboxes_1.body);
    tempvar bool_agent_1_hit = bool_agent_1_hit * is_action_0_attack;

    // Agent 0 hit:  action 1 against body 0
    let (bool_agent_0_hit) = _test_rectangle_overlap(hitboxes_1.action, hitboxes_0.body);
    tempvar bool_agent_0_hit = bool_agent_0_hit * is_action_1_attack;

    // Action clash / block: action 0 against action 1
    let (bool_action_overlap) = _test_rectangle_overlap(hitboxes_0.action, hitboxes_1.action);

    //
    // 5. Handle direction switching
    // note: RIGHT (dir==1); LEFT (dir==0);
    //       direction needs switching when either
    //       (1) p2 on the right facing right (dir==1), and p1 on the left facing left (dir==0), or
    //       (2) p1 on the right facing right (dir==1), and p2 on the left facing left (dir==0).
    //
    let sign_p2_p1_x_diff = sign (curr_physics_state_1.pos.x - curr_physics_state_0.pos.x);
    local new_dir_0: felt;
    local new_dir_1: felt;

    // only switch direction at the starting frame (counter==0) of the next move
    if (curr_body_state_0.counter == 0) {

        // if two characters happen to share the same x => don't handle direction switching now
        if (sign_p2_p1_x_diff == 0) {
            assert new_dir_0 = curr_body_state_0.dir;
        } else {
            // handle direction switching
            if (sign_p2_p1_x_diff == 1) {
                // p1 on the left, should face right
                assert new_dir_0 = RIGHT;
            } else {
                assert new_dir_0 = LEFT;
            }
        }
    } else {
        // maintain direction
        assert new_dir_0 = curr_body_state_0.dir;
    }

    if (curr_body_state_1.counter == 0) {

        // if two characters happen to share the same x => don't handle direction switching now
        if (sign_p2_p1_x_diff == 0) {
            assert new_dir_1 = curr_body_state_1.dir;
        } else {
            // handle direction switching
            if (sign_p2_p1_x_diff == 1) {
                // p2 on the right, should face left
                assert new_dir_1 = LEFT;
            } else {
                assert new_dir_1 = RIGHT;
            }
        }
    } else {
        // maintain direction
        assert new_dir_1 = curr_body_state_1.dir;
    }


    //
    // 6. Produce stimuli
    // (NULL / HURT / KNOCKED / CLASH)
    //
    let (curr_stimulus_type_0, damage_received_0) = produce_stimulus_given_conditions (
        bool_self_hit = bool_agent_0_hit,
        bool_opp_hit = bool_agent_1_hit,
        bool_body_overlap = bool_body_overlap,
        bool_action_overlap = bool_action_overlap,
        bool_self_atk_active = bool_body_in_atk_active_0,
        bool_self_block_active = bool_body_in_block_0,
        bool_opp_atk_active = bool_body_in_atk_active_1,
        bool_opp_block_active = bool_body_in_block_1,
        bool_self_ground = bool_agent_0_ground,
        self_integrity = curr_body_state_0.integrity,
        self_character_type = character_type_0,
        opp_character_type = character_type_1,
        self_body_state = curr_body_state_0.state,
        opp_body_state = curr_body_state_1.state
    );

    let (curr_stimulus_type_1, damage_received_1) = produce_stimulus_given_conditions (
        bool_self_hit = bool_agent_1_hit,
        bool_opp_hit = bool_agent_0_hit,
        bool_body_overlap = bool_body_overlap,
        bool_action_overlap = bool_action_overlap,
        bool_self_atk_active = bool_body_in_atk_active_1,
        bool_self_block_active = bool_body_in_block_1,
        bool_opp_atk_active = bool_body_in_atk_active_0,
        bool_opp_block_active = bool_body_in_block_0,
        bool_self_ground = bool_agent_1_ground,
        self_integrity = curr_body_state_1.integrity,
        self_character_type = character_type_1,
        opp_character_type = character_type_0,
        self_body_state = curr_body_state_1.state,
        opp_body_state = curr_body_state_0.state
    );

    // assemble the stimulus here
    let curr_stimulus_0 = curr_stimulus_type_0 * ns_stimulus.ENCODING + bool_agent_0_ground * ns_stimulus.GROUND_ENCODING + damage_received_0;
    let curr_stimulus_1 = curr_stimulus_type_1 * ns_stimulus.ENCODING + bool_agent_1_ground * ns_stimulus.GROUND_ENCODING + damage_received_1;

    // 1/2 of the damage inflicted on the opponent becomes rage gain to the attacker
    let (new_rage_0, _) = _settle_stamina_change(curr_body_state_0.stamina, damage_received_1 / 2, ns_stamina.MAX_STAMINA);
    let (new_rage_1, _) = _settle_stamina_change(curr_body_state_1.stamina, damage_received_0 / 2, ns_stamina.MAX_STAMINA);

    return (
        curr_physics_state_0,
        curr_physics_state_1,
        curr_stimulus_0,
        curr_stimulus_1,
        hitboxes_0,
        hitboxes_1,
        new_dir_0,
        new_dir_1,
        new_rage_0,
        new_rage_1,
    );
}

func is_opp_body_state_launching {range_check_ptr} (
    opp_body_state: felt
) -> felt {
    if ( (opp_body_state - ns_jessica_body_state.UPSWING) * (opp_body_state - ns_antoc_body_state.VERT) * (opp_body_state - ns_antoc_body_state.CYCLONE) == 0 ) {
        return 1;
    }
    return 0;
}

func produce_damage_given_opp_body_state {range_check_ptr} (
    opp_body_state: felt
) -> felt {
    if (opp_body_state == ns_antoc_body_state.HORI) {
        return ns_antoc_stimulus.HORI_DAMAGE;
    }
    if (opp_body_state == ns_antoc_body_state.VERT) {
        return ns_antoc_stimulus.VERT_DAMAGE;
    }
    if (opp_body_state == ns_antoc_body_state.LOW_KICK) {
        return ns_antoc_stimulus.LOW_KICK_DAMAGE;
    }
    if (opp_body_state == ns_antoc_body_state.DROP_SLASH) {
        return ns_antoc_stimulus.DROP_SLASH_DAMAGE;
    }
    if (opp_body_state == ns_antoc_body_state.CYCLONE) {
        return ns_antoc_stimulus.CYCLONE_DAMAGE;
    }
    if (opp_body_state == ns_jessica_body_state.SLASH) {
        return ns_jessica_stimulus.SLASH_DAMAGE;
    }
    if (opp_body_state == ns_jessica_body_state.UPSWING) {
        return ns_jessica_stimulus.UPSWING_DAMAGE;
    }
    if (opp_body_state == ns_jessica_body_state.SIDECUT) {
        return ns_jessica_stimulus.SIDECUT_DAMAGE;
    }
    if (opp_body_state == ns_jessica_body_state.GATOTSU) {
        return ns_jessica_stimulus.GATOTSU_DAMAGE;
    }
    if (opp_body_state == ns_jessica_body_state.LOW_KICK) {
        return ns_jessica_stimulus.LOW_KICK_DAMAGE;
    }
    if (opp_body_state == ns_jessica_body_state.BIRDSWING) {
        return ns_jessica_stimulus.BIRDSWING_DAMAGE;
    }

    with_attr error_message("opponent body state '{opp_body_state}' is not valid for produce_damage_given_opp_body_state()") {
        assert 0 = 1;
    }
    return 0;
}

func produce_stimulus_given_conditions {range_check_ptr} (
    bool_self_hit: felt,
    bool_opp_hit: felt,
    bool_body_overlap: felt,
    bool_action_overlap: felt,
    bool_self_atk_active: felt,
    bool_self_block_active: felt,
    bool_opp_atk_active: felt,
    bool_opp_block_active: felt,
    bool_self_ground: felt,
    self_integrity: felt,
    self_character_type: felt,
    opp_character_type: felt,
    self_body_state: felt,
    opp_body_state: felt
) -> (
    stimulus_type: felt,
    damage_received: felt,
) {
    alloc_locals;

    // Stimulus determination logic:
    // (TODO in Cairo 1.0 redesign, abstract this by defining character-specific parameters and devising a parameter-driven logic to determine stimulus)

    // self attacks into opp's block
    if (bool_self_atk_active == 1 and bool_opp_block_active == 1 and bool_action_overlap == 1) {
        // self is jessica & opp is jessica
        if (self_character_type == ns_character_type.JESSICA and opp_character_type == ns_character_type.JESSICA) {
            // character special is unblockable
            if (self_body_state == ns_jessica_body_state.GATOTSU) {
                return (ns_stimulus.NULL, 0);
            }
            if (self_body_state == ns_jessica_body_state.LOW_KICK) {
                return (ns_stimulus.NULL, 0);
            }
            return (ns_stimulus.CLASH, ns_stimulus.CLASH_DAMAGE);
        }

        // self is jessica & opp is antoc
        if (self_character_type == ns_character_type.JESSICA and opp_character_type == ns_character_type.ANTOC) {
            // character special is unblockable
            if (self_body_state == ns_jessica_body_state.GATOTSU) {
                return (ns_stimulus.NULL, 0);
            }
            if (self_body_state == ns_jessica_body_state.LOW_KICK) {
                return (ns_stimulus.NULL, 0);
            }
            return (ns_stimulus.KNOCKED, ns_antoc_stimulus.BLOCK_KNOCK_DAMAGE);
        }

        // self is antoc & opp is jessica
        if (self_character_type == ns_character_type.ANTOC and opp_character_type == ns_character_type.JESSICA) {
            // character special is unblockable
            if (self_body_state == ns_antoc_body_state.CYCLONE) {
                return (ns_stimulus.NULL, 0);
            }
            if (self_body_state == ns_antoc_body_state.LOW_KICK) {
                return (ns_stimulus.NULL, 0);
            }
            return (ns_stimulus.CLASH, ns_stimulus.CLASH_DAMAGE);
        }

        // self is antoc & opp is antoc
        if (self_character_type == ns_character_type.ANTOC and opp_character_type == ns_character_type.ANTOC) {
            // character special is unblockable
            if (self_body_state == ns_antoc_body_state.CYCLONE) {
                return (ns_stimulus.NULL, 0);
            }
            if (self_body_state == ns_antoc_body_state.LOW_KICK) {
                return (ns_stimulus.NULL, 0);
            }
            return (ns_stimulus.KNOCKED, ns_antoc_stimulus.BLOCK_KNOCK_DAMAGE);
        }
    }

    // self blocks opp's attack
    if (bool_self_block_active == 1 and bool_opp_atk_active == 1 and bool_action_overlap == 1) {
        // self is jessica & opp is jessica
        if (self_character_type == ns_character_type.JESSICA and opp_character_type == ns_character_type.JESSICA) {
            // jessica's gatotsu destroy's jessica's block
            if (opp_body_state == ns_jessica_body_state.GATOTSU) {
                return (ns_stimulus.KNOCKED, ns_jessica_stimulus.GATOTSU_DAMAGE);
            }
            return (ns_stimulus.GOOD_BLOCK, 0);
        }

        // self is jessica & opp is antoc
        if (self_character_type == ns_character_type.JESSICA and opp_character_type == ns_character_type.ANTOC) {
            // CYCLONE is not blockable; get launched
            if (opp_body_state == ns_antoc_body_state.CYCLONE) {
                return (ns_stimulus.LAUNCHED, ns_antoc_stimulus.CYCLONE_DAMAGE);
            }
            return (ns_stimulus.GOOD_BLOCK, 0);
        }

        // self is antoc & opp is jessica
        if (self_character_type == ns_character_type.ANTOC and opp_character_type == ns_character_type.JESSICA) {
            // jessica's gatotsu breaks antoc's block
            if (opp_body_state == ns_jessica_body_state.GATOTSU) {
                return (ns_stimulus.KNOCKED, ns_jessica_stimulus.GATOTSU_DAMAGE);
            }
            return (ns_stimulus.GOOD_BLOCK, 0);
        }

        // self is antoc & opp is antoc
        if (self_character_type == ns_character_type.ANTOC and opp_character_type == ns_character_type.ANTOC) {
            // CYCLONE is not blockable; get launched
            if (opp_body_state == ns_antoc_body_state.CYCLONE) {
                return (ns_stimulus.LAUNCHED, ns_antoc_stimulus.CYCLONE_DAMAGE);
            }
            return (ns_stimulus.GOOD_BLOCK, 0);
        }
    }

    // self attacks into opp's attack
    if (bool_self_atk_active == 1 and bool_opp_atk_active == 1 and bool_action_overlap == 1) {
        if (self_character_type == opp_character_type) {
            // special clashes with special, otherwise special user receives NULL
            // if no special on either side, clash

            if ( (self_body_state - ns_jessica_body_state.LOW_KICK) * (self_body_state - ns_antoc_body_state.LOW_KICK) == 0 ) {
                if ( (opp_body_state - ns_jessica_body_state.LOW_KICK) * (opp_body_state - ns_antoc_body_state.LOW_KICK) == 0 ) {
                    return (ns_stimulus.GOOD_BLOCK, 0);
                }
            }

            if ( (self_body_state - ns_jessica_body_state.GATOTSU) * (self_body_state - ns_antoc_body_state.CYCLONE) == 0 ) {
                if ( (opp_body_state - ns_jessica_body_state.GATOTSU) * (opp_body_state - ns_antoc_body_state.CYCLONE) == 0 ) {
                    return (ns_stimulus.CLASH, ns_stimulus.CLASH_DAMAGE);
                } else {
                    return (ns_stimulus.NULL, 0);
                }
            } else {
                if (opp_body_state == ns_jessica_body_state.GATOTSU) {
                    return (ns_stimulus.KNOCKED, ns_jessica_stimulus.GATOTSU_DAMAGE);
                } else {
                    if (opp_body_state == ns_antoc_body_state.CYCLONE) {
                        return (ns_stimulus.KNOCKED, ns_antoc_stimulus.CYCLONE_DAMAGE);
                    } else {
                        return (ns_stimulus.CLASH, ns_stimulus.CLASH_DAMAGE);
                    }
                }
            }

        }
        if (self_character_type == ns_character_type.JESSICA and opp_character_type == ns_character_type.ANTOC) {
            if (self_body_state == ns_jessica_body_state.GATOTSU) {
                return (ns_stimulus.NULL, 0);
            }
            if (opp_body_state == ns_antoc_body_state.CYCLONE) {
                return (ns_stimulus.LAUNCHED, ns_antoc_stimulus.CYCLONE_DAMAGE);
            }
            return (ns_stimulus.CLASH, ns_stimulus.CLASH_DAMAGE);
        }
        if (self_character_type == ns_character_type.ANTOC and opp_character_type == ns_character_type.JESSICA) {
            if (opp_body_state == ns_jessica_body_state.GATOTSU) {
                return (ns_stimulus.KNOCKED, ns_jessica_stimulus.GATOTSU_DAMAGE);
            }
            if (self_body_state == ns_antoc_body_state.CYCLONE) {
                return (ns_stimulus.NULL, 0);
            }
            return (ns_stimulus.CLASH, ns_stimulus.CLASH_DAMAGE);
        }
    }

    // getting hit
    // let is_integrity_critical = is_le (self_integrity, ns_integrity.CRITICAL_INTEGRITY);
    if (bool_self_hit == 1) {
        let damage = produce_damage_given_opp_body_state (opp_body_state);
        let bool_is_opp_body_state_launching = is_opp_body_state_launching(opp_body_state);

        // if in air
        if (bool_self_ground == 0){
            // if hit by launching attack => launched again in air (juggled)
            if (bool_is_opp_body_state_launching == 1) {
                return (ns_stimulus.LAUNCHED, damage);
            }
            // otherwise, hit when in mid-air => knocked
            return (ns_stimulus.KNOCKED, damage);
        }

        // hit by gatotsu => knocked
        if (opp_body_state == ns_jessica_body_state.GATOTSU) {
            return (ns_stimulus.KNOCKED, damage);
        }

        // if hit by launching attack => launched from ground
        if (bool_is_opp_body_state_launching == 1) {
            return (ns_stimulus.LAUNCHED, damage);
        }

        // // hit when grounded but critical integrity => knocked
        // if (is_integrity_critical == 1) {
        //     return ns_stimulus.KNOCKED * ns_stimulus.ENCODING + damage;
        // }

        // otherwise => hurt
        return (ns_stimulus.HURT, damage);
    }

    // null stimulus otherwise
    return (ns_stimulus.NULL, 0);
}

func _test_rectangle_overlap {range_check_ptr}(rect_0: Rectangle, rect_1: Rectangle) -> (
    bool: felt
) {
    alloc_locals;

    let (bool_x_overlap) = _test_segment_overlap(
        rect_0.origin.x,
        rect_0.origin.x + rect_0.dimension.x,
        rect_1.origin.x,
        rect_1.origin.x + rect_1.dimension.x,
    );

    let (bool_y_overlap) = _test_segment_overlap(
        rect_0.origin.y,
        rect_0.origin.y + rect_0.dimension.y,
        rect_1.origin.y,
        rect_1.origin.y + rect_1.dimension.y,
    );

    return (bool_x_overlap * bool_y_overlap,);
}

func _test_segment_overlap {range_check_ptr}(
    x0_left: felt, x0_right: felt, x1_left: felt, x1_right: felt
) -> (bool: felt) {
    //
    // Algorithm:
    // find the segment whose left point is the smaller than the left point of the other segment;
    // call it segment-left (SL), and the other one segment-right (SR);
    // to overlap, the left point of SR should < the right point of SL.
    //

    let x0_is_sl = is_le(x0_left, x1_left);

    if (x0_is_sl == 1) {
        // # x0 is SL
        let bool = is_le(x1_left + 1, x0_right);
        return (bool,);
    } else {
        // # x1 is SL
        let bool = is_le(x0_left + 1, x1_right);
        return (bool,);
    }
}
