












const date = new Temporal.PlainDate(2000, 5, 2, "gregory");

assert(date.toLocaleString("en", { era: "narrow" }).startsWith("5"), "toLocaleString on a PlainDate with era option should work");

reportCompare(0, 0);
