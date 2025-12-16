










const calendar = "roc";
const options = { overflow: "reject" };

const leapDay = Temporal.PlainDate.from({ year: 105, monthCode: "M02", day: 29, calendar }, options);

TemporalHelpers.assertPlainDate(
  leapDay.with({ year: 101 }, options),
  101, 2, "M02", 29, "day not constrained when moving to another leap year",
  "roc", 101);

TemporalHelpers.assertPlainDate(
  leapDay.with({ year: 107 }),
  107, 2, "M02", 28, "day constrained when moving to a common year",
  "roc", 107);

assert.throws(RangeError, function () {
  leapDay.with({ year: 107 }, options);
}, "reject when moving to a common year");

reportCompare(0, 0);
