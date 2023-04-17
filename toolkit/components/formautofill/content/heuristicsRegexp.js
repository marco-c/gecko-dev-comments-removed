









"use strict";

var HeuristicsRegExp = {
  RULES: {
    email: undefined,
    tel: undefined,
    organization: undefined,
    "street-address": undefined,
    "address-line1": undefined,
    "address-line2": undefined,
    "address-line3": undefined,
    "address-level2": undefined,
    "address-level1": undefined,
    "postal-code": undefined,
    country: undefined,
    
    
    
    "cc-name": undefined,
    name: undefined,
    "given-name": undefined,
    "additional-name": undefined,
    "family-name": undefined,
    "cc-number": undefined,
    "cc-exp-month": undefined,
    "cc-exp-year": undefined,
    "cc-exp": undefined,
    "cc-type": undefined,
  },

  RULE_SETS: [
    
    
    {
      "address-line1": "addrline1|address_1",
      "address-line2": "addrline2|address_2",
      "address-line3": "addrline3|address_3",
      "address-level1": "land", 
      "additional-name": "apellido.?materno|lastlastname",
      "cc-name": "titulaire", 
      "cc-number": "(cc|kk)nr", 
      "cc-exp-month": "(cc|kk)month", 
      "cc-exp-year": "(cc|kk)year", 
      "cc-type": "type",
    },

    
    
    
    {
      email: "(^e-?mail$)|(^email-?address$)",

      tel:
        "(^phone$)" +
        "|(^mobile$)" +
        "|(^mobile-?phone$)" +
        "|(^tel$)" +
        "|(^telephone$)" +
        "|(^phone-?number$)",

      organization:
        "(^company$)" +
        "|(^company-?name$)" +
        "|(^organization$)" +
        "|(^organization-?name$)",

      "street-address":
        "(^address$)" +
        "|(^street-?address$)" +
        "|(^addr$)" +
        "|(^street$)" +
        "|(^mailing-?addr(ess)?$)" + 
        "|(^billing-?addr(ess)?$)" + 
        "|(^mail-?addr(ess)?$)" + 
        "|(^bill-?addr(ess)?$)", 

      "address-line1":
        "(^address-?1$)" +
        "|(^address-?line-?1$)" +
        "|(^addr-?1$)" +
        "|(^street-?1$)",

      "address-line2":
        "(^address-?2$)" +
        "|(^address-?line-?2$)" +
        "|(^addr-?2$)" +
        "|(^street-?2$)",

      "address-line3":
        "(^address-?3$)" +
        "|(^address-?line-?3$)" +
        "|(^addr-?3$)" +
        "|(^street-?3$)",

      "address-level2":
        "(^city$)" +
        "|(^town$)" +
        "|(^address-?level-?2$)" +
        "|(^address-?city$)" +
        "|(^address-?town$)",

      "address-level1":
        "(^state$)" +
        "|(^province$)" +
        "|(^provence$)" +
        "|(^address-?level-?1$)" +
        "|(^address-?state$)" +
        "|(^address-?province$)",

      "postal-code":
        "(^postal$)" +
        "|(^zip$)" +
        "|(^zip2$)" +
        "|(^zip-?code$)" +
        "|(^postal-?code$)" +
        "|(^post-?code$)" +
        "|(^address-?zip$)" +
        "|(^address-?postal$)" +
        "|(^address-?code$)" +
        "|(^address-?postal-?code$)" +
        "|(^address-?zip-?code$)",

      country:
        "(^country$)" +
        "|(^country-?code$)" +
        "|(^country-?name$)" +
        "|(^address-?country$)" +
        "|(^address-?country-?name$)" +
        "|(^address-?country-?code$)",

      name: "(^name$)|full-?name|your-?name",

      "given-name":
        "(^f-?name$)" +
        "|(^first-?name$)" +
        "|(^given-?name$)" +
        "|(^first-?n$)",

      "additional-name":
        "(^m-?name$)" +
        "|(^middle-?name$)" +
        "|(^additional-?name$)" +
        "|(^middle-?initial$)" +
        "|(^middle-?n$)" +
        "|(^middle-?i$)",

      "family-name":
        "(^l-?name$)" +
        "|(^last-?name$)" +
        "|(^s-?name$)" +
        "|(^surname$)" +
        "|(^family-?name$)" +
        "|(^family-?n$)" +
        "|(^last-?n$)",

      "cc-name":
        "cc-?name" +
        "|card-?name" +
        "|cardholder-?name" +
        "|cardholder" +
        
        "|(^nom$)",

      "cc-number":
        "cc-?number" +
        "|cc-?num" +
        "|card-?number" +
        "|card-?num" +
        "|(^number$)" +
        "|(^cc$)" +
        "|cc-?no" +
        "|card-?no" +
        "|(^credit-?card$)" +
        "|numero-?carte" +
        "|(^carte$)" +
        "|(^carte-?credit$)" +
        "|num-?carte" +
        "|cb-?num",

      "cc-exp":
        "(^cc-?exp$)" +
        "|(^card-?exp$)" +
        "|(^cc-?expiration$)" +
        "|(^card-?expiration$)" +
        "|(^cc-?ex$)" +
        "|(^card-?ex$)" +
        "|(^card-?expire$)" +
        "|(^card-?expiry$)" +
        "|(^validite$)" +
        "|(^expiration$)" +
        "|(^expiry$)" +
        "|mm-?yy" +
        "|mm-?yyyy" +
        "|yy-?mm" +
        "|yyyy-?mm" +
        "|expiration-?date" +
        "|payment-?card-?expiration" +
        "|(^payment-?cc-?date$)",

      "cc-exp-month":
        "(^exp-?month$)" +
        "|(^cc-?exp-?month$)" +
        "|(^cc-?month$)" +
        "|(^card-?month$)" +
        "|(^cc-?mo$)" +
        "|(^card-?mo$)" +
        "|(^exp-?mo$)" +
        "|(^card-?exp-?mo$)" +
        "|(^cc-?exp-?mo$)" +
        "|(^card-?expiration-?month$)" +
        "|(^expiration-?month$)" +
        "|(^cc-?mm$)" +
        "|(^cc-?m$)" +
        "|(^card-?mm$)" +
        "|(^card-?m$)" +
        "|(^card-?exp-?mm$)" +
        "|(^cc-?exp-?mm$)" +
        "|(^exp-?mm$)" +
        "|(^exp-?m$)" +
        "|(^expire-?month$)" +
        "|(^expire-?mo$)" +
        "|(^expiry-?month$)" +
        "|(^expiry-?mo$)" +
        "|(^card-?expire-?month$)" +
        "|(^card-?expire-?mo$)" +
        "|(^card-?expiry-?month$)" +
        "|(^card-?expiry-?mo$)" +
        "|(^mois-?validite$)" +
        "|(^mois-?expiration$)" +
        "|(^m-?validite$)" +
        "|(^m-?expiration$)" +
        "|(^expiry-?date-?field-?month$)" +
        "|(^expiration-?date-?month$)" +
        "|(^expiration-?date-?mm$)" +
        "|(^exp-?mon$)" +
        "|(^validity-?mo$)" +
        "|(^exp-?date-?mo$)" +
        "|(^cb-?date-?mois$)" +
        "|(^date-?m$)",

      "cc-exp-year":
        "(^exp-?year$)" +
        "|(^cc-?exp-?year$)" +
        "|(^cc-?year$)" +
        "|(^card-?year$)" +
        "|(^cc-?yr$)" +
        "|(^card-?yr$)" +
        "|(^exp-?yr$)" +
        "|(^card-?exp-?yr$)" +
        "|(^cc-?exp-?yr$)" +
        "|(^card-?expiration-?year$)" +
        "|(^expiration-?year$)" +
        "|(^cc-?yy$)" +
        "|(^cc-?y$)" +
        "|(^card-?yy$)" +
        "|(^card-?y$)" +
        "|(^card-?exp-?yy$)" +
        "|(^cc-?exp-?yy$)" +
        "|(^exp-?yy$)" +
        "|(^exp-?y$)" +
        "|(^cc-?yyyy$)" +
        "|(^card-?yyyy$)" +
        "|(^card-?exp-?yyyy$)" +
        "|(^cc-?exp-?yyyy$)" +
        "|(^expire-?year$)" +
        "|(^expire-?yr$)" +
        "|(^expiry-?year$)" +
        "|(^expiry-?yr$)" +
        "|(^card-?expire-?year$)" +
        "|(^card-?expire-?yr$)" +
        "|(^card-?expiry-?year$)" +
        "|(^card-?expiry-?yr$)" +
        "|(^an-?validite$)" +
        "|(^an-?expiration$)" +
        "|(^annee-?validite$)" +
        "|(^annee-?expiration$)" +
        "|(^expiry-?date-?field-?year$)" +
        "|(^expiration-?date-?year$)" +
        "|(^cb-?date-?ann$)" +
        "|(^expiration-?date-?yy$)" +
        "|(^expiration-?date-?yyyy$)" +
        "|(^validity-?year$)" +
        "|(^exp-?date-?year$)" +
        "|(^date-?y$)",

      "cc-type":
        "(^cc-?type$)" +
        "|(^card-?type$)" +
        "|(^card-?brand$)" +
        "|(^cc-?brand$)" +
        "|(^cb-?type$)",
    },

    
    
    
    
    
    {
      
      email:
        "e.?mail" +
        "|courriel" + 
        "|correo.*electr(o|ó)nico" + 
        "|メールアドレス" + 
        "|Электронной.?Почты" + 
        "|邮件|邮箱" + 
        "|電郵地址" + 
        "|ഇ-മെയില്‍|ഇലക്ട്രോണിക്.?" +
        "മെയിൽ" + 
        "|ایمیل|پست.*الکترونیک" + 
        "|ईमेल|इलॅक्ट्रॉनिक.?मेल" + 
        "|(\\b|_)eposta(\\b|_)" + 
        "|(?:이메일|전자.?우편|[Ee]-?mail)(.?주소)?", 

      
      tel:
        "phone|mobile|contact.?number" +
        "|telefonnummer" + 
        "|telefono|teléfono" + 
        "|telfixe" + 
        "|電話" + 
        "|telefone|telemovel" + 
        "|телефон" + 
        "|मोबाइल" + 
        "|(\\b|_|\\*)telefon(\\b|_|\\*)" + 
        "|电话" + 
        "|മൊബൈല്‍" + 
        "|(?:전화|핸드폰|휴대폰|휴대전화)(?:.?번호)?", 

      
      organization:
        "company|business|organization|organisation" +
        "|(?<!con)firma|firmenname" + 
        "|empresa" + 
        "|societe|société" + 
        "|ragione.?sociale" + 
        "|会社" + 
        "|название.?компании" + 
        "|单位|公司" + 
        "|شرکت" + 
        "|회사|직장", 

      "street-address": "streetaddress|street-address",

      "address-line1":
        "^address$|address[_-]?line(one)?|address1|addr1|street" +
        "|(?:shipping|billing)address$" +
        "|strasse|straße|hausnummer|housenumber" + 
        "|house.?name" + 
        "|direccion|dirección" + 
        "|adresse" + 
        "|indirizzo" + 
        "|^住所$|住所1" + 
        "|morada|((?<!identificação do )endereço)" + 
        "|Адрес" + 
        "|地址" + 
        "|(\\b|_)adres(?! (başlığı(nız)?|tarifi))(\\b|_)" + 
        "|^주소.?$|주소.?1", 

      "address-line2":
        "address[_-]?line(2|two)|address2|addr2|street|suite|unit(?!e)" + 
        "|adresszusatz|ergänzende.?angaben" + 
        "|direccion2|colonia|adicional" + 
        "|addresssuppl|complementnom|appartement" + 
        "|indirizzo2" + 
        "|住所2" + 
        "|complemento|addrcomplement" + 
        "|Улица" + 
        "|地址2" + 
        "|주소.?2", 

      "address-line3":
        "address[_-]?line(3|three)|address3|addr3|street|suite|unit(?!e)" + 
        "|adresszusatz|ergänzende.?angaben" + 
        "|direccion3|colonia|adicional" + 
        "|addresssuppl|complementnom|appartement" + 
        "|indirizzo3" + 
        "|住所3" + 
        "|complemento|addrcomplement" + 
        "|Улица" + 
        "|地址3" + 
        "|주소.?3", 

      "address-level2":
        "city|town" +
        "|\\bort\\b|stadt" + 
        "|suburb" + 
        "|ciudad|provincia|localidad|poblacion" + 
        "|ville|commune" + 
        "|localita" + 
        "|市区町村" + 
        "|cidade" + 
        "|Город" + 
        "|市" + 
        "|分區" + 
        "|شهر" + 
        "|शहर" + 
        "|ग्राम|गाँव" + 
        "|നഗരം|ഗ്രാമം" + 
        "|((\\b|_|\\*)([İii̇]l[cç]e(miz|niz)?)(\\b|_|\\*))" + 
        "|^시[^도·・]|시[·・]?군[·・]?구", 

      "address-level1":
        "(?<!(united|hist|history).?)state|county|region|province" +
        "|county|principality" + 
        "|都道府県" + 
        "|estado|provincia" + 
        "|область" + 
        "|省" + 
        "|地區" + 
        "|സംസ്ഥാനം" + 
        "|استان" + 
        "|राज्य" + 
        "|((\\b|_|\\*)(eyalet|[şs]ehir|[İii̇]l(imiz)?|kent)(\\b|_|\\*))" + 
        "|^시[·・]?도", 

      "postal-code":
        "zip|postal|post.*code|pcode" +
        "|pin.?code" + 
        "|postleitzahl" + 
        "|\\bcp\\b" + 
        "|\\bcdp\\b" + 
        "|\\bcap\\b" + 
        "|郵便番号" + 
        "|codigo|codpos|\\bcep\\b" + 
        "|Почтовый.?Индекс" + 
        "|पिन.?कोड" + 
        "|പിന്‍കോഡ്" + 
        "|邮政编码|邮编" + 
        "|郵遞區號" + 
        "|(\\b|_)posta kodu(\\b|_)" + 
        "|우편.?번호", 

      country:
        "country|countries" +
        "|país|pais" + 
        "|(\\b|_)land(\\b|_)(?!.*(mark.*))" + 
        "|(?<!(入|出))国" + 
        "|国家" + 
        "|국가|나라" + 
        "|(\\b|_)(ülke|ulce|ulke)(\\b|_)" + 
        "|کشور", 

      
      "cc-name":
        "card.?(?:holder|owner)|name.*(\\b)?on(\\b)?.*card" +
        "|(?:card|cc).?name|cc.?full.?name" +
        "|karteninhaber" + 
        "|nombre.*tarjeta" + 
        "|nom.*carte" + 
        "|nome.*cart" + 
        "|名前" + 
        "|Имя.*карты" + 
        "|信用卡开户名|开户名|持卡人姓名" + 
        "|持卡人姓名", 

      name:
        "^name|full.?name|your.?name|customer.?name|bill.?name|ship.?name" +
        "|name.*first.*last|firstandlastname" +
        "|nombre.*y.*apellidos" + 
        "|^nom(?!bre)" + 
        "|お名前|氏名" + 
        "|^nome" + 
        "|نام.*نام.*خانوادگی" + 
        "|姓名" + 
        "|(\\b|_|\\*)ad[ı]? soyad[ı]?(\\b|_|\\*)" + 
        "|성명", 

      "given-name":
        "first.*name|initials|fname|first$|given.*name" +
        "|vorname" + 
        "|nombre" + 
        "|forename|prénom|prenom" + 
        "|名" + 
        "|nome" + 
        "|Имя" + 
        "|نام" + 
        "|이름" + 
        "|പേര്" + 
        "|(\\b|_|\\*)(isim|ad|ad(i|ı|iniz|ınız)?)(\\b|_|\\*)" + 
        "|नाम", 

      "additional-name":
        "middle.*name|mname|middle$|middle.*initial|m\\.i\\.|mi$|\\bmi\\b",

      "family-name":
        "last.*name|lname|surname|last$|secondname|family.*name" +
        "|nachname" + 
        "|apellidos?" + 
        "|famille|^nom(?!bre)" + 
        "|cognome" + 
        "|姓" + 
        "|apelidos|surename|sobrenome" + 
        "|Фамилия" + 
        "|نام.*خانوادگی" + 
        "|उपनाम" + 
        "|മറുപേര്" + 
        "|(\\b|_|\\*)(soyisim|soyad(i|ı|iniz|ınız)?)(\\b|_|\\*)" + 
        "|\\b성(?:[^명]|\\b)", 

      
      
      
      "cc-number":
        "(add)?(?:card|cc|acct).?(?:number|#|no|num|field)" +
        "|(?<!telefon|haus|person|fødsels)nummer" + 
        "|カード番号" + 
        "|Номер.*карты" + 
        "|信用卡号|信用卡号码" + 
        "|信用卡卡號" + 
        "|카드" + 
        
        "|(numero|número|numéro)(?!.*(document|fono|phone|réservation))",

      "cc-exp-month":
        "expir|exp.*mo|exp.*date|ccmonth|cardmonth|addmonth" +
        "|gueltig|gültig|monat" + 
        "|fecha" + 
        "|date.*exp" + 
        "|scadenza" + 
        "|有効期限" + 
        "|validade" + 
        "|Срок действия карты" + 
        "|月", 

      "cc-exp-year":
        "exp|^/|(add)?year" +
        "|ablaufdatum|gueltig|gültig|jahr" + 
        "|fecha" + 
        "|scadenza" + 
        "|有効期限" + 
        "|validade" + 
        "|Срок действия карты" + 
        "|年|有效期", 

      "cc-exp":
        "expir|exp.*date|^expfield$" +
        "|gueltig|gültig" + 
        "|fecha" + 
        "|date.*exp" + 
        "|scadenza" + 
        "|有効期限" + 
        "|validade" + 
        "|Срок действия карты", 
    },
  ],

  _getRule(name) {
    let rules = [];
    this.RULE_SETS.forEach(set => {
      if (set[name]) {
        rules.push(`(${set[name]})`.normalize("NFKC"));
      }
    });

    const value = new RegExp(rules.join("|"), "iu");
    Object.defineProperty(this.RULES, name, { get: undefined });
    Object.defineProperty(this.RULES, name, { value });
    return value;
  },

  init() {
    Object.keys(this.RULES).forEach(field =>
      Object.defineProperty(this.RULES, field, {
        get() {
          return HeuristicsRegExp._getRule(field);
        },
      })
    );
  },
};

HeuristicsRegExp.init();
