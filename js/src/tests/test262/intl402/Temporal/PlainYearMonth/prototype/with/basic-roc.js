










const calendar = "roc";

const cases = {
  year2000: {
    era: "roc",
    year: 89,
    eraYear: 89,
    month: 1,
    monthCode: "M01",
    calendar
  },
};
for (var [name, result] of Object.entries(cases)) {
  const inCal = Temporal.PlainYearMonth.from(result);

  var afterWithMonth = inCal.with({ month: 1 });
  TemporalHelpers.assertPlainYearMonth(afterWithMonth,
    inCal.year, 1, "M01", `${name} after setting month`, inCal.era, inCal.eraYear);

  var afterWithYear = afterWithMonth.with({ year: 130 });
  TemporalHelpers.assertPlainYearMonth(afterWithYear,
    130, 1, "M01", `${name} after setting year`, inCal.era, 130);
}

reportCompare(0, 0);
