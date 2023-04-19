





#ifndef mozilla_net_Http2Stream_h
#define mozilla_net_Http2Stream_h

#include "Http2StreamBase.h"

namespace mozilla::net {

class Http2Stream : public Http2StreamBase {
 public:
  Http2Stream(nsAHttpTransaction* httpTransaction, Http2Session* session,
              int32_t priority, uint64_t bcId)
      : Http2StreamBase(httpTransaction, session, priority, bcId) {}
};

}  

#endif  
