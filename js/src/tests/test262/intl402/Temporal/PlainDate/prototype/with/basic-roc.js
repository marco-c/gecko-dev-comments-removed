










const calendar = "roc";

const cases = {
  year2000: {
    era: "roc",
    year: 89,
    eraYear: 89,
    month: 1,
    monthCode: "M01",
    day: 1,
    calendar
  },
};
for (var [name, result] of Object.entries(cases)) {
  const inCal = Temporal.PlainDate.from(result);

  var afterWithDay = inCal.with({ day: 1 });
  TemporalHelpers.assertPlainDate(afterWithDay,
    inCal.year, inCal.month, inCal.monthCode, 1,  `${name} after setting day`, inCal.era, inCal.eraYear);

  var afterWithMonth = afterWithDay.with({ month: 1 });
  TemporalHelpers.assertPlainDate(afterWithMonth,
    inCal.year, 1, "M01", 1,  `${name} after setting month`, inCal.era, inCal.eraYear);

  var afterWithYear = afterWithMonth.with({ year: 130 });
  TemporalHelpers.assertPlainDate(afterWithYear,
    130, 1, "M01", 1,  `${name} after setting year`, inCal.era, 130);
}

reportCompare(0, 0);
