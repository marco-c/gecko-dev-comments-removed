














var compile = RegExp.prototype.compile;

assert.sameValue(typeof compile, 'function');

assert.throws(TypeError, function() {
  compile.call({});
}, 'ordinary object');

assert.throws(TypeError, function() {
  compile.call([]);
}, 'array exotic object');

assert.throws(TypeError, function() {
  compile.call(arguments);
}, 'arguments exotic object');
