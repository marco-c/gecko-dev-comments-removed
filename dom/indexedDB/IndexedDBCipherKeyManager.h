





#ifndef DOM_INDEXEDDB_INDEXEDDBCIPHERKEYMANAGER_H_
#define DOM_INDEXEDDB_INDEXEDDBCIPHERKEYMANAGER_H_

#include "mozilla/dom/quota/CipherKeyManager.h"
#include "mozilla/dom/quota/IPCStreamCipherStrategy.h"

namespace mozilla::dom {










using IndexedDBCipherStrategy = mozilla::dom::quota::IPCStreamCipherStrategy;
using IndexedDBCipherKeyManager =
    mozilla::dom::quota::CipherKeyManager<IndexedDBCipherStrategy>;
using CipherKey = IndexedDBCipherStrategy::KeyType;

}  

#endif  
