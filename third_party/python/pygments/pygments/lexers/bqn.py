"""
    pygments.lexers.bqn
    ~~~~~~~~~~~~~~~~~~~

    Lexer for BQN.

    :copyright: Copyright 2006-2024 by the Pygments team, see AUTHORS.
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

    tokens = {
        'root': [
            
            
            (r'\s+', Whitespace),
            
            
            
            
            (r'#.*$', Comment.Single),
            
            
            
            (r'\'((\'\')|[^\'])*\'', String.Single),
            (r'"(("")|[^"])*"', String.Double),
            
            
            
            
            (r'@', String.Symbol),
            
            
            
            
            
            (r'[\.⋄,\[\]⟨⟩‿]', Punctuation),
            
            
            
            
            
            (r'[\(\)]', String.Regex), 
            
            
            
            
            (r'¯?([0-9]+\.?[0-9]+|[0-9]+)([Ee][¯]?[0-9]+)?|¯|∞|π|·', Number),
            
            
            
            (r'\b[a-z]\w*\b', Name.Variable),
            
            
            
            (r'[˙˜˘¨⌜⁼´˝`𝕣]', Name.Attribute),
            (r'\b_[a-zA-Z0-9]+\b', Name.Attribute),
            
            
            
            (r'[∘○⊸⟜⌾⊘◶⎉⚇⍟⎊]', Name.Property),
            (r'\b_[a-zA-Z0-9]+_\b', Name.Property),
            
            
            
            
            
            (r'[+\-×÷\*√⌊⌈∧∨¬|≤<>≥=≠≡≢⊣⊢⥊∾≍⋈↑↓↕«»⌽⍉/⍋⍒⊏⊑⊐⊒∊⍷⊔!𝕎𝕏𝔽𝔾𝕊]',
             Operator),
            (r'[A-Z]\w*|•\w+\b', Operator),
            
            
            
            (r'˙', Name.Constant),
            
            
            
            (r'[←↩⇐]', Keyword.Declaration),
            
            
            
            (r'[{}]', Keyword.Type),
            
            
            
            (r'[;:?𝕨𝕩𝕗𝕘𝕤]', Name.Entity),
            
            
        ],
    }

    
