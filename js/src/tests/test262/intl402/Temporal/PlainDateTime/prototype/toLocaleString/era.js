












var date = new Temporal.PlainDateTime(2000, 5, 2, 14, 46, 0, 0, 0, 0, "gregory");

assert(date.toLocaleString("en", { era: "narrow" }).startsWith("5"), "toLocaleString on a PlainDateTime with era option should work");

reportCompare(0, 0);
