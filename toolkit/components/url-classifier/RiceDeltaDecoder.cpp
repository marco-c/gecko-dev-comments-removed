



#include "RiceDeltaDecoder.h"
#include "mozilla/Logging.h"

#include <limits>

extern mozilla::LazyLogModule gUrlClassifierDbServiceLog;
#define LOG(args) \
  MOZ_LOG(gUrlClassifierDbServiceLog, mozilla::LogLevel::Debug, args)

namespace {
















class BitBuffer {
 public:
  BitBuffer(const uint8_t* bytes, size_t byte_count);

  
  uint64_t RemainingBitCount() const;

  
  
  bool ReadBits(uint32_t* val, size_t bit_count);

  
  
  
  bool PeekBits(uint32_t* val, size_t bit_count);

  
  
  
  
  
  
  
  
  bool ReadExponentialGolomb(uint32_t* val);

  
  
  bool ConsumeBits(size_t bit_count);

 protected:
  const uint8_t* const bytes_;
  
  size_t byte_count_;
  
  size_t byte_offset_;
  
  size_t bit_offset_;
};

}  

static void ReverseByte(uint8_t& b) {
  b = (b & 0xF0) >> 4 | (b & 0x0F) << 4;
  b = (b & 0xCC) >> 2 | (b & 0x33) << 2;
  b = (b & 0xAA) >> 1 | (b & 0x55) << 1;
}



template <size_t N>
struct Number {
  static_assert(
      N >= 2 && N <= 4,
      "Number template only supports 128-bit (N=2) and 256-bit (N=4)");

  Number() {
    for (size_t i = 0; i < N; i++) {
      mData[i] = 0;
    }
  }

  
  explicit Number(const uint64_t (&values)[N]) {
    for (size_t i = 0; i < N; i++) {
      mData[i] = values[i];
    }
  }

  const char* get() const { return reinterpret_cast<const char*>(mData); }

  Number operator+(const Number& aOther) const {
    uint64_t result[N];
    uint64_t carry = 0;

    
    for (size_t i = 0; i < N; i++) {
      uint64_t sum = mData[i] + aOther.mData[i] + carry;
      result[i] = sum;
      
      
      
      carry = (sum < mData[i]) || (carry && sum < (mData[i] + aOther.mData[i]))
                  ? 1
                  : 0;
    }

    return Number(result);
  }

  Number operator=(const Number& aOther) {
    for (size_t i = 0; i < N; i++) {
      mData[i] = aOther.mData[i];
    }
    return *this;
  }

  uint64_t mData[N];
};


using Number128 = Number<2>;
using Number256 = Number<4>;

namespace mozilla {
namespace safebrowsing {

RiceDeltaDecoder::RiceDeltaDecoder(uint8_t* aEncodedData,
                                   size_t aEncodedDataSize)
    : mEncodedData(aEncodedData), mEncodedDataSize(aEncodedDataSize) {}

bool RiceDeltaDecoder::Decode(uint32_t aRiceParameter, uint32_t aFirstValue,
                              uint32_t aNumEntries, uint32_t* aDecodedData) {
  
  for (size_t i = 0; i < mEncodedDataSize; i++) {
    ReverseByte(mEncodedData[i]);
  }

  BitBuffer bitBuffer(mEncodedData, mEncodedDataSize);

  
  
  
  const uint32_t k = aRiceParameter;
  aDecodedData[0] = aFirstValue;
  for (uint32_t i = 0; i < aNumEntries; i++) {
    
    uint32_t q;
    if (!bitBuffer.ReadExponentialGolomb(&q)) {
      LOG(("Encoded data underflow!"));
      return false;
    }

    
    uint32_t r = 0;
    for (uint32_t j = 0; j < k; j++) {
      uint32_t b = 0;
      if (!bitBuffer.ReadBits(&b, 1)) {
        
        break;
      }
      
      r |= b << j;
    }

    
    uint32_t N = (q << k) + r;

    
    aDecodedData[i + 1] = N + aDecodedData[i];
  }

  return true;
}

bool RiceDeltaDecoder::Decode64(uint32_t aRiceParameter, uint64_t aFirstValue,
                                uint32_t aNumEntries, uint64_t* aDecodedData) {
  
  for (size_t i = 0; i < mEncodedDataSize; i++) {
    ReverseByte(mEncodedData[i]);
  }

  BitBuffer bitBuffer(mEncodedData, mEncodedDataSize);

  
  
  
  const uint32_t k = aRiceParameter;
  aDecodedData[0] = aFirstValue;
  for (uint32_t i = 0; i < aNumEntries; i++) {
    
    uint32_t q;
    if (!bitBuffer.ReadExponentialGolomb(&q)) {
      LOG(("Encoded data underflow!"));
      return false;
    }

    
    uint64_t r = 0;
    for (uint32_t j = 0; j < k; j++) {
      uint32_t b = 0;
      if (!bitBuffer.ReadBits(&b, 1)) {
        
        break;
      }
      
      r |= static_cast<uint64_t>(b) << j;
    }

    
    uint64_t N = (static_cast<uint64_t>(q) << k) + r;

    
    aDecodedData[i + 1] = N + aDecodedData[i];
  }

  return true;
}

bool RiceDeltaDecoder::Decode128(uint32_t aRiceParameter,
                                 uint64_t aFirstValueHigh,
                                 uint64_t aFirstValueLow, uint32_t aNumEntries,
                                 nsACString& aDecodedData) {
  
  for (size_t i = 0; i < mEncodedDataSize; i++) {
    ReverseByte(mEncodedData[i]);
  }

  BitBuffer bitBuffer(mEncodedData, mEncodedDataSize);

  
  
  
  const uint32_t k = aRiceParameter;
  Number128 firstValue({aFirstValueLow, aFirstValueHigh});

  aDecodedData.Append(firstValue.get(), sizeof(firstValue));

  Number128 previousValue = firstValue;
  for (uint32_t i = 0; i < aNumEntries; i++) {
    
    uint32_t q;
    if (!bitBuffer.ReadExponentialGolomb(&q)) {
      LOG(("Encoded data underflow!"));
      return false;
    }

    
    
    uint64_t r[2] = {0, 0};
    for (uint32_t j = 0; j < k; j++) {
      uint32_t b = 0;
      if (!bitBuffer.ReadBits(&b, 1)) {
        
        break;
      }
      
      r[j / 64] |= static_cast<uint64_t>(b) << (j % 64);
    }

    
    uint64_t N[2] = {0, 0};
    N[0] = r[0];
    N[1] = (static_cast<uint64_t>(q) << (k - 64)) + r[1];

    
    Number128 deltaN(N);
    Number128 result = previousValue + deltaN;
    previousValue = result;

    
    aDecodedData.Append(result.get(), sizeof(result));
  }

  return true;
}

bool RiceDeltaDecoder::Decode256(uint32_t aRiceParameter,
                                 uint64_t aFirstValueOne,
                                 uint64_t aFirstValueTwo,
                                 uint64_t aFirstValueThree,
                                 uint64_t aFirstValueFour, uint32_t aNumEntries,
                                 nsACString& aDecodedData) {
  
  for (size_t i = 0; i < mEncodedDataSize; i++) {
    ReverseByte(mEncodedData[i]);
  }

  BitBuffer bitBuffer(mEncodedData, mEncodedDataSize);

  
  
  
  const uint32_t k = aRiceParameter;
  
  
  Number256 firstValue(
      {aFirstValueFour, aFirstValueThree, aFirstValueTwo, aFirstValueOne});

  aDecodedData.Append(firstValue.get(), sizeof(firstValue));

  Number256 previousValue = firstValue;
  for (uint32_t i = 0; i < aNumEntries; i++) {
    
    uint32_t q;
    if (!bitBuffer.ReadExponentialGolomb(&q)) {
      LOG(("Encoded data underflow!"));
      return false;
    }

    
    uint64_t r[4] = {0, 0, 0, 0};

    for (uint32_t j = 0; j < k; j++) {
      uint32_t b = 0;
      if (!bitBuffer.ReadBits(&b, 1)) {
        
        break;
      }
      
      r[j / 64] |= static_cast<uint64_t>(b) << (j % 64);
    }

    
    
    
    uint64_t N[4] = {0, 0, 0, 0};
    N[0] = r[0];
    N[1] = r[1];
    N[2] = r[2];
    N[3] = (static_cast<uint64_t>(q) << (k - (64 * 3))) + r[3];

    
    Number256 deltaN(N);
    Number256 result = previousValue + deltaN;
    previousValue = result;

    
    aDecodedData.Append(result.get(), sizeof(result));
  }

  return true;
}

}  
}  

namespace {





uint8_t LowestBits(uint8_t byte, size_t bit_count) {
  return byte & ((1 << bit_count) - 1);
}



uint8_t HighestBits(uint8_t byte, size_t bit_count) {
  MOZ_ASSERT(bit_count < 8u);
  uint8_t shift = 8 - static_cast<uint8_t>(bit_count);
  uint8_t mask = 0xFF << shift;
  return (byte & mask) >> shift;
}

BitBuffer::BitBuffer(const uint8_t* bytes, size_t byte_count)
    : bytes_(bytes), byte_count_(byte_count), byte_offset_(), bit_offset_() {
  MOZ_ASSERT(static_cast<uint64_t>(byte_count_) <=
             std::numeric_limits<uint32_t>::max());
}

uint64_t BitBuffer::RemainingBitCount() const {
  return (static_cast<uint64_t>(byte_count_) - byte_offset_) * 8 - bit_offset_;
}

bool BitBuffer::PeekBits(uint32_t* val, size_t bit_count) {
  if (!val || bit_count > RemainingBitCount() || bit_count > 32) {
    return false;
  }
  const uint8_t* bytes = bytes_ + byte_offset_;
  size_t remaining_bits_in_current_byte = 8 - bit_offset_;
  uint32_t bits = LowestBits(*bytes++, remaining_bits_in_current_byte);
  
  
  if (bit_count < remaining_bits_in_current_byte) {
    *val = HighestBits(bits, bit_offset_ + bit_count);
    return true;
  }
  
  
  bit_count -= remaining_bits_in_current_byte;
  while (bit_count >= 8) {
    bits = (bits << 8) | *bytes++;
    bit_count -= 8;
  }
  
  
  if (bit_count > 0) {
    bits <<= bit_count;
    bits |= HighestBits(*bytes, bit_count);
  }
  *val = bits;
  return true;
}

bool BitBuffer::ReadBits(uint32_t* val, size_t bit_count) {
  return PeekBits(val, bit_count) && ConsumeBits(bit_count);
}

bool BitBuffer::ConsumeBits(size_t bit_count) {
  if (bit_count > RemainingBitCount()) {
    return false;
  }

  byte_offset_ += (bit_offset_ + bit_count) / 8;
  bit_offset_ = (bit_offset_ + bit_count) % 8;
  return true;
}

bool BitBuffer::ReadExponentialGolomb(uint32_t* val) {
  if (!val) {
    return false;
  }

  *val = 0;

  
  size_t one_bit_count = 0;
  uint32_t peeked_bit;
  while (PeekBits(&peeked_bit, 1) && peeked_bit == 1) {
    one_bit_count++;
    ConsumeBits(1);
  }
  if (!ConsumeBits(1)) {
    return false;  
  }

  *val = one_bit_count;
  return true;
}
}  
