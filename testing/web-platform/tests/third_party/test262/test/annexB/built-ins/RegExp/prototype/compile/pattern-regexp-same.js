

















var subject = /abc/gim;
var result;
subject.lastIndex = 23;

result = subject.compile(subject);

assert.sameValue(result, subject, 'method return value');
assert.sameValue(
  subject.toString(),
  new RegExp('abc', 'gim').toString(),
  '[[OriginalSource]] internal slot'
);
assert.sameValue(subject.lastIndex, 0);
assert.sameValue(subject.test('aBc'), true, '[[RegExpMatcher]] internal slot');
