











const tests = [
  [
    -987,
    {
      "short": "-987 m",
      "narrow": "-987m",
      "long": "-987 メートル",
    }
  ],
  [
    -0.001,
    {
      "short": "-0.001 m",
      "narrow": "-0.001m",
      "long": "-0.001 メートル",
    }
  ],
  [
    -0,
    {
      "short": "-0 m",
      "narrow": "-0m",
      "long": "-0 メートル",
    }
  ],
  [
    0,
    {
      "short": "0 m",
      "narrow": "0m",
      "long": "0 メートル",
    }
  ],
  [
    0.001,
    {
      "short": "0.001 m",
      "narrow": "0.001m",
      "long": "0.001 メートル",
    }
  ],
  [
    987,
    {
      "short": "987 m",
      "narrow": "987m",
      "long": "987 メートル",
    }
  ],
];

for (const [number, expectedData] of tests) {
  for (const [unitDisplay, expected] of Object.entries(expectedData)) {
    const nf = new Intl.NumberFormat("ja-JP", { style: "unit", unit: "meter", unitDisplay });
    assert.sameValue(nf.format(number), expected);
  }
}


reportCompare(0, 0);
