









#include "media/engine/internal_decoder_factory.h"

#include "api/video_codecs/sdp_video_format.h"
#include "api/video_codecs/video_decoder.h"
#include "api/video_codecs/vp9_profile.h"
#include "media/base/media_constants.h"
#include "modules/video_coding/codecs/av1/libaom_av1_decoder.h"
#include "test/gmock.h"
#include "test/gtest.h"

namespace webrtc {
namespace {
using ::testing::Contains;
using ::testing::Field;
using ::testing::Not;

#ifdef RTC_ENABLE_VP9
constexpr bool kVp9Enabled = true;
#else
constexpr bool kVp9Enabled = false;
#endif
#ifdef WEBRTC_USE_H264
constexpr bool kH264Enabled = true;
#else
constexpr bool kH264Enabled = false;
#endif
constexpr VideoDecoderFactory::CodecSupport kSupported = {
    true, false};
constexpr VideoDecoderFactory::CodecSupport kUnsupported = {
    false, false};

MATCHER_P(Support, expected, "") {
  return arg.is_supported == expected.is_supported &&
         arg.is_power_efficient == expected.is_power_efficient;
}

TEST(InternalDecoderFactoryTest, Vp8) {
  InternalDecoderFactory factory;
  std::unique_ptr<VideoDecoder> decoder =
      factory.CreateVideoDecoder(SdpVideoFormat(cricket::kVp8CodecName));
  EXPECT_TRUE(decoder);
}

TEST(InternalDecoderFactoryTest, Vp9Profile0) {
  InternalDecoderFactory factory;
  std::unique_ptr<VideoDecoder> decoder =
      factory.CreateVideoDecoder(SdpVideoFormat(
          cricket::kVp9CodecName,
          {{kVP9FmtpProfileId, VP9ProfileToString(VP9Profile::kProfile0)}}));
  EXPECT_EQ(static_cast<bool>(decoder), kVp9Enabled);
}

TEST(InternalDecoderFactoryTest, Vp9Profile1) {
  InternalDecoderFactory factory;
  std::unique_ptr<VideoDecoder> decoder =
      factory.CreateVideoDecoder(SdpVideoFormat(
          cricket::kVp9CodecName,
          {{kVP9FmtpProfileId, VP9ProfileToString(VP9Profile::kProfile1)}}));
  EXPECT_EQ(static_cast<bool>(decoder), kVp9Enabled);
}

TEST(InternalDecoderFactoryTest, H264) {
  InternalDecoderFactory factory;
  std::unique_ptr<VideoDecoder> decoder =
      factory.CreateVideoDecoder(SdpVideoFormat(cricket::kH264CodecName));
  EXPECT_EQ(static_cast<bool>(decoder), kH264Enabled);
}

TEST(InternalDecoderFactoryTest, Av1) {
  InternalDecoderFactory factory;
  if (kIsLibaomAv1DecoderSupported) {
    EXPECT_THAT(factory.GetSupportedFormats(),
                Contains(Field(&SdpVideoFormat::name, cricket::kAv1CodecName)));
    EXPECT_TRUE(
        factory.CreateVideoDecoder(SdpVideoFormat(cricket::kAv1CodecName)));
  } else {
    EXPECT_THAT(
        factory.GetSupportedFormats(),
        Not(Contains(Field(&SdpVideoFormat::name, cricket::kAv1CodecName))));
  }
}

TEST(InternalDecoderFactoryTest, QueryCodecSupportNoReferenceScaling) {
  InternalDecoderFactory factory;
  EXPECT_THAT(factory.QueryCodecSupport(SdpVideoFormat(cricket::kVp8CodecName),
                                        false),
              Support(kSupported));
  EXPECT_THAT(factory.QueryCodecSupport(SdpVideoFormat(cricket::kVp9CodecName),
                                        false),
              Support(kVp9Enabled ? kSupported : kUnsupported));
  EXPECT_THAT(factory.QueryCodecSupport(
                  SdpVideoFormat(cricket::kVp9CodecName,
                                 {{kVP9FmtpProfileId,
                                   VP9ProfileToString(VP9Profile::kProfile1)}}),
                  false),
              Support(kVp9Enabled ? kSupported : kUnsupported));
  EXPECT_THAT(
      factory.QueryCodecSupport(SdpVideoFormat(cricket::kAv1CodecName),
                                false),
      Support(kIsLibaomAv1DecoderSupported ? kSupported : kUnsupported));
}

TEST(InternalDecoderFactoryTest, QueryCodecSupportReferenceScaling) {
  InternalDecoderFactory factory;
  
  EXPECT_THAT(factory.QueryCodecSupport(SdpVideoFormat(cricket::kVp9CodecName),
                                        true),
              Support(kVp9Enabled ? kSupported : kUnsupported));
  EXPECT_THAT(
      factory.QueryCodecSupport(SdpVideoFormat(cricket::kAv1CodecName),
                                true),
      Support(kIsLibaomAv1DecoderSupported ? kSupported : kUnsupported));

  
  EXPECT_THAT(factory.QueryCodecSupport(SdpVideoFormat(cricket::kH264CodecName),
                                        true),
              Support(kUnsupported));
  EXPECT_THAT(factory.QueryCodecSupport(SdpVideoFormat(cricket::kVp8CodecName),
                                        true),
              Support(kUnsupported));
}

}  
}  
