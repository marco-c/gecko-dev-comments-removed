









const calendar = "persian";
const options = { overflow: "reject" };



for (var year = 1348; year < 1428; year++) {
    const date = Temporal.PlainYearMonth.from({
        year,
        month: 1,
        calendar
    });

    assert.sameValue(date.monthsInYear, 12);
}

reportCompare(0, 0);
