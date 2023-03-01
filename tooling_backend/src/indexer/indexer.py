import logging

from .types import EventMetadata, EventArray

from apibara.indexer import IndexerRunner, IndexerRunnerConfiguration, Info
from apibara.indexer.indexer import IndexerConfiguration
from apibara.protocol.proto.stream_pb2 import Cursor, DataFinality
from apibara.starknet import EventFilter, Filter, StarkNetIndexer, felt
from apibara.starknet.cursor import starknet_cursor
from apibara.starknet.proto.starknet_pb2 import Block, Event
from apibara.indexer.storage import IndexerStorage

# Print apibara logs
root_logger = logging.getLogger("apibara")
# change to `logging.DEBUG` to print more information
root_logger.setLevel(logging.INFO)
root_logger.addHandler(logging.StreamHandler())

shoshin_address = felt.from_hex(
    "0x055e96c07b3d7fc78c0ec0ae83bb9d5208e339895c5d348b781a28a3c0353149"
)

metadata_collection = "shoshin-dogfooding-metadata"
scenes_collection = "shoshin-dogfooding-scenes"


class ShoshinIndexer(StarkNetIndexer):
    def __init__(self):
        self.fight_id = 0
        super()

    def indexer_id(self) -> str:
        return "shoshin-indexer-0"

    def initial_configuration(self) -> Filter:
        # Return initial configuration of the indexer.
        return IndexerConfiguration(
            filter=Filter().add_event(EventFilter().with_from_address(shoshin_address)),
            starting_cursor=starknet_cursor(771_498),
            finality=DataFinality.DATA_STATUS_ACCEPTED,
        )

    async def handle_data(self, info: Info, data: Block):
        # Handle one block of data
        # Event arrive in pairs, first metadata then scenes
        metadata_events = data.events[0::2]
        scene_events = data.events[1::2]

        events = [
            self.decode(e1.event, e2.event)
            for (e1, e2) in zip(metadata_events, scene_events)
        ]

        # Insert all the events in the document
        await info.storage.insert_many(metadata_collection, [x[0] for x in events])
        await info.storage.insert_many(scenes_collection, [x[1] for x in events])

    async def handle_invalidate(self, _info: Info, _cursor: Cursor):
        raise ValueError("data must be finalized")

    def decode(self, event_metadata: Event, event_scene: Event) -> tuple[Event, Event]:
        # decode one metadata event
        metadata = EventMetadata.from_iter(iter(event_metadata.data))
        # decode one scene event
        arr = EventArray.from_iter(iter(event_scene.data))
        # increase the fight id
        id = self.fight_id
        self.fight_id += 1
        return (
            dict(
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
                functions_offset_0=metadata.functions_offset_0,
                functions_0=[meta.to_json() for meta in metadata.functions_0],
                functions_offset_1=metadata.functions_offset_1,
                functions_1=[meta.to_json() for meta in metadata.functions_1],
                actions_0=metadata.actions_0,
                actions_1=metadata.actions_1,
                character_0=metadata.character_0,
                character_1=metadata.character_1,
            ),
            dict(
                fight_id=id,
                frame_scene=[scene.to_json() for scene in arr.arr],
            ),
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
    meta_cursor = get_last_fight_id(storage, metadata_collection)
    scenes_cursor = get_last_fight_id(storage, scenes_collection)
    for (i, j) in zip(meta_cursor, scenes_cursor):
        id = max(id, i["fight_id"], j["fight_id"])
    indexer.fight_id = id

    # ctx can be accessed by the callbacks in `info`.
    await runner.run(indexer, ctx={"network": "starknet-goerli"})


def get_last_fight_id(storage: IndexerStorage, collection: str) -> int:
    return storage.db.get_collection(collection).find(
        filter={}, projection={"fight_id": True}, limit=1, sort=[("fight_id", -1)]
    )
