















#ifndef WABT_DECOMPILER_H_
#define WABT_DECOMPILER_H_

#include "wabt/common.h"

namespace wabt {

struct Module;
class Stream;

struct DecompileOptions {};

void RenameAll(Module&);

std::string Decompile(const Module&, const DecompileOptions&);

}  

#endif 
