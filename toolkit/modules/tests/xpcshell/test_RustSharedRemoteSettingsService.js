



ChromeUtils.defineESModuleGetters(this, {
  Region: "resource://gre/modules/Region.sys.mjs",
  SharedRemoteSettingsService:
    "resource://gre/modules/RustSharedRemoteSettingsService.sys.mjs",
  Utils: "resource://services-settings/Utils.sys.mjs",
});



add_task(async function regionOrLocaleChanged() {
  let tests = [
    { country: "US", locale: "en-US" },
    { country: "US", locale: "es-MX" },
    { country: "DE", locale: "de" },
    { country: "DE", locale: "en-US" },
  ];

  for (let { country, locale } of tests) {
    await withRegionAndLocale({
      locale,
      region: country,
      callback: async () => {
        await waitForServiceCountryAndLocale({ country, locale });
        Assert.equal(
          SharedRemoteSettingsService.country,
          country,
          "SharedRemoteSettingsService.country should be the expected country"
        );
        Assert.equal(
          SharedRemoteSettingsService.locale,
          locale,
          "SharedRemoteSettingsService.locale should be the expected locale"
        );
      },
    });
  }
});




add_task(async function serverUrl() {
  let countriesAndLocales = [
    { newLocale: "de" },
    { newCountry: "DE" },
    { newCountry: "DE", newLocale: "de" },
  ];
  let serverUrls = [
    undefined,
    Utils.SERVER_URL,
    "https://example.com/test-shared-rs-service-1",
    "https://example.com/test-shared-rs-service-2",
  ];
  for (let { newCountry, newLocale } of countriesAndLocales) {
    for (let url of serverUrls) {
      await doServerUrlTest({ newCountry, newLocale, url });
    }
  }
});

async function doServerUrlTest({
  url,
  newCountry = "US",
  newLocale = "en-US",
}) {
  
  await withRegionAndLocale({
    region: "US",
    locale: "en-US",
    callback: async () => {
      await waitForServiceCountryAndLocale({ country: "US", locale: "en-US" });

      
      SharedRemoteSettingsService.updateServer({ url });

      
      await withRegionAndLocale({
        region: newCountry,
        locale: newLocale,
        callback: async () => {
          await waitForServiceCountryAndLocale({
            country: newCountry,
            locale: newLocale,
          });

          
          if (!url || url == Utils.SERVER_URL) {
            
            
            
            Assert.ok(
              !SharedRemoteSettingsService.server,
              "SharedRemoteSettingsService.server should be undefined"
            );
          } else {
            Assert.ok(
              SharedRemoteSettingsService.server,
              "SharedRemoteSettingsService.server should be defined"
            );
            Assert.equal(
              SharedRemoteSettingsService.server.url,
              url,
              "SharedRemoteSettingsService.server.url should be as expected"
            );
          }
        },
      });
    },
  });
}












async function withRegionAndLocale({ region, locale, callback }) {
  let originalRegion = Region.home;

  info("Setting region: " + region);
  Region._setHomeRegion(region, true);

  Assert.equal(Region.home, region, "Region should now be the desired region");

  let { availableLocales, requestedLocales } = Services.locale;
  let localePromise = waitForLocaleChange(locale);

  info("Setting locale: " + locale);
  Services.locale.availableLocales = [locale];
  Services.locale.requestedLocales = [locale];

  info("Waiting for locale change");
  await localePromise;
  info("Done waiting for locale change");

  Assert.equal(
    Services.locale.appLocaleAsBCP47,
    locale,
    "App locale should now be the desired locale"
  );

  info("Calling callback");
  await callback();
  info("Done calling callback");

  
  info("Resetting region to orginal: " + originalRegion);
  Region._setHomeRegion(originalRegion, true);

  Assert.equal(
    Region.home,
    originalRegion,
    "Region should now be the original region"
  );

  let restoreLocalePromise = waitForLocaleChange(requestedLocales[0]);
  Services.locale.availableLocales = availableLocales;
  Services.locale.requestedLocales = requestedLocales;

  info("Waiting for original locale to be restored");
  await restoreLocalePromise;
  info("Done waiting for original locale to be restored");

  Assert.equal(
    Services.locale.appLocaleAsBCP47,
    requestedLocales[0],
    "App locale should now be the original locale"
  );
}







async function waitForLocaleChange(locale) {
  
  if (locale == Services.locale.requestedLocales[0]) {
    info("Locale is already set");
  } else {
    info("Waiting for intl:app-locales-changed");
    await TestUtils.topicObserved("intl:app-locales-changed");
    info("Got intl:app-locales-changed");
  }
}










async function waitForServiceCountryAndLocale({ country, locale }) {
  await TestUtils.waitForCondition(
    () =>
      SharedRemoteSettingsService.country == country &&
      SharedRemoteSettingsService.locale == locale,
    "Waiting for SharedRemoteSettingsService country and locale to be set: " +
      JSON.stringify({ country, locale })
  );
}
