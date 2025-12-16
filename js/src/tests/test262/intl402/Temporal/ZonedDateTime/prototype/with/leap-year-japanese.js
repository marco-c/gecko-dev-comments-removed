










const calendar = "japanese";
const options = { overflow: "reject" };

const leapDay = Temporal.ZonedDateTime.from({ year: 2016, monthCode: "M02", day: 29, hour: 12, minute: 34, timeZone: "UTC", calendar }, options);

TemporalHelpers.assertPlainDateTime(
  leapDay.with({ year: 2012 }, options).toPlainDateTime(),
  2012, 2, "M02", 29,  12, 34, 0, 0, 0, 0,"day not constrained when moving to another leap year",
  "heisei", 24);

TemporalHelpers.assertPlainDateTime(
  leapDay.with({ year: 2018 }).toPlainDateTime(),
  2018, 2, "M02", 28,  12, 34, 0, 0, 0, 0,"day constrained when moving to a common year",
  "heisei", 30);

assert.throws(RangeError, function () {
  leapDay.with({ year: 2018 }, options);
}, "reject when moving to a common year");

reportCompare(0, 0);
