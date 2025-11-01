





#ifndef mozilla_dom_permission_message_utils_h__
#define mozilla_dom_permission_message_utils_h__

#include "ipc/IPCMessageUtils.h"
#include "nsCOMPtr.h"
#include "nsIPrincipal.h"

namespace IPC {

template <>
struct ParamTraits<nsIPrincipal*> {
  static void Write(IPC::MessageWriter* aWriter, nsIPrincipal* aParam);
  static bool Read(IPC::MessageReader* aReader, RefPtr<nsIPrincipal>* aResult);

  
  static bool Read(IPC::MessageReader* aReader,
                   nsCOMPtr<nsIPrincipal>* aResult) {
    RefPtr<nsIPrincipal> result;
    if (!Read(aReader, &result)) {
      return false;
    }
    *aResult = std::move(result);
    return true;
  }
};

}  

#endif  
