import http from 'node:http';
import {MAX_PLAYERS} from './public/quiz-config.js';
import {readFile,writeFile} from 'node:fs/promises';
import {resolve,dirname,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {networkInterfaces} from 'node:os';
import {randomBytes,randomInt} from 'node:crypto';
import {AVATAR_COUNT} from './public/quiz-avatars.js';
import {WebSocketServer} from 'ws';
import QRCode from 'qrcode';
import * as game from './quiz-engine.mjs';
import {createRoomStore,createCheckpointWriter,packRoom} from './quiz-room-store.mjs';
import {voiceText,voiceClip} from './quiz-voice.mjs';
import {readerClip,warmReader} from './quiz-reader.mjs';
import {musicQuestions} from './quiz-music-questions.mjs';
import {general,ordering,images,geography} from './quiz-questions.mjs';
import {topics,topicOf} from './quiz-topics.mjs';
const questionBank=[...new Map([...general,...ordering,...images,...geography,...musicQuestions].map(q=>[q.id,q])).values()];
const categoryCounts=Object.fromEntries(topics.map(topic=>[topic,questionBank.filter(q=>topicOf(q)===topic).length]));
const root=resolve(dirname(fileURLToPath(import.meta.url)),'public'),port=Number(process.env.PORT||3000),rooms=new Map();
const roomStore=createRoomStore();let shuttingDown=false;
const configuredOrigin=process.env.TIPZY_PUBLIC_URL||process.env.RENDER_EXTERNAL_URL;
const publicOrigin=configuredOrigin?new URL(configuredOrigin).origin:null;
if(publicOrigin&&!/^https?:\/\//.test(publicOrigin))throw new Error('TIPZY_PUBLIC_URL must use HTTP or HTTPS');
const token=()=>randomBytes(20).toString('hex');
const historyFile=process.env.TIPZY_HISTORY_FILE||'.tipzy-history.json';
let history=new Set();try{history=new Set(JSON.parse(await readFile(historyFile,'utf8')));}catch{}
let avatarAudioBank={};try{avatarAudioBank=JSON.parse(await readFile('public/audio/manifest.json','utf8')).avatars||{};}catch{}
function avatarReactions(r){const s=r.state;if(s.avatarReactions?.key===s.questionId)return;const cursor=r.reactionCursor||0;r.reactionCursor=cursor+1;const items=(s.resolution?.events||[]).filter(e=>typeof e.correct==='boolean'&&r.players.has(e.id)).map(e=>{const p=r.players.get(e.id),kind=e.correct?'success':'failure',index=(s.round+s.index+p.avatar)%2,clip=avatarAudioBank[p.avatar]?.[kind]?.[index];return clip?{id:p.id,kind,index,duration:(clip.duration||8)+(p.avatar===2&&kind==='failure'?2:0)}:null;}).filter(Boolean);const good=items.filter(i=>i.kind==='success'),bad=items.filter(i=>i.kind==='failure');let selected=good.length&&bad.length?[good[cursor%good.length],bad[cursor%bad.length]]:items.length?Array.from({length:Math.min(2,items.length)},(_,i)=>items[(cursor+i)%items.length]):[];const duration=Math.max(0,...items.map(i=>i.duration),selected.reduce((n,i)=>n+i.duration,0));s.avatarReactions={key:s.questionId,startsAt:Date.now()+350,until:Date.now()+Math.ceil(duration*1000)+1800,items,selected:selected.map(i=>i.id)};broadcast(r);}
export const addresses=()=>publicOrigin?[{name:'Verkkopeli',url:publicOrigin}]:Object.entries(networkInterfaces()).flatMap(([name,entries])=>entries.filter(a=>a.family==='IPv4'&&!a.internal).map(a=>({name,address:a.address,url:`http://${a.address}:${port}`}))).sort((a,b)=>Number(/virtual|vethernet|wsl|docker/i.test(a.name))-Number(/virtual|vethernet|wsl|docker/i.test(b.name)));
const send=(s,v)=>{if(s?.readyState===1)s.send(JSON.stringify(v));};
const previewCache=new Map();
function publish(r,capture=false,views=null){
 views??=[{socket:r.host,value:game.snapshot(r)},...[...r.players.values()].map(p=>({socket:p.socket,value:game.snapshot(r,p)}))];
 if(capture)return views;
 for(const view of views){view.value.serverNow=Date.now();send(view.socket,view.value);}
}
const broadcast=createCheckpointWriter(roomStore,{publish,onFailure:r=>console.error('Room storage unavailable; paused:',r.code)});
function randomAvatar(r){const used=new Set([...r.players.values()].map(p=>p.avatar)),free=Array.from({length:AVATAR_COUNT},(_,i)=>i).filter(i=>!used.has(i));if(!free.length)throw new Error('No free avatar');return free[randomInt(free.length)];}
function characterAction(r,p,m){if(!p)return false;if(m.type==='avatar'){
 if(r.state.phase!=='lobby')return false;
 if(!Number.isInteger(m.avatar)||m.avatar<0||m.avatar>=AVATAR_COUNT)return false;
 if([...r.players.values()].some(other=>other.id!==p.id&&other.avatar===m.avatar)){send(p.local?r.host:p.socket,{type:'error',message:'Hahmo on jo varattu. Valitse toinen hahmo.'});return false;}
 p.avatar=m.avatar;p.emote=null;return true;
 }if(m.type==='emote'&&['wave','dance','shrug','taunt'].includes(m.kind)&&(!p.emote||Date.now()-p.emote.at>2000)){p.emote={kind:m.kind,at:Date.now()};return true;}return false;}
function changed(r){r.changed=Date.now();r.state.phaseEnteredAt=r.changed;if(r.state.phase==='question'||r.state.phase==='roundIntro')warmReader(r);broadcast(r);}
function close(r){const q=game.currentQuestion(r);if(game.closeQuestion(r)){history.add(q.id);history.add('family:'+(q.family||q.id));writeFile(historyFile,JSON.stringify([...history])).catch(()=>{});changed(r);}}
function submitAnswer(r,p,m,socket){
 if(game.answer(r,p,m.value,Date.now(),m.questionId)){broadcast(r);return;}
 if(p.answer&&m.questionId===r.state.questionId){broadcast(r);return;}
 send(socket,{type:'answerRejected',questionId:m.questionId,message:'Vastausta ei lukittu. Tarkista vastausaika ja yhteys.'});
}
function pause(r){if(!r.state.pausedAt){r.state.pausedAt=Date.now();broadcast(r);}}
function resume(r){if(r.storageFailed)return;if(r.state.pausedAt){const gap=Date.now()-r.state.pausedAt;for(const key of ['startedAt','deadline','betDeadline','sipDeadline','phaseEnteredAt'])if(r.state[key])r.state[key]+=gap;if(r.state.target){r.state.target.startedAt+=gap;r.state.target.deadline+=gap;}if(r.state.categoryPick)r.state.categoryPick.deadline+=gap;if(r.state.avatarReactions){r.state.avatarReactions.startsAt+=gap;r.state.avatarReactions.until+=gap;}r.changed+=gap;r.state.pausedAt=null;r.state.recovered=false;broadcast(r);}}
const json=(res,value,status=200)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(JSON.stringify(value));};
const server=http.createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://localhost');
 if(url.pathname==='/api/health'){const healthy=!shuttingDown&&![...rooms.values()].some(r=>r.storageFailed);return json(res,{status:healthy?'ok':'unavailable',roomStorage:roomStore.kind},healthy?200:503);}
 if(url.pathname==='/api/config')return json(res,{addresses:addresses(),publicOrigin,port,maxPlayers:MAX_PLAYERS,questions:questionBank.length,categories:topics,categoryCounts,musicQuestions:musicQuestions.length,musicRecordings:new Set(musicQuestions.map(q=>q.deezerId)).size,roundCount:musicQuestions.length?10:9});
 if(url.pathname==='/api/music-preview'&&req.method==='GET'){
  const q=musicQuestions.find(q=>q.id===url.searchParams.get('id'));if(!q)return json(res,{error:'Tuntematon näyte'},404);
  let cached=previewCache.get(q.deezerId);
  if(!cached||cached.until<Date.now()){
   const response=await fetch(`https://api.deezer.com/track/${q.deezerId}`,{signal:AbortSignal.timeout(8000)}),data=await response.json();
   if(!data.preview||!/^https:\/\/[^/]*\.dzcdn\.net\//.test(data.preview))return json(res,{error:'Näyte ei ole saatavilla'},503);
   cached={url:data.preview,until:Date.now()+5*60*1000};previewCache.set(q.deezerId,cached);
  }
  res.writeHead(302,{'Location':cached.url,'Cache-Control':'no-store'});return res.end();
 }
 if(url.pathname==='/api/reader'&&req.method==='POST'){
  let body='';for await(const chunk of req){body+=chunk;if(body.length>2048)return json(res,{error:'Liikaa dataa'},413);}
  const m=JSON.parse(body),r=rooms.get(m.code);if(!r||m.token!==r.token)return json(res,{error:'Ei pääsyä'},403);
  if(m.questionId!==r.state.questionId||r.state.phase!=='question')return json(res,{url:null});
  const url=await Promise.race([readerClip(game.currentQuestion(r),true),new Promise(resolve=>setTimeout(()=>resolve(null),9000))]);return json(res,{url,voice:'Noora / Jessica + Finnish Chatterbox'});
 }
 if(url.pathname==='/api/voice'&&req.method==='POST'){
  let body='';for await(const chunk of req){body+=chunk;if(body.length>2048)return json(res,{error:'Liikaa dataa'},413);}
  const m=JSON.parse(body),room=rooms.get(m.code);if(!room||m.token!==room.token)return json(res,{error:'Ei pääsyä'},403);
  const text=voiceText(room,m.kind,m.playerId);if(!text)return json(res,{url:null});return json(res,{text,url:await voiceClip(text,m.kind)});
 }
 if(url.pathname==='/api/rooms'&&req.method==='POST'){
  if(shuttingDown||rooms.size>=100)return json(res,{error:'Uutta huonetta ei voi luoda juuri nyt.'},503);
  let body='';for await(const chunk of req){body+=chunk;if(body.length>4096)return json(res,{error:'Liikaa dataa'},413);}
  const config=body?JSON.parse(body):{};let code;do{code=randomBytes(3).toString('hex').toUpperCase();}while(rooms.has(code));
  const r={code,token:token(),players:new Map(),host:null,history,changed:Date.now()};game.initQuiz(r,config);rooms.set(code,r);if(!await broadcast(r))return json(res,{error:'Pelihuoneen tallennus ei onnistunut. Yritä hetken kuluttua uudelleen.'},503);warmReader(r);return json(res,{code,token:r.token},201);
 }
 if(url.pathname==='/api/qr'){const value=url.searchParams.get('url')||'';if(value.length>1000||!/^https?:\/\//.test(value))return json(res,{error:'Virheellinen osoite'},400);res.writeHead(200,{'Content-Type':'image/svg+xml'});return res.end(await QRCode.toString(value,{type:'svg',margin:2}));}
 if(!['GET','HEAD'].includes(req.method))return json(res,{error:'Ei tuettu'},405);
 const rel=['/','/join'].includes(url.pathname)?'quiz.html':decodeURIComponent(url.pathname).replace(/^\/+/,''),path=resolve(root,rel);
 if(!path.startsWith(root+'/')&&!path.startsWith(root+'\\'))return json(res,{error:'Ei pääsyä'},403);
 const data=await readFile(path),mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.mp3':'audio/mpeg','.wav':'audio/wav','.json':'application/json'}[extname(path)]||'application/octet-stream';
 res.writeHead(200,{'Content-Type':mime,'Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});res.end(req.method==='HEAD'?undefined:data);
 }catch(e){json(res,{error:e.code==='ENOENT'?'Sivua ei löytynyt':'Virheellinen pyyntö'},e.code==='ENOENT'?404:400);}});
const wss=new WebSocketServer({server,path:'/socket',maxPayload:8192});
wss.on('connection',socket=>{let room,player,isHost=false,alive=true;
 socket.on('pong',()=>alive=true);socket.isAlive=()=>alive;socket.markPing=()=>alive=false;
 socket.on('message',async raw=>{try{if(shuttingDown)return;const m=JSON.parse(raw);if(!room){
  const r=rooms.get(String(m.code||'').toUpperCase());if(!r)return send(socket,{type:'error',message:'Huonetta ei löydy. Tarkista koodi.'});
  if(m.type==='host'&&m.token===r.token){room=r;isHost=true;if(r.host&&r.host!==socket)r.host.close();r.host=socket;if(!r.state.recovered)resume(r);broadcast(r);return;}
  if(m.type!=='join')return send(socket,{type:'error',message:'Virheellinen liittyminen.'});
  let p=[...r.players.values()].find(p=>p.token===m.token);
  if(r.storageFailed)return send(socket,{type:'error',message:'Tallennusyhteys on poikki. Yritä liittyä hetken kuluttua uudelleen.'});
  if(!p){if(r.state.phase!=='lobby')return send(socket,{type:'error',message:'Peli on jo käynnissä.'});if(r.players.size>=MAX_PLAYERS)return send(socket,{type:'error',message:`Huone on täynnä: enintään ${MAX_PLAYERS} pelaajaa.`});
   const name=String(m.name||'Pelaaja').trim().slice(0,20)||'Pelaaja';if([...r.players.values()].some(p=>p.name.toLocaleLowerCase('fi-FI')===name.toLocaleLowerCase('fi-FI')))return send(socket,{type:'error',message:'Nimimerkki on jo käytössä. Valitse toinen nimi.'});p={id:token(),token:token(),name,avatar:randomAvatar(r),socket,bank:r.settings.startBank,correct:0,wrong:0,answerTime:0,pies:3,stamps:0,answer:null,eliminated:false,eliminatedAt:null,sipPending:0,sipTotal:0};r.players.set(p.id,p);
  }else{p.socket?.close();p.socket=socket;}
  room=r;player=p;if(!await broadcast(r))return send(socket,{type:'error',message:'Liittymistä ei voitu tallentaa. Yritä hetken kuluttua uudelleen.'});send(socket,{type:'joined',token:p.token,code:r.code,id:p.id});return;
 }
 if(room.storageFailed)return send(socket,{type:'error',message:'Tallennusyhteys on poikki. Peli jatkuu vasta yhteyden palauduttua.'});
 if(isHost){if(m.type==='forceNext'){room.presentationUntil=0;if(game.forceNextQuestion(room))changed(room);}if(m.type==='presentation'&&room.state.phase==='reveal'&&m.questionId===room.state.questionId){room.presentationQuestion=m.questionId;room.presentationUntil=m.active?Date.now()+25000:0;}if(m.type==='avatarReactions'&&room.state.phase==='reveal'&&!room.state.pausedAt&&m.questionId===room.state.questionId)avatarReactions(room);if(characterAction(room,[...room.players.values()].find(p=>p.local),m))broadcast(room);if(m.type==='next'&&!room.state.pausedAt&&game.next(room))changed(room);
  if(m.type==='sipReady'){const p=[...room.players.values()].find(p=>p.local);if(p&&game.acknowledgeSip(room,p.id))broadcast(room);}
  if(m.type==='category'){const p=[...room.players.values()].find(p=>p.local);if(p&&game.chooseCategory(room,p,m.category))changed(room);}
  if(m.type==='bet'){const p=[...room.players.values()].find(p=>p.local);if(p&&game.placeBet(room,p,m.amount))broadcast(room);}
  if(m.type==='pause'){room.state.pausedAt?resume(room):pause(room);}
  if(m.type==='close'&&!room.state.pausedAt)close(room);
  if(m.type==='skipMusic'&&room.state.phase==='question'&&game.currentRound(room).id==='music'){room.state.phase='reveal';room.state.resolution={events:[],skipped:true};for(const p of room.players.values())p.answer=null;changed(room);}
  if(m.type==='demo'&&room.state.phase==='lobby'&&room.players.size<MAX_PLAYERS&&![...room.players.values()].some(p=>p.local)){const p={id:token(),token:token(),name:'Testipelaaja',avatar:randomAvatar(room),local:true,bank:room.settings.startBank,correct:0,wrong:0,answerTime:0,pies:3,stamps:0,answer:null,eliminated:false,eliminatedAt:null,sipPending:0,sipTotal:0};room.players.set(p.id,p);broadcast(room);}
  if(m.type==='restart'&&['finished','lobby'].includes(room.state.phase)){game.initQuiz(room,m.settings||room.settings);changed(room);}
  if(m.type==='remove'&&room.state.phase==='lobby'){const p=room.players.get(m.id);p?.socket?.close();room.players.delete(m.id);broadcast(room);}
  if(m.type==='answer'||m.type==='act'){const p=[...room.players.values()].find(p=>p.local);if(p){if(m.type==='answer')submitAnswer(room,p,m,socket);if(m.type==='act'&&game.act(room,p,m.target))changed(room);}}
 }else if(player){if(characterAction(room,player,m))broadcast(room);if(m.type==='bet'&&game.placeBet(room,player,m.amount))broadcast(room);if(m.type==='category'&&game.chooseCategory(room,player,m.category))changed(room);if(m.type==='sipReady'&&game.acknowledgeSip(room,player.id))broadcast(room);if(m.type==='answer')submitAnswer(room,player,m,socket);if(m.type==='act'&&game.act(room,player,m.target))changed(room);}
 }catch{send(socket,{type:'error',message:'Pyyntöä ei voitu käsitellä.'});}});
 socket.on('close',()=>{if(!room)return;if(isHost&&room.host===socket){room.host=null;pause(room);}if(player&&player.socket===socket)player.socket=null;broadcast(room);});
});
setInterval(()=>{const now=Date.now();for(const r of rooms.values()){try{if(shuttingDown||r.checkpointBusy||r.storageFailed||r.state.pausedAt||r.host?.readyState!==1)continue;const s=r.state;
 if(s.phase==='reveal'&&!s.introEliminations&&s.resolution?.events?.length&&s.avatarReactions?.key!==s.questionId&&now-r.changed>=5000)avatarReactions(r);
 const maxAge={roundIntro:26000,reveal:37000,target:14000,categoryPick:23000,wager:21000,leaderboard:11000,sipBreak:16000}[s.phase];
 if(r.settings.auto&&maxAge&&now-r.changed>maxAge){
  if(s.phase==='target'){game.expireTarget(r);changed(r);}
  else if(s.phase==='categoryPick'){const pick=s.categoryPick;if(game.chooseCategory(r,null,pick.chosen||pick.choices[randomInt(pick.choices.length)],now,true))changed(r);}
  else if(s.phase==='wager'){if(game.startBetQuestion(r))changed(r);}
  else if(game.next(r))changed(r);
  continue;
 }
 if(s.phase==='question'&&(now>=s.deadline||(game.allAnswered(r)&&now>=s.startedAt+(r.settings.questions<=2?1000:12000))))close(r);
 else if(s.phase==='target'&&now>=s.target.deadline){game.expireTarget(r);changed(r);}
 else if(s.phase==='categoryPick'&&now>=s.categoryPick.deadline){const pick=s.categoryPick,category=pick.chosen||pick.choices[randomInt(pick.choices.length)];if(game.chooseCategory(r,null,category,now,true))changed(r);}
 else if(s.phase==='wager'&&(game.betsComplete(r)||now>=s.betDeadline)){if(game.startBetQuestion(r))changed(r);}
 else if(s.phase==='sipBreak'&&now>=(s.sipDeadline||r.changed+15000)){if(game.next(r))changed(r);}
 else if(r.settings.auto&&['roundIntro','reveal','leaderboard'].includes(s.phase)&&(s.phase!=='reveal'||(now-r.changed>=35000||now>=Math.max(r.presentationQuestion===s.questionId?r.presentationUntil||0:0,s.avatarReactions?.key===s.questionId?s.avatarReactions.until:0)))&&now-r.changed>({roundIntro:game.currentRound(r).id==='final'?23000:17000,reveal:9000,leaderboard:8000}[s.phase])){if(game.next(r))changed(r);}
 }catch(error){console.error('Room recovery:',r.code,error.message);try{r.presentationUntil=0;if(game.forceNextQuestion(r))changed(r);}catch{r.state.pausedAt=now;broadcast(r);}}}},200).unref();
setInterval(()=>{for(const socket of wss.clients){if(!socket.isAlive())socket.terminate();else{socket.markPing();socket.ping();}}},20000).unref();
// Restore before accepting players. A revision conflict stops startup instead of overwriting another server.
for(const room of await roomStore.load()){
 for(const item of room.history)history.add(item);room.history=history;rooms.set(room.code,room);
 if(roomStore.enabled)await roomStore.save(packRoom(room));
}
async function shutdown(){
 if(shuttingDown)return;shuttingDown=true;
 const limit=setTimeout(()=>process.exit(1),25000);limit.unref();
 for(const room of rooms.values())room.state.pausedAt??=Date.now();
 await Promise.all([...rooms.values()].map(room=>broadcast(room)));
 for(const socket of wss.clients)socket.close(1012,'Palvelin käynnistyy uudelleen');
 server.close(()=>process.exit(0));
}
process.once('SIGTERM',shutdown);process.once('SIGINT',shutdown);
server.listen(port,'0.0.0.0',()=>console.log(`Tipsy Drunken Visa: http://localhost:${port}\n${addresses().map(a=>a.url).join('\n')}\nRoom storage: ${roomStore.kind}`));
