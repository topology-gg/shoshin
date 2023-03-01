# Backend for Shoshin

This repository uses [Apibara](https://github.com/apibara/apibara) to index web3 data.

# Getting Started

1. Simply run `docker compose -f docker-compose.prod.yml up` in order to launch the indexer. The docker will
launch a MongoDB service in order to store the indexed data.

2. Open MongoDB Compass and connect to `mongodb://apibara:apibara@localhost:27017/`
