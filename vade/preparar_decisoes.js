const fs=require('fs');global.window=global;const R=require('path').join(__dirname,'..')+'/';
(0,eval)(fs.readFileSync(R+'site/decisoes/rg-repetitivos-data.js','utf8').replace(/^(var|const|let) (\w+) =/mg,'globalThis.$2 ='));
const out=[];const dataIso=s=>String(s||'');
for(const d of RG_REPETITIVOS_DATA){const proc=String(d.processo||'').replace(/,\s*rel\..*$/i,'').trim();
 out.push({id:'dec:'+d.id,rot:(d.precedenteLabel?d.precedenteLabel+' ':'Tema ')+(d.tema||'')+' ('+(d.orgao||'')+')'+(proc?' — '+proc:''),texto:[d.titulo,d.tese,d.questao,d.destaque,d.resumo].filter(Boolean).join(' . ')})}
for(const d of JSON.parse(fs.readFileSync(R+'stj/teses.json','utf8')).itens||[]) out.push({id:'dec:'+d.id,rot:String(d.titulo||'').replace(/^Jurisprud[êe]ncia em Teses do STJ\s*/i,'JT STJ '),texto:[d.titulo,d.tese,d.destaque].filter(Boolean).join(' . ')});
fs.writeFileSync(process.argv[2]+'/decisoes.json',JSON.stringify(out));console.log(out.length);


