





#ifndef mozilla_dom_VREventObserver_h
#define mozilla_dom_VREventObserver_h

#include "mozilla/dom/VRDisplayEventBinding.h"

class nsGlobalWindow;

namespace mozilla {
namespace dom {

class VREventObserver final
{
public:
  ~VREventObserver();
  explicit VREventObserver(nsGlobalWindow* aGlobalWindow);

  void NotifyVRDisplayMounted(uint32_t aDisplayID);
  void NotifyVRDisplayUnmounted(uint32_t aDisplayID);
  void NotifyVRDisplayNavigation(uint32_t aDisplayID);
  void NotifyVRDisplayRequested(uint32_t aDisplayID);
  void NotifyVRDisplayConnect();
  void NotifyVRDisplayDisconnect();
  void NotifyVRDisplayPresentChange();

private:
  
  nsGlobalWindow* MOZ_NON_OWNING_REF mWindow;
};

} 
} 

#endif 
