















#ifndef WABT_RESOLVE_NAMES_H_
#define WABT_RESOLVE_NAMES_H_

#include "wabt/common.h"
#include "wabt/error.h"

namespace wabt {

struct Module;
struct Script;

Result ResolveNamesModule(Module*, Errors*);
Result ResolveNamesScript(Script*, Errors*);

}  

#endif 
