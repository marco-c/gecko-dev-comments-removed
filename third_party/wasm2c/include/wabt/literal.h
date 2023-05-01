















#ifndef WABT_LITERAL_H_
#define WABT_LITERAL_H_

#include <cstdint>

#include "wabt/common.h"

namespace wabt {








enum class LiteralType {
  Int,
  Float,
  Hexfloat,
  Infinity,
  Nan,
};

enum class ParseIntType {
  UnsignedOnly = 0,
  SignedAndUnsigned = 1,
};


#define WABT_MAX_FLOAT_HEX 20
#define WABT_MAX_DOUBLE_HEX 40

Result ParseHexdigit(char c, uint32_t* out);
Result ParseInt8(const char* s,
                 const char* end,
                 uint8_t* out,
                 ParseIntType parse_type);
Result ParseInt16(const char* s,
                  const char* end,
                  uint16_t* out,
                  ParseIntType parse_type);
Result ParseInt32(const char* s,
                  const char* end,
                  uint32_t* out,
                  ParseIntType parse_type);
Result ParseInt64(const char* s,
                  const char* end,
                  uint64_t* out,
                  ParseIntType parse_type);
Result ParseUint64(const char* s, const char* end, uint64_t* out);
Result ParseUint128(const char* s, const char* end, v128* out);
Result ParseFloat(LiteralType literal_type,
                  const char* s,
                  const char* end,
                  uint32_t* out_bits);
Result ParseDouble(LiteralType literal_type,
                   const char* s,
                   const char* end,
                   uint64_t* out_bits);


inline Result ParseInt8(std::string_view v,
                        uint8_t* out,
                        ParseIntType parse_type) {
  return ParseInt8(v.data(), v.data() + v.size(), out, parse_type);
}

inline Result ParseInt16(std::string_view v,
                         uint16_t* out,
                         ParseIntType parse_type) {
  return ParseInt16(v.data(), v.data() + v.size(), out, parse_type);
}

inline Result ParseInt32(std::string_view v,
                         uint32_t* out,
                         ParseIntType parse_type) {
  return ParseInt32(v.data(), v.data() + v.size(), out, parse_type);
}

inline Result ParseInt64(std::string_view v,
                         uint64_t* out,
                         ParseIntType parse_type) {
  return ParseInt64(v.data(), v.data() + v.size(), out, parse_type);
}

inline Result ParseUint64(std::string_view v, uint64_t* out) {
  return ParseUint64(v.data(), v.data() + v.size(), out);
}

inline Result ParseUint128(std::string_view v, v128* out) {
  return ParseUint128(v.data(), v.data() + v.size(), out);
}

inline Result ParseFloat(LiteralType literal_type,
                         std::string_view v,
                         uint32_t* out_bits) {
  return ParseFloat(literal_type, v.data(), v.data() + v.size(), out_bits);
}

inline Result ParseDouble(LiteralType literal_type,
                          std::string_view v,
                          uint64_t* out_bits) {
  return ParseDouble(literal_type, v.data(), v.data() + v.size(), out_bits);
}

void WriteFloatHex(char* buffer, size_t size, uint32_t bits);
void WriteDoubleHex(char* buffer, size_t size, uint64_t bits);
void WriteUint128(char* buffer, size_t size, v128 bits);

}  

#endif 
