












const calendar = "hebrew";

assert.throws(RangeError, () => {
  Temporal.PlainMonthDay.from({ calendar, monthCode: "M13", day: 1 });
}, `M13 should not be a valid month code for ${calendar} calendar`);


assert.throws(RangeError, () => {
  Temporal.PlainMonthDay.from({ calendar, monthCode: "M13", day: 1 }, { overflow: "constrain" });
}, `M13 should not be valid for ${calendar} calendar even with constrain overflow`);


assert.throws(RangeError, () => {
  Temporal.PlainMonthDay.from({ calendar, monthCode: "M13", day: 1 }, { overflow: "reject" });
}, `M13 should not be valid for ${calendar} calendar with reject overflow`);


for (var i = 1; i <= 12; i++) {
  if (i === 5)
    continue;
  const monthCode = `M${ i.toString().padStart(2, "0") }L`;
  assert.throws(RangeError, function () {
    Temporal.PlainMonthDay.from({ monthCode, day: 1, calendar });
  });
}

reportCompare(0, 0);
