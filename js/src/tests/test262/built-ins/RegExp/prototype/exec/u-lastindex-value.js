


























var r = /./ug;
r.exec('𝌆');
assert.sameValue(r.lastIndex, 2);

reportCompare(0, 0);
