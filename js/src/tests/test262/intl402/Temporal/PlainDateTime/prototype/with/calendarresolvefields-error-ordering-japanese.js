












const plainDateTime = Temporal.PlainDateTime.from({ calendar: "japanese", year: 2020, month: 5, day: 15, hour: 12 });


assert.throws(
  TypeError,
  () => plainDateTime.with({ era: "heisei", monthCode: "M05", month: 6 }),
  "Missing eraYear throws TypeError before month/monthCode conflict throws RangeError"
);


assert.throws(
  TypeError,
  () => plainDateTime.with({ era: "heisei", day: 32 }),
  "Missing eraYear throws TypeError before out-of-range day throws RangeError"
);


assert.throws(
  TypeError,
  () => plainDateTime.with({ era: "heisei", eraYear: undefined, monthCode: "M05", month: 6 }),
  "undefined eraYear throws TypeError before month/monthCode conflict throws RangeError"
);


assert.throws(
  RangeError,
  () => plainDateTime.with({ monthCode: "M05", month: 6 }),
  "month/monthCode conflict throws RangeError when all types are valid"
);

assert.throws(
  RangeError,
  () => plainDateTime.with({ day: 32 }, { overflow: "reject" }),
  "Out-of-range day throws RangeError when all types are valid"
);

reportCompare(0, 0);
