










const calendar = "ethiopic";
const options = { overflow: "reject" };

const leapDay = Temporal.PlainDate.from({ year: 2015, monthCode: "M13", day: 6, calendar }, options);

TemporalHelpers.assertPlainDate(
  leapDay.with({ year: 2016 }),
  2016, 13, "M13", 5, "Changing year on leap day to a common year constrains to day 5 of epagomenal month",
  "am", 2016);
assert.throws(RangeError, function () {
  leapDay.with({ year: 2016 }, options);
}, "Changing year on leap day to a common year rejects");

TemporalHelpers.assertPlainDate(
  leapDay.with({ year: 2011 }, options),
  2011, 13, "M13", 6, "Changing year on leap day to another leap year constrains to day 6 of epagomenal month",
  "am", 2011);

reportCompare(0, 0);
