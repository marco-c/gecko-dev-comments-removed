


#include "gtest/gtest.h"

#include "mozilla/intl/String.h"
#include "mozilla/Span.h"
#include "mozilla/TextUtils.h"
#include "mozilla/Try.h"

#include <algorithm>

#include "TestBuffer.h"

namespace mozilla::intl {

static Result<std::u16string_view, ICUError> ToLocaleLowerCase(
    const char* aLocale, const char16_t* aString,
    TestBuffer<char16_t>& aBuffer) {
  aBuffer.clear();

  MOZ_TRY(String::ToLocaleLowerCase(aLocale, MakeStringSpan(aString), aBuffer));

  return aBuffer.get_string_view();
}

static Result<std::u16string_view, ICUError> ToLocaleUpperCase(
    const char* aLocale, const char16_t* aString,
    TestBuffer<char16_t>& aBuffer) {
  aBuffer.clear();

  MOZ_TRY(String::ToLocaleUpperCase(aLocale, MakeStringSpan(aString), aBuffer));

  return aBuffer.get_string_view();
}

TEST(IntlString, ToLocaleLowerCase)
{
  TestBuffer<char16_t> buf;

  ASSERT_EQ(ToLocaleLowerCase("en", u"test", buf).unwrap(), u"test");
  ASSERT_EQ(ToLocaleLowerCase("en", u"TEST", buf).unwrap(), u"test");

  
  ASSERT_EQ(ToLocaleLowerCase("tr", u"I", buf).unwrap(), u"ı");
  ASSERT_EQ(ToLocaleLowerCase("tr", u"İ", buf).unwrap(), u"i");
  ASSERT_EQ(ToLocaleLowerCase("tr", u"I\u0307", buf).unwrap(), u"i");
}

TEST(IntlString, ToLocaleUpperCase)
{
  TestBuffer<char16_t> buf;

  ASSERT_EQ(ToLocaleUpperCase("en", u"test", buf).unwrap(), u"TEST");
  ASSERT_EQ(ToLocaleUpperCase("en", u"TEST", buf).unwrap(), u"TEST");

  
  ASSERT_EQ(ToLocaleUpperCase("tr", u"i", buf).unwrap(), u"İ");
  ASSERT_EQ(ToLocaleUpperCase("tr", u"ı", buf).unwrap(), u"I");

  
  ASSERT_EQ(ToLocaleUpperCase("en", u"Größenmaßstäbe", buf).unwrap(),
            u"GRÖSSENMASSSTÄBE");
}

TEST(IntlString, ComposePairNFC)
{
  
  ASSERT_EQ(String::ComposePairNFC(U'a', U'b'), U'\0');
  
  ASSERT_EQ(String::ComposePairNFC(U'a', U'\u0308'), U'ä');
  
  ASSERT_EQ(String::ComposePairNFC(U'ä', U'\u0304'), U'ǟ');
  
  
  ASSERT_EQ(String::ComposePairNFC(U'ä', U'\u0301'), U'\0');
  
  
  ASSERT_EQ(String::ComposePairNFC(U'\u0308', U'\u0301'), U'\0');
  
  ASSERT_EQ(String::ComposePairNFC(U'\U00011099', U'\U000110BA'),
            U'\U0001109A');
}

TEST(IntlString, DecomposeRawNFD)
{
  char32_t buf[2];
  
  ASSERT_EQ(String::DecomposeRawNFD(U'a', buf), 0);
  
  ASSERT_EQ(String::DecomposeRawNFD(U'\u212A', buf), 1);
  ASSERT_EQ(buf[0], U'K');
  
  ASSERT_EQ(String::DecomposeRawNFD(U'ä', buf), 2);
  ASSERT_EQ(buf[0], U'a');
  ASSERT_EQ(buf[1], U'\u0308');
  
  ASSERT_EQ(String::DecomposeRawNFD(U'ǟ', buf), 2);
  ASSERT_EQ(buf[0], U'ä');
  ASSERT_EQ(buf[1], U'\u0304');
  
  ASSERT_EQ(String::DecomposeRawNFD(U'\u0344', buf), 2);
  ASSERT_EQ(buf[0], U'\u0308');
  ASSERT_EQ(buf[1], U'\u0301');
  
  ASSERT_EQ(String::DecomposeRawNFD(U'\U0001109A', buf), 2);
  ASSERT_EQ(buf[0], U'\U00011099');
  ASSERT_EQ(buf[1], U'\U000110BA');
}

TEST(IntlString, IsCased)
{
  ASSERT_TRUE(String::IsCased(U'a'));
  ASSERT_FALSE(String::IsCased(U'0'));
}

TEST(IntlString, IsCaseIgnorable)
{
  ASSERT_FALSE(String::IsCaseIgnorable(U'a'));
  ASSERT_TRUE(String::IsCaseIgnorable(U'.'));
}

TEST(IntlString, GetUnicodeVersion)
{
  auto version = String::GetUnicodeVersion();

  ASSERT_TRUE(std::all_of(version.begin(), version.end(), [](char ch) {
    return IsAsciiDigit(ch) || ch == '.';
  }));
}

}  
