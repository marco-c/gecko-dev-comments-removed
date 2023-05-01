















#ifndef WABT_BINARY_READER_IR_H_
#define WABT_BINARY_READER_IR_H_

#include "wabt/common.h"
#include "wabt/error.h"

namespace wabt {

struct Module;
struct ReadBinaryOptions;

Result ReadBinaryIr(const char* filename,
                    const void* data,
                    size_t size,
                    const ReadBinaryOptions& options,
                    Errors*,
                    Module* out_module);

}  

#endif 
