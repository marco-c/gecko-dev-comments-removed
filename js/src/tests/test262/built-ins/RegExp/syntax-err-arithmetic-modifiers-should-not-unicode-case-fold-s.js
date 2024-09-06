













assert.throws(SyntaxError, function () {
  RegExp("(?-ſ:a)", "u");
}, 'RegExp("(?-ſ:a)", "u"): ');

reportCompare(0, 0);
