






#ifndef GrCoverageCountingPathRenderer_DEFINED
#define GrCoverageCountingPathRenderer_DEFINED

#include <map>
#include "GrCCPerOpListPaths.h"
#include "GrOnFlushResourceProvider.h"
#include "GrPathRenderer.h"
#include "GrRenderTargetOpList.h"
#include "ccpr/GrCCPerFlushResources.h"

class GrCCDrawPathsOp;
class GrCCPathCache;








class GrCoverageCountingPathRenderer : public GrPathRenderer, public GrOnFlushCallbackObject {
public:
    static bool IsSupported(const GrCaps&);

    enum class AllowCaching : bool {
        kNo = false,
        kYes = true
    };

    static sk_sp<GrCoverageCountingPathRenderer> CreateIfSupported(const GrCaps&, AllowCaching);

    using PendingPathsMap = std::map<uint32_t, sk_sp<GrCCPerOpListPaths>>;

    
    
    PendingPathsMap detachPendingPaths() { return std::move(fPendingPaths); }

    void mergePendingPaths(const PendingPathsMap& paths) {
#ifdef SK_DEBUG
        
        
        
        for (const auto& it : paths) {
            SkASSERT(!fPendingPaths.count(it.first));
        }
#endif

        fPendingPaths.insert(paths.begin(), paths.end());
    }

    std::unique_ptr<GrFragmentProcessor> makeClipProcessor(uint32_t oplistID,
                                                           const SkPath& deviceSpacePath,
                                                           const SkIRect& accessRect, int rtWidth,
                                                           int rtHeight, const GrCaps&);

    
    void preFlush(GrOnFlushResourceProvider*, const uint32_t* opListIDs, int numOpListIDs,
                  SkTArray<sk_sp<GrRenderTargetContext>>* out) override;
    void postFlush(GrDeferredUploadToken, const uint32_t* opListIDs, int numOpListIDs) override;

    void testingOnly_drawPathDirectly(const DrawPathArgs&);
    const GrUniqueKey& testingOnly_getStashedAtlasKey() const;

    
    
    static constexpr float kPathCropThreshold = 1 << 16;

    static void CropPath(const SkPath&, const SkIRect& cropbox, SkPath* out);

    
    
    static constexpr float kMaxBoundsInflationFromStroke = 4096;

    static float GetStrokeDevWidth(const SkMatrix&, const SkStrokeRec&,
                                   float* inflationRadius = nullptr);

private:
    GrCoverageCountingPathRenderer(AllowCaching);

    
    StencilSupport onGetStencilSupport(const GrShape&) const override {
        return GrPathRenderer::kNoSupport_StencilSupport;
    }
    CanDrawPath onCanDrawPath(const CanDrawPathArgs&) const override;
    bool onDrawPath(const DrawPathArgs&) override;

    GrCCPerOpListPaths* lookupPendingPaths(uint32_t opListID);
    void recordOp(std::unique_ptr<GrCCDrawPathsOp>, const DrawPathArgs&);

    
    
    
    PendingPathsMap fPendingPaths;

    
    
    SkSTArray<4, sk_sp<GrCCPerOpListPaths>> fFlushingPaths;

    std::unique_ptr<GrCCPathCache> fPathCache;
    GrUniqueKey fStashedAtlasKey;

    SkDEBUGCODE(bool fFlushing = false);
};

#endif
