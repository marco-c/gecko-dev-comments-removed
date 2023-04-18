"use strict";




requestLongerTimeout(5);

SimpleTest.expectChildProcessCrash();

add_task(async function test_browser_crashed_basic_event() {
  info("Waiting for oop-browser-crashed event.");

  Services.telemetry.clearScalars();
  is(
    getFalsePositiveTelemetry(),
    undefined,
    "Build ID mismatch false positive count should be undefined"
  );

  await forceCleanProcesses();
  let eventPromise = getEventPromise("oop-browser-crashed", "basic");
  let tab = await openNewTab(true);
  await eventPromise;

  is(
    getFalsePositiveTelemetry(),
    undefined,
    "Build ID mismatch false positive count should be undefined"
  );
  await closeTab(tab);
});
