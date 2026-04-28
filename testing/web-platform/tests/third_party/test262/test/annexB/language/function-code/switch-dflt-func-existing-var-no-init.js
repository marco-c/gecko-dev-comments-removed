













var init;

(function() {
  var f = 123;
  init = f;

  switch (1) {
    default:
      function f() {  }
  }

  
}());

assert.sameValue(init, 123);
