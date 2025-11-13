


















const other_granularities = [undefined, "grapheme", "sentence"];

const inputs = [
    "Hello world!", 
    "Jedovatou mambu objevila žena v zahrádkářské kolonii.", 
    "Việt Nam: Nhất thể hóa sẽ khác Trung Quốc?",  
    "Σοβαρές ενστάσεις Κομισιόν για τον προϋπολογισμό της Ιταλίας", 
    "Решение Индии о покупке российских С-400 расценили как вызов США",  
    "הרופא שהציל נשים והנערה ששועבדה ע",  
    "ترامب للملك سلمان: أنا جاد للغاية.. عليك دفع المزيد", 
    "भारत की एस 400 मिसाइल के मुकाबले पाक की थाड, जानें कौन कितना ताकतवर",  
    "ரெட் அலர்ட் எச்சரிக்கை; புதுச்சேரியில் நாளை அரசு விடுமுறை!", 
    "'ఉత్తర్వులు అందే వరకు ఓటర్ల తుది జాబితాను వెబ్‌సైట్లో పెట్టవద్దు'", 
    "台北》抹黑柯P失敗？朱學恒酸：姚文智氣pupu嗆大老闆", 
    "วัดไทรตีระฆังเบาลงช่วงเข้าพรรษา เจ้าอาวาสเผยคนร้องเรียนรับผลกรรมแล้ว",  
    "九州北部の一部が暴風域に入りました(日直予報士 2018年10月06日) - 日本気象協会 tenki.jp",  
    "법원 “다스 지분 처분권·수익권 모두 MB가 보유”", 
];

other_granularities.forEach(
    function(granularity) {
      const segmenter = new Intl.Segmenter(undefined, {granularity});
      inputs.forEach(function(input) {
        const segment = segmenter.segment(input);
        for (let index = 0; index < input.length; index++) {
          const result = segment.containing(index);
          const msg =
              `granularity: ${granularity} input: ${input} containing(${index})`;
          assert.sameValue(true, result.index >= 0, `${msg} index >= 0`);
          assert.sameValue(true, result.index < input.length, `${msg} index`);
          assert.sameValue("string", typeof result.input, `${msg} input`);
          assert.sameValue(undefined, result.isWordLike,
              `${msg} isWordLike should be undefined`);
          assert.compareArray(Object.getOwnPropertyNames(result), ["segment", "index", "input"]);
        }
      });
    });

reportCompare(0, 0);
