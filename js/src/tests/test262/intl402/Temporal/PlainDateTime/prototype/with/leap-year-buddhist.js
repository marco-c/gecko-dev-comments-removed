










const calendar = "buddhist";
const options = { overflow: "reject" };

const leapDay = Temporal.PlainDateTime.from({ year: 2559, monthCode: "M02", day: 29, hour: 12, minute: 34, calendar }, options);

TemporalHelpers.assertPlainDateTime(
  leapDay.with({ year: 2555 }, options),
  2555, 2, "M02", 29,  12, 34, 0, 0, 0, 0,"day not constrained when moving to another leap year",
  "be", 2555);

TemporalHelpers.assertPlainDateTime(
  leapDay.with({ year: 2561 }),
  2561, 2, "M02", 28,  12, 34, 0, 0, 0, 0,"day constrained when moving to a common year",
  "be", 2561);

assert.throws(RangeError, function () {
  leapDay.with({ year: 2561 }, options);
}, "reject when moving to a common year");

reportCompare(0, 0);
