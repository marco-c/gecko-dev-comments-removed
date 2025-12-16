










const calendar = "persian";

const cases = {
  year2000: {
    era: "ap",
    year: 1378,
    eraYear: 1378,
    month: 10,
    monthCode: "M10",
    day: 11,
    calendar
  },
  year1: {
    era: "ap",
    year: -621,
    eraYear: -621,
    month: 10,
    monthCode: "M10",
    day: 11,
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

  var afterWithYear = afterWithMonth.with({ year: 1420 });
  TemporalHelpers.assertPlainDate(afterWithYear,
    1420, 1, "M01", 1,  `${name} after setting year`, inCal.era, 1420);
}

reportCompare(0, 0);
