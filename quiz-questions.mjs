// Vastaukset pysyvät palvelimella. Tätä tiedostoa ei tarjoilla selaimeen.
import {extraGeneral,extraWorld,extraOrder,extraImages} from './quiz-extra.mjs';
import {hardOrdering,hardImages} from './quiz-curated.mjs';
import {adultGeneral} from './quiz-adult.mjs';
import {musicQuestions} from './quiz-music-questions.mjs';
import {extraTopics} from './quiz-topics.mjs';
import {readFile} from 'node:fs/promises';
const expandedQuestions=JSON.parse(await readFile(new URL('./quiz-expanded.json',import.meta.url),'utf8'));
const q=(id,prompt,options,correct,explanation,art=null)=>({id,prompt,options,correct,explanation,art});
const order=(id,prompt,items,explanation)=>({id,prompt,items,explanation});
export const general=[
 q('g1','Mikä planeetta tunnetaan punaisena planeettana?',['Venus','Mars','Jupiter','Merkurius'],1,'Marsin pinnan rautaoksidi antaa planeetalle punertavan värin.'),
 q('g2','Mikä näistä on alkuluku?',['21','27','29','33'],2,'29 on jaollinen vain yhdellä ja itsellään.'),
 q('g3','Kuka kirjoitti Seitsemän veljestä?',['Väinö Linna','Aleksis Kivi','Mika Waltari','Eino Leino'],1,'Aleksis Kiven Seitsemän veljestä ilmestyi vuonna 1870.'),
 q('g4','Mitä kemiallinen merkki Au tarkoittaa?',['Hopeaa','Alumiinia','Kultaa','Argonia'],2,'Au tulee kullan latinankielisestä nimestä aurum.'),
 q('g5','Mikä eläin on Muumipeikko?',['Virtahepo','Karhu','Muumihahmo','Sarvikuono'],2,'Muumipeikko on Tove Janssonin luoma muumi, ei virtahepo.'),
 q('g6','Kuinka monta sivua kuusikulmiolla on?',['4','5','6','8'],2,'Kuusikulmiossa on kuusi sivua.'),
 q('g7','Mikä soitin on kielisoitin?',['Oboe','Trumpetti','Viulu','Huilu'],2,'Viulun ääni syntyy kielten värähtelystä.'),
 q('g8','Mikä näistä ei ole nisäkäs?',['Lepakko','Delfiini','Pingviini','Valas'],2,'Pingviini on lintu. Muut vaihtoehdot ovat nisäkkäitä.'),
 q('g9','Mikä on veden kemiallinen kaava?',['CO₂','H₂O','O₂','NaCl'],1,'Vesimolekyylissä on kaksi vetyatomia ja yksi happiatomi.'),
 q('g10','Mikä on shakkilaudan ruutujen määrä?',['49','64','81','100'],1,'Shakkilauta on 8 × 8 ruutua: yhteensä 64.'),
 q('g11','Montako minuuttia on puolessatoista tunnissa?',['75','80','90','100'],2,'Tunti on 60 minuuttia ja puoli tuntia 30: yhteensä 90.'),
 q('g12','Mikä on Kalevalan tunnettu seppä?',['Joukahainen','Lemminkäinen','Ilmarinen','Kullervo'],2,'Seppo Ilmarinen takoo Kalevalassa sammon.'),
 q('g13','Mikä näistä ei ole Suomen lipun väri?',['Sininen','Valkoinen','Punainen','Sininen ja valkoinen'],2,'Suomen lipussa on sininen risti valkoisella pohjalla.'),
 q('g14','Mitä tietokoneen Ctrl+C tavallisesti tekee?',['Kopioi','Liittää','Tallentaa','Tulostaa'],0,'Ctrl+C kopioi valinnan. Ctrl+V liittää sen.'),
 q('g15','Mikä näistä on sienilaji?',['Suppilovahvero','Kataja','Puolukka','Pihlaja'],0,'Suppilovahvero on syötävä sieni; muut ovat kasveja.'),
 q('g16','Mikä on 15 % sadasta?',['10','15','20','25'],1,'Prosentti tarkoittaa sadasosaa: 15 % sadasta on 15.'),
 q('g17','Mikä näistä kulkee tyhjiössä?',['Ääni','Valo','Tuuli','Meren aalto'],1,'Valo on sähkömagneettista säteilyä ja etenee myös tyhjiössä.'),
 q('g18','Mikä pelikortti merkitään tavallisesti A-kirjaimella?',['Ässä','Kakkonen','Kolmonen','Nelonen'],0,'Ässä merkitään tavallisesti A-kirjaimella.'),
 q('g19','Mikä näistä on negatiivinen luku?',['0','−3','½','3'],1,'−3 on pienempi kuin nolla.'),
 q('g20','Mikä vuodenaika seuraa Suomessa syksyä?',['Kevät','Kesä','Talvi','Uusi syksy'],2,'Syksyä seuraa talvi.'),
 q('g21','Mikä urheilulaji käyttää kiekkoa?',['Jääkiekko','Tennis','Koripallo','Golf'],0,'Jääkiekossa peliväline on kiekko.'),
 q('g22','Mikä on mustan ja valkoisen sekoitus maalissa?',['Harmaa','Vihreä','Ruskea','Violetti'],0,'Mustaa ja valkoista sekoittamalla saadaan harmaata.'),
 q('g23','Mikä näistä on SI-järjestelmän ajan perusyksikkö?',['Minuutti','Tunti','Sekunti','Vuorokausi'],2,'Ajan SI-perusyksikkö on sekunti.'),
 q('g24','Mikä näistä on sammakkoeläin?',['Sammakko','Kyy','Hauki','Varis'],0,'Sammakot ovat sammakkoeläimiä.'),
 q('g25','Montako pelaajaa jalkapallojoukkueella on kentällä ottelun alussa?',['7','9','11','13'],2,'Jalkapallossa joukkueella on kentällä 11 pelaajaa, mukaan lukien maalivahti.'),
 q('g26','Mikä luku tulee sarjassa: 3, 6, 12, 24, …?',['27','36','48','60'],2,'Jokainen luku on kaksinkertainen edelliseen nähden.'),
 q('g27','Mikä näistä on selain?',['Firefox','Excel','Photoshop','Spotify'],0,'Firefox on verkkoselain.'),
 q('g28','Mikä on suorakulma?',['45°','60°','90°','180°'],2,'Suorakulma on 90 astetta.'),
 q('g29','Mikä näistä on veden kiinteä olomuoto?',['Höyry','Jää','Sumu','Vesipisara'],1,'Jää on kiinteää vettä.'),
 q('g30','Mitä roomalainen numero X tarkoittaa?',['5','10','50','100'],1,'X tarkoittaa kymmentä.'),
 q('g31','Mikä näistä on suomalainen kirjailija?',['Tove Jansson','William Shakespeare','Miguel de Cervantes','Jane Austen'],0,'Tove Jansson on suomalainen kirjailija ja kuvataiteilija.'),
 q('g32','Mikä on 7 × 8?',['48','54','56','64'],2,'Seitsemän kertaa kahdeksan on 56.')
];
export const ordering=[
 order('o1','Järjestä pienimmästä suurimpaan.',['Millimetri','Senttimetri','Metri','Kilometri'],'Millimetri < senttimetri < metri < kilometri.'),
 order('o2','Järjestä planeetat Auringosta ulospäin.',['Merkurius','Venus','Maa','Mars'],'Auringosta lukien järjestys on Merkurius, Venus, Maa, Mars.'),
 order('o3','Järjestä vuodenajat tammikuusta alkaen.',['Talvi','Kevät','Kesä','Syksy'],'Suomessa tammikuu on talvea, sitten tulevat kevät, kesä ja syksy.'),
 order('o4','Järjestä luvut pienimmästä suurimpaan.',['−8','−1','0','5'],'Negatiiviset luvut ovat pienempiä kuin nolla.'),
 order('o5','Järjestä ajat lyhyimmästä pisimpään.',['Sekunti','Minuutti','Tunti','Vuorokausi'],'60 sekuntia on minuutti, 60 minuuttia tunti, 24 tuntia vuorokausi.'),
 order('o6','Järjestä nämä viikonpäivät aikaisimmasta myöhäisimpään.',['Maanantai','Keskiviikko','Perjantai','Sunnuntai'],'Viikko alkaa maanantaista; näistä viimeinen on sunnuntai.'),
 order('o7','Järjestä nämä kuukaudet kalenterijärjestykseen.',['Helmikuu','Toukokuu','Elokuu','Marraskuu'],'Kuukausien numerot ovat 2, 5, 8 ja 11.'),
 order('o8','Järjestä työvaiheet: tavallinen teen valmistus.',['Keitä vesi','Kaada vesi teepussin päälle','Anna hautua','Poista teepussi'],'Ensin kuuma vesi, sitten haudutus ja lopuksi teepussi pois.')
];
export const images=[
 q('i1','Kuinka monta neliötä kuvassa on yhteensä?',['4','5','6','9'],1,'Neljä pientä neliötä ja yksi suuri neliö: yhteensä viisi.','squares'),
 q('i2','Kuinka monta kolmiota kuvassa on yhteensä?',['3','4','5','6'],2,'Neljä pientä kolmiota ja yksi suuri: yhteensä viisi.','triangles'),
 q('i3','Mitä kellonaikaa kello näyttää?',['10.10','2.50','10.50','2.10'],0,'Lyhyt viisari osoittaa hieman kymmenen jälkeen, pitkä kymmeneen minuuttiin.','clock'),
 q('i4','Minkä maan lippu kuvassa on?',['Ruotsi','Suomi','Tanska','Norja'],2,'Tanskan lipussa on valkoinen risti punaisella pohjalla.','denmark'),
 q('i5','Minkä maan lippu kuvassa on?',['Italia','Ranska','Irlanti','Belgia'],1,'Ranskan lipun pystyraidat ovat vasemmalta sininen, valkoinen ja punainen.','france'),
 q('i6','Mikä luku puuttuu kuvasarjasta?',['12','14','16','18'],2,'Sarja kaksinkertaistuu: 2, 4, 8, 16.','sequence'),
 q('i7','Mikä on kolmannen rattaan pyörimissuunta?',['Myötäpäivään','Vastapäivään','Se ei pyöri','Suuntaa ei voi päätellä'],0,'Jokainen koskettava ratas vaihtaa suunnan. Kolmas pyörii samaan suuntaan kuin ensimmäinen.','gears'),
 q('i8','Montako pistettä on nopan vastakkaisella sivulla?',['2','3','4','5'],2,'Tavallisen nopan vastakkaisten sivujen summa on seitsemän. Kuvassa on kolme pistettä: vastapuolella neljä.','dice')
];
export const geography=[
 q('w1','Missä kaupungissa Eiffel-torni sijaitsee?',['Rooma','Pariisi','Madrid','Berliini'],1,'Eiffel-torni sijaitsee Pariisissa.','eiffel'),
 q('w2','Mikä on Japanin pääkaupunki?',['Kioto','Osaka','Tokio','Soul'],2,'Japanin pääkaupunki on Tokio.','globe'),
 q('w3','Mikä valtameri on pinta-alaltaan suurin?',['Atlantti','Intian valtameri','Tyynimeri','Pohjoinen jäämeri'],2,'Tyynimeri on suurin valtameri.','globe'),
 q('w4','Missä maassa Gizan pyramidit sijaitsevat?',['Egypti','Kreikka','Meksiko','Turkki'],0,'Gizan pyramidit sijaitsevat Egyptissä.','pyramids'),
 q('w5','Mikä on Australian pääkaupunki?',['Sydney','Melbourne','Canberra','Perth'],2,'Australian pääkaupunki on Canberra.','globe'),
 q('w6','Mikä näistä maista EI ole Suomen rajanaapuri?',['Ruotsi','Norja','Venäjä','Tanska'],3,'Suomella on maaraja Ruotsin, Norjan ja Venäjän kanssa.','globe'),
 q('w7','Mikä näistä kaupungeista on Suomessa?',['Tallinna','Tukholma','Turku','Tromssa'],2,'Turku sijaitsee Suomessa.','globe'),
 q('w8','Millä mantereella Brasilia sijaitsee?',['Afrikka','Etelä-Amerikka','Aasia','Eurooppa'],1,'Brasilia sijaitsee Etelä-Amerikassa.','globe')
];
// Korvataan lasten perustieto ja generoitu peruslaskenta toimitetulla pankilla.
const retained=extraGeneral.filter(q=>q.id.startsWith('lit')&&![4,5,6,9,11,12,13,14].includes(Number(q.id.slice(3)))||q.id.startsWith('music')||q.id.startsWith('chem')&&[12,13,14,15,16,17].includes(Number(q.id.slice(4)))||q.id.startsWith('city')&&Number(q.id.slice(4))>=22);
general.splice(0,general.length,...adultGeneral,...retained,...extraTopics,...expandedQuestions);
ordering.splice(0,ordering.length,...hardOrdering);
images.splice(0,images.length,...hardImages);
geography.splice(0,geography.length,...extraWorld.filter(q=>Number(q.id.slice(3))>=22));
for(const q of ordering)q.family='order:'+q.items.join('|');
export const rounds=[
 {id:'basic',title:'Perustietovisa',tag:'LÄMMITTELY',description:'Neljä vastausta. Yksi oikea. Kaikki vastaavat samaan aikaan.',rule:'Oikein kasvattaa pankkia. Väärin tai vastaamatta jääminen pienentää sitä.',bank:general,icon:'buzzer'},
 {id:'category',title:'Kategoriakapteeni',tag:'TIETÄJÄ VALITSEE AIHEEN',description:'Ensimmäinen kysymys arvotaan. Sen jälkeen nopein oikein vastannut määrää seuraavan aiheen.',rule:'Nopein oikein vastannut valitsee aiheen. Jos kukaan ei vastaa oikein tai valinta-aika loppuu, Tipsy päättää aiheen.',bank:general,icon:'category'},
 {id:'order',title:'Järjestys sekaisin',tag:'LAITA ASIAT PAIKOILLEEN',description:'Neljä asiaa, yksi oikea järjestys. Puhelin muuttuu järjestelypöydäksi.',rule:'Napauta kortit oikeaan järjestykseen ja lukitse. Vain täysin oikea ketju hyväksytään.',bank:ordering,icon:'order'},
 {id:'image',title:'Kuva kertoo',tag:'KATSO VIELÄ KERRAN',description:'Kuvat, yksityiskohdat ja kuviot. Silmä nopeampi kuin suu?',rule:'Kuvapähkinä näkyy sekä pelinäytössä että puhelimessa. Kaikki vastaavat.',bank:images,icon:'eye'},
 {id:'world',title:'Maailmanmatkaaja',tag:'PASSI ESILLE',description:'Kaupunkeja, maita ja maisemia. Oikea vastaus antaa leiman passiin.',rule:'Kolme oikeaa tällä kierroksella tuo yhden ylimääräisen 3 pisteen matkabonuksen.',bank:geography,icon:'globe'},
 {id:'pie',title:'Piirakkasota',tag:'TIETÄJÄ SAA HEITTÄÄ',description:'Nopein oikein vastannut saa kermapiirakan. Tähtäin kiertää muita pelaajia.',rule:'Tähtäin kiertää kaikkien, myös heittäjän, kasvoilla. Nopein oikein vastannut ampuu puhelimella. Osuma muuhun tuo heittäjälle 3 pistettä ja vie kohteelta 3. Osuma itseensä vie heittäjältä 3 pistettä.',bank:general,icon:'pie'},
 {id:'wager',title:'Panostaja',tag:'OMA PANKKI LIKOON',description:'Kuinka paljon uskot seuraavaan vastaukseesi? Lukitse oma panos ennen kuin näet kysymyksen.',rule:'Valitse 1, 3, 5, 8 tai 10 pistettä, enintään oma pankki. Oikein tuo panoksen verran lisää. Väärin tai vastaamatta vie panoksen. Lukitsematon panos on 1, tyhjällä pankilla 0.',bank:general,icon:'wager'},
 {id:'steal',title:'Ryöstö',tag:'PANKKI EI OLE TURVASSA',description:'Nopein oikea vastaus antaa oikeuden ryöstää toisen pelaajan pankkia.',rule:'Valitse kohde. Pisteet siirtyvät pankista toiseen. Pankki ei mene miinukselle.',bank:general,icon:'steal'},
 {id:'music',title:'Kuuntele ja tunnista',tag:'MUSIIKKIVISA',description:'Ääninäyte soi yhteiseltä pelinäytöltä. Tunnista kappale, esittäjä tai sen tuttu elokuva tai sarja.',rule:'Kuuntele näyte ja valitse vastaus puhelimesta. Oikein +2, väärin −2. Näyte kestää enintään 15 sekuntia.',bank:musicQuestions,icon:'music'},
 {id:'final',title:'Viimeinen tilaus',tag:'VIIMEINEN PYSTYSSÄ VOITTAA',description:'Kerätty pankki on finaalin elinvoima. Nyt sekä tieto että nopeus ratkaisevat.',rule:'Nopein oikein: +5. Muut oikein: +2 ja −5 eli netto −3. Väärin tai vastaamatta: −5. Nollaan päätyvä putoaa. Viimeinen jäljellä voittaa. Yksin harjoitellessa finaalissa on 8 kysymystä.',bank:general,icon:'final'}
];
