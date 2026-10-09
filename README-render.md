# Tipsy Drunken Visa Renderiin

## Käytössä oleva verkkopalvelu

- Peli: https://tipsy-drunken-visa.onrender.com
- Render-palvelu: https://dashboard.render.com/web/srv-db4c7860tbcc73dt6hng
- Supabase-projekti: `yxlcxfckmszddnjpalte`
- Ensimmäinen julkaisu onnistui 9.10.2026 (Free). Terveystarkistus palautti `status: ok` ja `roomStorage: supabase`.
- Julkinen liittymisosoite tarkistettiin. Selaimella luotu tyhjä pelihuone tallentui Supabasen `tipzy_rooms`-tauluun.
- Salainen Supabase-avain on vain Renderin ympäristöasetuksessa.

## Valmisteltu

- `render.yaml`: Node-palvelin, Free, Frankfurt, `npm ci --omit=dev`, `npm start`.
- Node.js 22 määritetty `.node-version`-tiedostossa.
- `/api/health` kertoo palvelimen ja käytetyn tallennustavan. Tallennusvirhe tekee tarkistuksesta epäonnistuneen.
- Renderin `RENDER_EXTERNAL_URL` valitsee julkisen liittymisosoitteen ja QR-koodin. Oman osoitteen voi antaa `TIPZY_PUBLIC_URL`-ympäristömuuttujassa.
- Automaattiset julkaisut ovat pois, jotta koodipäivitys ei käynnistä palvelinta uudelleen kesken pelin.
- Esikatselu käyttää olemassa olevia äänitiedostoja. `TIPZY_OFFLINE_AUDIO=1` estää uuden puheen generoinnin palvelimella.

## Tilit ja julkaisu

1. GitHub-repositorio: https://github.com/Syrde/Tipsy . Repositorioon viedään pelin lähdekoodi, asetukset sekä käytössä olevat kuvat ja äänitteet. `.env`, paikalliset kirjautumistiedot, virtuaaliympäristöt ja työkalujen välimuistit jätetään pois.
2. Luo Render-tili: https://dashboard.render.com/register . GitHub-kirjautuminen käy.
3. Suorita Supabasessa SQL Editorilla `supabase/001-room-checkpoints.sql`. Ota Project URL ja Settings → API Keys -kohdan Secret key.
4. Renderissä New → Blueprint, yhdistä pelin GitHub-repositorio ja käytä `render.yaml`-tiedostoa. Lisää `SUPABASE_URL` ja `SUPABASE_SECRET_KEY` suoraan Renderin ympäristömuuttujiin. Salainen avain kuuluu vain palvelimelle.
5. Varmista ennen luontia Free sekä Frankfurt. Render antaa oman HTTPS-osoitteen. Käyttöönotto ja liittyminen tarkistetaan tällä osoitteella.

## Ennen juhlakäyttöä vielä tehtävä

Supabase-yhteys ja pelihuoneen tallentuminen on tarkistettu ensimmäisessä verkkojulkaisussa. Palvelimen uudelleenkäynnistyksestä palautumista ja Renderin kuormitusta ei ole vielä tarkistettu. Verkkoversio ei ole juhlakäyttöön vahvistettu ennen näitä tarkistuksia.

- `quiz-room-store.mjs` tallentaa Supabaseen kysymysjärjestyksen, lukitut vastaukset, pisteytysvaiheen, hörpyt ja pelaajien paluutunnisteet. Palautettu peli jää tauolle. Versiotarkistus estää vanhaa palvelinta kirjoittamasta uudemman tilan päälle, ja saman tallennuspyynnön voi toistaa turvallisesti aikakatkon jälkeen.
- Vastaukset julkaistaan vasta tallennuksen jälkeen. Tallennusyhteyden katketessa peli pysähtyy, näyttää ilmoituksen ja yrittää palauttaa yhteyden. Järjestäjä jatkaa peliä käsin yhteyden palauduttua.
- Tallenteet ovat palautettavissa seitsemän päivää viimeisestä tallennuksesta. Vanhojen tietokantarivien siivous ei vielä ole automaattinen. Selaimen tietojen tyhjentäminen hävittää sen paluutunnisteen.
- `TIPZY_REQUIRE_PERSISTENCE=1` estää Render-käynnistyksen ilman tietokanta-asetuksia. Paikallinen peli toimii edelleen muistissa, jos Supabase-muuttujia ei ole asetettu. Äänitteet pidetään pelipalvelimella; tietokantaan vain pelitilanne.
- Nimillä tehtävät Tipsyn uudet kuulutukset käyttävät nyt tämän Windows-koneen Python/PixVerse-asennusta. Verkkopalvelimelle tarvitaan erillinen toteutus. Esikatseluasetuksilla jo tallennetut nimikuulutukset toimivat, mutta puuttuvalle nimikuulutukselle ei generoida uutta ääntä.
- WebSocket-pingit havaitsevat katkenneet yhteydet. Palautuminen ja Renderin todellinen kuormitus tarkistetaan ennen peli-iltaa.

Renderin Free voi käynnistyä uudelleen ja paikalliset tiedostomuutokset häviävät. Supabasen Free voi mennä tauolle viikon käyttämättömyyden jälkeen; tila tarkistetaan ennen iltaa. Ilmaiskiintiöiden riittävyys tarkistetaan tileiltä ennen julkaisua.

Viralliset ohjeet:
- https://render.com/docs/free
- https://render.com/docs/blueprint-spec
- https://render.com/docs/deploy-node-express-app
- https://supabase.com/pricing
- https://supabase.com/docs/guides/getting-started/api-keys
- https://supabase.com/docs/guides/database/functions

## Julkaistavat tiedostot

`node scripts/prepare-render-release.mjs` muodostaa `.local-tools/render-files.nul`-luettelon Gitin täsmällistä lisäystä varten. Luettelo sisältää ajettavan pelin, manifestin käyttämät äänet ja pelin kuvat. Se ei sisällä `.env`-tiedostoja, virtuaaliympäristöjä, kirjautumiskuvia tai käyttämättömiä äänidemoja.
