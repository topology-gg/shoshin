import logging

from .types import EventMetadata, EventArray

from apibara.indexer import IndexerRunner, IndexerRunnerConfiguration, Info
from apibara.indexer.indexer import IndexerConfiguration
from apibara.protocol.proto.stream_pb2 import Cursor, DataFinality
from apibara.starknet import EventFilter, Filter, StarkNetIndexer, felt
from apibara.starknet.cursor import starknet_cursor
from apibara.starknet.proto.starknet_pb2 import Block, Event, Transaction

# Print apibara logs
root_logger = logging.getLogger("apibara")
# change to `logging.DEBUG` to print more information
root_logger.setLevel(logging.INFO)
root_logger.addHandler(logging.StreamHandler())

shoshin_address = felt.from_hex(
    "0x055e96c07b3d7fc78c0ec0ae83bb9d5208e339895c5d348b781a28a3c0353149"
)

frame_scenes_key = felt.from_hex(
    "0x03859352ee1580aba6dd3dc4961e8a42c69f1a95db0e518802b5da090f99ad75"
)
metadata_key = felt.from_hex(
    "0x0364ea994a381e991dd8c15146830a602f0e489a22a5318a44458a423ba89888"
)


class ShoshinIndexer(StarkNetIndexer):
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
        metadata_events = data.events[0::2]
        arr_events = data.events[1::2]

        metadatas = [
            ShoshinIndexer.decode_metadata(e.event, e.transaction)
            for e in metadata_events
        ]
        frames_scenes = [
            ShoshinIndexer.decode_arr(e.event, e.transaction) for e in arr_events
        ]

        # Insert all the events in the document
        await info.storage.insert_many("shoshin-dogfooding-metadata", metadatas)
        await info.storage.insert_many("shoshin-dogfooding-scenes", frames_scenes)

    async def handle_invalidate(self, _info: Info, _cursor: Cursor):
        raise ValueError("data must be finalized")

    @staticmethod
    def decode_metadata(event_metadata: Event, tx: Transaction):
        metadata = EventMetadata.from_iter(iter(event_metadata.data))
        print("transaction", tx)
        return dict(
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
        )

    @staticmethod
    def decode_arr(event_arr: Event, tx: Transaction):
        arr = EventArray.from_iter(iter(event_arr.data))
        return dict(frame_scene=[scene.to_json() for scene in arr.arr])


async def run_indexer(server_url=None, mongo_url=None, restart=None):
    runner = IndexerRunner(
        config=IndexerRunnerConfiguration(
            stream_url=server_url,
            storage_url=mongo_url,
        ),
        reset_state=restart,
    )
    # ctx can be accessed by the callbacks in `info`.
    await runner.run(ShoshinIndexer(), ctx={"network": "starknet-goerli"})
