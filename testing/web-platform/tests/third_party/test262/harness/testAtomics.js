


















function testWithAtomicsOutOfBoundsIndices(f) {
  var bad_indices = [
    function(view) { return -1; },
    function(view) { return view.length; },
    function(view) { return view.length * 2; },
    function(view) { return Number.POSITIVE_INFINITY; },
    function(view) { return Number.NEGATIVE_INFINITY; },
    function(view) { return { valueOf: function() { return 125; } }; },
    function(view) { return { toString: function() { return '125'; }, valueOf: false }; }, 
  ];

  for (var i = 0; i < bad_indices.length; ++i) {
    var IdxGen = bad_indices[i];
    try {
      f(IdxGen);
    } catch (e) {
      e.message += ' (Testing with index gen ' + IdxGen + '.)';
      throw e;
    }
  }
}









function testWithAtomicsInBoundsIndices(f) {
  
  var good_indices = [
    function(view) { return 0/-1; },
    function(view) { return '-0'; },
    function(view) { return undefined; },
    function(view) { return NaN; },
    function(view) { return 0.5; },
    function(view) { return '0.5'; },
    function(view) { return -0.9; },
    function(view) { return { password: 'qumquat' }; },
    function(view) { return view.length - 1; },
    function(view) { return { valueOf: function() { return 0; } }; },
    function(view) { return { toString: function() { return '0'; }, valueOf: false }; }, 
  ];

  for (var i = 0; i < good_indices.length; ++i) {
    var IdxGen = good_indices[i];
    try {
      f(IdxGen);
    } catch (e) {
      e.message += ' (Testing with index gen ' + IdxGen + '.)';
      throw e;
    }
  }
}








function testWithAtomicsNonViewValues(f) {
  var values = [
    null,
    undefined,
    true,
    false,
    new Boolean(true),
    10,
    3.14,
    new Number(4),
    'Hi there',
    new Date,
    /a*utomaton/g,
    { password: 'qumquat' },
    new DataView(new ArrayBuffer(10)),
    new ArrayBuffer(128),
    new SharedArrayBuffer(128),
    new Error('Ouch'),
    [1,1,2,3,5,8],
    function(x) { return -x; },
    Symbol('halleluja'),
    
    Object,
    Int32Array,
    Date,
    Math,
    Atomics
  ];

  for (var i = 0; i < values.length; ++i) {
    var nonView = values[i];
    try {
      f(nonView);
    } catch (e) {
      e.message += ' (Testing with non-view value ' + nonView + '.)';
      throw e;
    }
  }
}

