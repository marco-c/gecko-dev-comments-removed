











const options = { overflow: "reject" };
const instance = Temporal.PlainYearMonth.from({ year: 1981, monthCode: "M12", calendar: "gregory" }, options);

TemporalHelpers.assertPlainYearMonth(
  instance,
  1981, 12, "M12",
  "check that all fields are as expected",
   "ce",  1981
);

TemporalHelpers.assertPlainYearMonth(
  instance.with({ era: "bce", eraYear: 1 }, options),
  0, 12, "M12",
  "era and eraYear together exclude year",
  "bce", 1
);

TemporalHelpers.assertPlainYearMonth(
  instance.with({ year: -2 }, options),
  -2, 12, "M12",
  "year excludes era and eraYear",
  "bce", 3
);

TemporalHelpers.assertPlainYearMonth(
  instance.with({ month: 5 }, options),
  1981, 5, "M05",
  "month excludes monthCode",
  "ce", 1981
);

TemporalHelpers.assertPlainYearMonth(
  instance.with({ monthCode: "M05" }, options),
  1981, 5, "M05",
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
