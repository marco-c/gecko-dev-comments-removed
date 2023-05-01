















#ifndef WABT_STRING_UTIL_H_
#define WABT_STRING_UTIL_H_

#include <string>
#include <string_view>

namespace wabt {

inline std::string& operator+=(std::string& x, std::string_view y) {
  x.append(y.data(), y.size());
  return x;
}

inline std::string operator+(std::string_view x, std::string_view y) {
  std::string s;
  s.reserve(x.size() + y.size());
  s.append(x.data(), x.size());
  s.append(y.data(), y.size());
  return s;
}

inline std::string operator+(const std::string& x, std::string_view y) {
  return std::string_view(x) + y;
}

inline std::string operator+(std::string_view x, const std::string& y) {
  return x + std::string_view(y);
}

inline std::string operator+(const char* x, std::string_view y) {
  return std::string_view(x) + y;
}

inline std::string operator+(std::string_view x, const char* y) {
  return x + std::string_view(y);
}

inline void cat_concatenate(std::string&) {}

template <typename T, typename... Ts>
void cat_concatenate(std::string& s, const T& t, const Ts&... args) {
  s += t;
  cat_concatenate(s, args...);
}

inline size_t cat_compute_size() {
  return 0;
}

template <typename T, typename... Ts>
size_t cat_compute_size(const T& t, const Ts&... args) {
  return std::string_view(t).size() + cat_compute_size(args...);
}


template <typename... Ts>
std::string cat(const Ts&... args) {
  std::string s;
  s.reserve(cat_compute_size(args...));
  cat_concatenate(s, args...);
  return s;
}

}  

#endif  
