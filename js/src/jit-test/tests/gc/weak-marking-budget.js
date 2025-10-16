

gczeal(0); 

var maps = Array(1000).fill().map(() => new WeakMap);
for (const map of maps) {
    for (let i = 0; i < 100; i++) {
        map.set({}, {}); 
    }
}


startgc(10);
while (["Prepare", "MarkRoots"].includes(gcstate())) {
    gcslice(10);
}
assertEq(gcstate(), "Mark");



print("gcslice(10000) #1");
gcslice(10000);
assertEq(gcstate(), "Mark");



print("gcslice(10000) #2");
gcslice(10000);
assertEq(gcstate(), "Sweep");
hasFunction["currentgc"] && assertEq(currentgc().finishMarkingDuringSweeping, true);




print("gcslice(1) #3");


gcslice(100);
assertEq(gcstate(), "Sweep");
hasFunction["currentgc"] && assertEq(currentgc().finishMarkingDuringSweeping, false);



finishgc();





startgc(10);
while (["Prepare", "MarkRoots"].includes(gcstate())) {
    gcslice(10);
}
assertEq(gcstate(), "Mark");

gcslice(10000);
assertEq(gcstate(), "Mark");

gcslice(1);
assertEq(gcstate(), "Sweep");
hasFunction["currentgc"] && assertEq(currentgc().finishMarkingDuringSweeping, false);

gcslice(1);
assertEq(gcstate(), "Sweep");
hasFunction["currentgc"] && assertEq(currentgc().finishMarkingDuringSweeping, false);
