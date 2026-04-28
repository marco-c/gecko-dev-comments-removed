






















var subject = /initial/;
Object.defineProperty(subject, 'lastIndex', { value: 45, writable: false });

assert.throws(TypeError, function() {
  subject.compile(/updated/gi);
});

assert.sameValue(
  subject.toString(),
  new RegExp('updated', 'gi').toString(),
  '[[OriginalSource]] internal slot'
);
assert.sameValue(subject.lastIndex, 45);
