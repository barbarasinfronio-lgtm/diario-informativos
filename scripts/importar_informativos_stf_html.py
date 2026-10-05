#!/usr/bin/env python3
"""
importar_informativos_stf_html.py — lê os Informativos do STF em .htm (1 a ~999) e
separa os julgados. Versão corrigida do importar.py da Barbara.

Uso:  python3 scripts/importar_informativos_stf_html.py <pasta com informativoNNN.htm> [saida.json]
      python3 scripts/importar_informativos_stf_html.py informativo950.htm      (um arquivo só)

Precisa de: pip3 install beautifulsoup4
Saída: lista de {informativo, data, orgao_julgador, titulo, processo, resumo, parte}.
"""
import json, os, re, sys
from bs4 import BeautifulSoup, NavigableString, Tag

# âncoras que NÃO são julgados (seções do fim do informativo)
NAO_JULGADO = re.compile(r"^#?(repercussao|clipping|inovacao|inovacoes|transcricao\d*|outras|sumario)", re.I)
FIM = re.compile(r"CLIPPING|TRANSCRI[ÇC][ÕO]ES|INOVA[ÇC][ÕO]ES LEGISLATIVAS|OUTRAS INFORMA[ÇC][ÕO]ES")
COLEGIADO = [
    (re.compile(r"^PLEN[ÁA]RIO$"), "Plenário"),
    (re.compile(r"^(PRIMEIRA|1[ªAº]?)\s*TURMA$"), "Primeira Turma"),
    (re.compile(r"^(SEGUNDA|2[ªAº]?)\s*TURMA$"), "Segunda Turma"),
]
RX_PROC = re.compile(r"^(?:[A-Z][A-Za-zÀ-ú]{1,8}\s?(?:AgR|ED|MC|QO|EDv|-AgR)?[-\w]*\s+)?\d[\d.]*[-/\w]*[^.]*,\s*rel\.", re.I)


def limpa(t):
    return re.sub(r"\s+", " ", (t or "").replace("\xa0", " ")).strip()


def sem_espacos(t):
    """"T R A N S C R I Ç Õ E S" → "TRANSCRIÇÕES" (alguns informativos espaçam as letras)."""
    t = limpa(t).upper()
    return re.sub(r"(?<=\w) (?=\w( |$))", "", t) if re.fullmatch(r"(\w ){3,}\w( .*)?", t) else t


def cabecalho(corpo):
    """Número e período: "Brasília, 7 a 11 de dezembro de 1998 - Nº 135." """
    for c in corpo.find_all(["center", "p", "b"], limit=12):
        t = limpa(c.get_text(" "))
        m = re.search(r"(.*?)\s*-\s*N[ºo°]\s*(\d+)", t)
        if m:
            return int(m[2]), limpa(m[1].replace("Bras lia", "Brasília"))
    return None, ""


def extrair_por_texto(html, numero, periodo):
    """Informativos antigos (HTML sem fechar <P>): o BeautifulSoup aninha tudo, então corta o HTML cru
    em cada <A NAME="título"> e lê o texto até a próxima âncora."""
    import html as _h
    ancoras = list(re.finditer(r"<a\s+name=\"?([^\">]+)\"?\s*>(.*?)</a>", html, re.I | re.S))
    ancoras = [a for a in ancoras if not NAO_JULGADO.match(a.group(1).strip())]
    out, colegiado = [], "Plenário"
    for k, a in enumerate(ancoras):
        fim = ancoras[k + 1].start() if k + 1 < len(ancoras) else len(html)
        titulo = limpa(_h.unescape(re.sub(r"<[^>]+>", " ", a.group(2)))) or limpa(_h.unescape(a.group(1)))
        seg = html[a.end():fim]
        m_fim = re.search(r"(CLIPPING|T\s*R\s*A\s*N\s*S\s*C|INOVA[ÇC][ÕO]ES LEGISLATIVAS|OUTRAS INFORMA|Ac[óo]rd[ãa]os publicados)", _h.unescape(re.sub(r"<[^>]+>", " ", seg)))
        proc = ""
        mp = re.search(r"<font[^>]*color=\"?#008080\"?[^>]*>(.*?)</font>", seg, re.I | re.S)
        if mp:
            proc = limpa(_h.unescape(re.sub(r"<[^>]+>", " ", mp.group(1))))
            seg = seg.replace(mp.group(0), " ")
        txt = limpa(_h.unescape(re.sub(r"<[^>]+>", " ", re.sub(r"(?i)<(br|p)\b[^>]*>", "\n", seg))))
        if m_fim:
            txt = limpa(_h.unescape(re.sub(r"<[^>]+>", " ", re.sub(r"(?i)<(br|p)\b[^>]*>", "\n", seg[:max(0, len(seg) - len(seg[m_fim.start():]))] if False else seg))))
            cut = re.search(r"(?:CLIPPING|T\s*R\s*A\s*N\s*S\s*C|INOVA[ÇC][ÕO]ES LEGISLATIVAS|OUTRAS INFORMA|Ac[óo]rd[ãa]os publicados)", txt)
            if cut:
                txt = txt[:cut.start()].strip()
        # cabeçalhos de colegiado que vieram no fim deste trecho valem para os próximos julgados
        c_atual = colegiado
        for rx, nome in COLEGIADO:
            for linha in re.findall(r"(PLEN[ÁA]RIO|PRIMEIRA TURMA|SEGUNDA TURMA)\s*$", txt):
                if rx.match(linha):
                    colegiado = nome
        txt = re.sub(r"\s*(PLEN[ÁA]RIO|PRIMEIRA TURMA|SEGUNDA TURMA)\s*$", "", txt).strip()
        base = re.sub(r"\s*-\s*\d+\s*$", "", titulo)
        if txt or proc:
            out.append({"informativo": numero, "periodo": periodo, "orgao_julgador": c_atual,
                        "titulo": base, "processo": proc, "resumo": txt})
    return out


def extrair(caminho):
    bruto = open(caminho, "rb").read()
    html = bruto.decode("iso-8859-1", "replace") if b"charset=iso-8859-1" in bruto[:3000].lower() else bruto.decode("utf-8", "replace")
    soup = BeautifulSoup(html, "html.parser")
    corpo = soup.find("div", id="corpo") or soup.find("div", class_="divGeralPopUp") or soup.body
    if not corpo:
        return []
    numero, periodo = cabecalho(corpo)
    if numero is None:
        m = re.search(r"informativo(\d+)", os.path.basename(caminho), re.I)
        numero = int(m[1]) if m else None
    decisoes, colegiado = [], "Plenário"
    # o sumário também tem links; os julgados têm <a name=…> no corpo
    for a in corpo.find_all("a", attrs={"name": True}):
        nome = a["name"]
        if re.match(r"^#?(clipping|transcricao|inovacao|outras|informacao)", nome.strip(), re.I):
            break          # daqui para a frente não há mais julgados
        if NAO_JULGADO.match(nome.strip()):
            continue
        titulo = limpa(a.get_text()) or limpa((a.find_next("b") or a).get_text())
        if not titulo:
            continue
        partida = a.find_parent("center") or a
        partes, proc = [], ""
        for irmao in partida.next_siblings:
            if isinstance(irmao, Tag):
                if irmao.find("a", attrs={"name": True}) or (irmao.name == "a" and irmao.get("name")):
                    break
                t = limpa(irmao.get_text(" "))
                tn = sem_espacos(t)
                if FIM.search(tn) and len(tn) < 60:
                    break
                if any(rx.match(tn) for rx, _ in COLEGIADO):
                    colegiado_prox = next(n for rx, n in COLEGIADO if rx.match(tn))
                    colegiado = colegiado_prox          # vale para os próximos julgados
                    continue
                if irmao.name == "table":
                    break
                f = irmao.find("font", attrs={"color": re.compile(r"#008080", re.I)}) or \
                    (irmao if irmao.name == "font" and re.search(r"#008080", irmao.get("color", ""), re.I) else None)
                if f:
                    proc = limpa(f.get_text())
                    continue
                if t and t != titulo:
                    partes.append(t)
            elif isinstance(irmao, NavigableString):
                s = limpa(str(irmao))
                if s:
                    partes.append(s)
        resumo = limpa(" ".join(partes))
        if not proc:   # novos informativos: "ADI 3961/DF, rel. Min. …, julgamento em …"
            m = re.search(r"((?:[A-Z][A-Za-z]{1,8}\s)?\d[\d./-]*(?:/[A-Z]{2})?[^.]{0,40},\s*rel[^\n]{0,160}?\d{1,2}\.\d{1,2}\.\d{2,4}\.?)\s*$", resumo)
            if m:
                proc = limpa(m[1]); resumo = limpa(resumo[:m.start()])
        if proc and proc in resumo:
            resumo = limpa(resumo.replace(proc, ""))
        if not resumo and not proc:
            continue
        base = re.sub(r"\s*-\s*\d+\s*$", "", titulo)       # "… - 12", "… - 13": partes do mesmo julgado
        decisoes.append({"informativo": numero, "periodo": periodo, "orgao_julgador": colegiado,
                         "titulo": base, "titulo_original": titulo, "processo": proc, "resumo": resumo})
    if not decisoes:
        decisoes = extrair_por_texto(html, numero, periodo)
        for d in decisoes:
            d["titulo_original"] = d["titulo"]
    # junta as partes "- 1", "- 2", "- 3" do mesmo julgado
    juntas = []
    for d in decisoes:
        if juntas and d["titulo"] == juntas[-1]["titulo"] and d["processo"] == juntas[-1]["processo"] and d["titulo"] != d["titulo_original"]:
            juntas[-1]["resumo"] = limpa(juntas[-1]["resumo"] + " " + d["resumo"])
        else:
            juntas.append(d)
    for d in juntas:
        d.pop("titulo_original", None)
    return juntas


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    alvo = sys.argv[1]
    arqs = [alvo] if os.path.isfile(alvo) else sorted(
        os.path.join(r, f) for r, _, fs in os.walk(alvo) for f in fs if re.match(r"informativo\d+\.html?$", f, re.I))
    if not arqs:
        sys.exit(f"Não achei arquivos informativoNNN.htm em {alvo!r} (confira o caminho da pasta)")
    todas = []
    for a in arqs:
        r = extrair(a)
        print(f"{os.path.basename(a)}: {len(r)} julgado(s)")
        todas.extend(r)
    saida = sys.argv[2] if len(sys.argv) > 2 else "decisoes_stf.json"
    json.dump(todas, open(saida, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"Total: {len(todas)} julgados de {len(arqs)} informativos → {saida}")
