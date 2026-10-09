// A preview can be unavailable in the hosting region even when it exists locally.
// Try only explicitly curated recordings of the same song, never a search result.
export async function resolveMusicPreview(question, request=fetch) {
 const ids=[...new Set([question.deezerId,...(question.previewFallbackIds||[])])];
 for(let attempt=0;attempt<2;attempt++)for(const id of ids){
  try{
   const response=await request(`https://api.deezer.com/track/${id}`,{signal:AbortSignal.timeout(4000)});
   if(!response.ok)continue;
   const data=await response.json();
   if(typeof data.preview==='string'&&/^https:\/\/[^/]*\.dzcdn\.net\//.test(data.preview))return data.preview;
  }catch{}
 }
 return null;
}
