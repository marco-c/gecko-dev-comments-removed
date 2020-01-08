



"use strict";

ChromeUtils.import("resource://formautofill/FormAutofillNameUtils.jsm");



const TESTCASES = [
  {
    description: "Full name including given, middle and family names",
    fullName: "Homer Jay Simpson",
    nameParts: {
      given: "Homer",
      middle: "Jay",
      family: "Simpson",
    },
  },
  {
    description: "No middle name",
    fullName: "Moe Szyslak",
    nameParts: {
      given: "Moe",
      middle: "",
      family: "Szyslak",
    },
  },
  {
    description: "Common name prefixes removed",
    fullName: "Reverend Timothy Lovejoy",
    nameParts: {
      given: "Timothy",
      middle: "",
      family: "Lovejoy",
    },
    expectedFullName: "Timothy Lovejoy",
  },
  {
    description: "Common name suffixes removed",
    fullName: "John Frink Phd",
    nameParts: {
      given: "John",
      middle: "",
      family: "Frink",
    },
    expectedFullName: "John Frink",
  },
  {
    description: "Exception to the name suffix removal",
    fullName: "John Ma",
    nameParts: {
      given: "John",
      middle: "",
      family: "Ma",
    },
  },
  {
    description: "Common family name prefixes not considered a middle name",
    fullName: "Milhouse Van Houten",
    nameParts: {
      given: "Milhouse",
      middle: "",
      family: "Van Houten",
    },
  },

  
  {
    description: "Chinese name, Unihan",
    fullName: "孫 德明",
    nameParts: {
      given: "德明",
      middle: "",
      family: "孫",
    },
    expectedFullName: "孫德明",
  },
  {
    description: "Chinese name, Unihan, \"IDEOGRAPHIC SPACE\"",
    fullName: "孫　德明",
    nameParts: {
      given: "德明",
      middle: "",
      family: "孫",
    },
    expectedFullName: "孫德明",
  },
  {
    description: "Korean name, Hangul",
    fullName: "홍 길동",
    nameParts: {
      given: "길동",
      middle: "",
      family: "홍",
    },
    expectedFullName: "홍길동",
  },
  {
    description: "Japanese name, Unihan",
    fullName: "山田 貴洋",
    nameParts: {
      given: "貴洋",
      middle: "",
      family: "山田",
    },
    expectedFullName: "山田貴洋",
  },

  
  
  
  {
    description: "Foreign name in Japanese, Katakana",
    fullName: "ゲイツ・ビル",
    nameParts: {
      given: "ビル",
      middle: "",
      family: "ゲイツ",
    },
    expectedFullName: "ゲイツビル",
  },

  
  {
    description: "Foreign name in Japanese, Katakana",
    fullName: "ゲイツ·ビル",
    nameParts: {
      given: "ビル",
      middle: "",
      family: "ゲイツ",
    },
    expectedFullName: "ゲイツビル",
  },

  
  
  {
    description: "Korean name, Hangul",
    fullName: "최성훈",
    nameParts: {
      given: "성훈",
      middle: "",
      family: "최",
    },
  },
  {
    description: "(Simplified) Chinese name, Unihan",
    fullName: "刘翔",
    nameParts: {
      given: "翔",
      middle: "",
      family: "刘",
    },
  },
  {
    description: "(Traditional) Chinese name, Unihan",
    fullName: "劉翔",
    nameParts: {
      given: "翔",
      middle: "",
      family: "劉",
    },
  },

  
  {
    description: "Korean name, Hangul",
    fullName: "남궁도",
    nameParts: {
      given: "도",
      middle: "",
      family: "남궁",
    },
  },
  {
    description: "Korean name, Hangul",
    fullName: "황보혜정",
    nameParts: {
      given: "혜정",
      middle: "",
      family: "황보",
    },
  },
  {
    description: "(Traditional) Chinese name, Unihan",
    fullName: "歐陽靖",
    nameParts: {
      given: "靖",
      middle: "",
      family: "歐陽",
    },
  },

  
  
  
  {
    description: "Korean name, Hangul",
    fullName: "강전희",
    nameParts: {
      given: "전희",
      middle: "",
      family: "강",
    },
  },
  {
    description: "Korean name, Hangul",
    fullName: "황목치승",
    nameParts: {
      given: "치승",
      middle: "",
      family: "황목",
    },
  },

  
  {
    description: "Korean name, Hangul",
    fullName: "이도",
    nameParts: {
      given: "도",
      middle: "",
      family: "이",
    },
  },
  {
    description: "Korean name, Hangul",
    fullName: "孫文",
    nameParts: {
      given: "文",
      middle: "",
      family: "孫",
    },
  },

  
  {
    description: "Bogus",
    fullName: "Homer シンプソン",
    nameParts: {
      given: "Homer",
      middle: "",
      family: "シンプソン",
    },
  },
  {
    description: "Bogus",
    fullName: "ホーマー Simpson",
    nameParts: {
      given: "ホーマー",
      middle: "",
      family: "Simpson",
    },
  },
  {
    description: "CJK has a middle-name, too unusual",
    fullName: "반 기 문",
    nameParts: {
      given: "반",
      middle: "기",
      family: "문",
    },
  },
];

add_task(async function test_splitName() {
  TESTCASES.forEach(testcase => {
    if (testcase.fullName) {
      info("Starting testcase: " + testcase.description);
      let nameParts = FormAutofillNameUtils.splitName(testcase.fullName);
      Assert.deepEqual(nameParts, testcase.nameParts);
    }
  });
});

add_task(async function test_joinName() {
  TESTCASES.forEach(testcase => {
    info("Starting testcase: " + testcase.description);
    let name = FormAutofillNameUtils.joinNameParts(testcase.nameParts);
    Assert.equal(name, testcase.expectedFullName || testcase.fullName);
  });
});
