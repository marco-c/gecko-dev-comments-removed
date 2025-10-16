





#ifndef nsIWidget_h__
#define nsIWidget_h__

#include <cmath>
#include <cstdint>
#include "imgIContainer.h"
#include "ErrorList.h"
#include "Units.h"
#include "mozilla/AlreadyAddRefed.h"
#include "mozilla/Assertions.h"
#include "mozilla/Attributes.h"
#include "mozilla/EventForwards.h"
#include "mozilla/Maybe.h"
#include "mozilla/RefPtr.h"
#include "mozilla/TimeStamp.h"
#include "mozilla/UniquePtr.h"
#include "mozilla/gfx/Matrix.h"
#include "mozilla/gfx/Rect.h"
#include "mozilla/layers/LayersTypes.h"
#include "mozilla/layers/ScrollableLayerGuid.h"
#include "mozilla/layers/ZoomConstraints.h"
#include "mozilla/image/Resolution.h"
#include "mozilla/widget/IMEData.h"
#include "nsCOMPtr.h"
#include "nsColor.h"
#include "nsDebug.h"
#include "nsID.h"
#include "nsIDOMWindowUtils.h"
#include "nsISupports.h"
#include "nsITheme.h"
#include "nsITimer.h"
#include "nsIWidgetListener.h"
#include "nsRect.h"
#include "nsSize.h"
#include "nsStringFwd.h"
#include "nsTArray.h"
#include "nsTHashMap.h"
#include "nsWeakReference.h"
#include "mozilla/widget/InitData.h"
#include "nsXULAppAPI.h"



#ifdef MOZ_IS_GCC
#  include "mozilla/layers/NativeLayer.h"
#endif




#define TOUCH_INJECT_MAX_POINTS 256


class nsIBidiKeyboard;
class nsIRollupListener;
class nsIContent;
class nsMenuPopupFrame;
class nsIRunnable;
class nsIWidget;

namespace mozilla {
class CompositorVsyncDispatcher;
class FallbackRenderer;
class LiveResizeListener;
class PanGestureInput;
class MultiTouchInput;
class Mutex;
class PinchGestureInput;
class SwipeTracker;
class VsyncDispatcher;
class WidgetGUIEvent;
class WidgetInputEvent;
class WidgetKeyboardEvent;
enum ScreenRotation : uint8_t;
enum class ColorScheme : uint8_t;
enum class NativeKeyBindingsType : uint8_t;
enum class WindowButtonType : uint8_t;
struct FontRange;
struct SwipeEventQueue;

enum class WindowShadow : uint8_t {
  None,
  Menu,
  Panel,
  Tooltip,
};

#if defined(MOZ_WIDGET_ANDROID)
namespace ipc {
class Shmem;
}
#endif  
namespace dom {
class BrowserChild;
enum class CallerType : uint32_t;
}  
class WindowRenderer;
namespace gfx {
class DrawTarget;
class SourceSurface;
}  
namespace layers {
class APZEventState;
class AsyncDragMetrics;
class Compositor;
class CompositorBridgeChild;
class CompositorBridgeParent;
class CompositorOptions;
class CompositorSession;
class GeckoContentController;
class IAPZCTreeManager;
class ImageContainer;
class LayerManager;
class NativeLayer;
class NativeLayerRoot;
class RemoteCompositorSession;
class WebRenderBridgeChild;
class WebRenderLayerManager;
struct APZEventResult;
struct CompositorScrollUpdate;
struct FrameMetrics;
struct ScrollableLayerGuid;
}  
namespace widget {
enum class ThemeChangeKind : uint8_t;
enum class OcclusionState : uint8_t;
class TextEventDispatcher;
class TextEventDispatcherListener;
class LocalesChangedObserver;
class WidgetShutdownObserver;
class CompositorWidget;
class CompositorWidgetInitData;
class CompositorWidgetDelegate;
class InProcessCompositorWidget;
class WidgetRenderingContext;
class Screen;
}  
namespace wr {
class DisplayListBuilder;
class IpcResourceUpdateQueue;
enum class RenderRoot : uint8_t;
}  
#ifdef ACCESSIBILITY
namespace a11y {
class LocalAccessible;
}
#endif
}  











typedef nsEventStatus (*EVENT_CALLBACK)(mozilla::WidgetGUIEvent* aEvent);




typedef void* nsNativeWidget;





enum TouchPointerState : uint8_t {
  
  TOUCH_HOVER = (1 << 0),
  
  TOUCH_CONTACT = (1 << 1),
  
  TOUCH_REMOVE = (1 << 2),
  
  
  
  
  TOUCH_CANCEL = (1 << 3),

  
  ALL_BITS = (1 << 4) - 1
};




#define NS_NATIVE_WINDOW 0
#define NS_NATIVE_GRAPHIC 1
#define NS_NATIVE_WIDGET 3
#define NS_NATIVE_REGION 5
#define NS_NATIVE_OFFSETX 6
#define NS_NATIVE_OFFSETY 7
#define NS_NATIVE_SCREEN 9

#define NS_NATIVE_SHELLWIDGET 10
#define NS_NATIVE_OPENGL_CONTEXT 12






#define NS_RAW_NATIVE_IME_CONTEXT 14
#define NS_NATIVE_WINDOW_WEBRTC_DEVICE_ID 15
#ifdef XP_WIN
#  define NS_NATIVE_ICOREWINDOW 103  // winrt specific
#endif
#if defined(MOZ_WIDGET_GTK)
#  define NS_NATIVE_EGL_WINDOW 106
#endif
#ifdef MOZ_WIDGET_ANDROID
#  define NS_JAVA_SURFACE 100
#endif

#define MOZ_WIDGET_MAX_SIZE 16384
#define MOZ_WIDGET_INVALID_SCALE 0.0


#define NS_IWIDGET_IID \
  {0x06396bf6, 0x2dd8, 0x45e5, {0xac, 0x45, 0x75, 0x26, 0x53, 0xb1, 0xc9, 0x80}}





enum nsCursor {  
  eCursor_standard,
  
  eCursor_wait,
  
  eCursor_select,
  
  eCursor_hyperlink,
  
  eCursor_n_resize,
  eCursor_s_resize,
  eCursor_w_resize,
  eCursor_e_resize,
  
  eCursor_nw_resize,
  eCursor_se_resize,
  eCursor_ne_resize,
  eCursor_sw_resize,
  eCursor_crosshair,
  eCursor_move,
  eCursor_help,
  eCursor_copy,  
  eCursor_alias,
  eCursor_context_menu,
  eCursor_cell,
  eCursor_grab,
  eCursor_grabbing,
  eCursor_spinning,
  eCursor_zoom_in,
  eCursor_zoom_out,
  eCursor_not_allowed,
  eCursor_col_resize,
  eCursor_row_resize,
  eCursor_no_drop,
  eCursor_vertical_text,
  eCursor_all_scroll,
  eCursor_nesw_resize,
  eCursor_nwse_resize,
  eCursor_ns_resize,
  eCursor_ew_resize,
  eCursor_none,
  
  
  eCursorCount,

  
  eCursorInvalid = eCursorCount + 1
};




#define NS_WIDGET_SLEEP_OBSERVER_TOPIC "sleep_notification"




#define NS_WIDGET_WAKE_OBSERVER_TOPIC "wake_notification"






#define NS_WIDGET_SUSPEND_PROCESS_OBSERVER_TOPIC "suspend_process_notification"





#define NS_WIDGET_RESUME_PROCESS_OBSERVER_TOPIC "resume_process_notification"





#define NS_WIDGET_MAC_APP_ACTIVATE_OBSERVER_TOPIC "mac_app_activate"

namespace mozilla::widget {





struct SizeConstraints {
  SizeConstraints()
      : mMaxSize(MOZ_WIDGET_MAX_SIZE, MOZ_WIDGET_MAX_SIZE),
        mScale(MOZ_WIDGET_INVALID_SCALE) {}

  SizeConstraints(mozilla::LayoutDeviceIntSize aMinSize,
                  mozilla::LayoutDeviceIntSize aMaxSize,
                  mozilla::DesktopToLayoutDeviceScale aScale)
      : mMinSize(aMinSize), mMaxSize(aMaxSize), mScale(aScale) {
    if (mMaxSize.width > MOZ_WIDGET_MAX_SIZE) {
      mMaxSize.width = MOZ_WIDGET_MAX_SIZE;
    }
    if (mMaxSize.height > MOZ_WIDGET_MAX_SIZE) {
      mMaxSize.height = MOZ_WIDGET_MAX_SIZE;
    }
  }

  mozilla::LayoutDeviceIntSize mMinSize;
  mozilla::LayoutDeviceIntSize mMaxSize;

  







  mozilla::DesktopToLayoutDeviceScale mScale;
};

class MOZ_RAII AutoSynthesizedEventCallbackNotifier final {
 public:
  explicit AutoSynthesizedEventCallbackNotifier(
      nsISynthesizedEventCallback* aCallback)
      : mCallback(aCallback) {}

  void SkipNotification() { mCallback = nullptr; }

  Maybe<uint64_t> SaveCallback() {
    if (!mCallback) {
      return Nothing();
    }
    uint64_t callbackId = ++sCallbackId;
    sSavedCallbacks.InsertOrUpdate(callbackId, mCallback);
    SkipNotification();
    return Some(callbackId);
  }

  ~AutoSynthesizedEventCallbackNotifier() {
    if (mCallback) {
      mCallback->OnCompleteDispatch();
    }
  }

  static void NotifySavedCallback(const uint64_t& aCallbackId) {
    MOZ_ASSERT(aCallbackId > 0, "Callback ID must be non-zero");

    auto entry = sSavedCallbacks.Extract(aCallbackId);
    if (!entry) {
      MOZ_ASSERT_UNREACHABLE("We should always find a saved callback");
      return;
    }

    entry.value()->OnCompleteDispatch();
  }

 private:
  nsCOMPtr<nsISynthesizedEventCallback> mCallback;

  static uint64_t sCallbackId;
  static nsTHashMap<uint64_t, nsCOMPtr<nsISynthesizedEventCallback>>
      sSavedCallbacks;
};

}  





class nsIWidget : public nsSupportsWeakReference {
 public:
  template <class EventType, class InputType>
  friend class DispatchEventOnMainThread;
  friend class mozilla::widget::InProcessCompositorWidget;
  friend class mozilla::layers::RemoteCompositorSession;
  typedef mozilla::gfx::DrawTarget DrawTarget;
  typedef mozilla::gfx::SourceSurface SourceSurface;
  typedef mozilla::layers::CompositorBridgeChild CompositorBridgeChild;
  typedef mozilla::layers::CompositorBridgeParent CompositorBridgeParent;
  typedef mozilla::layers::IAPZCTreeManager IAPZCTreeManager;
  typedef mozilla::layers::GeckoContentController GeckoContentController;
  typedef mozilla::layers::ScrollableLayerGuid ScrollableLayerGuid;
  typedef mozilla::layers::APZEventState APZEventState;
  typedef mozilla::CSSIntRect CSSIntRect;
  typedef mozilla::ScreenRotation ScreenRotation;
  typedef mozilla::widget::CompositorWidgetDelegate CompositorWidgetDelegate;
  typedef mozilla::layers::CompositorSession CompositorSession;
  typedef mozilla::layers::ImageContainer ImageContainer;
  typedef mozilla::dom::BrowserChild BrowserChild;
  typedef mozilla::layers::AsyncDragMetrics AsyncDragMetrics;
  typedef mozilla::layers::FrameMetrics FrameMetrics;
  typedef mozilla::layers::LayerManager LayerManager;
  typedef mozilla::WindowRenderer WindowRenderer;
  typedef mozilla::layers::LayersBackend LayersBackend;
  typedef mozilla::layers::LayersId LayersId;
  typedef mozilla::layers::ZoomConstraints ZoomConstraints;
  typedef mozilla::widget::IMEEnabled IMEEnabled;
  typedef mozilla::widget::IMEMessage IMEMessage;
  typedef mozilla::widget::IMENotification IMENotification;
  typedef mozilla::widget::IMENotificationRequests IMENotificationRequests;
  typedef mozilla::widget::IMEState IMEState;
  typedef mozilla::widget::InputContext InputContext;
  typedef mozilla::widget::InputContextAction InputContextAction;
  typedef mozilla::widget::NativeIMEContext NativeIMEContext;
  typedef mozilla::widget::SizeConstraints SizeConstraints;
  typedef mozilla::widget::TextEventDispatcher TextEventDispatcher;
  typedef mozilla::widget::TextEventDispatcherListener
      TextEventDispatcherListener;
  typedef mozilla::LayoutDeviceMargin LayoutDeviceMargin;
  typedef mozilla::LayoutDeviceIntMargin LayoutDeviceIntMargin;
  typedef mozilla::LayoutDeviceIntPoint LayoutDeviceIntPoint;
  typedef mozilla::LayoutDeviceIntRect LayoutDeviceIntRect;
  typedef mozilla::LayoutDeviceRect LayoutDeviceRect;
  typedef mozilla::LayoutDeviceIntRegion LayoutDeviceIntRegion;
  typedef mozilla::LayoutDeviceIntSize LayoutDeviceIntSize;
  typedef mozilla::ScreenIntPoint ScreenIntPoint;
  typedef mozilla::ScreenIntMargin ScreenIntMargin;
  typedef mozilla::ScreenIntSize ScreenIntSize;
  typedef mozilla::ScreenPoint ScreenPoint;
  typedef mozilla::CSSToScreenScale CSSToScreenScale;
  typedef mozilla::DesktopIntRect DesktopIntRect;
  typedef mozilla::DesktopPoint DesktopPoint;
  typedef mozilla::DesktopIntPoint DesktopIntPoint;
  typedef mozilla::DesktopRect DesktopRect;
  typedef mozilla::DesktopSize DesktopSize;
  typedef mozilla::CSSPoint CSSPoint;
  typedef mozilla::CSSRect CSSRect;

  NS_DECL_THREADSAFE_ISUPPORTS

  using TouchPointerState = ::TouchPointerState;
  using InitData = mozilla::widget::InitData;
  using WindowType = mozilla::widget::WindowType;
  using PopupType = mozilla::widget::PopupType;
  using PopupLevel = mozilla::widget::PopupLevel;
  using BorderStyle = mozilla::widget::BorderStyle;
  using TransparencyMode = mozilla::widget::TransparencyMode;
  using Screen = mozilla::widget::Screen;

  
  struct ThemeGeometry {
    
    
    nsITheme::ThemeGeometryType mType;
    
    LayoutDeviceIntRect mRect;

    ThemeGeometry(nsITheme::ThemeGeometryType aType,
                  const LayoutDeviceIntRect& aRect)
        : mType(aType), mRect(aRect) {}
  };

  NS_INLINE_DECL_STATIC_IID(NS_IWIDGET_IID)

  




























  [[nodiscard]] virtual nsresult Create(nsIWidget* aParent,
                                        const LayoutDeviceIntRect& aRect,
                                        InitData* = nullptr) = 0;

  







  [[nodiscard]] virtual nsresult Create(nsIWidget* aParent,
                                        const DesktopIntRect& aRect,
                                        InitData* aInitData = nullptr) {
    LayoutDeviceIntRect devPixRect =
        RoundedToInt(aRect * GetDesktopToDeviceScale());
    return Create(aParent, devPixRect, aInitData);
  }

  










  already_AddRefed<nsIWidget> CreateChild(const LayoutDeviceIntRect& aRect,
                                          InitData&);

  













  virtual void AttachViewToTopLevel(bool aUseAttachedEvents);

  



  virtual void SetAttachedWidgetListener(nsIWidgetListener* aListener);
  virtual nsIWidgetListener* GetAttachedWidgetListener() const;
  virtual void SetPreviouslyAttachedWidgetListener(
      nsIWidgetListener* aListener);
  virtual nsIWidgetListener* GetPreviouslyAttachedWidgetListener();

  


  virtual void DidGetNonBlankPaint() {}

  



  virtual nsIWidgetListener* GetWidgetListener() const;
  virtual void SetWidgetListener(nsIWidgetListener* alistener);

  




  virtual void Destroy();

  



  bool Destroyed() const { return mOnDestroyCalled; }

  
  void ClearParent();

  






  nsIWidget* GetParent() const { return mParent; }

  
  virtual void DidClearParent(nsIWidget* aOldParent) {}

  




  nsIWidget* GetTopLevelWidget();
  bool IsTopLevelWidget() const {
    return mWindowType == WindowType::TopLevel ||
           mWindowType == WindowType::Dialog ||
           mWindowType == WindowType::Invisible;
  }

  



  virtual float GetDPI();

  


  static float GetFallbackDPI();

  




  virtual mozilla::DesktopToLayoutDeviceScale GetDesktopToDeviceScale() {
    return mozilla::DesktopToLayoutDeviceScale(1.0);
  }

  
  static DesktopIntPoint ConstrainPositionToBounds(
      const DesktopIntPoint&, const mozilla::DesktopIntSize&,
      const DesktopIntRect&);

  void DynamicToolbarOffsetChanged(mozilla::ScreenIntCoord aOffset);

  






  mozilla::CSSToLayoutDeviceScale GetDefaultScale();

  


  static mozilla::CSSToLayoutDeviceScale GetFallbackDefaultScale();

  



  nsIWidget* GetFirstChild() const { return mFirstChild; }

  



  nsIWidget* GetLastChild() const { return mLastChild; }

  


  nsIWidget* GetNextSibling() const { return mNextSibling; }

  


  void SetNextSibling(nsIWidget* aSibling) { mNextSibling = aSibling; }

  


  nsIWidget* GetPrevSibling() const { return mPrevSibling; }

  


  void SetPrevSibling(nsIWidget* aSibling) { mPrevSibling = aSibling; }

  





  virtual void Show(bool aState) = 0;

  



  virtual bool NeedsRecreateToReshow() { return false; }

  


  virtual void SetModal(bool aModal) {}

  


  virtual bool IsRunningAppModal() { return false; }

  





  virtual uint32_t GetMaxTouchPoints() const;

  



  virtual bool IsVisible() const = 0;

  





  virtual bool IsMapped() const { return true; }

  



  virtual void ConstrainPosition(DesktopIntPoint&) {}

  


















  









  virtual void Move(double aX, double aY) = 0;

  
  
  
  
  
  
  
  bool BoundsUseDesktopPixels() const {
    return mWindowType <= WindowType::Popup;
  }

  







  virtual void MoveClient(const DesktopPoint& aOffset);

  








  virtual void Resize(double aWidth, double aHeight, bool aRepaint) = 0;

  





  virtual void LockAspectRatio(bool aShouldLock) {};

  














  virtual void Resize(double aX, double aY, double aWidth, double aHeight,
                      bool aRepaint) = 0;

  





  virtual void ResizeClient(const DesktopSize& aSize, bool aRepaint);

  









  virtual void ResizeClient(const DesktopRect& aRect, bool aRepaint);

  



  virtual void SetSizeMode(nsSizeMode aMode) = 0;

  virtual void GetWorkspaceID(nsAString& aWorkspaceID) {
    aWorkspaceID.Truncate();
  }

  virtual void MoveToWorkspace(const nsAString& aWorkspaceID) {}

  
  virtual bool IsCloaked() const { return false; }

  


  virtual void SuppressAnimation(bool aSuppress) {}

  
  virtual void SetMicaBackdrop(bool) {}

  



  virtual nsSizeMode SizeMode() = 0;

  
  bool IsTiled() const { return mIsTiled; }
  
  bool IsFullyOccluded() const { return mIsFullyOccluded; }

  




  virtual void Enable(bool aState) = 0;

  


  virtual bool IsEnabled() const = 0;

  


  enum class Raise {
    No,
    Yes,
  };

  


  virtual void SetFocus(Raise, mozilla::dom::CallerType aCallerType) = 0;

  






  virtual LayoutDeviceIntRect GetBounds();

  





  virtual LayoutDeviceIntRect GetScreenBounds();

  














  [[nodiscard]] virtual nsresult GetRestoredBounds(LayoutDeviceIntRect& aRect);

  




  virtual bool PersistClientBounds() const { return false; }

  







  virtual LayoutDeviceIntRect GetClientBounds();

  
  virtual void SetCustomTitlebar(bool) {}

  



  virtual void SetResizeMargin(mozilla::LayoutDeviceIntCoord) {}

  




  virtual LayoutDeviceIntPoint GetClientOffset();

  



  virtual LayoutDeviceIntPoint GetScreenEdgeSlop() { return {}; }

  


  virtual LayoutDeviceIntSize GetClientSize() {
    
    
    return GetClientBounds().Size();
  }

  







  virtual void SetBackgroundColor(const nscolor& aColor) {}

  struct Cursor {
    
    
    
    nsCursor mDefaultCursor = eCursor_standard;
    
    nsCOMPtr<imgIContainer> mContainer;
    uint32_t mHotspotX = 0;
    uint32_t mHotspotY = 0;
    mozilla::ImageResolution mResolution;

    bool IsCustom() const { return !!mContainer; }

    bool operator==(const Cursor& aOther) const {
      return mDefaultCursor == aOther.mDefaultCursor &&
             mContainer.get() == aOther.mContainer.get() &&
             mHotspotX == aOther.mHotspotX && mHotspotY == aOther.mHotspotY &&
             mResolution == aOther.mResolution;
    }

    bool operator!=(const Cursor& aOther) const { return !(*this == aOther); }
  };

  


  virtual void SetCursor(const Cursor&);
  virtual void SetCustomCursorAllowed(bool);
  



  void ClearCachedCursor() {
    mCursor = {};
    mUpdateCursor = true;
  }

  static nsIntSize CustomCursorSize(const Cursor&);

  


  WindowType GetWindowType() const { return mWindowType; }
  PopupType GetPopupType() const { return mPopupType; }
  bool HasRemoteContent() const { return mHasRemoteContent; }

  
















  virtual void SetTransparencyMode(TransparencyMode aMode);

  



  virtual TransparencyMode GetTransparencyMode();

  
  
  
  
  virtual int32_t RoundsWidgetCoordinatesTo() { return 1; }
  static LayoutDeviceIntRect MaybeRoundToDisplayPixels(
      const LayoutDeviceIntRect& aRect, TransparencyMode aTransparency,
      int32_t aRound);

  LayoutDeviceIntRect MaybeRoundToDisplayPixels(
      const LayoutDeviceIntRect& aRect) {
    return MaybeRoundToDisplayPixels(aRect, GetTransparencyMode(),
                                     RoundsWidgetCoordinatesTo());
  }

  




  virtual void SetWindowShadowStyle(mozilla::WindowShadow aStyle) {}

  





  virtual void SetWindowOpacity(float aOpacity) {}

  





  virtual void SetWindowTransform(const mozilla::gfx::Matrix& aTransform) {}

  



  virtual void SetColorScheme(const mozilla::Maybe<mozilla::ColorScheme>&) {}

  






  struct InputRegion {
    bool mFullyTransparent = false;
    mozilla::LayoutDeviceIntCoord mMargin = 0;
  };
  virtual void SetInputRegion(const InputRegion&) {}

  





  virtual void SetShowsToolbarButton(bool aShow) {}

  








  virtual void SetSupportsNativeFullscreen(bool aSupportsNativeFullscreen) {}

  enum WindowAnimationType {
    eGenericWindowAnimation,
    eDocumentWindowAnimation
  };

  






  virtual void SetWindowAnimationType(WindowAnimationType aType) {}

  



  virtual void SetHideTitlebarSeparator(bool) {}

  
  
  virtual bool IsMacTitlebarDirectionRTL() { return false; }

  


  virtual void HideWindowChrome(bool aShouldHide) {}

  enum FullscreenTransitionStage {
    eBeforeFullscreenToggle,
    eAfterFullscreenToggle
  };

  









  virtual bool PrepareForFullscreenTransition(nsISupports** aData) {
    return false;
  }

  




  virtual void PerformFullscreenTransition(FullscreenTransitionStage aStage,
                                           uint16_t aDuration,
                                           nsISupports* aData,
                                           nsIRunnable* aCallback);

  


  virtual void CleanupFullscreenTransition() {}

  


  virtual already_AddRefed<Screen> GetWidgetScreen();

  






  virtual nsresult MakeFullScreen(bool aFullScreen);
  void InfallibleMakeFullScreen(bool aFullScreen);

  





  virtual nsresult MakeFullScreenWithNativeTransition(bool aFullScreen) {
    return MakeFullScreen(aFullScreen);
  }

  



  virtual void Invalidate(const LayoutDeviceIntRect& aRect) = 0;

  enum LayerManagerPersistence {
    LAYER_MANAGER_CURRENT = 0,
    LAYER_MANAGER_PERSISTENT
  };

  





  virtual WindowRenderer* GetWindowRenderer();

  


  bool HasWindowRenderer() const { return !!mWindowRenderer; }

  





  virtual void PrepareWindowEffects() {}

  










  virtual void UpdateThemeGeometries(const nsTArray<ThemeGeometry>&) {}

  




  virtual void UpdateOpaqueRegion(const LayoutDeviceIntRegion& aOpaqueRegion) {}
  virtual LayoutDeviceIntRegion GetOpaqueRegionForTesting() const { return {}; }

  


  virtual void UpdateWindowDraggingRegion(
      const LayoutDeviceIntRegion& aRegion) {}

  




  virtual void ReportSwipeStarted(uint64_t aInputBlockId, bool aStartSwipe);

  
  
  bool MayStartSwipeForNonAPZ(const mozilla::PanGestureInput& aPanInput);
  void TrackScrollEventAsSwipe(const mozilla::PanGestureInput& aSwipeStartEvent,
                               uint32_t aAllowedDirections,
                               uint64_t aInputBlockId);
  struct SwipeInfo {
    bool wantsSwipe;
    uint32_t allowedDirections;
  };
  SwipeInfo SendMayStartSwipe(const mozilla::PanGestureInput& aSwipeStartEvent);
  
  
  mozilla::WidgetWheelEvent MayStartSwipeForAPZ(
      const mozilla::PanGestureInput& aPanInput,
      const mozilla::layers::APZEventResult& aApzResult);

  void NotifyWindowDestroyed();
  void NotifySizeMoveDone();
  using ByMoveToRect = nsIWidgetListener::ByMoveToRect;
  void NotifyWindowMoved(int32_t aX, int32_t aY,
                         ByMoveToRect = ByMoveToRect::No);
  
  
  
  void NotifyThemeChanged(mozilla::widget::ThemeChangeKind);
  void NotifyAPZOfDPIChange();

  
  
  bool IsSmallPopup() const;

  PopupLevel GetPopupLevel() { return mPopupLevel; }

  


  virtual void* GetNativeData(uint32_t aDataType) = 0;

 protected:
  nsIWidget();
  virtual ~nsIWidget();
  explicit nsIWidget(BorderStyle);

  
  
  
  virtual bool PreRender(mozilla::widget::WidgetRenderingContext* aContext) {
    return true;
  }
  virtual void PostRender(mozilla::widget::WidgetRenderingContext* aContext) {}
  virtual RefPtr<mozilla::layers::NativeLayerRoot> GetNativeLayerRoot() {
    return nullptr;
  }
  virtual already_AddRefed<DrawTarget> StartRemoteDrawing();
  virtual already_AddRefed<DrawTarget> StartRemoteDrawingInRegion(
      const LayoutDeviceIntRegion& aInvalidRegion) {
    return StartRemoteDrawing();
  }
  virtual void EndRemoteDrawing() {}
  virtual void EndRemoteDrawingInRegion(
      DrawTarget* aDrawTarget, const LayoutDeviceIntRegion& aInvalidRegion) {
    EndRemoteDrawing();
  }
  virtual void CleanupRemoteDrawing() {}
  virtual void CleanupWindowEffects() {}
  virtual bool InitCompositor(mozilla::layers::Compositor* aCompositor) {
    return true;
  }
  virtual uint32_t GetGLFrameBufferFormat();
  virtual bool CompositorInitiallyPaused() { return false; }

  void AddToChildList(nsIWidget* aChild);
  void RemoveFromChildList(nsIWidget* aChild);
  void RemoveAllChildren();

  void ResolveIconName(const nsAString& aIconName, const nsAString& aIconSuffix,
                       nsIFile** aResult);
  virtual void OnDestroy();
  void BaseCreate(nsIWidget* aParent, InitData* aInitData);

  virtual void ConfigureAPZCTreeManager();
  virtual void ConfigureAPZControllerThread();
  virtual already_AddRefed<GeckoContentController>
  CreateRootContentController();

  mozilla::dom::Document* GetDocument() const;
  void EnsureTextEventDispatcher();
  
  void OnRenderingDeviceReset();
  bool UseAPZ() const;
  bool AllowWebRenderForThisWindow();

  





  void DispatchTouchInput(mozilla::MultiTouchInput& aInput);

  





  void DispatchPanGestureInput(mozilla::PanGestureInput& aInput);
  void DispatchPinchGestureInput(mozilla::PinchGestureInput& aInput);

  static bool ConvertStatus(nsEventStatus aStatus) {
    return aStatus == nsEventStatus_eConsumeNoDefault;
  }

 protected:
  
  virtual bool UseExternalCompositingSurface() const { return false; }

  








  virtual void DestroyCompositor();
  void DestroyLayerManager();
  void ReleaseContentController();
  void RevokeTransactionIdAllocator();

  void FreeShutdownObserver();
  void FreeLocalesChangedObserver();

  bool IsPIPWindow() const { return mIsPIPWindow; };

 public:
  





  virtual nsresult SetTitle(const nsAString& aTitle) = 0;

  







  virtual void SetIcon(const nsAString& aIconSpec) {}

  




  virtual LayoutDeviceIntPoint WidgetToScreenOffset() = 0;

  



  virtual LayoutDeviceIntPoint TopLevelWidgetToScreenOffset() {
    return WidgetToScreenOffset();
  }

  






  virtual mozilla::LayoutDeviceToLayoutDeviceMatrix4x4
  WidgetToTopLevelWidgetTransform() {
    return mozilla::LayoutDeviceToLayoutDeviceMatrix4x4();
  }

  mozilla::LayoutDeviceIntPoint WidgetToTopLevelWidgetOffset() {
    return mozilla::LayoutDeviceIntPoint::Round(
        WidgetToTopLevelWidgetTransform().TransformPoint(
            mozilla::LayoutDevicePoint()));
  }

  






  virtual LayoutDeviceIntMargin NormalSizeModeClientToWindowMargin() {
    return {};
  }

  



  LayoutDeviceIntSize NormalSizeModeClientToWindowSizeDifference();

  


  virtual nsresult DispatchEvent(mozilla::WidgetGUIEvent* event,
                                 nsEventStatus& aStatus) = 0;

  



  virtual void DispatchEventToAPZOnly(mozilla::WidgetInputEvent* aEvent);

  



  virtual bool DispatchWindowEvent(mozilla::WidgetGUIEvent& event);

  
  
  struct ContentAndAPZEventStatus {
    
    
    nsEventStatus mApzStatus = nsEventStatus_eIgnore;
    nsEventStatus mContentStatus = nsEventStatus_eIgnore;
  };

  




  virtual ContentAndAPZEventStatus DispatchInputEvent(
      mozilla::WidgetInputEvent* aEvent);

  



  virtual void SetConfirmedTargetAPZC(
      uint64_t aInputBlockId,
      const nsTArray<ScrollableLayerGuid>& aTargets) const;

  


  virtual bool AsyncPanZoomEnabled() const;

  

  virtual void SwipeFinished();

  


  virtual void EnableDragDrop(bool aEnable) {}
  nsresult AsyncEnableDragDrop(bool aEnable);

  














  virtual void SetWindowClass(const nsAString& xulWinType,
                              const nsAString& xulWinClass,
                              const nsAString& xulWinName) {}

  virtual void SetIsEarlyBlankWindow(bool) {}

  






  virtual void CaptureRollupEvents(bool aDoCapture) {}

  










  [[nodiscard]] virtual nsresult GetAttention(int32_t aCycleCount) {
    return NS_OK;
  }

  



  virtual bool HasPendingInputEvent();

  








  virtual bool ShowsResizeIndicator(LayoutDeviceIntRect* aResizerRect);

  
  nsEventStatus ProcessUntransformedAPZEvent(
      mozilla::WidgetInputEvent* aEvent,
      const mozilla::layers::APZEventResult& aApzResult);

  
  
  enum Modifiers : uint32_t {
    NO_MODIFIERS = 0x00000000,
    CAPS_LOCK = 0x00000001,  
    NUM_LOCK = 0x00000002,   
    SHIFT_L = 0x00000100,
    SHIFT_R = 0x00000200,
    CTRL_L = 0x00000400,
    CTRL_R = 0x00000800,
    ALT_L = 0x00001000,  
    ALT_R = 0x00002000,
    COMMAND_L = 0x00004000,
    COMMAND_R = 0x00008000,
    HELP = 0x00010000,
    ALTGRAPH = 0x00020000,  
                            
                            
                            
    FUNCTION = 0x00100000,
    NUMERIC_KEY_PAD = 0x01000000  
  };
  
























  virtual nsresult SynthesizeNativeKeyEvent(
      int32_t aNativeKeyboardLayout, int32_t aNativeKeyCode,
      uint32_t aModifierFlags, const nsAString& aCharacters,
      const nsAString& aUnmodifiedCharacters,
      nsISynthesizedEventCallback* aCallback) {
    mozilla::widget::AutoSynthesizedEventCallbackNotifier notifier(aCallback);
    return NS_ERROR_UNEXPECTED;
  }

  
















  enum class NativeMouseMessage : uint32_t {
    ButtonDown,   
    ButtonUp,     
    Move,         
    EnterWindow,  
    LeaveWindow,  
  };
  virtual nsresult SynthesizeNativeMouseEvent(
      LayoutDeviceIntPoint aPoint, NativeMouseMessage aNativeMessage,
      mozilla::MouseButton aButton, nsIWidget::Modifiers aModifierFlags,
      nsISynthesizedEventCallback* aCallback) {
    mozilla::widget::AutoSynthesizedEventCallbackNotifier notifier(aCallback);
    return NS_ERROR_UNEXPECTED;
  }

  






  virtual nsresult SynthesizeNativeMouseMove(
      LayoutDeviceIntPoint aPoint, nsISynthesizedEventCallback* aCallback) {
    mozilla::widget::AutoSynthesizedEventCallbackNotifier notifier(aCallback);
    return NS_ERROR_UNEXPECTED;
  }

  






















  virtual nsresult SynthesizeNativeMouseScrollEvent(
      LayoutDeviceIntPoint aPoint, uint32_t aNativeMessage, double aDeltaX,
      double aDeltaY, double aDeltaZ, uint32_t aModifierFlags,
      uint32_t aAdditionalFlags, nsISynthesizedEventCallback* aCallback) {
    mozilla::widget::AutoSynthesizedEventCallbackNotifier notifier(aCallback);
    return NS_ERROR_UNEXPECTED;
  }

  



  enum TouchpadGesturePhase {
    PHASE_BEGIN = 0,
    PHASE_UPDATE = 1,
    PHASE_END = 2
  };
  














  virtual nsresult SynthesizeNativeTouchPoint(
      uint32_t aPointerId, TouchPointerState aPointerState,
      LayoutDeviceIntPoint aPoint, double aPointerPressure,
      uint32_t aPointerOrientation, nsISynthesizedEventCallback* aCallback) {
    mozilla::widget::AutoSynthesizedEventCallbackNotifier notifier(aCallback);
    return NS_ERROR_UNEXPECTED;
  }
  


  virtual nsresult SynthesizeNativeTouchPadPinch(
      TouchpadGesturePhase aEventPhase, float aScale,
      LayoutDeviceIntPoint aPoint, int32_t aModifierFlags) {
    MOZ_CRASH("SynthesizeNativeTouchPadPinch not implemented on this platform");
    return NS_ERROR_UNEXPECTED;
  }

  







  virtual nsresult SynthesizeNativeTouchTap(
      LayoutDeviceIntPoint aPoint, bool aLongTap,
      nsISynthesizedEventCallback* aCallback);

  virtual nsresult SynthesizeNativePenInput(
      uint32_t aPointerId, TouchPointerState aPointerState,
      LayoutDeviceIntPoint aPoint, double aPressure, uint32_t aRotation,
      int32_t aTiltX, int32_t aTiltY, int32_t aButton,
      nsISynthesizedEventCallback* aCallback) {
    MOZ_CRASH("SynthesizeNativePenInput not implemented on this platform");
    return NS_ERROR_UNEXPECTED;
  }

  



  virtual nsresult SynthesizeNativeTouchpadDoubleTap(
      LayoutDeviceIntPoint aPoint, uint32_t aModifierFlags) {
    MOZ_CRASH(
        "SynthesizeNativeTouchpadDoubleTap not implemented on this platform");
    return NS_ERROR_UNEXPECTED;
  }

  


  virtual nsresult SynthesizeNativeTouchpadPan(
      TouchpadGesturePhase aEventPhase, LayoutDeviceIntPoint aPoint,
      double aDeltaX, double aDeltaY, int32_t aModifierFlags,
      nsISynthesizedEventCallback* aCallback) {
    MOZ_CRASH("SynthesizeNativeTouchpadPan not implemented on this platform");
    return NS_ERROR_UNEXPECTED;
  }

  virtual void StartAsyncScrollbarDrag(const AsyncDragMetrics& aDragMetrics);

  





  virtual bool StartAsyncAutoscroll(const ScreenPoint& aAnchorLocation,
                                    const ScrollableLayerGuid& aGuid);

  



  virtual void StopAsyncAutoscroll(const ScrollableLayerGuid& aGuid);

  virtual LayersId GetRootLayerTreeId();

  









  class AutoLayerManagerSetup {
   public:
    AutoLayerManagerSetup(nsIWidget* aWidget, gfxContext* aTarget);
    ~AutoLayerManagerSetup();

   private:
    nsIWidget* mWidget;
    mozilla::FallbackRenderer* mRenderer = nullptr;
  };
  friend class AutoLayerManagerSetup;

  virtual bool ShouldUseOffMainThreadCompositing();

  static nsIRollupListener* GetActiveRollupListener();

  void Shutdown();
  void QuitIME();

  
  
  
  
  void NotifyLiveResizeStarted();
  void NotifyLiveResizeStopped();

  
  
  virtual void GetCompositorWidgetInitData(
      mozilla::widget::CompositorWidgetInitData* aInitData) {}

  
  
  
  
  
  
  
  virtual void NotifyCompositorSessionLost(
      mozilla::layers::CompositorSession* aSession);

  already_AddRefed<mozilla::CompositorVsyncDispatcher>
  GetCompositorVsyncDispatcher();
  virtual void CreateCompositorVsyncDispatcher();
  virtual void CreateCompositor();
  virtual void CreateCompositor(int aWidth, int aHeight);
  virtual void SetCompositorWidgetDelegate(CompositorWidgetDelegate*) {}

  WindowRenderer* CreateFallbackRenderer();

  


  virtual nsresult SetSystemFont(const nsCString& aFontName) {
    return NS_ERROR_NOT_IMPLEMENTED;
  }
  virtual nsresult GetSystemFont(nsCString& aFontName) {
    return NS_ERROR_NOT_IMPLEMENTED;
  }

  


  virtual LayoutDeviceIntSize GetMoveToRectPopupSize() const {
    NS_WARNING("GetLayoutPopupRect implemented only for wayland");
    return LayoutDeviceIntSize();
  }

  




  virtual void SetNativePointerLockCenter(
      const LayoutDeviceIntPoint& aLockCenter) {}
  virtual void LockNativePointer() {}
  virtual void UnlockNativePointer() {}

  



  virtual mozilla::LayoutDeviceIntMargin GetSafeAreaInsets() const {
    return mozilla::LayoutDeviceIntMargin();
  }

 private:
  class LongTapInfo {
   public:
    LongTapInfo(int32_t aPointerId, LayoutDeviceIntPoint& aPoint,
                mozilla::TimeDuration aDuration,
                nsISynthesizedEventCallback* aCallback)
        : mPointerId(aPointerId),
          mPosition(aPoint),
          mDuration(aDuration),
          mCallback(aCallback),
          mStamp(mozilla::TimeStamp::Now()) {}

    int32_t mPointerId;
    LayoutDeviceIntPoint mPosition;
    mozilla::TimeDuration mDuration;
    nsCOMPtr<nsISynthesizedEventCallback> mCallback;
    mozilla::TimeStamp mStamp;
  };

  static void OnLongTapTimerCallback(nsITimer* aTimer, void* aClosure);

  static already_AddRefed<nsIBidiKeyboard> CreateBidiKeyboardContentProcess();
  static already_AddRefed<nsIBidiKeyboard> CreateBidiKeyboardInner();

  mozilla::UniquePtr<LongTapInfo> mLongTapTouchPoint;
  nsCOMPtr<nsITimer> mLongTapTimer;
  static int32_t sPointerIdCounter;

 public:
  




  virtual void PostHandleKeyEvent(mozilla::WidgetKeyboardEvent* aEvent);

  











  virtual nsresult ActivateNativeMenuItemAt(const nsAString& indexString) {
    return NS_ERROR_NOT_IMPLEMENTED;
  }

  















  virtual nsresult ForceUpdateNativeMenuAt(const nsAString& indexString) {
    return NS_ERROR_NOT_IMPLEMENTED;
  }

  





  [[nodiscard]] virtual nsresult GetSelectionAsPlaintext(nsAString& aResult) {
    return NS_ERROR_NOT_IMPLEMENTED;
  }

  





  nsresult NotifyIME(const IMENotification& aIMENotification);

  






  virtual void MaybeDispatchInitialFocusEvent() {}

  


  virtual void SetInputContext(const InputContext& aContext,
                               const InputContextAction& aAction) = 0;

  


  virtual InputContext GetInputContext() = 0;

  




  virtual NativeIMEContext GetNativeIMEContext();

  



  void* GetPseudoIMEContext();

  





  [[nodiscard]] virtual nsresult AttachNativeKeyEvent(
      mozilla::WidgetKeyboardEvent& aEvent) {
    return NS_ERROR_NOT_IMPLEMENTED;
  }

  



  MOZ_CAN_RUN_SCRIPT virtual bool GetEditCommands(
      mozilla::NativeKeyBindingsType aType,
      const mozilla::WidgetKeyboardEvent& aEvent,
      nsTArray<mozilla::CommandInt>& aCommands);

  





  const IMENotificationRequests& IMENotificationRequestsRef();

  bool ComputeShouldAccelerate();
  virtual bool WidgetTypeSupportsAcceleration() { return true; }
  virtual bool WidgetTypeSupportsNativeCompositing() { return true; }

  



  [[nodiscard]] virtual nsresult OnDefaultButtonLoaded(
      const LayoutDeviceIntRect& aButtonRect) {
    return NS_ERROR_NOT_IMPLEMENTED;
  }

  





  static bool UsePuppetWidgets() { return XRE_IsContentProcess(); }

  static already_AddRefed<nsIWidget> CreateTopLevelWindow();

  static already_AddRefed<nsIWidget> CreateChildWindow();

  virtual already_AddRefed<nsIWidget> AllocateChildPopupWidget() {
    return CreateChildWindow();
  }

  









  static already_AddRefed<nsIWidget> CreatePuppetWidget(
      BrowserChild* aBrowserChild);

  static already_AddRefed<nsIWidget> CreateHeadlessWidget();

  


  virtual bool HasGLContext() { return false; }

  




  virtual bool WidgetPaintsBackground() { return false; }

  virtual bool NeedsPaint() { return IsVisible() && !GetBounds().IsEmpty(); }

  











  virtual LayoutDeviceIntRect GetNaturalBounds() { return GetBounds(); }

  










  virtual void SetSizeConstraints(const SizeConstraints& aConstraints);

#ifdef ACCESSIBILITY
  
  mozilla::a11y::LocalAccessible* GetRootAccessible();
#endif

  




  virtual const SizeConstraints GetSizeConstraints();

  





  virtual void ConstrainSize(int32_t* aWidth, int32_t* aHeight) {
    SizeConstraints c = GetSizeConstraints();
    *aWidth = std::clamp(*aWidth, c.mMinSize.width, c.mMaxSize.width);
    *aHeight = std::clamp(*aHeight, c.mMinSize.height, c.mMaxSize.height);
  }

  



  virtual BrowserChild* GetOwningBrowserChild() { return nullptr; }

  


  virtual LayersId GetLayersId() const;

  



  virtual CompositorBridgeChild* GetRemoteRenderer();

  


  virtual void PauseOrResumeCompositor(bool aPause);

  


  virtual void ClearCachedWebrenderResources();

  



  virtual bool SetNeedFastSnaphot();

  
  virtual void WindowUsesOMTC() {}
  virtual void RegisterTouchWindow() {}

  




  virtual RefPtr<mozilla::VsyncDispatcher> GetVsyncDispatcher();

  



  virtual bool SynchronouslyRepaintOnResize() { return true; }

  virtual void UpdateZoomConstraints(
      const uint32_t& aPresShellId, const ScrollableLayerGuid::ViewID& aViewId,
      const mozilla::Maybe<ZoomConstraints>& aConstraints);

  



  TextEventDispatcher* GetTextEventDispatcher();

  




  virtual TextEventDispatcherListener* GetNativeTextEventDispatcherListener();

  




  virtual void ZoomToRect(const uint32_t& aPresShellId,
                          const ScrollableLayerGuid::ViewID& aViewId,
                          const CSSRect& aRect, const uint32_t& aFlags);

  







  virtual void LookUpDictionary(
      const nsAString& aText,
      const nsTArray<mozilla::FontRange>& aFontRangeArray,
      const bool aIsVertical, const LayoutDeviceIntPoint& aPoint) {}

  virtual void RequestFxrOutput() {
    MOZ_ASSERT(false, "This function should only execute in Windows");
  }

  



  virtual void NotifyCompositorScrollUpdate(
      const mozilla::layers::CompositorScrollUpdate& aUpdate) {}

#if defined(MOZ_WIDGET_ANDROID)
  





  virtual void RecvToolbarAnimatorMessageFromCompositor(int32_t aMessage) {}

  






  virtual void RecvScreenPixels(mozilla::ipc::Shmem&& aMem,
                                const ScreenIntSize& aSize, bool aNeedsYFlip) {}

  virtual void UpdateDynamicToolbarMaxHeight(mozilla::ScreenIntCoord aHeight) {}
  virtual mozilla::ScreenIntCoord GetDynamicToolbarMaxHeight() const {
    return 0;
  }
#endif

  void EnsureLocalesChangedObserver();
  virtual void LocalesChanged() {}
  virtual void NotifyOcclusionState(mozilla::widget::OcclusionState) {}

  static already_AddRefed<nsIBidiKeyboard> CreateBidiKeyboard();

  
  nsMenuPopupFrame* GetPopupFrame() const;
  
  nsIFrame* GetFrame() const;

  



  virtual double GetDefaultScaleInternal() { return 1.0; }

  
  
  
  enum class WidgetType : uint8_t {
    Native,
    Headless,
    Puppet,
  };
  bool IsPuppetWidget() const { return mWidgetType == WidgetType::Puppet; }

  using WindowButtonType = mozilla::WindowButtonType;

  





  virtual void SetWindowButtonRect(WindowButtonType aButtonType,
                                   const LayoutDeviceIntRect& aClientRect) {}

#ifdef DEBUG
  virtual nsresult SetHiDPIMode(bool aHiDPI) {
    return NS_ERROR_NOT_IMPLEMENTED;
  }
  virtual nsresult RestoreHiDPIMode() { return NS_ERROR_NOT_IMPLEMENTED; }
#endif

 protected:
  
  
  
  
  
  
  nsCOMPtr<nsIWidget> mFirstChild;
  nsIWidget* MOZ_NON_OWNING_REF mLastChild = nullptr;
  nsCOMPtr<nsIWidget> mNextSibling;
  nsIWidget* MOZ_NON_OWNING_REF mPrevSibling = nullptr;
  
  nsIWidget* MOZ_NON_OWNING_REF mParent = nullptr;
  
  bool mOnDestroyCalled = false;
  WindowType mWindowType = WindowType::TopLevel;
  WidgetType mWidgetType = WidgetType::Native;

  nsIWidgetListener* mWidgetListener = nullptr;
  nsIWidgetListener* mAttachedWidgetListener = nullptr;
  nsIWidgetListener* mPreviouslyAttachedWidgetListener = nullptr;
  RefPtr<WindowRenderer> mWindowRenderer;
  RefPtr<CompositorSession> mCompositorSession;
  RefPtr<CompositorBridgeChild> mCompositorBridgeChild;

  mozilla::UniquePtr<mozilla::Mutex> mCompositorVsyncDispatcherLock;
  RefPtr<mozilla::CompositorVsyncDispatcher> mCompositorVsyncDispatcher;

  RefPtr<IAPZCTreeManager> mAPZC;
  RefPtr<GeckoContentController> mRootContentController;
  RefPtr<APZEventState> mAPZEventState;
  RefPtr<mozilla::widget::WidgetShutdownObserver> mShutdownObserver;
  RefPtr<mozilla::widget::LocalesChangedObserver> mLocalesChangedObserver;
  RefPtr<TextEventDispatcher> mTextEventDispatcher;
  RefPtr<mozilla::SwipeTracker> mSwipeTracker;
  mozilla::UniquePtr<mozilla::SwipeEventQueue> mSwipeEventQueue;
  Cursor mCursor;
  bool mCustomCursorAllowed = true;
  BorderStyle mBorderStyle;
  LayoutDeviceIntRect mBounds;
  bool mIsTiled;
  PopupLevel mPopupLevel;
  PopupType mPopupType;
  SizeConstraints mSizeConstraints;
  bool mHasRemoteContent;

  struct FullscreenSavedState {
    DesktopRect windowRect;
    DesktopRect screenRect;
  };
  mozilla::Maybe<FullscreenSavedState> mSavedBounds;

  bool mUpdateCursor;
  bool mUseAttachedEvents;
  bool mIMEHasFocus;
  bool mIMEHasQuit;
  
  bool mIsFullyOccluded;
  bool mNeedFastSnaphot;
  
  
  
  
  
  
  bool mCurrentPanGestureBelongsToSwipe;

  
  bool mIsPIPWindow : 1;

  struct InitialZoomConstraints {
    InitialZoomConstraints(const uint32_t& aPresShellID,
                           const ScrollableLayerGuid::ViewID& aViewID,
                           const ZoomConstraints& aConstraints)
        : mPresShellID(aPresShellID),
          mViewID(aViewID),
          mConstraints(aConstraints) {}

    uint32_t mPresShellID;
    ScrollableLayerGuid::ViewID mViewID;
    ZoomConstraints mConstraints;
  };

  mozilla::Maybe<InitialZoomConstraints> mInitialZoomConstraints;

  
  
  
  nsTArray<RefPtr<mozilla::LiveResizeListener>> mLiveResizeListeners;

#ifdef DEBUG
 protected:
  static void debug_DumpInvalidate(FILE* aFileOut, nsIWidget* aWidget,
                                   const LayoutDeviceIntRect* aRect,
                                   const char* aWidgetName, int32_t aWindowID);

  static void debug_DumpEvent(FILE* aFileOut, nsIWidget* aWidget,
                              mozilla::WidgetGUIEvent* aGuiEvent,
                              const char* aWidgetName, int32_t aWindowID);

  static void debug_DumpPaintEvent(FILE* aFileOut, nsIWidget* aWidget,
                                   const nsIntRegion& aPaintEvent,
                                   const char* aWidgetName, int32_t aWindowID);

  static bool debug_GetCachedBoolPref(const char* aPrefName);
#endif

 private:
  already_AddRefed<mozilla::layers::WebRenderLayerManager>
  CreateCompositorSession(int aWidth, int aHeight,
                          mozilla::layers::CompositorOptions* aOptionsOut);
};

#endif  
