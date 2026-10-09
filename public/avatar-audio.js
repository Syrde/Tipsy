export class AvatarAudio {
 constructor(){this.context=null;this.buffers=new Map();this.generation=0;this.source=null;this.ready=false;}
 unlock(){this.ready=true;try{const Context=window.AudioContext||window.webkitAudioContext;this.context??=new Context();this.context.resume().catch(()=>{});}catch{}}
 buffer(url){if(!this.context)return Promise.resolve(null);if(!this.buffers.has(url))this.buffers.set(url,fetch(url,{signal:AbortSignal.timeout(4000)}).then(r=>{if(!r.ok)throw new Error('Missing reaction');return r.arrayBuffer();}).then(b=>this.context.decodeAudioData(b)).catch(()=>{this.buffers.delete(url);return null;}));return this.buffers.get(url);}
 prepare(profile){if(this.ready&&profile)for(const clip of [...profile.success,...profile.failure])this.buffer(clip.url);}
 stop(){this.generation++;try{this.source?.stop();}catch{}this.html?.pause();this.finishPlayback?.();this.finishPlayback=null;this.html=null;this.source=null;this.music?.duck(false);this.music=null;document.querySelector('#avatar-reaction-caption')?.remove();document.querySelectorAll('.avatar-talking').forEach(el=>el.classList.remove('avatar-talking'));}
 async play(buffer,generation,url){if(generation!==this.generation)return;try{await Promise.race([this.context?.resume(),new Promise(resolve=>setTimeout(resolve,500))]);}catch{}if(generation!==this.generation)return;
  await new Promise(resolve=>{let timer;const finish=()=>{clearTimeout(timer);if(this.finishPlayback===finish)this.finishPlayback=null;resolve();};this.finishPlayback=finish;timer=setTimeout(()=>{if(generation===this.generation){try{this.source?.stop();}catch{}this.html?.pause();}finish();},Math.min(18000,(buffer?.duration||12)*1000+1500));
   if(buffer&&this.context?.state==='running'){try{const source=this.context.createBufferSource(),gain=this.context.createGain();source.buffer=buffer;gain.gain.value=.9;source.connect(gain);gain.connect(this.context.destination);this.source=source;source.onended=()=>{if(this.source===source)this.source=null;finish();};source.start();return;}catch{}}
   if(!url)return finish();const clip=new Audio(url);clip.volume=.9;this.html=clip;clip.onended=finish;clip.onerror=finish;clip.play().catch(()=>{window.dispatchEvent(new Event('avatar-audio-blocked'));finish();});
  });
 }
 async run(items,valid,music=null){this.stop();if(!this.ready)return;const generation=this.generation;this.music=music;music?.duck(true);
  try{for(const item of items){if(!valid()||generation!==this.generation)break;const buffer=await this.buffer(item.clip.url);if(!valid()||generation!==this.generation)break;
   const panel=document.createElement('div');panel.id='avatar-reaction-caption';panel.className='avatar-reaction-caption';panel.setAttribute('role','status');const title=document.createElement('strong'),text=document.createElement('span');title.textContent=item.player.name;text.textContent=item.clip.text;panel.append(title,text);document.querySelector('#avatar-reaction-caption')?.remove();document.body.append(panel);
   const podium=document.querySelector(`[data-player="${item.player.id}"]`);podium?.classList.add('avatar-talking');
   if(item.player.avatar===2&&item.kind==='failure')await this.play(await this.buffer('/audio/rocker-sad-metal.wav'),generation,'/audio/rocker-sad-metal.wav');
   if(valid()&&generation===this.generation)await this.play(buffer,generation,item.clip.url);podium?.classList.remove('avatar-talking');
  }}finally{if(generation===this.generation){document.querySelector('#avatar-reaction-caption')?.remove();music?.duck(false);}}
 }
}
