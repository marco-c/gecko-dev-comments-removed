








var invalidTimeZoneNames = [
    "",
    "MEZ", 
    "Pacific Time", 
    "cnsha", 
    "invalid", 
    "Europe/İstanbul", 
    "asıa/baku", 
    "europe/brußels"  
];

invalidTimeZoneNames.forEach(function (name) {
    
    assert.throws(RangeError, function() {
        var format = new Intl.DateTimeFormat(["de-de"], {timeZone: name});
    }, "Invalid time zone name " + name + " was not rejected.");
});

reportCompare(0, 0);
