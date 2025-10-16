


"use strict";

ChromeUtils.defineESModuleGetters(this, {
  ExtensionStorageIDB: "resource://gre/modules/ExtensionStorageIDB.sys.mjs",
  ExtensionStorageLocalIDB:
    "resource://gre/modules/ExtensionStorageIDB.sys.mjs",
  Sqlite: "resource://gre/modules/Sqlite.sys.mjs",
  sinon: "resource://testing-common/Sinon.sys.mjs",
});

AddonTestUtils.init(this);
AddonTestUtils.overrideCertDB();
AddonTestUtils.createAppInfo("xpcshell@tests.mozilla.org", "XPCShell", "1");


const WEBEXT_STORAGE_USER_CONTEXT_ID = -1 >>> 0;

add_setup(async () => {
  Services.fog.testResetFOG();
  await AddonTestUtils.promiseStartupManager();
});

add_task(async function test_idb_autoreset_default() {
  
  
  Assert.equal(
    ExtensionStorageLocalIDB.disabledAutoResetOnCorrupted,
    true,
    "Expect auto-reset on corrupted IDB storage to be disabled by default"
  );
});



add_task(async function test_idb_reset_on_missing_object_store() {
  const id = "test-corrupted-idb@test-ext";

  
  
  
  
  
  let extension = ExtensionTestUtils.loadExtension({
    useAddonManager: "permanent",
    manifest: {
      browser_specific_settings: {
        gecko: { id },
      },
    },
  });

  await extension.startup();

  const { uuid } = extension;
  const storagePrincipal = ExtensionStorageIDB.getStoragePrincipal(
    extension.extension
  );

  
  
  let idbConn = await ExtensionStorageIDB.open(storagePrincipal);
  await idbConn.close();

  const baseDataPath = PathUtils.join(
    PathUtils.profileDir,
    "storage",
    "default",
    `moz-extension+++${uuid}^userContextId=${WEBEXT_STORAGE_USER_CONTEXT_ID}`,
    "idb"
  );

  let sqliteFilePath = (await IOUtils.getChildren(baseDataPath)).find(
    filePath => filePath.endsWith(".sqlite")
  );
  info(
    `Mock corrupted IndexedDB by tampering sqlite3 file at ${sqliteFilePath}`
  );
  let db = await Sqlite.openConnection({ path: sqliteFilePath });
  let rows = await db.execute("SELECT * FROM object_store;");
  
  Assert.equal(
    rows[0]?.getResultByName("name"),
    "storage-local-data",
    "Expected object_store entry found in the IndexedDB Sqlite3 data"
  );
  info(
    "Force delete the storage-local-data object_store from the sqlite3 data"
  );
  await db.execute("DELETE FROM object_store;");
  rows = await db.execute("SELECT * FROM object_store;");
  
  Assert.deepEqual(
    rows,
    [],
    "Force deleted object_store should not be found in the IndexedDB sqlite3 data"
  );
  await db.close();

  info(
    "Verify NotFoundError expected to be raised on corrupted IndexedDB sqlite3 data"
  );
  
  Services.prefs.setBoolPref(
    "extensions.webextensions.keepStorageOnCorrupted.storageLocal",
    true
  );

  idbConn = await ExtensionStorageIDB.open(storagePrincipal);
  await Assert.rejects(
    idbConn.isEmpty(),
    err => {
      return (
        err.name === "NotFoundError" &&
        err.message.includes(
          "'storage-local-data' is not a known object store name"
        )
      );
    },
    "ExtensionStorageIDB isEmpty call throws the expected NotFoundError"
  );
  await idbConn.close();

  info(
    "Verify storageLocalCorruptedReset collected also when corrupted db are not automatically dropped"
  );
  const gleanEventsWithoutResetDB =
    Glean.extensionsData.storageLocalCorruptedReset
      .testGetValue()
      ?.map(event => event.extra);
  Assert.deepEqual(
    gleanEventsWithoutResetDB ?? [],
    [
      {
        addon_id: extension.id,
        reason: "ObjectStoreNotFound",
        after_reset: "false",
        reset_disabled: "true",
      },
    ],
    "Got the expected telemetry event recorded when the NotFoundError is being hit"
  );
  Services.fog.testResetFOG();

  
  Services.prefs.setBoolPref(
    "extensions.webextensions.keepStorageOnCorrupted.storageLocal",
    false
  );

  info("Verify corrupted IndexedDB sqlite3 Glean telemetry when reset fails");
  const sandbox = sinon.createSandbox();
  sandbox
    .stub(ExtensionStorageLocalIDB, "resetForPrincipal")
    .callsFake(() =>
      Promise.reject(
        new DOMException("error message", "MockResetFailureErrorName")
      )
    );
  await Assert.rejects(
    ExtensionStorageIDB.open(storagePrincipal),
    err => {
      return (
        err.name === "ExtensionError" &&
        err.message.includes("Corrupted storage.local backend")
      );
    },
    "ExtensionStorageIDB open to throws the expected ExtensionError"
  );
  sandbox.restore();
  const gleanEventsOnResetFailure =
    Glean.extensionsData.storageLocalCorruptedReset
      .testGetValue()
      ?.map(event => event.extra);
  Assert.deepEqual(
    gleanEventsOnResetFailure ?? [],
    [
      {
        addon_id: extension.id,
        reason: "ObjectStoreNotFound",
        after_reset: "false",
        reset_disabled: "false",
      },
      {
        addon_id: extension.id,
        reason: "ObjectStoreNotFound",
        after_reset: "true",
        reset_disabled: "false",
        reset_error_name: "MockResetFailureErrorName",
      },
    ],
    "Got the expected telemetry event recorded when the NotFoundError is being hit"
  );
  Services.fog.testResetFOG();

  info(
    "Verify corrupted IndexedDB sqlite3 data dropped and recreated by default when reset succeeded"
  );
  idbConn = await ExtensionStorageIDB.open(storagePrincipal);
  Assert.equal(
    await idbConn.isEmpty(),
    true,
    "ExtensionStorageIDB isEmpty call resolved as expected"
  );
  await idbConn.close();

  const gleanEvents = Glean.extensionsData.storageLocalCorruptedReset
    .testGetValue()
    ?.map(event => event.extra);
  Assert.deepEqual(
    gleanEvents ?? [],
    [
      {
        addon_id: extension.id,
        reason: "ObjectStoreNotFound",
        after_reset: "false",
        reset_disabled: "false",
      },
    ],
    "Got the expected telemetry event recorded when the NotFoundError is being hit"
  );

  await extension.unload();
});
