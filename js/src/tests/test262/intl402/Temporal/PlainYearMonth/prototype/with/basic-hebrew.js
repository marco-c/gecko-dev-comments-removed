










const calendar = "hebrew";

const cases = {
  year2000: {
    year: 5760,
    eraYear: 5760,
    era: "am",
    month: 4,
    monthCode: "M04",
    calendar
  },
  year1: {
    year: 3761,
    eraYear: 3761,
    era: "am",
    month: 4,
    monthCode: "M04",
    calendar
  }
};
for (var [name, result] of Object.entries(cases)) {
  const inCal = Temporal.PlainYearMonth.from(result);

  var afterWithMonth = inCal.with({ month: 1 });
  TemporalHelpers.assertPlainYearMonth(afterWithMonth,
    inCal.year, 1, "M01", `${name} after setting month`, inCal.era, inCal.eraYear, null);

  var afterWithYear = afterWithMonth.with({ year: 5860 });
  TemporalHelpers.assertPlainYearMonth(afterWithYear,
    5860, 1, "M01", `${name} after setting year`, inCal.era, 5860, null);
}

reportCompare(0, 0);
