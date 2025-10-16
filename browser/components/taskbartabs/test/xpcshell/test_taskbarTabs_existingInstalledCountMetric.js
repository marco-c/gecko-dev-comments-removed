


"use strict";






ChromeUtils.defineESModuleGetters(this, {
  sinon: "resource://testing-common/Sinon.sys.mjs",
  TaskbarTabsPin: "resource:///modules/taskbartabs/TaskbarTabsPin.sys.mjs",
});

add_setup(function test_setup() {
  do_get_profile();
  Services.fog.initializeFOG();

  sinon.stub(TaskbarTabsPin, "pinTaskbarTab");
  sinon.stub(TaskbarTabsPin, "unpinTaskbarTab");
});

add_task(async function test_installedCounterMetric() {
  const value = () => Glean.webApp.installedWebAppCount.testGetValue();
  equal(value(), undefined, "Should not be set before initializing");

  const taskbarTabsJSON = do_get_profile();
  taskbarTabsJSON.append("taskbartabs");
  taskbarTabsJSON.append("taskbartabs.json");
  const kId = "4186657a-0fe5-492a-af64-dc628c232c4c";
  await IOUtils.writeJSON(taskbarTabsJSON.path, {
    version: 1,
    taskbarTabs: [
      {
        id: kId,
        scopes: [{ hostname: "www.test.com" }],
        userContextId: 0,
        startUrl: "https://www.test.com/start",
      },
    ],
  });

  
  
  const { TaskbarTabs } = ChromeUtils.importESModule(
    "resource:///modules/taskbartabs/TaskbarTabs.sys.mjs"
  );

  
  await TaskbarTabs.waitUntilReady();

  equal(value(), 1, "The existing Taskbar Tab was counted");

  const tt = await TaskbarTabs.findOrCreateTaskbarTab(
    Services.io.newURI("https://www.test.com"),
    0
  );
  equal(tt.id, kId, "Correct Taskbar Tab was found");
  equal(value(), 1, "Finding a Taskbar Tab does not affect the count");

  await TaskbarTabs.removeTaskbarTab(tt.id);
  equal(value(), 0, "Removing the taskbar tab was accounted for");
});
