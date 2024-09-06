













assert.throws(SyntaxError, function () {
  RegExp("(?İ:a)", "iu");
}, 'RegExp("(?İ:a)", "iu"): ');

reportCompare(0, 0);
