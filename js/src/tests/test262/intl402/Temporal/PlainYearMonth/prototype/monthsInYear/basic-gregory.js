









const calendar = "gregory";
const options = { overflow: "reject" };

for (var year = 1970; year < 1975; year++) {
    const date = Temporal.PlainYearMonth.from({
        year,
        month: 1,
        calendar
    });

    assert.sameValue(date.monthsInYear, 12);
}

reportCompare(0, 0);
