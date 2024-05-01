


"use strict";

add_task(async function test_utf8_extension() {
  const mimeService = Cc["@mozilla.org/mime;1"].getService(Ci.nsIMIMEService);
  let someMIME = mimeService.getFromTypeAndExtension(
    "application/x-nonsense",
    ".тест"
  );
  Assert.stringContains(someMIME.description, "тест");
  
  if (AppConstants.platform != "macosx" && AppConstants.platform != "android") {
    Assert.equal(someMIME.primaryExtension, ".тест");
  }
});
