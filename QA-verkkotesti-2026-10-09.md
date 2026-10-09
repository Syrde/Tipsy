# Tipsy: verkkopelin uusintatesti 9.10.2026

Peliversio: 508eb431b1ae058f892defc21ba7807a805b94f0. Verkkopalvelu: https://tipsy-drunken-visa.onrender.com.

## Tulos

Viisi hyväksyttyä klassikkopeliä, yhteensä 299 kysymystä. 4448 pelaajakohtaista pisteytystarkistusta ja 6899 hörppylaskennan tarkistusta; ei havaittuja laskenta-, etenemis- tai yhteysvirheitä.

- 20 pelaajaa: 60 kysymystä, joista 49 alkukierroksilla ja 11 finaalissa. Pisteytyksiä 1111, hörppytarkistuksia 1725. Kuittauksen p95 578 ms.
- 18 pelaajaa: 60 kysymystä, joista 49 alkukierroksilla ja 11 finaalissa. Pisteytyksiä 1001, hörppytarkistuksia 1552. Kuittauksen p95 705 ms.
- 16 pelaajaa: 60 kysymystä, joista 49 alkukierroksilla ja 11 finaalissa. Pisteytyksiä 888, hörppytarkistuksia 1378. Kuittauksen p95 575 ms.
- 14 pelaajaa: 59 kysymystä, joista 49 alkukierroksilla ja 10 finaalissa. Pisteytyksiä 778, hörppytarkistuksia 1204. Kuittauksen p95 484 ms.
- 12 pelaajaa: 60 kysymystä, joista 49 alkukierroksilla ja 11 finaalissa. Pisteytyksiä 670, hörppytarkistuksia 1040. Kuittauksen p95 481 ms.

18 pelaajan peli eteni aloituksen jälkeen kokonaan automaattisesti. Kesto noin 52 minuuttia. Muissa peleissä käytettiin normaaleja etenemis- ja vastausten näyttöpainikkeita. Hätäohituksia ei käytetty.

## Vaihtelut ja palautuminen

- Kaikki oikein, yksi oikein, kaikki väärin, sekoitetut vastaukset, vastaamatta jättäminen, yhtäaikaiset vastaukset ja kaksoislähetykset.
- Piirakka itseensä ja toiseen pelaajaan, ryöstö, kaikki viisi panosta ja panoksen aikakatkaisu.
- 16 pelaajan pelissä yhteys katkaistiin lukitun vastauksen jälkeen; henkilöllisyys, avatar ja vastaus säilyivät.
- Oikea puhelinnäkymässä lukittu järjestysvastaus säilyi oikean Render-uudelleenkäynnistyksen yli. Kysymys, pisteet, hörpyt ja avatar säilyivät; vastaus pisteytettiin vain kerran.
- Äänet käynnistyivät uudelleenlatauksen jälkeen yhdellä painalluksella.
- Kaikkien kymmenen kierrostyypin tallennuspalautukset ja erillinen kadonneen tallennuskuittauksen simulointi läpäistiin.

## Näyttö ja äänet

- Uusi kysymys korvasi edellisen kehotteen: ei havaittuja ristiriitoja selaimen seurannassa.
- 2626 äänitiedostoa löytyi verkkopalvelusta; 2550 kysymysääniviittausta.
- Kaikkien 20 avatarin 80 repliikkiä tarkistettiin liittymisnäkymän painikkeista, myös tekstin vastaavuus ja toiston päättyminen. Tämä on tekninen toistotarkistus, ei kaikkien äänien laadun kuunteluarvio.
- Kaikki 41 ulkoista musiikkinäytettä latautuivat tarkistuksessa. Automaattipelissä havaittiin myös näytteen päättyminen normaalisti.

## Korjaukset ja testin rajat

Äänten jatkamispainike korjattiin aiemmassa julkaisussa. Tässä julkaistussa versiossa musiikkinäytteille lisättiin uusintayritys ja Viva La Vidalle saman kappaleen Coldplay-varanäyte. Näiden jälkeen ajettiin yllä olevat viisi peliä.

12 pelaajan ensimmäisessä lisäajossa testi odotti kahden erillisen aikaleiman väliltä täsmälleen 15000 ms mutta sai 14999 ms. Testiin lisättiin 10 ms toleranssi, ja koko pelaajamäärä ajettiin uudelleen; tätä aikaisempaa ajoa ei lasketa viiden hyväksytyn joukkoon.

Testi käytti oikeaa Render-palvelua ja selaimen pääruutuja. Pelaajien WebSocket-yhteydet tulivat yhdeltä tietokoneelta; 20 fyysisen puhelimen, eri puhelinmallien tai juhlapaikan Wi-Fi-verkon toimivuutta ei tällä todisteta. Musiikkinäytteet riippuvat ulkoisesta palvelusta. Kaikkien kysymysten faktasisältöä ei tarkastettu tässä ajossa.

Julkaisut tehdään pelien ollessa tauolla: aktiivisten huoneiden yhtäaikainen kirjoittaminen kahdesta palvelinversiosta aiheutti turvallisen versioristiriidan, jolloin vanha palvelu jatkoi toimintaansa. Tauolla uusi julkaisu onnistui. Tavallinen uudelleenkäynnistys ja palautuminen testattiin erikseen onnistuneesti.

Dynaamisten pelaajanimien puhuminen tarvitsee Renderiin sopivan puhegeneraattorin. Valmiit Tipsyn, Nooran ja hahmojen äänitteet toimivat; henkilökohtaiset juomakehotteet näkyvät tekstinä.

Tarkat paikalliset lokit: .local-tools/qa-cloud/. Tiivistelmä: scripts/qa-cloud-last-run.json.
 