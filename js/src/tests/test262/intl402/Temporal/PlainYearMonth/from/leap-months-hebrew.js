










const calendar = "hebrew";


TemporalHelpers.assertPlainYearMonth(
  Temporal.PlainYearMonth.from({ year: 5779, month: 6, calendar }),
  5779, 6, "M05L",
  "Leap month resolved from month number",
  "am", 5779, null);
TemporalHelpers.assertPlainYearMonth(
  Temporal.PlainYearMonth.from({ year: 5779, monthCode: "M05L", calendar }),
  5779, 6, "M05L",
  "Leap month resolved from month code",
  "am", 5779, null);


TemporalHelpers.assertPlainYearMonth(
  Temporal.PlainYearMonth.from({ year: 5779, month: 7, calendar }),
  5779, 7, "M06",
  "Month after leap month resolved from month number",
  "am", 5779, null);
TemporalHelpers.assertPlainYearMonth(
  Temporal.PlainYearMonth.from({ year: 5779, monthCode: "M06", calendar }),
  5779, 7, "M06",
  "Month after leap month resolved from month code",
  "am", 5779, null);

reportCompare(0, 0);
