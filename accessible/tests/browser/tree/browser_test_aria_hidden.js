


"use strict";


loadScripts({ name: "role.js", dir: MOCHITESTS_DIR });







addAccessibleTask(
  `<html aria-hidden="true"><u>hello world`,
  async function testTabRootDocument(_, accDoc) {
    const tree = {
      DOCUMENT: [
        {
          TEXT_LEAF: [],
        },
      ],
    };
    testAccessibleTree(accDoc, tree);
  },
  {
    chrome: true,
    topLevel: true,
    iframe: false,
    remoteIframe: false,
  }
);








addAccessibleTask(
  `
  <p id="content">I am some content in a document</p>
  `,
  async function testTabDocument(browser, docAcc) {
    const originalTree = { DOCUMENT: [{ PARAGRAPH: [{ TEXT_LEAF: [] }] }] };
    testAccessibleTree(docAcc, originalTree);
  },
  {
    chrome: true,
    topLevel: true,
    iframe: false,
    remoteIframe: false,
    contentDocBodyAttrs: { "aria-hidden": "true" },
  }
);








addAccessibleTask(
  `
  <p id="content">I am some content in a document</p>
  `,
  async function testTabDocumentMutation(browser, docAcc) {
    const originalTree = { DOCUMENT: [{ PARAGRAPH: [{ TEXT_LEAF: [] }] }] };

    testAccessibleTree(docAcc, originalTree);
    info("Adding aria-hidden=true to content doc");
    const unexpectedEvents = { unexpected: [[EVENT_REORDER, docAcc]] };
    await contentSpawnMutation(browser, unexpectedEvents, function () {
      const b = content.document.body;
      b.setAttribute("aria-hidden", "true");
    });

    testAccessibleTree(docAcc, originalTree);
  },
  { chrome: true, topLevel: true, iframe: false, remoteIframe: false }
);
