let blob = new Blob([`importScripts(${JSON.stringify(chrome.runtime.getURL("worker.js"))})`], {type: "text/javascript"})

let mimeRegex = /^image\/jxl(\s*;.*)?$/

let createWorker = () => new Promise(f =>
{
	let worker = new Worker(URL.createObjectURL(blob))
	worker.postMessage(chrome.runtime.getURL(""))
	
	let i = 0
	worker.addEventListener("message", () =>
	{
		let load = async (img, src = img.currentSrc) =>
		{
			let receive = async ({data}) =>
			{
				if (data.id !== id) return
				worker.removeEventListener("message", receive)
				
				if (data.error)
				{
					dispatchError(img)
					return
				}
				
				img.src = data.url
			}
			
			let controller = new AbortController()
			
			let response = await fetch(src, {signal: controller.signal})
			if (!mimeRegex.test(response.headers.get("content-type") ?? "image/jxl"))
			{
				// controller.abort()
				// dispatchError(img)
				// throw new Error("image has wrong MIME type")
			}
			
			let buffer = await response.arrayBuffer()
			
			let id = i++
			
			worker.addEventListener("message", receive)
			worker.postMessage({id, buffer})
		}
		
		f(load)
	}, {once: true})
})

let load = img =>
{
	if (loadJPEGXL) loadJPEGXL[n()](img)
	else delegated.push(img)
}

let i = -1
let n = () => i = (i + 1) % loadJPEGXL.length

addEventListener("error", event =>
{
	if (!(event.target instanceof HTMLImageElement)) return
	event.stopImmediatePropagation()
	if (event.target.closest("picture")) return
	load(event.target)
}, true)

let dispatchError = img =>
{
	let message = "JPEG XL image loading failed"
	img.dispatchEvent(
		new ErrorEvent(message,
		{
			error: new Error(message),
			message,
		}),
		"error",
	)
}

let loadJPEGXL
let delegated = []
let workers = []
for (let i = 0 ; i < navigator.hardwareConcurrency ; i++)
	workers.push(createWorker())

Promise.all(workers)
	.then(workers =>
	{
		loadJPEGXL = workers
		for (let img of delegated) load(img)
		delegated = undefined
	})

new MutationObserver(mutations =>
{
	for (let mutation of mutations)
	for (let node of mutation.addedNodes)
	{
		if (!(node instanceof HTMLSourceElement)) continue
		if (!mimeRegex.test(node.type)) continue
		
		let picture = node.closest("picture")
		let img = picture.querySelector("img")
		if (!picture) continue
		if (!img) continue
		
		picture.dataset.jxl = ""
		
		for (let source of picture.querySelectorAll("source"))
			source.remove()
		
		load(img, node.src || node.srcset)
	}
}).observe(document, {subtree: true, childList: true});

