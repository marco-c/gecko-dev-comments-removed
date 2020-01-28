

"use strict";






function run_test() {
  const g = newGlobal();
  const dbg = new Debugger(g);

  assertThrows(() => {
    saveHeapSnapshotAndTakeCensus(dbg, {
      breakdown: {
        get by() {
          throw Error("ಠ_ಠ");
        },
      },
    });
  }, "ಠ_ಠ");

  assertThrows(() => {
    saveHeapSnapshotAndTakeCensus(dbg, {
      breakdown: {
        by: "count",
        get count() {
          throw Error("ಠ_ಠ");
        },
      },
    });
  }, "ಠ_ಠ");

  assertThrows(() => {
    saveHeapSnapshotAndTakeCensus(dbg, {
      breakdown: {
        by: "count",
        get bytes() {
          throw Error("ಠ_ಠ");
        },
      },
    });
  }, "ಠ_ಠ");

  assertThrows(() => {
    saveHeapSnapshotAndTakeCensus(dbg, {
      breakdown: {
        by: "objectClass",
        get then() {
          throw Error("ಠ_ಠ");
        },
      },
    });
  }, "ಠ_ಠ");

  assertThrows(() => {
    saveHeapSnapshotAndTakeCensus(dbg, {
      breakdown: {
        by: "objectClass",
        get other() {
          throw Error("ಠ_ಠ");
        },
      },
    });
  }, "ಠ_ಠ");

  assertThrows(() => {
    saveHeapSnapshotAndTakeCensus(dbg, {
      breakdown: {
        by: "coarseType",
        get objects() {
          throw Error("ಠ_ಠ");
        },
      },
    });
  }, "ಠ_ಠ");

  assertThrows(() => {
    saveHeapSnapshotAndTakeCensus(dbg, {
      breakdown: {
        by: "coarseType",
        get scripts() {
          throw Error("ಠ_ಠ");
        },
      },
    });
  }, "ಠ_ಠ");

  assertThrows(() => {
    saveHeapSnapshotAndTakeCensus(dbg, {
      breakdown: {
        by: "coarseType",
        get strings() {
          throw Error("ಠ_ಠ");
        },
      },
    });
  }, "ಠ_ಠ");

  assertThrows(() => {
    saveHeapSnapshotAndTakeCensus(dbg, {
      breakdown: {
        by: "coarseType",
        get other() {
          throw Error("ಠ_ಠ");
        },
      },
    });
  }, "ಠ_ಠ");

  assertThrows(() => {
    saveHeapSnapshotAndTakeCensus(dbg, {
      breakdown: {
        by: "internalType",
        get then() {
          throw Error("ಠ_ಠ");
        },
      },
    });
  }, "ಠ_ಠ");

  do_test_finished();
}
