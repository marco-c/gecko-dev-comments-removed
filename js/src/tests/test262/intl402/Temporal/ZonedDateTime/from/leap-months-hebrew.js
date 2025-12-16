










const calendar = "hebrew";


TemporalHelpers.assertPlainDateTime(
  Temporal.ZonedDateTime.from({ year: 5779, month: 6, day: 1, hour: 12, minute: 34, timeZone: "UTC", calendar }).toPlainDateTime(),
  5779, 6, "M05L", 1, 12, 34, 0, 0, 0, 0,
  "Leap month resolved from month number",
  "am", 5779);
TemporalHelpers.assertPlainDateTime(
  Temporal.ZonedDateTime.from({ year: 5779, monthCode: "M05L", day: 1, hour: 12, minute: 34, timeZone: "UTC", calendar }).toPlainDateTime(),
  5779, 6, "M05L", 1, 12, 34, 0, 0, 0, 0,
  "Leap month resolved from month code",
  "am", 5779);


TemporalHelpers.assertPlainDateTime(
  Temporal.ZonedDateTime.from({ year: 5779, month: 7, day: 1, hour: 12, minute: 34, timeZone: "UTC", calendar }).toPlainDateTime(),
  5779, 7, "M06", 1, 12, 34, 0, 0, 0, 0,
  "Month after leap month resolved from month number",
  "am", 5779);
TemporalHelpers.assertPlainDateTime(
  Temporal.ZonedDateTime.from({ year: 5779, monthCode: "M06", day: 1, hour: 12, minute: 34, timeZone: "UTC", calendar }).toPlainDateTime(),
  5779, 7, "M06", 1, 12, 34, 0, 0, 0, 0,
  "Month after leap month resolved from month code",
  "am", 5779);

reportCompare(0, 0);
