













assert.throws(
  TypeError,
  () => Temporal.PlainYearMonth.from({ calendar: "chinese", monthCode: "M05", month: 12 }),
  "Missing year throws TypeError before month/monthCode conflict throws RangeError"
);


assert.throws(
  TypeError,
  () => Temporal.PlainYearMonth.from({ calendar: "chinese", year: 2020 }),
  "Missing month/monthCode throws TypeError"
);


assert.throws(
  TypeError,
  () => Temporal.PlainYearMonth.from({ calendar: "chinese", year: undefined, monthCode: "M05", month: 12 }),
  "undefined year throws TypeError before month/monthCode conflict throws RangeError"
);


assert.throws(
  TypeError,
  () => Temporal.PlainYearMonth.from({ calendar: "chinese", year: 2020, month: undefined }),
  "undefined month throws TypeError"
);


assert.throws(
  TypeError,
  () => Temporal.PlainYearMonth.from({ calendar: "chinese", year: 2020, monthCode: undefined }),
  "undefined monthCode throws TypeError when month is missing"
);


assert.throws(
  RangeError,
  () => Temporal.PlainYearMonth.from({ calendar: "chinese", year: 2020, monthCode: "M05", month: 12 }),
  "month/monthCode conflict throws RangeError when all types are valid"
);

assert.throws(
  RangeError,
  () => Temporal.PlainYearMonth.from({ calendar: "chinese", year: 2020, month: 14 }, { overflow: "reject" }),
  "Out-of-range month throws RangeError when all types are valid"
);

reportCompare(0, 0);
