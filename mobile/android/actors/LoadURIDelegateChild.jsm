



const { GeckoViewActorChild } = ChromeUtils.importESModule(
  "resource://gre/modules/GeckoViewActorChild.sys.mjs"
);

const lazy = {};

ChromeUtils.defineESModuleGetters(lazy, {
  LoadURIDelegate: "resource://gre/modules/LoadURIDelegate.sys.mjs",
});

var EXPORTED_SYMBOLS = ["LoadURIDelegateChild"];


class LoadURIDelegateChild extends GeckoViewActorChild {
  
  handleLoadError(aUri, aError, aErrorModule) {
    debug`handleLoadError: uri=${aUri && aUri.spec}
                             displaySpec=${aUri && aUri.displaySpec}
                             error=${aError}`;
    if (aUri && lazy.LoadURIDelegate.isSafeBrowsingError(aError)) {
      const message = {
        type: "GeckoView:ContentBlocked",
        uri: aUri.spec,
        error: aError,
      };

      this.eventDispatcher.sendRequest(message);
    }

    return lazy.LoadURIDelegate.handleLoadError(
      this.contentWindow,
      this.eventDispatcher,
      aUri,
      aError,
      aErrorModule
    );
  }
}

LoadURIDelegateChild.prototype.QueryInterface = ChromeUtils.generateQI([
  "nsILoadURIDelegate",
]);

const { debug, warn } = LoadURIDelegateChild.initLogging("LoadURIDelegate");
