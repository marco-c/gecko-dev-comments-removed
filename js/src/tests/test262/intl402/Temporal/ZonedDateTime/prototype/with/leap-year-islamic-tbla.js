










const calendar = "islamic-tbla";
const options = { overflow: "reject" };




const leapDay = Temporal.ZonedDateTime.from({ year: 1445, monthCode: "M12", day: 30, hour: 12, minute: 34, timeZone: "UTC", calendar }, options);

TemporalHelpers.assertPlainDateTime(
  leapDay.with({ year: 1442 }, options).toPlainDateTime(),
  1442, 12, "M12", 30, 12, 34, 0, 0, 0, 0, "day not constrained when moving to another leap year",
  "ah", 1442);

TemporalHelpers.assertPlainDateTime(
  leapDay.with({ year: 1444 }).toPlainDateTime(),
  1444, 12, "M12", 29, 12, 34, 0, 0, 0, 0, "day constrained when moving to a common year",
  "ah", 1444);

assert.throws(RangeError, function () {
  leapDay.with({ year: 1444 }, options);
}, "reject when moving to a common year");

reportCompare(0, 0);
