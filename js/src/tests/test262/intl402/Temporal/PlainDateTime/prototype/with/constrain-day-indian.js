










const calendar = "indian";
const options = { overflow: "reject" };






const common0231 = Temporal.PlainDateTime.from({ year: 1944, monthCode: "M02", day: 31, hour: 12, minute: 34, calendar }, options);
const leap0131 = Temporal.PlainDateTime.from({ year: 1946, monthCode: "M01", day: 31, hour: 12, minute: 34, calendar }, options);



[
  [3, "M03"],
  [4, "M04"],
  [5, "M05"],
  [6, "M06"],
].forEach(function ([month, monthCode]) {
  TemporalHelpers.assertPlainDateTime(
    common0231.with({ monthCode }, options),
    1944, month, monthCode, 31,  12, 34, 0, 0, 0, 0,`common-year ${monthCode} does not reject 31 when adding`,
    "shaka", 1944);
});

[
  [1, "M01"],
  [7, "M07"],
  [8, "M08"],
  [9, "M09"],
  [10, "M10"],
  [11, "M11"],
  [12, "M12"],
].forEach(function ([month, monthCode]) {
  TemporalHelpers.assertPlainDateTime(
    common0231.with({ monthCode }),
    1944, month, monthCode, 30,  12, 34, 0, 0, 0, 0,`common-year ${monthCode} constrains to 30 when adding`,
    "shaka", 1944);
  assert.throws(RangeError, function () {
    common0231.with({ monthCode }, options);
  }, `common-year ${monthCode} rejects 31 when adding`);
});



[
  [2, "M02"],
  [3, "M03"],
  [4, "M04"],
  [5, "M05"],
  [6, "M06"],
].forEach(function ([month, monthCode]) {
  TemporalHelpers.assertPlainDateTime(
    leap0131.with({ monthCode }, options),
    1946, month, monthCode, 31,  12, 34, 0, 0, 0, 0,`leap-year ${monthCode} does not reject 31 when adding`,
    "shaka", 1946);
});

[
  [7, "M07"],
  [8, "M08"],
  [9, "M09"],
  [10, "M10"],
  [11, "M11"],
  [12, "M12"],
].forEach(function ([month, monthCode]) {
  TemporalHelpers.assertPlainDateTime(
    leap0131.with({ monthCode }),
    1946, month, monthCode, 30,  12, 34, 0, 0, 0, 0,`leap-year ${monthCode} constrains to 30 when adding`,
    "shaka", 1946);
  assert.throws(RangeError, function () {
    leap0131.with({ monthCode }, options);
  }, `leap-year ${monthCode} rejects 31 when adding`);
});

reportCompare(0, 0);
