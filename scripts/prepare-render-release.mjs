import {readFile,readdir,stat,mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
const files=new Set(['.gitignore','.node-version','render.yaml','package.json','package-lock.json','README-render.md','README-tipzy.md','.tipzy-music.json','.tipzy-reader-voice.json','quiz-expanded.json','supabase/001-room-checkpoints.sql','scripts/prepare-render-release.mjs']);
for(const name of await readdir('.'))if(/^quiz-.*\.mjs$/.test(name))files.add(name);
async function walk(folder){for(const entry of await readdir(folder,{withFileTypes:true})){const path=join(folder,entry.name).replaceAll('\\','/');if(entry.isDirectory())await walk(path);else files.add(path);}}
await walk('public/assets');
for(const name of await readdir('public'))if(/\.(js|css|html|svg|json)$/.test(name))files.add('public/'+name);
files.add('public/audio/manifest.json');
function audio(value){if(typeof value==='string'&&/^\/audio\/[^?]+\.(mp3|wav)$/.test(value))files.add('public'+value);else if(value&&typeof value==='object')Object.values(value).forEach(audio);}
audio(JSON.parse(await readFile('public/audio/manifest.json','utf8')));
for(const path of [...files])if(/\.(js|css)$/.test(path)){
 const text=await readFile(path,'utf8');for(const match of text.matchAll(/['"](\/audio\/[^'"?]+\.(?:mp3|wav))['"]/g))files.add('public'+match[1]);
}
let bytes=0;
for(const path of files){
 bytes+=(await stat(path)).size;
 if(/\.(mjs|js|json|sql|yaml|md)$/.test(path)){
  const text=await readFile(path,'utf8');
  if(/(?:sk_[A-Za-z0-9]{24,}|sb_secret_[A-Za-z0-9_-]{15,}|hf_[A-Za-z0-9]{20,})/.test(text))throw new Error('Possible credential in '+path);
 }
}
await mkdir('.local-tools',{recursive:true});
await writeFile('.local-tools/render-files.nul',[...files].sort().join('\0')+'\0');
await writeFile('.local-tools/render-files.txt',[...files].sort().join('\n')+'\n');
console.log(JSON.stringify({files:files.size,megabytes:Math.round(bytes/1e6),list:'.local-tools/render-files.txt'}));
