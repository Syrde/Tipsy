const svg=body=>`<svg viewBox="0 0 360 200" role="img" aria-label="Kysymyksen kuvitus" xmlns="http://www.w3.org/2000/svg"><rect width="360" height="200" rx="24" fill="#f4eee0"/>${body}</svg>`;
const text=(s,x=180,y=110,size=40)=>`<text x="${x}" y="${y}" text-anchor="middle" font-family="Arial" font-weight="bold" font-size="${size}" fill="#28233c">${s}</text>`;
export function art(value){if(!value)return '';let a=typeof value==='object'?value:{kind:value};
 if(a.kind==='photo')return `<img src="${a.src}" alt="Kysymyksen taideteos" class="quiz-photo">`;
 if(a.kind==='flag'){
  const rect=(y,h,c)=>`<rect x="35" y="${y}" width="290" height="${h}" fill="${c}"/>`,circle=(c,x=175)=>`<circle cx="${x}" cy="100" r="34" fill="${c}"/>`;
  const star=(color)=>`<path d="M180 73l8 19 21 1-16 14 5 20-18-11-18 11 5-20-16-14 21-1Z" fill="${color}"/>`;
  const b={palau:rect(20,160,'#48b9e5')+circle('#ffdf28',163),bangladesh:rect(20,160,'#006a4e')+circle('#f42a41',168),laos:rect(20,160,'#ce1126')+rect(60,80,'#002868')+circle('white',180),botswana:rect(20,160,'#75aadb')+rect(80,40,'white')+rect(85,30,'#111'),estonia:rect(20,54,'#4891d9')+rect(74,53,'#111')+rect(127,53,'white'),ghana:rect(20,54,'#ce1126')+rect(74,53,'#fcd116')+rect(127,53,'#006b3f')+star('#111'),senegal:rect(20,160,'#00853f')+'<path d="M132 20h96v160h-96Z" fill="#fdef42"/><path d="M228 20h97v160h-97Z" fill="#e31b23"/>'+star('#00853f'),bahamas:rect(20,160,'#00abc9')+rect(73,54,'#fae042')+'<path d="M35 20l105 80-105 80Z" fill="#111"/>',tanzania:rect(20,160,'#1eb53a')+'<path d="M35 180h290V20Z" fill="#00a3dd"/><path d="M35 180L325 20" stroke="#fcd116" stroke-width="55"/><path d="M35 180L325 20" stroke="#111" stroke-width="36"/>',jamaica:rect(20,160,'#009b3a')+'<path d="M35 20l145 80L35 180 M325 20L180 100l145 80" fill="#111"/><path d="M35 20l290 160 M35 180L325 20" stroke="#fed100" stroke-width="15"/>',czech:rect(20,160,'white')+rect(100,80,'#d7141a')+'<path d="M35 20l145 80-145 80Z" fill="#11457e"/>',austria:rect(20,160,'#ed2939')+rect(73,54,'white')}[a.flag];
  return svg(`<g clip-path="url(#flagclip)"><defs><clipPath id="flagclip"><rect x="35" y="20" width="290" height="160"/></clipPath></defs>${b}</g>`);
 }
 if(a.kind==='court'){
  let b='<rect x="35" y="20" width="290" height="160" rx="2" fill="#186d63"/><g stroke="white" stroke-width="2" fill="none"><rect x="45" y="30" width="270" height="140"/>';
  if(a.sport==='basket')b+='<path d="M180 30v140 M45 70h60v60H45 M315 70h-60v60h60 M45 45C170 45 170 155 45 155 M315 45C190 45 190 155 315 155"/><circle cx="180" cy="100" r="20"/><circle cx="105" cy="100" r="21"/><circle cx="255" cy="100" r="21"/>';
  if(a.sport==='tennis')b+='<path d="M180 30v140 M45 46h270 M45 154h270 M115 46v108 M245 46v108 M115 100h130"/>';
  if(a.sport==='badminton')b+='<path d="M180 30v140 M45 45h270 M45 155h270 M70 30v140 M290 30v140 M151 30v140 M209 30v140 M45 100h106 M209 100h106"/>';
  if(a.sport==='volley')b+='<path d="M180 30v140 M135 30v140 M225 30v140"/>';
  return svg(b+'</g>');
 }
 if(a.kind==='clock'){const h=a.hour??10,m=a.minute??10,cx=180,cy=100;let b='<circle cx="180" cy="100" r="86" fill="white" stroke="#28233c" stroke-width="5"/>';for(let i=1;i<=12;i++){const r=i*Math.PI/6;b+=text(i,cx+70*Math.sin(r),cy-70*Math.cos(r)+5,16);}for(const [angle,length,width] of [[(h%12+m/60)*Math.PI/6,43,7],[m*Math.PI/30,63,4]])b+=`<line x1="180" y1="100" x2="${cx+length*Math.sin(angle)}" y2="${cy-length*Math.cos(angle)}" stroke="#28233c" stroke-width="${width}" stroke-linecap="round"/>`;return svg(b+'<circle cx="180" cy="100" r="5" fill="#db3c6c"/>');}
 if(a.kind==='squares'){const n=a.n||2,size=156/n;let b='';for(let x=0;x<=n;x++){b+=`<path d="M${102+x*size} 22v156 M102 ${22+x*size}h156" stroke="#28233c" stroke-width="3"/>`;}return svg(b);}
 if(a.kind==='dice'){const n=a.n||3,positions={1:[[0,0]],2:[[-1,-1],[1,1]],3:[[-1,-1],[0,0],[1,1]],4:[[-1,-1],[1,-1],[-1,1],[1,1]],5:[[-1,-1],[1,-1],[-1,1],[1,1],[0,0]],6:[[-1,-1],[1,-1],[-1,0],[1,0],[-1,1],[1,1]]};return svg('<rect x="110" y="30" width="140" height="140" rx="22" fill="white" stroke="#28233c" stroke-width="4"/>'+positions[n].map(([x,y])=>`<circle cx="${180+x*40}" cy="${100+y*40}" r="10" fill="#28233c"/>`).join(''));}
 if(a.kind==='sequence')return svg(text((a.values?[...a.values,'?']:[2,4,8,'?']).join(' · '),180,113,32));
 if(a.kind==='dots'){let b='';for(let i=0;i<a.n;i++)b+=`<circle cx="${75+(i%7)*35}" cy="${45+Math.floor(i/7)*36}" r="11" fill="${i<a.marked?'#8c4bd4':'#20a8ab'}"/>`;return svg(b);}
 if(a.kind==='denmark')return svg('<rect x="45" y="25" width="270" height="150" fill="#cb193a"/><path d="M130 25v150 M45 100h270" stroke="white" stroke-width="22"/>');
 if(a.kind==='france')return svg('<path d="M45 25h90v150H45" fill="#263b9a"/><path d="M135 25h90v150h-90" fill="white"/><path d="M225 25h90v150h-90" fill="#d73941"/>');
 if(a.kind==='triangles')return svg('<path d="M180 20L80 180h200Z M130 100h100 M130 100l50 80 50-80" fill="none" stroke="#28233c" stroke-width="4"/>');
 if(a.kind==='gears')return svg(text('⚙ → ⚙ → ⚙',180,113,50)+text('↻',80,170,32));
 if(a.kind==='eiffel')return svg('<path d="M180 20l-20 85-50 75h30l40-65 40 65h30l-50-75Z" fill="#28233c"/><path d="M147 137h66 M166 91h28" stroke="#f4eee0" stroke-width="5"/>');
 if(a.kind==='pyramids')return svg('<path d="M45 165l90-130 90 130Z" fill="#c6a061"/><path d="M180 165l70-100 75 100Z" fill="#e4bc70"/><circle cx="280" cy="35" r="18" fill="#edc448"/>');
 return svg('<circle cx="180" cy="100" r="78" fill="#2496b2"/><path d="M143 30l40 20-15 29 23 15-15 46-24-17-6-30-25-15Z M213 50l32 24-9 31-26 2-10-27Z" fill="#99c486"/><ellipse cx="180" cy="100" rx="40" ry="78" fill="none" stroke="white" opacity=".5"/><path d="M104 100h152" stroke="white" opacity=".5"/>');
}
