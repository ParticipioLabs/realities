#!/usr/bin/env bash
WAIT_PORT=$1
bash -c 'until printf "" 2>>/dev/null >>/dev/tcp/$0/$1; do sleep 1; done' localhost $WAIT_PORT