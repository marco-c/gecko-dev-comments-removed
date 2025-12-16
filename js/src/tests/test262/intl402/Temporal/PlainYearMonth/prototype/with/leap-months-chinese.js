










const calendar = "chinese";
const options = { overflow: "reject" };
const leapMonth = Temporal.PlainYearMonth.from({ year: 2017, monthCode: "M06L", calendar }, options);

TemporalHelpers.assertPlainYearMonth(
  leapMonth.with({ year: 2025 }, options),
  2025, 7, "M06L", "month not constrained when moving to another leap year with M06L",
  undefined, undefined, null);

TemporalHelpers.assertPlainYearMonth(
  leapMonth.with({ year: 2020 }),
  2020, 7, "M06", "month constrained when moving to another leap year without M06L",
  undefined, undefined, null);

assert.throws(RangeError, function () {
  leapMonth.with({ year: 2020 }, options);
}, "reject when moving to another leap year without M06L");

TemporalHelpers.assertPlainYearMonth(
  leapMonth.with({ year: 2024 }),
  2024, 6, "M06", "month constrained when moving to a common year",
  undefined, undefined, null);

assert.throws(RangeError, function () {
  leapMonth.with({ year: 2024 }, options);
}, "reject when moving to a common year");

reportCompare(0, 0);
