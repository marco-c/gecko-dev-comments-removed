




















var re;

re = eval('/' + /\ud834\udf06/u.source + '/u');

assert.sameValue(re.test('\ud834\udf06'), true);
assert.sameValue(re.test('𝌆'), true);

re = eval('/' + /\u{1d306}/u.source + '/u');

assert.sameValue(re.test('\ud834\udf06'), true);
assert.sameValue(re.test('𝌆'), true);

reportCompare(0, 0);
