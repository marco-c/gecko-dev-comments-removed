












var thisVal = {
  toString: function() {
    throw new Test262Error();
  }
};

assert.throws(Test262Error, function() {
  String.prototype.anchor.call(thisVal);
});
