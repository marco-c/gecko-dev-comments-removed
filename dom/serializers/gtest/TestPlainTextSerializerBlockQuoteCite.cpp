





#include "Common.h"
#include "gtest/gtest.h"
#include "nsCRT.h"
#include "nsIDocumentEncoder.h"
#include "nsIParserUtils.h"
#include "nsServiceManagerUtils.h"
#include "nsString.h"

TEST(PlainTextSerializerBlockQuoteCite, BlockQuoteCite)
{
  nsAutoString test;
  test.AppendLiteral(u"<blockquote type=cite>hello world</blockquote>");

  const uint32_t wrapColumn = 10;
  ConvertBufToPlainText(test,
                        nsIDocumentEncoder::OutputFormatted |
                            nsIDocumentEncoder::OutputFormatFlowed |
                            nsIDocumentEncoder::OutputCRLineBreak |
                            nsIDocumentEncoder::OutputLFLineBreak,
                        wrapColumn);

  constexpr auto expect = NS_LITERAL_STRING_FROM_CSTRING(
      "> hello \r\n"
      "> world\r\n");

  ASSERT_EQ(test, expect) << "Wrong blockquote cite to text serialization";
}
