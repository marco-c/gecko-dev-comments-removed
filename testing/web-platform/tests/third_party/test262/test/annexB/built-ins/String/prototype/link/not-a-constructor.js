





















assert.sameValue(
  isConstructor(String.prototype.link),
  false,
  'isConstructor(String.prototype.link) must return false'
);

assert.throws(TypeError, () => {
  new String.prototype.link();
});

