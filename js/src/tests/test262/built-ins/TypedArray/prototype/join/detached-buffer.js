




















let obj = {
  toString() {
    throw new Test262Error();
  }
};

testWithTypedArrayConstructors(function(TA) {
  let sample = new TA(1);
  $DETACHBUFFER(sample.buffer);
  assert.throws(TypeError, () => {
    sample.join(obj);
  });
});

reportCompare(0, 0);
