















#ifndef WABT_OPCODE_CODE_TABLE_H_
#define WABT_OPCODE_CODE_TABLE_H_

#include <stdint.h>
#include <stdlib.h>

#ifdef __cplusplus
extern "C" {
#endif

#define WABT_OPCODE_CODE_TABLE_SIZE 131072




#define MAX_OPCODE_BITS 9




extern uint32_t WabtOpcodeCodeTable[WABT_OPCODE_CODE_TABLE_SIZE];

#ifdef __cplusplus
} 
#endif

#endif 
