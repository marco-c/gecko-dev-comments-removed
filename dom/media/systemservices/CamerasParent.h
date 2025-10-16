





#ifndef mozilla_CamerasParent_h
#define mozilla_CamerasParent_h

#include "api/video/video_sink_interface.h"
#include "modules/video_capture/video_capture.h"
#include "modules/video_capture/video_capture_defines.h"
#include "mozilla/ShmemPool.h"
#include "mozilla/camera/PCamerasParent.h"
#include "mozilla/dom/MediaStreamTrackBinding.h"
#include "mozilla/ipc/Shmem.h"
#include "mozilla/media/MediaUtils.h"

class WebrtcLogSinkHandle;
class nsIThread;

namespace mozilla {
class VideoCaptureFactory;
}

namespace mozilla::camera {

class CamerasParent;
class VideoEngine;






















class AggregateCapturer final
    : public webrtc::VideoSinkInterface<webrtc::VideoFrame> {
 public:
  static std::unique_ptr<AggregateCapturer> Create(
      nsISerialEventTarget* aVideoCaptureThread, CaptureEngine aCapEng,
      VideoEngine* aEngine, const nsCString& aUniqueId, uint64_t aWindowId,
      nsTArray<webrtc::VideoCaptureCapability>&& aCapabilities,
      CamerasParent* aParent);

  ~AggregateCapturer();

  void AddStream(CamerasParent* aParent, int aStreamId, uint64_t aWindowId);
  struct RemoveStreamResult {
    size_t mNumRemainingStreams;
    size_t mNumRemainingStreamsForParent;
  };
  RemoveStreamResult RemoveStream(int aStreamId);
  RemoveStreamResult RemoveStreamsFor(CamerasParent* aParent);
  Maybe<int> CaptureIdFor(int aStreamId);
  void SetConfigurationFor(int aStreamId,
                           const webrtc::VideoCaptureCapability& aCapability,
                           const NormalizedConstraints& aConstraints,
                           const dom::VideoResizeModeEnum& aResizeMode,
                           bool aStarted);
  webrtc::VideoCaptureCapability CombinedCapability();

  void OnCaptureEnded();
  void OnFrame(const webrtc::VideoFrame& aVideoFrame) override;

  struct Configuration {
    webrtc::VideoCaptureCapability mCapability;
    NormalizedConstraints mConstraints;
    
    
    dom::VideoResizeModeEnum mResizeMode{};
  };
  
  
  struct Stream {
    
    
    CamerasParent* const mParent;
    
    
    const int mId{-1};
    
    const uint64_t mWindowId{};
    
    Configuration mConfiguration;
    
    
    
    bool mStarted{false};
    
    media::TimeUnit mLastFrameTime{media::TimeUnit::FromNegativeInfinity()};
  };
  
  const nsCOMPtr<nsISerialEventTarget> mVideoCaptureThread;
  
  
  const CaptureEngine mCapEngine;
  
  
  const RefPtr<VideoEngine> mEngine;
  
  const nsCString mUniqueId;
  
  
  const int mCaptureId;
  
  const TrackingId mTrackingId;
  
  
  const nsTArray<webrtc::VideoCaptureCapability> mCapabilities;
  
  
  DataMutex<nsTArray<std::unique_ptr<Stream>>> mStreams;

 private:
  AggregateCapturer(nsISerialEventTarget* aVideoCaptureThread,
                    CaptureEngine aCapEng, VideoEngine* aEngine,
                    const nsCString& aUniqueId, int aCaptureId,
                    nsTArray<webrtc::VideoCaptureCapability>&& aCapabilities);

  MediaEventListener mCaptureEndedListener;
};

class DeliverFrameRunnable;

class CamerasParent final : public PCamerasParent {
 public:
  using ShutdownMozPromise = media::ShutdownBlockingTicket::ShutdownMozPromise;

  using CameraAccessRequestPromise = MozPromise<CamerasAccessStatus, void_t,
                                                 false>;

  NS_INLINE_DECL_THREADSAFE_REFCOUNTING_WITH_DELETE_ON_EVENT_TARGET(
      CamerasParent, mPBackgroundEventTarget)

  class VideoEngineArray;
  friend DeliverFrameRunnable;

  static already_AddRefed<CamerasParent> Create();

  










  static RefPtr<CameraAccessRequestPromise> RequestCameraAccess(
      bool aAllowPermissionRequest);

  
  mozilla::ipc::IPCResult RecvPCamerasConstructor();
  mozilla::ipc::IPCResult RecvAllocateCapture(
      const CaptureEngine& aCapEngine, const nsACString& aUniqueIdUTF8,
      const uint64_t& aWindowID) override;
  mozilla::ipc::IPCResult RecvReleaseCapture(const CaptureEngine& aCapEngine,
                                             const int& aStreamId) override;
  mozilla::ipc::IPCResult RecvNumberOfCaptureDevices(
      const CaptureEngine& aCapEngine) override;
  mozilla::ipc::IPCResult RecvNumberOfCapabilities(
      const CaptureEngine& aCapEngine, const nsACString& aUniqueId) override;
  mozilla::ipc::IPCResult RecvGetCaptureCapability(
      const CaptureEngine& aCapEngine, const nsACString& aUniqueId,
      const int& aIndex) override;
  mozilla::ipc::IPCResult RecvGetCaptureDevice(
      const CaptureEngine& aCapEngine, const int& aDeviceIndex) override;
  mozilla::ipc::IPCResult RecvStartCapture(
      const CaptureEngine& aCapEngine, const int& aStreamId,
      const VideoCaptureCapability& aIpcCaps,
      const NormalizedConstraints& aConstraints,
      const dom::VideoResizeModeEnum& aResizeMode) override;
  mozilla::ipc::IPCResult RecvFocusOnSelectedSource(
      const CaptureEngine& aCapEngine, const int& aStreamId) override;
  mozilla::ipc::IPCResult RecvStopCapture(const CaptureEngine& aCapEngine,
                                          const int& aStreamId) override;
  mozilla::ipc::IPCResult RecvReleaseFrame(
      const int& aCaptureId, mozilla::ipc::Shmem&& aShmem) override;
  void ActorDestroy(ActorDestroyReason aWhy) override;
  mozilla::ipc::IPCResult RecvEnsureInitialized(
      const CaptureEngine& aCapEngine) override;

  bool IsWindowCapturing(uint64_t aWindowId, const nsACString& aUniqueId) const;
  nsIEventTarget* GetBackgroundEventTarget() {
    return mPBackgroundEventTarget;
  };
  bool IsShuttingDown() {
    
    MOZ_ASSERT(mPBackgroundEventTarget->IsOnCurrentThread());
    return mDestroyed;
  };
  ShmemBuffer GetBuffer(int aCaptureId, size_t aSize);

  
  int DeliverFrameOverIPC(CaptureEngine aCapEngine, int aCaptureId,
                          const Span<const int>& aStreamId,
                          const TrackingId& aTrackingId,
                          Variant<ShmemBuffer, webrtc::VideoFrame>&& aBuffer,
                          const VideoFrameProperties& aProps);

  CamerasParent();

 private:
  virtual ~CamerasParent();

  struct GetOrCreateCapturerResult {
    AggregateCapturer* mCapturer{};
    int mStreamId{};
  };
  GetOrCreateCapturerResult GetOrCreateCapturer(
      CaptureEngine aEngine, uint64_t aWindowId, const nsCString& aUniqueId,
      nsTArray<webrtc::VideoCaptureCapability>&& aCapabilities);
  AggregateCapturer* GetCapturer(CaptureEngine aEngine, int aStreamId);
  int ReleaseStream(CaptureEngine aEngine, int aStreamId);

  nsTArray<webrtc::VideoCaptureCapability> const* EnsureCapabilitiesPopulated(
      CaptureEngine aEngine, const nsCString& aUniqueId);

  void OnDeviceChange();

  
  
  
  std::shared_ptr<webrtc::VideoCaptureModule::DeviceInfo> GetDeviceInfo(
      int aEngine);
  VideoEngine* EnsureInitialized(int aEngine);

  
  
  void CloseEngines();

  void OnShutdown();

  
  
  const UniquePtr<media::ShutdownBlockingTicket> mShutdownBlocker;
  
  MozPromiseRequestHolder<ShutdownMozPromise> mShutdownRequest;

  
  const nsCOMPtr<nsISerialEventTarget> mVideoCaptureThread;

  
  const RefPtr<VideoEngineArray> mEngines;

  
  
  
  const RefPtr<
      media::Refcountable<nsTArray<std::unique_ptr<AggregateCapturer>>>>
      mCapturers;

  
  
  const RefPtr<VideoCaptureFactory> mVideoCaptureFactory;

  
  
  
  
  
  
  DataMutex<std::map<int, ShmemPool>> mShmemPools;

  
  const nsCOMPtr<nsISerialEventTarget> mPBackgroundEventTarget;

  
  bool mDestroyed;

  std::map<nsCString, nsTArray<webrtc::VideoCaptureCapability>>
      mAllCandidateCapabilities;

  
  
  MediaEventListener mDeviceChangeEventListener;
  bool mDeviceChangeEventListenerConnected = false;

  
  
  nsMainThreadPtrHandle<WebrtcLogSinkHandle> mLogHandle;
};

}  

#endif  
