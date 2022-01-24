#!/bin/bash
set -euo pipefail
curl -sS -X 'GET' 'http://localhost:7000/autoGloss' -H 'accept: application/json' -G --data-urlencode "input=$1" | jq .entries
