from apibara import EventFilter, IndexerRunner, Info, NewEvents
from apibara.indexer import IndexerRunnerConfiguration

indexer_id = "my-indexer"


async def handle_events(info: Info, block_events: NewEvents):
    """Handle a group of events grouped by block."""
    print(f"Received events for block {block_events.block.number}")
    for event in block_events.events:
        print(event)

    events = [
        {"address": event.address, "data": event.data, "name": event.name}
        for event in block_events.events
    ]

    # Insert multiple documents in one call.
    await info.storage.insert_many("events", events)


async def run_indexer(server_url=None, mongo_url=None, restart=None):
    print("Starting Apibara indexer")

    runner = IndexerRunner(
        config=IndexerRunnerConfiguration(
            apibara_url=server_url,
            apibara_ssl=True,
            storage_url=mongo_url,
        ),
        reset_state=restart,
        indexer_id=indexer_id,
        new_events_handler=handle_events,
    )

    # Create the indexer if it doesn't exist on the server,
    # otherwise it will resume indexing from where it left off.
    #
    # For now, this also helps the SDK map between human-readable
    # event names and StarkNet events.
    runner.create_if_not_exists(
        filters=[
            EventFilter.from_event_name(
                name="Transfer",
                address="0x0266b1276d23ffb53d99da3f01be7e29fa024dd33cd7f7b1eb7a46c67891c9d0",
            )
        ],
        index_from_block=201_000,
    )

    print("Initialization completed. Entering main loop.")

    await runner.run()
