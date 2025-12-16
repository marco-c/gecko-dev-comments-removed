












const calendar = "coptic";
const options = { overflow: "reject" };




const common1230 = Temporal.PlainDate.from({ year: 1738, monthCode: "M12", day: 30, calendar }, options);
const leap1230 = Temporal.PlainDate.from({ year: 1739, monthCode: "M12", day: 30, calendar }, options);

TemporalHelpers.assertPlainDate(
  common1230.with({ monthCode: "M13" }),
  1738, 13, "M13", 5, "Changing month constrains to day 5 of common-year epagomenal month",
  "am", 1738);
assert.throws(RangeError, function () {
  common1230.with({ monthCode: "M13" }, options);
}, "Changing month to common-year epagomenal month rejects");

TemporalHelpers.assertPlainDate(
  leap1230.with({ monthCode: "M13" }),
  1739, 13, "M13", 6, "Changing month constrains to day 6 of leap-year epagomenal month",
  "am", 1739);
assert.throws(RangeError, function () {
  leap1230.with({ monthCode: "M13" }, options);
}, "Changing month to leap-year epagomenal month rejects");

reportCompare(0, 0);
