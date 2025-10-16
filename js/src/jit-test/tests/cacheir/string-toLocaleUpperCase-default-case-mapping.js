

function testDefaultCaseMapping() {
  for (var i = 0; i < 100; ++i) {
    assertEq("turkish i".toLocaleUpperCase(), "TURKISH I");
  }
}

function testTurkishCaseMapping() {
  for (var i = 0; i < 100; ++i) {
    assertEq("turkish i".toLocaleUpperCase(), "TURK\u{130}SH \u{130}");
  }
}


assertEq(
  getDefaultLocale() === "en-US" || getDefaultLocale() === "en-US-POSIX",
  true
);
assertEq(getRealmLocale(), "en-US");


assertEq(getFuseState().DefaultLocaleHasDefaultCaseMappingFuse.intact, true);


testDefaultCaseMapping();


setDefaultLocale("fr-FR");
assertEq(getDefaultLocale(), "fr-FR");
assertEq(getRealmLocale(), "fr-FR");


assertEq(getFuseState().DefaultLocaleHasDefaultCaseMappingFuse.intact, true);


testDefaultCaseMapping();


setDefaultLocale("tr-TR");
assertEq(getDefaultLocale(), "tr-TR");
assertEq(getRealmLocale(), "tr-TR");


assertEq(getFuseState().DefaultLocaleHasDefaultCaseMappingFuse.intact, false);

testTurkishCaseMapping();


setDefaultLocale("en-US");
assertEq(getDefaultLocale(), "en-US");
assertEq(getRealmLocale(), "en-US");


assertEq(getFuseState().DefaultLocaleHasDefaultCaseMappingFuse.intact, false);


testDefaultCaseMapping();
