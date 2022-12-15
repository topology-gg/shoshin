import pytest
import json
from starkware.starknet.testing.starknet import Starknet
import asyncio
from utils import import_json, StateMachine, parse_stages
import logging

LOGGER = logging.getLogger(__name__)

YES = 1
NO = 0
NUM_SIGNING_ACCOUNTS = 0  ## 2 angel and 2 players
DUMMY_PRIVATE = 9812304879503423120395
users = []

PRIME = 3618502788666131213697322783095070105623107215331596699973092056135872020481
PRIME_HALF = PRIME // 2


def adjust_from_felt(felt):
    if felt > PRIME_HALF:
        return felt - PRIME
    else:
        return felt


def parse_agent(path: str):
    data = import_json(path)
    (fsm, offsets) = parse_stages(StateMachine(**data["state_machine"]))
    state_machine = [x.to_tuple() for x in fsm]
    combos = data["combos"]
    accumulator = 0
    combos_offset = [0]
    combos_offset.append(*[accumulator := len(x) + accumulator for x in combos])
    return (combos_offset, combos, offsets, state_machine)


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

    # Deploy contract
    contract = await starknet.deploy(source="contracts/engine.cairo")
    LOGGER.info(f"> Deployed engine.cairo.")

    # Parse state machine
    (combos_offset, combos, offsets, state_machine) = parse_agent(
        "./experiments/agent.json"
    )

    # Loop the baby
    N = 5 * 24  ## 5 seconds, 24 fps
    ret = await contract.loop(
        N,
        combos_offset,
        *combos,
        [0, 7],
        [1, 1, 1, 1, 1, 1, 1],
        offsets,
        state_machine,
        [],
        [],
    ).call()

    LOGGER.info(
        f"> Simulation of {N} frames took execution_resources = {ret.call_info.execution_resources}"
    )

    # Organize events into record dict
    record = ret.main_call_events[0].arr
    record = {
        "agent_0": [
            {
                "agent_action": r.agent_0.agent_action,
                "object_state": r.agent_0.object_state,
                "object_counter": r.agent_0.object_counter,
                "character_state": {
                    "pos": [
                        r.agent_0.character_state.pos.x,
                        r.agent_0.character_state.pos.y,
                    ],
                    "vel_fp": [
                        r.agent_0.character_state.vel_fp.x,
                        r.agent_0.character_state.vel_fp.y,
                    ],
                    "acc_fp": [
                        r.agent_0.character_state.acc_fp.x,
                        r.agent_0.character_state.acc_fp.y,
                    ],
                    "dir": r.agent_0.character_state.dir,
                    "int": r.agent_0.character_state.int,
                },
                "hitboxes": {
                    "action": {
                        "origin": [
                            r.agent_0.hitboxes.action.origin.x,
                            r.agent_0.hitboxes.action.origin.y,
                        ],
                        "dimension": [
                            r.agent_0.hitboxes.action.dimension.x,
                            r.agent_0.hitboxes.action.dimension.y,
                        ],
                    },
                    "body": {
                        "origin": [
                            r.agent_0.hitboxes.body.origin.x,
                            r.agent_0.hitboxes.body.origin.y,
                        ],
                        "dimension": [
                            r.agent_0.hitboxes.body.dimension.x,
                            r.agent_0.hitboxes.body.dimension.y,
                        ],
                    },
                },
                "stimiulus": r.agent_0.stimulus,
            }
            for r in record
        ],
        "agent_1": [
            {
                "agent_action": r.agent_1.agent_action,
                "object_state": r.agent_1.object_state,
                "object_counter": r.agent_1.object_counter,
                "character_state": {
                    "pos": [
                        r.agent_1.character_state.pos.x,
                        r.agent_1.character_state.pos.y,
                    ],
                    "vel_fp": [
                        adjust_from_felt(r.agent_1.character_state.vel_fp.x),
                        adjust_from_felt(r.agent_1.character_state.vel_fp.y),
                    ],
                    "acc_fp": [
                        adjust_from_felt(r.agent_1.character_state.acc_fp.x),
                        adjust_from_felt(r.agent_1.character_state.acc_fp.y),
                    ],
                    "dir": r.agent_1.character_state.dir,
                    "int": r.agent_1.character_state.int,
                },
                "hitboxes": {
                    "action": {
                        "origin": [
                            r.agent_1.hitboxes.action.origin.x,
                            r.agent_1.hitboxes.action.origin.y,
                        ],
                        "dimension": [
                            r.agent_1.hitboxes.action.dimension.x,
                            r.agent_1.hitboxes.action.dimension.y,
                        ],
                    },
                    "body": {
                        "origin": [
                            r.agent_1.hitboxes.body.origin.x,
                            r.agent_1.hitboxes.body.origin.y,
                        ],
                        "dimension": [
                            r.agent_1.hitboxes.body.dimension.x,
                            r.agent_1.hitboxes.body.dimension.y,
                        ],
                    },
                },
                "stimiulus": r.agent_1.stimulus,
            }
            for r in record
        ],
    }

    #
    # Debug log
    #
    for i in [0, 1]:
        LOGGER.info(f"> Agent_{i} records:")
        for r in record[f"agent_{i}"]:
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
