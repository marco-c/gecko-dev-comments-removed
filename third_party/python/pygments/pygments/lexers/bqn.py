"""
    pygments.lexers.bqn
    ~~~~~~~~~~~~~~~~~~~

    Lexer for BQN.

    :copyright: Copyright 2006-present by the Pygments team, see AUTHORS.
    :license: BSD, see LICENSE for details.
"""

from pygments.lexer import RegexLexer
from pygments.token import Comment, Operator, Keyword, Name, String, \
    Number, Punctuation, Whitespace

__all__ = ['BQNLexer']


class BQNLexer(RegexLexer):
    """
    A simple BQN lexer.
    """
    name = 'BQN'
    url = 'https://mlochbaum.github.io/BQN/index.html'
    aliases = ['bqn']
    filenames = ['*.bqn']
    mimetypes = []
    version_added = '2.16'

    
    
    _iwc = r'((?=[^𝕎𝕏𝔽𝔾𝕊𝕨𝕩𝕗𝕘𝕤𝕣])\w)'

    tokens = {
        'root': [
            
            
            (r'\s+', Whitespace),
            
            
            
            
            (r'#.*$', Comment.Single),
            
            
            
            (r'\'((\'\')|[^\'])*\'', String.Single),
            (r'"(("")|[^"])*"', String.Double),
            
            
            
            
            (r'@', String.Symbol),
            
            
            
            
            
            (r'[\.⋄,\[\]⟨⟩‿]', Punctuation),
            
            
            
            
            
            (r'[\(\)]', String.Regex),
            
            
            
            
            (r'¯?[0-9](([0-9]|_)*\.?([0-9]|_)+|([0-9]|_)*)([Ee][¯]?([0-9]|_)+)?|¯|∞|π|·', Number),
            
            
            
            (r'[a-z]' + _iwc + r'*', Name.Variable),
            
            
            
            
            (r'[∘○⊸⟜⌾⊘◶⎉⚇⍟⎊]', Name.Property),
            (r'_(𝕣|[a-zA-Z0-9]+)_', Name.Property),
            
            
            
            (r'[˙˜˘¨⌜⁼´˝`𝕣]', Name.Attribute),
            (r'_(𝕣|[a-zA-Z0-9]+)', Name.Attribute),
            
            
            
            
            
            (r'[+\-×÷\⋆√⌊⌈∧∨¬|≤<>≥=≠≡≢⊣⊢⥊∾≍⋈↑↓↕«»⌽⍉/⍋⍒⊏⊑⊐⊒∊⍷⊔!𝕎𝕏𝔽𝔾𝕊]',
             Operator),
            (r'[A-Z]' + _iwc + r'*|•' + _iwc + r'+', Operator),
            
            
            
            (r'˙', Name.Constant),
            
            
            
            (r'[←↩⇐]', Keyword.Declaration),
            
            
            
            (r'[{}]', Keyword.Type),
            
            
            
            (r'[;:?𝕨𝕩𝕗𝕘𝕤]', Name.Entity),
            

        ],
    }
