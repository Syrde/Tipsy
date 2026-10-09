import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {readFile,stat} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
const run=promisify(execFile),pending=new Map(),queue=[];
let voice=null,active=0,paid=false;
try{const config=JSON.parse(await readFile('.tipzy-reader-voice.json','utf8'));if(config.approved===true){if(config.provider==='Chatterbox'||(config.provider==='ElevenLabs'&&config.voice==='cgSgspJ2msm6clMCkdW9')){voice='cgSgspJ2msm6clMCkdW9';paid=true;}else if(['en-US-EmmaMultilingualNeural','en-US-AvaMultilingualNeural'].includes(config.voice))voice=config.voice;}}catch{}
const folder=resolve(paid?'public/audio/noora-jessica-questions':'public/audio/noora-free-questions');
const idOf=q=>createHash('sha256').update(paid?'jessica-v3-fi-1.03:'+q.prompt:`${voice}:0:${q.prompt}`).digest('hex').slice(0,24);
export async function cachedReader(q){if(!voice||!q?.prompt)return null;const id=idOf(q);try{if((await stat(resolve(folder,id+'.mp3'))).size>1000)return `/audio/${paid?'noora-jessica-questions':'noora-free-questions'}/${id}.mp3`;}catch{}const localId=createHash('sha256').update('finnish-cp986-fi-noora-20261007-v1:'+q.prompt).digest('hex').slice(0,24);try{if((await stat(resolve('public/audio/noora-finnish-questions',localId+'.mp3'))).size>1000)return `/audio/noora-finnish-questions/${localId}.mp3`;}catch{}return null;}
async function generate(q){if(!voice||paid)return cachedReader(q);const cached=await cachedReader(q);if(cached)return cached;await run(resolve('.venv/Scripts/python.exe'),[resolve('scripts/generate-free-reader.py'),'--voice',voice,'--text',q.prompt,'--output',resolve(folder,idOf(q)+'.mp3')],{windowsHide:true,timeout:60000}).catch(()=>{});return cachedReader(q);}
function pump(){while(active<2&&queue.length){const job=queue.shift();active++;generate(job.q).catch(()=>null).then(job.resolve).finally(()=>{active--;pending.delete(job.id);pump();});}}
export async function readerClip(q,priority=false){if(!voice)return null;const cached=await cachedReader(q);if(cached)return cached;if(paid||!q?.prompt)return null;const id=idOf(q);if(pending.has(id)){if(priority){const i=queue.findIndex(job=>job.id===id);if(i>0)queue.unshift(...queue.splice(i,1));}return pending.get(id);}
 const promise=new Promise(resolve=>{const job={id,q,resolve};priority?queue.unshift(job):queue.push(job);});pending.set(id,promise);pump();return promise;
}
export function warmReader(room){if(!voice||paid)return;const s=room.state;let n=0;for(let r=s.round;r<room.decks.length&&n<10;r++)for(let i=r===s.round?s.index:0;i<room.decks[r].length&&n<10;i++){readerClip(room.decks[r][i],n===0).catch(()=>{});n++;}}
