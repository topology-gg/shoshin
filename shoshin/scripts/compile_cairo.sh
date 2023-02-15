#!/bin/sh

PYTHON_SCRIPT="$PWD/scripts/gencairo.py"
NEW_PATH="$1"
shift 1
for var in "$@"
do
    python3.9 "$PYTHON_SCRIPT" "$NEW_PATH" "$var"
done