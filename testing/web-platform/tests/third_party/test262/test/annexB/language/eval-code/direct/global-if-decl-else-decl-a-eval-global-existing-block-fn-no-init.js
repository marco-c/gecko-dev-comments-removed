























eval(
  'assert.sameValue(f, undefined);\
  \
  {\
    function f() {}\
  }if (true) function f() {  } else function _f() {}'
);
