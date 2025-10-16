





#ifndef mozilla_llama_backend_h
#define mozilla_llama_backend_h

#include <functional>
#include "LlamaRuntimeLinker.h"
#include "ggml.h"
#include "ggml-cpu.h"
#include "mozilla/dom/LlamaRunnerBinding.h"
#include "mozilla/Result.h"
#include "mozilla/UniquePtr.h"

namespace mozilla::llama {

struct Error {
  nsCString mMessage;
};

using ChatMessageResult = mozilla::Result<nsCString, Error>;
using ResultStatus = mozilla::Result<mozilla::Ok, Error>;
using LlamaChatResponse = mozilla::dom::LlamaChatResponse;
using LlamaChatPhase = mozilla::dom::LlamaChatPhase;
using LlamaModelOptions = mozilla::dom::LlamaModelOptions;
using LlamaKVCacheDtype = mozilla::dom::LlamaKVCacheDtype;
using LlamaChatOptions = mozilla::dom::LlamaChatOptions;
using LlamaSamplerType = mozilla::dom::LlamaSamplerType;
using LlamaContextOptions = mozilla::dom::LlamaContextOptions;
using LlamaSamplerConfig = mozilla::dom::LlamaSamplerConfig;

ggml_type GgmlTypeFromKVCacheDtype(LlamaKVCacheDtype aDtype);




















class LlamaBackend {
 public:
  NS_INLINE_DECL_THREADSAFE_REFCOUNTING(LlamaBackend)

  
  LlamaBackend() = default;

  
  
  ResultStatus Reinitialize(const LlamaModelOptions& aOptions, FILE* aFp);

  
  
  ChatMessageResult FormatChat(
      const mozilla::dom::LlamaFormatChatOptions& aOptions);

  
  
  
  
  
  
  
  
  ResultStatus Generate(
      const LlamaChatOptions& aOptions,
      std::function<ResultStatus(const LlamaChatResponse&)> aTokenCallback,
      std::function<bool()> aCancelCallback);

  
  
  
  ResultStatus ReinitializeContext(const LlamaContextOptions& aOptions,
                                   int aNumContext);

  
  struct GgmlThreadpoolDeleter {
    void operator()(struct ggml_threadpool* aTp) const;
  };

  struct LlamaModelDeleter {
    void operator()(llama_model* aModel) const;
  };

  struct LlamaContextDeleter {
    void operator()(llama_context* aCtx) const;
  };

  struct LlamaSamplerDeleter {
    void operator()(llama_sampler* aSmpl) const;
  };

  
  using GgmlThreadpoolUPtr =
      mozilla::UniquePtr<struct ggml_threadpool, GgmlThreadpoolDeleter>;
  using LlamaModelUPtr = mozilla::UniquePtr<llama_model, LlamaModelDeleter>;
  using LlamaContextUPtr =
      mozilla::UniquePtr<llama_context, LlamaContextDeleter>;
  using LlamaSamplerUPtr =
      mozilla::UniquePtr<llama_sampler, LlamaSamplerDeleter>;

  
  using SamplerResult = mozilla::Result<LlamaSamplerUPtr, Error>;

  
 protected:
  ~LlamaBackend();

 private:
  SamplerResult InitializeSampler(
      const mozilla::dom::Sequence<LlamaSamplerConfig>& aSamplers,
      const llama_vocab* vocab);

  
  LlamaLibWrapper* mLib = nullptr;

  
  LlamaModelUPtr mModel;

  
  
  
  LlamaContextUPtr mCtx;

  
  
  GgmlThreadpoolUPtr mThreadpool;

  
  
  
  GgmlThreadpoolUPtr mThreadpoolBatch;

  LlamaModelOptions mModelOptions;

  
  nsCString mModelGeneralName;
};


using LlamaBackendSPtr = RefPtr<LlamaBackend>;

}  

#endif
