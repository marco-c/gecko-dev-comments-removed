














function assertIteratorResult(result, value, done, label) {
  assert.sameValue(
    Object.getPrototypeOf(result),
    Object.prototype,
    label + ": [[Prototype]] of iterator result is Object.prototype"
  );

  assert(Object.isExtensible(result), label + ": iterator result is extensible");

  var ownKeys = Reflect.ownKeys(result);
  assert.compareArray(ownKeys, ["value", "done"], label + ": iterator result properties");

  verifyProperty(result, "value", {
    value: value,
    writable: true,
    enumerable: true,
    configurable: true,
  });

  verifyProperty(result, "done", {
    value: done,
    writable: true,
    enumerable: true,
    configurable: true,
  });
}


function assertIsPackedArray(array, label) {
  assert(Array.isArray(array), label + ": array is an array exotic object");

  assert.sameValue(
    Object.getPrototypeOf(array),
    Array.prototype,
    label + ": [[Prototype]] of array is Array.prototype"
  );

  assert(Object.isExtensible(array), label + ": array is extensible");

  
  verifyProperty(array, "length", {
    writable: true,
    enumerable: false,
    configurable: false,
  });

  
  for (var i = 0; i < array.length; i++) {
    verifyProperty(array, i, {
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }
}


function _assertIsNullProtoMutableObject(object, label) {
  assert.sameValue(
    Object.getPrototypeOf(object),
    null,
    label + ": [[Prototype]] of object is null"
  );

  assert(Object.isExtensible(object), label + ": object is extensible");

  
  var keys = Object.getOwnPropertyNames(object);
  for (var i = 0; i < keys.length; i++) {
    verifyProperty(object, keys[i], {
      writable: true,
      enumerable: true,
      configurable: true,
    });
  }
}




function assertZipped(zipped, inputs, count, label) {
  
  var last = null;

  for (var i = 0; i < count; i++) {
    var itemLabel = label + ", step " + i;

    var result = zipped.next();
    var value = result.value;

    
    assertIteratorResult(result, value, false, itemLabel);

    
    assert.notSameValue(value, last, itemLabel + ": returns a new array");
    last = value;

    
    var expected = inputs.map(function (array) {
      return array[i];
    });
    assert.compareArray(value, expected, itemLabel + ": values");

    
    assertIsPackedArray(value, itemLabel);
  }
}




function assertZippedKeyed(zipped, inputs, count, label) {
  
  var last = null;

  var expectedKeys = Object.keys(inputs);

  for (var i = 0; i < count; i++) {
    var itemLabel = label + ", step " + i;

    var result = zipped.next();
    var value = result.value;

    
    assertIteratorResult(result, value, false, itemLabel);

    
    assert.notSameValue(value, last, itemLabel + ": returns a new object");
    last = value;

    
    assert.compareArray(Reflect.ownKeys(value), expectedKeys, itemLabel + ": result object keys");

    var expectedValues = Object.values(inputs).map(function (array) {
      return array[i];
    });
    assert.compareArray(Object.values(value), expectedValues, itemLabel + ": result object values");

    
    _assertIsNullProtoMutableObject(value, itemLabel);
  }
}

function forEachSequenceCombinationKeyed(callback) {
  return forEachSequenceCombination(function(inputs, inputsLabel, min, max) {
    var object = {};
    for (var i = 0; i < inputs.length; ++i) {
      object["prop_" + i] = inputs[i];
    }
    inputsLabel = "inputs = " + JSON.stringify(object);
    callback(object, inputsLabel, min, max);
  });
}

function forEachSequenceCombination(callback) {
  function test(inputs) {
    if (inputs.length === 0) {
      callback(inputs, "inputs = []", 0, 0);
      return;
    }

    var lengths = inputs.map(function(array) {
      return array.length;
    });

    var min = Math.min.apply(null, lengths);
    var max = Math.max.apply(null, lengths);

    var inputsLabel = "inputs = " + JSON.stringify(inputs);

    callback(inputs, inputsLabel, min, max);
  }

  
  function* prefixes(s) {
    for (var i = 0; i <= s.length; ++i) {
      yield s.slice(0, i);
    }
  }

  
  test([]);

  
  for (var prefix of prefixes("abcd")) {
    test([prefix.split("")]);
  }

  
  for (var prefix1 of prefixes("abcd")) {
    for (var prefix2 of prefixes("efgh")) {
      test([prefix1.split(""), prefix2.split("")]);
    }
  }

  
  for (var prefix1 of prefixes("abcd")) {
    for (var prefix2 of prefixes("efgh")) {
      for (var prefix3 of prefixes("ijkl")) {
        test([prefix1.split(""), prefix2.split(""), prefix3.split("")]);
      }
    }
  }
}
