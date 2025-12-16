











const options = { overflow: "reject" };
const instance = Temporal.PlainDate.from({ year: 7518, monthCode: "M12", day: 15, calendar: "ethioaa" }, options);

TemporalHelpers.assertPlainDate(
  instance,
  7518, 12, "M12", 15,
  "check that all fields are as expected",
   "aa",  7518
);

TemporalHelpers.assertPlainDate(
  instance.with({ era: "aa", eraYear: 7515 }, options),
  7515, 12, "M12", 15,
  "era and eraYear together exclude year",
  "aa", 7515
);

TemporalHelpers.assertPlainDate(
  instance.with({ year: 7510 }, options),
  7510, 12, "M12", 15,
  "year excludes era and eraYear",
  "aa", 7510
);

TemporalHelpers.assertPlainDate(
  instance.with({ month: 5 }, options),
  7518, 5, "M05", 15,
  "month excludes monthCode",
  "aa", 7518
);

TemporalHelpers.assertPlainDate(
  instance.with({ monthCode: "M05" }, options),
  7518, 5, "M05", 15,
  "monthCode excludes month",
  "aa", 7518
);

assert.throws(
  TypeError,
  () => instance.with({ eraYear: 7512 }),
  "eraYear excludes year and era, and cannot be provided without era",
);

assert.throws(
  TypeError,
  () => instance.with({ era: "aa" }),
  "era excludes year and eraYear, and cannot be provided without eraYear",
);

reportCompare(0, 0);
