





#ifndef dom_serializers_gtest_Common_h
#define dom_serializers_gtest_Common_h

#include "nsIParserUtils.h"
#include "nsServiceManagerUtils.h"
#include "nsString.h"

const uint32_t kDefaultWrapColumn = 72;

void ConvertBufToPlainText(nsString& aConBuf, int aFlag, uint32_t aWrapColumn) {
  nsCOMPtr<nsIParserUtils> utils = do_GetService(NS_PARSERUTILS_CONTRACTID);
  utils->ConvertToPlainText(aConBuf, aFlag, aWrapColumn, aConBuf);
}

#endif  
