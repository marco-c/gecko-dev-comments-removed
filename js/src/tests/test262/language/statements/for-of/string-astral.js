










var string = 'a\ud801\udc28b\ud801\udc28';
var first = 'a';
var second = '𐐨';
var third = 'b';
var fourth = '𐐨';

var iterationCount = 0;

for (var value of string) {
  assert.sameValue(value, first);
  first = second;
  second = third;
  third = fourth;
  fourth = null;
  iterationCount += 1;
}

assert.sameValue(iterationCount, 4);

reportCompare(0, 0);
