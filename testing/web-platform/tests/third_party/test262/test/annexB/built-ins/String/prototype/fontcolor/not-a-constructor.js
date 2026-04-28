





















assert.sameValue(
  isConstructor(String.prototype.fontcolor),
  false,
  'isConstructor(String.prototype.fontcolor) must return false'
);

assert.throws(TypeError, () => {
  new String.prototype.fontcolor();
});

