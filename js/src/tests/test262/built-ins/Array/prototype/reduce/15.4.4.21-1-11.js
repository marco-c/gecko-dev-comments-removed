







function callbackfn(prevVal, curVal, idx, obj) {
  return obj instanceof Date;
}

var obj = new Date(0);
obj.length = 1;
obj[0] = 1;

assert(Array.prototype.reduce.call(obj, callbackfn, 1), 'Array.prototype.reduce.call(obj, callbackfn, 1) !== true');

reportCompare(0, 0);
