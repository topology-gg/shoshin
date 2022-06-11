import pytest
import os
import json
from starkware.starknet.testing.starknet import Starknet
from starkware.starknet.business_logic.state.state import BlockInfo
import asyncio
from Signer import Signer
import random
import logging

LOGGER = logging.getLogger(__name__)

YES = 1
NO = 0
NUM_SIGNING_ACCOUNTS = 0 ## 2 angel and 2 players
DUMMY_PRIVATE = 9812304879503423120395
users = []

PRIME = 3618502788666131213697322783095070105623107215331596699973092056135872020481
PRIME_HALF = PRIME//2

def adjust_from_felt (felt):
	if felt > PRIME_HALF:
		return felt - PRIME
	else:
		return felt

## Note to test logging:
## `--log-cli-level=INFO` to show logs

### Reference: https://github.com/perama-v/GoL2/blob/main/tests/test_GoL2_infinite.py
@pytest.fixture(scope='module')
def event_loop():
    return asyncio.new_event_loop()

@pytest.fixture(scope="module")
async def starknet():
    starknet = await Starknet.empty()
    return starknet

@pytest.fixture(scope='module')
async def account_factory(starknet):
    accounts = []
    print(f'> Deploying {NUM_SIGNING_ACCOUNTS} accounts...')
    for i in range(NUM_SIGNING_ACCOUNTS):
        signer = Signer(DUMMY_PRIVATE + i)
        account = await starknet.deploy(
            "tests/Account.cairo",
            constructor_calldata=[signer.public_key]
        )
        await account.initialize(account.contract_address).invoke()
        users.append({
            'signer' : signer,
            'account' : account
        })

        print(f'  Account {i} is: {hex(account.contract_address)}')
    print()

    return accounts

@pytest.fixture
async def block_info_mock(starknet):
    class Mock:
        def __init__(self, current_block_info):
            self.block_info = current_block_info

        def update(self, block_number, block_timestamp):
            starknet.state.state.block_info = BlockInfo(
            block_number, block_timestamp,
            self.block_info.gas_price,
            self.block_info.sequencer_address
        )

        def reset(self):
            starknet.state.state.block_info = self.block_info

        def set_block_number(self, block_number):
            starknet.state.state.block_info = BlockInfo(
                block_number, self.block_info.block_timestamp,
                self.block_info.gas_price,
                self.block_info.sequencer_address
            )

        def set_block_timestamp(self, block_timestamp):
            starknet.state.state.block_info = BlockInfo(
                self.block_info.block_number, block_timestamp,
                self.block_info.gas_price,
                self.block_info.sequencer_address
            )

    return Mock(starknet.state.state.block_info)

@pytest.mark.asyncio
async def test (account_factory, starknet, block_info_mock):

    # Deploy contract
    contract = await starknet.deploy (source = 'contracts/engine.cairo')
    LOGGER.info (f'> Deployed engine.cairo.')

    # Loop the baby
    ret = await contract.loop(
        len = 24 * 5 ## 5 seconds, 24 fps
        # len = 13
    ).call()

    # Organize events into record dict
    record = ret.main_call_events[0].arr
    record = {
        'agent_0' : [ {
            'agent_state' : r.agent_0.agent_state,
            'agent_action' : r.agent_0.agent_action,
            'object_state' : r.agent_0.object_state,
            'object_counter' : r.agent_0.object_counter,
            'character_state' : {
                'pos' : [r.agent_0.character_state.pos.x, r.agent_0.character_state.pos.y],
                'vel_fp' : [r.agent_0.character_state.vel_fp.x, r.agent_0.character_state.vel_fp.y],
                'acc_fp' : [r.agent_0.character_state.acc_fp.x, r.agent_0.character_state.acc_fp.y],
                'dir' : r.agent_0.character_state.dir,
                'int' : r.agent_0.character_state.int,
            },
            'hitboxes' : {
                'action' : {
                    'origin' : [r.agent_0.hitboxes.action.origin.x, r.agent_0.hitboxes.action.origin.y],
                    'dimension' : [r.agent_0.hitboxes.action.dimension.x, r.agent_0.hitboxes.action.dimension.y]
                },
                'body' : {
                    'origin' : [r.agent_0.hitboxes.body.origin.x, r.agent_0.hitboxes.body.origin.y],
                    'dimension' : [r.agent_0.hitboxes.body.dimension.x, r.agent_0.hitboxes.body.dimension.y]
                }
            },
            'stimiulus' : r.agent_0.stimulus
        } for r in record ],
        'agent_1' : [ {
            'agent_state' : r.agent_1.agent_state,
            'agent_action' : r.agent_1.agent_action,
            'object_state' : r.agent_1.object_state,
            'object_counter' : r.agent_1.object_counter,
            'character_state' : {
                'pos' : [r.agent_1.character_state.pos.x, r.agent_1.character_state.pos.y],
                'vel_fp' : [adjust_from_felt(r.agent_1.character_state.vel_fp.x), adjust_from_felt(r.agent_1.character_state.vel_fp.y)],
                'acc_fp' : [adjust_from_felt(r.agent_1.character_state.acc_fp.x), adjust_from_felt(r.agent_1.character_state.acc_fp.y)],
                'dir' : r.agent_1.character_state.dir,
                'int' : r.agent_1.character_state.int,
            },
            'hitboxes' : {
                'action' : {
                    'origin' : [r.agent_1.hitboxes.action.origin.x, r.agent_1.hitboxes.action.origin.y],
                    'dimension' : [r.agent_1.hitboxes.action.dimension.x, r.agent_1.hitboxes.action.dimension.y]
                },
                'body' : {
                    'origin' : [r.agent_1.hitboxes.body.origin.x, r.agent_1.hitboxes.body.origin.y],
                    'dimension' : [r.agent_1.hitboxes.body.dimension.x, r.agent_1.hitboxes.body.dimension.y]
                }
            },
            'stimiulus' : r.agent_1.stimulus
        } for r in record]
    }

    # Debug log
    for i in [0,1]:
        LOGGER.info (f'> Agent_{i} records:')
        for r in record[f'agent_{i}']:
            LOGGER.info (f"  .. {r}")
        LOGGER.info ('')

    # Export record
    json_string = json.dumps(record)
    with open('artifacts/test_engine.json', 'w') as f:
        json.dump (json_string, f)