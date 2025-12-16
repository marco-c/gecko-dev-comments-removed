









const calendar = "japanese";
const options = { overflow: "reject" };



for (var year = 1892; year < 1972; year++) {
    const date = Temporal.PlainYearMonth.from({
        year,
        month: 1,
        calendar
    });

    assert.sameValue(date.monthsInYear, 12);
}

reportCompare(0, 0);
