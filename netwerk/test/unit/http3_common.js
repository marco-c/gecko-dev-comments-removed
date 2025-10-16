



"use strict";






const { HttpServer } = ChromeUtils.importESModule(
  "resource://testing-common/httpd.sys.mjs"
);

function makeChan(uri) {
  let chan = NetUtil.newChannel({
    uri,
    loadUsingSystemPrincipal: true,
  }).QueryInterface(Ci.nsIHttpChannel);
  chan.loadFlags = Ci.nsIChannel.LOAD_INITIAL_DOCUMENT_URI;
  return chan;
}


class Http3CheckListener {
  constructor(
    { expectedStatus = Cr.NS_OK, expectedRoute = "" } = {},
    resolve,
    reject
  ) {
    this.onDataAvailableFired = false;
    this.expectedStatus = expectedStatus;
    this.expectedRoute = expectedRoute;
    this._resolve = resolve;
    this._reject = reject;
  }

  onStartRequest(request) {
    Assert.ok(request instanceof Ci.nsIHttpChannel);
    Assert.equal(request.status, this.expectedStatus);
    if (Components.isSuccessCode(this.expectedStatus)) {
      Assert.equal(request.responseStatus, 200);
    }
  }

  onDataAvailable(request, stream, off, cnt) {
    this.onDataAvailableFired = true;
    read_stream(stream, cnt);
  }

  onStopRequest(request, status) {
    Assert.equal(status, this.expectedStatus);

    let routed = "NA";
    try {
      routed = request.getRequestHeader("Alt-Used");
    } catch (e) {}
    dump("routed is " + routed + "\n");

    Assert.equal(routed, this.expectedRoute);

    if (Components.isSuccessCode(this.expectedStatus)) {
      let httpVersion = "";
      try {
        httpVersion = request.protocolVersion;
      } catch (e) {}
      Assert.equal(httpVersion, "h3");
      Assert.equal(this.onDataAvailableFired, true);
      Assert.equal(request.getResponseHeader("X-Firefox-Http3"), "h3");
    }

    this._resolve?.(request);
  }
}

class WaitForHttp3Listener extends Http3CheckListener {
  constructor(
    {
      expectedStatus = Cr.NS_OK,
      expectedRoute = "",
      uri = "",
      h3AltSvc = "",
      retry,
      delayMs = 500,
    } = {},
    resolve,
    reject
  ) {
    super({ expectedStatus, expectedRoute }, resolve, reject);
    this.uri = uri;
    this.h3AltSvc = h3AltSvc;
    this._retry = retry; 
    this._delayMs = delayMs; 
  }

  onStopRequest(request, status) {
    Assert.equal(status, this.expectedStatus);

    let routed = "NA";
    try {
      routed = request.getRequestHeader("Alt-Used");
    } catch (e) {}
    dump(`routed is ${routed}\n`);

    let httpVersion = "";
    try {
      httpVersion = request.protocolVersion;
    } catch (e) {}

    if (routed === this.expectedRoute) {
      
      Assert.equal(routed, this.expectedRoute); 
      Assert.equal(httpVersion, "h3");
      this._resolve?.(request);
      return;
    }

    
    dump("poll later for alt-svc mapping\n");
    if (httpVersion === "h2") {
      request.QueryInterface(Ci.nsIHttpChannelInternal);
      Assert.ok(request.supportsHTTP3);
    }

    if (typeof this._retry === "function") {
      
      do_timeout(this._delayMs, () =>
        this._retry(this.uri, this.expectedRoute, this.h3AltSvc)
      );
    }
    
  }
}


function createHttp3CheckListener(options = {}) {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  const listener = new Http3CheckListener(options, resolve, reject);
  return { listener, promise };
}

function createWaitForHttp3Listener(options = {}) {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  const listener = new WaitForHttp3Listener(options, resolve, reject);
  return { listener, promise };
}


async function waitForHttp3Route(
  uri,
  expectedRoute,
  altSvc,
  { delayMs = 500 } = {}
) {
  let listenerRef;

  
  const retry = () => {
    const chan = makeChan(uri);
    if (altSvc) {
      chan.setRequestHeader("x-altsvc", altSvc, false);
    }
    chan.asyncOpen(listenerRef);
  };

  const { listener, promise } = createWaitForHttp3Listener({
    expectedStatus: Cr.NS_OK,
    expectedRoute,
    uri,
    h3AltSvc: altSvc,
    retry,
    delayMs,
  });
  listenerRef = listener;

  
  retry();

  
  return promise;
}


class MultipleListener {
  constructor(
    {
      number_of_parallel_requests = 0,
      expectedRoute = "",
      with_error = Cr.NS_OK, 
    } = {},
    resolve,
    reject
  ) {
    this.number_of_parallel_requests = number_of_parallel_requests;
    this.expectedRoute = expectedRoute;
    this.with_error = with_error;

    this.count_of_done_requests = 0;
    this.error_found_onstart = false;
    this.error_found_onstop = false;
    this.need_cancel_found = false;

    this._resolve = resolve;
    this._reject = reject;
  }

  onStartRequest(request) {
    Assert.ok(request instanceof Ci.nsIHttpChannel);

    
    let need_cancel = "";
    try {
      need_cancel = request.getRequestHeader("CancelMe");
    } catch (_) {}
    if (need_cancel !== "") {
      this.need_cancel_found = true;
      request.cancel(Cr.NS_ERROR_ABORT);
      return;
    }

    
    if (Components.isSuccessCode(request.status)) {
      Assert.equal(request.responseStatus, 200);
    } else if (this.error_found_onstart) {
      
      this._reject?.(
        new Error("We should have only one request failing (onStart).")
      );
    } else {
      Assert.equal(request.status, this.with_error);
      this.error_found_onstart = true;
    }
  }

  onDataAvailable(request, stream, off, cnt) {
    read_stream(stream, cnt);
  }

  onStopRequest(request) {
    
    let routed = "";
    try {
      routed = request.getRequestHeader("Alt-Used");
    } catch (_) {}
    Assert.equal(routed, this.expectedRoute);

    
    if (Components.isSuccessCode(request.status)) {
      let httpVersion = "";
      try {
        httpVersion = request.protocolVersion;
      } catch (_) {}
      Assert.equal(httpVersion, "h3");
    }

    
    if (!Components.isSuccessCode(request.status)) {
      if (this.error_found_onstop) {
        this._reject?.(
          new Error("We should have only one request failing (onStop).")
        );
        return;
      }
      Assert.equal(request.status, this.with_error);
      this.error_found_onstop = true;
    }

    
    this.count_of_done_requests++;
    if (this.count_of_done_requests === this.number_of_parallel_requests) {
      if (Components.isSuccessCode(this.with_error)) {
        
        Assert.equal(this.error_found_onstart, false);
        Assert.equal(this.error_found_onstop, false);
      } else {
        
        Assert.ok(this.error_found_onstart || this.need_cancel_found);
        Assert.equal(this.error_found_onstop, true);
      }
      this._resolve?.();
    }
  }
}


function createMultipleListener(options = {}) {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  const listener = new MultipleListener(options, resolve, reject);
  return { listener, promise };
}

async function do_test_multiple_requests(
  number_of_parallel_requests,
  h3Route,
  httpsOrigin
) {
  dump("test_multiple_requests()\n");

  const { listener, promise } = createMultipleListener({
    number_of_parallel_requests,
    expectedRoute: h3Route,
    with_error: Cr.NS_OK,
  });

  for (let i = 0; i < number_of_parallel_requests; i++) {
    const chan = makeChan(httpsOrigin + "20000");
    chan.asyncOpen(listener);
  }

  await promise;
}

async function do_test_request_cancelled_by_server(h3Route, httpsOrigin) {
  dump("do_test_request_cancelled_by_server()\n");

  const { listener, promise } = createHttp3CheckListener({
    expectedStatus: Cr.NS_ERROR_NET_INTERRUPT,
    expectedRoute: h3Route,
  });

  const chan = makeChan(httpsOrigin + "RequestCancelled");
  chan.asyncOpen(listener);

  
  await promise;
}




class CancelRequestListener extends Http3CheckListener {
  constructor({ expectedRoute = "" } = {}, resolve, reject) {
    super(
      { expectedStatus: Cr.NS_ERROR_ABORT, expectedRoute },
      resolve,
      reject
    );
  }

  onStartRequest(request) {
    Assert.ok(request instanceof Ci.nsIHttpChannel);
    Assert.equal(Components.isSuccessCode(request.status), true);
    
    request.cancel(Cr.NS_ERROR_ABORT);
  }
}

function createCancelRequestListener(options = {}) {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  const listener = new CancelRequestListener(options, resolve, reject);
  return { listener, promise };
}


async function do_test_stream_cancelled_by_necko(h3Route, httpsOrigin) {
  dump("do_test_stream_cancelled_by_necko()\n");

  const { listener, promise } = createCancelRequestListener({
    expectedRoute: h3Route,
  });

  const chan = makeChan(httpsOrigin + "20000");
  chan.asyncOpen(listener);

  
  await promise;
}

async function do_test_multiple_request_one_is_cancelled(
  number_of_parallel_requests,
  h3Route,
  httpsOrigin
) {
  dump("do_test_multiple_request_one_is_cancelled()\n");

  const { listener, promise } = createMultipleListener({
    number_of_parallel_requests,
    expectedRoute: h3Route,
    with_error: Cr.NS_ERROR_NET_INTERRUPT, 
  });

  for (let i = 0; i < number_of_parallel_requests; i++) {
    let uri = httpsOrigin + "20000";
    if (i === 4) {
      
      uri = httpsOrigin + "RequestCancelled";
    }
    const chan = makeChan(uri);
    chan.asyncOpen(listener);
  }

  
  await promise;
}

async function do_test_multiple_request_one_is_cancelled_by_necko(
  number_of_parallel_requests,
  h3Route,
  httpsOrigin
) {
  dump("do_test_multiple_request_one_is_cancelled_by_necko()\n");

  const { listener, promise } = createMultipleListener({
    number_of_parallel_requests,
    expectedRoute: h3Route,
    with_error: Cr.NS_ERROR_ABORT,
  });

  for (let i = 0; i < number_of_parallel_requests; i++) {
    let chan = makeChan(httpsOrigin + "20000");
    if (i === 4) {
      
      chan.setRequestHeader("CancelMe", "true", false);
    }
    chan.asyncOpen(listener);
  }

  
  await promise;
}




class PostListener extends Http3CheckListener {
  constructor(opts = {}, resolve, reject) {
    super(opts, resolve, reject);
  }
  onDataAvailable(request, stream, off, cnt) {
    this.onDataAvailableFired = true;
    read_stream(stream, cnt);
  }
}


function createPostListener(options = {}) {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  const listener = new PostListener(options, resolve, reject);
  return { listener, promise };
}


function openWithBody(
  content,
  chan,
  method = "POST",
  contentType = "text/plain"
) {
  const stream = Cc["@mozilla.org/io/string-input-stream;1"].createInstance(
    Ci.nsIStringInputStream
  );
  stream.setByteStringData(content);

  const uchan = chan.QueryInterface(Ci.nsIUploadChannel);
  uchan.setUploadStream(stream, contentType, stream.available());
  chan.requestMethod = method;
  return chan;
}


function generateContent(size) {
  let content = "";
  for (let i = 0; i < size; i++) {
    content += "0";
  }
  return content;
}

let post = generateContent(10);


async function do_test_post(httpsOrigin, h3Route) {
  dump("do_test_post()\n");

  const chan = makeChan(httpsOrigin + "post");
  openWithBody(post, chan, "POST");

  const { listener, promise } = createPostListener({
    expectedStatus: Cr.NS_OK,
    expectedRoute: h3Route,
  });

  chan.asyncOpen(listener);
  await promise; 
}


async function do_test_patch(httpsOrigin, h3Route) {
  dump("do_test_post()\n");

  const chan = makeChan(httpsOrigin + "patch");
  openWithBody(post, chan, "PATCH");

  const { listener, promise } = createPostListener({
    expectedStatus: Cr.NS_OK,
    expectedRoute: h3Route,
  });

  chan.asyncOpen(listener);
  await promise;
}

let h1Server = null;
let altsvcHost = "";
let httpOrigin = "";

function h1Response(metadata, response) {
  response.setStatusLine(metadata.httpVersion, 200, "OK");
  response.setHeader("Content-Type", "text/plain", false);
  response.setHeader("Connection", "close", false);
  response.setHeader("Cache-Control", "no-cache", false);
  response.setHeader("Access-Control-Allow-Origin", "*", false);
  response.setHeader("Access-Control-Allow-Method", "GET", false);
  response.setHeader("Access-Control-Allow-Headers", "x-altsvc", false);

  try {
    let hval = "h3=" + metadata.getHeader("x-altsvc");
    response.setHeader("Alt-Svc", hval, false);
  } catch (e) {}

  let body = "Q: What did 0 say to 8? A: Nice Belt!\n";
  response.bodyOutputStream.write(body, body.length);
}

function h1ServerWK(metadata, response) {
  response.setStatusLine(metadata.httpVersion, 200, "OK");
  response.setHeader("Content-Type", "application/json", false);
  response.setHeader("Connection", "close", false);
  response.setHeader("Cache-Control", "no-cache", false);
  response.setHeader("Access-Control-Allow-Origin", "*", false);
  response.setHeader("Access-Control-Allow-Method", "GET", false);
  response.setHeader("Access-Control-Allow-Headers", "x-altsvc", false);

  let body = `["http://${altsvcHost}:${h1Server.identity.primaryPort}"]`;
  response.bodyOutputStream.write(body, body.length);
}

function setup_h1_server(host) {
  altsvcHost = host;
  h1Server = new HttpServer();
  h1Server.registerPathHandler("/http3-test", h1Response);
  h1Server.registerPathHandler("/.well-known/http-opportunistic", h1ServerWK);
  h1Server.registerPathHandler("/VersionFallback", h1Response);
  h1Server.start(-1);
  h1Server.identity.setPrimary(
    "http",
    altsvcHost,
    h1Server.identity.primaryPort
  );
  httpOrigin = `http://${altsvcHost}:${h1Server.identity.primaryPort}/`;
  registerCleanupFunction(() => {
    h1Server.stop();
  });
}





class SlowReceiverListener extends Http3CheckListener {
  constructor(
    {
      expectedStatus = Cr.NS_OK,
      expectedRoute = "",
      expectedBytes = 10_000_000,
    } = {},
    resolve,
    reject
  ) {
    super({ expectedStatus, expectedRoute }, resolve, reject);
    this.count = 0;
    this.expectedBytes = expectedBytes;
  }

  onDataAvailable(request, stream, off, cnt) {
    this.onDataAvailableFired = true;
    this.count += cnt;
    read_stream(stream, cnt);
  }

  onStopRequest(request, status) {
    Assert.equal(status, this.expectedStatus);
    Assert.equal(this.count, this.expectedBytes);

    let routed = "NA";
    try {
      routed = request.getRequestHeader("Alt-Used");
    } catch (e) {}
    dump(`routed is ${routed}\n`);
    Assert.equal(routed, this.expectedRoute);

    if (Components.isSuccessCode(this.expectedStatus)) {
      let httpVersion = "";
      try {
        httpVersion = request.protocolVersion;
      } catch (e) {}
      Assert.equal(httpVersion, "h3");
      Assert.equal(this.onDataAvailableFired, true);
    }

    
    this._resolve?.(request);
  }
}

function createSlowReceiverListener(options = {}) {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  const listener = new SlowReceiverListener(options, resolve, reject);
  return { listener, promise };
}


async function do_test_slow_receiver(httpsOrigin, h3Route) {
  dump("do_test_slow_receiver()\n");

  const chan = makeChan(httpsOrigin + "10000000");

  const { listener, promise } = createSlowReceiverListener({
    expectedStatus: Cr.NS_OK,
    expectedRoute: h3Route,
    expectedBytes: 10_000_000,
  });

  chan.asyncOpen(listener);

  
  chan.suspend();
  await new Promise(r => do_timeout(1000, r));
  chan.resume();

  
  await promise;
}


class CheckFallbackListener {
  constructor(resolve, reject) {
    this._resolve = resolve;
    this._reject = reject;
  }

  onStartRequest(request) {
    Assert.ok(request instanceof Ci.nsIHttpChannel);
    Assert.equal(request.status, Cr.NS_OK);
    Assert.equal(request.responseStatus, 200);
  }

  onDataAvailable(request, stream, off, cnt) {
    read_stream(stream, cnt);
  }

  onStopRequest(request, status) {
    Assert.equal(status, Cr.NS_OK);

    let routed = "NA";
    try {
      routed = request.getRequestHeader("Alt-Used");
    } catch (e) {}
    dump(`routed is ${routed}\n`);
    Assert.equal(routed, "0");

    let httpVersion = "";
    try {
      httpVersion = request.protocolVersion;
    } catch (e) {}
    Assert.equal(httpVersion, "http/1.1");

    
    this._resolve?.(request);
  }
}


function createCheckFallbackListener() {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  const listener = new CheckFallbackListener(resolve, reject);
  return { listener, promise };
}


async function do_test_version_fallback(httpsOrigin) {
  dump("do_test_version_fallback()\n");

  const chan = makeChan(httpsOrigin + "VersionFallback");
  const { listener, promise } = createCheckFallbackListener();

  chan.asyncOpen(listener);

  await promise;
}
