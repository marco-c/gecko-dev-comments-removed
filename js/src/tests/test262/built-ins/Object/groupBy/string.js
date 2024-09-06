












const string = '🥰💩🙏😈';

const obj = Object.groupBy(string, function (char) {
  return char < '🙏' ? 'before' : 'after';
});

assert.compareArray(Object.keys(obj), ['after', 'before']);
assert.compareArray(obj.before, ['💩', '😈']);
assert.compareArray(obj.after, ['🥰', '🙏']);

reportCompare(0, 0);
