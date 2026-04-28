


























var subject = /original value/ig;

subject.compile('new value');

assert.sameValue(
  subject.source,
  new RegExp('new value').source,
  '[[OriginalSource]] internal slot'
);
assert.sameValue(
  subject.test('original value'), false, '[[RegExpMatcher]] internal slot'
);
assert.sameValue(
  subject.test('new value'), true, '[[RegExpMatcher]] internal slot'
);
