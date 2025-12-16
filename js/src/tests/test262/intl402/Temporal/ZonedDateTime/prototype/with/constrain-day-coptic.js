












const calendar = "coptic";
const options = { overflow: "reject" };




const common1230 = Temporal.ZonedDateTime.from({ year: 1738, monthCode: "M12", day: 30, hour: 12, minute: 34, timeZone: "UTC", calendar }, options);
const leap1230 = Temporal.ZonedDateTime.from({ year: 1739, monthCode: "M12", day: 30, hour: 12, minute: 34, timeZone: "UTC", calendar }, options);

TemporalHelpers.assertPlainDateTime(
  common1230.with({ monthCode: "M13" }).toPlainDateTime(),
  1738, 13, "M13", 5, 12, 34, 0, 0, 0, 0, "Changing month constrains to day 5 of common-year epagomenal month",
  "am", 1738);
assert.throws(RangeError, function () {
  common1230.with({ monthCode: "M13" }, options);
}, "Changing month to common-year epagomenal month rejects");

TemporalHelpers.assertPlainDateTime(
  leap1230.with({ monthCode: "M13" }).toPlainDateTime(),
  1739, 13, "M13", 6, 12, 34, 0, 0, 0, 0, "Changing month constrains to day 6 of leap-year epagomenal month",
  "am", 1739);
assert.throws(RangeError, function () {
  leap1230.with({ monthCode: "M13" }, options);
}, "Changing month to leap-year epagomenal month rejects");

reportCompare(0, 0);
