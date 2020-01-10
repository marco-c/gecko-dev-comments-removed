




#include "mozilla/dom/WebGPUBinding.h"
#include "CommandEncoder.h"

#include "Device.h"

namespace mozilla {
namespace webgpu {

CommandEncoder::~CommandEncoder() = default;

GPU_IMPL_CYCLE_COLLECTION(CommandEncoder, mParent)
GPU_IMPL_JS_WRAP(CommandEncoder)

}  
}  
