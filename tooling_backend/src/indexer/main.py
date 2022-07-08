"""Apibara indexer entrypoint."""

import asyncio
from functools import wraps

import click

from indexer.indexer import run_indexer


def async_command(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        return asyncio.run(f(*args, **kwargs))

    return wrapper


@click.group()
def cli():
    pass


@cli.command()
@click.option("--server-url", default=None, help="Apibara Server url.")
@click.option("--mongo-url", default=None, help="MongoDB url.")
@click.option("--restart", is_flag=True, help="Restart indexing from the beginning.")
@async_command
async def start(server_url, mongo_url, restart):
    """Start the Apibara indexer."""
    await run_indexer(
        restart=restart,
        server_url=server_url,
        mongo_url=mongo_url,
    )
