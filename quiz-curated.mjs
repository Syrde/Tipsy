const nhl='https://records.nhl.com/awards/stanley-cup/did-',iihf='https://www.iihf.com/en/medalists',barca='https://www.fcbarcelona.com/en/football/first-team/news/3599643/fc-barcelonas-new-captains-confirmed';
export const hardOrdering=[];
function order(prompt,entries,category='Historia',source=null){const items=entries.map(x=>x[0]);hardOrdering.push({id:'hard-order-'+hardOrdering.length,prompt,items,solution:items.map((_,i)=>i),category,family:'order:'+items.join('|'),explanation:entries.map(([name,year])=>`${name}: ${year}`).join(' → '),source});}
order('Stanley Cup: järjestä joukkueet viimeisimmän mestaruuden mukaan uusimmasta vanhimpaan. Tarkastelu päättyy vuoteen 2024.',[['Florida Panthers',2024],['Vegas Golden Knights',2023],['Colorado Avalanche',2022],['Tampa Bay Lightning',2021]],'Urheilu',nhl);
order('Stanley Cup: järjestä näiden joukkueiden viimeisimmät mestaruudet uusimmasta vanhimpaan, vuoden 2024 loppuun mennessä.',[['St. Louis Blues',2019],['Washington Capitals',2018],['Pittsburgh Penguins',2017],['Chicago Blackhawks',2015]],'Urheilu',nhl);
order('Stanley Cup: järjestä nämä joukkueet ensimmäisen mestaruuden mukaan uusimmasta vanhimpaan.',[['Vegas Golden Knights',2023],['St. Louis Blues',2019],['Anaheim Ducks',2007],['Carolina Hurricanes',2006]],'Urheilu',nhl);
order('Stanley Cup: minkä joukkueen viimeisin mestaruus on tuorein? Järjestä uusimmasta vanhimpaan vuoden 2024 tilanteessa.',[['Los Angeles Kings',2014],['Boston Bruins',2011],['Detroit Red Wings',2008],['New Jersey Devils',2003]],'Urheilu',nhl);
order('Miesten jääkiekon MM-kulta: järjestä maiden viimeisimmät mestaruudet uusimmasta vanhimpaan. Tarkastelu päättyy vuoden 2024 MM-kisoihin.',[['Tšekki',2024],['Kanada',2023],['Suomi',2022],['Ruotsi',2018]],'Urheilu',iihf);
order('Suomen miesten jääkiekon MM-kullat: järjestä finaalissa kaadetut maat uusimmasta vanhimpaan. Kanadan kohdalla käytetään viimeisintä finaalivoittoa vuoteen 2022 asti.',[['Kanada',2022],['Ruotsi',2011]],'Urheilu',iihf);
hardOrdering.pop();
order('FC Barcelonan ykköskapteenit: järjestä kapteenikauden alun mukaan uusimmasta vanhimpaan. Tarkastelu päättyy kauteen 2024/25.',[['Marc-André ter Stegen','2024'],['Sergi Roberto','2023'],['Sergio Busquets','2021'],['Lionel Messi','2018']],'Urheilu',barca);
order('Miesten jalkapallon MM-kulta: järjestä näiden maiden viimeisimmät mestaruudet uusimmasta vanhimpaan vuoden 2022 loppuun mennessä.',[['Argentiina',2022],['Ranska',2018],['Saksa',2014],['Espanja',2010]],'Urheilu','https://www.fifa.com/en/tournaments/mens/worldcup');
order('Miesten jalkapallon MM-isännät: järjestä uusimmasta vanhimpaan. Venäjän kohdalla tarkoitetaan vuoden 2018 kisoja.',[['Qatar',2022],['Venäjä',2018],['Brasilia',2014],['Etelä-Afrikka',2010]],'Urheilu');
order('Järjestä Suomen miesten jääkiekon saavutukset uusimmasta vanhimpaan.',[['Ensimmäinen olympiakulta',2022],['Kolmas MM-kulta',2019],['Toinen MM-kulta',2011],['Ensimmäinen MM-kulta',1995]],'Urheilu',iihf);
order('Formula 1: järjestä kuljettajat ensimmäisen maailmanmestaruuden mukaan uusimmasta vanhimpaan.',[['Max Verstappen',2021],['Nico Rosberg',2016],['Sebastian Vettel',2010],['Lewis Hamilton',2008]],'Urheilu','https://www.formula1.com/en/results');
order('Formula 1: järjestä suomalaiset ja saksalaiset mestarit ensimmäisen mestaruuden mukaan uusimmasta vanhimpaan.',[['Kimi Räikkönen',2007],['Mika Häkkinen',1998],['Michael Schumacher',1994],['Keke Rosberg',1982]],'Urheilu');
order('Kesäolympialaisten isäntäkaupungit: järjestä uusimmasta vanhimpaan vuoden 2024 loppuun mennessä.',[['Pariisi',2024],['Tokio','2021 (Tokio 2020)'],['Rio de Janeiro',2016],['Lontoo',2012]],'Urheilu');
order('Järjestä Bond-näyttelijät ensimmäisen virallisen Bond-elokuvansa mukaan uusimmasta vanhimpaan.',[['Daniel Craig',2006],['Pierce Brosnan',1995],['Timothy Dalton',1987],['Roger Moore',1973]],'Viihde');
order('Järjestä Christopher Nolanin elokuvat ensi-illan mukaan uusimmasta vanhimpaan.',[['Oppenheimer',2023],['Tenet',2020],['Dunkirk',2017],['Interstellar',2014]],'Viihde');
order('Järjestä Taru sormusten herrasta ja Hobitti -elokuvat ensi-illan mukaan uusimmasta vanhimpaan.',[['Hobitti: Odottamaton matka',2012],['Kuninkaan paluu',2003],['Kaksi tornia',2002],['Sormuksen ritarit',2001]],'Viihde');
order('Järjestä nämä Pixar-elokuvat alkuperäisen ensi-illan mukaan uusimmasta vanhimpaan.',[['Inside Out',2015],['WALL-E',2008],['Ihmeperhe',2004],['Toy Story',1995]],'Viihde');
order('Järjestä nämä pelit alkuperäisen julkaisuvuoden mukaan uusimmasta vanhimpaan.',[['Elden Ring',2022],['The Witcher 3',2015],['Skyrim',2011],['Half-Life 2',2004]],'Pelit');
order('Järjestä Grand Theft Auto -pelit ensimmäisen julkaisun mukaan uusimmasta vanhimpaan.',[['GTA V',2013],['GTA IV',2008],['GTA: San Andreas',2004],['GTA: Vice City',2002]],'Pelit');
order('Järjestä Sonyn konsolit ensimmäisen julkaisun mukaan uusimmasta vanhimpaan.',[['PlayStation 5',2020],['PlayStation 4',2013],['PlayStation 3',2006],['PlayStation 2',2000]],'Pelit');
order('Järjestä Nintendo-konsolit ensimmäisen julkaisun mukaan uusimmasta vanhimpaan.',[['Nintendo Switch',2017],['Wii',2006],['GameCube',2001],['Nintendo 64',1996]],'Pelit');
order('Järjestä nämä Suomen presidentit ensimmäisen toimikautensa alun mukaan uusimmasta vanhimpaan.',[['Alexander Stubb',2024],['Sauli Niinistö',2012],['Tarja Halonen',2000],['Martti Ahtisaari',1994]],'Historia');
order('Järjestä Suomen presidentit ensimmäisen toimikautensa alun mukaan uusimmasta vanhimpaan.',[['Mauno Koivisto',1982],['Urho Kekkonen',1956],['J. K. Paasikivi',1946],['C. G. E. Mannerheim',1944]],'Historia');
order('Järjestä historian tapahtumat uusimmasta vanhimpaan.',[['Berliinin muurin murtuminen',1989],['Ensimmäinen kuukävely',1969],['Toisen maailmansodan päättyminen',1945],['Titanicin uppoaminen',1912]],'Historia');
order('Järjestä Suomen historian tapahtumat uusimmasta vanhimpaan.',[['Eurosetelit ja -kolikot käyttöön',2002],['EU-jäsenyys',1995],['Helsingin olympialaiset',1952],['Talvisodan alku',1939]],'Historia');
order('Järjestä kirjallisuuden teokset ilmestymisvuoden mukaan uusimmasta vanhimpaan.',[['Harry Potter ja viisasten kivi',1997],['Tuntematon sotilas',1954],['Sinuhe egyptiläinen',1945],['Seitsemän veljestä',1870]],'Kirjat');
order('Järjestä nämä romaanit alkuperäisen julkaisuvuoden mukaan uusimmasta vanhimpaan.',[['Eläinten vallankumous',1945],['Dracula',1897],['Frankenstein',1818],['Don Quijoten ensimmäinen osa',1605]],'Kirjat');
order('Järjestä rock-yhtyeet perustamisvuoden mukaan uusimmasta vanhimpaan.',[['Nirvana',1987],['Metallica',1981],['Queen',1970],['The Beatles',1960]],'Musiikki');
order('Järjestä nämä teknologiat ensimmäisen julkaisun mukaan uusimmasta vanhimpaan.',[['Ensimmäinen iPhone',2007],['YouTube',2005],['Windows 95',1995],['Ensimmäinen PlayStation',1994]],'Tekniikka');
order('Järjestä alkuaineet järjestysluvun mukaan suurimmasta pienimpään.',[['Kulta',79],['Rauta',26],['Hiili',6],['Vety',1]],'Luonnontiede');
order('Järjestä planeetat halkaisijan mukaan suurimmasta pienimpään.',[['Neptunus','noin 49 000 km'],['Maa','noin 12 700 km'],['Mars','noin 6 800 km'],['Merkurius','noin 4 900 km']],'Luonnontiede');
order('Järjestä nämä Euroopan pääkaupungit pohjoisimmasta eteläisimpään.',[['Helsinki','60° N'],['Tallinna','59° N'],['Berliini','52° N'],['Rooma','42° N']],'Maantieto');
order('Järjestä nämä kaupungit lännestä itään.',[['New York','74° W'],['Lontoo','0°'],['Helsinki','25° E'],['Tokio','140° E']],'Maantieto');
export const hardImages=[];
const img=(id,prompt,options,correct,explanation,art,category='Kuvat')=>hardImages.push({id,prompt,options,correct,explanation,art,category,family:id});
const flags=[
 ['palau','Palau',['Japani','Bangladesh','Laos'],'Vaaleansininen pohja ja keltainen kiekko.'],
 ['bangladesh','Bangladesh',['Palau','Japani','Vietnam'],'Vihreä pohja ja punainen kiekko.'],
 ['laos','Laos',['Thaimaa','Kambodža','Myanmar'],'Punainen–sininen–punainen, keskellä valkoinen kiekko.'],
 ['botswana','Botswana',['Viro','Tansania','Namibia'],'Vaaleansininen lippu ja valkoisin reunoin erotettu musta vaakaraita.'],
 ['estonia','Viro',['Botswana','Latvia','Liettua'],'Ylhäältä sininen, musta ja valkoinen.'],
 ['ghana','Ghana',['Senegal','Mali','Guinea'],'Punainen, keltainen ja vihreä vaakaraita, keskellä musta tähti.'],
 ['senegal','Senegal',['Ghana','Mali','Kamerun'],'Vihreä, keltainen ja punainen pystyraita, keskellä vihreä tähti.'],
 ['bahamas','Bahama',['Jamaika','Barbados','Trinidad ja Tobago'],'Turkoosi–keltainen–turkoosi ja musta kolmio tangon puolella.'],
 ['tanzania','Tansania',['Kenia','Namibia','Etelä-Afrikka'],'Vihreä ja sininen alue, niiden välissä keltaisella reunustettu musta vinoraita.'],
 ['jamaica','Jamaika',['Bahama','Grenada','Guyana'],'Keltainen vinoristi, vihreät ylä- ja alasektorit, mustat sivusektorit.'],
 ['czech','Tšekki',['Slovakia','Slovenia','Serbia'],'Valkoinen yläosa, punainen alaosa ja sininen kolmio.'],
 ['austria','Itävalta',['Latvia','Puola','Liettua'],'Kolme yhtä korkeaa raitaa: punainen, valkoinen, punainen.']
];
for(const [kind,country,wrong,explanation] of flags)img('hard-flag-'+kind,'Minkä maan lippu kuvassa on?',[country,...wrong],0,explanation,{kind:'flag',flag:kind},'Liput');
img('hard-art-starry','Kuka maalasi kuvassa näkyvän teoksen?',['Vincent van Gogh','Claude Monet','Paul Cézanne','Paul Gauguin'],0,'Tähtikirkas yö on Vincent van Goghin maalaus vuodelta 1889.',{kind:'photo',src:'/assets/quiz/starry.jpg'},'Taide');
img('hard-art-pearl','Kuka maalasi tämän tunnetun muotokuvan?',['Johannes Vermeer','Rembrandt','Diego Velázquez','Frans Hals'],0,'Tyttö ja helmikorvakoru on Johannes Vermeerin teos noin vuodelta 1665.',{kind:'photo',src:'/assets/quiz/pearl.jpg'},'Taide');
img('hard-art-venus','Kuka maalasi kuvassa näkyvän renessanssiteoksen?',['Sandro Botticelli','Leonardo da Vinci','Rafael','Michelangelo'],0,'Venuksen syntymä on Sandro Botticellin teos.',{kind:'photo',src:'/assets/quiz/venus.jpg'},'Taide');
img('hard-art-scream','Kuka maalasi tämän teoksen?',['Edvard Munch','Gustav Klimt','Egon Schiele','Wassily Kandinsky'],0,'Huuto on Edvard Munchin teos.',{kind:'photo',src:'/assets/quiz/scream.jpg'},'Taide');
img('hard-court-basket','Minkä lajin kenttäviivasto on kuvassa?',['Koripallo','Käsipallo','Lentopallo','Salibandy'],0,'Koripallokentässä on korien lähellä kolmen pisteen kaaret ja vapaaheittoalueet.',{kind:'court',sport:'basket'},'Urheilu');
img('hard-court-badminton','Minkä lajin kenttä on kuvassa?',['Sulkapallo','Tennis','Padel','Squash'],0,'Sulkapallon kentässä on lyhyet syöttöviivat verkon lähellä sekä erilliset kaksin- ja nelinpelirajat.',{kind:'court',sport:'badminton'},'Urheilu');
img('hard-court-volley','Minkä lajin kenttä on kuvassa?',['Lentopallo','Sulkapallo','Tennis','Koripallo'],0,'Lentopallokentän keskiviivan kummallakin puolella on kolmen metrin hyökkäysraja.',{kind:'court',sport:'volley'},'Urheilu');
img('hard-court-tennis','Minkä lajin kenttäviivasto on kuvassa?',['Tennis','Sulkapallo','Lentopallo','Käsipallo'],0,'Tenniskentässä näkyvät nelinpelikäytävät ja neljä syöttöruutua.',{kind:'court',sport:'tennis'},'Urheilu');
