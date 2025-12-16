











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
    new Temporal.PlainDateTime(2024, 1, 1, 12, 34, 56, 987, 654, 321, calendar).yearOfWeek,
    undefined,
    `${calendar} does not provide week numbers`
  );
}

reportCompare(0, 0);
