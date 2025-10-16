"use strict";

const PROMPT_ALLOW_BUTTON = -1;
const PROMPT_NOT_NOW_BUTTON = 0;

const { HttpServer } = ChromeUtils.importESModule(
  "resource://testing-common/httpd.sys.mjs"
);

const baseURL = getRootDirectory(gTestPath).replace(
  "chrome://mochitests/content",
  "https://example.com"
);

async function restorePermissions() {
  info("Restoring permissions");
  Services.obs.notifyObservers(null, "testonly-reload-permissions-from-disk");
  Services.perms.removeAll();
}

add_setup(async function () {
  await SpecialPowers.pushPrefEnv({
    set: [
      ["permissions.manager.defaultsUrl", ""],
      ["network.websocket.delay-failed-reconnects", false],
      ["network.websocket.max-connections", 1000],
      ["network.lna.block_trackers", true],
      ["network.lna.blocking", true],
      ["network.http.rcwn.enabled", false],
    ],
  });
  Services.obs.notifyObservers(null, "testonly-reload-permissions-from-disk");

  const server = new HttpServer();
  server.start(21555);
  registerServerHandlers(server);

  registerCleanupFunction(async () => {
    await restorePermissions();
    await new Promise(resolve => {
      server.stop(resolve);
    });
  });
});

requestLongerTimeout(10);

function clickDoorhangerButton(buttonIndex, browser, notificationID) {
  let popup = PopupNotifications.getNotification(notificationID, browser);
  let notification = popup?.owner?.panel?.childNodes?.[0];
  ok(notification, "Notification popup is available");

  if (buttonIndex === PROMPT_ALLOW_BUTTON) {
    ok(true, "Triggering main action (allow)");
    notification.button.doCommand();
  } else {
    ok(true, "Triggering secondary action (deny)");
    notification.secondaryButton.doCommand();
  }
}

function observeAndCheck(testType, rand, expectedStatus, message) {
  return new Promise(resolve => {
    const url = `http://localhost:21555/?type=${testType}&rand=${rand}`;
    const observer = {
      observe(subject, topic) {
        if (topic !== "http-on-stop-request") {
          return;
        }

        let channel = subject.QueryInterface(Ci.nsIHttpChannel);
        if (!channel || channel.URI.spec !== url) {
          return;
        }

        is(channel.status, expectedStatus, message);
        Services.obs.removeObserver(observer, "http-on-stop-request");
        resolve();
      },
    };
    Services.obs.addObserver(observer, "http-on-stop-request");
  });
}

const testCases = [
  {
    type: "fetch",
    allowStatus: Cr.NS_OK,
    denyStatus: Cr.NS_ERROR_LOCAL_NETWORK_ACCESS_DENIED,
  },
  {
    type: "xhr",
    allowStatus: Cr.NS_OK,
    denyStatus: Cr.NS_ERROR_LOCAL_NETWORK_ACCESS_DENIED,
  },
  {
    type: "img",
    allowStatus: Cr.NS_OK,
    denyStatus: Cr.NS_ERROR_LOCAL_NETWORK_ACCESS_DENIED,
  },
  {
    type: "video",
    allowStatus: Cr.NS_OK,
    denyStatus: Cr.NS_ERROR_LOCAL_NETWORK_ACCESS_DENIED,
  },
  {
    type: "audio",
    allowStatus: Cr.NS_OK,
    denyStatus: Cr.NS_ERROR_LOCAL_NETWORK_ACCESS_DENIED,
  },
  {
    type: "iframe",
    allowStatus: Cr.NS_OK,
    denyStatus: Cr.NS_ERROR_LOCAL_NETWORK_ACCESS_DENIED,
  },
  {
    type: "script",
    allowStatus: Cr.NS_OK,
    denyStatus: Cr.NS_ERROR_LOCAL_NETWORK_ACCESS_DENIED,
  },
  {
    type: "font",
    allowStatus: Cr.NS_OK,
    denyStatus: Cr.NS_ERROR_LOCAL_NETWORK_ACCESS_DENIED,
  },
  {
    type: "websocket",
    allowStatus: Cr.NS_ERROR_WEBSOCKET_CONNECTION_REFUSED,
    denyStatus: Cr.NS_ERROR_LOCAL_NETWORK_ACCESS_DENIED,
  },
];

function registerServerHandlers(server) {
  server.registerPathHandler("/", (request, response) => {
    const params = new URLSearchParams(request.queryString);
    const type = params.get("type");

    response.setHeader("Access-Control-Allow-Origin", "*", false);

    switch (type) {
      case "img":
        response.setHeader("Content-Type", "image/gif", false);
        response.setStatusLine(request.httpVersion, 200, "OK");
        response.write(
          atob("R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==")
        );
        break;
      case "audio":
        response.setHeader("Content-Type", "audio/wav", false);
        response.setStatusLine(request.httpVersion, 200, "OK");
        response.write(
          atob("UklGRhYAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA=")
        );
        break;
      case "video":
        response.setHeader("Content-Type", "video/mp4", false);
        response.setStatusLine(request.httpVersion, 200, "OK");
        response.write(
          atob(
            "GkXfo0AgQoaBAUL3gQFC8oEEQvOBCEKCQAR3ZWJtQoeBAkKFgQIYU4BnQI0VSalmQCgq17FAAw9CQE2AQAZ3aGFtbXlXQUAGd2hhbW15RIlACECPQAAAAAAAFlSua0AxrkAu14EBY8WBAZyBACK1nEADdW5khkAFVl9WUDglhohAA1ZQOIOBAeBABrCBCLqBCB9DtnVAIueBAKNAHIEAAIAwAQCdASoIAAgAAUAmJaQAA3AA/vz0AAA="
          )
        );
        break;
      default:
        response.setHeader("Content-Type", "text/plain", false);
        response.setStatusLine(request.httpVersion, 200, "OK");
        response.write("hello");
    }
  });
}

async function runSingleTestCase(
  test,
  rand,
  expectedStatus,
  description,
  userAction = null,
  notificationID = null
) {
  info(description);

  const promise = observeAndCheck(test.type, rand, expectedStatus, description);
  const tab = await BrowserTestUtils.openNewForegroundTab(
    gBrowser,
    `${baseURL}page_with_non_trackers.html?test=${test.type}&rand=${rand}`
  );

  if (userAction && notificationID) {
    const buttonNum =
      userAction === "allow" ? PROMPT_ALLOW_BUTTON : PROMPT_NOT_NOW_BUTTON;

    await BrowserTestUtils.waitForEvent(PopupNotifications.panel, "popupshown");
    clickDoorhangerButton(buttonNum, gBrowser.selectedBrowser, notificationID);
  }

  await promise;
  gBrowser.removeTab(tab);
}

async function runPromptedLnaTest(test, overrideLabel, notificationID) {
  const promptActions = ["allow", "deny"];
  for (const userAction of promptActions) {
    const rand = Math.random();
    const expectedStatus =
      userAction === "allow" ? test.allowStatus : test.denyStatus;

    await runSingleTestCase(
      test,
      rand,
      expectedStatus,
      `LNA test (${overrideLabel}) for ${test.type} with user action: ${userAction}`,
      userAction,
      notificationID
    );

    
    
    
    await new Promise(resolve => setTimeout(resolve, 300));

    
    await runSingleTestCase(
      test,
      rand,
      expectedStatus,
      `LNA test (${overrideLabel}) for ${test.type} with user action: ${userAction}`,
      userAction,
      notificationID
    );
  }
}

add_task(async function test_lna_prompt_behavior() {
  
  for (const test of testCases) {
    const rand = Math.random();
    await runSingleTestCase(
      test,
      rand,
      test.allowStatus,
      `Non-LNA test for ${test.type}`
    );
  }

  
  Services.prefs.setCharPref(
    "network.lna.address_space.public.override",
    "127.0.0.1:4443"
  );
  for (const test of testCases) {
    await runPromptedLnaTest(test, "public", "localhost");
  }

  
  Services.prefs.setCharPref(
    "network.lna.address_space.private.override",
    "127.0.0.1:21555"
  );
  for (const test of testCases) {
    await runPromptedLnaTest(test, "private", "local-network");
  }

  Services.prefs.clearUserPref("network.lna.address_space.public.override");
  Services.prefs.clearUserPref("network.lna.address_space.private.override");
});

add_task(async function test_lna_cancellation_during_prompt() {
  info("Testing LNA cancellation during permission prompt");

  
  await SpecialPowers.pushPrefEnv({
    set: [
      ["network.http.rcwn.enabled", false],
      ["browser.cache.disk.enable", true],
      ["browser.cache.memory.enable", true],
      ["network.lna.address_space.public.override", "127.0.0.1:4443"],
    ],
  });

  const testType = "fetch";
  const rand1 = Math.random();

  
  info(
    "Step 1: Making request that will trigger LNA prompt, then cancelling it"
  );

  
  const tab1 = await BrowserTestUtils.openNewForegroundTab(
    gBrowser,
    `${baseURL}page_with_non_trackers.html?test=${testType}&rand=${rand1}`
  );

  
  await BrowserTestUtils.waitForEvent(PopupNotifications.panel, "popupshown");
  info("LNA permission prompt appeared");
  gBrowser.removeTab(tab1);
  
  const tab2 = await BrowserTestUtils.openNewForegroundTab(
    gBrowser,
    `${baseURL}page_with_non_trackers.html?test=${testType}&rand=${rand1}`
  );
  info("Navigated to new URL, request should be cancelled");

  
  await BrowserTestUtils.waitForEvent(PopupNotifications.panel, "popupshown");
  clickDoorhangerButton(
    PROMPT_ALLOW_BUTTON,
    gBrowser.selectedBrowser,
    "localhost"
  );

  
  gBrowser.removeTab(tab2);

  
  
  
  info(
    "Test completed successfully - cancellation during LNA prompt handled correctly"
  );

  await SpecialPowers.popPrefEnv();
});

add_task(async function test_lna_top_level_navigation_bypass() {
  info("Testing that top-level navigation to localhost bypasses LNA checks");

  
  await SpecialPowers.pushPrefEnv({
    set: [
      ["network.lna.address_space.public.override", "127.0.0.1:4443"],
      ["network.lna.allow_top_level_navigation", true],
    ],
  });

  requestLongerTimeout(1);

  
  const navigationObserver = {
    observe(subject, topic) {
      if (topic !== "http-on-stop-request") {
        return;
      }

      let channel = subject.QueryInterface(Ci.nsIHttpChannel);
      if (!channel || !channel.URI.spec.includes("localhost:21555")) {
        return;
      }

      
      
      is(
        channel.status,
        Cr.NS_OK,
        "Top-level navigation to localhost should not be blocked by LNA"
      );

      Services.obs.removeObserver(navigationObserver, "http-on-stop-request");
    },
  };

  Services.obs.addObserver(navigationObserver, "http-on-stop-request");

  try {
    
    info("Loading test page that will trigger navigation to localhost");

    
    const tab = await BrowserTestUtils.openNewForegroundTab(
      gBrowser,
      `${baseURL}page_with_non_trackers.html?isTopLevelNavigation=true`
    );

    
    info("Waiting for navigation to localhost to complete");
    await BrowserTestUtils.browserLoaded(tab.linkedBrowser, false, url =>
      url.includes("localhost:21555")
    );

    
    
    let popup = PopupNotifications.getNotification(
      "localhost",
      tab.linkedBrowser
    );
    ok(
      !popup,
      "No LNA permission prompt should appear for top-level navigation"
    );

    
    let location = await SpecialPowers.spawn(tab.linkedBrowser, [], () => {
      return content.location.href;
    });

    ok(
      location.includes("localhost:21555"),
      "Top-level navigation to localhost should succeed"
    );

    gBrowser.removeTab(tab);

    info("Top-level navigation test completed successfully");
  } catch (error) {
    ok(false, `Top-level navigation test failed: ${error.message}`);
  }

  await SpecialPowers.popPrefEnv();
});

add_task(async function test_lna_top_level_navigation_disabled() {
  info("Testing that top-level navigation LNA bypass can be disabled via pref");

  
  await SpecialPowers.pushPrefEnv({
    set: [
      ["network.lna.address_space.public.override", "127.0.0.1:4443"],
      ["network.lna.allow_top_level_navigation", false],
    ],
  });

  requestLongerTimeout(1);

  try {
    
    info("Loading test page that will try to navigate to localhost");
    const tab = await BrowserTestUtils.openNewForegroundTab(
      gBrowser,
      `${baseURL}page_with_non_trackers.html?isTopLevelNavigation=true`
    );

    
    info("Waiting for LNA permission prompt to appear");
    await BrowserTestUtils.waitForEvent(PopupNotifications.panel, "popupshown");

    
    let popup = PopupNotifications.getNotification(
      "localhost",
      tab.linkedBrowser
    );
    ok(popup, "LNA permission prompt should appear when bypass is disabled");

    
    clickDoorhangerButton(
      PROMPT_ALLOW_BUTTON,
      gBrowser.selectedBrowser,
      "localhost"
    );

    
    await BrowserTestUtils.browserLoaded(tab.linkedBrowser, false, url =>
      url.includes("localhost:21555")
    );

    gBrowser.removeTab(tab);

    info("Top-level navigation disabled test completed successfully");
  } catch (error) {
    ok(false, `Top-level navigation disabled test failed: ${error.message}`);
  }

  await SpecialPowers.popPrefEnv();
});

add_task(async function test_lna_websocket_preference() {
  info("Testing network.lna.websocket.enabled preference");

  
  await SpecialPowers.pushPrefEnv({
    set: [
      ["network.lna.address_space.public.override", "127.0.0.1:4443"],
      ["network.lna.blocking", true],
      ["network.lna.websocket.enabled", false], 
    ],
  });

  try {
    
    const websocketTest = {
      type: "websocket",
      allowStatus: Cr.NS_ERROR_WEBSOCKET_CONNECTION_REFUSED,
      denyStatus: Cr.NS_ERROR_LOCAL_NETWORK_ACCESS_DENIED,
    };

    const rand = Math.random();
    const promise = observeAndCheck(
      websocketTest.type,
      rand,
      websocketTest.allowStatus, 
      "WebSocket test with LNA disabled should bypass LNA checks"
    );

    const tab = await BrowserTestUtils.openNewForegroundTab(
      gBrowser,
      `${baseURL}page_with_non_trackers.html?test=${websocketTest.type}&rand=${rand}`
    );

    await promise;
    gBrowser.removeTab(tab);

    info(
      "WebSocket LNA disabled test completed - connection was allowed to proceed"
    );

    
    await SpecialPowers.pushPrefEnv({
      set: [
        ["network.lna.websocket.enabled", true], 
        ["network.localhost.prompt.testing", true],
        ["network.localhost.prompt.testing.allow", false],
      ],
    });

    const rand2 = Math.random();
    const promise2 = observeAndCheck(
      websocketTest.type,
      rand2,
      websocketTest.denyStatus, 
      "WebSocket test with LNA enabled should trigger LNA checks"
    );

    const tab2 = await BrowserTestUtils.openNewForegroundTab(
      gBrowser,
      `${baseURL}page_with_non_trackers.html?test=${websocketTest.type}&rand=${rand2}`
    );

    await promise2;
    gBrowser.removeTab(tab2);

    info("WebSocket LNA enabled test completed - LNA checks were applied");
  } catch (error) {
    ok(false, `WebSocket LNA preference test failed: ${error.message}`);
  }

  await SpecialPowers.popPrefEnv();
});
