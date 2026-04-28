
























var symbol = Symbol('');
var subject = /./;
var badToString = {
  toString: function() {
    throw new Test262Error();
  }
};
subject.lastIndex = 99;

assert.throws(Test262Error, function() {
  /./.compile('', badToString);
});

assert.throws(TypeError, function() {
  /./.compile('', symbol);
});

assert.sameValue(subject.lastIndex, 99);
