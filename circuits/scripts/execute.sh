#!/bin/bash

START=2

END=32

# In case there is a start value as input
if [ "$1" ]; then
    START=$1
fi

# In case there is an end value as input
if [ "$1" ]; then
    END=$2
fi

echo "----- Remove build folder -----"
./scripts/remove-build-folder.sh

for ((i = $START; i <= $END; i++)); do
    echo "----- leanimt-$i -----"
    ./scripts/execute-groth16.sh leanimt-$i 14
done

for ((i = $START; i <= $END; i++)); do
    echo "----- smt-$i -----"
    ./scripts/execute-groth16.sh smt-$i 14
done