

























var subject = /original value/ig;

subject.compile('[\ud834\udf06]', 'u');

assert.sameValue(
  subject.source,
  new RegExp('[\ud834\udf06]', 'u').source,
  '[[OriginalSource]] internal slot'
);
assert.sameValue(
  subject.test('original value'),
  false,
  '[[RegExpMatcher]] internal slot (source)'
);
assert.sameValue(
  subject.test('\ud834'), false, '[[RegExpMatcher]] internal slot (flags #1)'
);
assert.sameValue(
  subject.test('\udf06'), false, '[[RegExpMatcher]] internal slot (flags #2)'
);
assert.sameValue(
  subject.test('\ud834\udf06'),
  true,
  '[[RegExpMatcher]] internal slot (flags #3)'
);
