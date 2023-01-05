#!/usr/bin/env bash
set -e

if [[ "$1" != v2 && "$1" != v3 ]]
then
	echo 'usage: ./build [manifest-version]'
	echo 'eg: ./build v2'
	echo 'or: ./build v3'
	exit 1
fi >&2

ln -f manifest-"$1".json manifest.json

rm -f jxl-"m$1".zip
zip -r jxl-"m$1".zip manifest.json rules.json main.js worker.js libjxl.js libjxl.wasm
rm -f manifest.json
