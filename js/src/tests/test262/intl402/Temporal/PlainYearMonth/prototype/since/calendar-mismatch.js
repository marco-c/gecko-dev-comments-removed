









const plainYearMonth1 = new Temporal.PlainYearMonth(2000, 1, "gregory", 1);
const plainYearMonth2 = new Temporal.PlainYearMonth(2000, 1, "japanese", 1);
assert.throws(RangeError, () => plainYearMonth1.since(plainYearMonth2));

reportCompare(0, 0);
