



"use strict";

const { IPPStartupCacheSingleton } = ChromeUtils.importESModule(
  "resource:///modules/ipprotection/IPPStartupCache.sys.mjs"
);

const { IPProtectionStates } = ChromeUtils.importESModule(
  "resource:///modules/ipprotection/IPProtectionService.sys.mjs"
);




add_task(async function test_IPPStartupCache_disabled() {
  
  Services.prefs.setBoolPref("browser.ipProtection.cacheDisabled", true);
  const cache = new IPPStartupCacheSingleton();
  cache.init();

  Assert.ok(
    cache.isStartupCompleted,
    "In XPCShell mode the cache is not active"
  );
});




add_task(async function test_IPPStartupCache_enabled() {
  
  Services.prefs.setBoolPref("browser.ipProtection.cacheDisabled", false);

  
  {
    const cache = new IPPStartupCacheSingleton();
    cache.init();

    Assert.ok(
      !cache.isStartupCompleted,
      "In XPCShell mode the cache is active"
    );
    Assert.equal(
      cache.state,
      IPProtectionStates.UNINITIALIZED,
      "The state is unitialized"
    );
  }

  
  {
    Services.prefs.setCharPref(
      "browser.ipProtection.stateCache",
      IPProtectionStates.READY
    );

    const cache = new IPPStartupCacheSingleton();
    cache.init();

    Assert.ok(
      !cache.isStartupCompleted,
      "In XPCShell mode the cache is active"
    );
    Assert.equal(cache.state, IPProtectionStates.READY, "The state is READY");
  }

  
  {
    Services.prefs.setCharPref(
      "browser.ipProtection.stateCache",
      "Hello World!"
    );

    const cache = new IPPStartupCacheSingleton();
    cache.init();

    Assert.ok(
      !cache.isStartupCompleted,
      "In XPCShell mode the cache is active"
    );
    Assert.equal(
      cache.state,
      IPProtectionStates.UNINITIALIZED,
      "The state is unitialized"
    );
  }

  
  {
    Services.prefs.setCharPref(
      "browser.ipProtection.stateCache",
      IPProtectionStates.ACTIVE
    );

    const cache = new IPPStartupCacheSingleton();
    cache.init();

    Assert.ok(
      !cache.isStartupCompleted,
      "In XPCShell mode the cache is active"
    );
    Assert.equal(cache.state, IPProtectionStates.READY, "The state is READY");
  }
});




add_task(async function test_IPPStartupCache_enabled() {
  
  Services.prefs.setBoolPref("browser.ipProtection.cacheDisabled", false);

  
  {
    const cache = new IPPStartupCacheSingleton();
    cache.init();

    Assert.ok(
      !cache.isStartupCompleted,
      "In XPCShell mode the cache is active"
    );
    Assert.equal(cache.entitlement, null, "Null entitlement");
  }

  
  {
    Services.prefs.setCharPref(
      "browser.ipProtection.entitlementCache",
      '{"a": 42}'
    );

    const cache = new IPPStartupCacheSingleton();
    cache.init();

    Assert.ok(
      !cache.isStartupCompleted,
      "In XPCShell mode the cache is active"
    );
    Assert.deepEqual(
      cache.entitlement,
      { a: 42 },
      "A valid entitlement object"
    );
  }

  
  {
    Services.prefs.setCharPref(
      "browser.ipProtection.entitlementCache",
      '{"a": 42}}}}'
    );

    const cache = new IPPStartupCacheSingleton();
    cache.init();

    Assert.ok(
      !cache.isStartupCompleted,
      "In XPCShell mode the cache is active"
    );
    Assert.equal(cache.entitlement, null, "Null entitlement");
  }

  
  {
    const cache = new IPPStartupCacheSingleton();
    cache.init();

    Assert.ok(
      !cache.isStartupCompleted,
      "In XPCShell mode the cache is active"
    );
    Assert.equal(cache.entitlement, null, "Null entitlement");

    cache.storeEntitlement(42);
    Assert.equal(
      Services.prefs.getCharPref("browser.ipProtection.entitlementCache", ""),
      "42",
      "The cache is correctly stored (number)"
    );

    cache.storeEntitlement(null);
    Assert.equal(
      Services.prefs.getCharPref("browser.ipProtection.entitlementCache", ""),
      "null",
      "The cache is correctly stored (null)"
    );

    cache.storeEntitlement({ a: 42 });
    Assert.equal(
      Services.prefs.getCharPref("browser.ipProtection.entitlementCache", ""),
      '{"a":42}',
      "The cache is correctly stored (obj)"
    );
  }
});
