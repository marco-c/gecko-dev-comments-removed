














var descriptor = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__');


assert.sameValue(
  descriptor.set.name, 'set __proto__',
  'The value of `descriptor.set.name` is `"set __proto__"`'
);

verifyNotEnumerable(descriptor.set, 'name');
verifyNotWritable(descriptor.set, 'name');
verifyConfigurable(descriptor.set, 'name');

reportCompare(0, 0);
