















#include "wabt/filenames.h"

namespace wabt {

const char* kWasmExtension = ".wasm";

const char* kWatExtension = ".wat";

std::string_view StripExtension(std::string_view filename) {
  return filename.substr(0, filename.find_last_of('.'));
}

std::string_view GetBasename(std::string_view filename) {
  size_t last_slash = filename.find_last_of('/');
  size_t last_backslash = filename.find_last_of('\\');
  if (last_slash == std::string_view::npos &&
      last_backslash == std::string_view::npos) {
    return filename;
  }

  if (last_slash == std::string_view::npos) {
    if (last_backslash == std::string_view::npos) {
      return filename;
    }
    last_slash = last_backslash;
  } else if (last_backslash != std::string_view::npos) {
    last_slash = std::max(last_slash, last_backslash);
  }

  return filename.substr(last_slash + 1);
}

std::string_view GetExtension(std::string_view filename) {
  size_t pos = filename.find_last_of('.');
  if (pos == std::string_view::npos) {
    return "";
  }
  return filename.substr(pos);
}

}  
