









#include "api/video/corruption_detection/frame_instrumentation_generator.h"

#include <memory>

#include "api/video/corruption_detection/frame_instrumentation_generator_factory.h"
#include "api/video/video_codec_type.h"

namespace webrtc {


std::unique_ptr<FrameInstrumentationGenerator>
FrameInstrumentationGenerator::Create(VideoCodecType video_codec_type) {
  return FrameInstrumentationGeneratorFactory::Create(video_codec_type);
}

}  
