package org.mozilla.gecko.util.publicsuffix;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mozilla.gecko.background.testhelpers.TestRunner;

@RunWith(TestRunner.class)
public class TestPublicSuffix {
    @Test
    public void testStripPublicSuffix() {
        
        Assert.assertEquals("", PublicSuffix.stripPublicSuffix(""));

        
        Assert.assertEquals("www.mozilla", PublicSuffix.stripPublicSuffix("www.mozilla.org"));
        Assert.assertEquals("www.google", PublicSuffix.stripPublicSuffix("www.google.com"));
        Assert.assertEquals("foobar", PublicSuffix.stripPublicSuffix("foobar.blogspot.com"));
        Assert.assertEquals("independent", PublicSuffix.stripPublicSuffix("independent.co.uk"));
        Assert.assertEquals("biz", PublicSuffix.stripPublicSuffix("biz.com.ua"));
        Assert.assertEquals("example", PublicSuffix.stripPublicSuffix("example.org"));
        Assert.assertEquals("example", PublicSuffix.stripPublicSuffix("example.pvt.k12.ma.us"));

        
        Assert.assertEquals("localhost", PublicSuffix.stripPublicSuffix("localhost"));
        Assert.assertEquals("firefox.mozilla", PublicSuffix.stripPublicSuffix("firefox.mozilla"));

        
        Assert.assertEquals("ουτοπία.δπθ", PublicSuffix.stripPublicSuffix("ουτοπία.δπθ.gr"));
        Assert.assertEquals("a网络A", PublicSuffix.stripPublicSuffix("a网络A.网络.Cn"));

        
        Assert.assertEquals("192.168.0.1", PublicSuffix.stripPublicSuffix("192.168.0.1"));
        Assert.assertEquals("asdflkj9uahsd", PublicSuffix.stripPublicSuffix("asdflkj9uahsd"));

        
        Assert.assertEquals("www.mozilla。home．example", PublicSuffix.stripPublicSuffix("www.mozilla。home．example｡org"));
        Assert.assertEquals("example", PublicSuffix.stripPublicSuffix("example.org"));
    }

    @Test(expected = NullPointerException.class)
    public void testStripPublicSuffixThrowsException() {
        PublicSuffix.stripPublicSuffix(null);
    }
}
