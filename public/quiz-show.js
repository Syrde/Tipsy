// Detailed portrait sprites share Tipsy's expressive cartoon stage style.
import {avatarArt} from './quiz-avatars.js';
export function contestant(avatar=0){
 const a=avatarArt[avatar]||avatarArt[0];
 const farmer=a.id===4,row=farmer?0:a.crop?a.crop.top/(a.crop.total-a.crop.height)*100:a.row/9*100,size=farmer?100:a.crop?a.crop.total/a.crop.height*100:1000;
 const sheet=farmer?'/assets/farmer-sprites.png':`/assets/contestants-${a.sheet}.png`;
 return `<span class="contestant sprite-contestant" role="img" aria-label="Pelaajan hahmo" style="--avatar-sheet:url('${sheet}');--avatar-row:${row}%;--avatar-height:${size}%;--avatar-tempo:${a.tempo}s;--avatar-tilt:${a.tilt}deg;--avatar-idle:${a.idle}s;--avatar-delay:${a.delay}s"><span class="avatar-portrait"></span></span>`;
}
export class Show {
 constructor(){this.banks=new Map();this.previousBanks=new Map();this.scene='';this.fresh=false;}
 before(state){const s=state.state,key=`${s.phase}:${s.round}:${s.index}`;this.fresh=key!==this.scene;this.scene=key;this.previousBanks=this.banks;this.banks=new Map(state.players.map(p=>[p.id,p.bank]));document.body.dataset.phase=s.phase;document.body.dataset.round=s.roundInfo.id;document.body.dataset.fresh=this.fresh?'yes':'no';}
 after(state){
  for(const el of document.querySelectorAll('.podium[data-player]')){
   const p=state.players.find(p=>p.id===el.dataset.player),delta=this.previousBanks.has(p.id)?p.bank-this.previousBanks.get(p.id):0;
   el.classList.toggle('out',!!p.eliminated);
   const gesture=p.emote&&Date.now()-p.emote.at<3500?p.emote.kind:null;if(gesture){el.classList.add('gesture-'+gesture);setTimeout(()=>el.classList.remove('gesture-'+gesture),Math.max(0,3500-(Date.now()-p.emote.at)));}
   const event=state.state.resolution?.events?.find(e=>e.id===p.id||e.playerId===p.id);if(state.state.phase==='reveal'&&event)el.classList.add(event.correct?'celebrate':'defeat');
   if(delta){el.classList.add(delta>0?'celebrate':'defeat');const tag=document.createElement('span');tag.className='score-pop';tag.textContent=`${delta>0?'+':''}${delta}`;el.append(tag);}
  }
  if(!this.fresh)document.querySelectorAll('.fade').forEach(el=>el.classList.remove('fade'));
 }
}
