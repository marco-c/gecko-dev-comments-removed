























eval(
  'assert.sameValue(f(), "outer declaration");if (false) ; else function f() { return "inner declaration"; }function f() {\
    return "outer declaration";\
  }'
);
