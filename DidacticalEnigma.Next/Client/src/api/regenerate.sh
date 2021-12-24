#!/bin/sh
rm -rf code-model-v1 src
npx autorest --typescript --input-file=swagger.json --add-credentials=false --output-folder=.