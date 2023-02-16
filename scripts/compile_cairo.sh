#!/bin/sh

PYTHON_SCRIPT="$PWD/scripts/gencairo.py"
NEW_PATH="$1"
MAIN="$2"
shift 2
for var in "$@"
do
    python3.9 "$PYTHON_SCRIPT" "$NEW_PATH" "$MAIN" "$var"
done