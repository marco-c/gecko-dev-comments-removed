


"use strict";

const { AddonTestUtils } = ChromeUtils.importESModule(
  "resource://testing-common/AddonTestUtils.sys.mjs"
);
AddonTestUtils.initMochitest(this);

const { sinon } = ChromeUtils.importESModule(
  "resource://testing-common/Sinon.sys.mjs"
);

loadTestSubscript("head_unified_extensions.js");



async function promiseInstallWebExtension(extensionData) {
  let addonFile = AddonTestUtils.createTempWebExtensionFile(extensionData);
  let { addon } = await AddonTestUtils.promiseInstallFile(addonFile);
  return addon;
}

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

function assertIsEmptyPanelOnboardingExtensions(win) {
  const emptyStateBox = getEmptyStateContainer(win);
  ok(BrowserTestUtils.isVisible(emptyStateBox), "Empty state is visible");
  is(
    emptyStateBox.querySelector("h2").getAttribute("data-l10n-id"),
    "unified-extensions-empty-reason-zero-extensions-onboarding",
    "Has header when the user does not have any extensions installed"
  );
  is(
    emptyStateBox.querySelector("description").getAttribute("data-l10n-id"),
    "unified-extensions-empty-content-explain-extensions-onboarding",
    "Has description explaining extensions"
  );

  const discoverButton = getDiscoverButton(win);
  ok(discoverButton, "Got 'Discover button'");
  is(
    discoverButton.getAttribute("data-l10n-id"),
    "unified-extensions-discover-extensions",
    "Button in extensions panel should be labeled 'Discover Extensions'"
  );
  is(
    discoverButton.getAttribute("type"),
    "primary",
    "Discover button should be styled as a primary call-to-action button"
  );
  const manageExtensionsButton = getListView(win).querySelector(
    "#unified-extensions-manage-extensions"
  );
  ok(
    BrowserTestUtils.isHidden(manageExtensionsButton),
    "'Manage Extensions' button should be hidden"
  );
}
function getDiscoverButton(win) {
  return win.gUnifiedExtensions.panel.querySelector(
    "#unified-extensions-discover-extensions"
  );
}

add_task(async function test_button_opens_discopane_when_no_extension() {
  await BrowserTestUtils.withNewTab(
    { gBrowser, url: "about:robots" },
    async () => {
      const { button } = gUnifiedExtensions;
      ok(button, "expected button");

      
      await openExtensionsPanel(window);

      assertIsEmptyPanelOnboardingExtensions(window);
      const discoverButton = getDiscoverButton(window);

      const tabPromise = BrowserTestUtils.waitForNewTab(
        gBrowser,
        "about:addons",
        true
      );

      discoverButton.click();

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
    }
  );
});

add_task(async function test_button_opens_extlist_when_all_exts_pinned() {
  const extensions = createExtensions([
    {
      name: "Pinned extension button outside extensions panel",
      browser_action: { default_area: "navbar" },
    },
  ]);
  await Promise.all(extensions.map(extension => extension.startup()));

  await SpecialPowers.pushPrefEnv({
    set: [
      
      ["extensions.ui.lastCategory", "addons://list/theme"],
      
      
      ["extensions.getAddons.showPane", true],
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

  await Promise.all(extensions.map(extension => extension.unload()));
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
        
        await openExtensionsPanel(window);

        assertIsEmptyPanelOnboardingExtensions(window);
        const discoverButton = getDiscoverButton(window);

        const tabPromise = BrowserTestUtils.waitForNewTab(
          gBrowser,
          "about:addons",
          true
        );

        discoverButton.click();

        const tab = await tabPromise;
        is(
          gBrowser.currentURI.spec,
          "about:addons",
          "expected about:addons to be open"
        );
        const managerWindow = gBrowser.selectedBrowser.contentWindow;
        is(
          managerWindow.gViewController.currentViewId,
          "addons://list/extension",
          "expected about:addons to show the extension list"
        );
        if (managerWindow.gViewController.isLoading) {
          info("Waiting for about:addons to finish loading");
          await BrowserTestUtils.waitForEvent(
            managerWindow.document,
            "view-loaded"
          );
        }
        const amoLink = managerWindow.document.querySelector(
          `#empty-addons-message a[data-l10n-name="get-extensions"]`
        );
        ok(amoLink, "Found link to get extensions");
        is(
          amoLink.href,
          "https://addons.mozilla.org/en-US/firefox/",
          "Link points to AMO, where the user can discover extensions"
        );
        BrowserTestUtils.removeTab(tab);
      }
    );

    await SpecialPowers.popPrefEnv();
  }
);

add_task(async function test_button_click_in_pbm_without_any_extensions() {
  const win = await BrowserTestUtils.openNewBrowserWindow({ private: true });

  
  await openExtensionsPanel(win);

  assertIsEmptyPanelOnboardingExtensions(win);
  const discoverButton = getDiscoverButton(win);

  
  
  const tabLoadedPromise = BrowserTestUtils.browserStopped(
    win.gBrowser.selectedBrowser,
    "about:addons"
  );

  discoverButton.click();

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

add_task(async function test_empty_state_with_disabled_addon() {
  const [extension] = createExtensions([{ name: "The Only Extension" }]);
  await extension.startup();
  const addon = await AddonManager.getAddonByID(extension.id);
  await addon.disable();

  const win = await BrowserTestUtils.openNewBrowserWindow();

  
  await openExtensionsPanel(win);

  let emptyStateBox = getEmptyStateContainer(win);
  ok(BrowserTestUtils.isVisible(emptyStateBox), "Empty state is visible");
  is(
    emptyStateBox.querySelector("h2").getAttribute("data-l10n-id"),
    "unified-extensions-empty-reason-extension-not-enabled",
    "Has header 'You have extensions installed, but not enabled'"
  );
  is(
    emptyStateBox.querySelector("description").getAttribute("data-l10n-id"),
    "unified-extensions-empty-content-explain-enable",
    "Has description pointing to Manage extensions button."
  );

  await BrowserTestUtils.closeWindow(win);

  await extension.unload();
});




add_task(async function test_no_empty_state_with_disabled_non_extension() {
  const disabledDictAddon = await promiseInstallWebExtension({
    manifest: {
      name: "This is a dictionary (definitely not type 'extension') (disabled)",
      dictionaries: {},
      browser_specific_settings: { gecko: { id: "@dict-disabled" } },
    },
  });
  const dictAddon = await promiseInstallWebExtension({
    manifest: {
      name: "This is a dictionary (definitely not type 'extension') (enabled)",
      dictionaries: {},
      browser_specific_settings: { gecko: { id: "@dict-not-disabled" } },
    },
  });
  await disabledDictAddon.disable();
  is(disabledDictAddon.isActive, false, "One of the dict add-ons was disabled");

  await BrowserTestUtils.withNewTab(
    { gBrowser, url: "about:robots" },
    async () => {
      
      await openExtensionsPanel(window);

      assertIsEmptyPanelOnboardingExtensions(window);
      const discoverButton = getDiscoverButton(window);

      const tabPromise = BrowserTestUtils.waitForNewTab(
        gBrowser,
        "about:addons",
        true
      );

      discoverButton.click();

      const tab = await tabPromise;
      ok(true, "about:addons opened instead of panel about disabled add-ons");
      BrowserTestUtils.removeTab(tab);
    }
  );

  await disabledDictAddon.uninstall();
  await dictAddon.uninstall();
});



add_task(async function test_empty_state_with_blocklisted_addon() {
  const addonId = "@extension-that-is-blocked";
  const addon = await promiseInstallWebExtension({
    manifest: {
      name: "Name of the blocked ext",
      browser_specific_settings: { gecko: { id: addonId } },
    },
  });

  let promiseBlocklistAttentionUpdated = AddonTestUtils.promiseManagerEvent(
    "onBlocklistAttentionUpdated"
  );
  const cleanupBlocklist = await loadBlocklistRawData({ blocked: [addon] });
  info("Wait for onBlocklistAttentionUpdated manager listener call");
  await promiseBlocklistAttentionUpdated;

  
  await openExtensionsPanel(window);

  
  const messages = getMessageBars(window);
  is(messages.length, 1, "Expected a message in the Extensions Panel");
  Assert.deepEqual(
    window.document.l10n.getAttributes(messages[0]),
    {
      id: "unified-extensions-mb-blocklist-error-single",
      args: {
        extensionName: "Name of the blocked ext",
        extensionsCount: 1,
      },
    },
    "Blocklist message appears in the (empty) extension panel"
  );

  let emptyStateBox = getEmptyStateContainer(window);
  ok(BrowserTestUtils.isVisible(emptyStateBox), "Empty state is visible");
  is(
    emptyStateBox.querySelector("h2").getAttribute("data-l10n-id"),
    "unified-extensions-empty-reason-extension-not-enabled",
    "Has header 'You have extensions installed, but not enabled'"
  );
  is(
    emptyStateBox.querySelector("description").getAttribute("data-l10n-id"),
    "unified-extensions-empty-content-explain-enable",
    "Has description pointing to Manage extensions button."
  );

  await closeExtensionsPanel(window);

  await cleanupBlocklist();

  
  

  await openExtensionsPanel(window);
  is(getMessageBars().length, 0, "No blocklist messages after unblocking");
  ok(
    BrowserTestUtils.isHidden(getEmptyStateContainer(window)),
    "Empty state is hidden when extension is unblocked"
  );
  await closeExtensionsPanel(window);

  await addon.uninstall();
});
