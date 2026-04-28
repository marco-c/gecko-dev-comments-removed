













var compile = RegExp.prototype.compile;
var symbol = Symbol('');

assert.sameValue(typeof compile, 'function');

assert.throws(TypeError, function() {
  compile.call(undefined);
}, 'undefined');

assert.throws(TypeError, function() {
  compile.call(null);
}, 'null');

assert.throws(TypeError, function() {
  compile.call(23);
}, 'number');

assert.throws(TypeError, function() {
  compile.call(true);
}, 'boolean');

assert.throws(TypeError, function() {
  compile.call('/string/');
}, 'string');

assert.throws(TypeError, function() {
  compile.call(symbol);
}, 'symbol');
