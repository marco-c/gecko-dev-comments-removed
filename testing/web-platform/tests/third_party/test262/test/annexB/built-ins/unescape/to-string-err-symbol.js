










var s = Symbol('');

assert.throws(TypeError, function() {
  unescape(s);
});
