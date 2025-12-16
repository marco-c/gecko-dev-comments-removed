









const calendar = "hebrew";

const commonYearMonthCodes = ["M01", "M02", "M03", "M04", "M05", "M06", "M07", "M08", "M09", "M10", "M11", "M12"];
const leapYearMonthCodes = ["M01", "M02", "M03", "M04", "M05", "M05L", "M06", "M07", "M08", "M09", "M10", "M11", "M12"];

for (var year = 5730; year < 5735; year++) {
  const monthsInYear = Temporal.ZonedDateTime.from({
    year,
    month: 1,
    calendar, day: 1, hour: 12, minute: 34, timeZone: "UTC"
  }).monthsInYear;
  for (var month = 1; month < monthsInYear; month++) {
    const date = Temporal.ZonedDateTime.from({
        year,
        month,
        calendar, day: 1, hour: 12, minute: 34, timeZone: "UTC"
    });
    if (date.inLeapYear)
      assert.sameValue(date.monthCode, leapYearMonthCodes[month - 1]);
    else
      assert.sameValue(date.monthCode, commonYearMonthCodes[month - 1]);
  }
}

reportCompare(0, 0);
