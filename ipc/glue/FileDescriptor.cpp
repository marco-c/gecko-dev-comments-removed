





#include "FileDescriptor.h"

#include "mozilla/ipc/ProtocolMessageUtils.h"
#include "nsDebug.h"

#ifdef XP_WIN
#  include <windows.h>
#  include "ProtocolUtils.h"
#else  
#  include <unistd.h>
#endif  

namespace mozilla {
namespace ipc {

FileDescriptor::FileDescriptor() = default;

FileDescriptor::FileDescriptor(const FileDescriptor& aOther)
    : mHandle(Clone(aOther.mHandle.get())) {}

FileDescriptor::FileDescriptor(FileDescriptor&& aOther)
    : mHandle(std::move(aOther.mHandle)) {}

FileDescriptor::FileDescriptor(PlatformHandleType aHandle)
    : mHandle(Clone(aHandle)) {}

FileDescriptor::FileDescriptor(UniquePlatformHandle&& aHandle)
    : mHandle(std::move(aHandle)) {}

FileDescriptor::~FileDescriptor() = default;

FileDescriptor& FileDescriptor::operator=(const FileDescriptor& aOther) {
  if (this != &aOther) {
    mHandle = Clone(aOther.mHandle.get());
  }
  return *this;
}

FileDescriptor& FileDescriptor::operator=(FileDescriptor&& aOther) {
  if (this != &aOther) {
    mHandle = std::move(aOther.mHandle);
  }
  return *this;
}

bool FileDescriptor::IsValid() const { return mHandle != nullptr; }

FileDescriptor::UniquePlatformHandle FileDescriptor::ClonePlatformHandle()
    const {
  return Clone(mHandle.get());
}

FileDescriptor::UniquePlatformHandle FileDescriptor::TakePlatformHandle() {
  return UniquePlatformHandle(mHandle.release());
}

bool FileDescriptor::operator==(const FileDescriptor& aOther) const {
  return mHandle == aOther.mHandle;
}


FileDescriptor::UniquePlatformHandle FileDescriptor::Clone(
    PlatformHandleType aHandle) {
  FileDescriptor::PlatformHandleType newHandle;

#ifdef XP_WIN
  if (aHandle == INVALID_HANDLE_VALUE || aHandle == nullptr) {
    return UniqueFileHandle();
  }
  if (::DuplicateHandle(GetCurrentProcess(), aHandle, GetCurrentProcess(),
                        &newHandle, 0, FALSE, DUPLICATE_SAME_ACCESS)) {
    return UniqueFileHandle(newHandle);
  }
#else  
  if (aHandle < 0) {
    return UniqueFileHandle();
  }
  newHandle = dup(aHandle);
  if (newHandle >= 0) {
    return UniqueFileHandle(newHandle);
  }
#endif
  NS_WARNING("Failed to duplicate file handle for current process!");
  return UniqueFileHandle();
}

}  
}  

namespace IPC {

void ParamTraits<mozilla::ipc::FileDescriptor>::Write(
    MessageWriter* aWriter, const mozilla::ipc::FileDescriptor& aParam) {
  WriteParam(aWriter, aParam.ClonePlatformHandle());
}

bool ParamTraits<mozilla::ipc::FileDescriptor>::Read(
    MessageReader* aReader, mozilla::ipc::FileDescriptor* aResult) {
  mozilla::UniqueFileHandle handle;
  if (!ReadParam(aReader, &handle)) {
    return false;
  }

  *aResult = mozilla::ipc::FileDescriptor(std::move(handle));
  if (!aResult->IsValid()) {
    printf_stderr("IPDL protocol Error: Received an invalid file descriptor\n");
  }
  return true;
}

}  
