




'use strict';


add_task(function*() {
  
  Observer.add_observers(Services);
  registerCleanupFunction(do_cleanup);

  let which = "block_display";

  SetupPrefTestEnvironment(which);

  for (let server of Object.keys(test_servers)) {
    yield execute_test(server, test_settings[which].mimetype);
  }

  test_settings[which].priming = {};

  
  for (let server of Object.keys(test_servers)) {
    yield execute_test(server, test_settings[which].mimetype);
  }

  SpecialPowers.popPrefEnv();
});
