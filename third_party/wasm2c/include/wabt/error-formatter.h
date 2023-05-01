















#ifndef WABT_ERROR_FORMATTER_H_
#define WABT_ERROR_FORMATTER_H_

#include <cstdio>
#include <memory>
#include <string>

#include "wabt/color.h"
#include "wabt/error.h"
#include "wabt/lexer-source-line-finder.h"

namespace wabt {

enum class PrintHeader {
  Never,
  Once,
  Always,
};

std::string FormatErrorsToString(const Errors&,
                                 Location::Type,
                                 LexerSourceLineFinder* = nullptr,
                                 const Color& color = Color(nullptr, false),
                                 const std::string& header = {},
                                 PrintHeader print_header = PrintHeader::Never,
                                 int source_line_max_length = 80);

void FormatErrorsToFile(const Errors&,
                        Location::Type,
                        LexerSourceLineFinder* = nullptr,
                        FILE* = stderr,
                        const std::string& header = {},
                        PrintHeader print_header = PrintHeader::Never,
                        int source_line_max_length = 80);

}  

#endif  
