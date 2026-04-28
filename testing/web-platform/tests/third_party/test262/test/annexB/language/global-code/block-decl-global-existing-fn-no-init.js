













assert.sameValue(f(), 'outer declaration');

{
  function f() { return 'inner declaration'; }
}

function f() {
  return 'outer declaration';
}
