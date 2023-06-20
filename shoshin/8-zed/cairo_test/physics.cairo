from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.alloc import alloc
from starkware.cairo.common.math_cmp import is_le, is_not_zero
from cairo_test.constants.constants import (
    ns_character_type,
    ns_scene,
    ns_stimulus,
    ns_integrity,
    Vec2,
    Rectangle,
    PhysicsState,
    BodyState,
    Hitboxes,
    ns_hitbox,
)
from cairo_test.constants.constants_jessica import (
    ns_jessica_character_dimension,
    ns_jessica_body_state_qualifiers,
    ns_jessica_hitbox,
    ns_jessica_stimulus,
    ns_jessica_body_state,
)
from cairo_test.constants.constants_antoc import (
    ns_antoc_character_dimension,
    ns_antoc_body_state_qualifiers,
    ns_antoc_hitbox,
    ns_antoc_stimulus,
    ns_antoc_body_state,
)
from cairo_test.dynamics import _euler_forward_no_hitbox, _euler_forward_consider_hitbox

func _bool_or{range_check_ptr}(bool_0: felt, bool_1: felt) -> (bool: felt) {
    if (bool_0 + bool_1 == 0) {
        return (0,);
    } else {
        return (1,);
    }
}

func is_in_various_states_given_character_type{range_check_ptr}(
    character_type: felt, state: felt, counter: felt
) -> (
    bool_body_in_atk_active: felt,
    bool_body_in_knocked: felt,
    bool_body_in_block: felt,
    bool_body_in_active: felt,
) {
    if (character_type == ns_character_type.JESSICA) {
        return ns_jessica_body_state_qualifiers.is_in_various_states(state, counter);
    } else {
        return ns_antoc_body_state_qualifiers.is_in_various_states(state, counter);
    }
}

func get_body_hitbox_dimension{range_check_ptr}(
    character_type: felt, body_state: felt, body_counter: felt
) -> (body_dimension: Vec2) {
    if (character_type == ns_character_type.JESSICA) {
        return ns_jessica_hitbox.get_body_hitbox_dimension(body_state, body_counter);
    }
    if (character_type == ns_character_type.ANTOC) {
        return ns_antoc_hitbox.get_body_hitbox_dimension(body_state, body_counter);
    }

    with_attr error_message("Character type is not recognized.") {
        assert 0 = 1;
    }
    return (body_dimension=Vec2(0, 0));
}

func get_action_hitbox{range_check_ptr}(
    character_type: felt,
    bool_is_active: felt,
    bool_is_attack_active: felt,
    bool_is_block_active: felt,
    dir: felt,
    pos_x: felt,
    pos_y: felt,
    body_hitbox_dimension: Vec2,
    body_state: felt,
    body_counter: felt,
) -> (action_hitbox: Rectangle) {
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
            body_counter,
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
            body_counter,
        );
    }

    with_attr error_message("Character type is not recognized.") {
        assert 0 = 1;
    }
    return (
        action_hitbox=Rectangle(
        Vec2(0, 0),
        Vec2(ns_scene.BIGNUM, ns_scene.BIGNUM),
        )
    );
}

func _physicality{range_check_ptr}(
    character_type_0: felt,
    character_type_1: felt,
    last_physics_state_0: PhysicsState,
    last_physics_state_1: PhysicsState,
    curr_body_state_0: BodyState,
    curr_body_state_1: BodyState,
) -> (
    curr_physics_state_0: PhysicsState,
    curr_physics_state_1: PhysicsState,
    curr_stimulus_0: felt,
    curr_stimulus_1: felt,
    hitboxes_0: Hitboxes,
    hitboxes_1: Hitboxes,
) {
    alloc_locals;

    // Algorithm:
    // 1. Movement first pass (candidate positions)
    // 2. Create hitboxes (body, action, environment)
    // 3. Test hitbox overlaps
    // 4. Movement second pass, incorporating hitbox overlap (final positions) to produce charcater state
    // 5. Produce stimuli

    //
    // 1. Movement first pass (candidate positions)
    //
    let (candidate_physics_state_0) = _euler_forward_no_hitbox(
        character_type_0, last_physics_state_0, curr_body_state_0
    );
    let (candidate_physics_state_1) = _euler_forward_no_hitbox(
        character_type_1, last_physics_state_1, curr_body_state_1
    );

    //
    // 2. Create hitboxes
    //
    let (
        bool_body_in_atk_active_0: felt,
        bool_body_in_knocked_0: felt,
        bool_body_in_block_0: felt,
        bool_body_in_active_0: felt,
    ) = is_in_various_states_given_character_type(
        character_type_0, curr_body_state_0.state, curr_body_state_0.counter
    );
    let (
        bool_body_in_atk_active_1: felt,
        bool_body_in_knocked_1: felt,
        bool_body_in_block_1: felt,
        bool_body_in_active_1: felt,
    ) = is_in_various_states_given_character_type(
        character_type_1, curr_body_state_1.state, curr_body_state_1.counter
    );

    // compute body hitboxes
    let (body_dim_0) = get_body_hitbox_dimension(
        character_type_0, curr_body_state_0.state, curr_body_state_0.counter
    );
    let (body_dim_1) = get_body_hitbox_dimension(
        character_type_1, curr_body_state_1.state, curr_body_state_1.counter
    );

    // compute action hitboxes
    let (action_0: Rectangle) = get_action_hitbox(
        character_type_0,
        bool_body_in_active_0,
        bool_body_in_atk_active_0,
        bool_body_in_block_0,
        curr_body_state_0.dir,
        candidate_physics_state_0.pos.x,
        candidate_physics_state_0.pos.y,
        body_dim_0,
        curr_body_state_0.state,
        curr_body_state_0.counter,
    );
    let (action_1: Rectangle) = get_action_hitbox(
        character_type_1,
        bool_body_in_active_1,
        bool_body_in_atk_active_1,
        bool_body_in_block_1,
        curr_body_state_1.dir,
        candidate_physics_state_1.pos.x,
        candidate_physics_state_1.pos.y,
        body_dim_1,
        curr_body_state_1.state,
        curr_body_state_1.counter,
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

    // assemble the hitboxes
    local hitboxes_0: Hitboxes = Hitboxes(
        action=action_0,
        body=Rectangle(candidate_physics_state_0.pos, body_dim_0)
        );

    local hitboxes_1: Hitboxes = Hitboxes(
        action=action_1,
        body=Rectangle(candidate_physics_state_1.pos, body_dim_1)
        );

    //
    // 3. Test hitbox overlaps
    //

    // Agent 1 hit:  action 0 against body 1
    let (bool_agent_1_hit) = _test_rectangle_overlap(hitboxes_0.action, hitboxes_1.body);
    tempvar bool_agent_1_hit = bool_agent_1_hit * is_action_0_attack;

    // Agent 0 hit:  action 1 against body 0
    let (bool_agent_0_hit) = _test_rectangle_overlap(hitboxes_1.action, hitboxes_0.body);
    tempvar bool_agent_0_hit = bool_agent_0_hit * is_action_1_attack;

    // Action clash / block: action 0 against action 1
    let (bool_action_overlap) = _test_rectangle_overlap(hitboxes_0.action, hitboxes_1.action);

    // Body clash:   body 0 against body 1
    let (bool_body_overlap) = _test_rectangle_overlap(hitboxes_0.body, hitboxes_1.body);

    // Agent 0 clashes against ground
    let bool_agent_0_ground = is_le(hitboxes_0.body.origin.y, 0);

    // Agent 1 clashes against ground
    let bool_agent_1_ground = is_le(hitboxes_1.body.origin.y, 0);

    //
    // 4. Movement second pass, incorporating hitbox overlap (final positions) to produce final physics states
    //
    let (curr_physics_state_0, curr_physics_state_1) = _euler_forward_consider_hitbox(
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

    // Hitbox 0 update
    local hitboxes_0: Hitboxes = Hitboxes(
        action=hitboxes_0.action,
        body=Rectangle(curr_physics_state_0.pos, body_dim_0)
        );

    // Hitbox 1 update
    local hitboxes_1: Hitboxes = Hitboxes(
        action=hitboxes_1.action,
        body=Rectangle(curr_physics_state_1.pos, body_dim_1)
        );

    //
    // 5. Produce stimuli
    // (NULL / HURT / KNOCKED / CLASH)
    //
    let curr_stimulus_0 = produce_stimulus_given_conditions(
        bool_self_hit=bool_agent_0_hit,
        bool_opp_hit=bool_agent_1_hit,
        bool_body_overlap=bool_body_overlap,
        bool_action_overlap=bool_action_overlap,
        bool_self_atk_active=bool_body_in_atk_active_0,
        bool_self_block_active=bool_body_in_block_0,
        bool_opp_atk_active=bool_body_in_atk_active_1,
        bool_opp_block_active=bool_body_in_block_1,
        bool_self_ground=bool_agent_0_ground,
        self_integrity=curr_body_state_0.integrity,
        self_character_type=character_type_0,
        opp_character_type=character_type_1,
        self_body_state=curr_body_state_0.state,
        opp_body_state=curr_body_state_1.state,
    );

    let curr_stimulus_1 = produce_stimulus_given_conditions(
        bool_self_hit=bool_agent_1_hit,
        bool_opp_hit=bool_agent_0_hit,
        bool_body_overlap=bool_body_overlap,
        bool_action_overlap=bool_action_overlap,
        bool_self_atk_active=bool_body_in_atk_active_1,
        bool_self_block_active=bool_body_in_block_1,
        bool_opp_atk_active=bool_body_in_atk_active_0,
        bool_opp_block_active=bool_body_in_block_0,
        bool_self_ground=bool_agent_1_ground,
        self_integrity=curr_body_state_1.integrity,
        self_character_type=character_type_1,
        opp_character_type=character_type_0,
        self_body_state=curr_body_state_1.state,
        opp_body_state=curr_body_state_0.state,
    );

    return (
        curr_physics_state_0,
        curr_physics_state_1,
        curr_stimulus_0,
        curr_stimulus_1,
        hitboxes_0,
        hitboxes_1,
    );
}

func produce_damage_given_opp_body_state{range_check_ptr}(opp_body_state: felt) -> felt {
    if (opp_body_state == ns_antoc_body_state.HORI) {
        return ns_antoc_stimulus.HORI_DAMAGE;
    }
    if (opp_body_state == ns_antoc_body_state.VERT) {
        return ns_antoc_stimulus.VERT_DAMAGE;
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

    with_attr error_message("opponent body state is not recognized.") {
        assert 0 = 1;
    }
    return 0;
}

func produce_stimulus_given_conditions{range_check_ptr}(
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
    opp_body_state: felt,
) -> felt {
    alloc_locals;

    // Stimulus determination logic:
    // (TODO in Cairo 1.0 redesign, abstract this by defining character-specific parameters and devising a parameter-driven logic to determine stimulus)

    // self attacks into opp's block
    if (bool_self_atk_active == 1 and bool_opp_block_active == 1 and bool_action_overlap == 1) {
        // self is jessica & opp is jessica
        if (self_character_type == ns_character_type.JESSICA and
            opp_character_type == ns_character_type.JESSICA) {
            return ns_stimulus.CLASH * ns_stimulus.ENCODING + ns_stimulus.CLASH_DAMAGE;
        }

        // self is jessica & opp is antoc
        if (self_character_type == ns_character_type.JESSICA and
            opp_character_type == ns_character_type.ANTOC) {
            return ns_stimulus.KNOCKED * ns_stimulus.ENCODING + ns_antoc_stimulus.BLOCK_KNOCK_DAMAGE;
        }

        // self is antoc & opp is jessica
        if (self_character_type == ns_character_type.ANTOC and
            opp_character_type == ns_character_type.JESSICA) {
            return ns_stimulus.CLASH * ns_stimulus.ENCODING + ns_stimulus.CLASH_DAMAGE;
        }

        // self is antoc & opp is antoc
        if (self_character_type == ns_character_type.ANTOC and
            opp_character_type == ns_character_type.ANTOC) {
            return ns_stimulus.KNOCKED * ns_stimulus.ENCODING + ns_antoc_stimulus.BLOCK_KNOCK_DAMAGE;
        }
    }

    // self blocks opp's attack
    if (bool_self_block_active == 1 and bool_opp_atk_active == 1 and bool_action_overlap == 1) {
        // self is jessica & opp is jessica
        if (self_character_type == ns_character_type.JESSICA and
            opp_character_type == ns_character_type.JESSICA) {
            return 0;
        }

        // self is jessica & opp is antoc
        if (self_character_type == ns_character_type.JESSICA and
            opp_character_type == ns_character_type.ANTOC) {
            return ns_stimulus.CLASH * ns_stimulus.ENCODING + ns_stimulus.CLASH_DAMAGE;
        }

        // self is antoc & opp is jessica
        if (self_character_type == ns_character_type.ANTOC and
            opp_character_type == ns_character_type.JESSICA) {
            return 0;
        }

        // self is antoc & opp is antoc
        if (self_character_type == ns_character_type.ANTOC and
            opp_character_type == ns_character_type.ANTOC) {
            return 0;
        }
    }

    // self attacks into opp's attack
    if (bool_self_atk_active == 1 and bool_opp_atk_active == 1 and bool_action_overlap == 1) {
        if (self_character_type == opp_character_type) {
            return ns_stimulus.CLASH * ns_stimulus.ENCODING + ns_stimulus.CLASH_DAMAGE;
        }
        if (self_character_type == ns_character_type.JESSICA and
            opp_character_type == ns_character_type.ANTOC) {
            return ns_stimulus.KNOCKED * ns_stimulus.ENCODING + ns_antoc_stimulus.CLASH_KNOCK_DAMAGE;
        }
        if (self_character_type == ns_character_type.ANTOC and
            opp_character_type == ns_character_type.JESSICA) {
            return ns_stimulus.CLASH * ns_stimulus.ENCODING + ns_stimulus.CLASH_DAMAGE;
        }
    }

    // (hit) when hit, HURT if critical integrity in mid air, HURT otherwise
    let is_integrity_critical = is_le(self_integrity, ns_integrity.CRITICAL_INTEGRITY);
    let damage = produce_damage_given_opp_body_state(opp_body_state);
    if (bool_self_hit == 1) {
        // hit when in mid-air => knocked
        if (bool_self_ground == 0) {
            return ns_stimulus.KNOCKED * ns_stimulus.ENCODING + damage;
        }
        // hit when grounded but critical integrity => knocked
        if (is_integrity_critical == 1) {
            return ns_stimulus.KNOCKED * ns_stimulus.ENCODING + damage;
        }
        // otherwise => hurt
        return ns_stimulus.HURT * ns_stimulus.ENCODING + damage;
    }

    // if grounded, return GROUND stimulus
    if (bool_self_ground == 1) {
        return ns_stimulus.GROUND * ns_stimulus.ENCODING;
    }

    // null stimulus otherwise
    return 0;
}

func _test_rectangle_overlap{range_check_ptr}(rect_0: Rectangle, rect_1: Rectangle) -> (
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

func _test_segment_overlap{range_check_ptr}(
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
