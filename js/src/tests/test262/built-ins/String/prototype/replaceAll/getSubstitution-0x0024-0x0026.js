

















































var str = 'Ninguém é igual a ninguém. Todo o ser humano é um estranho ímpar.';

var result;

result = str.replaceAll('ninguém', '$&');
assert.sameValue(result, 'Ninguém é igual a ninguém. Todo o ser humano é um estranho ímpar.');

result = str.replaceAll('ninguém', '($&)');
assert.sameValue(result, 'Ninguém é igual a (ninguém). Todo o ser humano é um estranho ímpar.');

result = str.replaceAll('é', '($&)');
assert.sameValue(result, 'Ningu(é)m (é) igual a ningu(é)m. Todo o ser humano (é) um estranho ímpar.');

result = str.replaceAll('é', '($&) $&');
assert.sameValue(result, 'Ningu(é) ém (é) é igual a ningu(é) ém. Todo o ser humano (é) é um estranho ímpar.');

reportCompare(0, 0);
