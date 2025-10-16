


"use strict";

const { sinon } = ChromeUtils.importESModule(
  "resource://testing-common/Sinon.sys.mjs"
);

loadTestSubscript("head_unified_extensions.js");

add_setup(async function () {
  
  
  
  await ensureMaximizedWindow(window);

  const sandbox = sinon.createSandbox();
  registerCleanupFunction(() => sandbox.restore());

  
  
  
  
  
  function fakeHideExtension(extensionId) {
    const { extension } = WebExtensionPolicy.getByID(extensionId);
    
    
    sandbox.stub(extension, "isHidden").get(() => true);
  }
  fakeHideExtension("mochikit@mozilla.org");
  fakeHideExtension("special-powers@mozilla.org");
});

add_task(async function test_button_opens_discopane_when_no_extension() {
  await BrowserTestUtils.withNewTab(
    { gBrowser, url: "about:robots" },
    async () => {
      const { button } = gUnifiedExtensions;
      ok(button, "expected button");

      
      const tabPromise = BrowserTestUtils.waitForNewTab(
        gBrowser,
        "about:addons",
        true
      );

      button.click();

      const tab = await tabPromise;
      is(
        gBrowser.currentURI.spec,
        "about:addons",
        "expected about:addons to be open"
      );
      is(
        gBrowser.selectedBrowser.contentWindow.gViewController.currentViewId,
        "addons://discover/",
        "expected about:addons to show the recommendations"
      );
      BrowserTestUtils.removeTab(tab);

      
      const contextMenu = document.getElementById("toolbar-context-menu");
      const popupShownPromise = BrowserTestUtils.waitForEvent(
        contextMenu,
        "popupshown"
      );
      EventUtils.synthesizeMouseAtCenter(button, {
        type: "contextmenu",
        button: 2,
      });
      await popupShownPromise;
      await closeChromeContextMenu(contextMenu.id, null);
    }
  );
});

add_task(
  async function test_button_opens_extlist_when_no_extension_and_pane_disabled() {
    
    

    await SpecialPowers.pushPrefEnv({
      set: [
        
        ["extensions.ui.lastCategory", "addons://list/theme"],
        ["extensions.getAddons.showPane", false],
      ],
    });

    await BrowserTestUtils.withNewTab(
      { gBrowser, url: "about:robots" },
      async () => {
        const { button } = gUnifiedExtensions;
        ok(button, "expected button");

        
        const tabPromise = BrowserTestUtils.waitForNewTab(
          gBrowser,
          "about:addons",
          true
        );

        button.click();

        const tab = await tabPromise;
        is(
          gBrowser.currentURI.spec,
          "about:addons",
          "expected about:addons to be open"
        );
        is(
          gBrowser.selectedBrowser.contentWindow.gViewController.currentViewId,
          "addons://list/extension",
          "expected about:addons to show the extension list"
        );
        BrowserTestUtils.removeTab(tab);
      }
    );

    await SpecialPowers.popPrefEnv();
  }
);
