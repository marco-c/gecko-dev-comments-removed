

"use strict";

Services.prefs.setBoolPref("webextensions.storage.sync.kinto", false);

AddonTestUtils.init(this);

add_task(async function setup() {
  await ExtensionTestUtils.startAddonManager();
});

add_task(test_config_flag_needed);

add_task(test_sync_reloading_extensions_works);

add_task(function test_storage_sync() {
  return runWithPrefs([[STORAGE_SYNC_PREF, true]], () =>
    test_background_page_storage("sync")
  );
});

add_task(test_storage_sync_requires_real_id);
