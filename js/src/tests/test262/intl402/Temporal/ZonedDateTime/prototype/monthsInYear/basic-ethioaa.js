









const calendar = "ethioaa";
const options = { overflow: "reject" };



for (var year = 7462; year < 7542; year++) {
    const date = Temporal.ZonedDateTime.from({
        year,
        month: 1,
        calendar, day: 1, hour: 12, minute: 34, timeZone: "UTC"
    });

    assert.sameValue(date.monthsInYear, 13);
}

reportCompare(0, 0);
