














assert.throws(
  TypeError,
  () => Temporal.PlainMonthDay.from({ calendar: "chinese", monthCode: "M04", month: 5, day: 1 }),
  "Missing year throws TypeError before month/monthCode conflict throws RangeError"
);


assert.throws(
  TypeError,
  () => Temporal.PlainMonthDay.from({ calendar: "chinese", year: 2020, day: 32 }, { overflow: "reject" }),
  "Missing monthCode/month throws TypeError before out-of-range day throws RangeError"
);


assert.throws(
  TypeError,
  () => Temporal.PlainMonthDay.from({ calendar: "chinese", year: 2020, monthCode: "M04", month: 5 }),
  "Missing day throws TypeError before month/monthCode conflict throws RangeError"
);


assert.throws(
  TypeError,
  () => Temporal.PlainMonthDay.from({ calendar: "chinese", year: undefined, monthCode: "M04", month: 5, day: 1 }),
  "undefined year throws TypeError before month/monthCode conflict throws RangeError"
);


assert.throws(
  RangeError,
  () => Temporal.PlainMonthDay.from({ calendar: "chinese", year: 2020, monthCode: "M04", month: 5, day: 1 }),
  "month/monthCode conflict throws RangeError when all required fields present"
);

assert.throws(
  RangeError,
  () => Temporal.PlainMonthDay.from({ calendar: "chinese", year: 2020, monthCode: "M01", day: 32 }, { overflow: "reject" }),
  "Out-of-range day throws RangeError when all required fields present"
);


var pmd = Temporal.PlainMonthDay.from({ calendar: "chinese", year: 2004, monthCode: "M04", month: 5, day: 1 });
var pd = Temporal.PlainDate.from(pmd.toString());
assert.sameValue(pmd.monthCode, "M04", "Temporal.PlainMonthDay monthCode");
assert.sameValue(pd.monthCode, "M04", "Temporal.PlainDate monthCode");
assert.sameValue(pd.month, 4, "Temporal.PlainDate ordinal month");

reportCompare(0, 0);
