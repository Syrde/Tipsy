import assert from 'node:assert/strict';
import {writeFile,mkdir} from 'node:fs/promises';
import * as game from '../quiz-engine.mjs';
import {packRoom,unpackRoom,createCheckpointWriter} from '../quiz-room-store.mjs';
const results=[];
function room(){const r={code:'AABBCC',token:'unit-only',history:new Set(),players:new Map(),host:{readyState:1},changed:Date.now()};game.initQuiz(r,{questions:4,sips:true});for(let i=0;i<20;i++)r.players.set('p'+i,{id:'p'+i,token:'unit-'+i,name:'Testi '+i,avatar:i,bank:30,correct:0,wrong:0,answerTime:0,pies:3,stamps:0,sipPending:0,sipTotal:0,eliminated:false,socket:{readyState:1}});return r;}
function restore(r){const saved=packRoom(r),restored=unpackRoom(JSON.parse(JSON.stringify(saved)));assert.equal(restored.players.size,20);assert.equal(restored.state.recovered,true);assert.ok(restored.state.pausedAt);for(const [id,p]of restored.players){const old=r.players.get(id);for(const k of ['bank','correct','wrong','sipTotal','sipPending','avatar','token'])assert.deepEqual(p[k],old[k]);assert.deepEqual(p.answer,old.answer);p.socket={readyState:1};}restored.host={readyState:1};restored.state.pausedAt=null;return restored;}
for(let round=0;round<10;round++){
 let r=room();r.state.round=round;game.newQuestion(r);const id=game.currentRound(r).id;
 if(id==='wager'){for(const p of r.players.values())assert.equal(game.placeBet(r,p,[1,3,5,8,10][p.avatar%5]),true);r=restore(r);assert.equal(Object.keys(r.state.bets).length,20);game.startBetQuestion(r);}
 const q=game.currentQuestion(r),now=r.state.startedAt+200;
 for(const p of r.players.values()){const correct=p.avatar%2===0,value=id==='order'?(correct?q.solution:[...q.solution].reverse()):correct?q.correct:(q.correct+1)%4;assert.equal(game.answer(r,p,value,now+p.avatar,r.state.questionId),true);}
 r=restore(r);assert.equal([...r.players.values()].filter(p=>p.answer).length,20);assert.equal(game.closeQuestion(r),true);
 if(r.state.phase==='target'){const actor=r.players.get(r.state.target.actor);r=restore(r);assert.equal(game.act(r,r.players.get(actor.id),r.state.target.candidates[0],r.state.target.startedAt+100),true);}
 const score=[...r.players.values()].map(p=>[p.id,p.bank,p.sipTotal]);r=restore(r);assert.equal(game.closeQuestion(r),false);assert.deepEqual([...r.players.values()].map(p=>[p.id,p.bank,p.sipTotal]),score);
 game.next(r);if(r.state.phase==='sipBreak'){const rows=JSON.stringify(r.state.sipBreak),deadline=r.state.sipDeadline;r=restore(r);assert.equal(JSON.stringify(r.state.sipBreak),rows);assert.equal(r.state.sipDeadline,deadline);}
 results.push({round:id,players:20,answersRestored:true,scoresNotAppliedTwice:true,drinkBreakRestored:true});
}
const r=room();r.state.phase='reveal';let calls=0;const savedIds=[],published=[];
const store={enabled:true,async save(payload){savedIds.push(payload.checkpointId);calls++;if(calls===1){await new Promise(resolve=>setTimeout(resolve,60));throw new Error('Simulated lost response after database commit');}}};
const enqueue=createCheckpointWriter(store,{publish(room,capture=false,views=null){const v={bank:room.players.get('p0').bank,paused:!!room.state.pausedAt};if(capture)return v;published.push(views||v);},onFailure(){}});
const first=enqueue(r);r.players.get('p0').bank=35;const second=enqueue(r);assert.equal(await first,false);assert.equal(r.storageFailed,true);assert.ok(r.state.pausedAt);await new Promise(resolve=>setTimeout(resolve,5600));assert.equal(await second,true);assert.equal(savedIds[0],savedIds[1]);assert.equal(r.storageFailed,false);assert.equal(r.players.get('p0').bank,35);assert.equal(published.at(-1).bank,35);assert.equal(published.at(-1).paused,true);assert.equal(r.checkpointBusy,false);
const report={checkedAt:new Date().toISOString(),rounds:results,ambiguousTimeout:{sameCheckpointRetried:true,latestStatePreserved:true,staysPausedUntilHostContinues:true,saveCalls:calls},pass:true};await mkdir('.local-tools/qa-cloud',{recursive:true});await writeFile('.local-tools/qa-cloud/recovery-unit.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
