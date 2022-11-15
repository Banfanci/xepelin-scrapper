const { GoogleSpreadsheet } = require("google-spreadsheet");

exports.addSheetWithArticles = async (title, articles, idSheet) => {
  // Initialize the sheet - doc ID is the long id in the sheets URL
  const doc = new GoogleSpreadsheet(idSheet);

  // Initialize Auth - see https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
  await doc.useServiceAccountAuth({
    // env var values are copied from service account credentials generated by google
    // see "Authentication" section in docs for more info
    client_email: "bflobos@xepelin-scrapper.iam.gserviceaccount.com",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCd+MyNc3K13mPX\nepmORGrZuqYT87hrZb9ngfEh1FNp+8ngmIK87hmeodFR2dZBHhTd0HxYVD40W4Kw\nnch7gVTx3nLxBIkAVHeo6vjyBQdQAo7geYJA31FU3Mk9JDQiCrdvRqQ8TKnBRuBP\nUOc9UIp66f8MF7GvWm+zX/OprfiqvOlHytovC/CitRm//g+6DR6iYiOVZoUOraEK\nS7ldXbETJ1WW226+XXKQasV9gHsKS4uvSmPdgMbAozGP0UdYZGkWWgadDlW1avlD\npf58NBNKJl3iKP3BpP5vr9I4hbGlXX0FWYeq3qLBwZlE8sqWqkcWj2RWjI3A0j8R\njX2Kqn5dAgMBAAECggEADNmXMg5pD1g2wOltIkB4fJuNNORHZR0Ss8XDKqBN5Loh\nks51HA82MEwzbbgNkKB0zBJQexLnOHUVLW64RyufEEmrCeX3ivpT/X6Xn4A/Nwfu\nPV5E9Sf1QrTu/bU7NGWwxDF33JvT1y//wRPwq3EowpTUNVScFIqDuZCdjnjjWGgC\npGnc63MbOqorIQvDRCkq/fbmpU9Wp8DC1SqudKsO5LNRgiAwhdk3VTEY3L5skVwM\nizDiPKdUdj2WPZ6UTeg1pQlY7NcnsVwFxJcpen1IH/yZFANPQiAmGlI5g47c31en\npGwj6sUrOiESffP1/cwF/hvVF2bmGxf4oGhnLJbTdQKBgQDeRa9lquyq1KCBQJWZ\njN1sXdaULQhbzqQPeftQVMRFR4TjIetNySfCVBF9ySL+e5LePqjhEALnRG9acyxi\nmybzwQ1iOubFP2F5EjKv1mnX5/77cCCoZBN1EqrkbZjf2a9Z8/VxhSXHbPgHcE48\nhF9voCanIf5EvF5lPl5j3nZZnwKBgQC18VLa+lk/3IQDq5ezBdYU8c9icyxdcdCv\nAQrxKAdEJEVrndGCGj8XgmQIwbOGddEf9WNyf24qIWR2Yz5fUEF3MbdYvcZYG5RG\nfZEsSAQ2O3ZT9jc8qWwRuG9+05lKUYmX/tE40qRBgW67amYIxtnDJK+PemD6HoY1\nVbQjeCYegwKBgQDDm5n3JAvxbvvto7PEFQbMFmz/q/3eJaWWBSiZEnBD8+PLq48T\nvoIh77AQ/ZCxWnju4z/mCRw1ALHqbM9T2+zUuUGY//MVBWk3jj9TJaOyIXXxO0VS\nS/gfoJUKQDU4Uq+RvzNyetW7gndovHntoiUG7G73yN+nCAsemFujEiUfSwKBgHc0\n3R+CJZW06n3pIGR4L3LbmBAd+/RhjOQMn9mva0tXJHDFHy7J+YpysQ4Xs4MmkFUL\nFxQ+r7RE2qjCj2wtjicFWOZ4uIqjzzt8K/DCYpgRz45lZH2HV7ooiEylYOsTjz4a\nA4TiZiJRJnb+2Elp1+WGlMxB12YpN6+cLoGKyBb3AoGBAKwcmm/pFmOqTcY7LH8C\nkruh4zkbdzhEbaVgr2me5/tSc276Q8RyRBmJ3mrGYYZuGQVgYfCdJ92WixWIU/Vn\nVQ+ffw24STCnXIKSdvSCovUklenZ2iSXt4ea4x9i1Hk2/S1XLTLsxMe9KwwUjxS/\nqbSoyBVGyH/mkLTa3XDn0a/V\n-----END PRIVATE KEY-----\n",
  });

  await doc.loadInfo(); // loads document properties and worksheets
  // delete if exists
  let sheet = doc.sheetsByTitle[title];
  if (sheet) {
    await sheet.delete();
  }
  sheet = await doc.addSheet({
    title,
    headerValues: [
      "Titular",
      "Categoría",
      "Autor",
      "tiempo de lectura",
      "fecha de publicación",
    ],
  });

  await sheet.addRows(articles);
};