









const calendar = "roc";
const options = { overflow: "reject" };



for (var year = 59; year < 139; year++) {
    const date = Temporal.ZonedDateTime.from({
        year,
        month: 1,
        calendar, day: 1, hour: 12, minute: 34, timeZone: "UTC"
    });

    assert.sameValue(date.monthsInYear, 12);
}

reportCompare(0, 0);
