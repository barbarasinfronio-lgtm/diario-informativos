// Classificador de estudo copiado SEM alterações de lógica de
// reclamacoes/curadoria.html (branch curadoria-reclamacoes-2026-10-02, commit 2504bc9, PR #141).
// A triagem é automática: não equivale a validação humana.
const FORM=['tese de julgamento:','foi fixada a seguinte tese','fixada a seguinte tese','fixou-se a seguinte tese','fixou a seguinte tese','foi firmada a seguinte tese','fixou-se a tese','fixou a tese de repercussão geral','em seguida, foi fixada a tese'];
const EXPLAIN=['não se confunde','não se confundem','não há que se confundir','não significa','não implica','distinção','distingue','distinguishing','não se aplica ao caso','diferença entre','diferenciação entre','alcance da tese','alcance do tema','interpretação sistemática','interpretação teleológica','excepcionalmente','em caráter excepcional','não constitui impedimento','não constituindo impedimento','limita-se a','abrange apenas','não abrange','modulação dos efeitos','efeitos benéficos','efeitos prejudiciais','ressalvada a hipótese','decisão anterior não se aplica','tese anterior não se aplica','superando o entendimento do acórdão embargado','dissídio jurisprudencial reconhecido','resolve o dissídio','reconhece o dissídio','não impedindo a incidência de efeitos benéficos','efeitos prejudiciais aos réus decorrentes da tese fixada neste julgamento alcançam apenas os fatos ocorridos após a publicação','perícia pode ser suprida por prova confiável equivalente','prova confiável equivalente'];
const SUPPORT=['esclarece','esclareceu','desde que','suficiente para','a regra é','a exceção','não basta','não bastando','interpretação do art','interpretação do artigo'];
const APPLY=['tese firmada','teses firmadas','observância','observando-se','observando a','jurisprudência vinculante','entendimento firmado','diretrizes fixadas','paradigma','precedente vinculante','súmula vinculante','tema ','adc ','adpf ','adi '];
const PROCEDURAL=['intempestividade','intempestivo','ausência de impugnação específica','ausencia de impugnacao especifica','falta de impugnação específica','falta de impugnacao especifica','ausência de prequestionamento','ausencia de prequestionamento','não conhecimento do recurso','nao conhecimento do recurso','não conheço do recurso','nao conheco do recurso','não conheço da reclamação','nao conheco da reclamacao','perda superveniente do objeto','erro grosseiro','deserção','desercao','ausência de cotejo analítico','ausencia de cotejo analitico','ausência de similitude fática','ausencia de similitude fatica'];
function norm(s){return String(s??'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
function fullText(x){return [...new Set([x.ementa,x.resumo,x._resumo,x.teseJuridica,x.tema,x.informacoesComplementares,x.decisao,x.andamento,x.teor,x.jurisprudenciaCitada,x.notas].filter(v=>typeof v==='string'&&v.trim()))].join('\n\n')}
function texto(x){return [x.processo,x.relator,x.tipo,x.tipoNome,x.ramo,x.area,x.titulo,x.assunto,x.orgao,x.info,fullText(x)].filter(Boolean).join(' ')}
function hasAny(t,arr){return arr.filter(k=>t.includes(norm(k)))}
function score(x){
 const body=norm([x.ementa,x.resumo,x._resumo,x.teseJuridica,x.tema,x.informacoesComplementares,x.decisao,x.andamento,x.teor,x.titulo,x.assunto].filter(Boolean).join(' '));
 const isInformativo=/informativo/i.test(String(x.tipo||''))||/informativo/i.test(String(x._sourceLabel||''));
 if(isInformativo)return{kind:'essential',nature:'informativo',w:['publicado em Informativo — relevância de estudo confirmada por você']};
 const evoMeta=norm([x.processo,x.tema,x.titulo,x.assunto,x.precedenteLabel].filter(Boolean).join(' '));
 const icmsTransferEvolution=(/icms/.test(body)&&/(transfer|matriz|filial|estabelecimentos do mesmo titular)/.test(body))||(String(x.tribunal||'').toUpperCase()==='STF'&&(/adc\s*49\b/.test(evoMeta)||/tema\s*1367\b/.test(evoMeta)||/re\s*1[.]?490[.]?708\b/.test(evoMeta)));
 if(icmsTransferEvolution)return{kind:'essential',nature:'evolucao',w:['tema em evolução: ICMS na transferência entre estabelecimentos do mesmo contribuinte; manter decisões antigas e novas na sequência histórica']};
 if(!body||body.length<160)return{kind:'noStudy',w:['texto decisório ausente ou muito breve']};
 const isEDcl=/^edcl\b/.test(norm([x.siglaClasse,x.classe,x.processo,x.tipo,x.titulo,x.assunto].filter(Boolean).join(' ')));
 const genericEDclThesis=isEDcl&&/tese de julgamento\s*:\s*(?:\d+[.)]\s*)?(?:os )?embargos de declaracao.{0,250}(?:nao se prestam a rediscussao|nao se presta a rediscussao|somente se prestam|somente se acolhem|destinam-se a sanar|visam sanar)/.test(body);
 const form=FORM.some(k=>{let i=body.indexOf(norm(k));if(i<0)return false;let before=body.slice(Math.max(0,i-240),i);return !/ao apreciar o tema|ao julgar o tema|ao examinar o tema|tema repetitivo.{0,40}$|no julgamento do tema.{0,40}$|tese firmada no tema.{0,30}$/.test(before)})&&!genericEDclThesis;
 const reasonsAt=body.search(/iii\.?\s*razoes de decidir|razoes de decidir|fundamentos de decidir/),evidenceBody=isEDcl&&reasonsAt>=0?body.slice(reasonsAt):body;
 const exp=hasAny(evidenceBody,EXPLAIN),support=hasAny(evidenceBody,SUPPORT),apply=hasAny(body,APPLY),mentionsDissent=/dissidio jurisprudencial|divergencia jurisprudencial|divergencia entre as turmas|dissenso jurisprudencial|solucoes juridicas inconciliaveis/.test(evidenceBody);
 const dissent=/embargos.{0,100}divergencia.{0,100}(providos|acolhidos)|(?:resolve|soluciona|uniformiza|supera|superando).{0,100}(dissidio|divergencia)|(?:dissidio|divergencia).{0,100}(resolvido|uniformizado|reconhecido e resolvido)/.test(evidenceBody);
 const fact=/no caso concreto|caso concreto em que|na hipotese|no caso em exame|caso em exame|na situacao dos autos|circunstancias do caso|fatos do caso/.test(evidenceBody);
 const statutory=/\bart\.?\s*\d|artigo\s+\d/.test(evidenceBody),procedural=hasAny(body,PROCEDURAL);
 const routineFinal=/indefiro liminarmente.{0,150}(habeas corpus|recurso|pedido)|indeferido liminarmente.{0,150}(habeas corpus|recurso|pedido)|nega seguimento.{0,120}recurso/.test(body);
 const outcome=/conhecido e provido|conhecido e desprovido|embargos.{0,35}(providos|acolhidos)|recurso.{0,25}(provido|desprovido)|pedido.{0,25}(procedente|improcedente)/.test(body);
 let points=(form?5:0)+(exp.length?Math.min(exp.length,3)*2:0)+(dissent?3:0)+(fact?1:0)+(statutory&&exp.length?2:0)+(outcome&&fact?1:0);
 if(form)return{kind:'keep',nature:'tese',w:['formula ou explicita tese nesta decisão']};
 if((exp.length>=1&&fact)||(exp.length>=2&&statutory)||(dissent&&body.length>700)||(points>=6&&fact))return{kind:'keep',nature:'explicacao',w:[dissent?'explica e resolve divergência':'explica regra, distinção ou exceção no caso concreto']};
 if(x._source==='referencias'&&['rg','teses','tst'].includes(x._sourceType)&&body.length>240)return{kind:'essential',nature:'precedente',w:['fonte estruturante organizada para estudo']};
 if(apply.length)return{kind:'application',w:['aplica ou cita entendimento sem sinal suficiente de esclarecimento novo']};
 if(routineFinal&&!exp.length&&!dissent)return{kind:'noStudy',w:['indeferimento liminar rotineiro, sem explicação nova de regra, distinção ou exceção identificada']};
 if(procedural.length&&(!fact||body.length<1800))return{kind:'noStudy',w:['conteúdo predominantemente processual ou de admissibilidade, sem explicação jurídica específica']};
 if(body.length<700)return{kind:'noStudy',w:['decisão breve, sem conteúdo específico de estudo identificado']};
 if(exp.length||support.length||mentionsDissent||dissent||statutory||fact)return{kind:'review',w:['há conteúdo jurídico, mas a triagem automática não consegue avaliar com segurança se há explicação nova']};
 return{kind:'noStudy',w:['não foi identificado conteúdo específico de estudo no texto']};
}

module.exports={score,fullText,norm};
