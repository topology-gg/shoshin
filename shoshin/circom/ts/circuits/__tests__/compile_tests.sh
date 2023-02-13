#!/bin/bash

#export NODE_OPTIONS="--max-old-space-size=16384"

cd circuits/__tests__

if [ -f ./powersOfTau28_hez_final_10.ptau ]; then
    echo "powersOfTau28_hez_final_10.ptau already exists. Skipping."
else
    echo 'Downloading powersOfTau28_hez_final_10.ptau'
    wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_10.ptau
fi

echo "Compiling: circuit..."

# compile circuit
circom circuits/fd_tester.circom --r1cs --wasm --sym