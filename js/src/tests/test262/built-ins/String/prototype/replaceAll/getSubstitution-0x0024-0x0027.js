

















































var str = 'Ninguém é igual a ninguém. Todo o ser humano é um estranho ímpar.';

var result;

result = str.replaceAll('ninguém', '$\'');
assert.sameValue(result, 'Ninguém é igual a . Todo o ser humano é um estranho ímpar.. Todo o ser humano é um estranho ímpar.');

result = str.replaceAll('.', '--- $\'');
assert.sameValue(result, 'Ninguém é igual a ninguém---  Todo o ser humano é um estranho ímpar. Todo o ser humano é um estranho ímpar--- ');

result = str.replaceAll('é', '($\')');
assert.sameValue(result, 'Ningu(m é igual a ninguém. Todo o ser humano é um estranho ímpar.)m ( igual a ninguém. Todo o ser humano é um estranho ímpar.) igual a ningu(m. Todo o ser humano é um estranho ímpar.)m. Todo o ser humano ( um estranho ímpar.) um estranho ímpar.');

result = str.replaceAll('é', '($\') $\'');
assert.sameValue(result, 'Ningu(m é igual a ninguém. Todo o ser humano é um estranho ímpar.) m é igual a ninguém. Todo o ser humano é um estranho ímpar.m ( igual a ninguém. Todo o ser humano é um estranho ímpar.)  igual a ninguém. Todo o ser humano é um estranho ímpar. igual a ningu(m. Todo o ser humano é um estranho ímpar.) m. Todo o ser humano é um estranho ímpar.m. Todo o ser humano ( um estranho ímpar.)  um estranho ímpar. um estranho ímpar.');

reportCompare(0, 0);
