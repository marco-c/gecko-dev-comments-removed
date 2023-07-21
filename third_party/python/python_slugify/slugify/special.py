# -*- coding: utf-8 -*-


def add_uppercase_char(char_list):
    """ Given a replacement char list, this adds uppercase chars to the list """

    for item in char_list:
        char, xlate = item
        upper_dict = char.upper(), xlate.capitalize()
        if upper_dict not in char_list and char != upper_dict[0]:
            char_list.insert(0, upper_dict)
        return char_list





_CYRILLIC = [      
    (u'ё', u'e'),    
    (u'я', u'ya'),   
    (u'х', u'h'),    
    (u'у', u'y'),    
    (u'щ', u'sch'),  
    (u'ю', u'u'),    
]
CYRILLIC = add_uppercase_char(_CYRILLIC)

_GERMAN = [        
    (u'ä', u'ae'),   
    (u'ö', u'oe'),   
    (u'ü', u'ue'),   
]
GERMAN = add_uppercase_char(_GERMAN)

_GREEK = [         
    (u'χ', u'ch'),   
    (u'Ξ', u'X'),    
    (u'ϒ', u'Y'),    
    (u'υ', u'y'),    
    (u'ύ', u'y'),
    (u'ϋ', u'y'),
    (u'ΰ', u'y'),
]
GREEK = add_uppercase_char(_GREEK)


PRE_TRANSLATIONS = CYRILLIC + GERMAN + GREEK
