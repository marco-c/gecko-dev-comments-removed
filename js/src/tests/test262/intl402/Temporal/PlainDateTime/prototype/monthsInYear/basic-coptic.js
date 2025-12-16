









const calendar = "coptic";
const options = { overflow: "reject" };



for (var year = 1686; year < 1766; year++) {
    const date = Temporal.PlainDateTime.from({
        year,
        month: 1,
        calendar, day: 1, hour: 12, minute: 34
    });

    assert.sameValue(date.monthsInYear, 13);
}

reportCompare(0, 0);
