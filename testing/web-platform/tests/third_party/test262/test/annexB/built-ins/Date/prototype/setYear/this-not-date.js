










var setYear = Date.prototype.setYear;

assert.sameValue(typeof setYear, 'function');

assert.throws(TypeError, function() {
  setYear.call({}, 1);
}, 'object');

assert.throws(TypeError, function() {
  setYear.call(undefined, 1);
}, 'undefined');

assert.throws(TypeError, function() {
  setYear.call(null, 1);
}, 'null');
