






#ifndef GrCCCubicShader_DEFINED
#define GrCCCubicShader_DEFINED

#include "ccpr/GrCCCoverageProcessor.h"












class GrCCCubicShader : public GrCCCoverageProcessor::Shader {
public:
    void emitSetupCode(GrGLSLVertexGeoBuilder*, const char* pts, const char* wind,
                       const char** outHull4) const override;

    void onEmitVaryings(GrGLSLVaryingHandler*, GrGLSLVarying::Scope, SkString* code,
                        const char* position, const char* coverage,
                        const char* cornerCoverage) override;

    void onEmitFragmentCode(GrGLSLFPFragmentBuilder*, const char* outputCoverage) const override;

private:
    void calcHullCoverage(SkString* code, const char* klmAndEdge, const char* gradMatrix,
                          const char* outputCoverage) const;

    const GrShaderVar fKLMMatrix{"klm_matrix", kFloat3x3_GrSLType};
    const GrShaderVar fEdgeDistanceEquation{"edge_distance_equation", kFloat3_GrSLType};
    GrGLSLVarying fKLM_fEdge;
    GrGLSLVarying fGradMatrix;
    GrGLSLVarying fCornerCoverage;
};

#endif
