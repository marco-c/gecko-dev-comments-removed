










const calendar = "ethiopic";
const options = { overflow: "reject" };

const am0 = Temporal.PlainYearMonth.from({ era: "am", eraYear: 0, monthCode: "M01", calendar }, options);
TemporalHelpers.assertPlainYearMonth(
  am0,
  0, 1, "M01", "AM 0 resolves to AA 5500",
  "aa", 5500, null);

const am1n = Temporal.PlainYearMonth.from({ era: "am", eraYear: -1, monthCode: "M01", calendar }, options);
TemporalHelpers.assertPlainYearMonth(
  am1n,
  -1, 1, "M01", "AM -1 resolves to AA 5499",
  "aa", 5499, null);

const aa0 = Temporal.PlainYearMonth.from({ era: "aa", eraYear: 0, monthCode: "M01", calendar }, options);
TemporalHelpers.assertPlainYearMonth(
  aa0,
  -5500, 1, "M01", "AA 0 is not remapped",
  "aa", 0, null);

const aa1n = Temporal.PlainYearMonth.from({ era: "aa", eraYear: -1, monthCode: "M01", calendar }, options);
TemporalHelpers.assertPlainYearMonth(
  aa1n,
  -5501, 1, "M01", "AA -1 is not remapped",
  "aa", -1, null);

reportCompare(0, 0);
