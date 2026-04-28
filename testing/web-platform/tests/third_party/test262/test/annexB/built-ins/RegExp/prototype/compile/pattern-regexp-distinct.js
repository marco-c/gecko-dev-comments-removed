

















var subject = /abc/gim;
var pattern = /def/;
var result;
subject.lastIndex = 23;
pattern.lastIndex = 45;

result = subject.compile(pattern);

assert.sameValue(result, subject, 'method return value');
assert.sameValue(subject.lastIndex, 0);
assert.sameValue(pattern.lastIndex, 45);

assert.sameValue(subject.toString(), new RegExp('def').toString());
assert.sameValue(
  subject.test('def'), true, '[[RegExpMatcher]] internal slot (source)'
);
assert.sameValue(
  subject.test('DEF'), false, '[[RegExpMatch]] internal slot (flags)'
);
