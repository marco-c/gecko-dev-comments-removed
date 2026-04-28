





















var subject;

subject = /abc/;
assert.sameValue(
  subject.compile(), subject, 'method return value (unspecified)'
);
assert.sameValue(
  subject.source, new RegExp('').source, '[[OriginalSource]] (unspecified)'
);
assert.sameValue(
  subject.test(''), true, '[[RegExpMatcher]] internal slot (unspecified)'
);

subject = /abc/;
assert.sameValue(
  subject.compile(undefined),
  subject,
  'method return value (explicit undefined)'
);
assert.sameValue(
  subject.source,
  new RegExp('').source,
  '[[OriginalSource]] (explicit undefined)'
);
assert.sameValue(
  subject.test(''),
  true,
  '[[RegExpMatcher]] internal slot (explicit undefined)'
);
