export const topics=['Maantieto','Musiikki','Elokuvat ja sarjat','Historia','Urheilu','Juomat','Eläimet','Ruuat','Lapset ja nuoret','2000-luku','Kirjat','Luonnontiede','Pelit','Tekniikka','Taide'];
export function topicOf(q){const aliases={'Sodat ja historia':'Historia','Sarjat':'Elokuvat ja sarjat','Elokuvat':'Elokuvat ja sarjat','Viihde':'Elokuvat ja sarjat','Drinkit':'Juomat','Liput':'Maantieto'};return aliases[q.category]||q.category;}
export const extraTopics=[];
function add(category,rows){rows.forEach(([prompt,answer,...wrong],i)=>extraTopics.push({id:`balanced-${category==='Eläimet'?'animal':category==='Ruuat'?'food':'youth'}-${i}`,family:`balanced-${category}-${i}`,category,prompt,options:[answer,...wrong],correct:0,explanation:`Oikea vastaus: ${answer}.`,difficulty:'medium'}));}
add('Eläimet',[
 ['Mikä näistä nisäkkäistä munii?','Vesinokkaeläin','Vyötiäinen','Muurahaiskarhu','Pangoliini'],
 ['Mikä on sarvivalaan pitkän ”sarven” anatominen alkuperä?','Hammas','Otsaluun uloke','Keratiininen sarvi','Nenärusto'],
 ['Kuinka monta sydäntä mustekalalla on?','Kolme','Yksi','Kaksi','Neljä'],
 ['Mikä näistä kuuluu valaisiin eikä kaloihin?','Miekkavalas','Valashai','Jättiläishai','Mantarausku'],
 ['Minkä eläimen lähin elävä sukulaisryhmä ovat virtahevot?','Valaiden','Norsujen','Sarvikuonojen','Hevosten'],
 ['Mitä eläinryhmää aksolotli edustaa?','Sammakkoeläimiä','Matelijoita','Kaloja','Äyriäisiä'],
 ['Millä näistä on sinistä hemolymfaa kuparia sisältävän hemosyaniinin vuoksi?','Hevosenkenkäravulla','Merinorsulla','Pingviinillä','Delfiinillä'],
 ['Mikä näistä on pussieläin?','Vompatti','Murmeli','Kapibara','Majava'],
 ['Mikä on gepardin suku tieteellisessä luokittelussa?','Acinonyx','Panthera','Lynx','Felis'],
 ['Mihin eläinryhmään merivuokko kuuluu?','Polttiaiseläimiin','Nilviäisiin','Piikkinahkaisiin','Äyriäisiin'],
 ['Mikä näistä on maailman suurin nykyisin elävä jyrsijä?','Kapibara','Majava','Piikkisika','Nutria'],
 ['Mikä näistä eläimistä on matelija?','Vaskitsa','Salamanteri','Vesilisko','Aksolotli'],
 ['Mikä elin tuottaa hämähäkin seittilangan?','Kehruurauhaset','Sylkirauhaset','Myrkkyrauhaset','Etujalkojen rauhaset'],
 ['Millä linnulla on soidinmenoissa levitettävä suuri pyrstöviuhka, jossa on silmätäpliä?','Riikinkukolla','Metsoilla','Fasaaneilla','Kurkilla'],
 ['Mikä näistä ei ole karhulaji?','Pikkupanda','Jääkarhu','Huulikarhu','Malaijikarhu'],
 ['Mikä näistä kuuluu piikkinahkaisiin?','Merimakkara','Merietana','Merivuokko','Merikrotti'],
 ['Mikä eläin tunnetaan kyvystään kasvattaa katkennut raaja takaisin?','Aksolotli','Kameleontti','Vesinokkaeläin','Siili'],
 ['Mikä näistä on hyönteinen eikä hämähäkkieläin?','Rukoilijasirkka','Skorpioni','Punkki','Lukki'],
 ['Mikä nisäkäs käyttää kaikua paikantaakseen saaliin veden alla?','Delfiini','Hylje','Merisaukko','Manaatti'],
 ['Mikä näistä on Afrikassa elävä koiraeläin?','Hyeenakoira','Täplähyeena','Servaali','Karakaali']
]);
add('Ruuat',[
 ['Mistä klassisen misotahnan pääraaka-aine tavallisesti saadaan?','Soijapavuista','Maissista','Linsseistä','Maapähkinöistä'],
 ['Mikä riisilajike sopii perinteisesti risottoon?','Arborio','Basmati','Jasmiini','Villiriisi'],
 ['Mikä juusto kuuluu perinteiseen kreikkalaiseen salaattiin?','Feta','Halloumi','Manchego','Pecorino'],
 ['Mitä bulgur on?','Esikypsennettyä ja rouhittua vehnää','Paahdettua ohraa','Kuivattua kikhernettä','Jauhettua tattaria'],
 ['Mikä näistä kuuluu perinteisen peston pääraaka-aineisiin?','Basilika','Korianteri','Minttu','Rakuuna'],
 ['Mikä on tahinin pääraaka-aine?','Seesaminsiemenet','Auringonkukansiemenet','Kurpitsansiemenet','Mantelit'],
 ['Mitä cevichessä käytetään kalan kypsymistä muistuttavaan käsittelyyn?','Sitrusmehua','Kuumaöljyä','Höyryä','Suolavettä ilman happoa'],
 ['Mikä näistä on fermentoitu korealainen vihannesruoka?','Kimchi','Gyoza','Tempura','Pho'],
 ['Mistä polenta valmistetaan?','Maissista','Tattarista','Ohrasta','Hirssistä'],
 ['Mikä on hollandaise-kastikkeen rasva?','Voi','Oliiviöljy','Kookosrasva','Ankanrasva'],
 ['Mikä näistä juustoista valmistetaan perinteisesti lampaanmaidosta?','Pecorino Romano','Emmental','Gouda','Cheddar'],
 ['Minkä kasvin osa sahramimauste on?','Kukan luotti','Juuri','Siemen','Kuori'],
 ['Mikä on falafelin yleinen pääraaka-aine?','Kikherne','Peruna','Maissi','Naudanliha'],
 ['Mihin ruokalajiin nori yleisesti liittyy?','Sushiin','Risottoon','Paellaan','Gulassiin'],
 ['Mikä on briossin tyypillinen ominaisuus tavalliseen leipään verrattuna?','Taikinassa on runsaasti voita ja kananmunaa','Se tehdään ilman hiivaa','Se tehdään vain ruisjauhosta','Se kypsennetään keittämällä'],
 ['Mikä pippurikasvin osa mustapippuri on?','Kuivattu hedelmä','Siemenkotelo ilman hedelmää','Kuivattu juuri','Kukan nuppu'],
 ['Mitä sous vide -kypsennyksessä hallitaan erityisen tarkasti?','Vesihauteen lämpötilaa','Avotulen kokoa','Paistinpannun savua','Höyrykattilan painetta'],
 ['Mikä näistä on ranskalainen sipulipiiras?','Pissaladière','Tarte tatin','Clafoutis','Mille-feuille'],
 ['Mikä on gazpachon tarjoilulämpötila perinteisesti?','Kylmä','Kiehuva','Kuuma','Aina huoneenlämpöinen'],
 ['Mikä on perinteisen hummuksen pääraaka-aine?','Kikherne','Linssi','Valkoinen papu','Herne']
]);

add('Lapset ja nuoret',[
 ['Kuka kirjoitti Goosebumps-kauhukirjasarjan?','R. L. Stine','Jeff Kinney','Rick Riordan','Eoin Colfer'],
 ['Kuka kirjoitti Neropatin päiväkirja -kirjasarjan?','Jeff Kinney','R. L. Stine','John Green','David Walliams'],
 ['Minkä kirjailijan teos on Artemis Fowl?','Eoin Colfer','Rick Riordan','Philip Pullman','Anthony Horowitz'],
 ['Kenen nuortenromaani on Tähtiin kirjoitettu virhe?','John Green','Suzanne Collins','Veronica Roth','Stephenie Meyer'],
 ['Kuka kirjoitti Nälkäpeli-kirjatrilogian?','Suzanne Collins','Veronica Roth','Cassandra Clare','Stephenie Meyer'],
 ['Minkä kirjailijan nuortenkirjasarja on Divergent eli Outolintu?','Veronica Roth','Suzanne Collins','Lois Lowry','Meg Cabot'],
 ['Mikä Astrid Lindgrenin hahmo asuu Huvikummussa?','Peppi Pitkätossu','Ronja Ryövärintytär','Vaahteramäen Eemeli','Katto-Kassinen'],
 ['Mikä on Ronja Ryövärintyttären isän nimi?','Matias','Borka','Joonatan','Kalle'],
 ['Mihin mytologiaan Percy Jackson -kirjasarja erityisesti perustuu?','Kreikkalaiseen','Egyptiläiseen','Japanilaiseen','Kelttiläiseen'],
 ['Kenen kirjassa veljekset Joonatan ja Korppu seikkailevat Nangijalassa?','Astrid Lindgrenin','Tove Janssonin','Roald Dahlin','C. S. Lewisin'],
 ['Kuka kirjoitti Matilda-kirjan?','Roald Dahl','David Walliams','Astrid Lindgren','J. K. Rowling'],
 ['Minkä kirjasarjan tekijä käyttää nimeä Lemony Snicket?','Surkeiden sattumusten sarja','Goosebumps','Neropatin päiväkirja','Artemis Fowl'],
 ['Mihin englannin sanaan nuorten käyttämä slangisana rizz pohjautuu?','Charisma','Risk','Rhythm','Rich'],
 ['Mikä sana valittiin Oxford University Pressin vuoden sanaksi vuonna 2023?','Rizz','Sus','Slay','Yeet'],
 ['Mikä yhtiö julkaisee Pokémonin varsinaisia pääsarjan pelejä?','Nintendo','Sony','Sega','Ubisoft'],
 ['Mikä oli Minecraftin alkuperäisen kehittäjän Markus Perssonin tunnettu nimimerkki?','Notch','Jeb','Ninja','Dream'],
 ['Minkä käsitteen lyhenne on FOMO?','Fear of missing out','Friends on my online','First one moves on','Follow only main opinions'],
 ['Mitä metakognitiolla tarkoitetaan oppimisessa?','Oman ajattelun ja oppimisen tiedostamista','Pelkästään ulkoa muistamista','Nopeasti lukemista','Oppimista vain ryhmässä'],
 ['Mitä sanalla pelillistäminen tarkoitetaan opetuksessa?','Pelien elementtien käyttöä oppimisen tukena','Kaiken opetuksen korvaamista videopeleillä','Pelkästään urheilutunteja','Kokeiden poistamista kokonaan'],
 ['Mitä tarkoittaa nuorten verkkokeskusteluissa usein käytetty POV?','Point of view','Play on video','Power of voice','Private online version']
]);
