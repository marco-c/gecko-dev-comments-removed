















#ifndef WABT_BINDING_HASH_H_
#define WABT_BINDING_HASH_H_

#include <functional>
#include <string>
#include <string_view>
#include <unordered_map>
#include <vector>

#include "wabt/common.h"

namespace wabt {

struct Var;

struct Binding {
  explicit Binding(Index index) : index(index) {}
  Binding(const Location& loc, Index index) : loc(loc), index(index) {}

  Location loc;
  Index index;
};




class BindingHash : public std::unordered_multimap<std::string, Binding> {
 public:
  using DuplicateCallback =
      std::function<void(const value_type&, const value_type&)>;

  void FindDuplicates(DuplicateCallback callback) const;

  Index FindIndex(const Var&) const;

  Index FindIndex(const std::string& name) const {
    auto iter = find(name);
    return iter != end() ? iter->second.index : kInvalidIndex;
  }

  Index FindIndex(std::string_view name) const {
    return FindIndex(std::string(name));
  }

 private:
  using ValueTypeVector = std::vector<const value_type*>;

  void CreateDuplicatesVector(ValueTypeVector* out_duplicates) const;
  void SortDuplicatesVectorByLocation(ValueTypeVector* duplicates) const;
  void CallCallbacks(const ValueTypeVector& duplicates,
                     DuplicateCallback callback) const;
};

}  

#endif 
