









const calendar = "roc";
const options = { overflow: "reject" };



for (var year = 59; year < 139; year++) {
    const date = Temporal.PlainYearMonth.from({
        year,
        month: 1,
        calendar
    });

    assert.sameValue(date.monthsInYear, 12);
}

reportCompare(0, 0);
