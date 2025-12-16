










const calendar = "hebrew";
const options = { overflow: "reject" };









TemporalHelpers.assertPlainDateTime(
  Temporal.ZonedDateTime.from({ year: 5781, monthCode: "M03", day: 30, hour: 12, minute: 34, timeZone: "UTC", calendar }).toPlainDateTime(),
  5781, 3, "M03", 29, 12, 34, 0, 0, 0, 0, "Kislev constrains to 29 in deficient year",
  "am", 5781);
assert.throws(RangeError, function () {
  Temporal.ZonedDateTime.from({ year: 5781, monthCode: "M03", day: 30, hour: 12, minute: 34, timeZone: "UTC", calendar }, options);
}, "Kislev rejects 30 in deficient year");

TemporalHelpers.assertPlainDateTime(
  Temporal.ZonedDateTime.from({ year: 5782, monthCode: "M02", day: 30, hour: 12, minute: 34, timeZone: "UTC", calendar }).toPlainDateTime(),
  5782, 2, "M02", 29, 12, 34, 0, 0, 0, 0, "Cheshvan constrains to 29 in regular year",
  "am", 5782);
assert.throws(RangeError, function () {
  Temporal.ZonedDateTime.from({ year: 5782, monthCode: "M02", day: 30, hour: 12, minute: 34, timeZone: "UTC", calendar }, options);
}, "Cheshvan rejects 30 in regular year");

TemporalHelpers.assertPlainDateTime(
  Temporal.ZonedDateTime.from({ year: 5781, monthCode: "M02", day: 30, hour: 12, minute: 34, timeZone: "UTC", calendar }).toPlainDateTime(),
  5781, 2, "M02", 29, 12, 34, 0, 0, 0, 0, "Cheshvan constrains to 29 in deficient year",
  "am", 5781);
assert.throws(RangeError, function () {
  Temporal.ZonedDateTime.from({ year: 5781, monthCode: "M02", day: 30, hour: 12, minute: 34, timeZone: "UTC", calendar }, options);
}, "Cheshvan rejects 30 in deficient year");

reportCompare(0, 0);
