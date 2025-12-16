









const calendar = "islamic-umalqura";
const options = { overflow: "reject" };



for (var year = 1390; year < 1470; year++) {
    const date = Temporal.PlainYearMonth.from({
        year,
        month: 1,
        calendar
    });

    assert.sameValue(date.monthsInYear, 12);
}

reportCompare(0, 0);
