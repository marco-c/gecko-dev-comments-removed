












var date = new Date({});
var expected = new Date(1971, 0).valueOf();

assert.sameValue(date.setYear(71), expected, 'method return value');
assert.sameValue(date.valueOf(), expected, '[[DateValue]] internal slot');
