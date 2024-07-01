



package org.mozilla.focus.shortcut;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;

import static org.junit.Assert.assertEquals;

@RunWith(RobolectricTestRunner.class)
public class IconGeneratorTest {
    @Test
    public void testRepresentativeCharacter() {
        assertEquals("M", IconGenerator.Companion.getRepresentativeCharacter("https://mozilla.org"));
        assertEquals("W", IconGenerator.Companion.getRepresentativeCharacter("http://wikipedia.org"));
        assertEquals("P", IconGenerator.Companion.getRepresentativeCharacter("http://plus.google.com"));
        assertEquals("E", IconGenerator.Companion.getRepresentativeCharacter("https://en.m.wikipedia.org/wiki/Main_Page"));

        
        assertEquals("T", IconGenerator.Companion.getRepresentativeCharacter("http://www.theverge.com"));
        assertEquals("F", IconGenerator.Companion.getRepresentativeCharacter("https://m.facebook.com"));
        assertEquals("T", IconGenerator.Companion.getRepresentativeCharacter("https://mobile.twitter.com"));

        
        assertEquals("?", IconGenerator.Companion.getRepresentativeCharacter("file:///"));
        assertEquals("S", IconGenerator.Companion.getRepresentativeCharacter("file:///system/"));
        assertEquals("P", IconGenerator.Companion.getRepresentativeCharacter("ftp://people.mozilla.org/test"));

        
        assertEquals("?", IconGenerator.Companion.getRepresentativeCharacter(""));
        assertEquals("?", IconGenerator.Companion.getRepresentativeCharacter(null));

        
        assertEquals("Z", IconGenerator.Companion.getRepresentativeCharacter("zZz"));
        assertEquals("Ö", IconGenerator.Companion.getRepresentativeCharacter("ölkfdpou3rkjaslfdköasdfo8"));
        assertEquals("?", IconGenerator.Companion.getRepresentativeCharacter("_*+*'##"));
        assertEquals("ツ", IconGenerator.Companion.getRepresentativeCharacter("¯\\_(ツ)_/¯"));
        assertEquals("ಠ", IconGenerator.Companion.getRepresentativeCharacter("ಠ_ಠ Look of Disapproval"));

        
        assertEquals("Ä", IconGenerator.Companion.getRepresentativeCharacter("http://www.ätzend.de"));
        assertEquals("名", IconGenerator.Companion.getRepresentativeCharacter("http://名がドメイン.com"));
        assertEquals("C", IconGenerator.Companion.getRepresentativeCharacter("http://√.com"));
        assertEquals("ß", IconGenerator.Companion.getRepresentativeCharacter("http://ß.de"));
        assertEquals("Ԛ", IconGenerator.Companion.getRepresentativeCharacter("http://ԛәлп.com/")); 

        
        assertEquals("X", IconGenerator.Companion.getRepresentativeCharacter("http://xn--tzend-fra.de")); 
        assertEquals("X", IconGenerator.Companion.getRepresentativeCharacter("http://xn--V8jxj3d1dzdz08w.com")); 

        
        assertEquals("1", IconGenerator.Companion.getRepresentativeCharacter("https://www.1and1.com/"));

        
        assertEquals("1", IconGenerator.Companion.getRepresentativeCharacter("https://192.168.0.1"));
    }
}
