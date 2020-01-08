






#ifndef GrCCDrawPathsOp_DEFINED
#define GrCCDrawPathsOp_DEFINED

#include "GrShape.h"
#include "SkTInternalLList.h"
#include "ccpr/GrCCSTLList.h"
#include "ops/GrDrawOp.h"

struct GrCCPerFlushResourceSpecs;
struct GrCCPerOpListPaths;
class GrCCAtlas;
class GrOnFlushResourceProvider;
class GrCCPathCache;
class GrCCPathCacheEntry;
class GrCCPerFlushResources;




class GrCCDrawPathsOp : public GrDrawOp {
public:
    DEFINE_OP_CLASS_ID
    SK_DECLARE_INTERNAL_LLIST_INTERFACE(GrCCDrawPathsOp);

    static std::unique_ptr<GrCCDrawPathsOp> Make(GrContext*, const SkIRect& clipIBounds,
                                                 const SkMatrix&, const GrShape&, GrPaint&&);
    ~GrCCDrawPathsOp() override;

    const char* name() const override { return "GrCCDrawPathsOp"; }
    FixedFunctionFlags fixedFunctionFlags() const override { return FixedFunctionFlags::kNone; }
    RequiresDstTexture finalize(const GrCaps&, const GrAppliedClip*) override;
    CombineResult onCombineIfPossible(GrOp*, const GrCaps&) override;
    void visitProxies(const VisitProxyFunc& fn) const override { fProcessors.visitProxies(fn); }
    void onPrepare(GrOpFlushState*) override {}

    void wasRecorded(sk_sp<GrCCPerOpListPaths> owningPerOpListPaths);

    
    
    
    
    void accountForOwnPaths(GrCCPathCache*, GrOnFlushResourceProvider*,
                            const GrUniqueKey& stashedAtlasKey, GrCCPerFlushResourceSpecs*);

    
    
    
    enum class DoCopiesToCache : bool {
        kNo = false,
        kYes = true
    };

    
    
    
    
    
    void setupResources(GrOnFlushResourceProvider*, GrCCPerFlushResources*, DoCopiesToCache);

    void onExecute(GrOpFlushState*) override;

private:
    friend class GrOpMemoryPool;

    static std::unique_ptr<GrCCDrawPathsOp> InternalMake(GrContext*, const SkIRect& clipIBounds,
                                                         const SkMatrix&, const GrShape&,
                                                         float strokeDevWidth,
                                                         const SkRect& conservativeDevBounds,
                                                         GrPaint&&);
    enum class Visibility {
        kPartial,
        kMostlyComplete,  
        kComplete
    };

    GrCCDrawPathsOp(const SkMatrix&, const GrShape&, float strokeDevWidth,
                    const SkIRect& shapeConservativeIBounds, const SkIRect& maskDevIBounds,
                    Visibility maskVisibility, const SkRect& conservativeDevBounds, GrPaint&&);

    void recordInstance(GrTextureProxy* atlasProxy, int instanceIdx);

    const SkMatrix fViewMatrixIfUsingLocalCoords;

    struct SingleDraw {
        SingleDraw(const SkMatrix&, const GrShape&, float strokeDevWidth,
                   const SkIRect& shapeConservativeIBounds, const SkIRect& maskDevIBounds,
                   Visibility maskVisibility, GrColor);
        ~SingleDraw();

        SkMatrix fMatrix;
        GrShape fShape;
        float fStrokeDevWidth;
        const SkIRect fShapeConservativeIBounds;
        SkIRect fMaskDevIBounds;
        Visibility fMaskVisibility;
        GrColor fColor;

        sk_sp<GrCCPathCacheEntry> fCacheEntry;
        sk_sp<GrTextureProxy> fCachedAtlasProxy;
        SkIVector fCachedMaskShift;

        SingleDraw* fNext = nullptr;
    };

    
    
    sk_sp<GrCCPerOpListPaths> fOwningPerOpListPaths;

    GrCCSTLList<SingleDraw> fDraws;
    SkDEBUGCODE(int fNumDraws = 1);

    GrProcessorSet fProcessors;

    struct InstanceRange {
        GrTextureProxy* fAtlasProxy;
        int fEndInstanceIdx;
    };

    SkSTArray<2, InstanceRange, true> fInstanceRanges;
    int fBaseInstance SkDEBUGCODE(= -1);
};

#endif
