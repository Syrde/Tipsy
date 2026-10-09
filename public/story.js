export const chapters = [
  {
    title: 'Makkara ei odota', place: 'Metsästäjien nuotio', game: 'runner',
    text: 'Jorma herää sammalesta. Suussa maistuu eilinen ja taskussa on syntymäpäiväkortti: ”Aamiainen sänkyyn. Lupaan.” Savu johdattaa nuotiolle. Metsästäjä katsoo Jormaa päästä varpaisiin, heiluttaa makkaraa nenän edessä ja heittää sen alamäkeen. ”Aamupala karkaa, mestari.”',
    choices: [
      { id: 'sausage', label: 'Makkaran perään', note: 'Estehyppely. Ruoka auttaa myöhemmin, mutta rinne ei anna armoa.', game: 'runner' },
      { id: 'fight', label: 'Haasta metsästäjä', note: 'Väistö ja vastaisku. Voitto tuo kiväärin, mutta kaverit muistavat kasvosi.', game: 'duel' }
    ],
    brief: 'Makkara vierii alamäkeen. Hyppää kivien ja kantojen yli ja pysy kyydissä 30 sekuntia. Neljä kaatumista päättää jahdin.',
    win: 'Jorma pitelee palkintoaan kuin olympiamitalia. ”Aamiaisen ensimmäinen komponentti hankittu.”',
    lose: 'Jorma kierii ojaan. Makkara katoaa. Metsästäjä huutaa ylhäältä: ”Kahvi on vielä keittämättä!”'
  },
  {
    title: 'Nälkä ei tähtää puolestasi', place: 'Metsäaukio', game: 'aim',
    text: 'Aukiolla liikkuu peura. Toiseen puuhun on ripustettu metsästäjien eväspussi. Jorma muistaa lupaamansa juhla-aamiaisen ja päättää, että proteiinilla ei ole väliä, kunhan se tulee nopeasti.',
    choices: [
      { id: 'deer', label: 'Yritä metsästää peura', note: 'Liikkuva kohde. Kiväärillä 3 osumaa, ritsalla 6.', game: 'aim' },
      { id: 'bag', label: 'Pudota eväspussi puusta', note: 'Pienempi, tuulessa heiluva kohde. 4 osumaa.', game: 'aim' }
    ],
    brief: 'Liikuta tähtäintä nuolilla tai puhelimen tähtäysalueella. Ammu TOIMI-painikkeella. Laukauksia on rajallisesti. Sarjakuvamainen arcade-haaste.',
    win: 'Jormalla on viimein ruokaa. ”Tästä saa ainakin alkupalan. Ehkä myös kakun, jos ei kysytä liikaa.”',
    lose: 'Kohde katoaa metsään. Jorma katsoo tyhjää kättään ja kutsuu sitä paasto-aamiaiseksi.'
  },
  {
    title: 'Kuorsaus on liikennevalo', place: 'Villisian valtakunta', game: 'stealth',
    text: 'Polku kulkee nukkuvan villisian ohi. Sen vieressä on juhla-aamiaiseen täydellisesti sopiva eväskori. Jorma on varma, että kori kuuluu jollekulle. Hän ei vain aio selvittää kenelle juuri nyt.',
    choices: [
      { id: 'safe', label: 'Hiivi polkua pitkin', note: 'Lyhyempi reitti. Älä koske eväisiin.', game: 'stealth' },
      { id: 'basket', label: 'Koukkaa eväskorille', note: 'Pidempään kuorsauksen varassa. Palkintona juhla-aamiainen.', game: 'stealth' }
    ],
    brief: 'Pidä OIKEA-painiketta pohjassa vain, kun sika kuorsaa. Pysähdy korvien noustessa. Kolme herätystä ja Jorma joutuu juoksemaan ilman takkia.',
    win: 'Jorma pääsee ohi. Sika jatkaa uniaan, joissa ei ilmeisesti ole yhtään Jormaa.',
    lose: 'Sika herää. Jorma pakenee, takki jää aidalle ja metsästä kuuluu pitkään erittäin loukkaantunutta röhkinää.'
  },
  {
    title: 'Oikotie on aina märkä', place: 'Suon reuna', game: 'bridge',
    text: 'Tielle olisi enää yksi suo. Jorma löytää lautoja ja arvioi niiden kantavuuden samalla tarkkuudella kuin eilisen viimeisen kierroksen tarpeellisuuden. Nyt suunnitelma tehdään ennen ensimmäistä askelta.',
    choices: [
      { id: 'safe', label: 'Rakenna kiertoreitti', note: 'Kolme lyhyttä aukkoa. Helpompi laudankäyttö.', game: 'bridge' },
      { id: 'shortcut', label: 'Suoraan suon yli', note: 'Vaikeampi lautojen jako. Nopeampi kotiin, jos onnistut.', game: 'bridge' }
    ],
    brief: 'Valitse lauta VASEN/OIKEA-painikkeilla, aseta TOIMI-painikkeella. Täytä aukot täsmälleen. PERU palauttaa viimeisen laudan. VALMIS testaa sillan.',
    win: 'Silta kestää. Jorma kumartaa tyhjälle suolle. ”Rakennusvalvonta hyväksyi.”',
    lose: 'Jorma painuu vyötäröään myöten suohon. Hän pyytää pelastuspartiota ottamaan kuvan paremmalta puolelta.'
  },
  {
    title: 'Puoliso tietää jo', place: 'Puhelu kotipihasta', game: 'call',
    text: 'Puhelin soi. Kotona odottavat puoliso, syntymäpäiväaamiainen ja yllätysesiintyjä, jonka Jorma tilasi eilen. ”Hän on soittanut harmonikkaa kahdeksasta asti. Missä sinä olet?” Selityksen täytyy sopia siihen, mitä oikeasti tapahtui.',
    choices: [
      { id: 'honest', label: 'Kerro tilanne suoraan', note: 'Pitempi vastausaika. Kyydin saaminen on tärkeämpää kuin maine.', game: 'call' },
      { id: 'bluff', label: 'Väitä kaiken olevan suunnitelma', note: 'Lyhyempi vastausaika. Onnistumalla pelastat yllätyksen.', game: 'call' }
    ],
    brief: 'Vastaa neljään kysymykseen aiemman tarinasi perusteella. Valitse 1, 2 tai 3. Kolme johdonmukaista vastausta tuo kyydin. Kello käy jokaisessa vastauksessa.',
    win: 'Puoliso huokaisee ja lähettää kyydin. Taustalla harmonikka vaihtaa voitonmarssiin.',
    lose: '”Tiedätkö mitä? Harmonikkamies osaa tehdä munakkaan.” Puhelu katkeaa. Jorman on hankittava viimeinen kyyti itse.'
  },
  {
    title: 'Viimeinen vihreä', place: 'Kylän risteys', game: 'traffic',
    text: 'Kyyti löytyy, mutta risteyksen valot ovat rikki. Baarimikko ohjeistaa puhelimessa: ”Minä hoidan poikittaisen liikenteen. Sinä päästät omat läpi. Älä päästä niitä samaan aikaan.” Baarille pitää saada neljä autoa.',
    choices: [
      { id: 'patient', label: 'Varmista jokainen väli', note: 'Tavallinen liikenne. Maltti vie perille.', game: 'traffic' },
      { id: 'rush', label: 'Ota nopea aalto', note: 'Nopeammat autot, pienemmät välit. Tiukka ajoitus.', game: 'traffic' }
    ],
    brief: 'TOIMI vaihtaa punaisen ja vihreän. Päästä neljä autoa läpi poikittaisen liikenteen väleistä. Kolme vaaratilannetta sulkee risteyksen. Peli estää törmäykset.',
    win: 'Kyydit pääsevät baarille. Baarimikko taputtaa: ”Ensimmäinen järkevä kierros koko yönä.”',
    lose: 'Risteys suljetaan. Jorma vaihtaa kyytiä ja saapuu baarille postikärryjen kyydissä.'
  },
  {
    title: 'Alibistudio', place: 'Baarin takahuone', game: 'studio',
    text: 'Baarimikko tarjoaa viimeistä palvelustaan: videopuhelu, jossa Jorma näyttää aamiaisvalmistelujen sankarilta. Kamera, valo ja taustakulissi liikkuvat yhtä aikaa. Yksi huono säätö paljastaa pullokorit.',
    choices: [
      { id: 'kitchen', label: 'Lavasta keittiö', note: 'Tuttu tausta. Tarkka valo ja kamerakulma.', game: 'studio' },
      { id: 'garden', label: 'Lavasta puutarhajuhla', note: 'Väljempi kuva. Taustan on pysyttävä oikeana.', game: 'studio' }
    ],
    brief: 'VASEN/OIKEA säätää kameraa, YLÖS/ALAS valoa, TOIMI vaihtaa taustaa. Pidä kaikki kolme mittaria tavoitealueella yhteensä 8 sekuntia.',
    win: 'Kotona kuuluu: ”No johan näyttää hienolta!” Baarimikko nostaa peukun kameran ulkopuolella.',
    lose: 'Tausta putoaa. Pullokorit näkyvät. Puoliso tunnistaa baarimikon ennen kuin Jorma ehtii sanoa mitään.'
  },
  {
    title: 'Aamun domino', place: 'Viimeinen kotimatka', game: 'domino',
    text: 'Avain, aamiainen, lahja ja kotiovi. Kaikki pitäisi hoitaa oikeassa järjestyksessä ennen kuin harmonikkamies ehtii toiseen albumiin. Tämä on Jorman viimeinen mahdollisuus saada aamu kasaan.',
    choices: [
      { id: 'home', label: 'Hoida perusasiat ensin', note: 'Avaimet ja matka ennen yllätyksen viimeistelyä.', game: 'domino' },
      { id: 'grand', label: 'Pelasta koko syntymäpäivä', note: 'Sama järjestyspulma, mutta myös lahja on saatava ajoissa.', game: 'domino' }
    ],
    brief: 'Rakenna neljän tapahtuman ketju. Valitse kortti VASEN/OIKEA, lisää TOIMI, poista PERU. VALMIS käynnistää ketjun. Säännöt näkyvät koko ajan; yksi korjaus sallitaan.',
    win: 'Ovi avautuu. Jorma astuu sisään ja sanoo: ”Aamiaispalvelu.” Harmonikkamies lopettaa ensimmäistä kertaa koko aamuna.',
    lose: 'Avain jäi baariin, aamiainen taksiin ja lahja harmonikkamiehelle. Jorma istuu kotiportaalla ja väittää sen olevan osa yllätystä.'
  }
];

export function getGame(chapter, choice) {
  const scene = chapters[chapter];
  return scene?.choices.find(x => x.id === choice)?.game || scene?.game;
}

export function getEnding(state) {
  if (state.marks >= 3 && state.chapter <= 4) return {
    title: 'Paikallislehden etusivu', bonus: 0,
    text: 'Jorman kotimatka päättyy viranomaisten ja metsästysseuran yhteiseen selvitykseen. Puoliso näkee paikallislehden kuvasta, miksi aamupala jäi tulematta. Harmonikkamies saa kutsun myös ensi vuodeksi.'
  };
  const last = state.results.find(x => x.chapter === 7);
  if (!last?.passed) return { title: 'Aamun ainoa ulkoruokailija', bonus: 80, text: 'Jorma pääsee kotikadulle, mutta päivän suunnitelma leviää. Hän syö portaalla kylmää makkaraa. Sisällä harmonikka soi ja joku muu paistaa munakasta.' };
  const good = state.results.filter(x => x.passed).length >= 6 && state.results.some(x => x.chapter === 4 && x.passed);
  if (good) return { title: 'Syntymäpäivä pelastettu. Melkein.', bonus: 200, text: 'Jorma ehtii sisään aamiaisen kanssa. Puoliso antaa yhden pitkän katseen ja pyytää hänet pöytään. Harmonikkamies lähettää laskun. Sen loppusumma on illan viimeinen yllätys.' };
  return { title: 'Kotona, mutta aamuvuoro jatkuu', bonus: 140, text: 'Jorma pääsee kotiin. Puoliso on jo syönyt ja antaa hänelle esiliinan. Lahjaksi tuli kolmen tunnin harmonikkakeikka ja kahden päivän tiskivuoro.' };
}
