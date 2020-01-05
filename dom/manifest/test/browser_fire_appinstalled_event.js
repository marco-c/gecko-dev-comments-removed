

"use strict";
const { PromiseMessage } = Cu.import("resource://gre/modules/PromiseMessage.jsm", {});
const testPath = "/browser/dom/manifest/test/file_reg_appinstalled_event.html";
const defaultURL = new URL("http://example.org/browser/dom/manifest/test/file_testserver.sjs");
const testURL = new URL(defaultURL);
testURL.searchParams.append("file", testPath);


function enableOnAppInstalledPref() {
  const ops = {
    "set": [
      ["dom.manifest.onappinstalled", true],
    ],
  };
  return SpecialPowers.pushPrefEnv(ops);
}



function* theTest(aBrowser) {
  aBrowser.allowEvents = true;
  let waitForInstall = ContentTask.spawn(aBrowser, null, function*() {
    yield ContentTaskUtils.waitForEvent(content.window, "appinstalled");
  });
  const { data: { success } } = yield PromiseMessage
    .send(aBrowser.messageManager, "DOM:Manifest:FireAppInstalledEvent");
  ok(success, "message sent and received successfully.");
  try {
    yield waitForInstall;
    ok(true, "AppInstalled event fired");
  } catch (err) {
    ok(false, "AppInstalled event didn't fire: " + err.message);
  }
}


add_task(function*() {
  yield enableOnAppInstalledPref();
  let tabOptions = {
    gBrowser: gBrowser,
    url: testURL.href,
  };
  yield BrowserTestUtils.withNewTab(
    tabOptions,
    theTest
  );
});
