var BUGNUMBER = 1801690;
var summary = "indexOf function doesn't work correctly with polish letters";





assertEq("AB".indexOf("Ał"), -1);

if (typeof reportCompare === "function")
  reportCompare(true, true);
