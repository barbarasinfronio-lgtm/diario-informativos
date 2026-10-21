const fs=require('fs');global.window=global;
const R=require('path').join(__dirname,'..')+'/';
const run=(f)=>{(0,eval)(fs.readFileSync(R+f,'utf8').replace(/^(var|const|let) (\w+) =/mg,'globalThis.$2 ='))};
run('site/sumulas/sumulas-data.js');run('site/leis/normas-data.js');
const out={sumulas:globalThis.SUMULAS_DATA,normas:globalThis.NORMAS_DATA};
fs.writeFileSync(process.argv[2]+'/fontes.json',JSON.stringify(out));
const s=out.sumulas;let n=0;for(const k in s){n+=(s[k].sumulas||[]).length}
console.log(Object.keys(s).length,'trib',n,'sumulas; normas orgaos',Object.keys(out.normas||{}));
