










var obj = {};
var data = "data";
var dateObj = new Date(0);

dateObj.set = function(value) {
  data = value;
};

Object.defineProperty(obj, "property", dateObj);
obj.property = "overrideData";

assert(obj.hasOwnProperty("property"), 'obj.hasOwnProperty("property") !== true');
assert.sameValue(data, "overrideData", 'data');

reportCompare(0, 0);
