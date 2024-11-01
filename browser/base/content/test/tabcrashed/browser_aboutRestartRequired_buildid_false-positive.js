"use strict";




requestLongerTimeout(2);

SimpleTest.expectChildProcessCrash();

async function execTest(expectedValueAfter) {
  setBuildidMatchDontSendEnv();
  await forceCleanProcesses();
  let eventPromise = getEventPromise("oop-browser-crashed", "false-positive");
  let tab = await openNewTab(false);
  await eventPromise;
  unsetBuildidMatchDontSendEnv();

  is(
    await getFalsePositiveTelemetry(),
    expectedValueAfter,
    `Build ID mismatch false positive count should be ${expectedValueAfter}`
  );

  await closeTab(tab);
}

add_task(
  async function test_telemetry_restartrequired_falsepositive_mismatch() {
    
    
    

    info("Waiting for oop-browser-crashed event.");

    
    await execTest(1);
    
    await execTest(1);
  }
);
