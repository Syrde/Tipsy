import {randomUUID} from 'node:crypto';
import {rounds} from './quiz-questions.mjs';

// Private checkpoint data: never expose this object through an HTTP response.
export function packRoom(room){
 return JSON.parse(JSON.stringify({version:1,checkpointId:randomUUID(),savedAt:Date.now(),code:room.code,token:room.token,
  settings:room.settings,roundIds:room.rounds.map(r=>r.id),decks:room.decks,state:room.state,changed:room.changed,
  participants:room.participants,answerOrdinal:room.answerOrdinal,topicQuota:room.topicQuota,
  usedFamilies:[...room.usedFamilies],history:[...room.history],reactionCursor:room.reactionCursor||0,
  players:[...room.players.values()].map(({socket,...player})=>player)}));
}
export function unpackRoom(data){
 if(data.version!==1||!Array.isArray(data.roundIds)||!Array.isArray(data.decks)||!Array.isArray(data.players)||!data.state)throw new Error('Unsupported room checkpoint');
 const restoredRounds=data.roundIds.map(id=>rounds.find(r=>r.id===id));
 if(restoredRounds.some(r=>!r)||restoredRounds.length!==data.decks.length)throw new Error('Checkpoint question rounds do not match this release');
 const room={...data,rounds:restoredRounds,players:new Map(data.players.map(p=>[p.id,{...p,socket:null}])),
  usedFamilies:new Set(data.usedFamilies),history:new Set(data.history),host:null,presentationUntil:0};
 if(!['lobby','finished'].includes(room.state.phase)){
  room.state.pausedAt??=data.savedAt;
  room.state.recovered=true;
 }
 room.state.avatarReactions=null;
 delete room.state.storageNotice;
 return room;
}

export function createRoomStore(){
 const endpoint=process.env.SUPABASE_URL,key=process.env.SUPABASE_SECRET_KEY;
 if(!endpoint&&!key){
  if(process.env.TIPZY_REQUIRE_PERSISTENCE==='1')throw new Error('Set SUPABASE_URL and SUPABASE_SECRET_KEY before deployment');
  return {enabled:false,kind:'memory',async load(){return [];},async save(){}};
 }
 if(!endpoint||!key)throw new Error('Both Supabase environment variables are required');
 const base=new URL(endpoint);
 if(base.protocol!=='https:'||base.username||base.password)throw new Error('SUPABASE_URL must be an HTTPS project URL');
 const headers={apikey:key,'Content-Type':'application/json'};
 if(key.startsWith('eyJ'))headers.Authorization=`Bearer ${key}`;
 const revisions=new Map();
 async function request(path,options={}){
  const response=await fetch(new URL(path,base.origin),{...options,headers,signal:AbortSignal.timeout(8000)});
  // Do not print response bodies: they may include private data or connection details.
  if(!response.ok)throw new Error(`Room database returned HTTP ${response.status}`);
  return response.json();
 }
 return {enabled:true,kind:'supabase',async load(){
  const query=new URLSearchParams({select:'code,revision,payload',expires_at:`gt.${new Date().toISOString()}`,order:'code.asc'});
  const rows=[];
  for(let offset=0;;offset+=100){
   const page=await request(`/rest/v1/tipzy_rooms?${query}&limit=100&offset=${offset}`);
   for(const row of page){revisions.set(row.code,row.revision);rows.push(unpackRoom(row.payload));}
   if(page.length<100)break;
  }
  return rows;
 },async save(payload){
  const revision=await request('/rest/v1/rpc/tipzy_save_room',{method:'POST',body:JSON.stringify({
   p_code:payload.code,p_payload:payload,p_expected_revision:revisions.get(payload.code)||0,
   p_expires_at:new Date(Date.now()+7*24*60*60*1000).toISOString()})});
  if(!Number.isSafeInteger(revision)||revision<1)throw new Error('Room database returned an invalid revision');
  revisions.set(payload.code,revision);
 }};
}

// Coalesce answer bursts while preserving write order and acknowledging only saved data.
export function createCheckpointWriter(store,{publish,onFailure}){
 const jobs=new Map();
 function enqueue(room){
  if(!store.enabled){publish(room);return Promise.resolve(true);}
  let job=jobs.get(room.code);
  if(!job){job={running:false,pending:null,failed:null};jobs.set(room.code,job);}
  return new Promise(resolve=>{
   const waiters=job.pending?.waiters||[];waiters.push(resolve);
   job.pending={payload:packRoom(room),view:publish(room,true),waiters};room.checkpointBusy=true;
   if(!job.running)void pump(room,job);
  });
 }
 async function pump(room,job){
  job.running=true;
  while(job.failed||job.pending){
   const retry=!!job.failed,batch=job.failed||job.pending;
   if(!retry)job.pending=null;
   try{
    await store.save(batch.payload);
    if(retry){job.failed=null;continue;}
    if(room.storageFailed){room.storageFailed=false;delete room.state.storageNotice;batch.view=publish(room,true);}
    publish(room,false,batch.view);
    batch.waiters.forEach(resolve=>resolve(true));
   }catch{
    const first=!room.storageFailed;room.storageFailed=true;
    room.state.pausedAt??=Date.now();
    room.state.storageNotice='Tallennusyhteys katkesi. Peli on tauolla. Yhteyttä yritetään palauttaa.';
    batch.waiters.forEach(resolve=>resolve(false));batch.waiters=[];
    job.failed=batch;
    // After an ambiguous timeout, retry the exact checkpoint ID before writing the paused state.
    const waiters=job.pending?.waiters||[];
    job.pending={payload:packRoom(room),view:null,waiters};
    if(first)onFailure(room);
    publish(room);
    job.running=false;
    setTimeout(()=>{if(!job.running)void pump(room,job);},5000).unref();
    return;
   }
  }
  job.running=false;room.checkpointBusy=false;
 }
 return enqueue;
}
