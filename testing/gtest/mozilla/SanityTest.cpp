



#include "gtest/gtest.h"
#include "gmock/gmock.h"
#include "mozilla/Preferences.h"
#include "mozilla/gtest/ScopedPrefSetter.h"

using ::testing::AtLeast;



TEST(MozillaGTestSanity, Runs)
{
  EXPECT_EQ(1, 1);
}

TEST(ScopedPrefSetter, MultiplePrefs)
{
  constexpr auto kFirstPref = "test.scoped-pref-setter.first";
  constexpr auto kSecondPref = "test.scoped-pref-setter.second";
  mozilla::ScopedPrefSetter initialFirstPref(kFirstPref, false);
  mozilla::ScopedPrefSetter initialSecondPref(kSecondPref, true);

  {
    mozilla::ScopedPrefSetter prefs({{kFirstPref, true}, {kSecondPref, false}});
    EXPECT_TRUE(mozilla::Preferences::GetBool(kFirstPref));
    EXPECT_FALSE(mozilla::Preferences::GetBool(kSecondPref));
  }

  EXPECT_FALSE(mozilla::Preferences::GetBool(kFirstPref));
  EXPECT_TRUE(mozilla::Preferences::GetBool(kSecondPref));
}

namespace {
class TestMock {
 public:
  TestMock() {}
  MOCK_METHOD0(MockedCall, void());
};
}  
TEST(MozillaGMockSanity, Runs)
{
  TestMock mockedClass;
  EXPECT_CALL(mockedClass, MockedCall()).Times(AtLeast(3));

  mockedClass.MockedCall();
  mockedClass.MockedCall();
  mockedClass.MockedCall();
}
