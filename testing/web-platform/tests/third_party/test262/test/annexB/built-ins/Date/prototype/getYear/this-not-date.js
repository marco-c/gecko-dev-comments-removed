










var getYear = Date.prototype.getYear;

assert.sameValue(typeof getYear, 'function');

assert.throws(TypeError, function() {
  getYear.call({});
}, 'object');

assert.throws(TypeError, function() {
  getYear.call(undefined);
}, 'undefined');

assert.throws(TypeError, function() {
  getYear.call(null);
}, 'null');
