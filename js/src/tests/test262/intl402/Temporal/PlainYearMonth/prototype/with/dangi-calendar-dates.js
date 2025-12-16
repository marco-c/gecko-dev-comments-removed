










const calendar = "dangi";

const cases = {
  year2000: {
    year: 1999,
    month: 11,
    monthCode: "M11",
    calendar
  },
  year1900: {
    year: 1899,
    month: 12,
    monthCode: "M12",
    calendar
  },
  year2050: {
    year: 2049,
    month: 11,
    calendar
  }
};
for (var [name, result] of Object.entries(cases)) {
  const inCal = Temporal.PlainYearMonth.from(result);

  var afterWithMonth = inCal.with({ month: 1 });
  TemporalHelpers.assertPlainYearMonth(afterWithMonth, inCal.year, 1, "M01", `${name} (after setting month)`,
    undefined, undefined, null);

  var afterWithYear = afterWithMonth.with({ year: 2025 });
  TemporalHelpers.assertPlainYearMonth(afterWithYear, 2025, 1, "M01", `${name} (after setting year)`,
    undefined, undefined, null);
}

reportCompare(0, 0);
