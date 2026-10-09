export const alphabetDialogue=[
 {id:'alphabet-noora-ask',speaker:'Noora',role:'reader',text:'Tipsy, tiedätkö kuinka monta kirjainta englannin aakkosissa on?',spoken:'Tipsy, tiedätkö kuinka monta kirjainta englannin aakkosissa on?'},
 {id:'alphabet-tipsy-count',speaker:'Tipsy',role:'host',text:'Kaksikymmentä.',spoken:'Kaksikymmentä.'},
 {id:'alphabet-noora-correct',speaker:'Noora',role:'reader',text:'Ei kun kaksikymmentäkuusi!',spoken:'Ei kun kaksikymmentäkuusi!'},
 {id:'alphabet-tipsy-flirt',speaker:'Tipsy',role:'host',text:'Ai niin! Unohdin U R A Q T. You are a cutie.',spoken:'Ai niin! Unohdin juu, aar, ei, kjuu, tii. You are a cutie.'},
 {id:'alphabet-noora-missing',speaker:'Noora',role:'reader',text:'Heh! Silti sulta puuttuu yksi.',spoken:'Heh! Silti sulta puuttuu yksi.'},
 {id:'alphabet-tipsy-d',speaker:'Tipsy',role:'host',text:'Älä huoli, beibe. Sä saat D:n myöhemmin.',spoken:'Älä huoli, beibe. Sä saat deen myöhemmin.'}
];
export async function playAlphabetDialogue(play,valid=()=>true){for(const turn of alphabetDialogue){if(!valid())return false;if(await play(turn)===false)return false;}return valid();}
