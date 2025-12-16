











const options = { overflow: "reject" };
const lastDayOfShowa = Temporal.PlainYearMonth.from({ era: "showa", eraYear: 64, year: 1989, month: 1, monthCode: "M01", calendar: "japanese" }, options);

TemporalHelpers.assertPlainYearMonth(
  lastDayOfShowa,
  1989, 1, "M01",
  "check expected fields",
   "showa",  64
);

TemporalHelpers.assertPlainYearMonth(
  lastDayOfShowa.with({ month: 2 }, options),
  1989, 2, "M02",
  "month excludes monthCode, era, and eraYear",
  "heisei", 1
);

TemporalHelpers.assertPlainYearMonth(
  lastDayOfShowa.with({ monthCode: "M03" }, options),
  1989, 3, "M03",
  "monthCode excludes month, era, and eraYear",
  "heisei", 1
);

TemporalHelpers.assertPlainYearMonth(
  lastDayOfShowa.with({ year: 1988 }, options),
  1988, 1, "M01",
  "year excludes era and eraYear (within same era)",
  "showa", 63
);

TemporalHelpers.assertPlainYearMonth(
  lastDayOfShowa.with({ year: 1990 }, options),
  1990, 1, "M01",
  "year excludes era and eraYear (in a different era)",
  "heisei", 2
);

assert.throws(
  TypeError,
  () => lastDayOfShowa.with({ eraYear: 1 }),
  "eraYear excludes year and era, and cannot be provided without era",
);

assert.throws(
  TypeError,
  () => lastDayOfShowa.with({ era: "heisei" }),
  "era excludes year and eraYear, and cannot be provided without eraYear",
);

reportCompare(0, 0);
