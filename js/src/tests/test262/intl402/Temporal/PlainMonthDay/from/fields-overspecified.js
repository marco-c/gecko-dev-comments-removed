










{
  let fields = {
    calendar: "gregory",
    era: "ce",
    eraYear: 2024,
    year: 2023,
    monthCode: "M01",
    day: 1,
  };
  assert.throws(RangeError, () => Temporal.PlainMonthDay.from(fields));
}


{
  let fields = {
    calendar: "gregory",
    era: "ce",
    eraYear: 2024,
    year: 2023,
    month: 1,
    day: 1,
  };
  assert.throws(RangeError, () => Temporal.PlainMonthDay.from(fields));
}


{
  let fields = {
    calendar: "gregory",
    year: 2024,
    monthCode: "M01",
    month: 2,
    day: 1,
  };
  assert.throws(RangeError, () => Temporal.PlainMonthDay.from(fields));
}


reportCompare(0, 0);
