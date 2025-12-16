













assert.throws(
  TypeError,
  () => Temporal.PlainMonthDay.from({ calendar: "islamic-civil", monthCode: "M04", month: 5, day: 1 }),
  "Missing year throws TypeError before month/monthCode conflict throws RangeError"
);


assert.throws(
  TypeError,
  () => Temporal.PlainMonthDay.from({ calendar: "islamic-civil", year: 1445, day: 32 }, { overflow: "reject" }),
  "Missing monthCode/month throws TypeError before out-of-range day throws RangeError"
);


assert.throws(
  TypeError,
  () => Temporal.PlainMonthDay.from({ calendar: "islamic-civil", year: 1445, monthCode: "M04", month: 5 }),
  "Missing day throws TypeError before month/monthCode conflict throws RangeError"
);


assert.throws(
  TypeError,
  () => Temporal.PlainMonthDay.from({ calendar: "islamic-civil", year: undefined, monthCode: "M04", month: 5, day: 1 }),
  "undefined year throws TypeError before month/monthCode conflict throws RangeError"
);


assert.throws(
  RangeError,
  () => Temporal.PlainMonthDay.from({ calendar: "islamic-civil", year: 1445, monthCode: "M04", month: 5, day: 1 }),
  "month/monthCode conflict throws RangeError when all required fields present"
);

assert.throws(
  RangeError,
  () => Temporal.PlainMonthDay.from({ calendar: "islamic-civil", year: 1445, monthCode: "M01", day: 32 }, { overflow: "reject" }),
  "Out-of-range day throws RangeError when all required fields present"
);

reportCompare(0, 0);
