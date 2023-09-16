



#include "MediaKeysEventSourceFactory.h"

#include "MediaHardwareKeysEventSourceMac.h"
#include "MediaHardwareKeysEventSourceMacMediaCenter.h"

namespace mozilla {
namespace widget {

mozilla::dom::MediaControlKeySource* CreateMediaControlKeySource() {
  return new MediaHardwareKeysEventSourceMacMediaCenter();
}

}  
}  
