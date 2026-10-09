export const W = 1200, H = 650;
export const colors = { ink:'#15221b', cream:'#f3e8c6', amber:'#f3b54a', green:'#b1d1a0', red:'#e59177' };
export function round(ctx,x,y,w,h,r,fill,stroke) {ctx.beginPath();ctx.roundRect(x,y,w,h,r);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=2;ctx.stroke();}}
export function text(ctx,value,x,y,size=24,color=colors.cream,align='left',font='sans-serif') {ctx.fillStyle=color;ctx.font=`600 ${size}px ${font}`;ctx.textAlign=align;ctx.fillText(value,x,y);ctx.textAlign='left';}
export function line(ctx,x1,y1,x2,y2,color,width=3) {ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}
const noise = n => {const x=Math.sin(n*93.43)*45831.37;return x-Math.floor(x);};
function tree(ctx,x,y,size,tone) {
  ctx.fillStyle=tone;ctx.fillRect(x-size*.08,y,size*.16,size*.65);
  for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(x,y-size*.65+i*size*.2);ctx.lineTo(x-size*(.28+i*.04),y+i*size*.16);ctx.lineTo(x+size*(.28+i*.04),y+i*size*.16);ctx.closePath();ctx.fill();}
}
export function forest(ctx,t=0,variant='forest') {
  const bg=ctx.createLinearGradient(0,0,0,H);bg.addColorStop(0,'#7d8c69');bg.addColorStop(.5,'#425c45');bg.addColorStop(1,'#172c23');ctx.fillStyle=bg;ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#ccbf84';ctx.beginPath();ctx.arc(930,115,59,0,Math.PI*2);ctx.fill();
  for(let layer=0;layer<3;layer++) for(let i=0;i<17;i++) tree(ctx,i*88-30+noise(i+layer*100)*45,285+layer*87,120+layer*75+noise(i)*80,['#637e58','#3c5941','#244231'][layer]);
  ctx.fillStyle='#22392a';ctx.beginPath();ctx.moveTo(0,470);for(let x=0;x<=W;x+=60)ctx.lineTo(x,490+Math.sin(x/140)*25);ctx.lineTo(W,H);ctx.lineTo(0,H);ctx.fill();
  if(variant==='swamp'){ctx.fillStyle='#789078';ctx.beginPath();ctx.ellipse(610,560,490,80,0,0,Math.PI*2);ctx.fill();for(let i=0;i<15;i++){line(ctx,i*89,570+noise(i)*50,i*89+45,570+noise(i)*50,'#9bac86',2);}}
  for(let i=0;i<40;i++){const x=noise(i+77)*W,y=510+noise(i+200)*120;line(ctx,x,y,x+4,y-9,'#536648',2);}
  if(variant==='camp'){ctx.fillStyle='#543326';ctx.beginPath();ctx.moveTo(650,480);ctx.lineTo(860,255);ctx.lineTo(1060,480);ctx.fill();ctx.fillStyle='#bc8d52';ctx.beginPath();ctx.moveTo(678,475);ctx.lineTo(860,294);ctx.lineTo(955,475);ctx.fill();line(ctx,720,575,860,530,'#674a32',13);line(ctx,735,530,850,575,'#72573a',13);for(let i=0;i<4;i++){ctx.fillStyle=i%2?'#f4b84b':'#d9763d';ctx.beginPath();ctx.moveTo(745+i*24,555);ctx.quadraticCurveTo(725+i*24,510,762+i*24+Math.sin(t*5+i)*8,470+i*12);ctx.quadraticCurveTo(810+i*10,530,790+i*12,558);ctx.fill();}for(let i=0;i<7;i++){ctx.globalAlpha=.15;ctx.fillStyle='#ece3c3';ctx.beginPath();ctx.ellipse(795+Math.sin(t+i)*25,470-i*43,20+i*4,15+i*3,0,0,Math.PI*2);ctx.fill();ctx.globalAlpha=1;}}
}
export function bar(ctx,t=0) {
  ctx.fillStyle='#25372b';ctx.fillRect(0,0,W,H);
  for(let x=0;x<W;x+=78){ctx.fillStyle=x%156?'#2c3d2e':'#26372a';ctx.fillRect(x,0,75,H);line(ctx,x+77,0,x+77,H,'#17271c',3);}
  round(ctx,340,67,520,135,4,'#17271d','#687351');text(ctx,'VIIMEINEN KIERROS',600,148,49,'#f3c46b','center','Impact, sans-serif');text(ctx,'AAMU TULEE. HALUSIT TAI ET.',600,181,12,'#9bab85','center');
  for(let shelf=0;shelf<2;shelf++){ctx.fillStyle='#483c28';ctx.fillRect(80,235+shelf*87,1040,12);for(let i=0;i<18;i++){const x=95+i*57,y=199+shelf*87;ctx.fillStyle=['#807c45','#a68b54','#4e6d50','#b88b50'][i%4];ctx.fillRect(x,y,18,34);ctx.fillRect(x+5,y-12,8,16);}}
  const glow=ctx.createRadialGradient(600,80,0,600,80,580);glow.addColorStop(0,'#f1c67620');glow.addColorStop(1,'#f1c67600');ctx.fillStyle=glow;ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#796242';ctx.fillRect(0,395,W,40);ctx.fillStyle='#4f442e';ctx.fillRect(0,435,W,170);for(let i=0;i<8;i++)line(ctx,i*160+40,454,i*160+40,595,'#665339',7);
  for(let i=0;i<5;i++){const x=185+i*190;round(ctx,x-43,545,86,18,8,'#303e2d');line(ctx,x-25,560,x-40,650,'#15231c',9);line(ctx,x+25,560,x+40,650,'#15231c',9);}
  for(let i=0;i<4;i++){const x=170+i*260;round(ctx,x,348,27,44,4,'#d59d3a');round(ctx,x,346,27,8,3,'#f2e6bc');ctx.strokeStyle='#c9b688';ctx.lineWidth=4;ctx.strokeRect(x+27,354,12,24);}
}
export function jorma(ctx,x,y,scale=1,pose='idle',t=0) {
  ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);const walk=pose==='run'?Math.sin(t*14)*13:0;
  ctx.fillStyle='#111f17';ctx.beginPath();ctx.ellipse(0,9,38,10,0,0,Math.PI*2);ctx.fill();
  line(ctx,-13,-33,-18+walk,0,'#35442e',15);line(ctx,13,-33,18-walk,0,'#35442e',15);round(ctx,-34+walk,-5,28,13,4,'#1b231c');round(ctx,6-walk,-5,28,13,4,'#1b231c');
  round(ctx,-29,-112,58,83,13,'#ad6e44','#423723');ctx.save();ctx.beginPath();ctx.roundRect(-29,-112,58,83,13);ctx.clip();for(let i=-30;i<40;i+=19){ctx.fillStyle='#785842';ctx.fillRect(i,-115,6,90);}for(let i=-110;i<-30;i+=18){ctx.fillStyle='#704a36';ctx.fillRect(-30,i,65,5);}ctx.restore();line(ctx,0,-108,0,-33,'#dfb775',2);
  line(ctx,-27,-97,-41,-54+walk,'#a86d46',14);line(ctx,27,-97,41,-54-walk,'#a86d46',14);ctx.fillStyle='#d3a675';ctx.beginPath();ctx.arc(-41,-53+walk,8,0,7);ctx.arc(41,-53-walk,8,0,7);ctx.fill();
  round(ctx,-26,-164,52,60,16,'#d4ac7f','#503d2b');ctx.fillStyle='#e3bd8d';ctx.beginPath();ctx.ellipse(0,-130,31,17,0,0,7);ctx.fill();
  round(ctx,-28,-176,56,30,10,'#56664a');ctx.fillStyle='#70805b';ctx.fillRect(-35,-153,69,9);ctx.fillStyle='#dfc4a0';ctx.fillRect(-13,-166,25,7);
  ctx.fillStyle='#493b29';ctx.beginPath();ctx.ellipse(-10,-126,13,5,-.18,0,7);ctx.ellipse(10,-126,13,5,.18,0,7);ctx.fill();ctx.fillStyle='#22281e';ctx.fillRect(-13,-144,4,4);ctx.fillRect(10,-144,4,4);line(ctx,-10,-116,10,-116,'#695037',2);
  if(pose==='hurt'){text(ctx,'?!',0,-192,31,colors.amber,'center');}ctx.restore();
}
export function hunter(ctx,x,y,scale=1) {ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);jorma(ctx,0,0,1,'idle');round(ctx,-32,-100,64,49,8,'#e58b45');text(ctx,'H',0,-69,24,'#5b3a28','center');ctx.restore();}
export function sausage(ctx,x,y,s=1,angle=0) {ctx.save();ctx.translate(x,y);ctx.rotate(angle);round(ctx,-37*s,-9*s,74*s,18*s,9*s,'#c87a43','#743c28');for(let i=0;i<3;i++)line(ctx,(-20+i*19)*s,-4*s,(-13+i*19)*s,4*s,'#6d3823',2*s);ctx.restore();}
export function pig(ctx,x,y,awake=false) {ctx.fillStyle='#6b5040';ctx.beginPath();ctx.ellipse(x,y,88,44,0,0,7);ctx.fill();ctx.fillStyle='#90694d';ctx.beginPath();ctx.ellipse(x+68,y-5,38,32,0,0,7);ctx.fill();ctx.fillStyle='#c5986d';ctx.beginPath();ctx.ellipse(x+102,y+2,13,17,0,0,7);ctx.fill();for(let i=-1;i<=1;i+=2){line(ctx,x+i*43,y+23,x+i*43,y+45,'#4c3a2f',12);ctx.fillStyle='#6b5040';ctx.beginPath();ctx.moveTo(x+45,y-30);ctx.lineTo(x+30,y-(awake?72:39));ctx.lineTo(x+66,y-27);ctx.fill();}ctx.fillStyle='#211e17';ctx.fillRect(x+78,y-17,awake?7:15,awake?7:3);}
export function deer(ctx,x,y,s=1) {ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='#bca272';ctx.beginPath();ctx.ellipse(0,0,58,30,0,0,7);ctx.fill();for(let i=-1;i<=1;i+=2)line(ctx,i*38,17,i*45,65,'#aa9169',8);line(ctx,40,-13,64,-58,'#bca272',17);ctx.beginPath();ctx.ellipse(70,-64,21,11,-.3,0,7);ctx.fill();line(ctx,63,-70,57,-96,'#d7c091',4);line(ctx,57,-96,45,-108,'#d7c091',3);line(ctx,57,-92,66,-107,'#d7c091',3);ctx.fillStyle='#233024';ctx.fillRect(77,-68,4,4);ctx.restore();}
export function scene(ctx,chapter=0,t=0,phase='story') {
  ctx.clearRect(0,0,W,H);
  if(phase==='intro'||phase==='lobby'||chapter>=6){bar(ctx,t);jorma(ctx,chapter>=6?330:580,604,phase==='lobby'?1.65:1.3,'idle',t);}
  else {forest(ctx,t,chapter===0?'camp':chapter===3?'swamp':'forest');jorma(ctx,chapter===0?300:365,580,1.65,'idle',t);if(chapter===0){hunter(ctx,950,559,1.4);sausage(ctx,830,410,1.3);}if(chapter===1)deer(ctx,910,495,1.5);if(chapter===2){pig(ctx,850,530);text(ctx,'Z z z',880,442,29,'#d1d6b2');}if(chapter===3){line(ctx,540,565,900,535,'#a78a59',19);}if(chapter===4){round(ctx,755,315,150,210,15,'#29392b','#a5ad81');text(ctx,'KOTI',830,375,24,colors.amber,'center');text(ctx,'Puhelu...',830,435,20,colors.cream,'center');}}
  const vignette=ctx.createLinearGradient(0,430,0,H);vignette.addColorStop(0,'#101b1700');vignette.addColorStop(1,'#101b1766');ctx.fillStyle=vignette;ctx.fillRect(0,430,W,220);
}
