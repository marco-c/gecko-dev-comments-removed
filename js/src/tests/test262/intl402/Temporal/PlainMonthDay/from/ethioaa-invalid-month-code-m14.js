











const calendar = "ethioaa";

assert.throws(RangeError, () => {
  Temporal.PlainMonthDay.from({ calendar, monthCode: "M14", day: 1 });
}, `M14 should not be a valid month code for ${calendar} calendar`);


assert.throws(RangeError, () => {
  Temporal.PlainMonthDay.from({ calendar, monthCode: "M14", day: 1 }, { overflow: "constrain" });
}, `M14 should not be valid for ${calendar} calendar even with constrain overflow`);


assert.throws(RangeError, () => {
  Temporal.PlainMonthDay.from({ calendar, monthCode: "M14", day: 1 }, { overflow: "reject" });
}, `M14 should not be valid for ${calendar} calendar with reject overflow`);

reportCompare(0, 0);
