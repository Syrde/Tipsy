import {readFile,writeFile} from 'node:fs/promises';
export const musicQuestions=[];
try{musicQuestions.push(...JSON.parse(await readFile('.tipzy-music.json','utf8')));}catch{}
export async function saveMusicQuestion(question){musicQuestions.push(question);try{await writeFile('.tipzy-music.json',JSON.stringify(musicQuestions,null,2));}catch(error){musicQuestions.pop();throw error;}}
