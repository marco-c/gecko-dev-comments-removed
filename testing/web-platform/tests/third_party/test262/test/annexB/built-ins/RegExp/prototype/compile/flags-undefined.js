






















var subject, result;

subject = /abc/ig;

result = subject.compile('def');

assert.sameValue(result, subject, 'method return value (unspecified)');
assert.sameValue(
  subject.flags, new RegExp('def').flags, '[[OriginalFlags]] (unspecified)'
);
assert.sameValue(
  subject.test('DEF'), false, '[[RegExpMatcher]] internal slot (unspecified)'
);

subject = /abc/gi;

result = subject.compile('def', undefined);

assert.sameValue(result, subject, 'method return value (explicit undefined)');
assert.sameValue(
  subject.flags,
  new RegExp('def').flags,
  '[[OriginalSource]] (explicit undefined)'
);
assert.sameValue(
  subject.test('DEF'),
  false,
  '[[RegExpMatcher]] internal slot (explicit undefined)'
);
