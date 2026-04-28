













var init;

(function() {
  var f = 123;
  init = f;

  {
    function f() {  }
  }

  
}());

assert.sameValue(init, 123);
