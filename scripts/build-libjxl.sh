#!/usr/bin/env bash
set -e

rm -rf build
source emsdk/emsdk_env.sh
mkdir build
cd build
emcmake cmake -DCMAKE_BUILD_TYPE=Release -DBUILD_TESTING=OFF -DJPEGXL_ENABLE_TOOLS=OFF ../libjxl
emmake cmake --build .
