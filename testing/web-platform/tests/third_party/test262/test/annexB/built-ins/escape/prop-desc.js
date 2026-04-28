










assert.sameValue(typeof this.escape, "function");
assert.sameValue(typeof this["escape"], "function");

verifyProperty(this, "escape", {
  writable: true,
  enumerable: false,
  configurable: true
});
