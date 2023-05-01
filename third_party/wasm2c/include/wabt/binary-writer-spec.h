















#ifndef WABT_BINARY_WRITER_SPEC_H_
#define WABT_BINARY_WRITER_SPEC_H_

#include <functional>
#include <utility>
#include <vector>

#include "wabt/binary-writer.h"
#include "wabt/common.h"
#include "wabt/ir.h"

namespace wabt {

struct FilenameMemoryStreamPair {
  FilenameMemoryStreamPair(std::string_view filename,
                           std::unique_ptr<MemoryStream> stream)
      : filename(filename), stream(std::move(stream)) {}
  std::string filename;
  std::unique_ptr<MemoryStream> stream;
};

using WriteBinarySpecStreamFactory =
    std::function<Stream*(std::string_view filename)>;

Result WriteBinarySpecScript(Stream* json_stream,
                             WriteBinarySpecStreamFactory module_stream_factory,
                             Script*,
                             std::string_view source_filename,
                             std::string_view module_filename_noext,
                             const WriteBinaryOptions&);


Result WriteBinarySpecScript(
    Stream* json_stream,
    Script*,
    std::string_view source_filename,
    std::string_view module_filename_noext,
    const WriteBinaryOptions&,
    std::vector<FilenameMemoryStreamPair>* out_module_streams,
    Stream* log_stream = nullptr);

}  

#endif 
