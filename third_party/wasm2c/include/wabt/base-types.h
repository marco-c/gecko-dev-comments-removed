















#ifndef WABT_BASE_TYPES_H_
#define WABT_BASE_TYPES_H_

#include <cstddef>
#include <cstdint>

namespace wabt {

using Index = uint32_t;    
using Address = uint64_t;  
using Offset = size_t;     

constexpr Address kInvalidAddress = ~0;
constexpr Index kInvalidIndex = ~0;
constexpr Offset kInvalidOffset = ~0;

}  

#endif  
