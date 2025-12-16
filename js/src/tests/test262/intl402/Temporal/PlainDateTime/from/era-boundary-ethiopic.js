










const calendar = "ethiopic";
const options = { overflow: "reject" };

const am0 = Temporal.PlainDateTime.from({ era: "am", eraYear: 0, monthCode: "M01", day: 1, hour: 12, minute: 34, calendar }, options);
TemporalHelpers.assertPlainDateTime(
  am0,
  0, 1, "M01", 1, 12, 34, 0, 0, 0, 0, "AM 0 resolves to AA 5500",
  "aa", 5500);

const am1n = Temporal.PlainDateTime.from({ era: "am", eraYear: -1, monthCode: "M01", day: 1, hour: 12, minute: 34, calendar }, options);
TemporalHelpers.assertPlainDateTime(
  am1n,
  -1, 1, "M01", 1, 12, 34, 0, 0, 0, 0, "AM -1 resolves to AA 5499",
  "aa", 5499);

const aa0 = Temporal.PlainDateTime.from({ era: "aa", eraYear: 0, monthCode: "M01", day: 1, hour: 12, minute: 34, calendar }, options);
TemporalHelpers.assertPlainDateTime(
  aa0,
  -5500, 1, "M01", 1, 12, 34, 0, 0, 0, 0, "AA 0 is not remapped",
  "aa", 0);

const aa1n = Temporal.PlainDateTime.from({ era: "aa", eraYear: -1, monthCode: "M01", day: 1, hour: 12, minute: 34, calendar }, options);
TemporalHelpers.assertPlainDateTime(
  aa1n,
  -5501, 1, "M01", 1, 12, 34, 0, 0, 0, 0, "AA -1 is not remapped",
  "aa", -1);

reportCompare(0, 0);
