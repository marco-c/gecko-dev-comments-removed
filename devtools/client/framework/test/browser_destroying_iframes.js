

"use strict";




add_task(async function () {
  const { tab } = await openInspectorForURL("about:blank");
  const browser = tab.linkedBrowser;

  
  for (let i = 0; i < 10; i++) {
    await SpecialPowers.spawn(browser, [], async function () {
      const iframe = content.document.createElement("iframe");
      content.document.body.appendChild(iframe);
      await new Promise(res => (iframe.onload = res));
      iframe.remove();
    });
  }
});
