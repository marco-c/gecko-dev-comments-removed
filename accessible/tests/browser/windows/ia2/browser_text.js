



"use strict";




addAccessibleTask(`<p id="cluster">a🤦‍♂️c`, async function testChar() {
  await runPython(`
      doc = getDocIa2()
      global cluster
      cluster = findIa2ByDomId(doc, "cluster")
      cluster = cluster.QueryInterface(IAccessibleText)
    `);
  SimpleTest.isDeeply(
    await runPython(`cluster.textAtOffset(0, IA2_TEXT_BOUNDARY_CHAR)`),
    [0, 1, "a"],
    "textAtOffset at 0 for CHAR correct"
  );
  SimpleTest.isDeeply(
    await runPython(`cluster.textAtOffset(1, IA2_TEXT_BOUNDARY_CHAR)`),
    [1, 6, "🤦‍♂️"],
    "textAtOffset at 1 for CHAR correct"
  );
  SimpleTest.isDeeply(
    await runPython(`cluster.textAtOffset(5, IA2_TEXT_BOUNDARY_CHAR)`),
    [1, 6, "🤦‍♂️"],
    "textAtOffset at 5 for CHAR correct"
  );
  SimpleTest.isDeeply(
    await runPython(`cluster.textAtOffset(6, IA2_TEXT_BOUNDARY_CHAR)`),
    [6, 7, "c"],
    "textAtOffset at 6 for CHAR correct"
  );
});
