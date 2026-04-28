
















assert.sameValue('abc'.substr(0), 'abc', 'start: 0, length: unspecified');
assert.sameValue('abc'.substr(1), 'bc', 'start: 1, length: unspecified');
assert.sameValue('abc'.substr(2), 'c', 'start: 2, length: unspecified');
assert.sameValue('abc'.substr(3), '', 'start: 3, length: unspecified');

assert.sameValue(
  'abc'.substr(0, undefined), 'abc', 'start: 0, length: undefined'
);
assert.sameValue(
  'abc'.substr(1, undefined), 'bc', 'start: 1, length: undefined'
);
assert.sameValue(
  'abc'.substr(2, undefined), 'c', 'start: 2, length: undefined'
);
assert.sameValue(
  'abc'.substr(3, undefined), '', 'start: 3, length: undefined'
);
