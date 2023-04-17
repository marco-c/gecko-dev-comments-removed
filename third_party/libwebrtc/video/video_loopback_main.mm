









#import "video/video_loopback.h"

int main(int argc, char* argv[]) {
  @autoreleasepool {
    webrtc::RunLoopbackTest(argc, argv);
  }
}
