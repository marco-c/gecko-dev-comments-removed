




#include "nsCookiePermission.h"

namespace mozilla {

void CookieModuleDtor() { nsCookiePermission::Shutdown(); }

}  
