













































var SECTION = 'As described in Netscape doc "Whats new in JavaScript 1.2"';
var VERSION = 'no version';
var TITLE = 'RegExp: .';
var BUGNUMBER="123802";

startTest();
writeHeaderToLog('Executing script: control_characters.js');
writeHeaderToLog( SECTION + " "+ TITLE);



new TestCase ( SECTION, "'‡O– Í:i¢ÿ'.match(new RegExp('.+'))",
	       String(['‡O– Í:i¢ÿ']), String('‡O– Í:i¢ÿ'.match(new RegExp('.+'))));


var string1 = '‡O– Í:i¢ÿ';
new TestCase ( SECTION, "string1 = " + string1 + " string1.match(string1)",
	       String([string1]), String(string1.match(string1)));

string1 = "";
for (var i = 0; i < 32; i++)
    string1 += String.fromCharCode(i);
new TestCase ( SECTION, "string1 = " + string1 + " string1.match(string1)",
	       String([string1]), String(string1.match(string1)));

test();
