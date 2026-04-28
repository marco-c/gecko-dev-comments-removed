














eval(
  'assert.sameValue(f, undefined);\
  \
  {\
    function f() {}\
  }switch (1) {' +
  '  case 1:' +
  '    function f() {  }' +
  '}\
  '
);
