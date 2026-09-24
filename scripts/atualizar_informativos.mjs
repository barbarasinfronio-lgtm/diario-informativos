import fs from 'fs/promises';
import { GoogleGenAI, Type } from '@google/genai';

const ai = new GoogleGenAI({});

// Ficheiro onde residem os dados dos informativos do sítio
const ARQUIVO_DADOS = './diario-data.js';

// Função auxiliar para testar se um URL público responde com sucesso (200 OK)
async function urlExiste(url) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.status === 200;
  } catch {
    return false;
  }
}

async function checarNovosInformativosSTF(ultimoNumeroRegistado) {
  const proximoNumero = ultimoNumeroRegistado + 1;
  const urlPdf = `https://www.stf.jus.br/arquivo/cms/informativoSTF/anexo/Informativo_PDF/Informativo_stf_${proximoNumero}.pdf`;

  console.log(`A verificar publicação do Informativo STF nº ${proximoNumero}...`);
  const publicado = await urlExiste(urlPdf);

  if (!publicado) {
    console.log(`O Informativo nº ${proximoNumero} ainda não foi publicado.`);
    return null;
  }

  console.log(`Novo Informativo STF detetado: nº ${proximoNumero}! A analisar...`);

  // Prompt para classificar o novo lançamento
  const prompt = `
O Informativo STF nº ${proximoNumero} acaba de ser publicado.
Link oficial: ${urlPdf}
Gere uma breve síntese preliminar de catalogação e nível de atenção geral para concurseiros e advogados.
`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          resumo: { type: Type.STRING },
          nivelRisco: { type: Type.STRING, enum: ['Baixo', 'Médio', 'Alto'] },
          temasProvaveis: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['resumo', 'nivelRisco', 'temasProvaveis']
      }
    }
  });

  const analise = JSON.parse(response.text);

  return {
    numero: proximoNumero,
    ano: new Date().getFullYear(),
    data: new Date().toLocaleDateString('pt-BR'),
    link: urlPdf,
    orgao: 'STF',
    analiseRisco: analise
  };
}

async function main() {
  console.log('--- Início da Verificação Semanal de Informativos ---');

  // 1. Lê a base atual para identificar a última edição catalogada
  let conteudoAtual = await fs.readFile(ARQUIVO_DADOS, 'utf-8');
  
  // Exemplo de identificação: procura pelo último número registado no STF
  const matchSTF = conteudoAtual.match(/Informativo_stf_(\d+)\.pdf/);
  const ultimoSTF = matchSTF ? parseInt(matchSTF[1], 10) : 1228;

  // 2. Consulta novos lançamentos
  const novoSTF = await checarNovosInformativosSTF(ultimoSTF);

  if (novoSTF) {
    // 3. Atualiza o ficheiro com a nova entrada no topo da lista
    const novaEntrada = `\n// Novo Informativo Adicionado Automaticamente\n// Edição STF: ${novoSTF.numero} - ${novoSTF.data}\n`;
    conteudoAtual = novaEntrada + conteudoAtual;

    await fs.writeFile(ARQUIVO_DADOS, conteudoAtual, 'utf-8');
    console.log(`Ficheiro ${ARQUIVO_DADOS} atualizado com a edição ${novoSTF.numero}.`);
  } else {
    console.log('Nenhuma nova edição encontrada nos órgãos verificados.');
  }
}

main().catch(console.error);
