














(0,eval)(
  'assert.sameValue(f, undefined);\
  \
  {\
    function f() {}\
  }switch (1) {' +
  '  default:' +
  '    function f() {  }' +
  '}\
  '
);
