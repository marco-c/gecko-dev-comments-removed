






const ICONS = {
  active: "chrome://browser/skin/trust-icon-active.svg",
  insecure: "chrome://browser/skin/trust-icon-insecure.svg",
  file: "chrome://global/skin/icons/page-portrait.svg",
};

const TESTS = [
  {
    url: "about:about",
    icon: ICONS.insecure,
  },
  {
    url: "https://example.com",
    icon: ICONS.active,
  },
  {
    url: "http://127.0.0.1/",
    icon: ICONS.insecure,
    waitForLoad: false,
  },
];

add_setup(async function setup() {
  await SpecialPowers.pushPrefEnv({
    set: [["browser.urlbar.trustPanel.featureGate", true]],
  });
});

add_task(async function () {
  for (let testData of TESTS) {
    info(`Testing state of for ${testData.url}`);

    const tab = await BrowserTestUtils.openNewForegroundTab({
      gBrowser,
      opening: testData.url,
      waitForLoad: testData.waitForLoad ?? true,
    });

    let doc = tab.ownerDocument;
    let icon = doc.defaultView.getComputedStyle(
      doc.getElementById("trust-icon")
    ).listStyleImage;
    let iconUrl = icon.match(/url\("([^"]+)"\)/)?.[1] ?? null;

    Assert.equal(iconUrl, testData.icon, "Trustpanel urlbar icon is correct");

    BrowserTestUtils.removeTab(tab);
  }
});
