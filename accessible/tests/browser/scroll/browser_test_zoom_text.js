



"use strict";


loadScripts({ name: "layout.js", dir: MOCHITESTS_DIR });

async function waitForContentPaint(browser) {
  await SpecialPowers.spawn(browser, [], () => {
    return new Promise(function(r) {
      content.requestAnimationFrame(() => content.setTimeout(r));
    });
  });
}

async function runTests(browser, accDoc) {
  await loadContentScripts(browser, "Layout.jsm");

  let paragraph = findAccessibleChildByID(accDoc, "paragraph", [
    nsIAccessibleText,
  ]);
  let offset = 64; 

  let [x ] = getPos(paragraph);
  let [docX, docY] = getPos(accDoc);

  paragraph.scrollSubstringToPoint(
    offset,
    offset,
    COORDTYPE_SCREEN_RELATIVE,
    docX,
    docY
  );

  await waitForContentPaint(browser);
  testTextPos(paragraph, offset, [x, docY], COORDTYPE_SCREEN_RELATIVE);

  await SpecialPowers.spawn(browser, [], () => {
    content.Layout.zoomDocument(content.document, 2.0);
  });

  paragraph = findAccessibleChildByID(accDoc, "paragraph2", [
    nsIAccessibleText,
  ]);
  offset = 52; 
  [x ] = getPos(paragraph);
  paragraph.scrollSubstringToPoint(
    offset,
    offset,
    COORDTYPE_SCREEN_RELATIVE,
    docX,
    docY
  );

  await waitForContentPaint(browser);
  testTextPos(paragraph, offset, [x, docY], COORDTYPE_SCREEN_RELATIVE);
}




addAccessibleTask(
  `
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br><hr>
  <p id='paragraph'>
    Пошел котик на торжок<br>
    Купил котик пирожок<br>
    Пошел котик на улочку<br>
    Купил котик булочку<br>
  </p>
  <hr><br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br><hr>
  <p id='paragraph2'>
    Самому ли съесть<br>
    Либо Сашеньке снесть<br>
    Я и сам укушу<br>
    Я и Сашеньке снесу<br>
  </p>
  <hr><br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>
  <br><br><br><br><br><br><br><br><br><br>`,
  runTests
);
