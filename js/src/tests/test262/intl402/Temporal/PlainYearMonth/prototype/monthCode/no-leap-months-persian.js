









const calendar = "persian";

for (var year = 1348; year < 1428; year++) {
  for (var month = 1; month < 13; month++) {
    const date = Temporal.PlainYearMonth.from({
      year,
      month,
      calendar,
      
    });
    assert.sameValue(date.monthCode.endsWith("L"), false);
  }
}

reportCompare(0, 0);
