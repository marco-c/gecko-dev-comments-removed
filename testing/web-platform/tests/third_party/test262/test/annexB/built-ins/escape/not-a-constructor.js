





















assert.sameValue(isConstructor(escape), false, 'isConstructor(escape) must return false');

assert.throws(TypeError, () => {
  new escape('');
});

