"use strict";

const { HttpServer } = ChromeUtils.importESModule(
  "resource://testing-common/httpd.sys.mjs"
);
const { NodeHTTP2Server } = ChromeUtils.importESModule(
  "resource://testing-common/NodeServer.sys.mjs"
);

const override = Cc["@mozilla.org/network/native-dns-override;1"].getService(
  Ci.nsINativeDNSResolverOverride
);

function makeChannel(url) {
  let uri2 = NetUtil.newURI(url);
  
  
  var principal = Services.scriptSecurityManager.createContentPrincipal(
    uri2,
    {}
  );
  return NetUtil.newChannel({
    uri: url,
    loadingPrincipal: principal,
    securityFlags: Ci.nsILoadInfo.SEC_REQUIRE_SAME_ORIGIN_INHERITS_SEC_CONTEXT,
    contentPolicyType: Ci.nsIContentPolicy.TYPE_OTHER,
  }).QueryInterface(Ci.nsIHttpChannel);
}

var ChannelCreationObserver = {
  QueryInterface: ChromeUtils.generateQI(["nsIObserver"]),
  observe(aSubject, aTopic) {
    if (aTopic == "http-on-opening-request") {
      var chan = aSubject.QueryInterface(Ci.nsIHttpChannel);
      if (chan.URI.spec.includes("test_lna_social_tracker")) {
        chan.loadInfo.triggeringThirdPartyClassificationFlags =
          Ci.nsIClassifiedChannel.CLASSIFIED_ANY_SOCIAL_TRACKING;
      } else if (chan.URI.spec.includes("test_lna_basic_tracker")) {
        chan.loadInfo.triggeringThirdPartyClassificationFlags =
          Ci.nsIClassifiedChannel.CLASSIFIED_ANY_BASIC_TRACKING;
      } else if (chan.URI.spec.includes("test_lna_content_tracker")) {
        chan.loadInfo.triggeringThirdPartyClassificationFlags =
          Ci.nsIClassifiedChannel.CLASSIFIED_TRACKING_CONTENT;
      }
    }
  },
};

ChromeUtils.defineLazyGetter(this, "H1_URL", function () {
  return "http://localhost:" + httpServer.identity.primaryPort;
});

ChromeUtils.defineLazyGetter(this, "H2_URL", function () {
  return "https://localhost:" + server.port();
});

ChromeUtils.defineLazyGetter(this, "H1_EXAMPLE_URL", function () {
  return "http://example.com:" + httpServer.identity.primaryPort;
});

ChromeUtils.defineLazyGetter(this, "H1_TEST_EXAMPLE_URL", function () {
  return "http://test.example.com:" + httpServer.identity.primaryPort;
});

ChromeUtils.defineLazyGetter(this, "H1_SERVER_LOCAL_URL", function () {
  return "http://server.local:" + httpServer.identity.primaryPort;
});

ChromeUtils.defineLazyGetter(this, "H1_API_DEV_LOCAL_URL", function () {
  return "http://api.dev.local:" + httpServer.identity.primaryPort;
});

let httpServer = null;
let server = new NodeHTTP2Server();
function pathHandler(metadata, response) {
  response.setStatusLine(metadata.httpVersion, 200, "OK");
  let body = "success";
  response.bodyOutputStream.write(body, body.length);
}

add_setup(async () => {
  Services.prefs.setBoolPref("network.lna.block_trackers", true);
  Services.obs.addObserver(ChannelCreationObserver, "http-on-opening-request");
  
  Services.prefs.setBoolPref("network.lna.blocking", true);

  
  
  Services.prefs.setBoolPref("network.localhost.prompt.testing", true);
  Services.prefs.setBoolPref("network.localnetwork.prompt.testing", true);

  
  httpServer = new HttpServer();
  httpServer.registerPathHandler("/test_lna", pathHandler);
  httpServer.start(-1);
  
  httpServer.identity.add("http", "example.com", 80);
  httpServer.identity.add("http", "test.example.com", 80);
  httpServer.identity.add("http", "server.local", 80);
  httpServer.identity.add("http", "api.dev.local", 80);

  
  let certdb = Cc["@mozilla.org/security/x509certdb;1"].getService(
    Ci.nsIX509CertDB
  );
  addCertFromFile(certdb, "http2-ca.pem", "CTu,u,u");

  await server.start();
  registerCleanupFunction(async () => {
    try {
      await server.stop();
      await httpServer.stop();
      Services.prefs.clearUserPref("network.lna.blocking");
      Services.prefs.clearUserPref("network.lna.blocking.prompt.testing");
      Services.prefs.clearUserPref("network.localhost.prompt.testing.allow");
      Services.prefs.clearUserPref("network.localnetwork.prompt.testing.allow");

      Services.prefs.clearUserPref(
        "network.lna.address_space.private.override"
      );
    } catch (e) {
      
      info("Error during cleanup:", e);
    }
  });
  await server.registerPathHandler("/test_lna", (req, resp) => {
    let content = `ok`;
    resp.writeHead(200, {
      "Content-Type": "text/plain",
      "Content-Length": `${content.length}`,
    });
    resp.end(content);
  });
});




add_task(async function lna_blocking_tests_localhost_prompt() {
  const localHostTestCases = [
    
    [true, Ci.nsILoadInfo.Public, "/test_lna", Cr.NS_OK, H1_URL],
    [true, Ci.nsILoadInfo.Private, "/test_lna", Cr.NS_OK, H1_URL],
    [false, Ci.nsILoadInfo.Local, "/test_lna", Cr.NS_OK, H1_URL],
    [
      false,
      Ci.nsILoadInfo.Public,
      "/test_lna",
      Cr.NS_ERROR_LOCAL_NETWORK_ACCESS_DENIED,
      H1_URL,
    ],
    [
      false,
      Ci.nsILoadInfo.Private,
      "/test_lna",
      Cr.NS_ERROR_LOCAL_NETWORK_ACCESS_DENIED,
      H1_URL,
    ],
    [true, Ci.nsILoadInfo.Public, "/test_lna", Cr.NS_OK, H2_URL],
    [true, Ci.nsILoadInfo.Private, "/test_lna", Cr.NS_OK, H2_URL],
    [true, Ci.nsILoadInfo.Local, "/test_lna", Cr.NS_OK, H2_URL],
    [
      false,
      Ci.nsILoadInfo.Public,
      "/test_lna",
      Cr.NS_ERROR_LOCAL_NETWORK_ACCESS_DENIED,
      H2_URL,
    ],
    [
      false,
      Ci.nsILoadInfo.Private,
      "/test_lna",
      Cr.NS_ERROR_LOCAL_NETWORK_ACCESS_DENIED,
      H2_URL,
    ],
    [true, Ci.nsILoadInfo.Local, "/test_lna", Cr.NS_OK, H2_URL],
    [
      false,
      Ci.nsILoadInfo.Public,
      "/test_lna",
      Cr.NS_ERROR_LOCAL_NETWORK_ACCESS_DENIED,
      H2_URL,
    ],
    [
      false,
      Ci.nsILoadInfo.Private,
      "/test_lna",
      Cr.NS_ERROR_LOCAL_NETWORK_ACCESS_DENIED,
      H2_URL,
    ],
    [false, Ci.nsILoadInfo.Local, "/test_lna", Cr.NS_OK, H2_URL],
    
    
    [false, Ci.nsILoadInfo.Local, "/test_lna_basic_tracker", Cr.NS_OK, H2_URL],
    [false, Ci.nsILoadInfo.Local, "/test_lna_social_tracker", Cr.NS_OK, H2_URL],
    [
      false,
      Ci.nsILoadInfo.Local,
      "/test_lna_content_tracker",
      Cr.NS_OK,
      H2_URL,
    ],
    [
      false,
      Ci.nsILoadInfo.Public,
      "/test_lna_basic_tracker",
      Cr.NS_ERROR_LOCAL_NETWORK_ACCESS_DENIED,
      H2_URL,
    ],
    [
      false,
      Ci.nsILoadInfo.Public,
      "/test_lna_social_tracker",
      Cr.NS_ERROR_LOCAL_NETWORK_ACCESS_DENIED,
      H2_URL,
    ],
    [
      true,
      Ci.nsILoadInfo.Public,
      "/test_lna_content_tracker",
      Cr.NS_OK,
      H2_URL,
    ],
    [
      false,
      Ci.nsILoadInfo.Private,
      "/test_lna_basic_tracker",
      Cr.NS_ERROR_LOCAL_NETWORK_ACCESS_DENIED,
      H2_URL,
    ],
    [
      false,
      Ci.nsILoadInfo.Private,
      "/test_lna_social_tracker",
      Cr.NS_ERROR_LOCAL_NETWORK_ACCESS_DENIED,
      H2_URL,
    ],
    [
      false,
      Ci.nsILoadInfo.Private,
      "/test_lna_content_tracker",
      Cr.NS_ERROR_LOCAL_NETWORK_ACCESS_DENIED,
      H2_URL,
    ],
  ];

  for (let [allow, space, suffix, expectedStatus, url] of localHostTestCases) {
    info(`do_test ${url}${suffix}, ${space} -> ${expectedStatus}`);

    Services.prefs.setBoolPref("network.localhost.prompt.testing.allow", allow);

    let chan = makeChannel(url + suffix);
    chan.loadInfo.parentIpAddressSpace = space;

    let expectFailure = expectedStatus !== Cr.NS_OK ? CL_EXPECT_FAILURE : 0;

    await new Promise(resolve => {
      chan.asyncOpen(new ChannelListener(resolve, null, expectFailure));
    });

    Assert.equal(chan.status, expectedStatus);
    if (expectedStatus === Cr.NS_OK) {
      Assert.equal(chan.protocolVersion, url === H1_URL ? "http/1.1" : "h2");
    }
  }
});

add_task(async function lna_blocking_tests_local_network() {
  
  var override_value =
    "127.0.0.1" +
    ":" +
    httpServer.identity.primaryPort +
    "," +
    "127.0.0.1" +
    ":" +
    server.port();

  Services.prefs.setCharPref(
    "network.lna.address_space.private.override",
    override_value
  );

  const localNetworkTestCases = [
    
    [true, Ci.nsILoadInfo.Public, "/test_lna", Cr.NS_OK, H1_URL],
    [false, Ci.nsILoadInfo.Private, "/test_lna", Cr.NS_OK, H1_URL],
    [false, Ci.nsILoadInfo.Local, "/test_lna", Cr.NS_OK, H1_URL],
    [
      false,
      Ci.nsILoadInfo.Public,
      "/test_lna",
      Cr.NS_ERROR_LOCAL_NETWORK_ACCESS_DENIED,
      H1_URL,
    ],
    [false, Ci.nsILoadInfo.Private, "/test_lna", Cr.NS_OK, H1_URL],
    [true, Ci.nsILoadInfo.Public, "/test_lna", Cr.NS_OK, H2_URL],
    [false, Ci.nsILoadInfo.Private, "/test_lna", Cr.NS_OK, H2_URL],
    [false, Ci.nsILoadInfo.Local, "/test_lna", Cr.NS_OK, H2_URL],
    [
      false,
      Ci.nsILoadInfo.Public,
      "/test_lna",
      Cr.NS_ERROR_LOCAL_NETWORK_ACCESS_DENIED,
      H2_URL,
    ],
  ];

  for (let [
    allow,
    space,
    suffix,
    expectedStatus,
    url,
  ] of localNetworkTestCases) {
    info(`do_test ${url}, ${space} -> ${expectedStatus}`);

    Services.prefs.setBoolPref(
      "network.localnetwork.prompt.testing.allow",
      allow
    );

    let chan = makeChannel(url + suffix);
    chan.loadInfo.parentIpAddressSpace = space;

    let expectFailure = expectedStatus !== Cr.NS_OK ? CL_EXPECT_FAILURE : 0;

    await new Promise(resolve => {
      chan.asyncOpen(new ChannelListener(resolve, null, expectFailure));
    });

    Assert.equal(chan.status, expectedStatus);
    if (expectedStatus === Cr.NS_OK) {
      Assert.equal(chan.protocolVersion, url === H1_URL ? "http/1.1" : "h2");
    }
  }
});


add_task(async function lna_domain_skip_tests() {
  
  override.clearOverrides();
  Services.dns.clearCache(true);

  override.addIPOverride("example.com", "127.0.0.1");
  override.addIPOverride("test.example.com", "127.0.0.1");
  override.addIPOverride("server.local", "127.0.0.1");
  override.addIPOverride("api.dev.local", "127.0.0.1");

  
  
  var override_value =
    "127.0.0.1" +
    ":" +
    httpServer.identity.primaryPort +
    "," +
    "127.0.0.1" +
    ":" +
    server.port();

  Services.prefs.setCharPref(
    "network.lna.address_space.private.override",
    override_value
  );

  const domainSkipTestCases = [
    
    
    [
      "localhost",
      Ci.nsILoadInfo.Public,
      Cr.NS_OK,
      H1_URL,
      "exact domain match - localhost",
    ],
    [
      "localhost",
      Ci.nsILoadInfo.Public,
      Cr.NS_OK,
      H2_URL,
      "exact domain match - localhost H2",
    ],
    [
      "example.com",
      Ci.nsILoadInfo.Public,
      Cr.NS_OK,
      H1_EXAMPLE_URL,
      "exact domain match - example.com",
    ],

    
    [
      "*.localhost",
      Ci.nsILoadInfo.Public,
      Cr.NS_OK,
      H1_URL,
      "wildcard domain match - *.localhost matches localhost",
    ],
    [
      "*.example.com",
      Ci.nsILoadInfo.Public,
      Cr.NS_OK,
      H1_TEST_EXAMPLE_URL,
      "wildcard domain match - *.example.com matches test.example.com",
    ],
    [
      "*.example.com",
      Ci.nsILoadInfo.Public,
      Cr.NS_OK,
      H1_EXAMPLE_URL,
      "wildcard domain match - *.example.com matches example.com",
    ],
    [
      "*.test.com",
      Ci.nsILoadInfo.Public,
      Cr.NS_ERROR_LOCAL_NETWORK_ACCESS_DENIED,
      H1_EXAMPLE_URL,
      "wildcard no match - *.test.com doesn't match example.com",
    ],

    
    [
      "example.com,localhost,test.org",
      Ci.nsILoadInfo.Public,
      Cr.NS_OK,
      H1_URL,
      "multiple domains - localhost match",
    ],
    [
      "example.com,localhost,test.org",
      Ci.nsILoadInfo.Public,
      Cr.NS_OK,
      H1_EXAMPLE_URL,
      "multiple domains - example.com match",
    ],
    [
      "foo.com,test.org",
      Ci.nsILoadInfo.Public,
      Cr.NS_ERROR_LOCAL_NETWORK_ACCESS_DENIED,
      H1_EXAMPLE_URL,
      "multiple domains no match - example.com not in list",
    ],

    
    [
      "",
      Ci.nsILoadInfo.Public,
      Cr.NS_ERROR_LOCAL_NETWORK_ACCESS_DENIED,
      H1_URL,
      "empty skip domains - should block",
    ],

    
    [
      "*.local",
      Ci.nsILoadInfo.Public,
      Cr.NS_OK,
      H1_SERVER_LOCAL_URL,
      "wildcard .local - *.local matches server.local",
    ],
    [
      "*.local",
      Ci.nsILoadInfo.Public,
      Cr.NS_OK,
      H1_API_DEV_LOCAL_URL,
      "wildcard .local - *.local matches api.dev.local",
    ],
    [
      "*.dev.local",
      Ci.nsILoadInfo.Public,
      Cr.NS_OK,
      H1_API_DEV_LOCAL_URL,
      "wildcard subdomain .local - *.dev.local matches api.dev.local",
    ],
    [
      "server.local",
      Ci.nsILoadInfo.Public,
      Cr.NS_OK,
      H1_SERVER_LOCAL_URL,
      "exact match .local - server.local matches server.local",
    ],
    [
      "*.local",
      Ci.nsILoadInfo.Public,
      Cr.NS_ERROR_LOCAL_NETWORK_ACCESS_DENIED,
      H1_URL,
      "wildcard .local - *.local doesn't match localhost",
    ],

    
    [
      "localhost,*.local,*.internal",
      Ci.nsILoadInfo.Public,
      Cr.NS_OK,
      H1_URL,
      "combined patterns - localhost matches localhost",
    ],
    [
      "localhost,*.local,*.internal",
      Ci.nsILoadInfo.Public,
      Cr.NS_OK,
      H1_SERVER_LOCAL_URL,
      "combined patterns - *.local matches server.local",
    ],

    
    [
      "*",
      Ci.nsILoadInfo.Public,
      Cr.NS_OK,
      H1_URL,
      "wildcard all - * matches localhost",
    ],
    [
      "*",
      Ci.nsILoadInfo.Public,
      Cr.NS_OK,
      H1_EXAMPLE_URL,
      "wildcard all - * matches example.com",
    ],
    [
      "*",
      Ci.nsILoadInfo.Public,
      Cr.NS_OK,
      H1_SERVER_LOCAL_URL,
      "wildcard all - * matches server.local",
    ],
    [
      "*",
      Ci.nsILoadInfo.Public,
      Cr.NS_OK,
      H1_TEST_EXAMPLE_URL,
      "wildcard all - * matches test.example.com",
    ],
  ];

  for (let [
    skipDomains,
    parentSpace,
    expectedStatus,
    url,
    description,
  ] of domainSkipTestCases) {
    info(`Testing domain skip: ${description} - domains: "${skipDomains}"`);

    
    Services.prefs.setCharPref("network.lna.skip-domains", skipDomains);

    
    Services.prefs.setBoolPref("network.localhost.prompt.testing.allow", false);

    let chan = makeChannel(url + "/test_lna");
    chan.loadInfo.parentIpAddressSpace = parentSpace;

    let expectFailure = expectedStatus !== Cr.NS_OK ? CL_EXPECT_FAILURE : 0;

    await new Promise(resolve => {
      chan.asyncOpen(new ChannelListener(resolve, null, expectFailure));
    });

    Assert.equal(
      chan.status,
      expectedStatus,
      `Status should match for: ${description}`
    );
    if (expectedStatus === Cr.NS_OK) {
      Assert.equal(chan.protocolVersion, url === H2_URL ? "h2" : "http/1.1");
    }
  }

  
  Services.prefs.clearUserPref("network.lna.skip-domains");
  Services.prefs.clearUserPref("network.lna.address_space.private.override");
  override.clearOverrides();
  Services.dns.clearCache(true);
});
