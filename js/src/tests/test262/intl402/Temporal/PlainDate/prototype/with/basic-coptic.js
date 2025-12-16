










const calendar = "coptic";

const cases = {
  year2000: {
    era: "am",
    eraYear: 1716,
    year: 1716,
    month: 4,
    monthCode: "M04",
    day: 22,
    calendar
  },
  year1: {
    era: "am",
    eraYear: -283,
    year: -283,
    month: 5,
    monthCode: "M05",
    day: 8,
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

  var afterWithYear = afterWithMonth.with({ year: 1917 });
  TemporalHelpers.assertPlainDate(afterWithYear,
    1917, 1, "M01", 1,  `${name} after setting year`, inCal.era, 1917);
}

reportCompare(0, 0);
