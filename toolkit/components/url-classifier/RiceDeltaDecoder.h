



#ifndef RICE_DELTA_DECODER_H
#define RICE_DELTA_DECODER_H

#include <cstddef>
#include <cstdint>

#include "nsStringFwd.h"

namespace mozilla {
namespace safebrowsing {

class RiceDeltaDecoder {
 public:
  
  
  
  
  
  RiceDeltaDecoder(uint8_t* aEncodedData, size_t aEncodedDataSize);

  
  
  
  
  
  
  bool Decode(uint32_t aRiceParameter, uint32_t aFirstValue,
              uint32_t aNumEntries, uint32_t* aDecodedData);

  
  
  
  
  
  
  
  
  
  bool Decode64(uint32_t aRiceParameter, uint64_t aFirstValue,
                uint32_t aNumEntries, uint64_t* aDecodedData);

  
  
  
  
  
  
  
  
  
  
  
  
  bool Decode128(uint32_t aRiceParameter, uint64_t aFirstValueHigh,
                 uint64_t aFirstValueLow, uint32_t aNumEntries,
                 nsACString& aDecodedData);

  
  
  
  
  
  
  
  
  
  
  
  
  bool Decode256(uint32_t aRiceParameter, uint64_t aFirstValueOne,
                 uint64_t aFirstValueTwo, uint64_t aFirstValueThree,
                 uint64_t aFirstValueFour, uint32_t aNumEntries,
                 nsACString& aDecodedData);

 private:
  uint8_t* mEncodedData;
  size_t mEncodedDataSize;
};

}  
}  

#endif  
