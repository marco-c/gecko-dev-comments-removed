

function testDefaultCaseMapping() {
  for (var i = 0; i < 100; ++i) {
    assertEq("TURKISH I".toLocaleLowerCase(), "turkish i");
  }
}

function testTurkishCaseMapping() {
  for (var i = 0; i < 100; ++i) {
    assertEq("TURKISH I".toLocaleLowerCase(), "turk\u{131}sh \u{131}");
  }
}


assertEq(
  getDefaultLocale() === "en-US" || getDefaultLocale() === "en-US-POSIX",
  true
);
assertEq(getRealmLocale(), "en-US");


assertEq(getFuseState().DefaultLocaleHasDefaultCaseMappingFuse.intact, true);


testDefaultCaseMapping();


setDefaultLocale("fra-FR");
assertEq(getDefaultLocale(), "fra-FR");
assertEq(getRealmLocale(), "fr-FR");


assertEq(getFuseState().DefaultLocaleHasDefaultCaseMappingFuse.intact, true);


testDefaultCaseMapping();


setDefaultLocale("tur-TR");
assertEq(getDefaultLocale(), "tur-TR");
assertEq(getRealmLocale(), "tr-TR");


assertEq(getFuseState().DefaultLocaleHasDefaultCaseMappingFuse.intact, false);

testTurkishCaseMapping();


setDefaultLocale("eng-US");
assertEq(getDefaultLocale(), "eng-US");
assertEq(getRealmLocale(), "en-US");


assertEq(getFuseState().DefaultLocaleHasDefaultCaseMappingFuse.intact, false);


testDefaultCaseMapping();
