



























const epochYears = {
  buddhist: -543,
  
  
  coptic: 283,
  
  ethioaa: -5493,
  ethiopic: 7,
  gregory: 0,
  hebrew: -3761,
  indian: 78,
  "islamic-civil": 621,
  "islamic-tbla": 621,
  "islamic-umalqura": 621,
  japanese: 0,
  persian: 621,
  roc: 1911,
};

for (const [calendar, epochYear] of Object.entries(epochYears)) {
  const epochDate = new Temporal.PlainDate(epochYear, 12, 31)
    .withCalendar(calendar)
    .with({ monthCode: "M01", day: 1 })
    .toPlainYearMonth();

  assert.sameValue(epochDate.year, 0, `${calendar} arithmetic year 0 should start in ISO year ${epochYear}`);
}

reportCompare(0, 0);
