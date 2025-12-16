










const calendar = "buddhist";

const cases = {
  year2000: {
    era: "be",
    eraYear: 2543,
    year: 2543,
    month: 1,
    monthCode: "M01",
    day: 1, hour: 12, minute: 34, timeZone: "UTC",
    calendar
  }
};
for (var [name, result] of Object.entries(cases)) {
  const inCal = Temporal.ZonedDateTime.from(result);

  var afterWithDay = inCal.with({ day: 1 });
  TemporalHelpers.assertPlainDateTime(afterWithDay.toPlainDateTime(),
    inCal.year, inCal.month, inCal.monthCode, 1,  12, 34, 0, 0, 0, 0, `${name} after setting day`, inCal.era, inCal.eraYear);

  var afterWithMonth = afterWithDay.with({ month: 1 });
  TemporalHelpers.assertPlainDateTime(afterWithMonth.toPlainDateTime(),
    inCal.year, 1, "M01", 1,  12, 34, 0, 0, 0, 0, `${name} after setting month`, inCal.era, inCal.eraYear);

  var afterWithYear = afterWithMonth.with({ year: 2220 });
  TemporalHelpers.assertPlainDateTime(afterWithYear.toPlainDateTime(),
    2220, 1, "M01", 1,  12, 34, 0, 0, 0, 0, `${name} after setting year`, inCal.era, 2220);
}

reportCompare(0, 0);
