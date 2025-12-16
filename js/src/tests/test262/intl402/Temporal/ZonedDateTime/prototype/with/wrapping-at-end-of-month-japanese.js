









const calendar = "japanese";
const options = { overflow: "reject" };
const year = 1970;

for (var month = 1; month < 13; month++) {
  const date = Temporal.ZonedDateTime.from({
    year,
    month,
    day: 1,
    calendar, hour: 12, minute: 34, timeZone: "UTC"
  });
  const daysInMonth = date.daysInMonth;

  const oneDayPastMonthEnd = date.with({ day: daysInMonth + 1 });
  assert.sameValue(oneDayPastMonthEnd.day, daysInMonth);
  assert.throws(RangeError, () => date.with({ day: daysInMonth + 1 }, options));
}


reportCompare(0, 0);
