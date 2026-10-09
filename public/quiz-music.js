export class Music {
 constructor(){this.main=new Audio('/audio/showtime.mp3');this.finale=new Audio('/audio/showtime-final.mp3');this.track=this.main;for(const t of [this.main,this.finale]){t.loop=true;t.preload='auto';t.volume=0;}this.enabled=localStorage.getItem('tipzy-music')!=='off';this.level=Number(localStorage.getItem('tipzy-music-volume')||.22);this.muted=false;this.ducked=false;this.ready=false;this.target=0;setInterval(()=>{for(const t of [this.main,this.finale]){const target=t===this.track?this.target:0;t.volume=Math.max(0,Math.min(1,t.volume+(target-t.volume)*.18));if(t!==this.track&&t.volume<.001)t.pause();}},70);}
 start(){this.ready=true;this.sync();}
 sync(){this.target=this.enabled&&!this.muted?this.level*(this.ducked?.18:1):0;if(this.ready&&this.enabled&&!this.muted&&this.track.paused)this.track.play().catch(()=>{});if(!this.enabled||this.muted)for(const t of [this.main,this.finale])t.pause();}
 toggle(){this.enabled=!this.enabled;localStorage.setItem('tipzy-music',this.enabled?'on':'off');this.sync();}
 volume(value){this.level=Math.max(0,Math.min(.5,value));localStorage.setItem('tipzy-music-volume',this.level);this.sync();}
 duck(on){this.ducked=on;this.sync();}
 mute(on){this.muted=on;this.sync();}
 final(on){const next=on?this.finale:this.main;if(next!==this.track){this.track=next;this.sync();}}
 async sad(){if(this.muted||!this.ready)return;this.duck(true);const trumpet=new Audio('/audio/sad-trumpet.mp3');trumpet.volume=.65;await new Promise(resolve=>{trumpet.onended=resolve;trumpet.onerror=resolve;trumpet.play().catch(resolve);setTimeout(resolve,5000);});this.duck(false);}
}
