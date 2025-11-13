








var source = `class A {
  // Ensure this name parses.
  #℘;
}`;

Function(source);

reportCompare(0, 0);
