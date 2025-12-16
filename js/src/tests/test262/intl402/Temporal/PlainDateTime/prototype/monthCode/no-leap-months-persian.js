









const calendar = "persian";

for (var year = 1348; year < 1428; year++) {
  for (var month = 1; month < 13; month++) {
    const date = Temporal.PlainDateTime.from({
      year,
      month,
      calendar,
      day: 1, hour: 12, minute: 34
    });
    assert.sameValue(date.monthCode.endsWith("L"), false);
  }
}

reportCompare(0, 0);
