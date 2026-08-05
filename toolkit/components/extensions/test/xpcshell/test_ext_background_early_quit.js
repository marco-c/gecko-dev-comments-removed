"use strict";

const { Management } = ChromeUtils.importESModule(
  "resource://gre/modules/Extension.sys.mjs"
);











add_task(async function test_quit_while_background_starts() {
  let extension = ExtensionTestUtils.loadExtension({
    
    
    delayedStartup: false,
    background() {
      browser.test.fail(
        "Unexpected background page execution. eForceQuit should have aborted all document loads"
      );
    },
  });

  info("Waiting for extension to start up");
  let browserCount = 0;
  
  
  Management.once("extension-browser-inserted", (eventName, browser) => {
    ++browserCount;
    equal(
      browser.getAttribute("webextension-view-type"),
      "background",
      "Got background browser"
    );
    
    
    
    
    
    
    
    
    
    
    Services.startup.enterLastWindowClosingSurvivalArea();
    Services.startup.quit(Ci.nsIAppStartup.eForceQuit);
  });
  const { messages } = await promiseConsoleOutput(async () => {
    await extension.startup();
  });
  equal(browserCount, 1, "Seen background browser");

  equal(extension.extension.backgroundState, "stopped", "backgroundState");

  
  
  
  equal(
    messages.filter(m =>
      m.message.includes("Cannot create hidden browser past shutdown")
    ).length,
    0,
    "No message from HiddenXULWindow when quit happens after createBrowserElement()"
  );

  await extension.unload();
});
