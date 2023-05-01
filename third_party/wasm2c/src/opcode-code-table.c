















#include "wabt/opcode-code-table.h"

#include "wabt/config.h"

#include <stdint.h>

typedef enum WabtOpcodeEnum {
#define WABT_OPCODE(rtype, type1, type2, type3, mem_size, prefix, code, Name, \
                    text, decomp)                                             \
  Name,
#include "wabt/opcode.def"
#undef WABT_OPCODE
  Invalid,
} WabtOpcodeEnum;

WABT_STATIC_ASSERT(Invalid <= WABT_OPCODE_CODE_TABLE_SIZE);


uint32_t WabtOpcodeCodeTable[WABT_OPCODE_CODE_TABLE_SIZE] = {
#define WABT_OPCODE(rtype, type1, type2, type3, mem_size, prefix, code, Name, \
                    text, decomp)                                             \
  [(prefix << MAX_OPCODE_BITS) + code] = Name,
#include "wabt/opcode.def"
#undef WABT_OPCODE
};
