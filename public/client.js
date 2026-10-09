import { chapters, getGame } from './story.js';
import { W,H,scene } from './art.js';
import { Game, callQuestions } from './games.js';

const app=document.querySelector('#app');
const escape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const readStore=(key,storage=localStorage)=>{try{return JSON.parse(storage.getItem(key)||'null');}catch{return null;}};
const store=(key,value,storage=localStorage)=>{try{storage.setItem(key,JSON.stringify(value));}catch{}};
let config={addresses:[]},role=null,room=null,credentials=null,playerId=null,socket=null,retry=null,game=null,ctx=null,lastTick=performance.now(),lastView=0,base=location.origin;
let soundEnabled=false,audio=null,previousNarration='',toastTimer=null,leaving=false,localOverride=false;
const playerOnline=()=>!room?.players.length||room.players.some(p=>p.controller&&p.online);
const controls=()=>role==='host'||room?.players.some(p=>p.id===playerId&&p.controller);
function toast(value){const el=document.querySelector('#toast');el.textContent=value;el.classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('visible'),6000);}
function status(connected){const el=document.querySelector('#connection');el.textContent=connected?'Yhteys kunnossa':'Yhdistetään uudelleen…';el.classList.toggle('offline',!connected);}
function send(message){if(socket?.readyState===WebSocket.OPEN)socket.send(JSON.stringify(message));else toast('Yhteys katkennut. Peli jatkuu yhteyden palauduttua.');}
function playSound(kind){
  if(!soundEnabled||!audio)return;try{const osc=audio.createOscillator(),gain=audio.createGain();osc.connect(gain);gain.connect(audio.destination);const at=audio.currentTime;osc.type=kind==='bad'?'triangle':'sine';osc.frequency.setValueAtTime({jump:340,shoot:110,click:390,good:660,bad:190}[kind]||360,at);osc.frequency.exponentialRampToValueAtTime(kind==='good'?880:kind==='bad'?100:180,at+.12);gain.gain.setValueAtTime(.045,at);gain.gain.exponentialRampToValueAtTime(.001,at+.18);osc.start(at);osc.stop(at+.2);}catch{}
}
function narrate(value){
  if(!soundEnabled||role!=='host'||!('speechSynthesis'in window)||!value||value===previousNarration)return;
  previousNarration=value;const voices=speechSynthesis.getVoices();const voice=voices.find(v=>v.lang.toLowerCase().startsWith('fi'));
  if(!voice)return;speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(value);utterance.voice=voice;utterance.lang='fi-FI';utterance.rate=.98;speechSynthesis.speak(utterance);
}
document.querySelector('#sound').textContent='Ota äänet käyttöön';
document.querySelector('#sound').addEventListener('click',async()=>{
  soundEnabled=!soundEnabled;document.querySelector('#sound').textContent=soundEnabled?'Äänet päällä':'Äänet pois';
  if(soundEnabled){const AC=window.AudioContext||window.webkitAudioContext;if(AC){audio??=new AC();await audio.resume();}playSound('good');previousNarration='';if(room)narrate(currentNarration());}else if('speechSynthesis'in window)speechSynthesis.cancel();
});
function currentNarration(){if(!room)return '';const s=room.state,c=chapters[s.chapter];return s.phase==='intro'?'Ilta tuli päätökseen. Jorma lupasi syntymäpäiväaamiaisen, mutta herää metsästä. Nyt alkaa kotimatka.':s.phase==='story'?c.text:s.phase==='result'?(s.results.at(-1)?.passed?c.win:c.lose):s.phase==='ending'?s.ending.text:'';}

async function createRoom(){
  try{const response=await fetch('/api/rooms',{method:'POST'});if(!response.ok)throw new Error('Huoneen luonti epäonnistui');credentials=await response.json();role='host';store('vk-host',credentials,sessionStorage);base=location.hostname==='localhost'||location.hostname==='127.0.0.1'?config.addresses[0]?.url||location.origin:location.origin;store('vk-base',base,sessionStorage);connect();}
  catch(e){toast(e.message);}
}
function connect(){
  clearTimeout(retry);leaving=false;if(socket){socket.onclose=null;socket.close();}
  const endpoint=new URL('/socket',location.href);endpoint.protocol=location.protocol==='https:'?'wss:':'ws:';socket=new WebSocket(endpoint);
  socket.onopen=()=>{status(true);socket.send(JSON.stringify({type:'hello',role,...credentials}));};
  socket.onmessage=event=>{
    const m=JSON.parse(event.data);
    if(m.type==='welcome'){
      if(m.role==='player'){playerId=m.id;credentials.token=m.token;store(`vk-player-${credentials.code}`,credentials);}
    }
    if(m.type==='error'){
      toast(m.message);
      if(!room){leaving=true;socket.close();role=null;credentials=null;sessionStorage.removeItem('vk-host');renderHome();}
    }
    if(m.type==='state'){
      room=m;render();narrate(currentNarration());
      if(role==='host'&&game&&!playerOnline()&&!localOverride)game.resetInputs();
    }
    if(m.type==='input'&&role==='host'&&game){if(m.reset)game.resetInputs();else if(!localOverride){if(m.kind==='aim')game.aim(m.x,m.y);else game.input(m.key,m.down);}}
    if(m.type==='view'&&role==='player')updatePhone(m.view);
  };
  socket.onclose=event=>{status(false);game?.resetInputs();if(event.code===4001){leaving=true;toast('Peli avattiin toisessa välilehdessä.');}if(!leaving)retry=setTimeout(connect,1800);};
  socket.onerror=()=>status(false);
}
function joinForm(code=''){
  app.innerHTML=`<div class="join-page"><p class="eyebrow">PUHELIN ON OHJAIMESI</p><h1>Yksi nimi.<br>Huono aamu.</h1><p class="lead">Liity Jorman joukkueeseen. Yksi ohjaa, muut auttavat selvittämään illan jälkiä.</p><form class="side-panel" id="join-form"><label class="input-label" for="code">HUONEKOODI</label><input id="code" name="code" value="${escape(code)}" placeholder="ABCDE" maxlength="5" autocapitalize="characters" autocomplete="off" spellcheck="false" required style="text-transform:uppercase;letter-spacing:5px;font-size:24px"><label class="input-label" for="name">PELAAJANIMESI</label><input id="name" name="name" maxlength="24" autocomplete="nickname" placeholder="Esim. Jorman järki" required><button class="primary" style="width:100%;margin-top:22px">Liity peliin</button><p class="note">Puhelin ja pelinäyttö samassa Wi-Fi-verkossa. Et tarvitse käyttäjätiliä tai sovellusta.</p></form></div>`;
  const saved=readStore(`vk-player-${code}`);if(saved)document.querySelector('#name').value=saved.name||'';
  document.querySelector('#join-form').addEventListener('submit',event=>{event.preventDefault();const data=new FormData(event.target);const code=String(data.get('code')).trim().toUpperCase(),name=String(data.get('name')).trim();if(!code||!name)return;const saved=readStore(`vk-player-${code}`);credentials={code,name,token:saved?.token};role='player';app.innerHTML='<div class="join-page"><h2>Liitytään…</h2><p class="lead">Jorma odottaa.</p></div>';connect();});
}
function renderHome(){
  if(location.pathname==='/join'){joinForm(new URLSearchParams(location.search).get('code')?.toUpperCase()||'');return;}
  app.innerHTML=`<section class="hero"><div><p class="eyebrow">KUUSI HUONOA PÄÄTÖSTÄ. NYT TESTISSÄ YKSI.</p><h1>Ilta loppui.<br>Ongelmat eivät.</h1><p class="lead">Jorma lupasi syntymäpäiväaamiaisen. Nyt hän on metsässä, metsästäjillä on asenneongelma ja makkara pakenee alamäkeen.</p><div class="actions"><button id="create" class="primary">Luo peli & näytä QR-koodi →</button><button id="join">Liity huonekoodilla</button></div><div class="features"><div><strong>1–3</strong><span>pelaajaa / joukkue</span></div><div><strong>4–8</strong><span>erilaista minipeliä</span></div><div><strong>10–20 min</strong><span>lyhyt testitarina</span></div></div><p class="note" style="margin-top:23px">Pelinäkymä tietokoneelle, ohjain puhelimeen. Voit pelata myös yksin näppäimistöllä. Tämä on ensimmäinen pelattava versio.</p></div><div class="hero-art"><canvas id="scene" width="1200" height="650" aria-label="Jorma metsästäjien nuotiolla"></canvas><div class="art-caption">JORMAN KOTIMATKA · LUKU 01</div></div></section><div class="footer-note">Valinnat muuttavat reittiä. Suoritus ratkaisee seuraukset.</div>`;
  ctx=document.querySelector('#scene').getContext('2d');scene(ctx,0,0);
  document.querySelector('#create').onclick=createRoom;document.querySelector('#join').onclick=()=>{history.pushState(null,'','/join');joinForm();};
}
function stats(s){return `<div class="metrics"><div class="metric"><strong>${s.score}</strong><span>PISTETTÄ</span></div><div class="metric"><strong>${s.marks} / 3</strong><span>ONGELMAMERKKEJÄ</span></div><div class="metric"><strong>${s.results.length} / 8</strong><span>PELATTU</span></div></div>${s.inventory.length?`<div class="inventory">${s.inventory.map(x=>`<span>${escape(x)}</span>`).join('')}</div>`:''}`;}
function playerMarkup(){return room.players.length?`<ul class="players">${room.players.map(p=>`<li><span class="player-initial">${escape(p.name[0]?.toUpperCase())}</span><div>${escape(p.name)}<small>${p.online?'Yhteys kunnossa':'Yhteys katkennut'}${p.controller?' · OHJAA JORMAA':''}</small></div>${!p.controller?`<button data-controller="${escape(p.id)}">Anna ohjaus</button>`:''}</li>`).join('')}</ul>`:'<p class="note">Puhelimella liittyneet näkyvät tässä. Voit aloittaa myös yksin tietokoneella.</p>';}
function joinPanel(){
  const url=`${base}/join?code=${room.code}`;
  return `<div class="side-panel"><p class="eyebrow">SKANNAA JA LIITY</p><div class="qr-wrap"><img src="/api/qr?url=${encodeURIComponent(url)}" alt="QR-koodi puhelimella liittymiseen"><div><span class="note">HUONEKOODI</span><div class="room-code">${room.code}</div><p class="note">Sama Wi-Fi.<br>Nimi riittää.</p></div></div><label class="input-label" for="address">PUHELIMEN LIITTYMISOSOITE</label><select id="address">${[...new Set([base,...config.addresses.map(a=>a.url)])].map(url=>`<option value="${escape(url)}" ${url===base?'selected':''}>${escape(url)}${config.addresses.find(a=>a.url===url)?' · '+escape(config.addresses.find(a=>a.url===url).name):''}</option>`).join('')}</select><a class="join-link" href="${escape(url)}" target="_blank" rel="noopener">${escape(url)}</a><button id="copy" class="quiet" style="margin-top:10px">Kopioi liittymislinkki</button><p class="note">Jos puhelin ei avaa sivua, tarkista verkko ja Windowsin palomuurin Node.js-lupa. Vierasverkko voi estää laitteiden välisen yhteyden.</p></div>`;
}
function render(){
  if(!room)return renderHome();
  if(role==='player')return renderPhone();
  const s=room.state,c=chapters[s.chapter],result=s.results.at(-1);
  const strip=`<div class="chapter-strip">${chapters.map((chapter,i)=>{const r=s.results.find(x=>x.chapter===i);return `<div class="chapter-dot ${i===s.chapter?'active':''} ${r?r.passed?'pass':'fail':''}">${String(i+1).padStart(2,'0')} ${i>=5?'FINAALI':'LUKU'}</div>`;}).join('')}</div>`;
  const side=`<aside class="room-side">${s.phase==='lobby'?joinPanel():`<div class="side-panel"><p class="eyebrow">JORMAN TILANNE</p>${stats(s)}<p class="note">Ensimmäiset neljä peliä on turvattu. Neljännen ja viidennen jälkeen kolme ongelmamerkkiä päättää kotimatkan.</p></div>`}<div class="side-panel"><h3>Joukkue</h3>${playerMarkup()}${s.phase!=='lobby'?`<p class="note">Huonekoodi <strong>${room.code}</strong> · <a href="${escape(base)}/join?code=${room.code}" target="_blank" rel="noopener">Avaa ohjain</a></p>`:''}<div class="actions" style="margin-top:12px"><button id="local" class="quiet">${localOverride?'Palaa puhelinohjaukseen':'Pelaa tällä tietokoneella'}</button><button data-new-room class="quiet">Luo uusi huone</button></div></div><div class="side-panel"><p class="eyebrow">PELIOHJE</p><p class="note">Puhelimen napit ohjaavat ison näytön Jormaa. Tietokoneella: nuolet, välilyönti = toimi, Enter = valmis, Backspace = peru. Puhelussa numerot 1–3.</p><p class="note">Äänet saa käyttöön yläreunasta. Kertojaääni toimii, jos selaimessa on suomalainen puheääni.</p></div></aside>`;
  let content='';
  if(s.phase==='lobby')content=`<div class="scene-card"><canvas id="scene" width="1200" height="650"></canvas><div class="scene-copy"><p class="eyebrow">YÖN VIIMEINEN HYVÄ IDEA</p><h2>Jorman kotimatka</h2><p>Yksi avatar, yksi joukkue ja syntymäpäiväaamiainen, jonka olisi pitänyt olla jo pöydässä. Skannaa QR-koodi tai pelaa näppäimistöllä.</p><button data-next class="primary">Aloita tarina →</button></div></div>`;
  if(s.phase==='intro')content=`<div class="scene-card"><canvas id="scene" width="1200" height="650"></canvas><div class="scene-copy"><p class="eyebrow">PROLOGI · BAARI, 03.47</p><h2>”Yksi vielä. Sitten kotiin.”</h2><p>Jorma, Tarja, Pate, Pirjo, Reiska ja Sirpa päättävät illan yhteiseen lupaukseen: kukaan ei lähde sivutehtävälle. Jorma tilaa puolisolle syntymäpäiväyllätyksen ja lupaa tehdä aamupalan. Seuraavassa muistossa katuvalot vaihtuvat mäntyihin.</p><p>Ilta tuli päätökseen. Nyt alkavat seuraukset.</p><button data-next class="primary">Jorman vuoro →</button></div></div>`;
  if(s.phase==='story')content=`<div class="scene-card"><canvas id="scene" width="1200" height="650"></canvas><div class="scene-copy"><p class="eyebrow">${s.chapter>=5?'FINAALI':'LUKU '+(s.chapter+1)} · ${escape(c.place)}</p><h2>${escape(c.title)}</h2><p>${escape(c.text)}</p><div class="choices">${c.choices.map(x=>`<button class="choice" data-choice="${x.id}"><strong>${escape(x.label)} →</strong><small>${escape(x.note)}</small></button>`).join('')}</div></div></div>`;
  if(s.phase==='brief'){
    const gameType=getGame(s.chapter,s.choice);const brief=gameType==='duel'?'Metsästäjä näyttää iskunsa suunnan. Väistä vastakkaiseen suuntaan nuolipainikkeella ja iske takaisin TOIMI-painikkeella. Saat 5 onnistunutta vastaiskua; 4 kolhua päättää tappelun.':c.brief;
    content=`<div class="scene-card"><canvas id="scene" width="1200" height="650"></canvas><div class="scene-copy"><p class="eyebrow">VALINTA: ${escape(c.choices.find(x=>x.id===s.choice).label)}</p><h2>Näin pelataan</h2><p>${escape(brief)}</p><p class="note">Suoritus antaa 0–100 pistettä. Epäonnistuminen lisää yhden ongelmamerkin. Ohjeen saa lukea rauhassa: aika alkaa vasta painikkeesta.</p><button data-next class="primary">Aloita minipeli →</button></div></div>`;
  }
  if(s.phase==='playing')content=`<div class="game-shell"><canvas id="game" width="1200" height="650" aria-label="${escape(c.title)} — pelattava minipeli"></canvas><div id="pause" class="screen-overlay" hidden>Ohjaimen yhteys katkennut. Peli on tauolla. Voit jatkaa puhelimella tai valita tietokoneohjauksen.</div><div class="game-caption"><div><span class="hud-status" id="live-status">${escape(c.title)}</span><p>${escape(gameHint(getGame(s.chapter,s.choice)))}</p></div><div class="key-controls">${controlButtons(getGame(s.chapter,s.choice))}</div></div></div>`;
  if(s.phase==='result'){
    let outcome=result.passed?c.win:c.lose;if(s.chapter===0&&s.choice==='fight')outcome=result.passed?'Metsästäjä horjahtaa ja luovuttaa. Jorma nappaa kiväärin. Muu porukka ei taputa. ”Tästä vielä puhutaan.”':'Metsästäjä pitää pintansa. Jorma pakenee nälkäisenä ja väittää poistumista taktiseksi päätökseksi.';
    const dropping=(s.chapter===3||s.chapter===4)&&s.marks>=3;
    content=`<div class="scene-card"><canvas id="scene" width="1200" height="650"></canvas><div class="scene-copy"><span class="result-label ${result.passed?'':'fail'}">${result.passed?'ONNISTUIT':'TÄSTÄ TULI SIVUTEHTÄVÄ'}</span><h2 style="margin-top:10px">${result.score} pistettä</h2><p>${escape(outcome)}</p>${dropping?'<p style="color:var(--bad)">Kolme ongelmamerkkiä. Jorman kotimatka päättyy tähän.</p>':''}<button data-next class="primary">${dropping||s.chapter===7?'Katso loppukohtaus':'Jatka tarinaa'} →</button></div></div>`;
  }
  if(s.phase==='ending')content=`<div class="scene-card"><canvas id="scene" width="1200" height="650"></canvas><div class="scene-copy"><p class="eyebrow">JORMAN ILTA ON NYT SELVITETTY</p><h2>${escape(s.ending.title)}</h2><p>${escape(s.ending.text)}</p><div class="score-big">${s.score}<span style="font:15px var(--body);color:var(--muted)"> / 1 000</span></div><p class="note">Pelipisteet ${s.results.reduce((n,x)=>n+x.score,0)} + loppubonus ${s.ending.bonus}. ${s.results.length} minipeliä pelattu.</p>${s.results.map(r=>`<div class="score-row"><span>${r.chapter+1}. ${escape(chapters[r.chapter].title)}</span><strong class="${r.passed?'':'fail'}">${r.score} p · ${r.passed?'onnistui':'epäonnistui'}</strong></div>`).join('')}<div class="actions"><button id="restart" class="primary">Uusi yritys samalla joukkueella</button><button id="new">Luo uusi huone</button></div></div></div>`;
  app.innerHTML=`<div class="section-head"><div><p class="eyebrow">PELIPÖYTÄ / HUONE ${room.code}</p><h2>${s.phase==='lobby'?'VIIMEINEN KIERROS':s.phase==='ending'?'LOPPUTULOS':c.title}</h2></div><span class="badge">${s.chapter>=5?'FINAALI':'JORMAN VUORO'}</span></div>${s.phase!=='lobby'?strip:''}<div class="room-layout"><section>${content}</section>${side}</div><p class="footer-note">Ensimmäinen tarina · 1–3 pelaajaa · näppäimistö tai puhelin</p>`;
  ctx=document.querySelector('canvas')?.getContext('2d');
  if(s.phase==='playing'){
    if(!game||game.state.runId!==s.runId){game=new Game(s,result=>send({type:'finish',runId:s.runId,...result}),playSound);lastTick=performance.now();}
    else game.resetInputs();
  }else{game=null;if(ctx)scene(ctx,s.chapter,0,s.phase);}
  bindCommon();
  if(s.phase==='lobby'){
    document.querySelector('#address').onchange=e=>{base=e.target.value;store('vk-base',base,sessionStorage);render();};
    document.querySelector('#copy').onclick=async()=>{const value=`${base}/join?code=${room.code}`;try{await navigator.clipboard.writeText(value);toast('Liittymislinkki kopioitu.');}catch{toast('Kopioi osoite linkistä.');}};
  }
  document.querySelectorAll('[data-controller]').forEach(button=>button.onclick=()=>{localOverride=false;send({type:'controller',id:button.dataset.controller});});
  document.querySelector('#local').onclick=()=>{localOverride=!localOverride;game?.resetInputs();render();};
  document.querySelector('[data-new-room]').onclick=()=>{game=null;room=null;localOverride=false;createRoom();};
  document.querySelector('#restart')?.addEventListener('click',()=>send({type:'restart'}));document.querySelector('#new')?.addEventListener('click',()=>{game=null;room=null;createRoom();});
}
function gameHint(type){return {runner:'Välilyönti / TOIMI: hyppy. Älä hyppää liian aikaisin.',duel:'Nuoli väistää. TOIMI antaa vastaiskun oikeassa ikkunassa.',aim:'Nuolet tai puhelimen tähtäysalue. TOIMI ampuu.',stealth:'Pidä OIKEA pohjassa. Vapauta ajoissa. YLÖS poimii korin.',bridge:'Valitse lauta nuolilla, TOIMI asettaa, PERU poistaa, VALMIS testaa.',call:'Vastaa numerolla 1, 2 tai 3. Muista oma tarinasi.',traffic:'TOIMI vaihtaa valon. Tarkkaile poikittaista liikennettä.',studio:'Nuolet: kamera ja valo. TOIMI: tausta. Kaikki oikein yhtä aikaa.',domino:'Nuolet valitsevat. TOIMI lisää. PERU poistaa. VALMIS testaa.'}[type];}
function controlButtons(type,phone=false){
  const layouts={runner:[['action','HYPPÄÄ']],duel:[['left','← VÄISTÄ'],['right','VÄISTÄ →'],['action','VASTAISKU']],aim:[['left','←'],['up','↑'],['right','→'],['down','↓'],['action','AMMU']],stealth:[['right','HIIVI →'],['up','OTA KORI']],bridge:[['left','← LAUTA'],['right','LAUTA →'],['action','ASETA'],['back','PERU'],['confirm','VALMIS']],call:[['one','1'],['two','2'],['three','3']],traffic:[['action','VAIHDA VALO']],studio:[['left','KAMERA ←'],['right','KAMERA →'],['up','VALOA +'],['down','VALOA −'],['action','VAIHDA TAUSTA']],domino:[['left','← KORTTI'],['right','KORTTI →'],['action','LISÄÄ'],['back','PERU'],['confirm','VALMIS']]};
  return (layouts[type]||[]).map(([key,label])=>`<button data-key="${key}" class="${key==='action'?'primary '+(phone?'big':''):''}">${label}</button>`).join('');
}
function bindCommon(){
  document.querySelectorAll('[data-next]').forEach(button=>button.onclick=()=>send({type:'next'}));
  document.querySelectorAll('[data-choice]').forEach(button=>button.onclick=()=>send({type:'choose',choice:button.dataset.choice}));
  document.querySelectorAll('[data-key]').forEach(button=>{
    button.onpointerdown=e=>{e.preventDefault();button.setPointerCapture(e.pointerId);input(button.dataset.key,true);};
    const up=e=>{e.preventDefault();input(button.dataset.key,false);};button.onpointerup=up;button.onpointercancel=up;button.onlostpointercapture=()=>input(button.dataset.key,false);
  });
}
function input(key,down){if(!controls()||room?.state.phase!=='playing')return;if(role==='host'){localOverride=true;game?.input(key,down);}else send({type:'input',key,down});}
function renderPhone(){
  const s=room.state,c=chapters[s.chapter],me=room.players.find(p=>p.id===playerId),isController=me?.controller;
  let content='';
  if(!room.hostOnline)content='<div class="phone-status"><h3>Pelinäyttö yhdistää uudelleen</h3><p>Pidä tämä sivu auki. Tarina jatkuu, kun tietokoneen yhteys palaa.</p></div>';
  else if(s.phase==='lobby')content=`<div class="phone-status"><p class="eyebrow">OLET MUKANA</p><h2>Jorma tarvitsee järkeä.</h2><p>${isController?'Sinä ohjaat Jormaa. Voit aloittaa tästä tai pelinäytöltä.':'Autat joukkuetta. Ohjaajan voi vaihtaa tietokoneen Joukkue-paneelista.'}</p>${isController?'<button class="primary" data-next>Aloita tarina →</button>':''}</div>`;
  else if(s.phase==='playing'){
    const type=getGame(s.chapter,s.choice);
    if(isController)content=`<div class="phone-status"><p class="eyebrow">OHJAAT JORMAA</p><h2>${escape(c.title)}</h2><div class="progress"><span id="phone-progress" style="width:0%"></span></div><div class="phone-live" id="phone-time">Peli käynnissä</div><p id="phone-hint">${escape(gameHint(type))}</p><p id="phone-notice" style="color:var(--accent)"></p><p id="phone-extra" class="note"></p></div>${type==='aim'?'<div class="aim-pad" id="aim-pad">LIIKUTA TÄHTÄINTÄ TÄSSÄ<span class="aim-dot" id="aim-dot" style="left:50%;top:50%"></span></div>':''}<div class="control-deck">${controlButtons(type,true)}</div>${type==='stealth'?'<p class="note">Pidä HIIVI pohjassa. Vapauta, kun korvat nousevat. Korin kohdalla paina OTA KORI.</p>':''}`;
    else content=`<div class="phone-status"><p class="eyebrow">JOUKKUEKAVERI OHJAA</p><h2>${escape(c.title)}</h2><p>Seuraa peliä isolta näytöltä ja auta ohjaajaa. Ohjausvuoron voi vaihtaa Joukkue-paneelista.</p><div class="phone-live" id="phone-time"></div><p id="phone-hint"></p></div>`;
  }else if(s.phase==='story')content=`<div class="phone-status"><p class="eyebrow">${s.chapter>=5?'FINAALI':'JORMAN VUORO'} ${s.chapter+1}/8</p><h2>${escape(c.title)}</h2><p>${escape(c.text)}</p></div>${isController?`<div class="phone-choices">${c.choices.map(x=>`<button class="choice" data-choice="${x.id}"><strong>${escape(x.label)} →</strong><small>${escape(x.note)}</small></button>`).join('')}</div>`:'<p class="note">Sopikaa joukkueena valinta. Ohjaaja vahvistaa sen.</p>'}`;
  else if(s.phase==='ending')content=`<div class="phone-status"><p class="eyebrow">LOPPUTULOS</p><h2>${escape(s.ending.title)}</h2><p>${escape(s.ending.text)}</p><div class="score-big">${s.score}</div><p>Pelatut minipelit ${s.results.length}/8 · loppubonus ${s.ending.bonus}</p></div>`;
  else{
    const r=s.results.at(-1);const brief=getGame(s.chapter,s.choice)==='duel'?'Väistä oikeaan suuntaan ja paina sitten VASTAISKU. Viisi vastaiskua voittaa, neljä kolhua häviää.':c.brief;
    content=`<div class="phone-status"><p class="eyebrow">${s.phase==='intro'?'ILTA TULI PÄÄTÖKSEEN':s.phase==='brief'?'NÄIN PELATAAN':r?.passed?'ONNISTUIT':'TÄSTÄ TULI SIVUTEHTÄVÄ'}</p><h2>${s.phase==='intro'?'Aamu alkoi metsästä.':s.phase==='brief'?escape(c.title):`${r?.score} pistettä`}</h2><p>${escape(s.phase==='intro'?'Jorma lupasi syntymäpäiväaamiaisen. Nyt alkaa kotimatka.':s.phase==='brief'?brief:r?.passed?c.win:c.lose)}</p>${isController?`<button data-next class="primary">${s.phase==='brief'?'Aloita minipeli':s.phase==='intro'?'Jorman vuoro':'Jatka tarinaa'} →</button>`:''}</div>`;
  }
  app.innerHTML=`<div class="controller-page"><div class="controller-head"><div><p class="eyebrow" style="margin:0">${escape(me?.name||credentials?.name)}</p><span class="note">HUONE ${room.code}</span></div><span class="badge">${isController?'OHJAAJA':'JOUKKUE'}</span></div>${content}<div class="side-panel">${stats(s)}</div><p class="footer-note">Isolla näytöllä tarina. Tässä kädessä huonot päätökset.</p></div>`;
  bindCommon();
  if(s.phase==='playing'&&getGame(s.chapter,s.choice)==='call')updatePhone({time:48,progress:0,hint:callQuestions(s)[0].q,answers:callQuestions(s)[0].answers});
  const pad=document.querySelector('#aim-pad');
  if(pad){let held=false,last=0;const aim=e=>{const now=performance.now();if(now-last<25)return;last=now;const r=pad.getBoundingClientRect(),x=Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),y=Math.max(0,Math.min(1,(e.clientY-r.top)/r.height));send({type:'input',kind:'aim',x,y});const dot=document.querySelector('#aim-dot');dot.style.left=`${x*100}%`;dot.style.top=`${y*100}%`;};pad.onpointerdown=e=>{e.preventDefault();pad.setPointerCapture(e.pointerId);held=true;last=0;aim(e);};pad.onpointermove=e=>{if(held)aim(e);};pad.onpointerup=()=>held=false;pad.onpointercancel=()=>held=false;}
}
function updatePhone(v){
  const time=document.querySelector('#phone-time'),hint=document.querySelector('#phone-hint'),progress=document.querySelector('#phone-progress'),notice=document.querySelector('#phone-notice'),extra=document.querySelector('#phone-extra');
  if(time)time.textContent=`${v.time} s jäljellä`;if(hint)hint.textContent=v.hint;if(progress)progress.style.width=`${Math.max(0,Math.min(100,v.progress*100))}%`;if(notice)notice.textContent=v.notice||'';
  if(extra&&v.extra)extra.textContent=`Tavoite: kamera ${v.extra.camera} %, valo ${v.extra.light} %, tausta ${v.extra.backdrop}`;
  if(v.answers?.length)for(const [i,key]of ['one','two','three'].entries()){const button=document.querySelector(`[data-key="${key}"]`);if(button){button.textContent=`${i+1}. ${v.answers[i]}`;button.style.gridColumn='1 / -1';}}
}
const mapping={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'up',ArrowDown:'down',' ':'action',Enter:'confirm',Backspace:'back','1':'one','2':'two','3':'three'};
window.addEventListener('keydown',e=>{if(/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)||!game)return;const key=mapping[e.key];if(key){e.preventDefault();input(key,true);}});
window.addEventListener('keyup',e=>{const key=mapping[e.key];if(key){if(game)e.preventDefault();input(key,false);}});
window.addEventListener('blur',()=>{game?.resetInputs();if(role==='player'&&socket?.readyState===WebSocket.OPEN)for(const key of Object.values(mapping))send({type:'input',key,down:false});});
document.addEventListener('visibilitychange',()=>{game?.resetInputs();lastTick=performance.now();});
window.addEventListener('popstate',()=>{if(!room)renderHome();});
function animate(now){
  const dt=Math.min(.05,(now-lastTick)/1000);lastTick=now;
  if(role==='host'&&game&&ctx){
    const paused=document.hidden||socket?.readyState!==WebSocket.OPEN||(!playerOnline()&&!localOverride);const pause=document.querySelector('#pause');if(pause)pause.hidden=!paused;
    if(!paused)game.step(dt);game.draw(ctx);
    if(now-lastView>150&&!game.done){lastView=now;send({type:'view',view:game.view()});const live=document.querySelector('#live-status');if(live)live.textContent=game.view().hint;}
  }
  requestAnimationFrame(animate);
}
async function boot(){
  try{const response=await fetch('/api/config');if(!response.ok)throw new Error();config=await response.json();}catch{toast('Palvelimeen ei saatu yhteyttä. Käynnistä peli uudelleen.');}
  const saved=readStore('vk-host',sessionStorage);
  if(saved&&location.pathname!=='/join'){role='host';credentials=saved;base=readStore('vk-base',sessionStorage)||config.addresses[0]?.url||location.origin;connect();app.innerHTML='<h2>Palataan Jorman tarinaan…</h2>';}
  else renderHome();requestAnimationFrame(animate);
}
boot();
