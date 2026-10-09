# Tipsy Drunken Visa

Suomenkielinen lähiverkkotietovisa 1–20 pelaajalle. Käynnistä kaynnista.cmd tai npm start, avaa http://localhost:3000, luo huone ja skannaa QR-koodi puhelimilla samassa verkossa. Tietokone toimii pelinäyttönä. Tarvittaessa tarkista Node.js:n lupa Windowsin yksityisen verkon palomuurissa.

## Kierrokset ja pituus

Kymmenen kierrosta: perustietovisa, kategoriakapteeni, järjestys, kuva, maailmanmatkaaja, piirakkasota, panostaja, ryöstö, kuunneltava musiikkivisa ja pudotusfinaali. Klassikko: 49 kysymystä + finaali, kokeilu: 9 + finaali, pitkä ilta: 90 + finaali. Klassikossa ja pitkässä pelissä on 8 kuunneltavaa musiikkikysymystä. Jos musiikkipankki puuttuu, musiikkikierros ohitetaan ja pelissä on yhdeksän kierrosta. Finaali jatkuu viimeiseen pelaajaan, joten tarkkaa 20–30 minuutin kestoa ei voi taata. Valikossa on myös suora finaalikokeilu ja neljän kysymyksen kokeilut uusille kierroksille. Lisää testipelaaja antaa käyttää konetta ohjaimena (hiiri tai näppäimet 1–4).

Pankki alkaa oletuksena 30 pisteestä. Tavallinen oikea vastaus +2, väärä tai vastaamatta −2. Kategoriakapteenin ensimmäinen kysymys arvotaan; sen jälkeen nopein oikein vastannut valitsee seuraavan aiheen neljästä vaihtoehdosta. Ilman oikeaa vastausta seuraava kysymys arvotaan. Maailmanmatkaajassa kolme oikeaa antaa kerran +3. Piirakka vie kohteelta 2 pistettä ja kilven; kolmen osuman jälkeen pelaaja voi vastata mutta ei enää heittää. Ryöstössä enintään 3 pistettä siirtyy kohteelta ryöstäjälle.

## Panostaja

Vaihtoehdot ovat **1, 3, 5, 8 ja 10**. Oman pankin ylittäviä panoksia ei voi valita. Painallus lukitsee panoksen ennen kysymyksen paljastamista. Oikein tuo panoksen verran lisää; väärin tai vastaamatta vie panoksen. Lukitsematon panos on ajan lopussa 1, tyhjällä pankilla 0. Kyse on virtuaalisista pelipisteistä.

## Finaali

- Nopein oikein: +5.
- Muut oikein: +2 ja −5 eli netto −3.
- Väärin tai vastaamatta: −5.
- Pankki ei mene miinukselle. Nollaan päätyvä putoaa katsomoon, viimeinen jäljellä voittaa.
- Samalla kysymyksellä pudonneilla on sama sijoitus. Jos kaikki viimeiset pelaajat putoavat samalla kysymyksellä, peli ei nimeä keinotekoista voittajaa.
- Putoamiseen kuuluu surullinen trumpettifanfaari ja nimimerkillä kohdistettu räävitön Tipsy-repliikki.
- Yksin harjoitellessa finaali kestää 8 kysymystä tai pankin tyhjenemiseen asti.

## Pelaajakohtainen juomatauko

Vastaamatta jäänyt kysymys saa ajan päätyttyä saman rangaistuksen kuin väärä vastaus: tavallisesti −2, panostajassa panoksen verran ja finaalissa −5. Tämä koskee myös kysymyksen alkaessa mukana ollutta pelaajaa, jonka yhteys katkeaa. Menetetyt pisteet lisätään hörppylaskuriin normaalisti; vähennys rajataan jäljellä olevaan pankkiin.

Jokaisen kysymyksen pistehäviöt lasketaan mukaan: väärä vastaus, piirakka, ryöstö ja panos. Yksi todella menetetty pankkipiste tarkoittaa yhtä hörppymerkintää. Finaalin hitaampi oikea tuottaa 3 merkintää, väärä 5, tai vähemmän jos pankki tyhjenee. Samaa menetystä ei lasketa uudestaan myöhemmissä tauoissa.

Tauko näyttää nimet ja määrät. Tipsy sanoo esimerkiksi ”Tarja, juo 3 hörppyä”. Finaalissa yhteenveto tulee joka kysymyksen jälkeen myös ilman menetyksiä: ”No niin, no niin…” ja ”Jorma selviää kuivalla kurkulla”. Puhelimessa on henkilökohtainen Valmis-painike, pelinäyttö voi jatkaa, ja automaattinen jatko toimii määräajan jälkeen. Koko pelin kertymä näkyy podiumissa.

Juomakehotteet ovat vapaaehtoisia, alkoholiton käy myös ja kehotteet voi poistaa aloituksesta. Pankki on virtuaalinen pistemäärä, ei juotava kokonaismäärä.

## Tipsy ja musiikki

Pelille sävelletty 128 BPM electro-funk-tausta sisältää napakat rummut, basson, torvistabit ja syntetisaattorit. Finaalissa soi oma 142 BPM versio. Lavan valot, kilpailijoiden eleet, pisteponnahdukset ja Tipsyn vaihtelevat puheasennot elävöittävät pelinäyttöä. Musiikki vaimenee puheen aikana. Sille on oma päälle/pois-painike ja äänenvoimakkuus; yhteinen äänen nappi mykistää kaiken. Musiikki, trumpetti ja valmiit puheraidat ovat paikallisia tiedostoja.

Tipsyn valmiit juonnot käyttävät PixVersen Eleven v3 -puhemallia ja Oxley-hahmoääntä. Luonnolliset raidat ovat public/audio/tipsy-natural-kansiossa; käytettävissä olevista repliikeistä valitaan nämä versiot ensisijaisesti. Kysymykset lukee fi-FI-NooraNeural-naisääni rauhallisemmalla −3 % nopeudella. Kaikki 473 aktiivisen pankin kysymysluennat ovat public/audio/reader-noora-kansiossa. Pelaajien nimikuulutukset käyttävät edelleen fi-FI-HarriNeural-ääntä. Äänet ovat synteettisiä. Tipsyllä on 16 poseerausta, myös keskisormi, kieli, epäusko, silmänisku, nauru ja voitontanssi, sekä tilanteen mukaan vaihtuvaa liikkumista, ei reaaliaikaista 3D-mallia tai varsinaista huulisynkkaa.

Kaikista kierrosjuonnoista on luonnollinen Eleven v3 -versio. Muiden kommenttien luonnolliset versiot valitaan ensisijaisesti. Kysymysluennat tuotetaan aktiivisesta pankista. Nimirepliikit tuotetaan tarvittaessa paikallisen Python-ympäristön edge-tts-työkalulla; tämä tarvitsee verkkoyhteyden Microsoftin puhepalveluun, jolle välitetään nimimerkki ja repliikki. Raidat välimuistitetaan public/audio/dynamic-kansioon. Jos generointi ei onnistu, peli yrittää selaimen suomenkielistä puhesynteesiä ja näyttää tekstin. Nimien ääntäminen riippuu puhesynteesistä.

## Kysymykset ja lähteet

Aktiivisesta yleispankista on poistettu alkuperäiset lasten perustietokysymykset, yksinkertaiset englannin sanat, eläinluokittelut ja 180 peruslaskun muunnelmaa. Tilalla on 144 toimitettua kysymystä: musiikki, urheilu, sodat ja historia, 2000-luku, sarjat, elokuvat ja drinkit. Lisäksi säilyvät valikoidut kirjallisuus-, tiede- ja maantietokysymykset. Kategoriakapteeni käyttää samoja aiheita. Tavoite on Buzzin kaltainen pääosin keskivaikea sekoitus, muutama helpompi ja haastavampi kysymys. Taidetta arvotaan kuvakierroksella enintään yksi kysymys per peli.

Lähdeviitteitä uusille aiheille: [IBA:n drinkit](https://iba-world.com/cocktails/), [Metallican levyt](https://www.metallica.com/releases/albums/), [Nightwishin historia](https://www.nightwish.com/band), [Grammy-palkinnot](https://www.grammy.com/awards/), [Oscar-arkisto](https://www.oscars.org/oscars/ceremonies/2024), [F1-kausi 2007](https://www.formula1.com/en/results/2007/drivers), [NATOn historia](https://www.nato.int/en/about-us/nato-history/a-short-history-of-nato), [NASA Curiosity](https://science.nasa.gov/mission/msl-curiosity/).

Urheilulähteet: [NHL Records](https://records.nhl.com/awards/stanley-cup/did-), [IIHF](https://www.iihf.com/en/medalists), [Barcelona 2023/24](https://www.fcbarcelona.com/en/football/first-team/news/3599643/fc-barcelonas-new-captains-confirmed), [Barcelona 2024/25](https://www.fcbarcelona.com/en/news/4092240/new-first-team-captains-confirmed/amp). Wikimedia Commonsin taideteosten tiedostokohtaiset lähteet ja PD-Art-lisenssit ovat public/assets/quiz/sources.json-tiedostossa. Liput ja kentät ovat pelin omaa SVG-kuvitusta.

Kysymyshistoria .tipzy-history.json sisältää tunnisteita. Arvonta suosii uusia kysymyksiä ja tunnistettuja kysymysperheitä; loppuneita käytetään uudelleen. Huoneet ja pankit ovat muistissa: palvelimen uudelleenkäynnistys lopettaa pelit. Juontajan yhteyskatko pysäyttää pelin; pelaaja voi palata samalla selaimella. Finaalin vastaamatta jäänyt kysymys menettää pisteitä myös yhteyden katkettua.

## Kehitys

### Kysymysten paikallinen Noora-ääni

Uudet puuttuvat kysymysäänitteet tehdään mallilla Finnish-NLP/Chatterbox-Finnish (checkpoint best_finnish_multilingual_cp986) käyttäen hyväksyttyä Nooran referenssiä. Aiemmat Jessica-äänitteet säilytetään. Generointi tehdään etukäteen paikallisesti RTX-näytönohjaimella; pelin aikana käytetään valmiita MP3-tiedostoja.

Nykyisen koneen asennuksella: ensin `node scripts/plan-finnish-question-bank.mjs`, sitten `.venv-chatterbox/Scripts/python.exe scripts/generate-finnish-question-bank.py`. Aja vain yksi generointiprosessi kerrallaan. Ajo jatkaa puuttuvista tiedostoista ja päivittää manifestin kymmenen äänitteen välein. Tilanne löytyy tiedostosta `scripts/finnish-question-progress.json`. Valmiit tiedostot ovat hakemistossa `public/audio/noora-finnish-questions`. Päivitä pelisivu saadaksesi uuden puhetoiston käyttöön; generoinnin vuoksi palvelinta ei tarvitse käynnistää uudelleen.

Mallin lähde ja MIT-lisenssi: https://huggingface.co/Finnish-NLP/Chatterbox-Finnish. Mallit ja Python-ympäristö ovat paikallisia, Gitin ulkopuolella olevia riippuvuuksia.

Puhe: node scripts/audio-manifest.mjs ja .venv/Scripts/python.exe scripts/generate-quiz-audio.py (edge-tts). Raidat: public/audio/voice-v2. Nimirepliikit: quiz-voice.mjs. Uusi taustamusiikki: scripts/compose-show-music.py (NumPy). Trumpetin sävellys: scripts/compose-music.py; WAV-masterit muunnetaan MP3:ksi FFmpegillä. Taidekuvat: scripts/fetch-quiz-art.py. Hahmon alkuperäinen generointikehote: public/assets/README.md. Vanha Jorma-prototyyppi: npm run start:jorma, kun portti 3000 on vapaa.

Tipsyn luonnolliset juonnot: .venv/Scripts/python.exe scripts/generate-natural-host.py, sitten node scripts/audio-manifest.mjs. Generointi käyttää kirjautuneen PixVerse-tilin krediittejä, säilyttää valmiit raidat ja rajoittaa yhden ajon kulutusta. Uudet tulokset ja lähdetekstit tallentuvat raitojen viereen.

## Kuunneltava musiikkivisa

Valmiissa pankissa on 41 tunnettua äänitettä ja 93 kysymystä: kappaleen nimi, yhtye, laulaja tai säveltäjä sekä elokuva tai sarja. Suomalaisia ja kansainvälisiä hittejä sekä LOTR-, Hobitti-, Harry Potter- ja Star Wars -musiikkia. Samasta äänitteestä arvotaan enintään yksi kysymys yhden pelin aikana. Valitse alusta **Musiikkikokeilu** neljälle näytteelle, tai pelaa kierros osana koko visaa.

Näyte soi vain yhteisellä pelinäytöllä enintään 15 sekuntia. Musiikkikysymyksen vastausaika on vähintään 30 sekuntia. Taustamusiikki vaimenee näytteen ajaksi. Kuuntele-painikkeella voi käynnistää näytteen uudelleen; puuttuvan näytteen voi ohittaa pisteitä menettämättä.

Lähde: Deezerin julkisen rajapinnan esittelynäytteet. Peli hakee voimassa olevan suoratoisto-osoitteen kappaletunnisteella; äänitteitä ei ladata tai tallenneta projektin tiedostoiksi. Verkkoyhteys tarvitaan ja alueellinen saatavuus voi muuttua. Rajapinnan ehdot: https://cdn-content.dzcdn.net/pdf/CGU-developers.pdf. Tämä paikallinen yksityinen prototyyppi ei sisällä kaupallista tai julkista musiikkilisenssiä.

Toimitettu valinta: scripts/music-catalog.mjs. Lähdeluettelo: scripts/music-sources.json. Pankki: .tipzy-music.json. Päivitys: node scripts/fetch-music-catalog.mjs, node scripts/audio-manifest.mjs ja puheluennan generointi.

## Satunnaiset hahmot ja eleet

Palvelin arpoo liittyessä yhden 20 erilaisesta Tipsyn tyyliin tehdystä aikuisesta sarjakuvahahmosta. Hahmoilla ei ole valmiita nimiä: näkyvä nimi on pelaajan oma nimimerkki. Jokainen hahmo esiintyy huoneessa vain kerran, myös yhteyskatkon aikana varaus säilyy. Tunnisteella palaava pelaaja saa saman hahmon. Odotushuoneesta poistettu pelaaja vapauttaa hahmon. Hahmoa ei voi valita tai vaihtaa asiakkaan viestillä.

Kummassakin kuva-atlaksessa on kymmenen hahmoriviä ja neljä elettä: perusilme, voitto/nauru, kieli ja keskisormi sekä tappio/facepalm. Puhelimen elepainikkeet ja vastauksen tulos vaihtavat hahmon kuvan ja liikkeen. Hahmoilla on eri rytmit ja kallistukset. Tuotantokehote ja lähde: public/assets/README.md.

Tipsy juo pullosta juomatauon henkilökohtaisten kuulutusten jälkeen: oma repliikki, 3,2 sekunnin synteettinen lorina ja juomis-/suunpyyhkimisanimaatio. Hiljaisissa välikohdissa voi noin minuutin välein tulla juominen tai horjahdus ja kaatuminen. Kysymyksissä ja musiikkinäytteen aikana satunnaisia pullotemppuja ei aloiteta. Tauko ja mykistys pysäyttävät lorinan. Juomataukoihin on lisätty kahdeksan käyttäjän antamaa letkautusta; Tipsyn valmiit repliikit tuotetaan samalla alkuperäisellä Oxley-äänellä (PixVerse / Eleven v3). Nimikuulutukset ja nimellä alkavat putoamisrepliikit tuotetaan tällä äänellä tarvittaessa ja tallennetaan uudelleenkäyttöä varten. Puhekulut syntyvät uusien tallenteiden tuotannosta, eivät valmiiden tiedostojen toistamisesta.

## Enintään 20 pelaajaa

MAX_PLAYERS on yhteinen vakio tiedostossa public/quiz-config.js; palvelin rajoittaa liittymisen ja käyttöliittymä näyttää saman määrän. Jokaisella pelaajalla on oma tunniste, pankki ja hörppylaskuri. Vastauksia käsittelee palvelin, ja saman kysymyksen toinen vastaus hylätään. Hahmoja on 20, ja jokainen saa yksilöllisen satunnaisen hahmon. Yli neljän pelaajan tulostaulu tiivistyy, yli 12 pelaajalla TV-näkymä käyttää kymmentä saraketta. Nimirepliikkejä valmistellaan enintään kolme kerrallaan ja toistetaan yksi kerrallaan. Fyysistä 20 puhelimen Wi-Fi-kuormituskokeilua ei ole tehty.

Piirakkasodan tähtäimen vaihtonopeus mukautuu kohteiden määrään: myös 19 vastustajaa ehtivät kiertää kahdesti 12 sekunnin heittoajan aikana.

## Nooran ja Tipsyn aakkosvitsi

Tervetulojuonnon jälkeen toistetaan kuusi vuorosanaa järjestyksessä. Noora käyttää tässä keskustelussa Jessica – Playful, Bright, Warm -ääntä (Eleven v3, suomi). Tipsyn keskusteluääni on sama alkuperäinen Oxley kuin muussa pelissä. Väliaikainen Brian-ääni on poistettu keskustelun aktiivisesta käytöstä. Äänivalinnat ovat duet-voices.json-tiedostossa, jotta keskustelun Tipsy voidaan myöhemmin vaihtaa erikseen.

Vitsin lasku on 20 + U R A Q T + D = 26. Vuorot odottavat edellisen äänitteen loppumista. Keskeytynyt keskustelu ei tallennu kuulluksi. Mykistys tai siirtyminen toiseen vaiheeseen keskeyttää jonon. Tervetulojuonnon voi toistaa odotushuoneen painikkeella.

Tallenteiden tuotanto: node scripts/generate-duet-eleven.mjs. Se käyttää paikallisen .env-tiedoston avainta ja ohittaa valmiit tallenteet. Keskustelun aktivointi: node scripts/activate-duet.mjs. Aktivointi vaatii kaikki kuusi tallennetta, päivittää manifestin kerralla ja säilyttää kysymysäänet. Koko uuden Noora-kysymyspankin tuotanto on erillinen työ.

## Tipsyn koko puhepankin täydentäminen

`node scripts/complete-tipsy-voices.mjs` tuottaa puuttuvat Tipsy-tallenteet kahdella työntekijällä käyttäen alkuperäistä PixVerse Eleven v3 / Oxley -ääntä, vakautta 0.5 ja nopeutta 1. Valmiit MP3-tiedostot käytetään uudelleen. Tulokset ja tehtävätunnisteet säilytetään jokaisen MP3:n vieressä. Epäselvää aiempaa tuotantoyritystä ei lähetetä automaattisesti uudestaan. Valmiit juontoraidat julkaistaan yhdessä, kysymysten nykyisiä lukijaraitoja säilyttäen. Keskustelun aktivointi tehdään lopuksi `node scripts/activate-duet.mjs` -komennolla.

## Korjaukset 8.10.2026

- Juomatauko on aina 15 sekuntia pelaajamäärästä riippumatta, ja jatkuu automaattisesti.
- Aiheet arvotaan kaikkien 15 aiheen joukosta yleisissä kierroksissa ja finaalissa. Kategoriakapteeni valitsee kaikista 15 aiheesta. Formaattikierrokset (kuva, järjestys, maailmanmatkaaja, musiikkinäytteet) käyttävät omaa tehtäväpankkiaan. Pelin aiheille ei ole kiinteää kysymyskiintiötä.
- Aiheet: maantieto, musiikki, elokuvat ja sarjat, historia, urheilu, juomat, eläimet, ruuat, lapset ja nuoret. Aihevalinta vaihtaa tulevia kysymyskortteja keskenään, jotta määrät säilyvät.
- Palvelin määrää vaiheiden aikarajat. Äänitoisto ja verkkopyynnöt eivät voi varata vastausvaihetta rajattomasti. Juontajan Seuraava kysymys -varmistuspainike ohittaa nykyisen tilanteen; ratkaisematon kysymys ei siinä anna tai vie pisteitä.
- Piirakan tähtäin kiertää 340 ms välein kaikkien pelaajien, myös heittäjän, kasvoilla. Osuma muuhun: heittäjä +3 ja kohde enintään −3. Osuma itseensä: enintään −3, ei palkintoa. Pankki ei mene miinukselle.
- Avataräänessä on WebAudio-toiston lisäksi HTML-audiovara ja rajatut lataus- ja toistoajat. Puhelimen selaimen vaatima äänen aktivointi näkyy painikkeena.
- Nooran nykyinen keskusteluääni: ElevenLabs Jessica / Eleven v3. Kysymysäänen vaihtoa ei aktivoida ennen käyttäjän valintaa; maksuttomat Emma- ja Ava-monilingual-näytteet ovat public/audio/voice-previews/. Krediittejä ei käytetty näytteisiin.

Käyttäjä hyväksyi 8.10.2026 nykyisen ElevenLabs-ilmaiskiintiön käytön alkuperäiseen Jessica-ääneen. scripts/generate-noora-question-bank.mjs tekee 161 uutta ääntä, suunniteltu teksti 8 263 merkkiä (kiintiö 8 270). Äänitiedostot deduplikoidaan tekstin perusteella. Kysymyslukija käyttää näitä välimuistista eikä tee pelin aikana maksullisia pyyntöjä. Vielä puuttuvat kysymykset käyttävät aiempaa lukijaa, kunnes käyttäjän toisen tilin kiintiöstä tehdään loput. Emma/Ava-näytteitä ei valittu.

Toisella tilillä luotu 226 Noora-äänitettä lisää (9 987 tekstimerkkiä). 475/533 kysymyskortista on nyt Jessica-äänite. Jäljellä 58 erillistä tekstiä, yhteensä 2 915 merkkiä. Saldon viive huomioidaan paikallisessa krediittivarauslokissa scripts/noora-question-ledger.json; API-avainta ei tallenneta lokiin.

## Kysymyspankki 8.10.2026

- 15 aihetta × 170 korttia = 2 550 kysymystä. Alkuperäiset 533 korttia säilyvät, uusia kortteja 2 017.
- `quiz-expanded.json`: laajennuksen kortit, vastausten indeksi, lähde, lisenssi ja alkuperäinen englanninkielinen teksti.
- Lähteet: Open Trivia DB (PIXELTAIL GAMES LLC ja tekijät, jbaranskin aineistovedos 27.12.2024) sekä OpenTriviaQA (uberspot ja tekijät). Lähdeaineistot ja suomennetut muunnelmat CC BY-SA 4.0. Pelissä `/question-credits.html` näyttää attribuution. Lähteiden raakavedokset ja lisenssi: `scripts/question-sources/`.
- 62 lähdekysymystä korvattu toimitetuilla suomalaisilla korteilla: epäselviä terveysväitteitä, puuttuva tekstikatkelma tai väärä aiheluokitus. Käännösten nimiä ja termejä korjattu. Jokaisen 2 017 uuden kortin faktoja ei ole tarkistettu erikseen ensisijaisesta lähteestä.
- Uudet kysymykset ovat paikallisia JSON-kortteja: pelaaminen ei tarvitse ulkoista trivia- tai käännöspalvelua.
- Rakennus: `select-question-expansion.py` → `translate-question-expansion.py` → `publish-question-expansion.mjs`. Käännökset välimuistissa, ei automaattista käännöstä pelattaessa.
- Uuden ElevenLabs-tilin 10 000 krediitistä varattu 2 915 vanhojen puuttuvien 58 äänitteen täydentämiseen ja 7 083 uuden 110 kysymyksen lukemiseen, yhteensä 9 998. Vanhoja valmiita ääniä ei generoida uudelleen. Jessica / Eleven v3 jatkuu Nooran äänenä; Tipsy pysyy ennallaan.
Valmiina uuden tilin erän jälkeen: 643/2 550 kysymyskorttia Nooran Jessica-äänellä. Puuttuu 1 907 korttia.

Seuraava 10 000 krediitin erä: 140 uutta Jessica / Eleven v3 -äänitettä, 9 998 merkkiä. Nooran alkuperäinen ääni säilytetty. Nyt 783/2 550 korttia äänitetty, 1 767 korttia puuttuu. Vanhoja äänitteitä ei generoitu uudelleen.

## Järjestysvastauksen näyttäminen

Järjestyskierroksen tuloksissa näkyvät erikseen palvelimelle lukittu oma järjestys ja oikea järjestys. Korttien värit kertovat, osuiko oman vastauksen sijainti kohdalleen. Hylätystä lukituspyynnöstä tulee ilmoitus; pelkkä korttien valitseminen ei lukitse vastausta. Kysymysten vastausjärjestys tallennetaan erillisenä vastausavaimena, joka muunnetaan korttien arvottuihin paikkoihin.

Puhelin lähettää järjestysvastauksessa valitut kortit nimineen. Palvelin vertaa koko ketjua alkuperäiseen oikeaan korttiketjuun, ja pisteytys tarkistaa vastauksen uudelleen ennen pankin muuttamista. Vanhojen asiakkaiden numeromuotoiset vastaukset hyväksytään myös.

## Television ja koko näytön asettelu

Pelinäkymä sovitetaan automaattisesti selaimen käytettävissä olevaan leveyteen ja korkeuteen. Pelin ohjauspainikkeet ovat erillisessä alareunan palkissa. Kysymykset, kuvat, pelaajakortit, aiheen valinta, tulokset ja juomatauot käyttävät tiiviimpää asettelua; jäljelle jäävä sisältö sovitetaan mittauksen perusteella. Sovitus päivittyy koon vaihtuessa, koko näytön tilaan siirryttäessä ja sisällön muuttuessa. Puhelimen liittymis- ja ohjainnäkymä käyttää omaa asetteluaan. Hyvin pienellä näytöllä suuret pelaajamäärät ja pitkät tekstit pienentävät fonttia, jotta sisältö mahtuu näkyviin. Päivitä pelinäyttö kerran saadaksesi uuden asettelun käyttöön.
