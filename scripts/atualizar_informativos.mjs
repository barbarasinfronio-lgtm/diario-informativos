/*
 * atualizar_informativos.mjs — verifica e ACRESCENTA os novos Informativos
 * do STF em diario-data.js. Roda só quando alguém aperta "Run workflow"
 * em .github/workflows/atualizar_informativos.yml (sem agendamento).
 *
 * Como funciona:
 *   1. Lê o último número do STF já registrado em diario-data.js (o
 *      primeiro item de STF_DATA — a lista vem do mais novo para o mais
 *      antigo).
 *   2. Para cada número seguinte, abre a página HTML oficial da edição
 *      (informativo<N>.htm). Se ela existe e traz "Nº <N>", a edição saiu,
 *      e a data vem do cabeçalho da própria página ("Brasília, 21 de
 *      setembro de 2026"). Se a página HTML não existir, tenta o PDF.
 *      Continua até achar um número que ainda não saiu — então recupera
 *      várias semanas de uma vez se o robô ficar sem rodar.
 *   3. Cada número novo entra em STF_DATA como
 *      { edicao, ano, data, sumula: null } — "sumula: null" é o
 *      "a confirmar" (isso continua sendo conferido à mão, depois).
 *   4. O workflow faz o commit, o push e limpa o cache do jsDelivr.
 *
 * Por que o robô antigo "não funcionava": o servidor do STF manda o
 * certificado HTTPS sem o intermediário da cadeia, o Node recusava a conexão
 * (UNABLE_TO_VERIFY_LEAF_SIGNATURE) e o script tratava QUALQUER falha como
 * "ainda não publicada", terminando verde. O workflow agora completa a
 * cadeia (NODE_EXTRA_CA_CERTS) antes de rodar este script. Agora só 404 (ou página sem o
 * número) conta como "não saiu"; qualquer outra resposta faz o robô
 * terminar em ERRO (vermelho), dizendo o que o STF respondeu. Também manda
 * um User-Agent de navegador, porque o STF recusa pedidos sem ele.
 *
 * Só cobre o STF por enquanto — os outros tribunais (STJ, TSE, CNJ, TST,
 * CNMP) não têm um endereço previsível pelo número.
 */
import fs from 'fs/promises';

const ARQUIVO_DADOS = './diario-data.js';
const RESUMO = process.env.GITHUB_STEP_SUMMARY; // resumo na página da Action

const CABECALHOS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36',
  'Accept': 'text/html,application/pdf,*/*;q=0.8',
  'Accept-Language': 'pt-BR,pt;q=0.9'
};

const STF = {
  variavel: 'STF_DATA',
  htmlDe: (n) => `https://www.stf.jus.br/arquivo/informativo/documento/informativo${n}.htm`,
  pdfDe: (n) => `https://www.stf.jus.br/arquivo/cms/informativoSTF/anexo/Informativo_PDF/Informativo_stf_${n}.pdf`
};

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

// Erro de acesso (não é "ainda não saiu"): faz o robô terminar em vermelho.
class ErroDeAcesso extends Error {}

async function buscar(url, metodo = 'GET') {
  for (let tentativa = 1; tentativa <= 3; tentativa++) {
    try {
      const res = await fetch(url, {
        method: metodo,
        headers: CABECALHOS,
        redirect: 'follow',
        signal: AbortSignal.timeout(30000)
      });
      if (res.status >= 500 && tentativa < 3) {
        await new Promise((r) => setTimeout(r, 3000 * tentativa));
        continue;
      }
      return res;
    } catch (err) {
      if (tentativa === 3) {
        throw new ErroDeAcesso(`${url} → sem resposta (${err.cause?.code || err.name}: ${err.message})`);
      }
      await new Promise((r) => setTimeout(r, 3000 * tentativa));
    }
  }
}

// O STF às vezes serve as páginas em windows-1252; decodifica certo.
async function textoDe(res) {
  const bytes = new Uint8Array(await res.arrayBuffer());
  const tipo = (res.headers.get('content-type') || '').toLowerCase();
  const utf8 = new TextDecoder('utf-8').decode(bytes);
  if (/charset=(windows-1252|iso-8859-1|latin1)/.test(tipo) || utf8.includes('�')) {
    return new TextDecoder('windows-1252').decode(bytes);
  }
  return utf8;
}

// "Brasília, 21 de setembro de 2026" → "2026-09-21"
function dataDoCabecalho(texto) {
  const m = texto.match(/Bras\S{0,3}lia,?\s*(\d{1,2})\s+de\s+(\S+)\s+de\s+(\d{4})/i);
  if (!m) return null;
  const mes = MESES.indexOf(m[2].toLowerCase().normalize('NFD').replace(/[^a-z]/g, '').slice(0, 3));
  if (mes < 0) return null;
  const p = (n) => String(n).padStart(2, '0');
  return `${m[3]}-${p(mes + 1)}-${p(m[1])}`;
}

// Devolve { data } se a edição existe, ou null se não achou (nem HTML nem
// PDF). O STF responde 403 (e não 404) para arquivo que não existe, então
// "não achou" pode ser "ainda não saiu" OU "o STF bloqueou" — quem decide
// é main(), conferindo antes uma edição que com certeza existe.
async function conferirEdicao(numero) {
  const urlHtml = STF.htmlDe(numero);
  const html = await buscar(urlHtml);
  console.log(`  HTML ${urlHtml} → HTTP ${html.status}`);
  if (html.status === 200) {
    const texto = await textoDe(html);
    if (new RegExp(`N\\S{0,2}\\s*${numero}\\b`).test(texto)) {
      return { data: dataDoCabecalho(texto) };
    }
    console.log(`  (página sem "Nº ${numero}")`);
  } else {
    await html.body?.cancel().catch(() => {});
  }

  const urlPdf = STF.pdfDe(numero);
  const pdf = await buscar(urlPdf);
  await pdf.body?.cancel().catch(() => {});
  const tipo = pdf.headers.get('content-type') || '';
  console.log(`  PDF  ${urlPdf} → HTTP ${pdf.status} (${tipo})`);
  if (pdf.status === 200 && /pdf|octet-stream/i.test(tipo)) return { data: null };
  return null;
}

function hojeIso() {
  return new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });
}

function ultimoRegistrado(conteudo, variavel) {
  const m = conteudo.match(new RegExp(`var\\s+${variavel}\\s*=\\s*\\[\\s*\\{[^}]*edicao:\\s*(\\d+)`));
  return m ? parseInt(m[1], 10) : null;
}

// Insere as novas edições logo depois de "var NOME_DATA = [", da mais nova
// para a mais antiga.
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

async function resumo(linhas) {
  console.log('\n' + linhas.join('\n'));
  if (RESUMO) await fs.appendFile(RESUMO, linhas.join('\n') + '\n').catch(() => {});
}

async function main() {
  console.log('--- Verificação de novos Informativos do STF ---');
  let conteudo = await fs.readFile(ARQUIVO_DADOS, 'utf-8');
  const ultimo = ultimoRegistrado(conteudo, STF.variavel);
  if (ultimo === null) throw new Error(`Não achei o último número em ${STF.variavel}.`);
  console.log(`Último registrado: nº ${ultimo}.`);

  // Controle: a última edição registrada com certeza existe. Se nem ela
  // abre, o problema é acesso ao site, não "nada novo".
  console.log(`Conferindo o acesso com a edição nº ${ultimo} (já registrada):`);
  if (!(await conferirEdicao(ultimo))) {
    throw new ErroDeAcesso(`Nem a edição nº ${ultimo}, que já saiu, abriu — o STF está recusando o acesso (veja os códigos HTTP acima).`);
  }
  console.log('  → acesso OK.');

  const novas = [];
  // limite de segurança: no máximo 20 números de uma vez
  for (let numero = ultimo + 1; numero <= ultimo + 20; numero++) {
    console.log(`Edição nº ${numero}:`);
    const achou = await conferirEdicao(numero);
    if (!achou) {
      console.log('  → ainda não publicada.');
      break;
    }
    const data = achou.data || hojeIso();
    if (!achou.data) console.log(`  (data não encontrada na página; usando a de hoje, ${data})`);
    console.log(`  → publicada em ${data}.`);
    novas.push({ edicao: numero, ano: Number(data.slice(0, 4)), data });
  }

  if (!novas.length) {
    await resumo([`### Informativos do STF`, `Nenhuma edição nova. Último registrado: nº ${ultimo}.`]);
    return;
  }
  conteudo = inserirEdicoes(conteudo, STF.variavel, novas);
  await fs.writeFile(ARQUIVO_DADOS, conteudo, 'utf-8');
  await resumo([
    `### Informativos do STF`,
    `${novas.length} edição(ões) nova(s) acrescentada(s) a \`${ARQUIVO_DADOS}\`:`,
    ...novas.map((e) => `- nº ${e.edicao} — ${e.data} (súmula: a confirmar)`)
  ]);
}

main().catch(async (err) => {
  if (err instanceof ErroDeAcesso) {
    await resumo([
      `### ❌ Não consegui acessar o site do STF`,
      err.message,
      `Nada foi gravado. Tente rodar de novo mais tarde; se continuar, o STF está bloqueando os servidores do GitHub.`
    ]);
  } else {
    console.error(err);
  }
  process.exitCode = 1;
});
