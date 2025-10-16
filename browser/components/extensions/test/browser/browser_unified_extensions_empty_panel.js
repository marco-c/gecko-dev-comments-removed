


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

function getEmptyStateContainer(win) {
  let emptyStateBox = win.gUnifiedExtensions.panel.querySelector(
    "#unified-extensions-empty-state"
  );
  ok(emptyStateBox, "Got container for empty panel state");
  return emptyStateBox;
}

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

add_task(async function test_button_click_in_pbm_without_any_extensions() {
  const win = await BrowserTestUtils.openNewBrowserWindow({ private: true });

  
  
  const tabLoadedPromise = BrowserTestUtils.browserStopped(
    win.gBrowser.selectedBrowser,
    "about:addons"
  );

  win.gUnifiedExtensions.button.click();

  await tabLoadedPromise;
  is(
    win.gBrowser.currentURI.spec,
    "about:addons",
    "expected about:addons to be open"
  );

  
  await BrowserTestUtils.closeWindow(win);
});










add_task(async function test_button_click_in_pbm_without_private_extensions() {
  const extensions = createExtensions([{ name: "Without private access" }]);
  await Promise.all(extensions.map(extension => extension.startup()));

  const win = await BrowserTestUtils.openNewBrowserWindow({ private: true });

  
  await openExtensionsPanel(win);

  let emptyStateBox = getEmptyStateContainer(win);
  ok(BrowserTestUtils.isVisible(emptyStateBox), "Empty state is visible");
  is(
    emptyStateBox.querySelector("h2").getAttribute("data-l10n-id"),
    "unified-extensions-empty-reason-private-browsing-not-allowed",
    "Has header 'You have extensions installed, but not enabled in private windows'"
  );
  is(
    emptyStateBox.querySelector("description").getAttribute("data-l10n-id"),
    "unified-extensions-empty-content-explain-enable",
    "Has description pointing to Manage extensions button."
  );

  await BrowserTestUtils.closeWindow(win);

  await Promise.all(extensions.map(extension => extension.unload()));
});




add_task(async function test_empty_state_is_hidden_when_panel_is_non_empty() {
  const extensions = [
    ...createExtensions([{ name: "Without private access" }]),
    ...createExtensions(
      [
        {
          name: "Ext with private browsing access",
          browser_specific_settings: { gecko: { id: "@ext-with-pbm-access" } },
        },
      ],
      { incognitoOverride: "spanning" }
    ),
  ];
  await Promise.all(extensions.map(extension => extension.startup()));

  const win = await BrowserTestUtils.openNewBrowserWindow({ private: true });

  
  await openExtensionsPanel(win);

  let emptyStateBox = getEmptyStateContainer(win);
  ok(BrowserTestUtils.isHidden(emptyStateBox), "Empty state is hidden");

  
  
  ok(
    getUnifiedExtensionsItem(extensions[1].id, win),
    "Found extension with access to PBM in panel in private window"
  );

  await BrowserTestUtils.closeWindow(win);

  await Promise.all(extensions.map(extension => extension.unload()));
});



add_task(async function test_button_click_in_pbm_pinned_and_no_access() {
  const extensions = [
    ...createExtensions([{ name: "Without private access" }]),
    ...createExtensions(
      [
        {
          name: "Pinned ext with private browsing access",
          browser_action: {
            default_area: "navbar", 
          },
          browser_specific_settings: { gecko: { id: "@pin-with-pbm-access" } },
        },
      ],
      { incognitoOverride: "spanning" }
    ),
  ];
  await Promise.all(extensions.map(extension => extension.startup()));
  const win = await BrowserTestUtils.openNewBrowserWindow({ private: true });

  
  await openExtensionsPanel(win);

  let emptyStateBox = getEmptyStateContainer(win);
  ok(BrowserTestUtils.isVisible(emptyStateBox), "Empty state is visible");
  is(
    emptyStateBox.querySelector("h2").getAttribute("data-l10n-id"),
    "unified-extensions-empty-reason-private-browsing-not-allowed",
    "Has header 'You have extensions installed, but not enabled in private windows'"
  );
  is(
    emptyStateBox.querySelector("description").getAttribute("data-l10n-id"),
    "unified-extensions-empty-content-explain-enable",
    "Has description pointing to Manage extensions button."
  );

  await BrowserTestUtils.closeWindow(win);

  await Promise.all(extensions.map(extension => extension.unload()));
});
