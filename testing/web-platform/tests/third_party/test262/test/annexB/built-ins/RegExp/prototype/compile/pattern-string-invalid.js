
























var subject = /test262/ig;

assert.throws(SyntaxError, function() {
  subject.compile('?');
}, 'invalid pattern: ?');

assert.throws(SyntaxError, function() {
  subject.compile('.{2,1}');
}, 'invalid pattern: .{2,1}');

assert.sameValue(
  subject.toString(),
  new RegExp('test262', 'ig').toString(),
  '[[OriginalSource]] internal slot'
);

assert.sameValue(
  subject.test('TEsT262'), true, '[[RegExpMatcher]] internal slot'
);
