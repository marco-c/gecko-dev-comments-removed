










const calendar = "buddhist";

const cases = {
  year2000: {
    era: "be",
    eraYear: 2543,
    year: 2543,
    month: 1,
    monthCode: "M01",
    calendar
  }
};
for (var [name, result] of Object.entries(cases)) {
  const inCal = Temporal.PlainYearMonth.from(result);

  var afterWithMonth = inCal.with({ month: 1 });
  TemporalHelpers.assertPlainYearMonth(afterWithMonth,
    inCal.year, 1, "M01", `${name} after setting month`, inCal.era, inCal.eraYear);

  var afterWithYear = afterWithMonth.with({ year: 2220 });
  TemporalHelpers.assertPlainYearMonth(afterWithYear,
    2220, 1, "M01", `${name} after setting year`, inCal.era, 2220);
}

reportCompare(0, 0);
