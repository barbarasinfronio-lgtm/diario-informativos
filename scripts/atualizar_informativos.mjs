/*
 * atualizar_informativos.mjs — verifica e ACRESCENTA sozinho os novos
 * Informativos do STF em diario-data.js, sem precisar de ninguém abrindo
 * o Diário para conferir manualmente.
 *
 * Como funciona:
 *   1. Lê o último número de Informativo do STF já registrado em
 *      diario-data.js (o primeiro item de STF_DATA — a lista vem do
 *      mais novo para o mais antigo).
 *   2. Confere, um por um, se o PDF do próximo número já foi publicado
 *      (HEAD/GET no endereço oficial do STF). Continua conferindo os
 *      números seguintes até achar um que ainda não saiu — assim, se o
 *      robô ficar uma ou duas semanas sem rodar, ele recupera todos os
 *      números que faltam de uma vez, não só o próximo.
 *   3. Cada número novo entra em STF_DATA como
 *      { edicao, ano, data, sumula: null } — "sumula: null" é o mesmo
 *      "a confirmar" que as edições recém-saídas já usam, porque ainda
 *      não dá para saber se aquela edição cita alguma súmula sem ler o
 *      PDF (isso continua sendo conferido à mão, depois).
 *   4. O workflow (.github/workflows/atualizar_informativos.yml) faz o
 *      commit e o push das mudanças.
 *
 * Só cobre o STF por enquanto — os outros tribunais (STJ, TSE, CNJ, TST,
 * CNMP) têm cada um seu próprio jeito de publicar (nem todos têm PDF
 * previsível pelo número), então precisam do mesmo tratamento um dia,
 * mas cada um por si. Para acrescentar um, copie o objeto "STF" abaixo
 * (FONTES) com o endereço e o texto certos daquele tribunal.
 */
import fs from 'fs/promises';

const ARQUIVO_DADOS = './diario-data.js';

// Cada fonte sabe montar o endereço do PDF/HTML de uma edição e onde
// ela entra no arquivo de dados. Adicionar um tribunal novo é criar um
// objeto igual a este.
const FONTES = {
  STF: {
    variavel: 'STF_DATA',
    urlDe: (numero) =>
      numero < 1000
        ? `https://www.stf.jus.br/arquivo/informativo/documento/informativo${numero}.htm`
        : `https://www.stf.jus.br/arquivo/cms/informativoSTF/anexo/Informativo_PDF/Informativo_stf_${numero}.pdf`
  }
};

// Testa se o endereço responde (200 OK). Tenta HEAD primeiro (mais leve);
// se o servidor não aceitar HEAD, cai para GET e cancela o corpo assim
// que confirma o status, para não baixar o arquivo à toa.
async function urlExiste(url) {
  try {
    const head = await fetch(url, { method: 'HEAD' });
    if (head.status === 200) return true;
    if (head.status === 404) return false;
    // status incomum (405, 403…) — tenta GET antes de desistir
  } catch {
    // segue para o GET
  }
  try {
    const res = await fetch(url, { method: 'GET' });
    if (res.body && typeof res.body.cancel === 'function') {
      await res.body.cancel().catch(() => {});
    }
    return res.status === 200;
  } catch {
    return false;
  }
}

function todayIso() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

// Acha o maior número já registrado numa lista "var NOME_DATA = [ {edicao: N, ...}, ... ];"
// (o primeiro item da lista, já que ela vem do mais novo para o mais antigo).
function ultimoRegistrado(conteudo, variavel) {
  const re = new RegExp(`var\\s+${variavel}\\s*=\\s*\\[\\s*\\{[^}]*edicao:\\s*(\\d+)`);
  const m = conteudo.match(re);
  return m ? parseInt(m[1], 10) : null;
}

// Insere as novas edições logo depois de "var NOME_DATA = [", da mais
// nova para a mais antiga (para a lista continuar com a mais recente
// no topo).
function inserirEdicoes(conteudo, variavel, edicoes) {
  const linhas = edicoes
    .slice()
    .reverse()
    .map((e) => `    { edicao: ${e.edicao}, ano: ${e.ano}, data: "${e.data}", sumula: null },`)
    .join('\n');
  const re = new RegExp(`(var\\s+${variavel}\\s*=\\s*\\[\\n)`);
  if (!re.test(conteudo)) {
    throw new Error(`Não encontrei "var ${variavel} = [" em ${ARQUIVO_DADOS} — o arquivo mudou de formato?`);
  }
  return conteudo.replace(re, `$1${linhas}\n`);
}

async function checarNovasEdicoes(fonte, ultimoNumero) {
  const novas = [];
  let numero = ultimoNumero;
  const hoje = todayIso();
  const ano = new Date().getFullYear();
  // limite de segurança: nunca confere mais de 20 números de uma vez
  // (evita ficar preso em loop se algo no site mudar de formato)
  for (let i = 0; i < 20; i++) {
    const proximo = numero + 1;
    const url = fonte.urlDe(proximo);
    console.log(`Verificando edição nº ${proximo}: ${url}`);
    const publicado = await urlExiste(url);
    if (!publicado) {
      console.log(`  → ainda não publicada.`);
      break;
    }
    console.log(`  → publicada! Registrando.`);
    novas.push({ edicao: proximo, ano, data: hoje });
    numero = proximo;
  }
  return novas;
}

async function main() {
  console.log('--- Início da verificação de novos Informativos ---');
  let conteudo = await fs.readFile(ARQUIVO_DADOS, 'utf-8');
  let totalNovas = 0;

  for (const [nome, fonte] of Object.entries(FONTES)) {
    const ultimo = ultimoRegistrado(conteudo, fonte.variavel);
    if (ultimo === null) {
      console.log(`${nome}: não encontrei o último número registrado — pulando.`);
      continue;
    }
    console.log(`${nome}: último registrado é o nº ${ultimo}.`);
    const novas = await checarNovasEdicoes(fonte, ultimo);
    if (!novas.length) {
      console.log(`${nome}: nenhuma edição nova.`);
      continue;
    }
    conteudo = inserirEdicoes(conteudo, fonte.variavel, novas);
    totalNovas += novas.length;
    console.log(`${nome}: ${novas.length} edição(ões) nova(s) adicionada(s) (${novas.map((n) => n.edicao).join(', ')}).`);
  }

  if (totalNovas > 0) {
    await fs.writeFile(ARQUIVO_DADOS, conteudo, 'utf-8');
    console.log(`\n${ARQUIVO_DADOS} atualizado com ${totalNovas} edição(ões) nova(s).`);
  } else {
    console.log('\nNenhuma edição nova em nenhuma fonte — nada para gravar.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
