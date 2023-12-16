



const locales = [
  "en", "de", "fr", "ar", "ja", "zh", "th",
];

let strings = {
  
  "": [],

  
  "This is an English sentence.": [
    "This", " ", "is", " ", "an", " ", "English", " ", "sentence", "."
  ],
  "Moi?  N'est-ce pas.": [
    "Moi", "?", "  ", "N'est", "-", "ce", " ", "pas", "."
  ],

  
  "Unnötig umständlich Wörter überlegen.": [
    "Unnötig", " ", "umständlich", " ", "Wörter", " ", "überlegen", "."
  ],

  
  
  "ラドクリフ、マラソン五輪代表に 1万メートル出場にも含み。": [
    "ラドクリフ", "、", "マラソン", "五輪", "代表", "に", " ", "1", "万", "メートル", "出場", "に", "も", "含み", "。"
  ],

  
  
  "ขนบนอก": [
    
    "ขนบ", "นอก"
  ],
  "พนักงานนําโคลงเรือสามตัว": [
    

    
    

    
    "พ", "นัก", "งานนํา", "โคลง", "เรือ", "สาม", "ตัว"
  ],

  "หมอหุงขาวสวยด": [
    
    
    
    

    
    

    
    "หมอ", "หุง", "ขาว", "สวยด"
  ],

  
  
  "หนังสือรวมบทความทางวิชาการในการประชุมสัมมนา": [
    "หนังสือ", "รวม", "บทความ", "ทาง", "วิชาการ", "ใน", "การ", "ประชุม", "สัมมนา"
  ],
};

function assertIsSegmentDataObject(obj) {
  
  assertEq(Object.getPrototypeOf(obj), Object.prototype);

  
  let keys = Reflect.ownKeys(obj);
  assertEq(keys.length, 4);
  assertEq(keys[0], "segment");
  assertEq(keys[1], "index");
  assertEq(keys[2], "input");
  assertEq(keys[3], "isWordLike");

  
  assertEq(typeof obj.segment, "string");
  assertEq(typeof obj.index, "number");
  assertEq(typeof obj.input, "string");
  assertEq(typeof obj.isWordLike, "boolean");

  
  assertEq(Number.isInteger(obj.index), true);
  assertEq(obj.index >= 0, true);
  assertEq(obj.index < obj.input.length, true);

  
  assertEq(obj.segment.length > 0, true);

  
  assertEq(obj.input.substr(obj.index, obj.segment.length), obj.segment);

  
  let expectedWordLike = !/^(\p{gc=P}|\p{gc=Zs})+$/u.test(obj.segment);

  
  
  let isThai = /^\p{sc=Thai}+$/u.test(obj.segment);
  let isLastSegment = obj.index + obj.segment.length === obj.input.length;
  if (isThai && isLastSegment) {
    expectedWordLike = false;
  }

  assertEq(obj.isWordLike, expectedWordLike, obj.segment);
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
  let segmenter = new Intl.Segmenter(locale, {granularity: "word"});

  let resolved = segmenter.resolvedOptions();
  assertEq(resolved.locale, locale);
  assertEq(resolved.granularity, "word");

  for (let [string, words] of Object.entries(strings)) {
    let segments = [...segmenter.segment(string)];

    
    segments.forEach(assertIsSegmentDataObject);

    
    assertEq(segments.reduce((acc, {segment}) => acc + segment, ""), string);

    
    assertEq(segments.every(({input}) => input === string), true);

    
    assertEq(isNaN(segments.reduce((acc, {index}) => index > acc ? index : NaN, -Infinity)), false);

    
    assertEqArray(segments.map(({segment}) => segment), words);

    
    assertDeepEq(segmentsFromContaining(segmenter, string), segments);
  }
}

if (typeof reportCompare === "function")
  reportCompare(0, 0);
