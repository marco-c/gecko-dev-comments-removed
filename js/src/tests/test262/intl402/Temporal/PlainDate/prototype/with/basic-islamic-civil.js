










const calendar = "islamic-civil";

const cases = {
  year2000: {
    year: 1420,
    eraYear: 1420,
    era: "ah",
    month: 9,
    monthCode: "M09",
    day: 24,
    calendar
  },
  year1: {
    year: -640,
    eraYear: 641,
    era: "bh",
    month: 5,
    monthCode: "M05",
    day: 18,
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

  var afterWithYear = afterWithMonth.with({ year: 1700 });
  TemporalHelpers.assertPlainDate(afterWithYear,
    1700, 1, "M01", 1,  `${name} after setting year`, "ah", 1700);
}

reportCompare(0, 0);
