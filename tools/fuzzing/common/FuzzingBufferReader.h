




#ifndef TOOLS_FUZZING_COMMON_FUZZINGBUFFERREADER_H_
#define TOOLS_FUZZING_COMMON_FUZZINGBUFFERREADER_H_

#include "mozilla/Assertions.h"
#include "mozilla/Result.h"
#include "mozilla/ResultVariant.h"

namespace mozilla {

enum TestFuncRetValue : int { RET_SUCCESS = 0 };




template <>
class [[nodiscard]] GenericErrorResult<TestFuncRetValue> {
  TestFuncRetValue mErrorValue;

  template <typename V, typename E2>
  friend class Result;

 public:
  explicit GenericErrorResult(TestFuncRetValue aErrorValue)
      : mErrorValue(aErrorValue) {}

  GenericErrorResult(TestFuncRetValue aErrorValue, const ErrorPropagationTag&)
      : GenericErrorResult(aErrorValue) {}

  MOZ_IMPLICIT operator int() const { return mErrorValue; }
};












class FuzzingBufferReader {
 public:
  FuzzingBufferReader(const uint8_t* buf, size_t size)
      : mPos(buf), mEnd(buf + size) {
    MOZ_RELEASE_ASSERT(mPos <= mEnd);
  }

  size_t Length() { return mEnd - mPos; }

  const uint8_t* Pos() { return mPos; }

  template <typename T>
  Result<T, TestFuncRetValue> Read() {
    if (Length() < sizeof(T)) {
      return Err(RET_SUCCESS);
    }
    T result = *reinterpret_cast<const T*>(mPos);
    mPos += sizeof(T);
    return result;
  }

 private:
  const uint8_t* mPos;
  const uint8_t* const mEnd;
};

}  

#endif  
