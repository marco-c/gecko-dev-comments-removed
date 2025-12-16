











const a = new Temporal.ZonedDateTime(1469923200000000000n, "UTC", 'chinese');

const b = new Temporal.ZonedDateTime(1501459200000000000n, "UTC", 'chinese');
TemporalHelpers.assertDuration(b.since(a, { largestUnit: 'years' }),
  0, 12, 0, 11, 0, 0, 0, 0, 0, 0, "Chinese calendar, year-and-a-bit");


const c = new Temporal.ZonedDateTime(-89683200000000000n, "UTC", "hebrew");

const d = new Temporal.ZonedDateTime(-57974400000000000n, "UTC", "hebrew");
TemporalHelpers.assertDuration(d.since(c, { largestUnit: 'years' }),
  1, 0, 0, 13, 0, 0, 0, 0, 0, 0, "Hebrew calendar, year-and-a-bit");


const e = new Temporal.ZonedDateTime(1459382400000000000n, "UTC", 'chinese');

const f = new Temporal.ZonedDateTime(1553817600000000000n, "UTC", 'chinese');
TemporalHelpers.assertDuration(f.since(e, { largestUnit: 'years' }),
  3, 0, 0, 0, 0, 0, 0, 0, 0, 0, "Chinese calendar, 3 years");


const g = new Temporal.ZonedDateTime(1556668800000000000n, "UTC", 'chinese');

const h = new Temporal.ZonedDateTime(1587254400000000000n, "UTC", 'chinese');
TemporalHelpers.assertDuration(h.since(g, { largestUnit: 'years' }),
  1, 0, 0, 0, 0, 0, 0, 0, 0, 0, "Chinese calendar, 1 year");


reportCompare(0, 0);
