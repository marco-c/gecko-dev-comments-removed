




var EXPORTED_SYMBOLS = ["RFPHelperChild"];

const { XPCOMUtils } = ChromeUtils.import(
  "resource://gre/modules/XPCOMUtils.jsm"
);

const kPrefLetterboxing = "privacy.resistFingerprinting.letterboxing";

XPCOMUtils.defineLazyPreferenceGetter(
  this,
  "isLetterboxingEnabled",
  kPrefLetterboxing,
  false
);

class RFPHelperChild extends JSWindowActorChild {
  handleEvent(event) {
    if (isLetterboxingEnabled && event.type == "resize") {
      this.sendAsyncMessage("Letterboxing:ContentSizeUpdated");
    }
  }
}
