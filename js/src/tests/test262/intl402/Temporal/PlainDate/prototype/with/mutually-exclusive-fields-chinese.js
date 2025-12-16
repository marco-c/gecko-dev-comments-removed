











const options = { overflow: "reject" };
const instance = Temporal.PlainDate.from({ year: 1981, monthCode: "M12", day: 15, calendar: "chinese" }, options);

TemporalHelpers.assertPlainDate(
  instance,
  1981, 12, "M12", 15,
  "check that all fields are as expected"
);

TemporalHelpers.assertPlainDate(
  instance.with({ month: 5 }, options),
  1981, 5, "M05", 15,
  "month excludes monthCode"
);

TemporalHelpers.assertPlainDate(
  instance.with({ monthCode: "M05" }, options),
  1981, 5, "M05", 15,
  "monthCode excludes month"
);

assert.throws(
  TypeError,
  () => instance.with({ eraYear: 2025, era: "ce" }),
  "eraYear and era are invalid for this calendar",
);


reportCompare(0, 0);
