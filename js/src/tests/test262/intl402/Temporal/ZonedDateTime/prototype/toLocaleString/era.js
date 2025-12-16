












const zdt = new Temporal.ZonedDateTime(0n, "UTC");

assert(zdt.toLocaleString("en", { era: "narrow" }).startsWith("1"), "toLocaleString on a ZonedDateTime with era option should work");

reportCompare(0, 0);
