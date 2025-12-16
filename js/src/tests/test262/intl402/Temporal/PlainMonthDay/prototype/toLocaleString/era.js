












const date = new Temporal.PlainMonthDay(5, 2, "gregory");

assert(date.toLocaleString("en", { era: "narrow" }).startsWith("5"), "toLocaleString on a PlainMonthDay with era option should work");

reportCompare(0, 0);
