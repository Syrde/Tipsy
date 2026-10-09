import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {mkdir,stat,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
const run=promisify(execFile),pending=new Map();
const python=resolve('.venv/Scripts/python.exe');
export const roasts=[
 'pankki on tyhjä. Vittu mikä tietovisan konkurssipesä. Noin kovalla uhoamisella olisi luullut löytyvän edes yksi oikea vastaus.',
 'nyt tuli lähtö. Saatana, sulla oli itsevarmuus kuin professorilla ja vastaukset kuin perseellä näppäiltynä. Istu alas, tietovisan toimitusjohtaja.',
 'sä putosit. Voi vittu mikä tiedon musta aukko. Kysymys meni sisään, ja ulos tuli pelkkää paskaa. Onneksi pokka sentään oli kunnossa.',
 'pankki nolla, suu edelleen käy. Tuolla määrällä paskapuhetta olisi luullut että joku vastauskin osuu. Ei osunut. Näkemiin, saatanan selityskone.'
];
export function voiceText(room,kind,id){
 const p=room.players.get(id);if(!p||!room.settings.sips&&kind==='sip')return null;
 if(kind==='sip'){const item=room.state.sipBreak?.find(x=>x.id===id);if(room.state.phase!=='sipBreak'||!item)return null;return item.count?`${p.name}, juo ${item.count} ${item.count===1?'hörppy':'hörppyä'}.`:`${p.name} selviää kuivalla kurkulla.`;}
 if(kind==='elimination'&&p.eliminated&&room.state.resolution?.eliminated?.some(x=>x.id===id))return `${p.name}. ${roasts[(p.avatar+room.state.index)%roasts.length]}`;
 return null;
}
let balanceUntil=0,balance=0,balancePending=null;
async function voiceBalance(){if(Date.now()<balanceUntil)return balance;if(balancePending)return balancePending;balancePending=run(python,[resolve('scripts/generate-original-voice.py'),'--balance'],{timeout:15000,windowsHide:true}).then(r=>{balance=Number(r.stdout.trim())||0;balanceUntil=Date.now()+60000;return balance;}).catch(()=>0).finally(()=>balancePending=null);return balancePending;}
export async function voiceClip(text,kind){
 const id=createHash('sha256').update('original-oxley-v3:'+text).digest('hex').slice(0,24),folder=resolve('public/audio/tipsy-original-dynamic'),path=resolve(folder,id+'.mp3'),url='/audio/tipsy-original-dynamic/'+id+'.mp3';
 try{if((await stat(path)).size>1000)return url;}catch{}
 if(process.env.TIPZY_OFFLINE_AUDIO==='1')return null;
 if(pending.has(id))return pending.get(id);if(pending.size>=3||await voiceBalance()<=0)return null;
 const job=(async()=>{try{await mkdir(folder,{recursive:true});const source=resolve(folder,id+'.txt');await writeFile(source,text);await run(python,[resolve('scripts/generate-original-voice.py'),'--text-file',source,'--output',path],{timeout:180000,windowsHide:true});return (await stat(path)).size>1000?url:null;}catch{return null;}finally{pending.delete(id);}})();pending.set(id,job);return job;
}
