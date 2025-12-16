












const calendar = "roc";

for (const { month, monthCode, daysInMonth } of TemporalHelpers.ISOMonths) {
  
  const pmd = Temporal.PlainMonthDay.from({ calendar, monthCode, day: 1 });
  TemporalHelpers.assertPlainMonthDay(pmd, monthCode, 1, `monthCode ${monthCode} should be preserved`);

  
  const pmdMonth = Temporal.PlainMonthDay.from({ calendar, year: 61, month, day: 1 });
  TemporalHelpers.assertPlainMonthDay(pmdMonth, monthCode, 1, `Equivalent monthCode ${monthCode} and month ${month} are resolved to the same PlainMonthDay`);

  
  const pmdMax = Temporal.PlainMonthDay.from({ calendar, monthCode, day: daysInMonth });
  TemporalHelpers.assertPlainMonthDay(pmdMax, monthCode, daysInMonth, `${monthCode} with day ${daysInMonth} should be valid`);

  
  const constrained = Temporal.PlainMonthDay.from(
    { calendar, monthCode, day: daysInMonth + 1 },
    { overflow: "constrain" }
  );
  TemporalHelpers.assertPlainMonthDay(constrained, monthCode, daysInMonth, `day ${daysInMonth + 1} should be constrained to ${daysInMonth} for ${monthCode}`);

  
  assert.throws(RangeError, () => {
    Temporal.PlainMonthDay.from({ calendar, monthCode, day: daysInMonth + 1 }, { overflow: "reject" });
  }, `${monthCode} with day ${daysInMonth + 1} should throw with reject overflow`);
}

reportCompare(0, 0);
