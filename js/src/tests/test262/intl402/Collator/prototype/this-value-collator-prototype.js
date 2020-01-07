











assert.throws(TypeError, () => Intl.Collator.prototype.compare("aаあ아", "aаあ아"),
              "Intl.Collator.prototype is not an object that has been initialized as an Intl.Collator.");

reportCompare(0, 0);
