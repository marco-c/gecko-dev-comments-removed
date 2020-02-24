





#ifndef mozilla_dom_ChildProcessChannelListener_h
#define mozilla_dom_ChildProcessChannelListener_h

#include <functional>

#include "mozilla/net/NeckoChannelParams.h"
#include "nsDOMNavigationTiming.h"
#include "nsDataHashtable.h"
#include "nsIChannel.h"

namespace mozilla {
namespace dom {

class ChildProcessChannelListener final {
  NS_INLINE_DECL_REFCOUNTING(ChildProcessChannelListener)

  using Callback = std::function<void(nsDocShellLoadState*,
                                      nsTArray<net::DocumentChannelRedirect>&&,
                                      nsDOMNavigationTiming*)>;

  void RegisterCallback(uint64_t aIdentifier, Callback&& aCallback);

  void OnChannelReady(nsDocShellLoadState* aLoadState, uint64_t aIdentifier,
                      nsTArray<net::DocumentChannelRedirect>&& aRedirects,
                      nsDOMNavigationTiming* aTiming);

  static already_AddRefed<ChildProcessChannelListener> GetSingleton();

 private:
  ChildProcessChannelListener() = default;
  ~ChildProcessChannelListener() = default;
  struct CallbackArgs {
    RefPtr<nsDocShellLoadState> mLoadState;
    nsTArray<net::DocumentChannelRedirect> mRedirects;
    RefPtr<nsDOMNavigationTiming> mTiming;
  };

  
  nsDataHashtable<nsUint64HashKey, Callback> mCallbacks;
  nsDataHashtable<nsUint64HashKey, CallbackArgs> mChannelArgs;
};

}  
}  

#endif  
