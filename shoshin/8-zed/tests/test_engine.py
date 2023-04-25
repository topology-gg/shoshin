import asyncio
import json
import logging
import os

import pytest
from starkware.starknet.testing.starknet import Starknet
from utils import adjust_from_felt, parse_agent

LOGGER = logging.getLogger(__name__)

YES = 1
NO = 0
NUM_SIGNING_ACCOUNTS = 0  ## 2 angel and 2 players
DUMMY_PRIVATE = 9812304879503423120395
users = []


### Reference: https://github.com/perama-v/GoL2/blob/main/tests/test_GoL2_infinite.py
@pytest.fixture(scope="module")
def event_loop():
    return asyncio.new_event_loop()


@pytest.fixture(scope="module")
async def starknet():
    starknet = await Starknet.empty()
    return starknet


@pytest.mark.asyncio
async def test(starknet):

    # Before running me, please install in 8-zed the binary tree operator library with `protostar install https://github.com/greged93/bto-cairo.git`
    path = os.path.join(os.getcwd(), "lib/bto_cairo_git/")

    # Deploy contract
    contract = await starknet.deploy(
        source="contracts/engine.cairo",
        cairo_path=[path],
        disable_hint_validation=True,
    )
    LOGGER.info(f"> Deployed engine.cairo.")

    # Parse state machine
    # state_machine_offsets should be in the form
    # [COUNT_TREES_STATE_0, LEN_TREE_0_STATE_0, LEN_TREE_1_STATE_0, ..., COUNT_TREES_STATE_1, LEN_TREE_0_STATE_1, LEN_TREE_1_STATE_1, ...]
    # functions_offsets should be in the form
    # [LEN_TREE_0, LEN_TREE_1, LEN_TREE_2, ...]
    (
        combos_offset_0,
        combos_0,
        state_machine_offsets_0,
        state_machine_0,
        functions_offsets_0,
        functions_0,
        actions_0,
    ) = parse_agent("./experiments/agent_combo_jessica.json")

    (
        combos_offset_1,
        combos_1,
        state_machine_offsets_1,
        state_machine_1,
        functions_offsets_1,
        functions_1,
        actions_1,
    ) = parse_agent("./experiments/agent_combo_antoc.json")

    # Loop the baby
    N = 5 * 24  ## 5 seconds, 24 fps
    ret = await contract.loop(
        N,
        combos_offset_0,
        combos_0,
        combos_offset_1,
        combos_1,
        state_machine_offsets_0,
        state_machine_0,
        0,
        state_machine_offsets_1,
        state_machine_1,
        0,
        functions_offsets_0,
        functions_0,
        functions_offsets_1,
        functions_1,
        actions_0,
        actions_1,
        0,  # character type: Jessica
        1,  # character type: Antoc
    ).call()

    LOGGER.info(
        f"> Simulation of {N} frames took execution_resources = {ret.call_info.execution_resources}"
    )

    # Organize events into record dict
    LOGGER.info(f"main_call_events len: {len(ret.main_call_events)}")
    record_array = ret.main_call_events[1].arr
    record = {
        "agent_0": {
            "type": ret.main_call_events[0].character_type_0,
            "frames": [
                {
                    "agent_action": r.agent_0.action,
                    "body_state": {
                        "state": r.agent_0.body_state.state,
                        "counter": r.agent_0.body_state.counter,
                        "integrity": r.agent_0.body_state.integrity,
                        "stamina": r.agent_0.body_state.stamina,
                        "dir": r.agent_0.body_state.dir,
                    },
                    "physics_state": {
                        "pos": {
                            "x": adjust_from_felt(r.agent_0.physics_state.pos.x),
                            "y": adjust_from_felt(r.agent_0.physics_state.pos.y),
                        },
                        "vel_fp": {
                            "x": adjust_from_felt(r.agent_0.physics_state.vel_fp.x),
                            "y": adjust_from_felt(r.agent_0.physics_state.vel_fp.y),
                        },
                        "acc_fp": {
                            "x": adjust_from_felt(r.agent_0.physics_state.acc_fp.x),
                            "y": adjust_from_felt(r.agent_0.physics_state.acc_fp.y),
                        },
                    },
                    "hitboxes": {
                        "action": {
                            "origin": {
                                "x": adjust_from_felt(
                                    r.agent_0.hitboxes.action.origin.x
                                ),
                                "y": adjust_from_felt(
                                    r.agent_0.hitboxes.action.origin.y
                                ),
                            },
                            "dimension": {
                                "x": r.agent_0.hitboxes.action.dimension.x,
                                "y": r.agent_0.hitboxes.action.dimension.y,
                            },
                        },
                        "body": {
                            "origin": {
                                "x": adjust_from_felt(r.agent_0.hitboxes.body.origin.x),
                                "y": adjust_from_felt(r.agent_0.hitboxes.body.origin.y),
                            },
                            "dimension": {
                                "x": r.agent_0.hitboxes.body.dimension.x,
                                "y": r.agent_0.hitboxes.body.dimension.y,
                            },
                        },
                    },
                    "stimiulus": r.agent_0.stimulus,
                }
                for r in record_array
            ],
        },
        "agent_1": {
            "type": ret.main_call_events[0].character_type_1,
            "frames": [
                {
                    "agent_action": r.agent_1.action,
                    "body_state": {
                        "state": r.agent_1.body_state.state,
                        "counter": r.agent_1.body_state.counter,
                        "integrity": r.agent_1.body_state.integrity,
                        "stamina": r.agent_1.body_state.stamina,
                        "dir": r.agent_1.body_state.dir,
                    },
                    "physics_state": {
                        "pos": {
                            "x": adjust_from_felt(r.agent_1.physics_state.pos.x),
                            "y": adjust_from_felt(r.agent_1.physics_state.pos.y),
                        },
                        "vel_fp": {
                            "x": adjust_from_felt(r.agent_1.physics_state.vel_fp.x),
                            "y": adjust_from_felt(r.agent_1.physics_state.vel_fp.y),
                        },
                        "acc_fp": {
                            "x": adjust_from_felt(r.agent_1.physics_state.acc_fp.x),
                            "y": adjust_from_felt(r.agent_1.physics_state.acc_fp.y),
                        },
                    },
                    "hitboxes": {
                        "action": {
                            "origin": {
                                "x": adjust_from_felt(
                                    r.agent_1.hitboxes.action.origin.x
                                ),
                                "y": adjust_from_felt(
                                    r.agent_1.hitboxes.action.origin.y
                                ),
                            },
                            "dimension": {
                                "x": r.agent_1.hitboxes.action.dimension.x,
                                "y": r.agent_1.hitboxes.action.dimension.y,
                            },
                        },
                        "body": {
                            "origin": {
                                "x": adjust_from_felt(r.agent_1.hitboxes.body.origin.x),
                                "y": adjust_from_felt(r.agent_1.hitboxes.body.origin.y),
                            },
                            "dimension": {
                                "x": r.agent_1.hitboxes.body.dimension.x,
                                "y": r.agent_1.hitboxes.body.dimension.y,
                            },
                        },
                    },
                    "stimiulus": r.agent_1.stimulus,
                }
                for r in record_array
            ],
        },
    }

    #
    # Debug log
    #
    for i in [0, 1]:
        LOGGER.info(f"> Agent_{i} records:")
        for r in record[f"agent_{i}"]["frames"]:
            LOGGER.info(f"  .. {r}")
        LOGGER.info("")

    #
    # Export record
    #
    json_string = json.dumps(record)
    path = "artifacts/test_engine.json"
    with open(path, "w") as f:
        json.dump(json_string, f)
    LOGGER.info(f"> Frame records exported to {path}.")
