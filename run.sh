#!/bin/bash

command="npm run start";

echo "Command: $command";

main () {
    cmdPid=$!;
    while true; do
        if kill -0 $cmdPid; then
            sleep 1;
        else
            echo "Restarting...";
            exec $command & echo "Restarted." & return 0 & break & main;
        fi
    done;
}

exec $command & echo "Started." & main;
