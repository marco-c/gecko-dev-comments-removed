









"use strict";

var HeuristicsRegExp = {
  
  
  
  
  RULES: {
    
    email: new RegExp(
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
        "|(?:이메일|전자.?우편|[Ee]-?mail)(.?주소)?" 
          .normalize("NFKC"), 
      "iu"
    ),

    
    tel: new RegExp(
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
      "iu"
    ),

    
    organization: new RegExp(
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
      "iu"
    ),
    "street-address": new RegExp("streetaddress|street-address", "iu"),
    "address-line1": new RegExp(
      "^address$|address[_-]?line(one)?|address1|addr1|street" +
      "|addrline1|address_1" + 
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
      "iu"
    ),
    "address-line2": new RegExp(
      "address[_-]?line(2|two)|address2|addr2|street|suite|unit" +
      "|addrline2|address_2" + 
      "|adresszusatz|ergänzende.?angaben" + 
      "|direccion2|colonia|adicional" + 
      "|addresssuppl|complementnom|appartement" + 
      "|indirizzo2" + 
      "|住所2" + 
      "|complemento|addrcomplement" + 
      "|Улица" + 
      "|地址2" + 
        "|주소.?2", 
      "iu"
    ),
    "address-line3": new RegExp(
      "address[_-]?line(3|three)|address3|addr3|street|suite|unit" +
      "|addrline3|address_3" + 
      "|adresszusatz|ergänzende.?angaben" + 
      "|direccion3|colonia|adicional" + 
      "|addresssuppl|complementnom|appartement" + 
      "|indirizzo3" + 
      "|住所3" + 
      "|complemento|addrcomplement" + 
      "|Улица" + 
      "|地址3" + 
        "|주소.?3", 
      "iu"
    ),
    "address-level2": new RegExp(
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
        "|^시[^도·・]|시[·・]?군[·・]?구" 
          .normalize("NFKC"), 
      "iu"
    ),
    "address-level1": new RegExp(
      "(?<!(united|hist|history).?)state|county|region|province" +
      "|land" + 
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
        "|^시[·・]?도" 
          .normalize("NFKC"), 
      "iu"
    ),
    "postal-code": new RegExp(
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
      "iu"
    ),
    country: new RegExp(
      "country|countries" +
      "|país|pais" + 
      "|(\\b|_)land(\\b|_)(?!.*(mark.*))" + 
      "|(?<!(入|出))国" + 
      "|国家" + 
      "|국가|나라" + 
      "|(\\b|_)(ülke|ulce|ulke)(\\b|_)" + 
        "|کشور", 
      "iu"
    ),

    
    name: new RegExp(
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
      "iu"
    ),
    "given-name": new RegExp(
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
      "iu"
    ),
    "additional-name": new RegExp(
      "middle.*name|mname|middle$" +
      "|apellido.?materno|lastlastname" + 
        "middle.*initial|m\\.i\\.|mi$|\\bmi\\b", 
      "iu"
    ),
    "family-name": new RegExp(
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
      "iu"
    ),

    
    "cc-name": new RegExp(
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
      "iu"
    ),
    "cc-number": new RegExp(
      "(add)?(?:card|cc|acct).?(?:number|#|no|num|field)" +
      "|(cc|kk)nr" + 
      "|(?<!telefon|haus|person|fødsels)nummer" + 
      "|カード番号" + 
      "|Номер.*карты" + 
      "|信用卡号|信用卡号码" + 
      "|信用卡卡號" + 
      "|카드" + 
        
        "|(numero|número|numéro)(?!.*(document|fono|phone|réservation))",
      "iu"
    ),
    "cc-exp-month": new RegExp(
      "expir|exp.*mo|exp.*date|ccmonth|cardmonth|addmonth" +
      "|(cc|kk)month" + 
      "|gueltig|gültig|monat" + 
      "|fecha" + 
      "|date.*exp" + 
      "|scadenza" + 
      "|有効期限" + 
      "|validade" + 
      "|Срок действия карты" + 
        "|月", 
      "iu"
    ),
    "cc-exp-year": new RegExp(
      "exp|^/|(add)?year" +
      "|(cc|kk)year" + 
      "|ablaufdatum|gueltig|gültig|jahr" + 
      "|fecha" + 
      "|scadenza" + 
      "|有効期限" + 
      "|validade" + 
      "|Срок действия карты" + 
        "|年|有效期", 
      "iu"
    ),
    "cc-exp": new RegExp(
      "expir|exp.*date|^expfield$" +
      "|gueltig|gültig" + 
      "|fecha" + 
      "|date.*exp" + 
      "|scadenza" + 
      "|有効期限" + 
      "|validade" + 
        "|Срок действия карты", 
      "iu"
    ),
  },
};
