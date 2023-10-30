

matiter!(ascii1, r"(?-u:\b)x(?-u:\b)", "áxβ", (2, 3));
matiter!(ascii2, r"(?-u:\B)x(?-u:\B)", "áxβ");
matiter!(ascii3, r"(?-u:\B)", "0\u{7EF5E}", (2, 2), (3, 3), (4, 4), (5, 5));


matiter!(unicode1, r"\bx\b", "áxβ");
matiter!(unicode2, r"\Bx\B", "áxβ", (2, 3));
