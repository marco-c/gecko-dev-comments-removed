



requestLongerTimeout(2);




add_task(async function () {
  await openPreferencesViaOpenPreferencesAPI("paneGeneral", {
    leaveOpen: true,
  });
  
  await evaluateSearchResults("Unified Canadian Syllabary", "fontsGroup");
  BrowserTestUtils.removeTab(gBrowser.selectedTab);
});




add_task(async function () {
  await openPreferencesViaOpenPreferencesAPI("paneGeneral", {
    leaveOpen: true,
  });
  await evaluateSearchResults("Link Colors", "contrastControlGroup");
  BrowserTestUtils.removeTab(gBrowser.selectedTab);
});




add_task(async function () {
  await openPreferencesViaOpenPreferencesAPI("paneGeneral", {
    leaveOpen: true,
  });
  await evaluateSearchResults(
    "won’t save passwords for sites listed here",
    "passwordsGroup"
  );
  BrowserTestUtils.removeTab(gBrowser.selectedTab);
});
