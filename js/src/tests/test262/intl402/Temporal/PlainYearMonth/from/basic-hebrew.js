










const calendar = "hebrew";
const options = { overflow: "reject" };

const commonYear = 5783;

for (let month = 1; month < 13; month++) {
  const monthCode = `M${String(month).padStart(2, '0')}`;

  const startOfMonth = Temporal.PlainYearMonth.from({ year: commonYear, month, calendar }, options);
  TemporalHelpers.assertPlainYearMonth(
    startOfMonth,
    commonYear, month, monthCode,
    `${monthCode} in common year`,
    "am", commonYear, null
  );
}

reportCompare(0, 0);
