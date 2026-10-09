// Fit the television scene into the available viewport, keeping controls outside
// the scaled scene so a TV remote can always reach them.
export class ScreenLayout {
 constructor(app,{phone=false}={}){
  this.app=app;this.phone=phone;this.frame=null;this.content=null;this.pending=0;
  if(phone)return;
  document.body.dataset.screenFit='yes';
  this.schedule=()=>{if(!this.pending)this.pending=requestAnimationFrame(()=>{this.pending=0;this.update();});};
  this.mutations=new MutationObserver(this.schedule);
  this.mutations.observe(app,{childList:true});
  this.sizes=typeof ResizeObserver==='function'?new ResizeObserver(this.schedule):null;
  window.addEventListener('resize',this.schedule);
  window.visualViewport?.addEventListener('resize',this.schedule);
  document.addEventListener('fullscreenchange',this.schedule);
  document.fonts?.ready.then(this.schedule);
  this.schedule();
 }
 update(){
  const header=this.app.querySelector(':scope > header');
  if(!header)return;
  if(!this.frame?.isConnected){
   this.sizes?.disconnect();
   this.textChanges?.disconnect();
   this.frame=document.createElement('div');this.frame.className='screen-frame';
   this.content=document.createElement('div');this.content.className='screen-content';
   const nodes=[...this.app.childNodes].filter(node=>node!==header);
   this.content.append(...nodes);this.frame.append(this.content);this.app.append(this.frame);
   const controls=this.content.querySelector('.host-controls');
   this.dock=controls||document.createElement('div');this.dock.classList.add('screen-dock');
   if(!controls)this.dock.hidden=true;
   this.app.append(this.dock);
   for(const element of [header,this.content,this.dock])this.sizes?.observe(element);
   this.content.addEventListener('load',this.schedule,true);
   if(!this.sizes){
    this.textChanges=new MutationObserver(changes=>{
     if(changes.some(change=>!(change.target.nodeType===1?change.target:change.target.parentElement)?.closest('.timerbar,.countdown')))this.schedule();
    });
    this.textChanges.observe(this.content,{childList:true,subtree:true,characterData:true});
   }
  }
  const width=Math.max(1,document.documentElement.clientWidth);
  const height=Math.max(1,Math.min(window.innerHeight,window.visualViewport?.height||window.innerHeight));
  const headerHeight=header.getBoundingClientRect().height;
  const dockHeight=this.dock.hidden?0:this.dock.getBoundingClientRect().height;
  const availableHeight=Math.max(1,height-headerHeight-dockHeight);
  const players=this.content.querySelectorAll('.podium[data-player]').length||this.content.querySelectorAll('.rankrow').length;
  const narrow=width<=650;
  const sceneWidth=Math.max(narrow?360:720,Math.min(1600,width));
  this.frame.style.top=headerHeight+'px';this.frame.style.height=availableHeight+'px';
  this.content.style.width=sceneWidth+'px';
  this.content.style.setProperty('--scene-height',availableHeight+'px');
  this.content.style.setProperty('--player-columns',String(narrow?(players>4?4:2):players>12?10:players>4?6:4));
  this.content.style.setProperty('--list-columns',String(!narrow&&players>8?4:2));
  this.content.style.setProperty('--pie-columns',String(narrow?4:players>12?10:players>4?6:4));
  const naturalHeight=Math.max(1,this.content.offsetHeight,this.content.scrollHeight);
  const scale=Math.min(width/sceneWidth,availableHeight/naturalHeight);
  this.content.style.setProperty('--scene-scale',String(scale));
 }
}
