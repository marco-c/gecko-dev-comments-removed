


function test() {
  let tab = gBrowser.addTrustedTab("about:blank", { tabIndex: 10 });
  is(tab.index, 1, "added tab index should be 1");
  gBrowser.removeTab(tab);
}
