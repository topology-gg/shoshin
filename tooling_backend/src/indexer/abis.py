event_metadata_abi = {
    "name": "event_metadata",
    "type": "event",
    "keys": [],
    "outputs": [
        {"name": "combos_offset_0_len", "type": "felt"},
        {"name": "combos_offset_0", "type": "felt*"},
        {"name": "combos_0_len", "type": "felt"},
        {"name": "combos_0", "type": "felt*"},
        {"name": "combos_offset_1_len", "type": "felt"},
        {"name": "combos_offset_1", "type": "felt*"},
        {"name": "combos_1_len", "type": "felt"},
        {"name": "combos_1", "type": "felt*"},
        {"name": "agent_0_state_machine_offset_len", "type": "felt"},
        {"name": "agent_0_state_machine_offset", "type": "felt*"},
        {"name": "agent_0_state_machine_len", "type": "felt"},
        {"name": "agent_0_state_machine", "type": "Tree*"},
        {"name": "agent_0_initial_state", "type": "felt"},
        {"name": "agent_1_state_machine_offset_len", "type": "felt"},
        {"name": "agent_1_state_machine_offset", "type": "felt*"},
        {"name": "agent_1_state_machine_len", "type": "felt"},
        {"name": "agent_1_state_machine", "type": "Tree*"},
        {"name": "agent_1_initial_state", "type": "felt"},
        {"name": "agent_0_functions_offset_len", "type": "felt"},
        {"name": "agent_0_functions_offset", "type": "felt*"},
        {"name": "agent_0_functions_len", "type": "felt"},
        {"name": "agent_0_functions", "type": "Tree*"},
        {"name": "agent_1_functions_offset_len", "type": "felt"},
        {"name": "agent_1_functions_offset", "type": "felt*"},
        {"name": "agent_1_functions_len", "type": "felt"},
        {"name": "agent_1_functions", "type": "Tree*"},
        {"name": "actions_0_len", "type": "felt"},
        {"name": "actions_0", "type": "felt*"},
        {"name": "actions_1_len", "type": "felt"},
        {"name": "actions_1", "type": "felt*"},
        {"name": "character_type_0", "type": "felt"},
        {"name": "character_type_1", "type": "felt"},
    ],
}

event_single_metadata_abi = {
    "name": "event_single_metadata",
    "type": "event",
    "keys": [],
    "outputs": [
        {"name": "combos_offset_len", "type": "felt"},
        {"name": "combos_offset", "type": "felt*"},
        {"name": "combos_len", "type": "felt"},
        {"name": "combos", "type": "felt*"},
        {"name": "agent_state_machine_offset_len", "type": "felt"},
        {"name": "agent_state_machine_offset", "type": "felt*"},
        {"name": "agent_state_machine_len", "type": "felt"},
        {"name": "agent_state_machine", "type": "Tree*"},
        {"name": "agent_initial_state", "type": "felt"},
        {"name": "agent_functions_offset_len", "type": "felt"},
        {"name": "agent_functions_offset", "type": "felt*"},
        {"name": "agent_functions_len", "type": "felt"},
        {"name": "agent_functions", "type": "Tree*"},
        {"name": "actions_len", "type": "felt"},
        {"name": "actions", "type": "felt*"},
        {"name": "character_type", "type": "felt"},
    ],
}

tree_abi = {
    "name": "Tree",
    "type": "struct",
    "size": 3,
    "members": [
        {"name": "value", "offset": 0, "type": "felt"},
        {"name": "left", "offset": 1, "type": "felt"},
        {"name": "right", "offset": 2, "type": "felt"},
    ],
}

event_array_abi = {
    "name": "event_array",
    "type": "event",
    "keys": [],
    "outputs": [
        {"name": "arr_len", "type": "felt"},
        {"name": "arr", "type": "FrameScene*"},
    ],
}

frame_scene_abi = {
    "name": "AtomFaucetState",
    "type": "struct",
    "size": 46,
    "members": [
        {"name": "agent_0", "offset": 0, "type": "Frame"},
        {"name": "agent_1", "offset": 23, "type": "Frame"},
    ],
}

frame_abi = {
    "name": "Frame",
    "type": "struct",
    "size": 23,
    "members": [
        {"name": "mental_state", "offset": 0, "type": "felt"},
        {"name": "body_state", "offset": 1, "type": "BodyState"},
        {"name": "physics_state", "offset": 7, "type": "PhysicsState"},
        {"name": "action", "offset": 13, "type": "felt"},
        {"name": "stimulus", "offset": 14, "type": "felt"},
        {"name": "hitboxes", "offset": 15, "type": "Hitboxes"},
    ],
}

body_state_abi = {
    "name": "BodyState",
    "type": "struct",
    "size": 6,
    "members": [
        {"name": "state", "offset": 0, "type": "felt"},
        {"name": "counter", "offset": 1, "type": "felt"},
        {"name": "integrity", "offset": 2, "type": "felt"},
        {"name": "stamina", "offset": 3, "type": "felt"},
        {"name": "dir", "offset": 4, "type": "felt"},
        {"name": "fatigued", "offset": 5, "type": "felt"},
    ],
}

physics_state_abi = {
    "name": "PhysicsState",
    "type": "struct",
    "size": 6,
    "members": [
        {"name": "pos", "offset": 0, "type": "Vec2"},
        {"name": "vel_fp", "offset": 2, "type": "Vec2"},
        {"name": "acc_fp", "offset": 4, "type": "Vec2"},
    ],
}

hitboxes_abi = {
    "name": "Hitboxes",
    "type": "struct",
    "size": 8,
    "members": [
        {"name": "action", "offset": 0, "type": "Rectangle"},
        {"name": "body", "offset": 4, "type": "Rectangle"},
    ],
}

rectangle_abi = {
    "name": "Rectangle",
    "type": "struct",
    "size": 4,
    "members": [
        {"name": "origin", "offset": 0, "type": "Vec2"},
        {"name": "dimension", "offset": 2, "type": "Vec2"},
    ],
}

vec2_abi = {
    "name": "Vec2",
    "type": "struct",
    "size": 2,
    "members": [
        {"name": "x", "offset": 0, "type": "felt"},
        {"name": "y", "offset": 1, "type": "felt"},
    ],
}
