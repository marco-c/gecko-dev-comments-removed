



"use strict";










if (!window.geoip2) {
  const continent = {
    code: "NA",
    geoname_id: 6255149,
    names: {
      de: "Nordamerika",
      en: "North America",
      es: "Norteamérica",
      fr: "Amérique du Nord",
      ja: "北アメリカ",
      "pt-BR": "América do Norte",
      ru: "Северная Америка",
      "zh-CN": "北美洲",
    },
  };

  const country = {
    geoname_id: 6252001,
    iso_code: "US",
    names: {
      de: "USA",
      en: "United States",
      es: "Estados Unidos",
      fr: "États-Unis",
      ja: "アメリカ合衆国",
      "pt-BR": "Estados Unidos",
      ru: "США",
      "zh-CN": "美国",
    },
  };

  const city = {
    names: {
      en: "",
    },
  };

  const callback = onSuccess => {
    requestAnimationFrame(() => {
      onSuccess({
        city,
        continent,
        country,
        registered_country: country,
      });
    });
  };

  window.geoip2 = {
    country: callback,
    city: callback,
    insights: callback,
  };
}
