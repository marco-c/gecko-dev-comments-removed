










const calendar = "ethiopic";

const cases = {
  year2000: {
    era: "am",
    eraYear: 1992,
    month: 4,
    monthCode: "M04",
    day: 22,
    calendar
  }
};
for (var [name, result] of Object.entries(cases)) {
  const inCal = Temporal.PlainDate.from(result);

  var afterWithDay = inCal.with({ day: 1 });
  TemporalHelpers.assertPlainDate(afterWithDay,
    inCal.year, inCal.month, inCal.monthCode, 1,  `${name} after setting day`, inCal.era, inCal.eraYear);

  var afterWithMonth = afterWithDay.with({ month: 1 });
  TemporalHelpers.assertPlainDate(afterWithMonth,
    inCal.year, 1, "M01", 1,  `${name} after setting month`, inCal.era, inCal.eraYear);

  var afterWithYear = afterWithMonth.with({ year: 2220 });
  TemporalHelpers.assertPlainDate(afterWithYear,
    2220, 1, "M01", 1,  `${name} after setting year`, inCal.era, 2220);
}

reportCompare(0, 0);
