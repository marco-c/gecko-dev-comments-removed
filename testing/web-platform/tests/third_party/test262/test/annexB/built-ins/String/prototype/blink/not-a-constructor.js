





















assert.sameValue(
  isConstructor(String.prototype.blink),
  false,
  'isConstructor(String.prototype.blink) must return false'
);

assert.throws(TypeError, () => {
  new String.prototype.blink();
});

