self.Module = {}
Module.onRuntimeInitialized = () =>
{
	format = Module._malloc(16)
	if (!format) throw new Error("could not allocate")
	Module.setValue(format + 0, 4, "i32")
	Module.setValue(format + 4, 2, "i32")
	Module.setValue(format + 12, 0, "i32")
	
	addEventListener("message", ({data}) => loadJPEGXL(data.id, data.buffer))
	
	postMessage("ready")
}

addEventListener("message", ({data: url}) =>
{
	Module.locateFile = name => new URL(name, url).href
	importScripts(new URL("libjxl.js", url))
}, {once: true})

let format
let loadJPEGXL = async (id, buffer) =>
{
	let error = message =>
	{
		postMessage({id, error: message})
		throw new Error(message)
	}
	
	let malloc = n =>
	{
		let result = Module._malloc(n)
		if (!result) error("could not allocate")
		return result
	}
	
	let input
	let output
	let info
	let decoder
	
	try
	{
		decoder = Module._JxlDecoderCreate()
		if (!decoder) error("could not create decoder")
		
		Module._JxlDecoderSubscribeEvents(decoder, 0x1000)
		
		input = malloc(buffer.byteLength)
		
		Module.HEAPU8.set(new Uint8Array(buffer), input)
		if (Module._JxlDecoderSetInput(decoder, input, buffer.byteLength))
			error("could not set input")
		
		Module._JxlDecoderCloseInput(decoder)
		
		if (Module._JxlDecoderProcessInput(decoder) !== 5)
			error("could not process input")
		
		// note: assumes 'JxlBasicInfo' can fit in 2048 bytes
		info = malloc(2048)
		
		if (Module._JxlDecoderGetBasicInfo(decoder, info))
			error("could not get image info")
		
		let width = Module.getValue(info + 4, "i32")
		let height = Module.getValue(info + 8, "i32")
		let size = width * height * 4
		
		output = malloc(size)
		
		if (Module._JxlDecoderSetImageOutBuffer(decoder, format, output, size))
			error("could not set output buffer")
		
		if (Module._JxlDecoderProcessInput(decoder) !== 0x1000)
			error("could not finish processing input")
		
		let image = new ImageData(width, height)
		image.data.set(Module.HEAPU8.subarray(output, output + size))
		
		let canvas = new OffscreenCanvas(width, height)
		let context = canvas.getContext("2d")
		context.putImageData(image, 0, 0)
		
		let blob = await canvas.convertToBlob()
		if (!blob) error("could not convert to Blob")
		
		let url = URL.createObjectURL(blob)
		
		postMessage({id, url})
	}
	catch (error)
	{
		postMessage({error: error.message})
		throw error
	}
	finally
	{
		if (input) Module._free(input)
		if (output) Module._free(output)
		if (info) Module._free(info)
		if (decoder) Module._JxlDecoderDestroy(decoder)
	}
}
