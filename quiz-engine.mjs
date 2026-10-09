import { randomInt,randomBytes } from 'node:crypto';
import { rounds } from './quiz-questions.mjs';
import {topics,topicOf} from './quiz-topics.mjs';
export const defaults={startBank:30,correct:2,wrong:2,steal:3,questions:4,seconds:20,auto:true,sips:true};
export function settings(value={}){
  const n=(key,min,max)=>Math.max(min,Math.min(max,Math.round(Number(value[key])||defaults[key])));
  return {startBank:n('startBank',1,100),correct:n('correct',1,10),wrong:n('wrong',1,10),steal:n('steal',1,10),questions:n('questions',1,12),seconds:n('seconds',5,60),auto:value.auto!==false,sips:value.sips!==false,finalOnly:value.finalOnly===true,practiceRound:['wager','category','order','image','music'].includes(value.practiceRound)?value.practiceRound:null};
}
export function shuffle(array){const a=[...array];for(let i=a.length-1;i>0;i--){const j=randomInt(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;}
export function initQuiz(room,config={}){
  room.settings=settings(config);room.rounds=rounds.filter(round=>round.bank.length>0);if(room.settings.practiceRound&&!room.rounds.some(round=>round.id===room.settings.practiceRound))room.settings.practiceRound=null;room.decks=[];room.participants=[];room.answerOrdinal=0;const used=new Set();
  for(const round of room.rounds){
    const fullGame=!room.settings.practiceRound&&!room.settings.finalOnly&&[4,8].includes(room.settings.questions);
    const long=room.settings.questions>=8;
    const count=fullGame?(round.id==='basic'?(long?28:13):round.id==='music'?8:round.id==='world'&&long?6:room.settings.questions):room.settings.questions;
    const family=q=>q.family||q.id;
    const available=shuffle(round.bank.filter(q=>!used.has(family(q))));
    const fresh=available.filter(q=>!room.history?.has(q.id)&&!room.history?.has('family:'+family(q)));
    const pools=[fresh,available.filter(q=>!fresh.includes(q))];const chosen=[];
    for(const pool of pools){const categories=shuffle([...new Set(pool.map(q=>topicOf(q)||'Yleistieto'))]);while(chosen.length<count){let added=false;for(const category of categories){const eligible=pool.filter(q=>(topicOf(q)||'Yleistieto')===category&&!used.has(family(q))),wanted=['medium','easy','medium','hard'][chosen.length%4],raw=eligible.find(q=>q.difficulty===wanted)||eligible.find(q=>q.difficulty==='medium')||eligible[0];if(raw){chosen.push({...raw,category});used.add(family(raw));added=true;}if(chosen.length===count)break;}if(!added)break;}if(chosen.length===count)break;}
    const deck=chosen.map(raw=>{
    if(round.id==='order'){
      const positions=shuffle(raw.items.map((_,i)=>i));
      const canonicalOrder=raw.solution||raw.items.map((_,i)=>i);
      return {...raw,correctItems:canonicalOrder.map(i=>raw.items[i]),items:positions.map(i=>raw.items[i]),solution:canonicalOrder.map(i=>positions.indexOf(i))};
    }
    const optionOrder=shuffle([0,1,2,3]);return {...raw,options:optionOrder.map(i=>raw.options[i]),correct:optionOrder.indexOf(raw.correct)};
  });room.decks.push(deck);}
  room.usedFamilies=used;room.topicQuota=null;

  room.state={phase:'lobby',round:room.settings.finalOnly?room.rounds.length-1:room.settings.practiceRound?room.rounds.findIndex(r=>r.id===room.settings.practiceRound):0,index:0,startedAt:null,deadline:null,questionId:null,resolution:null,target:null,pausedAt:null,breakHandled:false,sipBreak:null,categoryPick:null,categoryHandled:false,finalStarted:false,soloFinal:false,winnerIds:[]};
  for(const p of room.players.values())Object.assign(p,{bank:room.settings.startBank,correct:0,wrong:0,answerTime:0,pies:3,stamps:0,worldBonus:false,answer:null,eliminated:false,eliminatedAt:null,sipPending:0,sipTotal:0});
}
export const currentRound=room=>room.rounds[room.state.round];
export const currentQuestion=room=>room.decks?.[room.state.round]?.[room.state.index];
const categoryOf=q=>topicOf(q)||'Yleistieto';
export const online=p=>!!(p?.local||p?.socket?.readyState===1);
const average=p=>p.correct?p.answerTime/p.correct:Infinity;
const compare=(a,b)=>a.eliminated&&b.eliminated&&a.eliminatedAt===b.eliminatedAt?0:Number(!!a.eliminated)-Number(!!b.eliminated)||(a.eliminated&&b.eliminated?(b.eliminatedAt??0)-(a.eliminatedAt??0):0)||(a.eliminated&&b.eliminated&&a.eliminatedAt===b.eliminatedAt?0:b.bank-a.bank)||b.correct-a.correct||(average(a)===average(b)?0:average(a)-average(b));
export function ranking(room){return [...room.players.values()].sort(compare);}
export function newQuestion(room,now=Date.now()){
  if(currentRound(room).id==='wager'&&!room.state.betsReady){const s=room.state;s.phase='wager';s.betDeadline=now+18000;s.bets={};s.questionId=null;s.resolution=null;s.startedAt=null;s.deadline=null;room.participants=[...room.players.values()].filter(online).map(p=>p.id);for(const p of room.players.values())p.answer=null;return currentQuestion(room);}
  const q=currentQuestion(room);room.state.phase='question';room.state.questionId=randomBytes(12).toString('hex');room.state.startedAt=now+3000;room.state.deadline=room.state.startedAt+(currentRound(room).id==='music'?Math.max(30,room.settings.seconds):currentRound(room).id==='order'?Math.max(20,room.settings.seconds):room.settings.seconds)*1000;room.state.resolution=null;room.state.target=null;
  room.state.breakHandled=false;room.state.sipBreak=null;room.state.categoryHandled=false;room.state.categoryPick=null;
  room.state.avatarReactions=null;
  room.state.selectedCategory=null;room.state.selectedCategoryBy=null;
  room.participants=[...room.players.values()].filter(p=>currentRound(room).id==='final'?!p.eliminated:online(p)).map(p=>p.id);
  for(const p of room.players.values())p.answer=null;
  return q;
}
export function answer(room,player,value,now=Date.now(),questionId=null){
  const s=room.state,q=currentQuestion(room);
  if(s.phase!=='question'||s.pausedAt||questionId!==s.questionId||now<s.startedAt||now>=s.deadline||player.answer||!room.participants.includes(player.id))return false;
  const isOrder=currentRound(room).id==='order';
  if(isOrder){
    if(!Array.isArray(value)||value.length!==q.items.length)return false;
    // New clients send the selected cards themselves; old clients may send positions.
    if(value.every(x=>typeof x==='string'))value=value.map(item=>q.items.indexOf(item));
    if(new Set(value).size!==q.items.length||value.some(x=>!Number.isInteger(x)||x<0||x>=q.items.length))return false;
  }
  else if(!Number.isInteger(value)||value<0||value>3)return false;
  player.answer={value:isOrder?[...value]:value,items:isOrder?value.map(i=>q.items[i]):null,questionId,elapsed:now-s.startedAt,correct:isOrder?correctOrder(q,value):value===q.correct,ordinal:room.answerOrdinal++};
  return true;
}
function correctOrder(q,value){
  const expected=q.correctItems||q.solution.map(i=>q.items[i]);
  return value.length===expected.length&&value.every((index,i)=>q.items[index]===expected[i]);
}
export function allAnswered(room){return room.participants.filter(id=>online(room.players.get(id))).every(id=>room.players.get(id).answer);}
function debit(p,amount){const loss=Math.min(p.bank,amount);p.bank-=loss;p.sipPending=(p.sipPending||0)+loss;p.sipTotal=(p.sipTotal||0)+loss;return loss;}
export function closeQuestion(room){
  if(room.state.phase!=='question')return false;
  const events=[],round=currentRound(room);const q=currentQuestion(room);
  if(round.id==='order')for(const id of room.participants){const a=room.players.get(id)?.answer;if(a)a.correct=correctOrder(q,a.value);}
  const fastest=room.participants.map(id=>room.players.get(id)).filter(p=>p.answer?.correct&&(round.id==='final'||online(p))&&true).sort((a,b)=>a.answer.elapsed-b.answer.elapsed||a.answer.ordinal-b.answer.ordinal)[0];
  if(round.id==='final'){
    const eliminated=[];
    for(const id of room.participants){const p=room.players.get(id),a=p.answer;let gain=0,loss=0;
      if(a?.correct){gain=p.id===fastest?.id?5:2;p.bank+=gain;p.correct++;p.answerTime+=a.elapsed;}else p.wrong++;
      if(p.id!==fastest?.id)loss=debit(p,5);
      const sipLoss=Math.max(0,loss-gain);p.sipPending=(p.sipPending||0)-(loss-sipLoss);p.sipTotal=(p.sipTotal||0)-(loss-sipLoss);
      if(p.bank===0){p.eliminated=true;p.eliminatedAt=room.state.index;eliminated.push({id:p.id,name:p.name});}
      events.push({id,name:p.name,delta:gain-loss,gain,loss:sipLoss,penalty:loss,correct:!!a?.correct,elapsed:a?.elapsed,reason:p.id===fastest?.id?'Nopein oikein +5':a?.correct?'Oikein +2, hitaampi −5':a?'Väärin −5':'Aika loppui −5'});
    }
    const alive=[...room.players.values()].filter(p=>!p.eliminated);
    room.state.finalDone=alive.length<=1&&!room.state.soloFinal||room.state.soloFinal&&(alive.length===0||room.state.index>=7);
    room.state.winnerIds=room.state.finalDone?alive.map(p=>p.id):[];
    room.state.resolution={events,fastest:fastest?.id||null,correct:q.correct,explanation:q.explanation,action:null,eliminated};room.state.phase='reveal';return true;
  }
  for(const id of room.participants){const p=room.players.get(id),a=p.answer;
    if(a?.correct){const reward=round.id==='wager'?(room.state.bets?.[p.id]||0):room.settings.correct;p.bank+=reward;p.correct++;p.answerTime+=a.elapsed;let delta=reward,bonus=0;
      if(round.id==='world'){p.stamps++;if(p.stamps>=3&&!p.worldBonus){p.worldBonus=true;p.bank+=3;bonus=3;delta+=3;}}
      events.push({id,name:p.name,delta,correct:true,elapsed:a.elapsed,reason:bonus?'Oikein + matkabonus':'Oikein'});
    }else{const lost=debit(p,round.id==='wager'?(room.state.bets?.[p.id]||0):room.settings.wrong);p.wrong++;events.push({id,name:p.name,delta:-lost,loss:lost,correct:false,reason:a?'Väärin':'Aika loppui'});}
  }
  room.state.resolution={events,fastest:fastest?.id||null,correct:round.id==='order'?q.solution:q.correct,explanation:q.explanation,action:null};
  const candidates=shuffle([...room.players.values()].filter(p=>online(p)&&(round.id==='pie'||p.id!==fastest?.id)).map(p=>p.id));
  if(fastest&&candidates.length&&['pie','steal'].includes(round.id)){
    room.state.phase='target';room.state.target={actor:fastest.id,candidates,startedAt:Date.now(),stepMs:round.id==='pie'?340:700,deadline:Date.now()+12000};
  }else room.state.phase='reveal';
  return true;
}
export function act(room,actor,targetId=null,now=Date.now()){
  const target=room.state.target,round=currentRound(room);
  if(room.state.phase!=='target'||room.state.pausedAt||!target||target.actor!==actor.id||now>=target.deadline)return false;
  if(round.id==='pie')targetId=target.candidates[Math.floor(Math.max(0,now-target.startedAt)/target.stepMs)%target.candidates.length];
  if(!target.candidates.includes(targetId))return false;const victim=room.players.get(targetId);
  if(!victim)return false;
  const amount=debit(victim,round.id==='steal'?room.settings.steal:3);const selfHit=actor.id===victim.id;const reward=round.id==='pie'&&!selfHit?3:0;if(round.id==='steal')actor.bank+=amount;else actor.bank+=reward;
  room.state.resolution.action={kind:round.id,actor:actor.id,actorName:actor.name,target:victim.id,targetName:victim.name,amount,reward,selfHit};room.state.phase='reveal';room.state.target=null;return true;
}
export function expireTarget(room){if(room.state.phase==='target'){room.state.resolution.action={kind:'miss',reason:'Kohdetta ei valittu ajoissa.'};room.state.phase='reveal';room.state.target=null;}}
export function next(room){
  const s=room.state;
  if(s.phase==='lobby'){if(![...room.players.values()].some(online))return false;s.phase='roundIntro';return true;}
  if(s.phase==='roundIntro'){
    if(currentRound(room).id==='final'&&!s.finalStarted){s.finalStarted=true;s.soloFinal=room.players.size===1;const eliminated=[];for(const p of room.players.values())if(p.bank===0){p.eliminated=true;p.eliminatedAt=-1;eliminated.push({id:p.id,name:p.name});}const alive=[...room.players.values()].filter(p=>!p.eliminated);s.finalDone=alive.length<=1&&!s.soloFinal||alive.length===0;s.winnerIds=s.finalDone?alive.map(p=>p.id):[];if(eliminated.length||s.finalDone){s.introEliminations=true;s.resolution={events:[],eliminated};s.phase='reveal';return true;}}
    newQuestion(room);return true;}
  if(s.phase==='reveal'||s.phase==='sipBreak'){
    if(s.phase==='reveal'&&room.settings.sips&&!s.breakHandled){
      const drinkers=[...room.players.values()].filter(p=>p.sipPending>0||currentRound(room).id==='final'&&room.participants.includes(p.id));s.breakHandled=true;
      if(drinkers.length){s.sipBreak=drinkers.map(p=>({id:p.id,name:p.name,count:p.sipPending,total:p.sipTotal,done:!online(p)}));for(const p of drinkers)p.sipPending=0;s.sipDeadline=Date.now()+15000;s.phase='sipBreak';return true;}
    }
    if(currentRound(room).id==='final'){
      if(s.finalDone){s.phase='finished';return true;}
      if(s.introEliminations){s.introEliminations=false;newQuestion(room);return true;}
      s.index++;if(s.index>=room.decks[s.round].length){const bank=room.rounds[s.round].bank,family=q=>q.family||q.id;const availableTopics=[...new Set(bank.map(categoryOf))],topic=shuffle(availableTopics)[0],eligible=bank.filter(q=>categoryOf(q)===topic);let candidates=shuffle(eligible.filter(q=>!room.usedFamilies.has(family(q))));if(!candidates.length)candidates=shuffle(eligible);const raw=candidates[0],positions=shuffle([0,1,2,3]);room.usedFamilies.add(family(raw));room.decks[s.round].push({...raw,options:positions.map(i=>raw.options[i]),correct:positions.indexOf(raw.correct)});}
      newQuestion(room);return true;
    }
    if(currentRound(room).id==='category'&&s.index+1<room.decks[s.round].length&&!s.categoryHandled){
      s.categoryHandled=true;const categories=room.topicQuota?remainingChoiceTopics(room):[...new Set(currentRound(room).bank.map(categoryOf))].filter(c=>topics.includes(c)),preferred=['Urheilu','Elokuvat ja sarjat','Musiikki','Historia'];const choices=[...preferred.filter(c=>categories.includes(c)),...categories.filter(c=>!preferred.includes(c))];
      const winner=room.players.get(s.resolution?.fastest),automatic=!online(winner);s.categoryPick={actor:automatic?null:winner.id,automatic,choices,chosen:automatic?shuffle(choices)[0]:null,deadline:Date.now()+(automatic?5000:20000)};s.phase='categoryPick';return true;
    }
    if(s.index+1<room.decks[s.round].length){s.index++;s.betsReady=false;newQuestion(room);}else s.phase='leaderboard';return true;}
  if(s.phase==='leaderboard'){if(room.settings.practiceRound){const ranked=ranking(room);s.winnerIds=ranked.filter(p=>compare(p,ranked[0])===0).map(p=>p.id);s.phase='finished';}else if(s.round===room.rounds.length-1)s.phase='finished';else{s.round++;s.index=0;s.phase='roundIntro';if(currentRound(room).id==='pie')for(const p of room.players.values())p.pies=3;}return true;}
  return false;
}
export function acknowledgeSip(room,id){const item=room.state.sipBreak?.find(item=>item.id===id);if(room.state.phase!=='sipBreak'||!item)return false;item.done=true;return true;}
export function placeBet(room,player,amount,now=Date.now()){
 const s=room.state;if(s.phase!=='wager'||s.pausedAt||now>=s.betDeadline||!room.participants.includes(player.id)||Object.hasOwn(s.bets,player.id)||!([1,3,5,8,10].includes(amount)||amount===0&&player.bank===0)||amount>Math.min(10,player.bank))return false;s.bets[player.id]=amount;return true;
}
export function betsComplete(room){return room.participants.every(id=>Object.hasOwn(room.state.bets||{},id)||!online(room.players.get(id)));}
export function startBetQuestion(room){if(room.state.phase!=='wager')return false;for(const id of room.participants)room.state.bets[id]??=room.players.get(id).bank>0?1:0;room.state.betsReady=true;newQuestion(room);return true;}
export function chooseCategory(room,player,category,now=Date.now(),automatic=false){
 const s=room.state,pick=s.categoryPick;if(s.phase!=='categoryPick'||s.pausedAt||!pick||!automatic&&(pick.automatic||player?.id!==pick.actor||now>=pick.deadline)||!pick.choices.includes(category))return false;
 if(room.topicQuota){const slots=remainingChoiceSlots(room),donor=slots.find(slot=>categoryOf(room.decks[slot.round][slot.index])===category);if(!donor)return false;const nextIndex=s.index+1,old=room.decks[s.round][nextIndex];room.decks[s.round][nextIndex]=room.decks[donor.round][donor.index];room.decks[donor.round][donor.index]=old;s.index++;newQuestion(room,now);s.selectedCategory=category;s.selectedCategoryBy=automatic?'Tipsy':player.name;return true;}
 const family=q=>q.family||q.id,bank=currentRound(room).bank.filter(q=>categoryOf(q)===category);let candidates=bank.filter(q=>!room.usedFamilies.has(family(q))&&!room.history?.has(q.id));if(!candidates.length)candidates=bank.filter(q=>!room.usedFamilies.has(family(q)));if(!candidates.length)candidates=bank;
 const raw=shuffle(candidates)[0];if(!raw)return false;const positions=shuffle([0,1,2,3]);room.usedFamilies.add(family(raw));s.index++;room.decks[s.round][s.index]={...raw,options:positions.map(i=>raw.options[i]),correct:positions.indexOf(raw.correct)};newQuestion(room,now);s.selectedCategory=category;s.selectedCategoryBy=automatic?'Tipsy':player.name;return true;
}

function remainingChoiceSlots(room){const slots=[];for(let r=room.state.round;r<room.rounds.length;r++){if(!['category','basic','pie','wager','steal'].includes(room.rounds[r].id))continue;for(let i=r===room.state.round?room.state.index+1:0;i<room.decks[r].length;i++)slots.push({round:r,index:i});}return slots;}
function remainingChoiceTopics(room){return [...new Set(remainingChoiceSlots(room).map(slot=>categoryOf(room.decks[slot.round][slot.index])))];}
export function forceNextQuestion(room){const s=room.state;if(s.pausedAt){const gap=Date.now()-s.pausedAt;if(s.startedAt)s.startedAt+=gap;if(s.deadline)s.deadline+=gap;}s.pausedAt=null;room.presentationUntil=0;s.avatarReactions=null;for(const p of room.players.values())p.answer=null;
 if(s.phase==='lobby')return next(room);
 if(s.phase==='finished')return false;
 if(currentRound(room).id==='final'&&s.finalDone){s.phase='finished';return true;}
 if(s.phase==='roundIntro'){return next(room);}
 if(s.phase==='wager')return startBetQuestion(room);
 if(s.index+1<room.decks[s.round].length){s.index++;s.betsReady=false;newQuestion(room);return true;}
 if(room.settings.practiceRound||s.round+1>=room.rounds.length){s.winnerIds=ranking(room).slice(0,1).map(p=>p.id);s.phase='finished';return true;}
 s.round++;s.index=0;s.phase='roundIntro';return true;
}

export function snapshot(room,viewer=null,now=Date.now()){
  const s=room.state,raw=currentQuestion(room),show=['target','reveal','leaderboard','finished'].includes(s.phase);
  const ranked=ranking(room);
  const ownPlayer=viewer||[...room.players.values()].find(p=>p.local);
  const players=ranked.map((p,index)=>({id:p.id,name:p.name,avatar:p.avatar,emote:p.emote,bank:p.bank,correct:p.correct,wrong:p.wrong,pies:p.pies,stamps:p.stamps,eliminated:!!p.eliminated,sipTotal:p.sipTotal||0,online:online(p),local:!!p.local,answered:!!p.answer,place:ranked.findIndex(other=>compare(p,other)===0)+1}));
  return {type:'state',code:room.code,serverNow:now,hostOnline:room.host?.readyState===1,settings:room.settings,players,viewerId:viewer?.id||null,myAnswer:ownPlayer?.answer?{value:ownPlayer.answer.value}:null,myBet:viewer&&Object.hasOwn(s.bets||{},viewer.id)?s.bets[viewer.id]:null,state:{...s,bets:s.phase==='wager'?Object.fromEntries(Object.keys(s.bets||{}).map(id=>[id,null])):s.bets,roundInfo:{id:currentRound(room).id,title:currentRound(room).title,tag:currentRound(room).tag,description:currentRound(room).description,rule:currentRound(room).rule,icon:currentRound(room).icon},roundCount:room.rounds.length,questionCount:room.decks[s.round].length,totalQuestions:room.settings.practiceRound?room.decks[s.round].length:room.settings.finalOnly?0:room.decks.slice(0,-1).reduce((n,deck)=>n+deck.length,0),answeredCount:room.participants?.filter(id=>room.players.get(id)?.answer).length||0,participantCount:room.participants?.length||0,question:raw&&s.phase!=='wager'?{id:raw.id,prompt:raw.prompt,category:raw.category,options:raw.options,items:raw.items,art:raw.art,audioUrl:raw.audioUrl,...(show?{correct:raw.correct,solution:raw.solution,explanation:raw.explanation}:{})}:null,resolution:show?s.resolution:null}};
}
