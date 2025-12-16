










const calendar = "islamic-tbla";
const options = { overflow: "reject" };




const leapDay = Temporal.PlainDate.from({ year: 1445, monthCode: "M12", day: 30, calendar }, options);

TemporalHelpers.assertPlainDate(
  leapDay.with({ year: 1442 }, options),
  1442, 12, "M12", 30, "day not constrained when moving to another leap year",
  "ah", 1442);

TemporalHelpers.assertPlainDate(
  leapDay.with({ year: 1444 }),
  1444, 12, "M12", 29, "day constrained when moving to a common year",
  "ah", 1444);

assert.throws(RangeError, function () {
  leapDay.with({ year: 1444 }, options);
}, "reject when moving to a common year");

reportCompare(0, 0);
