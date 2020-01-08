



"use strict";

add_task(async function setup() {
  ChromeUtils.import("resource://formautofill/FormAutofillNameUtils.jsm");
});



const TESTCASES = [
  {
    
    fullName: "Homer Jay Simpson",
    expectedResult: false,
  },
  {
    
    fullName: "Éloïse Paré",
    expectedResult: false,
  },
  {
    
    fullName: "Σωκράτης",
    expectedResult: false,
  },
  {
    
    fullName: "刘翔",
    expectedResult: true,
  },
  {
    
    fullName: "成 龙",
    expectedResult: true,
  },
  {
    
    fullName: "송지효",
    expectedResult: true,
  },
  {
    
    fullName: "김　종국",
    expectedResult: true,
  },
  {
    
    fullName: "山田貴洋",
    expectedResult: true,
  },
  {
    
    fullName: "ビル・ゲイツ",
    expectedResult: true,
  },
  {
    
    fullName: "ビル·ゲイツ",
    expectedResult: true,
  },
  {
    
    fullName: "반 기 문",
    expectedResult: false,
  },
];

add_task(async function test_isCJKName() {
  TESTCASES.forEach(testcase => {
    info("Starting testcase: " + testcase.fullName);
    let result = FormAutofillNameUtils._isCJKName(testcase.fullName);
    Assert.equal(result, testcase.expectedResult);
  });
});
