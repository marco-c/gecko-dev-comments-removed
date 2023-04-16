




"use strict";

add_task(async function() {
  const URL1 = buildURLWithContent(
    "example.com",
    `<h1>example.com</h1>` + `<script>document.cookie = "lorem=ipsum";</script>`
  );
  const URL2 = buildURLWithContent(
    "example.net",
    `<h1>example.net</h1>` + `<script>document.cookie = "foo=bar";</script>`
  );

  
  await openTabAndSetupStorage(URL1);
  const doc = gPanelWindow.document;

  
  
  checkTree(doc, ["cookies", "http://example.com"]);
  
  await selectTreeItem(["cookies", "http://example.com"]);
  checkCookieData("lorem", "ipsum");

  
  

  
  await navigateTo(URL2);
  
  info("Waiting for storage tree to refresh and show correct host…");
  await waitUntil(() => isInTree(doc, ["cookies", "http://example.net"]));
  
  await selectTreeItem(["cookies", "http://example.net"]);
  checkCookieData("foo", "bar");
});
