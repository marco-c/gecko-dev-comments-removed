











const options = { overflow: "reject" };
const instance = Temporal.PlainDate.from({ year: 1981, monthCode: "M12", day: 15, calendar: "gregory" }, options);

TemporalHelpers.assertPlainDate(
  instance,
  1981, 12, "M12", 15,
  "check that all fields are as expected",
   "ce",  1981
);

TemporalHelpers.assertPlainDate(
  instance.with({ era: "bce", eraYear: 1 }, options),
  0, 12, "M12", 15,
  "era and eraYear together exclude year",
  "bce", 1
);

TemporalHelpers.assertPlainDate(
  instance.with({ year: -2 }, options),
  -2, 12, "M12", 15,
  "year excludes era and eraYear",
  "bce", 3
);

TemporalHelpers.assertPlainDate(
  instance.with({ month: 5 }, options),
  1981, 5, "M05", 15,
  "month excludes monthCode",
  "ce", 1981
);

TemporalHelpers.assertPlainDate(
  instance.with({ monthCode: "M05" }, options),
  1981, 5, "M05", 15,
  "monthCode excludes month",
  "ce", 1981
);

assert.throws(
  TypeError,
  () => instance.with({ eraYear: 1 }),
  "eraYear excludes year and era, and cannot be provided without era",
);

assert.throws(
  TypeError,
  () => instance.with({ era: "bce" }),
  "era excludes year and eraYear, and cannot be provided without eraYear",
);

reportCompare(0, 0);
