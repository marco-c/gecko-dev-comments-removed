







"use strict";

ChromeUtils.defineESModuleGetters(this, {
  Preferences: "resource://gre/modules/Preferences.sys.mjs",
});

const EN_LOCALES = ["en-CA", "en-GB", "en-US", "en-ZA"];


const EXPECTED_PREFS_SUGGEST_DISABLED = {
  "quicksuggest.enabled": false,
  "quicksuggest.dataCollection.enabled": false,
  "quicksuggest.settingsUi": QuickSuggest.SETTINGS_UI.NONE,
  "suggest.quicksuggest.nonsponsored": false,
  "suggest.quicksuggest.sponsored": false,
  "addons.featureGate": false,
  "amp.featureGate": false,
  "importantDates.featureGate": false,
  "mdn.featureGate": false,
  "weather.featureGate": false,
  "wikipedia.featureGate": false,
  "yelp.featureGate": false,
};


const EXPECTED_PREFS_EU_NATIVE = {
  "quicksuggest.enabled": true,
  "quicksuggest.dataCollection.enabled": false,
  "quicksuggest.settingsUi": QuickSuggest.SETTINGS_UI.OFFLINE_ONLY,
  "suggest.quicksuggest.nonsponsored": true,
  "suggest.quicksuggest.sponsored": true,
  "addons.featureGate": false,
  "amp.featureGate": false,
  "importantDates.featureGate": true,
  "mdn.featureGate": false,
  "weather.featureGate": true,
  "wikipedia.featureGate": false,
  "yelp.featureGate": false,
};



const EXPECTED_PREFS_EU_EN = {
  ...EXPECTED_PREFS_SUGGEST_DISABLED,
  "quicksuggest.enabled": true,
  "importantDates.featureGate": true,
};


const EXPECTED_PREFS_BY_LOCALE_BY_REGION = {
  DE: {
    de: EXPECTED_PREFS_EU_NATIVE,
    ...Object.fromEntries(
      EN_LOCALES.map(locale => [locale, EXPECTED_PREFS_EU_EN])
    ),
  },
  FR: {
    fr: EXPECTED_PREFS_EU_NATIVE,
    ...Object.fromEntries(
      EN_LOCALES.map(locale => [locale, EXPECTED_PREFS_EU_EN])
    ),
  },
  GB: Object.fromEntries(
    EN_LOCALES.map(locale => [
      locale,
      {
        "quicksuggest.enabled": true,
        "quicksuggest.dataCollection.enabled": false,
        "quicksuggest.settingsUi": QuickSuggest.SETTINGS_UI.OFFLINE_ONLY,
        "suggest.quicksuggest.nonsponsored": true,
        "suggest.quicksuggest.sponsored": true,
        "addons.featureGate": false,
        "amp.featureGate": true,
        "importantDates.featureGate": true,
        "mdn.featureGate": false,
        "weather.featureGate": true,
        "wikipedia.featureGate": true,
        "yelp.featureGate": false,
      },
    ])
  ),
  IT: {
    it: EXPECTED_PREFS_EU_NATIVE,
    ...Object.fromEntries(
      EN_LOCALES.map(locale => [locale, EXPECTED_PREFS_EU_EN])
    ),
  },
  US: Object.fromEntries(
    EN_LOCALES.map(locale => [
      locale,
      {
        "quicksuggest.enabled": true,
        "quicksuggest.dataCollection.enabled": false,
        "quicksuggest.settingsUi": QuickSuggest.SETTINGS_UI.OFFLINE_ONLY,
        "suggest.quicksuggest.nonsponsored": true,
        "suggest.quicksuggest.sponsored": true,
        "addons.featureGate": true,
        "amp.featureGate": true,
        "importantDates.featureGate": true,
        "mdn.featureGate": true,
        "weather.featureGate": true,
        "wikipedia.featureGate": true,
        "yelp.featureGate": true,
      },
    ])
  ),
};

add_setup(async () => {
  await UrlbarTestUtils.initNimbusFeature();
});

add_task(async function test() {
  let tests = [
    
    { region: "DE", locale: "de" },
    { region: "DE", locale: "en-GB" },
    { region: "DE", locale: "en-US" },

    { region: "FR", locale: "fr" },
    { region: "FR", locale: "en-GB" },
    { region: "FR", locale: "en-US" },

    { region: "GB", locale: "en-US" },
    { region: "GB", locale: "en-CA" },
    { region: "GB", locale: "en-GB" },

    { region: "IT", locale: "it" },
    { region: "IT", locale: "en-GB" },
    { region: "IT", locale: "en-US" },

    { region: "US", locale: "en-US" },
    { region: "US", locale: "en-CA" },
    { region: "US", locale: "en-GB" },

    
    { region: "CA", locale: "en-US" },
    { region: "CA", locale: "en-CA" },
    { region: "GB", locale: "de" },
    { region: "US", locale: "de" },
  ];

  for (let { locale, region } of tests) {
    await doTest({ locale, region });
  }
});












async function doTest({ locale, region }) {
  let expectedPrefs =
    EXPECTED_PREFS_BY_LOCALE_BY_REGION[region]?.[locale] ??
    EXPECTED_PREFS_SUGGEST_DISABLED;

  let defaults = new Preferences({
    branch: "browser.urlbar.",
    defaultBranch: true,
  });

  
  let originalDefaults = {};
  for (let name of Object.keys(expectedPrefs)) {
    Services.prefs.clearUserPref("browser.urlbar." + name);
    originalDefaults[name] = defaults.get(name);
  }

  
  await QuickSuggestTestUtils.withRegionAndLocale({
    region,
    locale,
    callback: async () => {
      for (let [name, value] of Object.entries(expectedPrefs)) {
        
        Assert.strictEqual(
          defaults.get(name),
          value,
          `Default pref value for ${name}, locale ${locale}, region ${region}`
        );

        
        
        
        UrlbarPrefs.get(
          name,
          value,
          `UrlbarPrefs.get() value for ${name}, locale ${locale}, region ${region}`
        );
      }
    },
  });

  
  for (let [name, originalDefault] of Object.entries(originalDefaults)) {
    if (originalDefault === undefined) {
      Services.prefs.deleteBranch("browser.urlbar." + name);
    } else {
      defaults.set(name, originalDefault);
    }
  }
}
