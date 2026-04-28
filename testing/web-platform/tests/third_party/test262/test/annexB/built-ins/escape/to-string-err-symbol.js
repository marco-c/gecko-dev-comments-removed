










var s = Symbol('');

assert.throws(TypeError, function() {
  escape(s);
});
