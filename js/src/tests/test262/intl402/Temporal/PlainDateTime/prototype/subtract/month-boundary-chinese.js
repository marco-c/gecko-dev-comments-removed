










const calendar = "chinese";
const options = { overflow: "reject" };

const months1 = new Temporal.Duration(0, -1);
const months1n = new Temporal.Duration(0, 1);
const months4 = new Temporal.Duration(0, -4);
const months4n = new Temporal.Duration(0, 4);
const months6 = new Temporal.Duration(0, -6);
const months6n = new Temporal.Duration(0, 6);
const durations = [
  months1,
  months1n,
  months4,
  months4n,
  months6,
  months6n,
];

const date201901 = Temporal.PlainDateTime.from({ year: 2019, monthCode: "M01", day: 1, hour: 12, minute: 34, calendar }, options);
const date201906 = Temporal.PlainDateTime.from({ year: 2019, monthCode: "M06", day: 1, hour: 12, minute: 34, calendar }, options);
const date201911 = Temporal.PlainDateTime.from({ year: 2019, monthCode: "M11", day: 1, hour: 12, minute: 34, calendar }, options);
const date201912 = Temporal.PlainDateTime.from({ year: 2019, monthCode: "M12", day: 1, hour: 12, minute: 34, calendar }, options);
const date200012 = Temporal.PlainDateTime.from({ year: 2000, monthCode: "M12", day: 1, hour: 12, minute: 34, calendar }, options);
const dates = [
  date201901,
  date201906,
  date201911,
  date201912,
  date200012,
];

for (var duration of durations) {
  for (var start of dates) {
    const end = start.subtract(duration);

    
    const startYesterday = start.subtract({ days: 1 });
    
    const endYesterday = startYesterday.subtract(duration);
    
    
    assert.sameValue(endYesterday.day, Math.min(startYesterday.day, endYesterday.daysInMonth), "adding months should result in same day");

    
    var endYesterdayNextDay = endYesterday.subtract({ days: -1 });
    
    while (endYesterdayNextDay.day !== 1) {
      endYesterdayNextDay = endYesterdayNextDay.subtract({ days: -1 });
    }

    TemporalHelpers.assertPlainDateTime(endYesterdayNextDay, end.year, end.month, end.monthCode, end.day, 12, 34, 0, 0, 0, 0, `endYesterdayNextDay`, end.era, end.eraYear);

    
    const endReverse = endYesterdayNextDay.subtract({ days: 1 });
    const startReverse = endReverse.subtract(duration.negated());
    
    assert.sameValue(startReverse.day, Math.min(endReverse.day, startReverse.daysInMonth));

    
    var startReverseNextDay = startReverse.subtract({ days: -1 });
    while(startReverseNextDay.day !== 1) {
      startReverseNextDay = startReverseNextDay.subtract({ days: -1 });
    }

    TemporalHelpers.assertPlainDateTime(startReverseNextDay, start.year, start.month, start.monthCode, start.day, 12, 34, 0, 0, 0, 0, `startReverseNextDay`, start.era, start.eraYear);
  }
}

reportCompare(0, 0);
