






















var init;

(function() {
  eval(
    'var f = 123;\
    init = f;if (true) function f() {  }'
  );
}());

assert.sameValue(init, 123);
