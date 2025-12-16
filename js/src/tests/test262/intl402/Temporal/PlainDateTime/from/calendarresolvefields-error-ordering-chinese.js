













assert.throws(
  TypeError,
  () => Temporal.PlainDateTime.from({ calendar: "chinese", monthCode: "M05", month: 6, day: 1, hour: 12 }),
  "Missing year throws TypeError before month/monthCode conflict throws RangeError"
);


assert.throws(
  TypeError,
  () => Temporal.PlainDateTime.from({ calendar: "chinese", year: 2020, day: 32, hour: 12 }, { overflow: "reject" }),
  "Missing month throws TypeError before out-of-range day throws RangeError"
);


assert.throws(
  TypeError,
  () => Temporal.PlainDateTime.from({ calendar: "chinese", year: 2020, monthCode: "M05", month: 6, hour: 12 }),
  "Missing day throws TypeError before month/monthCode conflict throws RangeError"
);


assert.throws(
  TypeError,
  () => Temporal.PlainDateTime.from({ calendar: "chinese", year: undefined, monthCode: "M05", month: 6, day: 1, hour: 12 }),
  "undefined year throws TypeError before month/monthCode conflict throws RangeError"
);


assert.throws(
  RangeError,
  () => Temporal.PlainDateTime.from({ calendar: "chinese", year: 2020, monthCode: "M05", month: 12, day: 1, hour: 12 }),
  "month/monthCode conflict throws RangeError when all types are valid"
);

assert.throws(
  RangeError,
  () => Temporal.PlainDateTime.from({ calendar: "chinese", year: 2020, month: 1, day: 32, hour: 12 }, { overflow: "reject" }),
  "Out-of-range day throws RangeError when all types are valid"
);

reportCompare(0, 0);
