












const date = new Temporal.PlainYearMonth(2000, 5, "gregory");

assert(date.toLocaleString("en", { era: "narrow" }).startsWith("5"), "toLocaleString on a PlainYearMonth with era option should work");

reportCompare(0, 0);
