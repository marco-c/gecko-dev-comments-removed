

const tests = {
  "en": {
    long: {
      "gregory": "Gregorian Calendar",
      "iso8601": "ISO-8601 Calendar",
      "japanese": "Japanese Calendar",
      "islamic-civil": "Hijri Calendar (tabular, civil epoch)",
      "islamicc": "Hijri Calendar (tabular, civil epoch)",
      "ethioaa": "Ethiopic Amete Alem Calendar",
      "ethiopic-amete-alem": "Ethiopic Amete Alem Calendar",
    },
    short: {},
    narrow: {},
  },
  "de": {
    long: {
      "gregory": "Gregorianischer Kalender",
      "iso8601": "ISO-8601-Kalender",
      "japanese": "Japanischer Kalender",
      "islamic-civil": "Bürgerlicher Hidschri-Kalender (tabellarisch)",
      "islamicc": "Bürgerlicher Hidschri-Kalender (tabellarisch)",
      "ethioaa": "Äthiopischer Amätä-Aläm-Kalender",
      "ethiopic-amete-alem": "Äthiopischer Amätä-Aläm-Kalender",
    },
    short: {},
    narrow: {},
  },
  "fr": {
    long: {
      "gregory": "calendrier grégorien",
      "iso8601": "calendrier ISO 8601",
      "japanese": "calendrier japonais",
      "islamic-civil": "calendrier hégirien (tabulaire, époque civile)",
      "islamicc": "calendrier hégirien (tabulaire, époque civile)",
      "ethioaa": "calendrier éthiopien Amete Alem",
      "ethiopic-amete-alem": "calendrier éthiopien Amete Alem",
    },
    short: {},
    narrow: {},
  },
  "zh": {
    long: {
      "gregory": "公历",
      "iso8601": "国际标准历法",
      "japanese": "和历",
      "islamic-civil": "表格式伊斯兰历（民用纪元）",
      "islamicc": "表格式伊斯兰历（民用纪元）",
      "ethioaa": "埃塞俄比亚阿米特阿莱姆日历",
      "ethiopic-amete-alem": "埃塞俄比亚阿米特阿莱姆日历",
    },
    short: {},
    narrow: {},
  },
};

for (let [locale, localeTests] of Object.entries(tests)) {
  for (let [style, styleTests] of Object.entries(localeTests)) {
    let dn = new Intl.DisplayNames(locale, {type: "calendar", style});

    let resolved = dn.resolvedOptions();
    assertEq(resolved.locale, locale);
    assertEq(resolved.style, style);
    assertEq(resolved.type, "calendar");
    assertEq(resolved.fallback, "code");

    let inheritedTests = {...localeTests.long, ...localeTests.short, ...localeTests.narrow};
    for (let [calendar, expected] of Object.entries({...inheritedTests, ...styleTests})) {
      assertEq(dn.of(calendar), expected);

      
      assertEq(dn.of(Object(calendar)), expected);
    }
  }
}

{
  let dn = new Intl.DisplayNames("en", {type: "calendar"});

  
  assertThrowsInstanceOf(() => dn.of(), RangeError);
  assertThrowsInstanceOf(() => dn.of(undefined), RangeError);
  assertThrowsInstanceOf(() => dn.of(Symbol()), TypeError);
  assertThrowsInstanceOf(() => dn.of(0), RangeError);

  
  assertThrowsInstanceOf(() => dn.of("gregorian"), RangeError);
  assertThrowsInstanceOf(() => dn.of("grëgory"), RangeError);
  assertThrowsInstanceOf(() => dn.of("grēgory"), RangeError);
}


{
  let dn1 = new Intl.DisplayNames("en", {type: "calendar"});
  let dn2 = new Intl.DisplayNames("en", {type: "calendar", fallback: "code"});
  let dn3 = new Intl.DisplayNames("en", {type: "calendar", fallback: "none"});

  assertEq(dn1.resolvedOptions().fallback, "code");
  assertEq(dn2.resolvedOptions().fallback, "code");
  assertEq(dn3.resolvedOptions().fallback, "none");

  
  assertEq(dn1.of("invalid"), "invalid");
  assertEq(dn2.of("invalid"), "invalid");
  assertEq(dn3.of("invalid"), undefined);

  
  assertEq(dn1.of("INVALID"), "invalid");
  assertEq(dn2.of("INVALID"), "invalid");
  assertEq(dn3.of("INVALID"), undefined);
}


{
  let dn = new Intl.DisplayNames("en", {type: "calendar", fallback: "none"});

  assertEq(dn.of("gregory"), "Gregorian Calendar");
  assertEq(dn.of("GREGORY"), "Gregorian Calendar");
}

if (typeof reportCompare === "function")
  reportCompare(true, true);
