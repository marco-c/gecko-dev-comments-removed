












var desc = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__');

verifyNotEnumerable(Object.prototype, '__proto__');
verifyConfigurable(Object.prototype, '__proto__');

assert.sameValue(desc.value, undefined, '`value` property');
assert.sameValue(typeof desc.get, 'function', '`get` property');
assert.sameValue(typeof desc.set, 'function', '`set` property');

reportCompare(0, 0);
