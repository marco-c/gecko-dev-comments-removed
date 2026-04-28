









var substr = String.prototype.substr;

assert.sameValue(typeof substr, 'function');

assert.throws(TypeError, function() {
  substr.call(undefined);
}, 'undefined');

assert.throws(TypeError, function() {
  substr.call(null);
}, 'null');
