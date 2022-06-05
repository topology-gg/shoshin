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

    # accounts = account_factory
    contract = await starknet.deploy (source = 'contracts/engine.cairo')
    LOGGER.info (f'> Deployed engine.cairo.')

    ret = await contract.loop(
        len = 24
    ).call()

    LOGGER.info (f'> Record: (ignoring location; showing only object state)')
    agent_0_record = ret.main_call_events[0].arr
    agent_0_record = [ {'state' : r.object_state, 'loc' : [r.location.x, r.location.y]} for r in agent_0_record]
    for e in agent_0_record:
        LOGGER.info (f"  .. object state = {e['state']}")

    # Assemble record
    record = {
        'agent_0' : agent_0_record
    }
    json_string = json.dumps(record)
    with open('test_engine.json', 'w') as f:
        json.dump (json_string, f)