













var SECTION = 'As described in Netscape doc "Whats new in JavaScript 1.2"';
var TITLE = 'RegExp: .';
var BUGNUMBER="123802";

printBugNumber(BUGNUMBER);
writeHeaderToLog('Executing script: control_characters.js');
writeHeaderToLog( SECTION + " "+ TITLE);



new TestCase ( "'àOÐ ê:i¢Ø'.match(new RegExp('.+'))",
	       String(['àOÐ ê:i¢Ø']), String('àOÐ ê:i¢Ø'.match(new RegExp('.+'))));


var string1 = 'àOÐ ê:i¢Ø';
new TestCase ( "string1 = " + string1 + " string1.match(string1)",
	       String([string1]), String(string1.match(string1)));

string1 = "";
for (var i = 0; i < 32; i++)
  string1 += String.fromCharCode(i);
new TestCase ( "string1 = " + string1 + " string1.match(string1)",
	       String([string1]), String(string1.match(string1)));

test();
