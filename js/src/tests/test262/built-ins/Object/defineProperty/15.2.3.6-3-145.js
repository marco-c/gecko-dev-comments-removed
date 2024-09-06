










var obj = {};

var dateObj = new Date(0);

dateObj.value = "Date";

Object.defineProperty(obj, "property", dateObj);

assert.sameValue(obj.property, "Date", 'obj.property');

reportCompare(0, 0);
