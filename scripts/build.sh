#!/usr/bin/env bash
set -e

scripts/clean.sh
scripts/clone-dependencies.sh
scripts/prepare-emsdk.sh
scripts/build-libjxl.sh
scripts/link-libjxl.sh
scripts/zip-extension.sh v2
scripts/zip-extension.sh v3
