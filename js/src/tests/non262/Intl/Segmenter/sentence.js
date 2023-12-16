



const locales = [
  "en", "de", "fr", "ar", "ja", "zh", "th",
];

let strings = {
  
  "": [],

  
  "This is an English sentence. And this is another one.": [
    "This is an English sentence. ",
    "And this is another one."
  ],
  "The colon: it doesn't start a new sentence.": [
    "The colon: it doesn't start a new sentence."
  ],

  
  "Unnötig umständlich Wörter überlegen. Und dann lästigerweise zu längeren Sätzen überarbeiten!": [
    "Unnötig umständlich Wörter überlegen. ",
    "Und dann lästigerweise zu längeren Sätzen überarbeiten!"
  ],

  
  
  "Unicode（ユニコード）は、符号化文字集合や文字符号化方式などを定めた、文字コードの業界規格。文字集合（文字セット）が単一の大規模文字セットであること（「Uni」という名はそれに由来する）などが特徴である。": [
    "Unicode（ユニコード）は、符号化文字集合や文字符号化方式などを定めた、文字コードの業界規格。",
    "文字集合（文字セット）が単一の大規模文字セットであること（「Uni」という名はそれに由来する）などが特徴である。"
  ],
};

function assertIsSegmentDataObject(obj) {
  
  assertEq(Object.getPrototypeOf(obj), Object.prototype);

  
  let keys = Reflect.ownKeys(obj);
  assertEq(keys.length, 3);
  assertEq(keys[0], "segment");
  assertEq(keys[1], "index");
  assertEq(keys[2], "input");

  
  assertEq(typeof obj.segment, "string");
  assertEq(typeof obj.index, "number");
  assertEq(typeof obj.input, "string");

  
  assertEq(Number.isInteger(obj.index), true);
  assertEq(obj.index >= 0, true);
  assertEq(obj.index < obj.input.length, true);

  
  assertEq(obj.segment.length > 0, true);

  
  assertEq(obj.input.substr(obj.index, obj.segment.length), obj.segment);
}

function segmentsFromContaining(segmenter, string) {
  let segments = segmenter.segment(string);

  let result = [];
  for (let index = 0, data; (data = segments.containing(index)); index += data.segment.length) {
    result.push(data);
  }
  return result;
}

for (let locale of locales) {
  let segmenter = new Intl.Segmenter(locale, {granularity: "sentence"});

  let resolved = segmenter.resolvedOptions();
  assertEq(resolved.locale, locale);
  assertEq(resolved.granularity, "sentence");

  for (let [string, sentences] of Object.entries(strings)) {
    let segments = [...segmenter.segment(string)];

    
    segments.forEach(assertIsSegmentDataObject);

    
    assertEq(segments.reduce((acc, {segment}) => acc + segment, ""), string);

    
    assertEq(segments.every(({input}) => input === string), true);

    
    assertEq(isNaN(segments.reduce((acc, {index}) => index > acc ? index : NaN, -Infinity)), false);

    
    assertEqArray(segments.map(({segment}) => segment), sentences);

    
    assertDeepEq(segmentsFromContaining(segmenter, string), segments);
  }
}


{
  let segmenter = new Intl.Segmenter("en-u-ss-standard", {granularity: "sentence"});
  assertEq(segmenter.resolvedOptions().locale, "en");

  let segments = [...segmenter.segment("Dr. Strange is a fictional character.")];
  assertEqArray(segments.map(({segment}) => segment),
                ["Dr. ", "Strange is a fictional character."]);
}


{
  
  let string1 = "Από πού είσαι; Τί κάνεις;";
  let string2 = string1.replaceAll(";", "\u037E"); 
  assertEq(string1 !== string2, true);

  for (let string of [string1, string2]) {
    let english = new Intl.Segmenter("en", {granularity: "sentence"});
    let greek = new Intl.Segmenter("el", {granularity: "sentence"});

    
    assertEq([...english.segment(string)].length, 1);

    
    
    
    
    
  }
}

if (typeof reportCompare === "function")
  reportCompare(0, 0);
