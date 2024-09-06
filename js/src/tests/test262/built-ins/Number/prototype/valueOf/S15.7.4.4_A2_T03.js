











var s1 = new Date(0);
Object.defineProperty(s1, "valueOf", {value: Number.prototype.valueOf});
try {
  var v1 = s1.valueOf();
  throw new Test262Error('#1: Number.prototype.valueOf on not a Number object should throw TypeError');
}
catch (e) {
  assert(e instanceof TypeError, 'The result of evaluating (e instanceof TypeError) is expected to be true');
}

var s2 = new Date(0);
s2.myValueOf = Number.prototype.valueOf;
try {
  var v2 = s2.myValueOf();
  throw new Test262Error('#2: Number.prototype.valueOf on not a Number object should throw TypeError');
}
catch (e) {
  assert(e instanceof TypeError, 'The result of evaluating (e instanceof TypeError) is expected to be true');
}

reportCompare(0, 0);
