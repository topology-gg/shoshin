#!/bin/sh
# exits at the first failing command
set -e
# last executed command before exit
trap 'rm compiled.json' EXIT

# set the env variables
CONTRACT_FOLDER="8-zed"
export STARKNET_NETWORK=alpha-goerli
export STARKNET_WALLET=starkware.starknet.wallets.open_zeppelin.OpenZeppelinAccount

# compile the contract
cd "$CONTRACT_FOLDER"
echo "Compiling the contract"
starknet-compile contracts/engine.cairo --cairo_path lib/bto_cairo_git --output ../compiled.json
echo "Compiled the contract"

# declare the contract
cd ../ 
echo "Declaring the contract"
CONTRACT_CLASS_HASH=$(starknet declare --contract compiled.json | grep "Contract class hash:" | sed 's/^.*\: \(.*\)/\1/')
rm compiled.json
echo "Declared contract with class hash: $CONTRACT_CLASS_HASH" 

# sleep for 2 minutes to allow the nonce to increase on the acccount
sleep 120

# deploy the declared contract
echo "Deploying the contract"
TRANSACTION_HASH=$(starknet deploy --class_hash $CONTRACT_CLASS_HASH | grep "Transaction hash:" | sed 's/^.*\: \(.*\)/\1/')
echo "Contract deployed with transaction hash: $TRANSACTION_HASH"

exit 0