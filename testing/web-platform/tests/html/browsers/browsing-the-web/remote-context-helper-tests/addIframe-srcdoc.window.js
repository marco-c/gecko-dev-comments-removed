






'use strict';


promise_test(async t => {
  const rcHelper = new RemoteContextHelper();

  const main = await rcHelper.addWindow();

  const iframe = await main.addIframeSrcdoc(
       {scripts: ['./resources/test-script.js']},
       {id: 'test-id'},
  );

  await assertSimplestScriptRuns(iframe);
  await assertFunctionRuns(iframe, () => testFunction(), 'testFunction exists');

  const [id, src, srcdoc] = await main.executeScript(() => {
    const iframe = document.getElementById('test-id');
    return [iframe.id, iframe.src, iframe.srcdoc];
  });
  assert_equals(id, 'test-id', 'verify id');
  assert_equals(src, '', 'verify src');
  assert_greater_than(srcdoc.length, 0, 'verify srcdoc');
});
