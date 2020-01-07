









var obj = {};
Object.defineProperty(obj, "123αβπcd", {});

assert(obj.hasOwnProperty("123αβπcd"), 'obj.hasOwnProperty("123αβπcd") !== true');

reportCompare(0, 0);
