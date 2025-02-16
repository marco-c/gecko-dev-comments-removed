





"use strict";

const TEST_URI =
  "data:text/html;charset=utf-8,<!DOCTYPE html>Web Console test for Bug 1945716";

add_task(async function () {
  const hud = await openNewTabAndConsole(TEST_URI);

  const expression = `𝐀𝐁𝐂😀`;
  setInputValue(hud, expression);
  EventUtils.synthesizeKey("KEY_Backspace");
  is(getInputValue(hud), `𝐀𝐁𝐂`, "The emoji character is deleted correctly");
});
