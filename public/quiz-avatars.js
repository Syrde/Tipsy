// IDs identify artwork only. Players supply their own display names.
export const AVATAR_COUNT=20;
// Generated rows have different portrait heights; crop at actual row boundaries.
const rows=[[0,172,345,526,705,889,1070,1269,1499,1710,1983],[0,176,347,520,698,881,1072,1298,1495,1714,1983]];
export const avatarArt=Array.from({length:AVATAR_COUNT},(_,id)=>({
 id,sheet:Math.floor(id/10),row:id%10,
 crop:rows[Math.floor(id/10)]?{top:rows[Math.floor(id/10)][id%10],height:rows[Math.floor(id/10)][id%10+1]-rows[Math.floor(id/10)][id%10],total:rows[Math.floor(id/10)][10]}:null,
 tempo:0.36+(id%5)*0.07,tilt:(id%2?1:-1)*(5+id%4),
 idle:3+(id%7)*0.3,delay:-(id%6)*0.43
}));
