










#import <Foundation/Foundation.h>

#import "RTCMacros.h"
#import "RTCVideoEncoderVP9.h"
#import "RTCWrappedNativeVideoEncoder.h"

#include "modules/video_coding/codecs/vp9/include/vp9.h"

@implementation RTC_OBJC_TYPE (RTCVideoEncoderVP9)

+ (id<RTC_OBJC_TYPE(RTCVideoEncoder)>)vp9Encoder {
  std::unique_ptr<webrtc::VideoEncoder> nativeEncoder(webrtc::VP9Encoder::Create());
  if (nativeEncoder == nullptr) {
    return nil;
  }
  return [[RTC_OBJC_TYPE(RTCWrappedNativeVideoEncoder) alloc]
      initWithNativeEncoder:std::move(nativeEncoder)];
}

+ (bool)isSupported {
#if defined(RTC_ENABLE_VP9)
  return true;
#else
  return false;
#endif
}

@end
