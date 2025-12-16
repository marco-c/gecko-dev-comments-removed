












const plainYearMonth = Temporal.PlainYearMonth.from({ calendar: "japanese", year: 2020, month: 5 });


assert.throws(
  TypeError,
  () => plainYearMonth.with({ era: "heisei", monthCode: "M05", month: 6 }),
  "Missing eraYear throws TypeError before month/monthCode conflict throws RangeError"
);


assert.throws(
  TypeError,
  () => plainYearMonth.with({ era: "heisei", eraYear: undefined, monthCode: "M05", month: 6 }),
  "undefined eraYear throws TypeError before month/monthCode conflict throws RangeError"
);


assert.throws(
  RangeError,
  () => plainYearMonth.with({ monthCode: "M05", month: 6 }),
  "month/monthCode conflict throws RangeError when all types are valid"
);

assert.throws(
  RangeError,
  () => plainYearMonth.with({ month: 13 }, { overflow: "reject" }),
  "Out-of-range month throws RangeError when all types are valid"
);

reportCompare(0, 0);
