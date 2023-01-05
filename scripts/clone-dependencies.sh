#!/usr/bin/env bash
set -e

rm -rf emsdk libjxl

git clone https://github.com/emscripten-core/emsdk
(cd emsdk && git reset --hard 9b87e80f3a0035173e89229ca374eb6f83bc6a3d)

git clone --recursive https://github.com/libjxl/libjxl
(cd libjxl && git reset --hard b94f43527b36d9fc5bcb367164c7a9379f166daf)
