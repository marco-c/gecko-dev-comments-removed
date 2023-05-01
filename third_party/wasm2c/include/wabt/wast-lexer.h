















#ifndef WABT_WAST_LEXER_H_
#define WABT_WAST_LEXER_H_

#include <cstddef>
#include <cstdio>
#include <memory>

#include "wabt/common.h"
#include "wabt/error.h"
#include "wabt/lexer-source-line-finder.h"
#include "wabt/literal.h"
#include "wabt/opcode.h"
#include "wabt/token.h"

namespace wabt {

class ErrorHandler;
class LexerSource;

class WastLexer {
 public:
  WABT_DISALLOW_COPY_AND_ASSIGN(WastLexer);

  WastLexer(std::unique_ptr<LexerSource> source,
            std::string_view filename,
            Errors*);

  
  static std::unique_ptr<WastLexer> CreateBufferLexer(std::string_view filename,
                                                      const void* data,
                                                      size_t size,
                                                      Errors*);

  Token GetToken();

  
  std::unique_ptr<LexerSourceLineFinder> MakeLineFinder() {
    return std::make_unique<LexerSourceLineFinder>(source_->Clone());
  }

 private:
  static constexpr int kEof = -1;
  enum class CharClass { IdChar = 1, Keyword = 2, HexDigit = 4, Digit = 8 };

  Location GetLocation();
  std::string_view GetText(size_t offset = 0);

  Token BareToken(TokenType);
  Token LiteralToken(TokenType, LiteralType);
  Token TextToken(TokenType, size_t offset = 0);

  int PeekChar();
  int ReadChar();
  bool MatchChar(char);
  bool MatchString(std::string_view);
  void Newline();
  bool ReadBlockComment();             
  bool ReadLineComment();              
  void ReadWhitespace();

  static bool IsCharClass(int c, CharClass);
  static bool IsDigit(int c) { return IsCharClass(c, CharClass::Digit); }
  static bool IsHexDigit(int c) { return IsCharClass(c, CharClass::HexDigit); }
  static bool IsKeyword(int c) { return IsCharClass(c, CharClass::Keyword); }
  static bool IsIdChar(int c) { return IsCharClass(c, CharClass::IdChar); }

  bool ReadNum();
  bool ReadHexNum();

  enum class ReservedChars { None, Some, Id };
  ReservedChars ReadReservedChars();
  bool NoTrailingReservedChars() {
    return ReadReservedChars() == ReservedChars::None;
  }
  void ReadSign();
  Token GetStringToken();
  Token GetNumberToken(TokenType);
  Token GetHexNumberToken(TokenType);
  Token GetInfToken();
  Token GetNanToken();
  Token GetNameEqNumToken(std::string_view name, TokenType);
  Token GetIdChars();
  Token GetKeywordToken();
  Token GetReservedToken();

  std::unique_ptr<LexerSource> source_;
  std::string filename_;
  int line_;
  const char* buffer_;
  const char* buffer_end_;
  const char* line_start_;
  const char* token_start_;
  const char* cursor_;

  Errors* errors_;
  void WABT_PRINTF_FORMAT(3, 4) Error(Location, const char* format, ...);
};

}  

#endif 
