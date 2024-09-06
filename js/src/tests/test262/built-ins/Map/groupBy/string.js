












const string = '🥰💩🙏😈';

const map = Map.groupBy(string, function (char) {
  return char < '🙏' ? 'before' : 'after';
});

assert.compareArray(Array.from(map.keys()), ['after', 'before']);
assert.compareArray(map.get('before'), ['💩', '😈']);
assert.compareArray(map.get('after'), ['🥰', '🙏']);

reportCompare(0, 0);
