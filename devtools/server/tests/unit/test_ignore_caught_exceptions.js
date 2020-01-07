



"use strict";






var gDebuggee;
var gClient;

function run_test() {
  do_test_pending();
  run_test_with_server(DebuggerServer, function() {
    run_test_with_server(WorkerDebuggerServer, do_test_finished);
  });
}

function run_test_with_server(server, callback) {
  initTestDebuggerServer(server);
  gDebuggee = addTestGlobal("test-pausing", server);
  gClient = new DebuggerClient(server.connectPipe());
  gClient.connect(test_pause_frame);
}

async function test_pause_frame() {
  const [,, threadClient] = await attachTestTabAndResume(gClient, "test-pausing");
  await executeOnNextTickAndWaitForPause(evaluateTestCode, gClient);

  evaluateTestCode();

  threadClient.pauseOnExceptions(true, true);
  await resume(threadClient);
  const paused = await waitForPause(gClient);
  Assert.equal(paused.why.type, "exception");
  equal(paused.frame.where.line, 6, "paused at throw");

  await resume(threadClient);
  finishClient(gClient);
}

function evaluateTestCode() {
  
  try {
  Cu.evalInSandbox(`                    // 1
   debugger;                            // 2
   try {                                // 3           
     throw "foo";                       // 4
   } catch (e) {}                       // 5
   throw "bar";                         // 6  
  `,                                    
    gDebuggee,
    "1.8",
    "test_pause_exceptions-03.js",
    1
  );
  } catch (e) {}
  
}
