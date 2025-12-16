









const calendar = "ethioaa";
const options = { overflow: "reject" };




const leapYear = 7463;
const commonYear = 7464;

for (var year of [leapYear, commonYear]) {
  for (var month = 1; month < 14; month++) {
    const date = Temporal.ZonedDateTime.from({
      year,
      month,
      day: 1,
      calendar, hour: 12, minute: 34, timeZone: "UTC"
    });
    if (month !== 13)
      assert.sameValue(date.daysInMonth, 30, `${date}`);
    else if (year == leapYear)
      assert.sameValue(date.daysInMonth, 6, `${date}`);
    else
      assert.sameValue(date.daysInMonth, 5, `${date}`);
  }
}


reportCompare(0, 0);
