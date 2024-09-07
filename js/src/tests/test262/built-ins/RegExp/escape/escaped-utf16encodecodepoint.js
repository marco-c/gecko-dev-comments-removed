

















const codePoints = String.fromCharCode(0x100, 0x200, 0x300);

assert.sameValue(RegExp.escape(codePoints), codePoints, 'characters are correctly not escaped');

assert.sameValue(RegExp.escape('你好'), '你好', 'Chinese characters are correctly not escaped');
assert.sameValue(RegExp.escape('こんにちは'), 'こんにちは', 'Japanese characters are correctly not escaped');
assert.sameValue(RegExp.escape('안녕하세요'), '안녕하세요', 'Korean characters are correctly not escaped');
assert.sameValue(RegExp.escape('Привет'), 'Привет', 'Cyrillic characters are correctly not escaped');
assert.sameValue(RegExp.escape('مرحبا'), 'مرحبا', 'Arabic characters are correctly not escaped');
assert.sameValue(RegExp.escape('हेलो'), 'हेलो', 'Devanagari characters are correctly not escaped');
assert.sameValue(RegExp.escape('Γειά σου'), 'Γειά\\x20σου', 'Greek characters are correctly not escaped');
assert.sameValue(RegExp.escape('שלום'), 'שלום', 'Hebrew characters are correctly not escaped');
assert.sameValue(RegExp.escape('สวัสดี'), 'สวัสดี', 'Thai characters are correctly not escaped');
assert.sameValue(RegExp.escape('नमस्ते'), 'नमस्ते', 'Hindi characters are correctly not escaped');
assert.sameValue(RegExp.escape('ሰላም'), 'ሰላም', 'Amharic characters are correctly not escaped');
assert.sameValue(RegExp.escape('हैलो'), 'हैलो', 'Hindi characters with diacritics are correctly not escaped');
assert.sameValue(RegExp.escape('안녕!'), '안녕\\x21', 'Korean character with special character is correctly escaped');
assert.sameValue(RegExp.escape('.hello\uD7FFworld'), '\\.hello\uD7FFworld', 'Mixed ASCII and Unicode characters are correctly escaped');

reportCompare(0, 0);
