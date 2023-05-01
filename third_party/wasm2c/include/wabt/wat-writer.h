















#ifndef WABT_WAT_WRITER_H_
#define WABT_WAT_WRITER_H_

#include "wabt/common.h"
#include "wabt/feature.h"

namespace wabt {

struct Module;
class Stream;

struct WriteWatOptions {
  WriteWatOptions() = default;
  WriteWatOptions(const Features& features) : features(features) {}
  Features features;
  bool fold_exprs = false;  
  bool inline_export = false;
  bool inline_import = false;
};

Result WriteWat(Stream*, const Module*, const WriteWatOptions&);

}  

#endif 
