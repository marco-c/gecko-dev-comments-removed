














const calendar = "islamic-tbla";


const monthsWith30Days = ["M01", "M03", "M05", "M07", "M09", "M11", "M12"];

for (const monthCode of monthsWith30Days) {
  const pmd = Temporal.PlainMonthDay.from({ calendar, monthCode, day: 1 });
  assert.sameValue(pmd.monthCode, monthCode, `monthCode ${monthCode} should be preserved`);
  assert.sameValue(pmd.day, 1, `day should be 1 for ${monthCode}`);

  const pmd30 = Temporal.PlainMonthDay.from({ calendar, monthCode, day: 30 });
  assert.sameValue(pmd30.monthCode, monthCode, `${monthCode} with day 30 should be valid`);
  assert.sameValue(pmd30.day, 30, `day should be 30 for ${monthCode}`);

  const constrained = Temporal.PlainMonthDay.from(
    { calendar, monthCode, day: 31 },
    { overflow: "constrain" }
  );
  assert.sameValue(constrained.monthCode, monthCode, `${monthCode} should be preserved with constrain`);
  assert.sameValue(constrained.day, 30, `day 31 should be constrained to 30 for ${monthCode}`);

  assert.throws(RangeError, () => {
    Temporal.PlainMonthDay.from({ calendar, monthCode, day: 31 }, { overflow: "reject" });
  }, `${monthCode} with day 31 should throw with reject overflow`);
}


const monthsWith29Days = ["M02", "M04", "M06", "M08", "M10"];

for (const monthCode of monthsWith29Days) {
  const pmd = Temporal.PlainMonthDay.from({ calendar, monthCode, day: 1 });
  assert.sameValue(pmd.monthCode, monthCode, `monthCode ${monthCode} should be preserved`);
  assert.sameValue(pmd.day, 1, `day should be 1 for ${monthCode}`);

  const pmd29 = Temporal.PlainMonthDay.from({ calendar, monthCode, day: 29 });
  assert.sameValue(pmd29.monthCode, monthCode, `${monthCode} with day 29 should be valid`);
  assert.sameValue(pmd29.day, 29, `day should be 29 for ${monthCode}`);

  const constrained = Temporal.PlainMonthDay.from(
    { calendar, monthCode, day: 30 },
    { overflow: "constrain" }
  );
  assert.sameValue(constrained.monthCode, monthCode, `${monthCode} should be preserved with constrain`);
  assert.sameValue(constrained.day, 29, `day 30 should be constrained to 29 for ${monthCode}`);

  assert.throws(RangeError, () => {
    Temporal.PlainMonthDay.from({ calendar, monthCode, day: 30 }, { overflow: "reject" });
  }, `${monthCode} with day 30 should throw with reject overflow`);
}

reportCompare(0, 0);
