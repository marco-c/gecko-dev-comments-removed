




#include "OutOfMemoryError.h"
#include "mozilla/dom/WebGPUBinding.h"

namespace mozilla::webgpu {

GPU_IMPL_JS_WRAP(OutOfMemoryError)

already_AddRefed<OutOfMemoryError> OutOfMemoryError::Constructor(
    const dom::GlobalObject& aGlobal, const nsAString& aString,
    ErrorResult& aRv) {
  nsCOMPtr<nsIGlobalObject> global = do_QueryInterface(aGlobal.GetAsSupports());
  MOZ_RELEASE_ASSERT(global);
  return MakeAndAddRef<OutOfMemoryError>(global, aString);
}

}  
