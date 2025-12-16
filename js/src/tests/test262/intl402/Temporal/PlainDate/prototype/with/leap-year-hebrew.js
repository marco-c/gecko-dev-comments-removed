














const calendar = "hebrew";
const options = { overflow: "reject" };

const adarI = Temporal.PlainDate.from({ year: 5782, monthCode: "M05L", day: 30, calendar }, options);

TemporalHelpers.assertPlainDate(
  adarI.with({ year: 5783 }),
  5783, 6, "M06", 29, "Changing 30 Adar I to common year constrains to 29 Adar",
  "am", 5783);
assert.throws(RangeError, function () {
  adarI.with({ year: 5783 }, options);
}, "Changing 30 Adar I to common year rejects (either because the month or day would be constrained)");

reportCompare(0, 0);
