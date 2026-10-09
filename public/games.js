import { W,H,colors,forest,bar,jorma,hunter,sausage,pig,deer,round,text,line } from './art.js';
import { getGame } from './story.js';

export const bridgeSetup = choice => choice === 'shortcut' ? { gaps:[4,4,2], boards:[1,1,1,2,2,3] } : { gaps:[3,2,3], boards:[1,2,2,3] };
export function callQuestions(state) {
  const food=state.inventory.includes('Eväät')||state.inventory.includes('Makkara');
  const jacket=state.inventory.includes('Kadonnut takki');
  return [
    {q:'”Mitä sinä lupasit täksi aamuksi?”',answers:['Syntymäpäiväaamiaisen','Metsästyspäivän','Uuden harmonikan'],correct:0},
    {q:'”Onko sinulla mitään syötävää?”',answers:['Minulla on ruokaa','Ei vielä mitään','Tilasin seitsemän kakkua'],correct:food?0:1},
    {q:'”Miksi kuulostat siltä kuin olisit metsässä?”',answers:['Keittiössä on uusi äänimaisema','Koska olen metsässä','Olen yksityiskoneessa'],correct:1},
    {q:'”Onko takki sentään tallella?”',answers:['Ei, se jäi villisian luo','On, se on mukana','Takki lähti Espanjaan'],correct:jacket?0:1}
  ].map((q,i)=>{const shift=(i+1)%3;return {...q,answers:[...q.answers.slice(shift),...q.answers.slice(0,shift)],correct:(q.correct-shift+3)%3};});
}
export const dominoCards = ['Hae kotiavaimet','Pakkaa aamiainen','Ota kyyti','Avaa kotiovi'];
export const dominoValid = order => order.length===4 && order.every((value,index)=>value===index);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

export class Game {
  constructor(state,onFinish,onSound=()=>{}) {
    this.state=state;this.type=getGame(state.chapter,state.choice);this.onFinish=onFinish;this.onSound=onSound;
    this.elapsed=0;this.keys={};this.edges=new Set();this.done=false;this.notice='';this.noticeUntil=0;this.progress=0;
    this.limit={runner:40,duel:42,aim:50,stealth:50,bridge:90,call:48,traffic:60,studio:65,domino:75}[this.type];
    this.d={};
    if(this.type==='runner')this.d={y:530,vy:0,obstacles:[],spawn:.8,hits:0,invincible:0,distance:0};
    if(this.type==='duel')this.d={round:-1,dodged:false,countered:false,resolved:false,hits:0,wins:0,pose:0};
    if(this.type==='aim')this.d={x:600,y:320,hits:0,shots:0,lastShot:-1,flash:0,required:state.choice==='bag'?4:state.inventory.includes('Kivääri')?3:6,maxShots:state.choice==='bag'?12:state.inventory.includes('Kivääri')?14:22};
    if(this.type==='stealth')this.d={x:100,hits:0,lastHit:-2,basket:false,awake:false,warning:false};
    if(this.type==='bridge'){const setup=bridgeSetup(state.choice);this.d={...setup,used:setup.boards.map(()=>false),filled:setup.gaps.map(()=>0),placed:[],selected:0,mistakes:0};}
    if(this.type==='call')this.d={questions:callQuestions(state),index:0,correct:0,questionTime:0,answerTime:state.choice==='bluff'?7:11,answered:[]};
    if(this.type==='traffic')this.d={green:false,y:600,passed:0,hits:0};
    if(this.type==='studio')this.d={camera:300,light:30,backdrop:0,hold:0,requiredBackdrop:state.choice==='garden'?1:0};
    if(this.type==='domino')this.d={order:[],selected:0,available:[2,0,3,1],tries:0,simulation:false,simTime:0};
  }
  input(key,down) {if(down&&!this.keys[key])this.edges.add(key);this.keys[key]=down;}
  aim(x,y) {if(this.type==='aim'){this.d.x=clamp(x*W,45,W-45);this.d.y=clamp(y*H,125,H-65);}}
  resetInputs(){this.keys={};this.edges.clear();}
  feedback(message,good=false) {this.notice=message;this.noticeUntil=this.elapsed+2;this.onSound(good?'good':'bad');}
  complete(passed,progress=this.progress,quality=0) {if(this.done)return;this.done=true;this.resetInputs();this.onFinish({passed,progress:clamp(progress,0,1),quality:clamp(quality,0,1)});}
  step(dt) {
    if(this.done)return;dt=clamp(dt,0,.05);this.elapsed+=dt;
    const d=this.d,has=k=>this.edges.has(k),held=k=>Boolean(this.keys[k]);
    if(this.type==='runner') {
      if((has('action')||has('up'))&&d.y>=529){d.vy=-650;this.onSound('jump');}
      d.vy+=1700*dt;d.y=Math.min(530,d.y+d.vy*dt);if(d.y===530)d.vy=0;
      d.spawn-=dt;d.invincible-=dt;d.distance+=dt;
      if(d.spawn<=0){d.obstacles.push({x:W+60,h:d.distance%5<2?65:42});d.spawn=1.35+Math.sin(d.distance)*.25;}
      for(const o of d.obstacles){o.x-=285*dt;if(Math.abs(o.x-240)<40&&d.y>530-o.h+12&&d.invincible<=0){d.hits++;d.invincible=1.5;this.feedback('Kanto 1 — Jorma 0');}}
      d.obstacles=d.obstacles.filter(o=>o.x>-60);this.progress=clamp(d.distance/30,0,1);
      if(d.hits>=4)this.complete(false);else if(d.distance>=30)this.complete(true,1,.65*(1-d.hits/4)+.35);
    }
    if(this.type==='duel') {
      const cycle=Math.floor(this.elapsed/3),phase=this.elapsed%3;
      if(cycle!==d.round){d.round=cycle;d.dodged=false;d.countered=false;d.resolved=false;d.pose=0;}
      const right=cycle%2===0;
      if(phase>.4&&phase<1.35&&(has(right?'right':'left'))){d.dodged=true;d.pose=right?1:-1;this.feedback('Väistetty. Nyt vastaisku!',true);}
      if(has('action')&&d.dodged&&!d.countered&&phase>=1.1&&phase<2.3){d.countered=true;d.wins++;this.feedback('Metsästäjä horjahtaa!',true);}
      if(phase>=2.35&&!d.resolved){d.resolved=true;if(!d.dodged){d.hits++;this.feedback('Jorma sai uuden näkökulman maasta.');}}
      this.progress=d.wins/5;if(d.hits>=4)this.complete(false);else if(d.wins>=5)this.complete(true,1,.7*(1-d.hits/4)+.3*(1-this.elapsed/this.limit));
    }
    if(this.type==='aim') {
      d.x=clamp(d.x+(Number(held('right'))-Number(held('left')))*380*dt,30,W-30);d.y=clamp(d.y+(Number(held('down'))-Number(held('up')))*310*dt,130,H-70);
      const target=this.target();
      if(has('action')&&this.elapsed-d.lastShot>.35){d.lastShot=this.elapsed;d.shots++;d.flash=.16;this.onSound('shoot');if(Math.hypot(d.x-target.x,d.y-target.y)<target.r){d.hits++;this.feedback('Osuma!',true);}else this.feedback('Ohi. Puut eivät kommentoi.');}
      d.flash=Math.max(0,d.flash-dt);this.progress=d.hits/d.required;
      if(d.hits>=d.required)this.complete(true,1,.75*d.hits/d.shots+.25*(1-this.elapsed/this.limit));else if(d.shots>=d.maxShots)this.complete(false);
    }
    if(this.type==='stealth') {
      const phase=this.elapsed%5.8;d.warning=phase>=3.1&&phase<4.15;d.awake=phase>=4.15;
      const moving=held('right')||held('action');
      if(moving){if(!d.awake)d.x+=dt*(this.state.choice==='basket'?170:220);else if(this.elapsed-d.lastHit>1.3){d.hits++;d.lastHit=this.elapsed;d.x=Math.max(100,d.x-75);this.feedback('Sika kuuli sinut!');}}
      if(this.state.choice==='basket'&&d.x>690&&d.x<840&&has('up')){d.basket=true;this.feedback('Juhlakori mukana!',true);}
      d.x=Math.min(1080,d.x);this.progress=(d.x-100)/940;
      if(d.hits>=3)this.complete(false);else if(d.x>=1040&&(this.state.choice!=='basket'||d.basket))this.complete(true,1,.7*(1-d.hits/3)+.3*(1-this.elapsed/this.limit));
    }
    if(this.type==='bridge') {
      const remaining=d.boards.map((_,i)=>i).filter(i=>!d.used[i]);
      if(remaining.length&&(has('left')||has('right'))){const at=remaining.indexOf(d.selected);d.selected=remaining[(at+(has('right')?1:-1)+remaining.length)%remaining.length];}
      if(has('action')&&remaining.length){const gap=d.filled.findIndex((v,i)=>v<d.gaps[i]);if(gap>=0){const length=d.boards[d.selected];if(d.filled[gap]+length>d.gaps[gap]){d.mistakes++;this.feedback('Liian pitkä tähän aukkoon.');}else{d.placed.push({gap,index:d.selected,length});d.filled[gap]+=length;d.used[d.selected]=true;d.selected=d.used.findIndex(v=>!v);this.onSound('click');}}}
      if(has('back')&&d.placed.length){const last=d.placed.pop();d.filled[last.gap]-=last.length;d.used[last.index]=false;d.selected=last.index;}
      this.progress=d.filled.reduce((a,b)=>a+b,0)/d.gaps.reduce((a,b)=>a+b,0);
      if(has('confirm')){const good=d.filled.every((v,i)=>v===d.gaps[i]);if(good)this.complete(true,1,.7*(1-this.elapsed/this.limit)+.3*Math.max(0,1-d.mistakes/5));else{d.mistakes++;this.feedback('Silta katkeaa vielä. Korjaa ennen lähtöä.');}}
    }
    if(this.type==='call') {
      d.questionTime+=dt;let answer=has('one')?0:has('two')?1:has('three')?2:null;
      if(answer!==null||d.questionTime>=d.answerTime){const q=d.questions[d.index],correct=answer===q.correct;d.answered.push({correct,answer});if(correct)d.correct++;this.feedback(correct?'Selitys pysyy kasassa.':'”Jorma. Mieti vielä mitä sanoit.”',correct);d.index++;d.questionTime=0;}
      this.progress=d.correct/4;if(d.index>=4)this.complete(d.correct>=3,this.progress,d.correct/4);
    }
    if(this.type==='traffic') {
      if(has('action'))d.green=!d.green;
      if(d.green)d.y-=dt*(this.state.choice==='rush'?255:195);
      const near=this.crossCars().some(car=>Math.abs(car.x-600)<105);
      if(d.green&&Math.abs(d.y-338)<65&&near){d.hits++;d.green=false;d.y=600;this.feedback('Hätäjarrutus! Kokeile seuraavaa väliä.');}
      if(d.y<160){d.passed++;d.y=600;d.green=false;this.feedback('Yksi kyyti perillä.',true);}
      this.progress=d.passed/4;if(d.hits>=3)this.complete(false);else if(d.passed>=4)this.complete(true,1,.7*(1-d.hits/3)+.3*(1-this.elapsed/this.limit));
    }
    if(this.type==='studio') {
      d.camera=clamp(d.camera+(Number(held('right'))-Number(held('left')))*270*dt,80,1120);
      d.light=clamp(d.light+(Number(held('up'))-Number(held('down')))*38*dt,0,100);
      if(has('action'))d.backdrop=(d.backdrop+1)%3;
      const target=this.studioTarget();const good=Math.abs(d.camera-target.camera)<65&&Math.abs(d.light-target.light)<13&&d.backdrop===d.requiredBackdrop;
      if(good)d.hold+=dt;this.progress=d.hold/8;
      if(d.hold>=8)this.complete(true,1,.6+.4*(1-this.elapsed/this.limit));
    }
    if(this.type==='domino') {
      if(d.simulation){d.simTime+=dt;if(d.simTime>=4)this.complete(true,1,.7*(d.tries? .6:1)+.3*(1-this.elapsed/this.limit));}
      else{
        if(d.available.length&&(has('left')||has('right')))d.selected=(d.selected+(has('right')?1:-1)+d.available.length)%d.available.length;
        if(has('action')&&d.available.length){d.order.push(d.available.splice(d.selected,1)[0]);d.selected=Math.min(d.selected,d.available.length-1);this.onSound('click');}
        if(has('back')&&d.order.length){d.available.push(d.order.pop());d.selected=d.available.length-1;}
        this.progress=d.order.filter((v,i)=>v===i).length/4;
        if(has('confirm')){if(dominoValid(d.order)){d.simulation=true;this.feedback('Ketju käynnistyy!',true);}else if(d.tries===0){d.tries++;d.available=[2,0,3,1];d.order=[];d.selected=0;this.feedback('Domino kaatui. Vielä yksi yritys.');}else this.complete(false);}
      }
    }
    this.edges.clear();
    if(this.elapsed>=this.limit&&!this.done)this.complete(false);
  }
  target() {return this.state.choice==='bag'?{x:700+Math.sin(this.elapsed*2)*140,y:280+Math.cos(this.elapsed*1.4)*65,r:37}:{x:730+Math.sin(this.elapsed*1.2)*210,y:390+Math.sin(this.elapsed*1.9)*90,r:60};}
  crossCars(){return [0,1,2].map(i=>({x:((this.elapsed*(this.state.choice==='rush'?320:235)+i*610)%1830)-310,color:['#cda659','#5e917d','#b47c67'][i]}));}
  studioTarget(){return {camera:600+Math.sin(this.elapsed*.45)*150,light:63+Math.sin(this.elapsed*.65)*9};}
  view(){
    let hint='',answers=[];const d=this.d;
    if(this.type==='runner')hint=`Makkarajahti ${Math.round(this.progress*100)} % · kompastumiset ${d.hits}/4`;
    if(this.type==='duel')hint=`Väistä ${d.round%2===0?'OIKEALLE':'VASEMMALLE'}, sitten TOIMI · vastaiskut ${d.wins}/5`;
    if(this.type==='aim')hint=`Osumat ${d.hits}/${d.required} · laukauksia jäljellä ${d.maxShots-d.shots}`;
    if(this.type==='stealth')hint=d.awake?'SEIS! Sika on hereillä.':d.warning?'Korvat nousevat. Pysähdy.':'Kuorsaus. Voit liikkua oikealle.';
    if(this.type==='bridge')hint=`Valittu lauta: ${d.boards[d.selected]??'–'} · aukot: ${d.filled.map((v,i)=>`${v}/${d.gaps[i]}`).join(' | ')}`;
    if(this.type==='call'){const q=d.questions[Math.min(d.index,3)];hint=q.q;answers=q.answers;}
    if(this.type==='traffic')hint=`Valo ${d.green?'VIHREÄ':'PUNAINEN'} · perillä ${d.passed}/4 · vaaratilanteet ${d.hits}/3`;
    if(this.type==='studio')hint=`Kamera ${Math.round(d.camera/12)} % · valo ${Math.round(d.light)} % · tausta ${['keittiö','puutarha','baari'][d.backdrop]}`;
    if(this.type==='domino')hint=d.simulation?'Suunnitelma toteutuu…':`Valittu: ${dominoCards[d.available[d.selected]]||'ketju valmis'}`;
    return {type:this.type,time:Math.max(0,Math.ceil(this.limit-this.elapsed)),progress:clamp(this.progress,0,1),hint,answers,notice:this.elapsed<this.noticeUntil?this.notice:'',extra:this.type==='studio'?{camera:Math.round(this.studioTarget().camera/12),light:Math.round(this.studioTarget().light),backdrop:['keittiö','puutarha'][d.requiredBackdrop]}:null};
  }
  draw(ctx) {
    const d=this.d,t=this.elapsed;
    if(['studio','domino','call'].includes(this.type))bar(ctx,t);else forest(ctx,t,this.type==='bridge'?'swamp':this.type==='duel'?'camp':'forest');
    if(this.type==='runner'){
      ctx.fillStyle='#827451';ctx.fillRect(0,535,W,32);for(let i=0;i<20;i++){const x=((i*90-t*285)%W+W)%W;line(ctx,x,552,x+27,552,'#aaa077',3);}
      for(const o of d.obstacles){round(ctx,o.x-25,535-o.h,50,o.h,7,'#67513a','#a28b59');line(ctx,o.x-12,540-o.h,o.x-12,532,'#9a7b4d',3);}
      if(d.invincible<=0||Math.floor(t*10)%2)jorma(ctx,240,d.y,1.15,'run',t);
      sausage(ctx,920-this.progress*600,410+Math.sin(t*7)*23,1.6,t*4);
      text(ctx,'LEGENDAARINEN AAMUPALA',750,195,21,colors.cream,'center');
    }
    if(this.type==='duel'){
      jorma(ctx,410+d.pose*80,555,1.6,d.hits&&t%3>2.4?'hurt':'idle',t);hunter(ctx,790-(d.countered?40:0),555,1.6);
      const phase=t%3;const prompt=phase<1.35?`VÄISTÄ ${d.round%2===0?'OIKEALLE →':'← VASEMMALLE'}`:d.dodged&&!d.countered?'NYT VASTAISKU!':'ODOTA SEURAAVAA';
      round(ctx,300,155,600,75,8,'#15261edf');text(ctx,prompt,600,204,35,colors.amber,'center');
      text(ctx,`Vastaiskut ${d.wins}/5`,350,605,24);text(ctx,`Kolhut ${d.hits}/4`,850,605,24,colors.red,'center');
    }
    if(this.type==='aim'){
      const target=this.target();if(this.state.choice==='bag'){line(ctx,target.x,target.y-80,target.x,target.y,'#e0d1a5',3);round(ctx,target.x-28,target.y-28,56,56,9,'#b49557','#f0ddad');text(ctx,'EVÄÄT',target.x,target.y+7,12,'#372d1c','center');}else deer(ctx,target.x,target.y,1.3);
      ctx.strokeStyle=colors.amber;ctx.lineWidth=2;ctx.beginPath();ctx.arc(d.x,d.y,22,0,7);ctx.stroke();line(ctx,d.x-38,d.y,d.x-12,d.y,colors.amber,2);line(ctx,d.x+12,d.y,d.x+38,d.y,colors.amber,2);line(ctx,d.x,d.y-38,d.x,d.y-12,colors.amber,2);line(ctx,d.x,d.y+12,d.x,d.y+38,colors.amber,2);
      if(d.flash){ctx.fillStyle='#f4d88944';ctx.fillRect(0,0,W,H);}text(ctx,`${d.hits} / ${d.required} OSUMAA`,70,595,30,colors.amber);text(ctx,`${d.maxShots-d.shots} laukausta`,1110,595,24,colors.cream,'right');
    }
    if(this.type==='stealth'){
      jorma(ctx,d.x,585,1.1,this.keys.right?'run':'idle',t);pig(ctx,750,478,d.awake||d.warning);if(!d.awake)text(ctx,d.warning?'…?':'ZZZ',775,360,45,d.warning?colors.amber:colors.cream,'center');
      round(ctx,740,540,65,30,4,'#bb9c62');if(d.basket)text(ctx,'KORI MUKANA',760,607,18,colors.green,'center');
      round(ctx,340,160,520,68,8,'#18291eea');text(ctx,d.awake?'SEIS. NYT SE KATSOO.':d.warning?'KORVAT NOUSEVAT…':'KUORSAUS. LIIKU.',600,203,28,d.awake?colors.red:d.warning?colors.amber:colors.green,'center');
      if(this.state.choice==='basket')text(ctx,'Eväskorin kohdalla: YLÖS',600,265,19,colors.cream,'center');text(ctx,`Herätykset ${d.hits}/3`,90,610,24);
    }
    if(this.type==='bridge'){
      jorma(ctx,130,550,1.2);const unit=42,start=245;
      let pos=start;for(let i=0;i<d.gaps.length;i++){round(ctx,pos-18,460,25,110,4,'#40573b');for(let k=0;k<d.gaps[i];k++){const x=pos+k*unit;round(ctx,x,480,unit-3,30,4,k<d.filled[i]?'#d4b475':'#213c3444',k<d.filled[i]?'#7d6541':'#94a88b');text(ctx,String(k+1),x+unit/2,528,13,'#bbcab0','center');}text(ctx,`${d.filled[i]}/${d.gaps[i]}`,pos+d.gaps[i]*unit/2,439,25,colors.cream,'center');pos+=d.gaps[i]*unit+40;}
      d.boards.forEach((length,i)=>{const x=135+i*150;round(ctx,x,245,115,75,7,d.used[i]?'#203024':d.selected===i?'#f3b54a':'#b09158');text(ctx,d.used[i]?'ASETETTU':`${length} m`,x+57,293,d.used[i]?15:30,d.selected===i&&!d.used[i]?'#27321f':colors.cream,'center');});text(ctx,'LAUTOJA EI VOI SAHATA. SUUNNITTELE JAKO.',600,192,23,colors.cream,'center');
    }
    if(this.type==='call'){
      jorma(ctx,195,595,1.45);const q=d.questions[Math.min(d.index,3)];round(ctx,330,148,790,98,12,'#18251def','#87926d');text(ctx,q.q,725,206,24,colors.cream,'center');
      q.answers.forEach((answer,i)=>{round(ctx,355,280+i*82,730,62,8,'#344831');text(ctx,`${i+1}   ${answer}`,385,319+i*82,24);});text(ctx,`Kysymys ${Math.min(d.index+1,4)}/4  ·  ${Math.max(0,Math.ceil(d.answerTime-d.questionTime))} s`,725,575,24,colors.amber,'center');
    }
    if(this.type==='traffic'){
      ctx.fillStyle='#747364';ctx.fillRect(490,105,220,545);ctx.fillRect(0,275,W,125);for(let i=0;i<8;i++){line(ctx,600,125+i*70,600,152+i*70,'#e0d9b4',5);line(ctx,i*170,337,i*170+80,337,'#e0d9b4',5);}for(const c of this.crossCars()){round(ctx,c.x-65,292,130,44,9,c.color,'#213024');round(ctx,c.x-24,298,39,31,3,'#2a3e36');}round(ctx,570,d.y-44,60,88,8,'#e9b551','#3f3826');round(ctx,579,d.y-25,42,25,4,'#405747');round(ctx,785,150,58,144,9,'#223226');for(let i=0;i<2;i++){ctx.fillStyle=(i===0&&!d.green)?colors.red:(i===1&&d.green)?colors.green:'#3f4d36';ctx.beginPath();ctx.arc(814,186+i*70,19,0,7);ctx.fill();}text(ctx,`PERILLÄ ${d.passed}/4`,110,195,27,colors.cream);text(ctx,'TOIMI VAIHTAA VALON',920,515,20,colors.cream,'center');
    }
    if(this.type==='studio'){
      const target=this.studioTarget();round(ctx,240,155,720,320,9,d.backdrop===0?'#a29d70':d.backdrop===1?'#719276':'#443c31');
      if(d.backdrop===0){round(ctx,270,360,650,40,4,'#605638');round(ctx,770,205,100,126,4,'#ded8b3');}else if(d.backdrop===1){for(let i=0;i<4;i++){ctx.fillStyle='#cfc98b';ctx.beginPath();ctx.arc(340+i*140,220+Math.sin(i)*35,25,0,7);ctx.fill();}}else text(ctx,'PULLOKORIT / PANTIT',600,245,27,colors.cream,'center');
      jorma(ctx,600,460,1.1);ctx.fillStyle=`rgba(0,0,0,${(100-d.light)/160})`;ctx.fillRect(240,155,720,320);
      round(ctx,d.camera-100,210,200,220,2,null,Math.abs(d.camera-target.camera)<65?colors.green:colors.amber);text(ctx,'KAMERA',d.camera,456,14,colors.cream,'center');
      const metrics=[['KAMERA',d.camera/12,target.camera/12],['VALO',d.light,target.light]];metrics.forEach(([label,value,goal],i)=>{const y=530+i*58;text(ctx,label,240,y+5,16);round(ctx,365,y-15,550,12,4,'#3d4b37');round(ctx,365+(goal-5)*5.5,y-17,55,16,3,'#879e65');ctx.fillStyle=colors.amber;ctx.fillRect(365+value*5.5-4,y-22,8,26);});text(ctx,`Tausta: ${['KEITTIÖ','PUUTARHA'][d.requiredBackdrop]} · koossa ${d.hold.toFixed(1)}/8 s`,600,130,22,colors.amber,'center');
    }
    if(this.type==='domino'){
      text(ctx,'AVAIMET ENNEN KYYTIÄ. AAMIAINEN MUKAAN ENNEN LÄHTÖÄ.',600,170,21,colors.cream,'center');
      d.order.forEach((value,i)=>{const active=d.simulation&&d.simTime>i;round(ctx,115+i*255,255,225,130,8,active?'#afca93':'#8f7750');text(ctx,`${i+1}`,135+i*255,286,19,'#2c3524');text(ctx,dominoCards[value],228+i*255,332,19,active?'#1d2e21':colors.cream,'center');if(i<3)text(ctx,'→',355+i*255,333,30,colors.amber,'center');});
      if(!d.simulation){d.available.forEach((value,i)=>{const x=130+i*270;round(ctx,x,465,240,90,8,i===d.selected?colors.amber:'#31432d');text(ctx,dominoCards[value],x+120,520,20,i===d.selected?'#202b1c':colors.cream,'center');});text(ctx,`Korjausyrityksiä ${1-d.tries}`,600,603,21,colors.cream,'center');}else jorma(ctx,150+d.simTime*210,590,1,'run',t);
    }
    const v=this.view();round(ctx,22,20,1156,78,10,'#11221ce8','#617252');text(ctx,`${this.state.chapter+1} / 8`,49,52,17,colors.amber);text(ctx,v.hint.length>90?v.hint.slice(0,87)+'…':v.hint,49,79,18,colors.cream);text(ctx,`${v.time} s`,1123,67,30,colors.amber,'right');round(ctx,0,H-6,W,6,0,'#263b2b');round(ctx,0,H-6,W*clamp(this.progress,0,1),6,0,colors.amber);
    if(t<this.noticeUntil){round(ctx,290,105,620,45,6,'#ede6cbe8');text(ctx,this.notice,600,135,20,'#273522','center');}
  }
}
