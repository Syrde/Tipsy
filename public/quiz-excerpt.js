export class Excerpt {
 constructor(music){this.music=music;this.audio=new Audio();this.audio.preload='none';this.audio.volume=.85;this.status='idle';this.limit=15;this.generation=0;this.audio.ontimeupdate=()=>{if(this.audio.currentTime>=this.limit)this.finish();};this.audio.onended=()=>this.finish();this.audio.onerror=()=>{this.status='error';this.music?.duck(false);this.paint();};}
 paint(){const panel=document.querySelector('.music-sample');if(panel)panel.dataset.playing=this.status==='playing'?'yes':'no';const label=document.querySelector('#sample-status');if(label)label.textContent=this.status==='playing'?'KUUNTELE…':this.status==='error'?'Näyte ei latautunut. Kokeile uudelleen.':this.status==='paused'?'NÄYTE TAUOLLA':this.status==='ended'?'NÄYTE PÄÄTTYI':'VALMIS KUUNNELTAVAKSI';document.querySelector('#skip-sample')?.toggleAttribute('hidden',this.status!=='error');}
 async play(url){this.stop();this.audio.src=url;this.status='playing';this.music?.duck(true);this.paint();const generation=this.generation;try{await this.audio.play();}catch{if(generation!==this.generation)return;this.status='error';this.music?.duck(false);this.paint();}}
 finish(){this.audio.pause();this.status='ended';this.music?.duck(false);this.paint();}
 stop(){this.generation++;this.audio.pause();this.status='idle';this.music?.duck(false);this.paint();}
 pause(){if(this.status==='playing'){this.audio.pause();this.status='paused';this.music?.duck(false);}this.paint();}
 resume(){if(this.status==='paused'){this.status='playing';this.music?.duck(true);this.audio.play().catch(()=>{this.status='error';this.music?.duck(false);this.paint();});}this.paint();}
}
