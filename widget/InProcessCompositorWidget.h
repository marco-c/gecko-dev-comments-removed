



#ifndef mozilla_widget_InProcessCompositorWidget_h__
#define mozilla_widget_InProcessCompositorWidget_h__

#include "CompositorWidget.h"

namespace mozilla {
namespace widget {



class InProcessCompositorWidget : public CompositorWidget {
 public:
  InProcessCompositorWidget(const layers::CompositorOptions& aOptions,
                            nsIWidget* aWidget);

  bool PreRender(WidgetRenderingContext* aManager) override;
  void PostRender(WidgetRenderingContext* aManager) override;
  layers::NativeLayerRoot* GetNativeLayerRoot() override;
  already_AddRefed<gfx::DrawTarget> StartRemoteDrawing() override;
  already_AddRefed<gfx::DrawTarget> StartRemoteDrawingInRegion(
      const LayoutDeviceIntRegion& aInvalidRegion) override;
  void EndRemoteDrawing() override;
  void EndRemoteDrawingInRegion(
      gfx::DrawTarget* aDrawTarget,
      const LayoutDeviceIntRegion& aInvalidRegion) override;
  void CleanupRemoteDrawing() override;
  void CleanupWindowEffects() override;
  bool InitCompositor(layers::Compositor* aCompositor) override;
  LayoutDeviceIntSize GetClientSize() override;
  uint32_t GetGLFrameBufferFormat() override;
  void ObserveVsync(VsyncObserver* aObserver) override;
  uintptr_t GetWidgetKey() override;

  
  nsIWidget* RealWidget() override;

 protected:
  nsIWidget* mWidget;
  
  
  static const char* CANARY_VALUE;
  const char* mCanary;
  nsIWidget* mWidgetSanity;
  void CheckWidgetSanity();
};

}  
}  

#endif
