

importScripts("../../tests/mochitest/general/interface_exposure_checker.js");































let wasmGlobalEntry = {
  name: "WebAssembly",
  insecureContext: true,
  disabled: !getJSTestingFunctions().wasmIsSupportedByHardware(),
};
let wasmGlobalInterfaces = [
  { name: "CompileError", insecureContext: true },
  { name: "Exception", insecureContext: true },
  { name: "Function", insecureContext: true, nightly: true },
  { name: "Global", insecureContext: true },
  { name: "Instance", insecureContext: true },
  { name: "JSTag", insecureContext: true },
  { name: "LinkError", insecureContext: true },
  { name: "Memory", insecureContext: true },
  { name: "Module", insecureContext: true },
  { name: "RuntimeError", insecureContext: true },
  { name: "Table", insecureContext: true },
  { name: "Tag", insecureContext: true },
  { name: "compile", insecureContext: true },
  { name: "compileStreaming", insecureContext: true },
  { name: "instantiate", insecureContext: true },
  { name: "instantiateStreaming", insecureContext: true },
  { name: "validate", insecureContext: true },
];


let ecmaGlobals = [
  { name: "AggregateError", insecureContext: true },
  { name: "Array", insecureContext: true },
  { name: "ArrayBuffer", insecureContext: true },
  { name: "AsyncDisposableStack", insecureContext: true },
  { name: "Atomics", insecureContext: true },
  { name: "BigInt", insecureContext: true },
  { name: "BigInt64Array", insecureContext: true },
  { name: "BigUint64Array", insecureContext: true },
  { name: "Boolean", insecureContext: true },
  { name: "DataView", insecureContext: true },
  { name: "Date", insecureContext: true },
  { name: "DisposableStack", insecureContext: true },
  { name: "Error", insecureContext: true },
  { name: "EvalError", insecureContext: true },
  { name: "FinalizationRegistry", insecureContext: true },
  { name: "Float16Array", insecureContext: true },
  { name: "Float32Array", insecureContext: true },
  { name: "Float64Array", insecureContext: true },
  { name: "Function", insecureContext: true },
  { name: "Infinity", insecureContext: true },
  { name: "Int16Array", insecureContext: true },
  { name: "Int32Array", insecureContext: true },
  { name: "Int8Array", insecureContext: true },
  { name: "InternalError", insecureContext: true },
  { name: "Intl", insecureContext: true },
  { name: "Iterator", insecureContext: true },
  { name: "JSON", insecureContext: true },
  { name: "Map", insecureContext: true },
  { name: "Math", insecureContext: true },
  { name: "NaN", insecureContext: true },
  { name: "Number", insecureContext: true },
  { name: "Object", insecureContext: true },
  { name: "Promise", insecureContext: true },
  { name: "Proxy", insecureContext: true },
  { name: "RangeError", insecureContext: true },
  { name: "ReferenceError", insecureContext: true },
  { name: "Reflect", insecureContext: true },
  { name: "RegExp", insecureContext: true },
  { name: "Set", insecureContext: true },
  {
    name: "SharedArrayBuffer",
    insecureContext: true,
    crossOriginIsolated: true,
  },
  { name: "String", insecureContext: true },
  { name: "SuppressedError", insecureContext: true },
  { name: "Symbol", insecureContext: true },
  { name: "SyntaxError", insecureContext: true },
  { name: "Temporal", insecureContext: true },
  { name: "TypeError", insecureContext: true },
  { name: "URIError", insecureContext: true },
  { name: "Uint16Array", insecureContext: true },
  { name: "Uint32Array", insecureContext: true },
  { name: "Uint8Array", insecureContext: true },
  { name: "Uint8ClampedArray", insecureContext: true },
  { name: "WeakMap", insecureContext: true },
  { name: "WeakRef", insecureContext: true },
  { name: "WeakSet", insecureContext: true },
  wasmGlobalEntry,
  { name: "decodeURI", insecureContext: true },
  { name: "decodeURIComponent", insecureContext: true },
  { name: "encodeURI", insecureContext: true },
  { name: "encodeURIComponent", insecureContext: true },
  { name: "escape", insecureContext: true },
  { name: "eval", insecureContext: true },
  { name: "globalThis", insecureContext: true },
  { name: "isFinite", insecureContext: true },
  { name: "isNaN", insecureContext: true },
  { name: "parseFloat", insecureContext: true },
  { name: "parseInt", insecureContext: true },
  { name: "undefined", insecureContext: true },
  { name: "unescape", insecureContext: true },
];




let interfaceNamesInGlobalScope = [
  
  { name: "AbortController", insecureContext: true },
  
  { name: "AbortSignal", insecureContext: true },
  
  { name: "AudioData", insecureContext: true, nightlyAndroid: true },
  
  { name: "AudioDecoder", nightlyAndroid: true },
  
  { name: "AudioEncoder", nightlyAndroid: true },
  
  { name: "Blob", insecureContext: true },
  
  { name: "BroadcastChannel", insecureContext: true },
  
  { name: "ByteLengthQueuingStrategy", insecureContext: true },
  
  "Cache",
  
  "CacheStorage",
  
  { name: "CanvasGradient", insecureContext: true },
  
  { name: "CanvasPattern", insecureContext: true },
  
  { name: "CloseEvent", insecureContext: true },
  
  { name: "CompressionStream", insecureContext: true },
  
  { name: "CountQueuingStrategy", insecureContext: true },
  
  { name: "Crypto", insecureContext: true },
  
  { name: "CryptoKey" },
  
  { name: "CustomEvent", insecureContext: true },
  
  { name: "DOMException", insecureContext: true },
  
  { name: "DOMMatrix", insecureContext: true },
  
  { name: "DOMMatrixReadOnly", insecureContext: true },
  
  { name: "DOMPoint", insecureContext: true },
  
  { name: "DOMPointReadOnly", insecureContext: true },
  
  { name: "DOMQuad", insecureContext: true },
  
  { name: "DOMRect", insecureContext: true },
  
  { name: "DOMRectReadOnly", insecureContext: true },
  
  { name: "DOMStringList", insecureContext: true },
  
  { name: "DecompressionStream", insecureContext: true },
  
  { name: "DedicatedWorkerGlobalScope", insecureContext: true },
  
  { name: "Directory", insecureContext: true },
  
  { name: "EncodedAudioChunk", insecureContext: true, nightlyAndroid: true },
  
  { name: "EncodedVideoChunk", insecureContext: true, nightlyAndroid: true },
  
  { name: "ErrorEvent", insecureContext: true },
  
  { name: "Event", insecureContext: true },
  
  { name: "EventSource", insecureContext: true },
  
  { name: "EventTarget", insecureContext: true },
  
  { name: "File", insecureContext: true },
  
  { name: "FileList", insecureContext: true },
  
  { name: "FileReader", insecureContext: true },
  
  { name: "FileReaderSync", insecureContext: true },
  
  { name: "FileSystemDirectoryHandle" },
  
  { name: "FileSystemFileHandle" },
  
  { name: "FileSystemHandle" },
  
  { name: "FileSystemSyncAccessHandle" },
  
  { name: "FileSystemWritableFileStream" },
  
  { name: "FontFace", insecureContext: true },
  
  { name: "FontFaceSet", insecureContext: true },
  
  { name: "FontFaceSetLoadEvent", insecureContext: true },
  
  { name: "FormData", insecureContext: true },
  
  { name: "GPU", earlyBetaOrEarlier: true },
  { name: "GPU", windows: true },
  { name: "GPU", mac: true, aarch64: true },
  
  { name: "GPUAdapter", earlyBetaOrEarlier: true },
  { name: "GPUAdapter", windows: true },
  { name: "GPUAdapter", mac: true, aarch64: true },
  
  { name: "GPUAdapterInfo", earlyBetaOrEarlier: true },
  { name: "GPUAdapterInfo", windows: true },
  { name: "GPUAdapterInfo", mac: true, aarch64: true },
  
  { name: "GPUBindGroup", earlyBetaOrEarlier: true },
  { name: "GPUBindGroup", windows: true },
  { name: "GPUBindGroup", mac: true, aarch64: true },
  
  { name: "GPUBindGroupLayout", earlyBetaOrEarlier: true },
  { name: "GPUBindGroupLayout", windows: true },
  { name: "GPUBindGroupLayout", mac: true, aarch64: true },
  
  { name: "GPUBuffer", earlyBetaOrEarlier: true },
  { name: "GPUBuffer", windows: true },
  { name: "GPUBuffer", mac: true, aarch64: true },
  
  { name: "GPUBufferUsage", earlyBetaOrEarlier: true },
  { name: "GPUBufferUsage", windows: true },
  { name: "GPUBufferUsage", mac: true, aarch64: true },
  
  { name: "GPUCanvasContext", earlyBetaOrEarlier: true },
  { name: "GPUCanvasContext", windows: true },
  { name: "GPUCanvasContext", mac: true, aarch64: true },
  
  { name: "GPUColorWrite", earlyBetaOrEarlier: true },
  { name: "GPUColorWrite", windows: true },
  { name: "GPUColorWrite", mac: true, aarch64: true },
  
  { name: "GPUCommandBuffer", earlyBetaOrEarlier: true },
  { name: "GPUCommandBuffer", windows: true },
  { name: "GPUCommandBuffer", mac: true, aarch64: true },
  
  { name: "GPUCommandEncoder", earlyBetaOrEarlier: true },
  { name: "GPUCommandEncoder", windows: true },
  { name: "GPUCommandEncoder", mac: true, aarch64: true },
  
  { name: "GPUCompilationInfo", earlyBetaOrEarlier: true },
  { name: "GPUCompilationInfo", windows: true },
  { name: "GPUCompilationInfo", mac: true, aarch64: true },
  
  { name: "GPUCompilationMessage", earlyBetaOrEarlier: true },
  { name: "GPUCompilationMessage", windows: true },
  { name: "GPUCompilationMessage", mac: true, aarch64: true },
  
  { name: "GPUComputePassEncoder", earlyBetaOrEarlier: true },
  { name: "GPUComputePassEncoder", windows: true },
  { name: "GPUComputePassEncoder", mac: true, aarch64: true },
  
  { name: "GPUComputePipeline", earlyBetaOrEarlier: true },
  { name: "GPUComputePipeline", windows: true },
  { name: "GPUComputePipeline", mac: true, aarch64: true },
  
  { name: "GPUDevice", earlyBetaOrEarlier: true },
  { name: "GPUDevice", windows: true },
  { name: "GPUDevice", mac: true, aarch64: true },
  
  { name: "GPUDeviceLostInfo", earlyBetaOrEarlier: true },
  { name: "GPUDeviceLostInfo", windows: true },
  { name: "GPUDeviceLostInfo", mac: true, aarch64: true },
  
  { name: "GPUError", earlyBetaOrEarlier: true },
  { name: "GPUError", windows: true },
  { name: "GPUError", mac: true, aarch64: true },
  
  { name: "GPUExternalTexture", earlyBetaOrEarlier: true },
  { name: "GPUExternalTexture", windows: true },
  { name: "GPUExternalTexture", mac: true, aarch64: true },
  
  { name: "GPUInternalError", earlyBetaOrEarlier: true },
  { name: "GPUInternalError", windows: true },
  { name: "GPUInternalError", mac: true, aarch64: true },
  
  { name: "GPUMapMode", earlyBetaOrEarlier: true },
  { name: "GPUMapMode", windows: true },
  { name: "GPUMapMode", mac: true, aarch64: true },
  
  { name: "GPUOutOfMemoryError", earlyBetaOrEarlier: true },
  { name: "GPUOutOfMemoryError", windows: true },
  { name: "GPUOutOfMemoryError", mac: true, aarch64: true },
  
  { name: "GPUPipelineError", earlyBetaOrEarlier: true },
  { name: "GPUPipelineError", windows: true },
  { name: "GPUPipelineError", mac: true, aarch64: true },
  
  { name: "GPUPipelineLayout", earlyBetaOrEarlier: true },
  { name: "GPUPipelineLayout", windows: true },
  { name: "GPUPipelineLayout", mac: true, aarch64: true },
  
  { name: "GPUQuerySet", earlyBetaOrEarlier: true },
  { name: "GPUQuerySet", windows: true },
  { name: "GPUQuerySet", mac: true, aarch64: true },
  
  { name: "GPUQueue", earlyBetaOrEarlier: true },
  { name: "GPUQueue", windows: true },
  { name: "GPUQueue", mac: true, aarch64: true },
  
  { name: "GPURenderBundle", earlyBetaOrEarlier: true },
  { name: "GPURenderBundle", windows: true },
  { name: "GPURenderBundle", mac: true, aarch64: true },
  
  { name: "GPURenderBundleEncoder", earlyBetaOrEarlier: true },
  { name: "GPURenderBundleEncoder", windows: true },
  { name: "GPURenderBundleEncoder", mac: true, aarch64: true },
  
  { name: "GPURenderPassEncoder", earlyBetaOrEarlier: true },
  { name: "GPURenderPassEncoder", windows: true },
  { name: "GPURenderPassEncoder", mac: true, aarch64: true },
  
  { name: "GPURenderPipeline", earlyBetaOrEarlier: true },
  { name: "GPURenderPipeline", windows: true },
  { name: "GPURenderPipeline", mac: true, aarch64: true },
  
  { name: "GPUSampler", earlyBetaOrEarlier: true },
  { name: "GPUSampler", windows: true },
  { name: "GPUSampler", mac: true, aarch64: true },
  
  { name: "GPUShaderModule", earlyBetaOrEarlier: true },
  { name: "GPUShaderModule", windows: true },
  { name: "GPUShaderModule", mac: true, aarch64: true },
  
  { name: "GPUShaderStage", earlyBetaOrEarlier: true },
  { name: "GPUShaderStage", windows: true },
  { name: "GPUShaderStage", mac: true, aarch64: true },
  
  { name: "GPUSupportedFeatures", earlyBetaOrEarlier: true },
  { name: "GPUSupportedFeatures", windows: true },
  { name: "GPUSupportedFeatures", mac: true, aarch64: true },
  
  { name: "GPUSupportedLimits", earlyBetaOrEarlier: true },
  { name: "GPUSupportedLimits", windows: true },
  { name: "GPUSupportedLimits", mac: true, aarch64: true },
  
  { name: "GPUTexture", earlyBetaOrEarlier: true },
  { name: "GPUTexture", windows: true },
  { name: "GPUTexture", mac: true, aarch64: true },
  
  { name: "GPUTextureUsage", earlyBetaOrEarlier: true },
  { name: "GPUTextureUsage", windows: true },
  { name: "GPUTextureUsage", mac: true, aarch64: true },
  
  { name: "GPUTextureView", earlyBetaOrEarlier: true },
  { name: "GPUTextureView", windows: true },
  { name: "GPUTextureView", mac: true, aarch64: true },
  
  { name: "GPUUncapturedErrorEvent", earlyBetaOrEarlier: true },
  { name: "GPUUncapturedErrorEvent", windows: true },
  { name: "GPUUncapturedErrorEvent", mac: true, aarch64: true },
  
  { name: "GPUValidationError", earlyBetaOrEarlier: true },
  { name: "GPUValidationError", windows: true },
  { name: "GPUValidationError", mac: true, aarch64: true },
  
  { name: "Headers", insecureContext: true },
  
  { name: "IDBCursor", insecureContext: true },
  
  { name: "IDBCursorWithValue", insecureContext: true },
  
  { name: "IDBDatabase", insecureContext: true },
  
  { name: "IDBFactory", insecureContext: true },
  
  { name: "IDBIndex", insecureContext: true },
  
  { name: "IDBKeyRange", insecureContext: true },
  
  { name: "IDBObjectStore", insecureContext: true },
  
  { name: "IDBOpenDBRequest", insecureContext: true },
  
  { name: "IDBRequest", insecureContext: true },
  
  { name: "IDBTransaction", insecureContext: true },
  
  { name: "IDBVersionChangeEvent", insecureContext: true },
  
  { name: "ImageBitmap", insecureContext: true },
  
  { name: "ImageBitmapRenderingContext", insecureContext: true },
  
  { name: "ImageData", insecureContext: true },
  
  { name: "ImageDecoder" },
  
  { name: "ImageTrack" },
  
  { name: "ImageTrackList" },
  
  "Lock",
  
  "LockManager",
  
  { name: "MediaCapabilities", insecureContext: true },
  
  { name: "MessageChannel", insecureContext: true },
  
  { name: "MessageEvent", insecureContext: true },
  
  { name: "MessagePort", insecureContext: true },
  
  "NavigationPreloadManager",
  
  { name: "NetworkInformation", insecureContext: true, disabled: true },
  
  { name: "Notification", insecureContext: true },
  
  { name: "OffscreenCanvas", insecureContext: true },
  
  { name: "OffscreenCanvasRenderingContext2D", insecureContext: true },
  
  { name: "Path2D", insecureContext: true },
  
  { name: "Performance", insecureContext: true },
  
  { name: "PerformanceEntry", insecureContext: true },
  
  { name: "PerformanceMark", insecureContext: true },
  
  { name: "PerformanceMeasure", insecureContext: true },
  
  { name: "PerformanceObserver", insecureContext: true },
  
  { name: "PerformanceObserverEntryList", insecureContext: true },
  
  { name: "PerformanceResourceTiming", insecureContext: true },
  
  { name: "PerformanceServerTiming", insecureContext: false },
  
  { name: "PermissionStatus", insecureContext: true },
  
  { name: "Permissions", insecureContext: true },
  
  { name: "ProgressEvent", insecureContext: true },
  
  { name: "PromiseRejectionEvent", insecureContext: true },
  
  "PushManager",
  
  "PushSubscription",
  
  "PushSubscriptionOptions",
  
  { name: "RTCDataChannel", insecureContext: true },
  
  { name: "RTCEncodedAudioFrame", insecureContext: true },
  
  { name: "RTCEncodedVideoFrame", insecureContext: true },
  
  { name: "RTCRtpScriptTransformer", insecureContext: true },
  
  { name: "RTCTransformEvent", insecureContext: true },
  
  { name: "ReadableByteStreamController", insecureContext: true },
  
  { name: "ReadableStream", insecureContext: true },
  
  { name: "ReadableStreamBYOBReader", insecureContext: true },
  
  { name: "ReadableStreamBYOBRequest", insecureContext: true },
  
  { name: "ReadableStreamDefaultController", insecureContext: true },
  
  { name: "ReadableStreamDefaultReader", insecureContext: true },
  
  { name: "Request", insecureContext: true },
  
  { name: "Response", insecureContext: true },
  
  { name: "Scheduler", insecureContext: true },
  
  "ServiceWorker",
  
  "ServiceWorkerContainer",
  
  "ServiceWorkerRegistration",
  
  { name: "StorageManager", fennec: false },
  
  { name: "SubtleCrypto" },
  
  { name: "TaskController", insecureContext: true },
  
  { name: "TaskPriorityChangeEvent", insecureContext: true },
  
  { name: "TaskSignal", insecureContext: true },
  
  { name: "TextDecoder", insecureContext: true },
  
  { name: "TextDecoderStream", insecureContext: true },
  
  { name: "TextEncoder", insecureContext: true },
  
  { name: "TextEncoderStream", insecureContext: true },
  
  { name: "TextMetrics", insecureContext: true },
  
  { name: "TransformStream", insecureContext: true },
  
  { name: "TransformStreamDefaultController", insecureContext: true },
  
  { name: "TrustedHTML", earlyBetaOrEarlier: true, insecureContext: true },
  
  { name: "TrustedScript", earlyBetaOrEarlier: true, insecureContext: true },
  
  { name: "TrustedScriptURL", earlyBetaOrEarlier: true, insecureContext: true },
  
  {
    name: "TrustedTypePolicy",
    earlyBetaOrEarlier: true,
    insecureContext: true,
  },
  
  {
    name: "TrustedTypePolicyFactory",
    earlyBetaOrEarlier: true,
    insecureContext: true,
  },
  
  { name: "URL", insecureContext: true },
  
  { name: "URLPattern", insecureContext: true },
  
  { name: "URLSearchParams", insecureContext: true },
  
  { name: "VideoColorSpace", insecureContext: true },
  
  { name: "VideoDecoder", nightlyAndroid: true },
  
  { name: "VideoEncoder", nightlyAndroid: true },
  
  { name: "VideoFrame", insecureContext: true },
  
  { name: "WGSLLanguageFeatures", earlyBetaOrEarlier: true },
  { name: "WGSLLanguageFeatures", windows: true },
  { name: "WGSLLanguageFeatures", mac: true, aarch64: true },
  
  { name: "WebGL2RenderingContext", insecureContext: true },
  
  { name: "WebGLActiveInfo", insecureContext: true },
  
  { name: "WebGLBuffer", insecureContext: true },
  
  { name: "WebGLContextEvent", insecureContext: true },
  
  { name: "WebGLFramebuffer", insecureContext: true },
  
  { name: "WebGLProgram", insecureContext: true },
  
  { name: "WebGLQuery", insecureContext: true },
  
  { name: "WebGLRenderbuffer", insecureContext: true },
  
  { name: "WebGLRenderingContext", insecureContext: true },
  
  { name: "WebGLSampler", insecureContext: true },
  
  { name: "WebGLShader", insecureContext: true },
  
  { name: "WebGLShaderPrecisionFormat", insecureContext: true },
  
  { name: "WebGLSync", insecureContext: true },
  
  { name: "WebGLTexture", insecureContext: true },
  
  { name: "WebGLTransformFeedback", insecureContext: true },
  
  { name: "WebGLUniformLocation", insecureContext: true },
  
  { name: "WebGLVertexArrayObject", insecureContext: true },
  
  { name: "WebSocket", insecureContext: true },
  
  { name: "WebTransport", insecureContext: false },
  
  { name: "WebTransportBidirectionalStream", insecureContext: false },
  
  { name: "WebTransportDatagramDuplexStream", insecureContext: false },
  
  { name: "WebTransportError", insecureContext: false },
  
  { name: "WebTransportReceiveStream", insecureContext: false },
  
  { name: "WebTransportSendStream", insecureContext: false },
  
  { name: "Worker", insecureContext: true },
  
  { name: "WorkerGlobalScope", insecureContext: true },
  
  { name: "WorkerLocation", insecureContext: true },
  
  { name: "WorkerNavigator", insecureContext: true },
  
  { name: "WritableStream", insecureContext: true },
  
  { name: "WritableStreamDefaultController", insecureContext: true },
  
  { name: "WritableStreamDefaultWriter", insecureContext: true },
  
  { name: "XMLHttpRequest", insecureContext: true },
  
  { name: "XMLHttpRequestEventTarget", insecureContext: true },
  
  { name: "XMLHttpRequestUpload", insecureContext: true },
  
  { name: "cancelAnimationFrame", insecureContext: true },
  
  { name: "close", insecureContext: true },
  
  { name: "console", insecureContext: true },
  
  { name: "name", insecureContext: true },
  
  { name: "onmessage", insecureContext: true },
  
  { name: "onmessageerror", insecureContext: true },
  
  { name: "onrtctransform", insecureContext: true },
  
  { name: "postMessage", insecureContext: true },
  
  { name: "requestAnimationFrame", insecureContext: true },
  
];




let testFunctions = [
  "ok",
  "is",
  "workerTestArrayEquals",
  "workerTestDone",
  "workerTestGetPermissions",
  "workerTestGetHelperData",
  "entryDisabled",
  "createInterfaceMap",
  "runTest",
];

workerTestGetHelperData(function (data) {
  runTest("self", self, {
    data,
    testFunctions,
    interfaceGroups: [ecmaGlobals, interfaceNamesInGlobalScope],
  });
  if (WebAssembly && !entryDisabled(wasmGlobalEntry, data)) {
    runTest("WebAssembly", WebAssembly, {
      data,
      interfaceGroups: [wasmGlobalInterfaces],
    });
  }
  workerTestDone();
});
