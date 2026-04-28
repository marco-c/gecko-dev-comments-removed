

















assert.sameValue('abc'.substr(0, false), '', 'start: 0, length: false');
assert.sameValue('abc'.substr(1, false), '', 'start: 1, length: false');
assert.sameValue('abc'.substr(2, false), '', 'start: 2, length: false');
assert.sameValue('abc'.substr(3, false), '', 'start: 3, length: false');

assert.sameValue('abc'.substr(0, NaN), '', 'start: 0, length: NaN');
assert.sameValue('abc'.substr(1, NaN), '', 'start: 1, length: NaN');
assert.sameValue('abc'.substr(2, NaN), '', 'start: 2, length: NaN');
assert.sameValue('abc'.substr(3, NaN), '', 'start: 3, length: NaN');

assert.sameValue('abc'.substr(0, ''), '', 'start: 0, length: ""');
assert.sameValue('abc'.substr(1, ''), '', 'start: 1, length: ""');
assert.sameValue('abc'.substr(2, ''), '', 'start: 2, length: ""');
assert.sameValue('abc'.substr(3, ''), '', 'start: 3, length: ""');

assert.sameValue('abc'.substr(0, null), '', 'start: 0, length: null');
assert.sameValue('abc'.substr(1, null), '', 'start: 1, length: null');
assert.sameValue('abc'.substr(2, null), '', 'start: 2, length: null');
assert.sameValue('abc'.substr(3, null), '', 'start: 3, length: null');
