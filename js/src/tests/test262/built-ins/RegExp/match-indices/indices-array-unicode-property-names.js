










assert.compareArray([1, 2], /(?<π>a)/u.exec("bab").indices.groups.π);
assert.compareArray([1, 2], /(?<\u{03C0}>a)/u.exec("bab").indices.groups.π);
assert.compareArray([1, 2], /(?<π>a)/u.exec("bab").indices.groups.\u03C0);
assert.compareArray([1, 2], /(?<\u{03C0}>a)/u.exec("bab").indices.groups.\u03C0);
assert.compareArray([1, 2], /(?<$>a)/u.exec("bab").indices.groups.$);
assert.compareArray([1, 2], /(?<_>a)/u.exec("bab").indices.groups._);
assert.compareArray([1, 2], /(?<$𐒤>a)/u.exec("bab").indices.groups.$𐒤);
assert.compareArray([1, 2], /(?<_\u200C>a)/u.exec("bab").indices.groups._\u200C);
assert.compareArray([1, 2], /(?<_\u200D>a)/u.exec("bab").indices.groups._\u200D);
assert.compareArray([1, 2], /(?<ಠ_ಠ>a)/u.exec("bab").indices.groups.ಠ_ಠ);

reportCompare(0, 0);
