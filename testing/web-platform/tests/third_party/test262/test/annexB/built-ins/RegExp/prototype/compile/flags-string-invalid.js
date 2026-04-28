



















var subject = /abcd/ig;

assert.throws(SyntaxError, function() {
  subject.compile('', 'igi');
}, 'invalid flags: igi');

assert.throws(SyntaxError, function() {
  subject.compile('', 'gI');
}, 'invalid flags: gI');

assert.throws(SyntaxError, function() {
  subject.compile('', 'w');
}, 'invalid flags: w');

assert.sameValue(
  subject.toString(),
  new RegExp('abcd', 'ig').toString(),
  '[[OriginalSource]] internal slot'
);

assert.sameValue(
  subject.test('AbCD'), true, '[[RegExpMatcher]] internal slot'
);
