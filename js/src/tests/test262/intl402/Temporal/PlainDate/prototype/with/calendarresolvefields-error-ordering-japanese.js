












const plainDate = Temporal.PlainDate.from({ calendar: "japanese", year: 2020, month: 5, day: 15 });


assert.throws(
  TypeError,
  () => plainDate.with({ era: "heisei", monthCode: "M05", month: 6 }),
  "Missing eraYear throws TypeError before month/monthCode conflict throws RangeError"
);


assert.throws(
  TypeError,
  () => plainDate.with({ era: "heisei", day: 32 }),
  "Missing eraYear throws TypeError before out-of-range day throws RangeError"
);


assert.throws(
  TypeError,
  () => plainDate.with({ era: "heisei", eraYear: undefined, monthCode: "M05", month: 6 }),
  "undefined eraYear throws TypeError before month/monthCode conflict throws RangeError"
);


assert.throws(
  RangeError,
  () => plainDate.with({ monthCode: "M05", month: 6 }),
  "month/monthCode conflict throws RangeError when all types are valid"
);

assert.throws(
  RangeError,
  () => plainDate.with({ day: 32 }, { overflow: "reject" }),
  "Out-of-range day throws RangeError when all types are valid"
);

reportCompare(0, 0);
