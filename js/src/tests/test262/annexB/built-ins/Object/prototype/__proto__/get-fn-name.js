














var descriptor = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__');


assert.sameValue(
  descriptor.get.name, 'get __proto__',
  'The value of `descriptor.get.name` is `"get __proto__"`'
);

verifyNotEnumerable(descriptor.get, 'name');
verifyNotWritable(descriptor.get, 'name');
verifyConfigurable(descriptor.get, 'name');

reportCompare(0, 0);
