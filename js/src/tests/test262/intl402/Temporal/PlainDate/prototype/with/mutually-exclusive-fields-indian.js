











const options = { overflow: "reject" };
const instance = Temporal.PlainDate.from({ year: 1947, monthCode: "M12", day: 15, calendar: "indian" }, options);

TemporalHelpers.assertPlainDate(
  instance,
  1947, 12, "M12", 15,
  "check that all fields are as expected",
   "shaka",  1947
);

TemporalHelpers.assertPlainDate(
  instance.with({ era: "shaka", eraYear: 1940 }, options),
  1940, 12, "M12", 15,
  "era and eraYear together exclude year",
  "shaka", 1940
);

TemporalHelpers.assertPlainDate(
  instance.with({ year: 1943 }, options),
  1943, 12, "M12", 15,
  "year excludes era and eraYear",
  "shaka", 1943
);

TemporalHelpers.assertPlainDate(
  instance.with({ month: 5 }, options),
  1947, 5, "M05", 15,
  "month excludes monthCode",
  "shaka", 1947
);

TemporalHelpers.assertPlainDate(
  instance.with({ monthCode: "M05" }, options),
  1947, 5, "M05", 15,
  "monthCode excludes month",
  "shaka", 1947
);

assert.throws(
  TypeError,
  () => instance.with({ eraYear: 1940 }),
  "eraYear excludes year and era, and cannot be provided without era",
);

assert.throws(
  TypeError,
  () => instance.with({ era: "shaka" }),
  "era excludes year and eraYear, and cannot be provided without eraYear",
);

reportCompare(0, 0);
