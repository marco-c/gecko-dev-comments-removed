












var set = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;

assert.sameValue(set.call(true), undefined, 'boolean');
assert.sameValue(set.call(1), undefined, 'number');
assert.sameValue(set.call('string'), undefined, 'string');
assert.sameValue(set.call(Symbol('')), undefined, 'symbol');

reportCompare(0, 0);
