






















var init;

(function() {
  var f = 123;
  init = f;

  if (false) function _f() {} else function f() {  }

  
}());

assert.sameValue(init, 123);
