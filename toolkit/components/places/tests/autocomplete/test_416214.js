















var theTag = "superTag";


var kURIs = [
  "http://escaped/ユニコード",
  "http://asciiescaped/blocking-firefox3%2B",
];
var kTitles = [
  "title",
  theTag,
];


addPageBook(0, 0, 0, [1]);
addPageBook(1, 0, 0, [1]);



var gTests = [
  ["0: Make sure tag matches return the right url as well as '+' remain escaped",
   theTag, [0,1]],
];
