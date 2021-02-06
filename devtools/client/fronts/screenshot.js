



"use strict";

const { screenshotSpec } = require("devtools/shared/specs/screenshot");
const {
  FrontClassWithSpec,
  registerFront,
} = require("devtools/shared/protocol");

class ScreenshotFront extends FrontClassWithSpec(screenshotSpec) {
  constructor(client, targetFront, parentFront) {
    super(client, targetFront, parentFront);

    
    this.formAttributeName = "screenshotActor";
  }
}

exports.ScreenshotFront = ScreenshotFront;
registerFront(ScreenshotFront);
