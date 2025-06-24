



use icu_locale_core::{langid, LanguageIdentifier};
use icu_segmenter::options::LineBreakOptions;
use icu_segmenter::options::LineBreakStrictness;
use icu_segmenter::options::LineBreakWordOption;
use icu_segmenter::LineSegmenter;

fn check_with_options(
    s: &str,
    mut expect_utf8: Vec<usize>,
    mut expect_utf16: Vec<usize>,
    options: LineBreakOptions,
) {
    let segmenter = LineSegmenter::new_dictionary(options);

    let iter = segmenter.segment_str(s);
    let result: Vec<usize> = iter.collect();
    expect_utf8.insert(0, 0);
    assert_eq!(expect_utf8, result, "{s}");

    let s_utf16: Vec<u16> = s.encode_utf16().collect();
    let iter = segmenter.segment_utf16(&s_utf16);
    let result: Vec<usize> = iter.collect();
    expect_utf16.insert(0, 0);
    assert_eq!(expect_utf16, result, "{s}");
}

static JA: LanguageIdentifier = langid!("ja");

fn strict(s: &str, ja_zh: bool, expect_utf8: Vec<usize>, expect_utf16: Vec<usize>) {
    let mut options = LineBreakOptions::default();
    options.strictness = Some(LineBreakStrictness::Strict);
    options.word_option = Some(LineBreakWordOption::Normal);
    options.content_locale = ja_zh.then_some(&JA);
    check_with_options(s, expect_utf8, expect_utf16, options);
}

fn normal(s: &str, ja_zh: bool, expect_utf8: Vec<usize>, expect_utf16: Vec<usize>) {
    let mut options = LineBreakOptions::default();
    options.strictness = Some(LineBreakStrictness::Normal);
    options.word_option = Some(LineBreakWordOption::Normal);
    options.content_locale = ja_zh.then_some(&JA);
    check_with_options(s, expect_utf8, expect_utf16, options);
}

fn loose(s: &str, ja_zh: bool, expect_utf8: Vec<usize>, expect_utf16: Vec<usize>) {
    let mut options = LineBreakOptions::default();
    options.strictness = Some(LineBreakStrictness::Loose);
    options.word_option = Some(LineBreakWordOption::Normal);
    options.content_locale = ja_zh.then_some(&JA);
    check_with_options(s, expect_utf8, expect_utf16, options);
}

fn anywhere(s: &str, ja_zh: bool, expect_utf8: Vec<usize>, expect_utf16: Vec<usize>) {
    let mut options = LineBreakOptions::default();
    options.strictness = Some(LineBreakStrictness::Anywhere);
    options.word_option = Some(LineBreakWordOption::Normal);
    options.content_locale = ja_zh.then_some(&JA);
    check_with_options(s, expect_utf8, expect_utf16, options);
}

#[test]
fn linebreak_strict() {
    
    strict("サ\u{3041}サ", false, vec![6, 9], vec![2, 3]);

    
    strict("サ\u{30FC}サ", false, vec![6, 9], vec![2, 3]);

    
    strict("サ\u{301C}サ", false, vec![6, 9], vec![2, 3]);

    
    strict("サ\u{3005}サ", false, vec![6, 9], vec![2, 3]);

    
    
    strict("サ\u{2025}\u{2025}サ", false, vec![9, 12], vec![3, 4]);

    
    strict("サ\u{30FB}サ", false, vec![6, 9], vec![2, 3]);

    
    strict("サ\u{00B0}サ", false, vec![5, 8], vec![2, 3]);

    
    

    
    
    
    
    
}

#[test]
fn linebreak_normal() {
    
    normal("サ\u{3041}サ", false, vec![3, 6, 9], vec![1, 2, 3]);

    
    normal("サ\u{30FC}サ", false, vec![3, 6, 9], vec![1, 2, 3]);

    
    normal("サ\u{301C}サ", true, vec![3, 6, 9], vec![1, 2, 3]);

    
    normal("サ\u{3005}サ", true, vec![6, 9], vec![2, 3]);

    
    normal("サ\u{2025}\u{2025}サ", true, vec![9, 12], vec![3, 4]);

    
    normal("サ\u{30FB}サ", true, vec![6, 9], vec![2, 3]);

    
    normal("サ\u{00B0}サ", true, vec![5, 8], vec![2, 3]);

    
    normal("サ\u{20AC}サ", true, vec![3, 9], vec![1, 3]);

    
    
    
    
    
}

#[test]
fn linebreak_loose() {
    
    loose("サ\u{3041}サ", true, vec![3, 6, 9], vec![1, 2, 3]);

    
    loose("サ\u{30FC}サ", true, vec![3, 6, 9], vec![1, 2, 3]);

    
    loose("サ\u{301C}サ", true, vec![3, 6, 9], vec![1, 2, 3]);

    
    loose("サ\u{3005}サ", true, vec![3, 6, 9], vec![1, 2, 3]);

    
    loose(
        "サ\u{2025}\u{2025}サ",
        true,
        vec![3, 6, 9, 12],
        vec![1, 2, 3, 4],
    );

    
    loose("サ\u{30FB}サ", true, vec![3, 6, 9], vec![1, 2, 3]);

    
    loose("サ\u{00B0}サ", true, vec![3, 5, 8], vec![1, 2, 3]);

    
    loose("文\u{20AC}文", true, vec![3, 6, 9], vec![1, 2, 3]);
    loose("文\u{2116}文", true, vec![3, 6, 9], vec![1, 2, 3]);
    loose("文\u{ff04}文", true, vec![3, 6, 9], vec![1, 2, 3]);
    loose("文\u{ffe1}文", true, vec![3, 6, 9], vec![1, 2, 3]);
    loose("文\u{ffe5}文", true, vec![3, 6, 9], vec![1, 2, 3]);

    
    loose("文\u{00b1}文", true, vec![3, 5, 8], vec![1, 2, 3]);
    loose("文\u{20ac}文", true, vec![3, 6, 9], vec![1, 2, 3]);
    loose("文\u{ff04}文", true, vec![3, 6, 9], vec![1, 2, 3]);

    
    loose("文\u{2024}文", false, vec![3, 6, 9], vec![1, 2, 3]);
    loose("文\u{2025}文", false, vec![3, 6, 9], vec![1, 2, 3]);
    loose("文\u{2026}文", false, vec![3, 6, 9], vec![1, 2, 3]);
    loose("文\u{22ef}文", false, vec![3, 6, 9], vec![1, 2, 3]);
    loose("文\u{fe19}文", false, vec![3, 6, 9], vec![1, 2, 3]);

    
    
    
    
    

    
    loose("文\u{2024}文", true, vec![3, 6, 9], vec![1, 2, 3]);
    loose("文\u{2025}文", true, vec![3, 6, 9], vec![1, 2, 3]);
    loose("文\u{2026}文", true, vec![3, 6, 9], vec![1, 2, 3]);
    loose("文\u{22ef}文", true, vec![3, 6, 9], vec![1, 2, 3]);
    loose("文\u{fe19}文", true, vec![3, 6, 9], vec![1, 2, 3]);

    
    loose("文\u{2010}文", true, vec![3, 6, 9], vec![1, 2, 3]);
    loose("文\u{2013}文", true, vec![3, 6, 9], vec![1, 2, 3]);

    
    loose("aa\u{2010}", false, vec![5], vec![3]);
    loose("aa\u{2013}", false, vec![5], vec![3]);
}

#[test]
fn linebreak_anywhere() {
    
    anywhere(
        "aa-a.a)a,a) a\u{00A0}aa\u{2060}a\u{200D}a･a",
        true,
        vec![
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 16, 17, 20, 21, 24, 25, 28, 29,
        ],
        vec![
            1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
        ],
    );

    
    anywhere(
        "no hyphenation",
        false,
        vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
        vec![1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
    );

    
    anywhere("latin", false, vec![1, 2, 3, 4, 5], vec![1, 2, 3, 4, 5]);

    
    anywhere(
        "XX XXX",
        false,
        vec![1, 2, 3, 4, 5, 6],
        vec![1, 2, 3, 4, 5, 6],
    );

    
    anywhere("X X", false, vec![1, 2, 3], vec![1, 2, 3]);

    
    anywhere(
        "XXXX\u{00A0}XXXX",
        false,
        vec![1, 2, 3, 4, 6, 7, 8, 9, 10],
        vec![1, 2, 3, 4, 5, 6, 7, 8, 9],
    );

    
    anywhere(
        "X XX...",
        true,
        vec![1, 2, 3, 4, 5, 6, 7],
        vec![1, 2, 3, 4, 5, 6, 7],
    );

    
    anywhere(
        "X XX...",
        true,
        vec![1, 2, 3, 4, 5, 6, 7],
        vec![1, 2, 3, 4, 5, 6, 7],
    );

    
    anywhere("X\u{00A0}X", true, vec![1, 3, 4], vec![1, 2, 3]);

    
    anywhere(
        "XXXX\u{00A0}XXXX",
        true,
        vec![1, 2, 3, 4, 6, 7, 8, 9, 10],
        vec![1, 2, 3, 4, 5, 6, 7, 8, 9],
    );

    
    anywhere("XX///", true, vec![1, 2, 3, 4, 5], vec![1, 2, 3, 4, 5]);

    
    anywhere(
        "X XX\\\\\\",
        true,
        vec![1, 2, 3, 4, 5, 6, 7],
        vec![1, 2, 3, 4, 5, 6, 7],
    );

    
    anywhere("XXX/X", true, vec![1, 2, 3, 4, 5], vec![1, 2, 3, 4, 5]);

    
    anywhere("XXX\\X", false, vec![1, 2, 3, 4, 5], vec![1, 2, 3, 4, 5]);

    
    anywhere("XXX\\X", false, vec![1, 2, 3, 4, 5], vec![1, 2, 3, 4, 5]);

    
    anywhere("XXX/X", false, vec![1, 2, 3, 4, 5], vec![1, 2, 3, 4, 5]);

    
    anywhere(
        "XXXX X",
        false,
        vec![1, 2, 3, 4, 5, 6],
        vec![1, 2, 3, 4, 5, 6],
    );

    
    anywhere(
        "XX\u{2060}XX",
        false,
        vec![1, 2, 5, 6, 7],
        vec![1, 2, 3, 4, 5],
    );

    
    anywhere(
        "..\u{200B}...X",
        false,
        vec![1, 2, 5, 6, 7, 8, 9],
        vec![1, 2, 3, 4, 5, 6, 7],
    );
}
