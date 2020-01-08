






#ifndef GrBezierEffect_DEFINED
#define GrBezierEffect_DEFINED

#include "GrCaps.h"
#include "GrProcessor.h"
#include "GrGeometryProcessor.h"
#include "GrTypesPriv.h"









































class GrGLConicEffect;

class GrConicEffect : public GrGeometryProcessor {
public:
    static sk_sp<GrGeometryProcessor> Make(GrColor color,
                                           const SkMatrix& viewMatrix,
                                           const GrClipEdgeType edgeType,
                                           const GrCaps& caps,
                                           const SkMatrix& localMatrix,
                                           bool usesLocalCoords,
                                           uint8_t coverage = 0xff) {
        switch (edgeType) {
            case GrClipEdgeType::kFillAA:
                if (!caps.shaderCaps()->shaderDerivativeSupport()) {
                    return nullptr;
                }
                return sk_sp<GrGeometryProcessor>(
                    new GrConicEffect(color, viewMatrix, coverage, GrClipEdgeType::kFillAA,
                                      localMatrix, usesLocalCoords));
            case GrClipEdgeType::kHairlineAA:
                if (!caps.shaderCaps()->shaderDerivativeSupport()) {
                    return nullptr;
                }
                return sk_sp<GrGeometryProcessor>(
                    new GrConicEffect(color, viewMatrix, coverage,
                                      GrClipEdgeType::kHairlineAA, localMatrix,
                                      usesLocalCoords));
            case GrClipEdgeType::kFillBW:
                return sk_sp<GrGeometryProcessor>(
                    new GrConicEffect(color, viewMatrix, coverage, GrClipEdgeType::kFillBW,
                                      localMatrix, usesLocalCoords));
            default:
                return nullptr;
        }
    }

    ~GrConicEffect() override;

    const char* name() const override { return "Conic"; }

    inline const Attribute& inPosition() const { return kAttributes[0]; }
    inline const Attribute& inConicCoeffs() const { return kAttributes[1]; }
    inline bool isAntiAliased() const { return GrProcessorEdgeTypeIsAA(fEdgeType); }
    inline bool isFilled() const { return GrProcessorEdgeTypeIsFill(fEdgeType); }
    inline GrClipEdgeType getEdgeType() const { return fEdgeType; }
    GrColor color() const { return fColor; }
    const SkMatrix& viewMatrix() const { return fViewMatrix; }
    const SkMatrix& localMatrix() const { return fLocalMatrix; }
    bool usesLocalCoords() const { return fUsesLocalCoords; }
    uint8_t coverageScale() const { return fCoverageScale; }

    void getGLSLProcessorKey(const GrShaderCaps& caps, GrProcessorKeyBuilder* b) const override;

    GrGLSLPrimitiveProcessor* createGLSLInstance(const GrShaderCaps&) const override;

private:
    GrConicEffect(GrColor, const SkMatrix& viewMatrix, uint8_t coverage, GrClipEdgeType,
                  const SkMatrix& localMatrix, bool usesLocalCoords);

    const Attribute& onVertexAttribute(int i) const override { return kAttributes[i]; }

    GrColor             fColor;
    SkMatrix            fViewMatrix;
    SkMatrix            fLocalMatrix;
    bool                fUsesLocalCoords;
    uint8_t             fCoverageScale;
    GrClipEdgeType fEdgeType;
    static constexpr Attribute kAttributes[] = {
        {"inPosition", kFloat2_GrVertexAttribType, kFloat2_GrSLType},
        {"inConicCoeffs", kFloat4_GrVertexAttribType, kHalf4_GrSLType}
    };

    GR_DECLARE_GEOMETRY_PROCESSOR_TEST

    typedef GrGeometryProcessor INHERITED;
};










class GrGLQuadEffect;

class GrQuadEffect : public GrGeometryProcessor {
public:
    static sk_sp<GrGeometryProcessor> Make(GrColor color,
                                           const SkMatrix& viewMatrix,
                                           const GrClipEdgeType edgeType,
                                           const GrCaps& caps,
                                           const SkMatrix& localMatrix,
                                           bool usesLocalCoords,
                                           uint8_t coverage = 0xff) {
        switch (edgeType) {
            case GrClipEdgeType::kFillAA:
                if (!caps.shaderCaps()->shaderDerivativeSupport()) {
                    return nullptr;
                }
                return sk_sp<GrGeometryProcessor>(
                    new GrQuadEffect(color, viewMatrix, coverage, GrClipEdgeType::kFillAA,
                                     localMatrix, usesLocalCoords));
            case GrClipEdgeType::kHairlineAA:
                if (!caps.shaderCaps()->shaderDerivativeSupport()) {
                    return nullptr;
                }
                return sk_sp<GrGeometryProcessor>(
                    new GrQuadEffect(color, viewMatrix, coverage,
                                     GrClipEdgeType::kHairlineAA, localMatrix,
                                     usesLocalCoords));
            case GrClipEdgeType::kFillBW:
                return sk_sp<GrGeometryProcessor>(
                    new GrQuadEffect(color, viewMatrix, coverage, GrClipEdgeType::kFillBW,
                                     localMatrix, usesLocalCoords));
            default:
                return nullptr;
        }
    }

    ~GrQuadEffect() override;

    const char* name() const override { return "Quad"; }

    inline const Attribute& inPosition() const { return kAttributes[0]; }
    inline const Attribute& inHairQuadEdge() const { return kAttributes[1]; }
    inline bool isAntiAliased() const { return GrProcessorEdgeTypeIsAA(fEdgeType); }
    inline bool isFilled() const { return GrProcessorEdgeTypeIsFill(fEdgeType); }
    inline GrClipEdgeType getEdgeType() const { return fEdgeType; }
    GrColor color() const { return fColor; }
    const SkMatrix& viewMatrix() const { return fViewMatrix; }
    const SkMatrix& localMatrix() const { return fLocalMatrix; }
    bool usesLocalCoords() const { return fUsesLocalCoords; }
    uint8_t coverageScale() const { return fCoverageScale; }

    void getGLSLProcessorKey(const GrShaderCaps& caps, GrProcessorKeyBuilder* b) const override;

    GrGLSLPrimitiveProcessor* createGLSLInstance(const GrShaderCaps&) const override;

private:
    GrQuadEffect(GrColor, const SkMatrix& viewMatrix, uint8_t coverage, GrClipEdgeType,
                 const SkMatrix& localMatrix, bool usesLocalCoords);

    const Attribute& onVertexAttribute(int i) const override { return kAttributes[i]; }

    GrColor fColor;
    SkMatrix fViewMatrix;
    SkMatrix fLocalMatrix;
    bool fUsesLocalCoords;
    uint8_t fCoverageScale;
    GrClipEdgeType fEdgeType;

    static constexpr Attribute kAttributes[] = {
        {"inPosition", kFloat2_GrVertexAttribType, kFloat2_GrSLType},
        {"inHairQuadEdge", kFloat4_GrVertexAttribType, kHalf4_GrSLType}
    };

    GR_DECLARE_GEOMETRY_PROCESSOR_TEST

    typedef GrGeometryProcessor INHERITED;
};












class GrGLCubicEffect;

class GrCubicEffect : public GrGeometryProcessor {
public:
    static sk_sp<GrGeometryProcessor> Make(GrColor color,
                                           const SkMatrix& viewMatrix,
                                           const SkMatrix& klm,
                                           bool flipKL,
                                           const GrClipEdgeType edgeType,
                                           const GrCaps& caps) {
        if (!caps.shaderCaps()->floatIs32Bits()) {
            
            return nullptr;
        }

        
        SkMatrix devKLM;
        if (!viewMatrix.invert(&devKLM)) {
            return nullptr;
        }
        devKLM.postConcat(klm);
        if (flipKL) {
            devKLM.postScale(-1, -1);
        }

        switch (edgeType) {
            case GrClipEdgeType::kFillAA:
                return sk_sp<GrGeometryProcessor>(
                    new GrCubicEffect(color, viewMatrix, devKLM, GrClipEdgeType::kFillAA));
            case GrClipEdgeType::kHairlineAA:
                return sk_sp<GrGeometryProcessor>(
                    new GrCubicEffect(color, viewMatrix, devKLM, GrClipEdgeType::kHairlineAA));
            case GrClipEdgeType::kFillBW:
                return sk_sp<GrGeometryProcessor>(
                    new GrCubicEffect(color, viewMatrix, devKLM, GrClipEdgeType::kFillBW));
            default:
                return nullptr;
        }
    }

    ~GrCubicEffect() override;

    const char* name() const override { return "Cubic"; }

    inline const Attribute& inPosition() const { return kInPosition; }
    inline bool isAntiAliased() const { return GrProcessorEdgeTypeIsAA(fEdgeType); }
    inline bool isFilled() const { return GrProcessorEdgeTypeIsFill(fEdgeType); }
    inline GrClipEdgeType getEdgeType() const { return fEdgeType; }
    GrColor color() const { return fColor; }
    bool colorIgnored() const { return GrColor_ILLEGAL == fColor; }
    const SkMatrix& viewMatrix() const { return fViewMatrix; }
    const SkMatrix& devKLMMatrix() const { return fDevKLMMatrix; }

    void getGLSLProcessorKey(const GrShaderCaps& caps, GrProcessorKeyBuilder* b) const override;

    GrGLSLPrimitiveProcessor* createGLSLInstance(const GrShaderCaps&) const override;

private:
    GrCubicEffect(GrColor, const SkMatrix& viewMatrix, const SkMatrix& devKLMMatrix,
                  GrClipEdgeType);

    const Attribute& onVertexAttribute(int) const override { return kInPosition; }

    GrColor fColor;
    SkMatrix fViewMatrix;
    SkMatrix fDevKLMMatrix;
    GrClipEdgeType fEdgeType;

    static constexpr Attribute kInPosition =
            {"inPosition", kFloat2_GrVertexAttribType, kFloat2_GrSLType};

    GR_DECLARE_GEOMETRY_PROCESSOR_TEST

    typedef GrGeometryProcessor INHERITED;
};

#endif
