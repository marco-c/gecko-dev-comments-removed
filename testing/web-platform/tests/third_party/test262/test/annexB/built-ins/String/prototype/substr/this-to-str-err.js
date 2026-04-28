










var substr = String.prototype.substr;
var thisValue = {
  toString: function() {
    throw new Test262Error();
  }
};

assert.throws(Test262Error, function() {
  substr.call(thisValue);
});
