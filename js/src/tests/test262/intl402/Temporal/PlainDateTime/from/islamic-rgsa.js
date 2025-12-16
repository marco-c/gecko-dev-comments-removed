









const calendar = "islamic-rgsa";

assert.throws(RangeError, () =>
  Temporal.PlainDateTime.from({year: 1500, month: 1, day: 1, hour: 12, minute: 34, calendar}),
  "fallback for calendar ID 'islamic-rgsa' only supported in Intl.DateTimeFormat constructor, not Temporal"
);

reportCompare(0, 0);
