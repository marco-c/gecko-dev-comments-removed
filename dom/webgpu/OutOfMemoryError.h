




#ifndef GPU_OutOfMemoryError_H_
#define GPU_OutOfMemoryError_H_

#include "Error.h"

namespace mozilla {
class ErrorResult;
namespace dom {
class GlobalObject;
}  
namespace webgpu {

class OutOfMemoryError final : public Error {
 public:
  GPU_DECL_JS_WRAP(OutOfMemoryError)

  OutOfMemoryError(nsIGlobalObject* const aGlobal, const nsAString& aMessage)
      : Error(aGlobal, aMessage) {}

  OutOfMemoryError(nsIGlobalObject* const aGlobal, const nsACString& aMessage)
      : Error(aGlobal, aMessage) {}

 private:
  ~OutOfMemoryError() override = default;

 public:
  static already_AddRefed<OutOfMemoryError> Constructor(
      const dom::GlobalObject& aGlobal, const nsAString& aString,
      ErrorResult& aRv);
};

}  
}  

#endif  
