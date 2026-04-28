






function assertIteratorResult(result, value, done) {
    assert.sameValue(result.value, value);
    assert.sameValue(result.done, done);
}
function assertIteratorNext(iter, value) {
    assertIteratorResult(iter.next(), value, false);
}
function assertIteratorDone(iter, value) {
    assertIteratorResult(iter.next(), value, true);
}
