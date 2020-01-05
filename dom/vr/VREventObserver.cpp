





#include "VREventObserver.h"

#include "nsContentUtils.h"
#include "nsGlobalWindow.h"
#include "VRManagerChild.h"

namespace mozilla {
namespace dom {

using namespace gfx;






VREventObserver::VREventObserver(nsGlobalWindow* aGlobalWindow)
  : mWindow(aGlobalWindow)
{
  MOZ_ASSERT(aGlobalWindow && aGlobalWindow->IsInnerWindow());

  VRManagerChild* vmc = VRManagerChild::Get();
  if (vmc) {
    vmc->AddListener(this);
  }
}

VREventObserver::~VREventObserver()
{
  VRManagerChild* vmc = VRManagerChild::Get();
  if (vmc) {
    vmc->RemoveListener(this);
  }
}

void
VREventObserver::NotifyVRDisplayMounted(uint32_t aDisplayID)
{
  if (mWindow->AsInner()->IsCurrentInnerWindow()) {
    MOZ_ASSERT(nsContentUtils::IsSafeToRunScript());
    mWindow->DispatchVRDisplayActivate(aDisplayID,
                                       VRDisplayEventReason::Mounted);
  }
}

void
VREventObserver::NotifyVRDisplayNavigation(uint32_t aDisplayID)
{
  if (mWindow->AsInner()->IsCurrentInnerWindow()) {
    MOZ_ASSERT(nsContentUtils::IsSafeToRunScript());
    mWindow->DispatchVRDisplayActivate(aDisplayID,
                                       VRDisplayEventReason::Navigation);
  }
}

void
VREventObserver::NotifyVRDisplayRequested(uint32_t aDisplayID)
{
  if (mWindow->AsInner()->IsCurrentInnerWindow()) {
    MOZ_ASSERT(nsContentUtils::IsSafeToRunScript());
    mWindow->DispatchVRDisplayActivate(aDisplayID,
                                       VRDisplayEventReason::Requested);
  }
}

void
VREventObserver::NotifyVRDisplayUnmounted(uint32_t aDisplayID)
{
  if (mWindow->AsInner()->IsCurrentInnerWindow()) {
    MOZ_ASSERT(nsContentUtils::IsSafeToRunScript());
    mWindow->DispatchVRDisplayDeactivate(aDisplayID,
                                         VRDisplayEventReason::Unmounted);
  }
}

void
VREventObserver::NotifyVRDisplayConnect()
{
  




  if (mWindow->AsInner()->IsCurrentInnerWindow()) {
    MOZ_ASSERT(nsContentUtils::IsSafeToRunScript());
    mWindow->GetOuterWindow()->DispatchCustomEvent(
      NS_LITERAL_STRING("vrdisplayconnected"));
  }
}

void
VREventObserver::NotifyVRDisplayDisconnect()
{
  if (mWindow->AsInner()->IsCurrentInnerWindow()) {
    mWindow->NotifyActiveVRDisplaysChanged();
    MOZ_ASSERT(nsContentUtils::IsSafeToRunScript());
    mWindow->GetOuterWindow()->DispatchCustomEvent(
      NS_LITERAL_STRING("vrdisplaydisconnected"));
  }
}

void
VREventObserver::NotifyVRDisplayPresentChange()
{
  if (mWindow->AsInner()->IsCurrentInnerWindow()) {
    mWindow->NotifyActiveVRDisplaysChanged();
    MOZ_ASSERT(nsContentUtils::IsSafeToRunScript());
    mWindow->GetOuterWindow()->DispatchCustomEvent(
      NS_LITERAL_STRING("vrdisplaypresentchange"));
  }
}

} 
} 
