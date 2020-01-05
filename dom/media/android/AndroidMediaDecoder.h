




#if !defined(AndroidMediaDecoder_h_)
#define AndroidMediaDecoder_h_

#include "MediaDecoder.h"
#include "AndroidMediaDecoder.h"
#include "MediaContainerType.h"

namespace mozilla {

class AndroidMediaDecoder : public MediaDecoder
{
  MediaContainerType mType;
public:
  AndroidMediaDecoder(MediaDecoderOwner* aOwner, const MediaContainerType& aType);

  MediaDecoder* Clone(MediaDecoderOwner* aOwner) override {
    return new AndroidMediaDecoder(aOwner, mType);
  }
  MediaDecoderStateMachine* CreateStateMachine() override;
};

} 

#endif
