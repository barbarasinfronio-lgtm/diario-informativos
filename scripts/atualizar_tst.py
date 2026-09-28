#!/usr/bin/env python3
"""
atualizar_tst.py — traz a jurisprudência do TST para os Diários.

Fontes (as mesmas que o próprio site do TST usa):
  - Pesquisa de jurisprudência do TST (jurisprudencia.tst.jus.br): Súmulas,
    Orientações Jurisprudenciais (inclusive as Transitórias) e Precedentes
    Normativos, com situação (criada/alterada/cancelada) e histórico.
  - Tabela Completa de Recursos de Revista Repetitivos (tst.jus.br/nugep-sp):
    todos os temas de IRR, com tese (ou questão, se ainda não julgado),
    último movimento e relator.

São só 4 consultas por execução (uma por tipo), uma vez por semana.

Gera:
  - sumulas-data.js: reescreve só o bloco "tst" do Diário das Súmulas (todas
    as súmulas; as canceladas com "[SÚMULA CANCELADA]" no começo, como já
    era). A chave de leitura continua "tst:<número>".
  - tst/decisoes.json: OJs e Precedentes Normativos vigentes + temas de IRR,
    no formato do Diário das Decisões (carregado pelo rg-repetitivos-logic.js).

Se alguma fonte falhar ou vier incompleta, aquela parte não é trocada (fica a
versão anterior) e o script termina com erro, para aparecer no GitHub.

Uso:  python3 scripts/atualizar_tst.py
"""
import datetime
import html
import json
import os
import re
import sys
import urllib.request
from html.parser import HTMLParser

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UA = "EstudaMana/1.0 (+https://www.estudamana.com.br; atualizacao semanal)"

URL_PESQUISA = "https://jurisprudencia-backend.tst.jus.br/rest/pesquisa-textual/1/1000"
URL_IRR = "https://www.tst.jus.br/nugep-sp/recursos-repetitivos/tabela-completa"
LINK_PESQUISA = "https://jurisprudencia.tst.jus.br/?tipoJuris={tipo}&orgao=TST&pesquisar=1"
LINK_IRR_TABELA = "https://www.tst.jus.br/nugep-sp/recursos-repetitivos/tabela-completa"

# Mínimos esperados: abaixo disso a resposta é tratada como incompleta.
MINIMO = {"SUM": 400, "OJ": 600, "PN": 100, "IRR": 250}

HOJE = datetime.date.today()


# ---- acesso --------------------------------------------------------------
def pesquisar(tipo):
    corpo = {
        "ou": "", "e": "", "termoExato": "", "naoContem": "", "ementa": "", "dispositivo": "",
        "numeracaoUnica": {"numero": "", "digito": "", "ano": "", "orgao": "", "tribunal": "", "vara": ""},
        "orgaosJudicantes": [], "ministros": [], "convocados": [], "classesProcessuais": [],
        "codigosClassesPrecedentes": [], "indicadores": [], "assuntos": [],
        "tipos": [tipo], "orgao": "TST",
        "publicacaoInicial": "", "publicacaoFinal": "", "julgamentoInicial": "", "julgamentoFinal": "",
        "ordenacao": "numero",
    }
    req = urllib.request.Request(
        URL_PESQUISA, data=json.dumps(corpo).encode("utf-8"), method="POST",
        headers={"Content-Type": "application/json", "User-Agent": UA,
                 "Origin": "https://jurisprudencia.tst.jus.br",
                 "Referer": "https://jurisprudencia.tst.jus.br/"},
    )
    with urllib.request.urlopen(req, timeout=60) as r:
        dados = json.load(r)
    registros = [x["registro"] for x in dados.get("registros") or []]
    if len(registros) < MINIMO[tipo]:
        raise RuntimeError(f"{tipo}: só {len(registros)} registros (esperado ≥ {MINIMO[tipo]})")
    return registros


def baixar(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read().decode("utf-8", errors="replace")


# ---- utilidades ------------------------------------------------------------
def limpar(t):
    t = html.unescape(str(t or ""))
    t = re.sub(r"<[^>]+>", " ", t)
    t = t.replace(" ", " ").replace("¿", "–")
    return re.sub(r"\s+", " ", t).strip()


def data_br(iso):
    m = re.match(r"(\d{4})-(\d{2})-(\d{2})", str(iso or ""))
    return f"{m.group(3)}/{m.group(2)}/{m.group(1)}" if m else ""


def ano(iso_ou_br):
    m = re.search(r"(\d{4})", str(iso_ou_br or ""))
    return int(m.group(1)) if m else None


def cancelada(r):
    return ((r.get("situacao") or {}).get("descricao") or "").upper() == "CANCELADA"


# ---- Diário das Súmulas ------------------------------------------------------
def atualizar_sumulas(sumulas):
    caminho = os.path.join(RAIZ, "sumulas-data.js")
    with open(caminho, encoding="utf-8") as f:
        texto = f.read()
    m = re.search(r"\n  tst: \{\n[\s\S]*?\n  \},\n", texto)
    if not m:
        raise RuntimeError("bloco \"tst\" não encontrado em sumulas-data.js")

    linhas = []
    for r in sorted(sumulas, key=lambda x: int(x.get("numero") or 0)):
        corpo = limpar(r.get("tese"))
        if cancelada(r):
            corpo = "[SÚMULA CANCELADA] " + corpo
        linhas.append("      { numero: %d, texto: %s, materia: null, link: SUMULAS_LINK_TST }"
                      % (int(r["numero"]), json.dumps(corpo, ensure_ascii=False)))
    bloco = ("\n  tst: {\n    label: \"TST — Súmulas\",\n    status: \"disponivel\",\n"
             "    // gerado por scripts/atualizar_tst.py a partir da pesquisa de jurisprudência do TST\n"
             "    sumulas: [\n" + ",\n".join(linhas) + "\n    ]\n  },\n")
    novo = texto[:m.start()] + bloco + texto[m.end():]
    if novo != texto:
        with open(caminho, "w", encoding="utf-8") as f:
            f.write(novo)
    print(f"Súmulas: {len(linhas)} ({sum(1 for r in sumulas if cancelada(r))} canceladas)")


# ---- Diário das Decisões: OJs e PNs -------------------------------------------
ORGAO_OJ = {
    "SDI1": ("OJ SDI-1", "Orientação Jurisprudencial da SDI-1", "Direito do Trabalho"),
    "SDI2": ("OJ SDI-2", "Orientação Jurisprudencial da SDI-2", "Direito Processual do Trabalho"),
    "SDC": ("OJ SDC", "Orientação Jurisprudencial da SDC", "Direito Coletivo do Trabalho"),
    "PLENO": ("OJ Pleno", "Orientação Jurisprudencial do Tribunal Pleno", "Direito do Trabalho"),
}


def risco_consolidada(r, rotulo):
    """Mesmo espírito dos riscos do STF/STJ: redação recente pesa mais."""
    a = ano(r.get("dtaPublicacao"))
    if a and a >= HOJE.year - 2:
        return "Alta", f"redação publicada/alterada em {a} (entendimento recente); {rotulo} vigente do TST"
    if "Transitória" in rotulo or rotulo in ("OJ SDC", "PN", "OJ Pleno"):
        return "Baixa", f"{rotulo} vigente, de aplicação mais restrita"
    return "Média", f"{rotulo} vigente do TST, com redação estável"


def item_consolidado(r, tipo):
    if tipo == "PN":
        rotulo, nome, area, prefixo = "PN", "Precedente Normativo", "Direito Coletivo do Trabalho", "pn"
    else:
        sigla = ((r.get("orgaoJudicante") or {}).get("sigla") or "").strip()
        rotulo, nome, area = ORGAO_OJ.get(sigla, ("OJ " + sigla, "Orientação Jurisprudencial", "Direito do Trabalho"))
        prefixo = "oj-" + sigla.lower()
        if (r.get("tipo") or {}).get("codigoTipoJurisprudencia") == "OJT":
            rotulo += " Transitória"
            nome = nome.replace("Orientação Jurisprudencial", "Orientação Jurisprudencial Transitória")
            prefixo += "-t"
    risco, motivo = risco_consolidada(r, rotulo)
    historico = "\n".join(p for p in [limpar(r.get("observacao")), limpar(r.get("historico"))] if p)
    return {
        "id": f"tst-{prefixo}-{r['numero']}",
        "tema": str(r["numero"]),
        "area": area,
        "orgao": "TST",
        "tipo": tipo.lower(),
        "precedenteLabel": rotulo,
        "tipoNome": nome,
        "titulo": limpar(r.get("titulo")).rstrip(".") or f"{rotulo} {r['numero']}",
        "tese": limpar(r.get("tese")),
        "destaque": "",
        "processo": "",
        "relator": "",
        "data": data_br(r.get("dtaPublicacao")),
        "info": "",
        "status": "vigente",
        "risco": risco,
        "motivo": motivo,
        "historico": historico,
        "link": LINK_PESQUISA.format(tipo="PN" if tipo == "PN" else "OJ"),
    }


# ---- Diário das Decisões: IRR ------------------------------------------------
class Tabela(HTMLParser):
    """Lê a maior <table> da página: linhas de células (texto + 1º link)."""

    def __init__(self):
        super().__init__()
        self.tabelas, self.pilha = [], []
        self.celula = None

    def handle_starttag(self, tag, attrs):
        if tag == "table":
            self.pilha.append([])
        elif tag == "tr" and self.pilha:
            self.pilha[-1].append([])
        elif tag in ("td", "th") and self.pilha and self.pilha[-1]:
            self.celula = {"texto": [], "link": None}
        elif tag == "a" and self.celula is not None and not self.celula["link"]:
            self.celula["link"] = dict(attrs).get("href")
        elif tag in ("br", "p", "div", "li") and self.celula is not None:
            self.celula["texto"].append("\n")

    def handle_endtag(self, tag):
        if tag in ("td", "th") and self.celula is not None and self.pilha and self.pilha[-1]:
            texto = re.sub(r"[ \t ]+", " ", "".join(self.celula["texto"]))
            texto = re.sub(r"\s*\n\s*", "\n", texto).strip()
            self.pilha[-1][-1].append({"texto": texto, "link": self.celula["link"]})
            self.celula = None
        elif tag == "table" and self.pilha:
            self.tabelas.append(self.pilha.pop())

    def handle_data(self, data):
        if self.celula is not None:
            self.celula["texto"].append(data)


def item_irr(c):
    tema = re.sub(r"\D", "", c[0]["texto"])
    representativos = c[1]["texto"]
    tese = re.sub(r"\s*\n\s*", " ", c[2]["texto"]).strip()
    movimento = c[3]["texto"].split("\n")[0].strip()
    suspensao = re.sub(r"\s*\n\s*", " ", c[4]["texto"]).strip()
    relator = re.sub(r"^Ministr[oa]\s+", "", c[5]["texto"].strip())
    julgado = bool(re.search(r"transitad|acórdão publicado|acordo", movimento, re.I))

    processo = (re.search(r"(?:IRR|RR|E-RR|IncJulgRREmbRep|Ag)[^\n]*?\d{4,7}-\d{2}\.\d{4}\.\d\.\d{2}\.\d{4}", representativos) or [None])[0]
    pub = re.search(r"[Pp]ublicad[oa] em (\d{1,2})[/.](\d{1,2})[/.](\d{4})", representativos)
    data = f"{int(pub.group(1)):02d}/{int(pub.group(2)):02d}/{pub.group(3)}" if pub else ""

    # Título: começo da tese/questão, sem o rótulo "Tese Jurídica (...)".
    base = re.sub(r"^(Tese Jur[ií]dica|Quest[ãa]o Jur[ií]dica)\s*(\([^)]*\))?\s*[:\-–]?\s*", "", tese)
    titulo = base if len(base) <= 150 else base[:150].rsplit(" ", 1)[0] + "…"

    if julgado:
        a = ano(data)
        if a and a >= HOJE.year - 1:
            risco, motivo = "Alta", f"tese vinculante fixada em {a} (muito recente)"
        else:
            risco, motivo = "Média", "tese vinculante do TST em recurso de revista repetitivo"
    else:
        risco, motivo = "Média", "tema afetado e ainda sem tese: a questão está em julgamento no TST"

    historico = "\n".join(p for p in [f"Último movimento: {movimento}" if movimento else "",
                                      f"Suspensão: {suspensao}" if suspensao else ""] if p)
    link = c[0]["link"] or LINK_IRR_TABELA
    if link.startswith("/"):
        link = "https://www.tst.jus.br" + link
    return {
        "id": f"tst-irr-{tema}",
        "tema": tema,
        "area": "Direito do Trabalho",
        "orgao": "TST",
        "tipo": "irr",
        "precedenteLabel": "Tema",
        "tipoNome": "Recurso de Revista Repetitivo (IRR)",
        "titulo": titulo,
        "tese": tese if julgado else "",
        "questao": "" if julgado else tese,
        "destaque": "",
        "processo": processo or "",
        "relator": relator,
        "data": data,
        "info": "",
        "status": "vigente" if julgado else "afetado",
        "risco": risco,
        "motivo": motivo,
        "historico": historico,
        "link": link,
    }


def ler_irr(pagina):
    p = Tabela()
    p.feed(pagina)
    if not p.tabelas:
        raise RuntimeError("IRR: tabela não encontrada")
    linhas = max(p.tabelas, key=len)
    itens = [item_irr(c) for c in linhas[1:] if len(c) >= 6 and re.search(r"\d", c[0]["texto"])]
    if len(itens) < MINIMO["IRR"]:
        raise RuntimeError(f"IRR: só {len(itens)} temas (esperado ≥ {MINIMO['IRR']})")
    return itens


# ---- principal ------------------------------------------------------------
def main():
    erros = []

    try:
        atualizar_sumulas(pesquisar("SUM"))
    except Exception as e:  # noqa: BLE001
        erros.append(f"Súmulas: {e}")

    decisoes = []
    for tipo in ("OJ", "PN"):
        try:
            registros = [r for r in pesquisar(tipo) if not cancelada(r)]
            decisoes += [item_consolidado(r, tipo) for r in registros]
            print(f"{tipo}: {len(registros)} vigentes")
        except Exception as e:  # noqa: BLE001
            erros.append(f"{tipo}: {e}")
    try:
        irr = ler_irr(baixar(URL_IRR))
        decisoes += irr
        print(f"IRR: {len(irr)} temas ({sum(1 for i in irr if i['status'] == 'afetado')} ainda em julgamento)")
    except Exception as e:  # noqa: BLE001
        erros.append(f"IRR: {e}")

    if not erros:
        pasta = os.path.join(RAIZ, "tst")
        os.makedirs(pasta, exist_ok=True)
        with open(os.path.join(pasta, "decisoes.json"), "w", encoding="utf-8") as f:
            json.dump({"fonte": "TST", "total": len(decisoes), "itens": decisoes},
                      f, ensure_ascii=False, separators=(",", ":"))
            f.write("\n")
        print(f"tst/decisoes.json: {len(decisoes)} itens")
    else:
        print("tst/decisoes.json NÃO foi atualizado (fica a versão anterior).", file=sys.stderr)

    for e in erros:
        print("ERRO " + e, file=sys.stderr)
    sys.exit(1 if erros else 0)


if __name__ == "__main__":
    main()
