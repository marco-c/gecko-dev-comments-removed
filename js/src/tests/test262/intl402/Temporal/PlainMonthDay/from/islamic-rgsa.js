









const calendar = "islamic-rgsa";

assert.throws(RangeError, () =>
  Temporal.PlainMonthDay.from({month: 1, day: 1, calendar}),
  "fallback for calendar ID 'islamic-rgsa' only supported in Intl.DateTimeFormat constructor, not Temporal"
);

reportCompare(0, 0);
