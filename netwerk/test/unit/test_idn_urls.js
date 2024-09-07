

"use strict";

const testcases = [
  
  
  
  
  ["cuillère", "xn--cuillre-6xa", false, true, true],

  
  ["gruz̀̀ere", "xn--gruzere-ogea", false, false, false],

  
  ["I♥NY", "xn--iny-zx5a", false, false, false],

  









  
  ["乾燥肌・石けん", "xn--08j4gylj12hz80b0uhfup", false, true, true],

  
  ["толсто́й", "xn--lsa83dealbred", false, true, true],

  
  [
    "толсто́й-in-Russian",
    "xn---in-russian-1jg071b0a8bb4cpd",
    false,
    false,
    false,
  ],

  
  ["war-and-миръ", "xn--war-and--b9g3b7b3h", false, false, false],

  
  ["ᏣᎳᎩ", "xn--f9dt7l", false, false, false],

  
  ["ꆈꌠꁱꂷ", "xn--4o7a6e1x64c", false, false, false],

  
  ["πλάτων", "xn--hxa3ahjw4a", false, true, true],

  
  [
    "πλάτωνicrelationship",
    "xn--icrelationship-96j4t9a3cwe2e",
    false,
    false,
    false,
  ],

  
  ["spaceὈδύσσεια", "xn--space-h9dui0b0ga2j1562b", false, false, false],

  
  ["मराठी", "xn--d2b1ag0dl", false, true, true],

  
  ["मराठीՀայաստան", "xn--y9aaa1d0ai1cq964f8dwa2o1a", false, false, false],

  
  ["मराठी123", "xn--123-mhh3em2hra", false, true, true],

  
  ["123मराठी", "xn--123-phh3em2hra", false, true, true],

  
  ["chairman毛", "xn--chairman-k65r", false, true, true],

  
  ["山葵sauce", "xn--sauce-6j9ii40v", false, true, true],

  
  ["van語ではドイ", "xn--van-ub4bpb6w0in486d", false, true, true],

  
  ["van語ドイでは", "xn--van-ub4bpb4w0ip486d", false, true, true],

  
  ["vanでは語ドイ", "xn--van-ub4bpb6w0ip486d", false, true, true],

  
  ["vanではドイ語", "xn--van-ub4bpb6w0ir486d", false, true, true],

  
  ["vanドイ語では", "xn--van-ub4bpb4w0ir486d", false, true, true],

  
  ["vanドイでは語", "xn--van-ub4bpb4w0it486d", false, true, true],

  
  ["語vanではドイ", "xn--van-ub4bpb6w0ik486d", false, true, true],

  
  ["語vanドイでは", "xn--van-ub4bpb4w0im486d", false, true, true],

  
  ["語ではvanドイ", "xn--van-rb4bpb9w0ik486d", false, true, true],

  
  ["語ではドイvan", "xn--van-rb4bpb6w0in486d", false, true, true],

  
  ["語ドイvanでは", "xn--van-ub4bpb1w0ip486d", false, true, true],

  
  ["語ドイではvan", "xn--van-rb4bpb4w0ip486d", false, true, true],

  
  ["イツvan語ではド", "xn--van-ub4bpb1wvhsbx330n", false, true, true],

  
  ["ではvanドイ語", "xn--van-rb4bpb9w0ir486d", false, true, true],

  
  ["では語vanドイ", "xn--van-rb4bpb9w0im486d", false, true, true],

  
  ["では語ドイvan", "xn--van-rb4bpb6w0ip486d", false, true, true],

  
  ["ではドイvan語", "xn--van-rb4bpb6w0iu486d", false, true, true],

  
  ["ではドイ語van", "xn--van-rb4bpb6w0ir486d", false, true, true],

  
  ["ドイvan語では", "xn--van-ub4bpb1w0iu486d", false, true, true],

  
  ["ドイvanでは語", "xn--van-ub4bpb1w0iw486d", false, true, true],

  
  ["ドイ語vanでは", "xn--van-ub4bpb1w0ir486d", false, true, true],

  
  ["ドイ語ではvan", "xn--van-rb4bpb4w0ir486d", false, true, true],

  
  ["ドイではvan語", "xn--van-rb4bpb4w0iw486d", false, true, true],

  
  ["ドイでは語van", "xn--van-rb4bpb4w0it486d", false, true, true],

  
  ["中国123", "xn--123-u68dy61b", false, true, true],

  
  ["123中国", "xn--123-x68dy61b", false, true, true],

  
  
  ["super𝟖", "super8", true, true, true],

  
  ["𠀀𠀁𠀂", "xn--j50icd", false, true, true],

  
  ["\uD840\uDC00\uD840\uDC01\uD840\uDC02", "xn--j50icd", false, true, true],

  
  
  

  
  ["super৪", "xn--super-k2l", false, false, true],

  
  ["৫ab", "xn--ab-x5f", false, false, true],

  
  ["অঙ্কুর8", "xn--8-70d2cp0j6dtd", false, true, true],

  
  ["5াব", "xn--5-h3d7c", false, true, true],

  
  
  

  
  ["萬城", "xn--uis754h", false, true, true],

  
  ["万城", "xn--chq31v", false, true, true],

  
  ["万萬城", "xn--chq31vsl1b", false, true, true],

  
  ["萬万城", "xn--chq31vrl1b", false, true, true],

  
  [
    "注音符号bopomofoㄅㄆㄇㄈ",
    "xn--bopomofo-hj5gkalm1637i876cuw0brk5f",
    false,
    true,
    true,
  ],

  
  
  
  [
    "注音符号ㄅbopomofo",
    "xn--bopomofo-8i5gx891aylvccz9asi4e",
    false,
    true,
    true,
  ],

  
  [
    "bopomofo注音符号ㄅㄆㄇㄈ",
    "xn--bopomofo-hj5gkalm9637i876cuw0brk5f",
    false,
    true,
    true,
  ],

  
  [
    "bopomofoㄅㄆㄇㄈ注音符号",
    "xn--bopomofo-hj5gkalm3737i876cuw0brk5f",
    false,
    true,
    true,
  ],

  
  [
    "ㄅㄆㄇㄈ注音符号bopomofo",
    "xn--bopomofo-8i5gkalm3737i876cuw0brk5f",
    false,
    true,
    true,
  ],

  
  
  
  [
    "ㄅbopomofo注音符号",
    "xn--bopomofo-8i5g6891aylvccz9asi4e",
    false,
    true,
    true,
  ],

  
  [
    "注音符号ㄅㄆㄇㄈボポモフォ",
    "xn--jckteuaez1shij0450gylvccz9asi4e",
    false,
    false,
    false,
  ],

  
  [
    "注音符号ボポモフォㄅㄆㄇㄈ",
    "xn--jckteuaez6shij5350gylvccz9asi4e",
    false,
    false,
    false,
  ],

  
  [
    "ㄅㄆㄇㄈ注音符号ボポモフォ",
    "xn--jckteuaez1shij4450gylvccz9asi4e",
    false,
    false,
    false,
  ],

  
  [
    "ㄅㄆㄇㄈボポモフォ注音符号",
    "xn--jckteuaez1shij9450gylvccz9asi4e",
    false,
    false,
    false,
  ],

  
  [
    "ボポモフォ注音符号ㄅㄆㄇㄈ",
    "xn--jckteuaez6shij0450gylvccz9asi4e",
    false,
    false,
    false,
  ],

  
  [
    "ボポモフォㄅㄆㄇㄈ注音符号",
    "xn--jckteuaez6shij4450gylvccz9asi4e",
    false,
    false,
    false,
  ],

  
  ["韓한글hangul", "xn--hangul-2m5ti09k79ze", false, true, true],

  
  ["韓hangul한글", "xn--hangul-2m5to09k79ze", false, true, true],

  
  ["한글韓hangul", "xn--hangul-2m5th09k79ze", false, true, true],

  
  ["한글hangul韓", "xn--hangul-8m5t898k79ze", false, true, true],

  
  ["hangul韓한글", "xn--hangul-8m5ti09k79ze", false, true, true],

  
  ["hangul한글韓", "xn--hangul-8m5th09k79ze", false, true, true],

  
  ["한글ハングル", "xn--qck1c2d4a9266lkmzb", false, false, false],

  
  ["ハングル한글", "xn--qck1c2d4a2366lkmzb", false, false, false],

  
  [
    "เครื่องทําน้ําทําน้ําแข็ง",
    "xn--22cdjb2fanb9fyepcbbb9dwh4a3igze4fdcd",
    false,
    true,
    true,
  ],

  
  ["䕮䕵䕶䕱.ascii", "xn--google.ascii", false, true, true],
  ["ascii.䕮䕵䕶䕱", "ascii.xn--google", false, true, true],
  ["中国123.䕮䕵䕶䕱", "xn--123-u68dy61b.xn--google", false, true, true],
  ["䕮䕵䕶䕱.中国123", "xn--google.xn--123-u68dy61b", false, true, true],
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  

  
  ["goo\u0650gle", "xn--google-yri", false, false, false],
  
  ["العَرَبِي", "xn--mgbc0a5a6cxbzabt", false, true, true],

  
  ["goo\u05b4gle", "xn--google-rvh", false, false, false],

  
  ["na\u0131\u0308ve", "xn--nave-mza04z", false, false, false],
  ["d\u0131\u0302ner", "xn--dner-lza40z", false, false, false],
  
  ["na\u00efve.com", "xn--nave-6pa.com", false, true, true],
  ["d\u00eener.com", "xn--dner-0pa.com", false, true, true],
];

const profiles = ["ASCII", "high", "moderate"];

function run_test() {
  var pbi = Services.prefs;
  var oldProfile = pbi.getCharPref(
    "network.IDN.restriction_profile",
    "moderate"
  );
  var idnService = Cc["@mozilla.org/network/idn-service;1"].getService(
    Ci.nsIIDNService
  );

  for (var i = 0; i < profiles.length; ++i) {
    pbi.setCharPref("network.IDN.restriction_profile", profiles[i]);

    dump("testing " + profiles[i] + " profile");

    for (var j = 0; j < testcases.length; ++j) {
      var test = testcases[j];
      var URL = test[0] + ".com";
      var punycodeURL = test[1] + ".com";
      var expectedUnicode = test[2 + i];

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
  pbi.setCharPref("network.IDN.restriction_profile", oldProfile);
}
