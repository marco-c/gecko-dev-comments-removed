










const calendarEras = {
  buddhist: "be",
  coptic: "am",
  ethioaa: "aa",
  hebrew: "am",
  indian: "shaka",
  persian: "ap",
};
const options = { overflow: "reject" };

for (const [calendar, era] of Object.entries(calendarEras)) {
  for (const eraYear of [-1, 0, 1]) {
    const date = Temporal.PlainDateTime.from({ era, eraYear, monthCode: "M01", day: 1, hour: 12, minute: 34, calendar }, options);
    TemporalHelpers.assertPlainDateTime(
      date,
      eraYear, 1, "M01", 1, 12, 34, 0, 0, 0, 0, `era year ${eraYear} is not remapped`,
      era, eraYear);
  }
}

reportCompare(0, 0);
