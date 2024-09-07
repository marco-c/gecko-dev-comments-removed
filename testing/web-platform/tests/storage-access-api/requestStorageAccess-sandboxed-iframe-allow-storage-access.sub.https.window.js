



'use strict';








const {testPrefix, topLevelDocument} = processQueryParams();

if (topLevelDocument) {
  const frameSourceUrl =
      'https://{{hosts[alt][www]}}:{{ports[https][0]}}/storage-access-api/requestStorageAccess-sandboxed-iframe-allow-storage-access.sub.https.window.html';

  const sandboxAttribute =
      'allow-scripts allow-same-origin allow-storage-access-by-user-activation';
  const testCase = 'sandboxed-iframe-allow-storage-access-by-user-activation';

  RunTestsInIFrame(
    frameSourceUrl + `?testCase=${testCase}`,
    sandboxAttribute);
} else {
  test(() => {
    let iframe = document.createElement('iframe');
    assert_true(
        iframe.sandbox.supports('allow-storage-access-by-user-activation'),
        '`allow-storage-access-by-user-activation`' +
            'sandbox attribute should be supported');
  }, '`allow-storage-access-by-user-activation` sandbox attribute is supported');

  
  
  
  
  promise_test(async t => {
    await test_driver.set_permission({name: 'storage-access'}, 'granted');
    await MaybeSetStorageAccess('*', '*', 'blocked');
    await document.requestStorageAccess();

    assert_true(
        await CanAccessCookiesViaHTTP(),
        'After obtaining storage access, subresource requests from the frame should send and set cookies.');
    assert_true(
        CanAccessCookiesViaJS(),
        'After obtaining storage access, scripts in the frame should be able to access cookies.');
  }, `[${testPrefix}] document.requestStorageAccess() should resolve even without a user gesture when already granted.`);

  promise_test(async () => {
    await test_driver.set_permission({name: 'storage-access'}, 'granted');
    await MaybeSetStorageAccess('*', '*', 'blocked');

    await RunCallbackWithGesture(async () => {
      await document.requestStorageAccess();
    });

    assert_true(
        await CanAccessCookiesViaHTTP(),
        'After obtaining storage access, subresource requests from the frame should send and set cookies.');
    assert_true(
        CanAccessCookiesViaJS(),
        'After obtaining storage access, scripts in the frame should be able to access cookies.');
  }, `[${testPrefix}] document.requestStorageAccess() should resolve with a user gesture`);
}
