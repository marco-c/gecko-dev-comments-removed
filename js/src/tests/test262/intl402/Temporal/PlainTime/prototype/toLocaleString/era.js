












const date = new Temporal.PlainTime(14, 46);

const result = date.toLocaleString("en", { era: "narrow" });

assert(result.startsWith("2"), "toLocaleString on a PlainTime with era option should work");
assert(!result.includes("A"), "era should be ignored when formatting a PlainTime");

reportCompare(0, 0);
