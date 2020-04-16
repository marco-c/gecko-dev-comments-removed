



















var nullChar = String.fromCharCode(0);
assert.sameValue(/\0/u.exec(nullChar)[0], nullChar);
assert(/^\0a$/u.test('\0a'));
assert.sameValue('\x00②'.match(/\0②/u)[0], '\x00②');
assert.sameValue('\u0000፬'.search(/\0፬$/u), 0);

reportCompare(0, 0);
