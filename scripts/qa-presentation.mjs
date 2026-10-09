import vm from 'node:vm';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {strict as assert} from 'node:assert';
const source=(await readFile('public/quiz-client.js','utf8')).replace(/^import .*;\r?\n/gm,'').replace(/startScreen\(\);\s*$/,'');
const manifest=JSON.parse(await readFile('public/audio/manifest.json','utf8'));
const app={innerHTML:''},speechNode={textContent:''},body={dataset:{}};
const storage={getItem:()=>null,setItem(){},removeItem(){}};
class AudioStub {
 constructor(url){this.src=url;this.paused=true;this.currentTime=0;this.duration=6;}
 play(){this.paused=false;return Promise.resolve();}pause(){this.paused=true;}addEventListener(){}
}
class MusicStub {duck(){}final(){}pause(){}resume(){}stop(){}start(){}mute(){}sad(){return Promise.resolve();}}
class AvatarStub {stop(){}prepare(){}unlock(){}}
let renderCalls=0,nextFrame=1;const frames=new Map();
class ShowStub {before(s){body.dataset.phase=s.state.phase;}after(){renderCalls++;}}
const muteButton={textContent:'',addEventListener(type,callback){this.click=callback;}};
const document={body,querySelector:s=>s==='#mute'?muteButton:s==='#app'?app:s==='.speech'?speechNode:null,querySelectorAll:()=>[],addEventListener(){}};
const context=vm.createContext({console,document,window:{addEventListener(){}},location:{search:'',pathname:'/',host:'localhost'},URLSearchParams,Audio:AudioStub,Music:MusicStub,Excerpt:MusicStub,AvatarAudio:AvatarStub,ScreenLayout:class{},Show:ShowStub,avatarArt:[],MAX_PLAYERS:20,contestant:()=>'',art:()=>'',lines:{mixed:['Tulokset'],sipBreak:['Tauko'],finalBreak:['Tauko']},drinkQuips:['Tauko'],playAlphabetDialogue:()=>Promise.resolve(),sessionStorage:storage,localStorage:storage,fetch:async()=>({json:async()=>manifest}),AbortSignal,setTimeout,clearTimeout,setInterval:()=>0,Date,WebSocket:class{},requestAnimationFrame:fn=>{const id=nextFrame++;frames.set(id,fn);return id;},cancelAnimationFrame:id=>frames.delete(id)});
vm.runInContext(source+`\nglobalThis.qa={set(m,options={}){state=m;credentials={code:m.code,token:'qa'};mute=options.mute??false;audioReady=options.ready??true;ws={readyState:1,send(){}};},speech(text){speech=text;},header,bindHeader,ready(){return audioReady;},muted(){return mute;},cue,render,receive:receiveState,readQuestion,get(){return {speech,html:app.innerHTML,paused:audio.paused};},stop(){stopVoice();avatarAudio.stop();}};`,context);
const state=(phase,id='new-question')=>({code:'QA0001',players:[{id:'p',name:'Pelaaja',avatar:0,bank:30,correct:0,wrong:0,sipTotal:0,online:true}],settings:{sips:true,correct:2,wrong:2,steal:3},serverNow:Date.now(),state:{phase,round:0,index:0,questionId:id,roundInfo:{id:'basic',title:'Perustieto',tag:'Tietovisa'},roundCount:10,questionCount:13,question:{id:'g-test',prompt:'UUSI KYSYMYS: mikä on oikea vastaus?',options:['A','B','C','D']},startedAt:Date.now()+3000,deadline:Date.now()+23000}});
const observations=[];
for(const options of [{mute:true,ready:true},{mute:false,ready:false}]){
 context.qa.stop();context.qa.set(state('question',JSON.stringify(options)),options);context.qa.speech('VANHA PELAAJA, juo kolme.');context.qa.cue(state('question',JSON.stringify(options)));let error=null;try{context.qa.render();}catch(e){error=e.message;}
 const result=context.qa.get();observations.push({name:'Question replaces old named prompt',options,pass:result.speech==='UUSI KYSYMYS: mikä on oikea vastaus?'&&!error,mainQuestionVisible:result.html.includes('UUSI KYSYMYS: mikä on oikea vastaus?'),error});
}
context.qa.stop();let m=state('question','pause-case');m.state.question.id=Object.keys(manifest.readerQuestions)[0];context.qa.set(m);context.qa.cue(m);try{context.qa.render();}catch{}await new Promise(r=>setTimeout(r,20));
const speaking=!context.qa.get().paused;m={...m,state:{...m.state,pausedAt:Date.now()}};context.qa.set(m);context.qa.cue(m);try{context.qa.render();}catch{}observations.push({name:'Pause stops reader',started: speaking,pass:context.qa.get().paused});context.qa.stop();
{
 const m=state('question','render-burst');context.qa.set(m,{mute:true});const before=renderCalls;context.qa.receive(m);const immediate=renderCalls===before+1;
 for(let i=0;i<20;i++)context.qa.receive({...m,state:{...m.state,answeredCount:i}});
 const deferred=renderCalls===before+1&&frames.size===1;for(const [id,fn] of [...frames]){frames.delete(id);fn();}
 observations.push({name:'New question immediate; 20 answer updates coalesced into one render',pass:immediate&&deferred&&renderCalls===before+2});
 context.qa.receive({...m,state:{...m.state,answeredCount:20}});const next=state('question','render-next-question');next.state.question.prompt='SEURAAVA KYSYMYS';context.qa.receive(next);
 observations.push({name:'Next question cancels pending old scene render',pass:frames.size===0&&context.qa.get().html.includes('SEURAAVA KYSYMYS')});context.qa.stop();
}
{
 context.qa.stop();const m=state('question','reload-audio');m.state.question.id=Object.keys(manifest.readerQuestions)[0];context.qa.set(m,{mute:false,ready:false});context.qa.cue(m);context.qa.bindHeader();
 const prompt=context.qa.header().includes('Jatka ääniä');muteButton.click();await new Promise(resolve=>setTimeout(resolve,20));
 observations.push({name:'Reload shows activation; one click starts current Noora question without muting',pass:prompt&&context.qa.ready()&&!context.qa.muted()&&!context.qa.get().paused});context.qa.stop();
}
await mkdir('.local-tools/qa',{recursive:true});await writeFile('.local-tools/qa/presentation.json',JSON.stringify(observations,null,2));
console.log(JSON.stringify(observations));
if(process.argv.includes('--assert'))assert.ok(observations.every(item=>item.pass),'Presentation regression');
export function renderSnapshot(m){
 context.qa.set(m,{mute:true,ready:true});context.qa.cue(m);context.qa.render();
 const output=context.qa.get();
 if(m.state.phase==='question')assert.ok(output.html.includes(m.state.question.prompt.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))),'Current question missing from main display');
 return output;
}
if(process.argv.includes('--phones')){
 const avatarSource=(await readFile('public/avatar-audio.js','utf8')).replace('export class AvatarAudio','class AvatarAudio');
 let caption=null;const played=[];
 const element=()=>({id:'',textContent:'',children:[],append(...nodes){this.children.push(...nodes);},remove(){if(caption===this)caption=null;},setAttribute(){},classList:{add(){},remove(){}}});
 const phoneDocument={...document,body:{dataset:{},append(node){caption=node;}},createElement:element,querySelector:s=>s==='#avatar-reaction-caption'?caption:s.startsWith('[data-player=')?element():s==='#app'?app:null};
 class PlaybackAudio extends AudioStub{play(){this.paused=false;played.push(this.src);queueMicrotask(()=>this.onended?.());return Promise.resolve();}}
 const phoneContext=vm.createContext({...context,document:phoneDocument,window:{addEventListener(){},dispatchEvent(){}},location:{search:'',pathname:'/join',host:'localhost'},Audio:PlaybackAudio,queueMicrotask});
 vm.runInContext(avatarSource+'\n'+source+`\nglobalThis.phoneQA={set(m){state=m;mute=false;credentials={code:m.code};},unlock(){avatarAudio.unlock();},receive:receiveAvatarReactions,render,stop(){avatarAudio.stop();}};`,phoneContext);
 await new Promise(r=>setTimeout(r,10));
 const checks=[];
 for(const kind of ['success','failure'])for(let index=0;index<2;index++)for(let avatar=0;avatar<20;avatar++){
  const m=state('reveal',`${kind}-${index}-${avatar}`);m.viewerId='p';m.players[0].avatar=avatar;m.state.question.correct=0;m.state.resolution={events:[{id:'p',correct:kind==='success',delta:kind==='success'?2:-2,loss:kind==='success'?0:2,reason:'QA'}]};m.state.avatarReactions={key:m.state.questionId,startsAt:Date.now()-1,items:[{id:'p',kind,index}],selected:[]};
  phoneContext.phoneQA.set(m);phoneContext.phoneQA.unlock();phoneContext.phoneQA.render();const start=played.length;phoneContext.phoneQA.receive(m);await new Promise(r=>setTimeout(r,5));
  assert.ok(played.slice(start).includes(manifest.avatars[avatar][kind][index].url),'Own phone plays own avatar reaction');assert.equal(caption,null,'Caption removed after playback');checks.push({avatar,kind,index,pass:true});phoneContext.phoneQA.stop();
 }
 await writeFile('.local-tools/qa/phone-reactions.json',JSON.stringify({method:'Actual phone controller and AvatarAudio class, simulated audio completion, separately decoded MP3 files',checks},null,2));console.log(JSON.stringify({phoneReactionChecks:checks.length,pass:true}));
}
