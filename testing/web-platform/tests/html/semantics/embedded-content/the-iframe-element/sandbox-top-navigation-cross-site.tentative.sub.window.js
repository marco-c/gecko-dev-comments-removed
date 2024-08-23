









'use strict';

promise_test(async t => {
  const main = await setupTest();

  const iframe = await createNestedIframe(main, "HTTP_ORIGIN", "", "");
  await activate(iframe);

  const new_iframe = await navigateFrameTo(iframe, "HTTPS_REMOTE_ORIGIN");
  await attemptTopNavigation(new_iframe, false);
}, "A cross-site unsandboxed iframe navigation consumes user activation and " +
   "disallows top-level navigation.");
