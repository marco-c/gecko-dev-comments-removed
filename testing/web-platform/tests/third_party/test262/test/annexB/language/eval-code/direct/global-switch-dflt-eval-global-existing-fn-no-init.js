














eval(
  'assert.sameValue(f(), "outer declaration");switch (1) {' +
  '  default:' +
  '    function f() { return "inner declaration"; }' +
  '}\
  function f() {\
    return "outer declaration";\
  }'
);
