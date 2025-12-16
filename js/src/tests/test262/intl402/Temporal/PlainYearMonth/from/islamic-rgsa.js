









const calendar = "islamic-rgsa";

assert.throws(RangeError, () =>
  Temporal.PlainYearMonth.from({year: 1500, month: 1, calendar}),
  "fallback for calendar ID 'islamic-rgsa' only supported in Intl.DateTimeFormat constructor, not Temporal"
);

reportCompare(0, 0);
