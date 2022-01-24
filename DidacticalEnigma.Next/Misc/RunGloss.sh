#!/bin/bash

curl -X 'GET' 'http://localhost:7000/autoGloss' -H 'accept: application/json' -G --data-urlencode "input=$1" | jq .entries
