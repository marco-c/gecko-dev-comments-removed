











const options = { overflow: "reject" };
const instance = Temporal.ZonedDateTime.from({ year: 114, monthCode: "M12", day: 15, hour: 12, minute: 34, timeZone: "UTC", calendar: "roc" }, options);

TemporalHelpers.assertPlainDateTime(
  instance.toPlainDateTime(),
  114, 12, "M12", 15, 12, 34, 0, 0, 0, 0,
  "check that all fields are as expected",
   "roc",  114
);

TemporalHelpers.assertPlainDateTime(
  instance.with({ era: "broc", eraYear: 1 }, options).toPlainDateTime(),
  0, 12, "M12", 15, 12, 34, 0, 0, 0, 0,
  "era and eraYear together exclude year",
  "broc", 1
);

TemporalHelpers.assertPlainDateTime(
  instance.with({ year: -2 }, options).toPlainDateTime(),
  -2, 12, "M12", 15, 12, 34, 0, 0, 0, 0,
  "year excludes era and eraYear",
  "broc", 3
);

TemporalHelpers.assertPlainDateTime(
  instance.with({ month: 5 }, options).toPlainDateTime(),
  114, 5, "M05", 15, 12, 34, 0, 0, 0, 0,
  "month excludes monthCode",
  "roc", 114
);

TemporalHelpers.assertPlainDateTime(
  instance.with({ monthCode: "M05" }, options).toPlainDateTime(),
  114, 5, "M05", 15, 12, 34, 0, 0, 0, 0,
  "monthCode excludes month",
  "roc", 114
);

assert.throws(
  TypeError,
  () => instance.with({ eraYear: 1 }),
  "eraYear excludes year and era, and cannot be provided without era",
);

assert.throws(
  TypeError,
  () => instance.with({ era: "broc" }),
  "era excludes year and eraYear, and cannot be provided without eraYear",
);

reportCompare(0, 0);
