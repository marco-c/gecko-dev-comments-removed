











const options = { overflow: "reject" };
const instance = Temporal.ZonedDateTime.from({ year: 2018, monthCode: "M12", day: 15, hour: 12, minute: 34, timeZone: "UTC", calendar: "ethiopic" }, options);

TemporalHelpers.assertPlainDateTime(
  instance.toPlainDateTime(),
  2018, 12, "M12", 15, 12, 34, 0, 0, 0, 0,
  "check that all fields are as expected",
   "am",  2018
);

TemporalHelpers.assertPlainDateTime(
  instance.with({ era: "aa", eraYear: 5500 }, options).toPlainDateTime(),
  0, 12, "M12", 15, 12, 34, 0, 0, 0, 0,
  "era and eraYear together exclude year",
  "aa", 5500
);

TemporalHelpers.assertPlainDateTime(
  instance.with({ year: -2 }, options).toPlainDateTime(),
  -2, 12, "M12", 15, 12, 34, 0, 0, 0, 0,
  "year excludes era and eraYear",
  "aa", 5498
);

TemporalHelpers.assertPlainDateTime(
  instance.with({ month: 5 }, options).toPlainDateTime(),
  2018, 5, "M05", 15, 12, 34, 0, 0, 0, 0,
  "month excludes monthCode",
  "am", 2018
);

TemporalHelpers.assertPlainDateTime(
  instance.with({ monthCode: "M05" }, options).toPlainDateTime(),
  2018, 5, "M05", 15, 12, 34, 0, 0, 0, 0,
  "monthCode excludes month",
  "am", 2018
);

assert.throws(
  TypeError,
  () => instance.with({ eraYear: 1 }),
  "eraYear excludes year and era, and cannot be provided without era",
);

assert.throws(
  TypeError,
  () => instance.with({ era: "aa" }),
  "era excludes year and eraYear, and cannot be provided without eraYear",
);

reportCompare(0, 0);
