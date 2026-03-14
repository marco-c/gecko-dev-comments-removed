


let scrambled = ['𠙶', '𠇲', '㓙', '㑧', '假', '凷'];






const byBlock = ['假', '凷', '㑧', '㓙', '𠇲', '𠙶'];

scrambled.sort(new Intl.Collator().compare);
assertEqArray(scrambled, byBlock);

reportCompare(0, 0, 'ok');
