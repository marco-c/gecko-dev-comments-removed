



function optDot() { return arguments.length?.foo; }
assertEq(optDot(), undefined);
assertEq(optDot(1, 2, 3), undefined);


function optElem() { return arguments.length?.["toString"]; }
assertEq(typeof optElem(1, 2), "function");



function optCall() {
  try {
    arguments.length?.();
    return "no throw";
  } catch (e) {
    return e.constructor.name;
  }
}
assertEq(optCall(), "TypeError");



function outer() {
  function inner() { return arguments.length?.toString(); }
  return inner();
}
assertEq(outer(1, 2, 3, 4, 5), "0");


function optChain() { return arguments.length?.toString?.(); }
assertEq(optChain(1, 2, 3), "3");

function optChainElemCall() { return arguments.length?.["toString"]?.(); }
assertEq(optChainElemCall(1, 2), "2");

function optChainParens() { return (arguments.length)?.toString(); }
assertEq(optChainParens(1, 2, 3, 4), "4");

function outerChain() {
  function inner() { return arguments.length?.toString?.(); }
  return inner();
}
assertEq(outerChain(1, 2, 3, 4, 5), "0");



function nonOptCall() {
  try {
    arguments.length();
    return "no throw";
  } catch (e) {
    return e.constructor.name;
  }
}
assertEq(nonOptCall(), "TypeError");





function destrArray(a, b, c) {
  [arguments.length] = [99];
  return arguments.length;
}
assertEq(destrArray(1, 2, 3), 99);


function destrObject(a, b) {
  ({ p: arguments.length } = { p: 42 });
  return arguments.length;
}
assertEq(destrObject(1, 2), 42);


function destrForOf(a) {
  for ([arguments.length] of [[7]]) {
  }
  return arguments.length;
}
assertEq(destrForOf(1), 7);


function destrNested(a, b, c, d) {
  [, arguments.length] = [1, 5];
  return arguments.length;
}
assertEq(destrNested(1, 2, 3, 4), 5);


function plainRead(a, b, c) { return arguments.length; }
assertEq(plainRead(1, 2, 3), 3);
