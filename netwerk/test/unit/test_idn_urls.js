

"use strict";

const testcases = [
  
  

  
  ["cuillère", "xn--cuillre-6xa", true],

  
  ["gruz̀̀ere", "xn--gruzere-ogea", false],

  
  ["I♥NY", "xn--iny-zx5a", false],

  









  
  ["乾燥肌・石けん", "xn--08j4gylj12hz80b0uhfup", true],

  
  ["толсто́й", "xn--lsa83dealbred", true],

  
  ["толсто́й-in-Russian", "xn---in-russian-1jg071b0a8bb4cpd", false],

  
  ["war-and-миръ", "xn--war-and--b9g3b7b3h", false],

  
  ["ᏣᎳᎩ", "xn--f9dt7l", false],

  
  ["ꆈꌠꁱꂷ", "xn--4o7a6e1x64c", false],

  
  ["πλάτων", "xn--hxa3ahjw4a", true],

  
  ["πλάτωνicrelationship", "xn--icrelationship-96j4t9a3cwe2e", false],

  
  ["spaceὈδύσσεια", "xn--space-h9dui0b0ga2j1562b", false],

  
  ["मराठी", "xn--d2b1ag0dl", true],

  
  ["मराठीՀայաստան", "xn--y9aaa1d0ai1cq964f8dwa2o1a", false],

  
  ["मराठी123", "xn--123-mhh3em2hra", true],

  
  ["123मराठी", "xn--123-phh3em2hra", true],

  
  ["chairman毛", "xn--chairman-k65r", true],

  
  ["山葵sauce", "xn--sauce-6j9ii40v", true],

  
  ["van語ではドイ", "xn--van-ub4bpb6w0in486d", true],

  
  ["van語ドイでは", "xn--van-ub4bpb4w0ip486d", true],

  
  ["vanでは語ドイ", "xn--van-ub4bpb6w0ip486d", true],

  
  ["vanではドイ語", "xn--van-ub4bpb6w0ir486d", true],

  
  ["vanドイ語では", "xn--van-ub4bpb4w0ir486d", true],

  
  ["vanドイでは語", "xn--van-ub4bpb4w0it486d", true],

  
  ["語vanではドイ", "xn--van-ub4bpb6w0ik486d", true],

  
  ["語vanドイでは", "xn--van-ub4bpb4w0im486d", true],

  
  ["語ではvanドイ", "xn--van-rb4bpb9w0ik486d", true],

  
  ["語ではドイvan", "xn--van-rb4bpb6w0in486d", true],

  
  ["語ドイvanでは", "xn--van-ub4bpb1w0ip486d", true],

  
  ["語ドイではvan", "xn--van-rb4bpb4w0ip486d", true],

  
  ["イツvan語ではド", "xn--van-ub4bpb1wvhsbx330n", true],

  
  ["ではvanドイ語", "xn--van-rb4bpb9w0ir486d", true],

  
  ["では語vanドイ", "xn--van-rb4bpb9w0im486d", true],

  
  ["では語ドイvan", "xn--van-rb4bpb6w0ip486d", true],

  
  ["ではドイvan語", "xn--van-rb4bpb6w0iu486d", true],

  
  ["ではドイ語van", "xn--van-rb4bpb6w0ir486d", true],

  
  ["ドイvan語では", "xn--van-ub4bpb1w0iu486d", true],

  
  ["ドイvanでは語", "xn--van-ub4bpb1w0iw486d", true],

  
  ["ドイ語vanでは", "xn--van-ub4bpb1w0ir486d", true],

  
  ["ドイ語ではvan", "xn--van-rb4bpb4w0ir486d", true],

  
  ["ドイではvan語", "xn--van-rb4bpb4w0iw486d", true],

  
  ["ドイでは語van", "xn--van-rb4bpb4w0it486d", true],

  
  ["中国123", "xn--123-u68dy61b", true],

  
  ["123中国", "xn--123-x68dy61b", true],

  
  
  ["super𝟖", "super8", true],

  
  ["𠀀𠀁𠀂", "xn--j50icd", true],

  
  ["\uD840\uDC00\uD840\uDC01\uD840\uDC02", "xn--j50icd", true],

  
  
  

  
  ["super৪", "xn--super-k2l", false],

  
  ["৫ab", "xn--ab-x5f", false],

  
  ["অঙ্কুর8", "xn--8-70d2cp0j6dtd", true],

  
  ["5াব", "xn--5-h3d7c", true],

  
  
  

  
  ["萬城", "xn--uis754h", true],

  
  ["万城", "xn--chq31v", true],

  
  ["万萬城", "xn--chq31vsl1b", true],

  
  ["萬万城", "xn--chq31vrl1b", true],

  
  ["注音符号bopomofoㄅㄆㄇㄈ", "xn--bopomofo-hj5gkalm1637i876cuw0brk5f", true],

  
  
  
  ["注音符号ㄅbopomofo", "xn--bopomofo-8i5gx891aylvccz9asi4e", true],

  
  ["bopomofo注音符号ㄅㄆㄇㄈ", "xn--bopomofo-hj5gkalm9637i876cuw0brk5f", true],

  
  ["bopomofoㄅㄆㄇㄈ注音符号", "xn--bopomofo-hj5gkalm3737i876cuw0brk5f", true],

  
  ["ㄅㄆㄇㄈ注音符号bopomofo", "xn--bopomofo-8i5gkalm3737i876cuw0brk5f", true],

  
  
  
  ["ㄅbopomofo注音符号", "xn--bopomofo-8i5g6891aylvccz9asi4e", true],

  
  ["注音符号ㄅㄆㄇㄈボポモフォ", "xn--jckteuaez1shij0450gylvccz9asi4e", false],

  
  ["注音符号ボポモフォㄅㄆㄇㄈ", "xn--jckteuaez6shij5350gylvccz9asi4e", false],

  
  ["ㄅㄆㄇㄈ注音符号ボポモフォ", "xn--jckteuaez1shij4450gylvccz9asi4e", false],

  
  ["ㄅㄆㄇㄈボポモフォ注音符号", "xn--jckteuaez1shij9450gylvccz9asi4e", false],

  
  ["ボポモフォ注音符号ㄅㄆㄇㄈ", "xn--jckteuaez6shij0450gylvccz9asi4e", false],

  
  ["ボポモフォㄅㄆㄇㄈ注音符号", "xn--jckteuaez6shij4450gylvccz9asi4e", false],

  
  ["韓한글hangul", "xn--hangul-2m5ti09k79ze", true],

  
  ["韓hangul한글", "xn--hangul-2m5to09k79ze", true],

  
  ["한글韓hangul", "xn--hangul-2m5th09k79ze", true],

  
  ["한글hangul韓", "xn--hangul-8m5t898k79ze", true],

  
  ["hangul韓한글", "xn--hangul-8m5ti09k79ze", true],

  
  ["hangul한글韓", "xn--hangul-8m5th09k79ze", true],

  
  ["한글ハングル", "xn--qck1c2d4a9266lkmzb", false],

  
  ["ハングル한글", "xn--qck1c2d4a2366lkmzb", false],

  
  [
    "เครื่องทําน้ําทําน้ําแข็ง",
    "xn--22cdjb2fanb9fyepcbbb9dwh4a3igze4fdcd",
    true,
  ],

  
  ["䕮䕵䕶䕱.ascii", "xn--google.ascii", true],
  ["ascii.䕮䕵䕶䕱", "ascii.xn--google", true],
  ["中国123.䕮䕵䕶䕱", "xn--123-u68dy61b.xn--google", true],
  ["䕮䕵䕶䕱.中国123", "xn--google.xn--123-u68dy61b", true],
  
  
  
  
  
  
  
  
  
  
  

  
  ["goo\u0650gle", "xn--google-yri", false],
  
  ["العَرَبِي", "xn--mgbc0a5a6cxbzabt", true],

  
  ["goo\u05b4gle", "xn--google-rvh", false],

  
  ["na\u0131\u0308ve", "xn--nave-mza04z", false],
  ["d\u0131\u0302ner", "xn--dner-lza40z", false],
  
  ["na\u00efve.com", "xn--nave-6pa.com", true],
  ["d\u00eener.com", "xn--dner-0pa.com", true],
];

function run_test() {
  var idnService = Cc["@mozilla.org/network/idn-service;1"].getService(
    Ci.nsIIDNService
  );

  for (var j = 0; j < testcases.length; ++j) {
    var test = testcases[j];
    var URL = test[0] + ".com";
    var punycodeURL = test[1] + ".com";
    var expectedUnicode = test[2];

    var result;
    try {
      result = idnService.convertToDisplayIDN(URL);
    } catch (e) {
      result = ".com";
    }
    if (
      punycodeURL.substr(0, 4) == "xn--" ||
      punycodeURL.indexOf(".xn--") > 0
    ) {
      
      
      Assert.equal(
        escape(result),
        expectedUnicode ? escape(URL) : escape(punycodeURL)
      );

      result = idnService.convertToDisplayIDN(punycodeURL);
      Assert.equal(
        escape(result),
        expectedUnicode ? escape(URL) : escape(punycodeURL)
      );
    } else {
      
      
      
      
      Assert.equal(escape(result), escape(punycodeURL));
    }
  }
}
