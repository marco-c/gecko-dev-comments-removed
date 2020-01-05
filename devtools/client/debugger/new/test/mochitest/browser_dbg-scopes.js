


const {
  setupTestRunner,
  scopes
} = require("devtools/client/debugger/new/integration-tests");

add_task(function*() {
  setupTestRunner(this);
  yield scopes(this);
});
