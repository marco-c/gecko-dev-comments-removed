













const calendar = "ethioaa";


const regularMonthCodes = [
  "M01", "M02", "M03", "M04", "M05", "M06",
  "M07", "M08", "M09", "M10", "M11", "M12"
];

for (const monthCode of regularMonthCodes) {
  
  const pmd = Temporal.PlainMonthDay.from({ calendar, monthCode, day: 1 });
  assert.sameValue(pmd.monthCode, monthCode, `monthCode ${monthCode} should be preserved`);
  assert.sameValue(pmd.day, 1, "day should be 1");

  
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




const pmdM13Day6 = Temporal.PlainMonthDay.from({ calendar, monthCode: "M13", day: 6 });
assert.sameValue(pmdM13Day6.monthCode, "M13", "M13 should be valid with day 6");
assert.sameValue(pmdM13Day6.day, 6, "day should be 6 for M13");


const constrained = Temporal.PlainMonthDay.from(
  { calendar, monthCode: "M13", day: 7 },
  { overflow: "constrain" }
);
assert.sameValue(constrained.monthCode, "M13", "M13 should be preserved with constrain");
assert.sameValue(constrained.day, 6, "day 7 should be constrained to 6 for M13");


assert.throws(RangeError, () => {
  Temporal.PlainMonthDay.from({ calendar, monthCode: "M13", day: 7 }, { overflow: "reject" });
}, "M13 with day 7 should throw with reject overflow");

reportCompare(0, 0);
