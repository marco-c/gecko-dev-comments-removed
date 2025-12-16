














const months2022TestData = [
  ["M01", 1, 1],
  ["M02", 2, 3],
  ["M03", 3, 1],
  ["M04", 4, 1],
  ["M05", 5, 30],
  ["M06", 6, 29],
  ["M07", 7, 29],
  ["M08", 8, 27],
  ["M09", 9, 26],
  ["M10", 10, 25],
  ["M11", 11, 24],
  ["M12", 12, 23],
];
for (let [nonLeapMonthCode, month, referenceISODay] of months2022TestData) {
  const leapMonthCode = nonLeapMonthCode + "L";
  const fields = { year: 2022, monthCode: leapMonthCode, calendar: "chinese" };

  const result = Temporal.PlainYearMonth.from(fields, { overflow: "constrain" });
  TemporalHelpers.assertPlainYearMonth(
    result,
    2022, month, nonLeapMonthCode,
    `Chinese intercalary month ${leapMonthCode} is constrained to ${nonLeapMonthCode} in year 2022 (overflow constrain)`,
     undefined,  undefined, referenceISODay
  );

  assert.throws(
    RangeError,
    () => Temporal.PlainYearMonth.from(fields, { overflow: "reject" }),
    `Chinese intercalary month ${leapMonthCode} does not exist in year 2022 (overflow reject)`
  );
}




const leapMonthsTestData = [
  ["M02L", 2023, 3, 22],
  ["M03L", 1993, 4, 22],
  ["M04L", 2020, 5, 23],
  ["M05L", 2009, 6, 23],
  ["M06L", 2017, 7, 23],
  ["M07L", 2006, 8, 24],
  ["M08L", 1995, 9, 25],
  ["M09L", 2014, 10, 24],
  ["M10L", 1984, 11, 23],
  ["M11L", 2033, 12, 22],
];
for (const [monthCode, year, month, referenceISODay, isoYear = year, isoMonth = month] of leapMonthsTestData) {
  const result = Temporal.PlainYearMonth.from({ year, monthCode, calendar: "chinese" });
  TemporalHelpers.assertPlainYearMonth(
    result,
    year, month, monthCode,
    `Date of sample Chinese intercalary month ${monthCode}`,
     undefined,  undefined, referenceISODay
  );
  const isoYearMonth = result.toString().slice(0, 7);
  assert.sameValue(isoYearMonth, `${isoYear}-${String(isoMonth).padStart(2, '0')}`, `${year}-${monthCode} starts in ISO month ${isoYear}-${isoMonth}`);
}

reportCompare(0, 0);
