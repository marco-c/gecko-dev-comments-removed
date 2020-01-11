

















































var str = 'Ninguém é igual a ninguém. Todo o ser humano é um estranho ímpar.';

var result;

result = str.replaceAll('ninguém', '$`');
assert.sameValue(result, 'Ninguém é igual a Ninguém é igual a . Todo o ser humano é um estranho ímpar.');

result = str.replaceAll('Ninguém', '$`');
assert.sameValue(result, ' é igual a ninguém. Todo o ser humano é um estranho ímpar.');

result = str.replaceAll('ninguém', '($`)');
assert.sameValue(result, 'Ninguém é igual a (Ninguém é igual a ). Todo o ser humano é um estranho ímpar.');

result = str.replaceAll('é', '($`)');
assert.sameValue(result, 'Ningu(Ningu)m (Ninguém ) igual a ningu(Ninguém é igual a ningu)m. Todo o ser humano (Ninguém é igual a ninguém. Todo o ser humano ) um estranho ímpar.');

result = str.replaceAll('é', '($`) $`');
assert.sameValue(result, 'Ningu(Ningu) Ningum (Ninguém ) Ninguém  igual a ningu(Ninguém é igual a ningu) Ninguém é igual a ningum. Todo o ser humano (Ninguém é igual a ninguém. Todo o ser humano ) Ninguém é igual a ninguém. Todo o ser humano  um estranho ímpar.');

reportCompare(0, 0);
