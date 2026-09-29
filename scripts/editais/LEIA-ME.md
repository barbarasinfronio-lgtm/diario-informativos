# Mapear um edital novo (conteúdo programático → editais-data.js)

1. Baixe o edital oficial (PDF) e extraia o texto com PyMuPDF (sai sem palavras partidas):
   `python3 -c "import fitz; open('ed.txt','w').write(''.join(p.get_text() for p in fitz.open('ed.pdf')))"`
2. Separe por matéria:
   - títulos em linha própria (ex.: MPT): `python3 split.py ed.txt entrada.json "GRUPO I" 2 "DIREITO CONSTITUCIONAL=constitucional" ...`
     (o número após o marcador é qual ocorrência dele inicia o programa; cada título vira `TÍTULO=matéria do Diário de Leis`)
   - automático (títulos de matéria em MAIÚSCULAS, blocos/grupos, matéria escolhida pelo nome — serve para
     a maioria dos editais de magistratura/MP/defensoria): `python3 split3.py ed.txt nome-entrada.json "marcador inicial" "marcador final" UF`
     (`--inline` quando os títulos vêm como "DIREITO CIVIL:" no meio do parágrafo)
   - títulos "MATÉRIA:" no meio do texto (Cebraspe, FGV…): `python3 split2.py ed.txt entrada.json "marcador inicial" "" '{"DIREITO CIVIL":"civil", ...}'`
3. Para edital estadual/distrital, ponha `"uf": "DF"` (ou a sigla do estado) em entrada.json.
4. Rode: `jsc mapear.js -- <pasta do repo> entrada.json > saida.json`
   (`jsc` = /System/Library/Frameworks/JavaScriptCore.framework/Versions/Current/Helpers/jsc)
   - `leis`: só as leis citadas EXPRESSAMENTE (número, sigla ou nome — o mesmo reconhecimento de normas-citadas.js) que já estão no Diário de Leis.
   - `extras`: normas citadas que ainda não estão no Diário (vão para a lista "fora do Diário").
   - `tse`: resoluções do TSE citadas — só elas entram no Diário das Resoluções.
   - Datas por extenso ("Lei nº 11.343, de 23 de agosto de 2006") já são entendidas.
   - Banca que bloqueia download fora do navegador (Vunesp): abra o PDF no navegador, extraia com pdf.js
     e rode a mesma lógica lá (é o que foi feito com o TJAC).
5. Monte com `python3 montar.py <pasta> itens.json` (veja o topo do montar.py): corrige erros de digitação
   comuns dos editais, agrupa nos Blocos I–III do CNJ quando o edital não traz os blocos e liga à carreira.
   Ou monte à mão o item em editais-data.js (id, sigla, cargo, orgao, titulo, edital, grupos, leis, extras, tipo:"edital")
   e ponha o id no campo "editais" da carreira certa (as uniões são calculadas sozinhas).
