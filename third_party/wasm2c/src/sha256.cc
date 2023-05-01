















#include "wabt/sha256.h"

#if HAVE_OPENSSL_SHA_H
#include <openssl/sha.h>
#else
#include "picosha2.h"
#endif

namespace wabt {






void sha256(std::string_view input, std::string& digest) {
  digest.clear();

#if HAVE_OPENSSL_SHA_H
  digest.resize(SHA256_DIGEST_LENGTH);
  if (!SHA256(reinterpret_cast<const uint8_t*>(input.data()), input.size(),
              reinterpret_cast<uint8_t*>(digest.data()))) {
    
    abort();
  }
#else
  digest.resize(picosha2::k_digest_size);
  picosha2::hash256(input, digest);
#endif
}

}  
