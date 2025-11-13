







var BUGNUMBER = 1801690;
var summary = "indexOf function doesn't work correctly with polish letters";





assert.sameValue("AB".indexOf("Ał"), -1);


reportCompare(0, 0);
