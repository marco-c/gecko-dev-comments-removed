


"use strict";

Services.scriptloader.loadSubScript(
  "chrome://mochitests/content/browser/" +
    "security/sandbox/test/browser_content_sandbox_utils.js",
  this
);

Services.scriptloader.loadSubScript(
  "chrome://mochitests/content/browser/" +
    "security/sandbox/test/browser_content_sandbox_fs_tests.js",
  this
);




















add_task(async function () {
  sanityChecks();

  
  add_task(createFileInHome); 

  
  add_task(createTempFile); 

  
  add_task(testFileAccessAllPlatforms); 

  add_task(testFileAccessMacOnly); 

  add_task(testFileAccessLinuxOnly); 

  add_task(testFileAccessWindowsOnly); 

  add_task(cleanupBrowserTabs); 
});
