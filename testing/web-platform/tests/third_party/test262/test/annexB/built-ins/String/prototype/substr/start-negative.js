










assert.sameValue('abc'.substr(-1), 'c');
assert.sameValue('abc'.substr(-2), 'bc');
assert.sameValue('abc'.substr(-3), 'abc');
assert.sameValue('abc'.substr(-4), 'abc', 'size + intStart < 0');

assert.sameValue('abc'.substr(-1.1), 'c', 'floating point rounding semantics');
