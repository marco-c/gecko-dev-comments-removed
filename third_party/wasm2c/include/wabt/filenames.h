















#ifndef WABT_FILENAMES_H_
#define WABT_FILENAMES_H_

#include "wabt/common.h"

namespace wabt {

extern const char* kWasmExtension;
extern const char* kWatExtension;






std::string_view GetExtension(std::string_view filename);







std::string_view StripExtension(std::string_view s);






std::string_view GetBasename(std::string_view filename);

}  

#endif 
