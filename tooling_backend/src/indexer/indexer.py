import logging
import os

from apibara.indexer import IndexerRunner, IndexerRunnerConfiguration, Info
from apibara.indexer.indexer import IndexerConfiguration
from apibara.indexer.storage import IndexerStorage
from apibara.protocol.proto.stream_pb2 import Cursor, DataFinality
from apibara.starknet import EventFilter, Filter, StarkNetIndexer, felt
from apibara.starknet.cursor import starknet_cursor
from apibara.starknet.proto.starknet_pb2 import Block, Event

from .types import EventArray, EventMetadata, EventSingleMetadata

# Print apibara logs
root_logger = logging.getLogger("apibara")
# change to `logging.DEBUG` to print more information
root_logger.setLevel(logging.INFO)
root_logger.addHandler(logging.StreamHandler())

shoshin_address = felt.from_hex(
    "0x01cf7516698237ed0b41440d2849759b88e8a2ad66238ff1267e5143e3ada5b8"
)
block_to_start_indexing = 792_325

# Get indexer id from env
indexer_id = os.getenv('INDEXER_ID', 'default-indexer-id')
print(f"indexer_id = {indexer_id}")

submission_key = "0x03a4a594e9b3ae15762aec67ca82f720f08ea5b663db0e29835ca136faf96346"
metadata_key = "0x0364ea994a381e991dd8c15146830a602f0e489a22a5318a44458a423ba89888"
scenes_key = "0x03859352ee1580aba6dd3dc4961e8a42c69f1a95db0e518802b5da090f99ad75"

submission_coll = "shoshin-dogfooding-submission"
metadata_coll = "shoshin-dogfooding-metadata"
scenes_coll = "shoshin-dogfooding-scenes"


class ShoshinIndexer(StarkNetIndexer):
    def __init__(self):
        self.fight_id = 0
        self.agent_id = 0
        super()

    def indexer_id(self) -> str:
        return indexer_id

    def initial_configuration(self) -> Filter:
        # Return initial configuration of the indexer.
        return IndexerConfiguration(
            filter=Filter().add_event(EventFilter().with_from_address(shoshin_address)),
            starting_cursor=starknet_cursor(block_to_start_indexing),
            finality=DataFinality.DATA_STATUS_ACCEPTED,
        )

    async def handle_data(self, info: Info, data: Block):
        # Handle one block of data
        if not data.events:
            return
        # metadata and scene events are always emitted by pair: group them in
        # fight events
        fight_events = []
        submission_events = []

        for e in data.events:
            key = felt.to_hex(e.event.keys[0])
            if key == submission_key:
                submission = self.decode_submission(e.event)
                submission["sender"] = felt.to_hex(e.transaction.invoke_v1.sender_address)  # fmt: skip
                submission_events.append(submission)
                self.agent_id += 1
            elif key == metadata_key:
                fight_events.append(self.decode_metadata(e.event))
            elif key == scenes_key:
                fight_events.append(self.decode_scene(e.event))
                self.fight_id += 1

        # Insert all the events in the document
        if submission_events:
            await info.storage.insert_many(submission_coll, submission_events)
        if fight_events:
            await info.storage.insert_many(metadata_coll, [x for x in fight_events[0::2]])  # fmt: skip
            await info.storage.insert_many(scenes_coll, [x for x in fight_events[1::2]])

    async def handle_invalidate(self, _info: Info, _cursor: Cursor):
        raise ValueError("data must be finalized")

    def decode_submission(self, event: Event) -> dict:
        # decode one single metadata event
        agent = EventSingleMetadata.from_iter(iter(event.data))
        return dict(
            agent_id=self.agent_id,
            combos_offset=agent.combos_offset,
            combos=agent.combos,
            state_machine_offset=agent.state_machine_offset,
            state_machine=[meta.to_json() for meta in agent.state_machine],
            state_machine_names=agent.states_names,
            initial_state=agent.initial_state,
            conditions_offset=agent.conditions_offset,
            conditions=[meta.to_json() for meta in agent.conditions],
            conditions_names=agent.conditions_names,
            actions=agent.actions,
            character=agent.character,
        )

    def decode_metadata(self, event_metadata: Event) -> dict:
        # decode one metadata event
        metadata = EventMetadata.from_iter(iter(event_metadata.data))
        id = self.fight_id
        return dict(
            fight_id=id,
            combos_offset_0=metadata.combos_offset_0,
            combos_0=metadata.combos_0,
            combos_offset_1=metadata.combos_offset_1,
            combos_1=metadata.combos_1,
            state_machine_offset_0=metadata.state_machine_offset_0,
            state_machine_0=[meta.to_json() for meta in metadata.state_machine_0],
            initial_state_0=metadata.initial_state_0,
            state_machine_offset_1=metadata.state_machine_offset_1,
            state_machine_1=[meta.to_json() for meta in metadata.state_machine_1],
            initial_state_1=metadata.initial_state_1,
            conditions_offset_0=metadata.conditions_offset_0,
            conditions_0=[meta.to_json() for meta in metadata.conditions_0],
            conditions_offset_1=metadata.conditions_offset_1,
            conditions_1=[meta.to_json() for meta in metadata.conditions_1],
            actions_0=metadata.actions_0,
            actions_1=metadata.actions_1,
            character_0=metadata.character_0,
            character_1=metadata.character_1,
        )

    def decode_scene(self, event_scene: Event) -> dict:
        # decode one scene event
        arr = EventArray.from_iter(iter(event_scene.data))
        id = self.fight_id
        return dict(
            fight_id=id,
            frame_scene=[scene.to_json() for scene in arr.arr],
        )


async def run_indexer(server_url=None, mongo_url=None, restart=None):
    runner = IndexerRunner(
        config=IndexerRunnerConfiguration(
            stream_url=server_url,
            storage_url=mongo_url,
        ),
        reset_state=restart,
    )
    # init the indexer and the storage
    indexer = ShoshinIndexer()
    storage = IndexerStorage(mongo_url, indexer.indexer_id())

    id = 0
    # filter both collections for the latest fight id, keep the highest id
    meta_cursor = get_last_id(storage, metadata_coll, "fight_id")
    scenes_cursor = get_last_id(storage, scenes_coll, "fight_id")
    for (i, j) in zip(meta_cursor, scenes_cursor):
        id = max(id, i["fight_id"], j["fight_id"])
    indexer.fight_id = id

    id = 0
    # filter collection for the latest agent id
    submission_cursor = get_last_id(storage, submission_coll, "agent_id")
    for i in submission_cursor:
        id = max(id, i["agent_id"])
    indexer.agent_id = id

    # ctx can be accessed by the callbacks in `info`.
    await runner.run(indexer, ctx={"network": "starknet-goerli"})


def get_last_id(storage: IndexerStorage, collection: str, id: str) -> int:
    return storage.db.get_collection(collection).find(
        filter={}, projection={id: True}, limit=1, sort=[(id, -1)]
    )
