











const nonIsoCalendars = [
  "buddhist",
  "chinese",
  "coptic",
  "dangi",
  "ethioaa",
  "ethiopic",
  "gregory",
  "hebrew",
  "indian",
  "islamic-civil",
  "islamic-tbla",
  "islamic-umalqura",
  "japanese",
  "persian",
  "roc"
];


for (const calendar of nonIsoCalendars) {
  assert.sameValue(
    new Temporal.PlainDate(2024, 1, 1, calendar).yearOfWeek,
    undefined,
    `${calendar} does not provide week numbers`
  );
}


reportCompare(0, 0);
