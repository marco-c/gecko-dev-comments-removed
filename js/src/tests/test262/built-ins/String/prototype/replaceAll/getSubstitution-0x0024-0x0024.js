

















































var str = 'Ninguém é igual a ninguém. Todo o ser humano é um estranho ímpar.';

var result;

result = str.replaceAll('ninguém', '$$');
assert.sameValue(result, 'Ninguém é igual a $. Todo o ser humano é um estranho ímpar.');

result = str.replaceAll('é', '$$');
assert.sameValue(result, 'Ningu$m $ igual a ningu$m. Todo o ser humano $ um estranho ímpar.');

result = str.replaceAll('é', '$$ -');
assert.sameValue(result, 'Ningu$ -m $ - igual a ningu$ -m. Todo o ser humano $ - um estranho ímpar.');

result = str.replaceAll('é', '$$&');
assert.sameValue(result, 'Ningu$&m $& igual a ningu$&m. Todo o ser humano $& um estranho ímpar.');

result = str.replaceAll('é', '$$$');
assert.sameValue(result, 'Ningu$$m $$ igual a ningu$$m. Todo o ser humano $$ um estranho ímpar.');

result = str.replaceAll('é', '$$$$');
assert.sameValue(result, 'Ningu$$m $$ igual a ningu$$m. Todo o ser humano $$ um estranho ímpar.');

reportCompare(0, 0);
