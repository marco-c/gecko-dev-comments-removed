























assert.sameValue(unescape('%0%0'), '%0%0');

assert.sameValue(unescape('%0g0'), '%0g0');
assert.sameValue(unescape('%0G0'), '%0G0');
assert.sameValue(unescape('%g00'), '%g00');
assert.sameValue(unescape('%G00'), '%G00');

assert.sameValue(unescape('%0u0'), '%0u0');
assert.sameValue(unescape('%0U0'), '%0U0');
assert.sameValue(unescape('%u00'), '%u00');
assert.sameValue(unescape('%U00'), '%U00');
