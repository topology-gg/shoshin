#!/bin/sh

PYTHON_SCRIPT="$PWD/scripts/genlib.py"
NEW_PATH="$1"
shift 1
SUB='test'
for var in "$@"
do
    if grep -q "$SUB" <<< "$var"
    then
        continue
    fi
    python3.9 "$PYTHON_SCRIPT" "$NEW_PATH" "$var"
done