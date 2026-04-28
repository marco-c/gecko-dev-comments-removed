















var date;

date = new Date(1970, 0);
date.setYear(-0.9999999);
assert.sameValue(date.getFullYear(), 1900, 'y = -0.999999');

date = new Date(1970, 0);
date.setYear(-0);
assert.sameValue(date.getFullYear(), 1900, 'y = -0');

date = new Date(1970, 0);
date.setYear(0);
assert.sameValue(date.getFullYear(), 1900, 'y = 0');

date = new Date(1970, 0);
date.setYear(50);
assert.sameValue(date.getFullYear(), 1950, 'y = 50');

date = new Date(1970, 0);
date.setYear(50.999999);
assert.sameValue(date.getFullYear(), 1950, 'y = 50.999999');

date = new Date(1970, 0);
date.setYear(99);
assert.sameValue(date.getFullYear(), 1999, 'y = 99');

date = new Date(1970, 0);
date.setYear(99.999999);
assert.sameValue(date.getFullYear(), 1999, 'y = 99.999999');
