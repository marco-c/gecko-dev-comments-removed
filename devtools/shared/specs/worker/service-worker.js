


"use strict";

const { generateActorSpec } = require("devtools/shared/protocol");

const serviceWorkerSpec = generateActorSpec({
  typeName: "serviceWorker",
});

exports.serviceWorkerSpec = serviceWorkerSpec;
