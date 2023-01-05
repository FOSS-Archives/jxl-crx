#!/usr/bin/env bash
set -e

source emsdk/emsdk_env.sh
em++ \
	-s EXPORTED_RUNTIME_METHODS='["getValue", "setValue"]' \
	-s EXPORTED_FUNCTIONS='["_malloc", "_free", "_JxlDecoderCreate", "_JxlDecoderDestroy", "_JxlDecoderSubscribeEvents", "_JxlDecoderSetInput", "_JxlDecoderProcessInput", "_JxlDecoderReset", "_JxlDecoderCloseInput", "_JxlDecoderGetBasicInfo", "_JxlDecoderSetImageOutBuffer"]' \
	-s ALLOW_MEMORY_GROWTH=1 \
	-o libjxl.js \
	build/third_party/brotli/libbrotli{dec,common}-static.a \
	build/third_party/highway/libhwy.a \
	build/lib/libjxl_dec.a
