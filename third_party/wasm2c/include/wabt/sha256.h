















#ifndef WABT_SHA256_H_
#define WABT_SHA256_H_

#include "wabt/config.h"

#include <string>
#include <string_view>

namespace wabt {

void sha256(std::string_view input, std::string& digest);

}  

#endif  
