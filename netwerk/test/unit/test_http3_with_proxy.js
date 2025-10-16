"use strict";



const { Http3ProxyFilter, NodeHTTP2ProxyServer } = ChromeUtils.importESModule(
  "resource://testing-common/NodeServer.sys.mjs"
);



let number_of_parallel_requests = 120;
let h3Route;
let httpsOrigin;
let h3AltSvc;
let h3Port;
let h3ServerDomain;
let prefs;

let pps = Cc["@mozilla.org/network/protocol-proxy-service;1"].getService();
let proxyHost;
let proxyPort;
let proxyFilter;

add_setup(async function () {
  let h2Port = Services.env.get("MOZHTTP2_PORT");
  Assert.notEqual(h2Port, null);
  Assert.notEqual(h2Port, "");
  h3Port = await create_h3_server();
  Assert.notEqual(h3Port, null);
  Assert.notEqual(h3Port, "");
  h3AltSvc = ":" + h3Port;
  h3ServerDomain = "foo.example.com";
  h3Route = `${h3ServerDomain}:${h3Port}`;
  do_get_profile();
  prefs = Services.prefs;

  prefs.setBoolPref("network.http.http3.enable", true);
  
  
  prefs.setBoolPref("network.proxy.allow_hijacking_localhost", true);
  prefs.setBoolPref("network.http.altsvc.oe", true);

  if (mozinfo.os == "android") {
    
    
    prefs.setCharPref("network.dns.localDomains", "");
    const overrideService = Cc[
      "@mozilla.org/network/native-dns-override;1"
    ].getService(Ci.nsINativeDNSResolverOverride);
    overrideService.addIPOverride(h3ServerDomain, "10.0.2.2");
    prefs.setCharPref(
      "network.http.http3.alt-svc-mapping-for-testing",
      `${h3ServerDomain};h3=:${h3Port}`
    );
  } else {
    prefs.setCharPref(
      "network.dns.localDomains",
      "foo.example.com, alt1.example.com"
    );
  }

  
  
  
  let certdb = Cc["@mozilla.org/security/x509certdb;1"].getService(
    Ci.nsIX509CertDB
  );
  addCertFromFile(certdb, "http2-ca.pem", "CTu,u,u");
  addCertFromFile(certdb, "proxy-ca.pem", "CTu,u,u");
  httpsOrigin = `https://${h3ServerDomain}:${h2Port}/`;

  proxyHost = "alt1.example.com";
  proxyPort = (await create_masque_proxy_server()).masqueProxyPort;
  Assert.notEqual(proxyPort, null);
  Assert.notEqual(proxyPort, "");
  proxyFilter = new Http3ProxyFilter(
    proxyHost,
    proxyPort,
    0,
    "/.well-known/masque/udp/{target_host}/{target_port}/",
    ""
  );
  pps.registerFilter(proxyFilter, 10);

  registerCleanupFunction(() => {
    prefs.clearUserPref("network.http.http3.enable");
    prefs.clearUserPref("network.dns.localDomains");
    prefs.clearUserPref("network.proxy.allow_hijacking_localhost");
    prefs.clearUserPref("network.http.altsvc.oe");
    prefs.clearUserPref("network.http.http3.alt-svc-mapping-for-testing");
    pps.unregisterFilter(proxyFilter);
    if (mozinfo.os == "android") {
      const overrideService = Cc[
        "@mozilla.org/network/native-dns-override;1"
      ].getService(Ci.nsINativeDNSResolverOverride);
      overrideService.clearOverrides();
    }
  });
});

add_task(async function test_https_alt_svc() {
  await waitForHttp3Route(httpsOrigin + "http3-test", h3Route, h3AltSvc, {
    delayMs: 500,
  });
});

add_task(async function test_multiple_requests() {
  await do_test_multiple_requests(
    number_of_parallel_requests,
    h3Route,
    httpsOrigin
  );
});

add_task(async function test_request_cancelled_by_server() {
  await do_test_request_cancelled_by_server(h3Route, httpsOrigin);
});

add_task(async function test_stream_cancelled_by_necko() {
  await do_test_stream_cancelled_by_necko(h3Route, httpsOrigin);
});

add_task(async function test_multiple_request_one_is_cancelled() {
  await do_test_multiple_request_one_is_cancelled(
    number_of_parallel_requests,
    h3Route,
    httpsOrigin
  );
});

add_task(async function test_multiple_request_one_is_cancelled_by_necko() {
  await do_test_multiple_request_one_is_cancelled_by_necko(
    number_of_parallel_requests,
    h3Route,
    httpsOrigin
  );
});

add_task(async function test_post() {
  await do_test_post(httpsOrigin, h3Route);
});

add_task(async function test_patch() {
  await do_test_patch(httpsOrigin, h3Route);
});

add_task(
  {
    
    
    
    skip_if: () => mozinfo.os == "android",
  },
  async function test_http_alt_svc() {
    setup_h1_server(h3ServerDomain);
    await waitForHttp3Route(httpOrigin + "http3-test", h3Route, h3AltSvc, {
      delayMs: 500,
    });
  }
);

add_task(async function test_slow_receiver() {
  await do_test_slow_receiver(httpsOrigin, h3Route);
});





add_task(async function test_version_fallback() {
  let proxy = new NodeHTTP2ProxyServer();
  await proxy.startWithoutProxyFilter(proxyPort);
  registerCleanupFunction(async () => {
    await proxy.stop();
  });
  Assert.equal(proxyPort, proxy.port());
  info(`proxy port=${proxy.port()}\n`);

  await do_test_version_fallback(httpsOrigin);
});
