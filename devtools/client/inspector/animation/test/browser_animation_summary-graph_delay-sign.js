


"use strict";

add_task(async function() {
  Services.scriptloader.loadSubScript(
    CHROME_URL_ROOT + "summary-graph_delay-sign_head.js",
    this
  );
  
  await testSummaryGraphDelaySign();
});
