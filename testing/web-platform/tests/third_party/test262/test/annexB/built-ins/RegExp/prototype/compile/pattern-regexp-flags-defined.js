













var re = /./;
re.lastIndex = 23;

assert.sameValue(typeof RegExp.prototype.compile, 'function');

assert.throws(TypeError, function() {
  re.compile(re, null);
}, 'null');

assert.throws(TypeError, function() {
  re.compile(re, 0);
}, 'numeric primitive');

assert.throws(TypeError, function() {
  re.compile(re, '');
}, 'string primitive');

assert.throws(TypeError, function() {
  re.compile(re, false);
}, 'boolean primitive');

assert.throws(TypeError, function() {
  re.compile(re, {});
}, 'ordinary object');

assert.throws(TypeError, function() {
  re.compile(re, []);
}, 'array exotic object');

assert.sameValue(re.lastIndex, 23);
