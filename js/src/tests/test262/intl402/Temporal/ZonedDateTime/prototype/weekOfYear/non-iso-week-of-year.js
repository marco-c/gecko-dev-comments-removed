











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
    new Temporal.ZonedDateTime(1_704_112_496_987_654_321n, "UTC", calendar).weekOfYear,
    undefined,
    `${calendar} does not provide week numbers`
  );
}

reportCompare(0, 0);
