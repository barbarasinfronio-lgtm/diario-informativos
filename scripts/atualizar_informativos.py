#!/usr/bin/env python3
"""
atualizar_informativos.py — verifica e ACRESCENTA os Informativos novos de
STF, STJ, TSE, CNJ, TST e CNMP em diario-data.js.

Roda no Mac, só quando a Barbara abre "Atualizar Informativos.command" (na
raiz do repositório), uma vez por semana. NÃO tem agendamento.

Por que no Mac: STF, STJ, TSE e TST recusam acessos vindos dos servidores do
GitHub (403 ou sem resposta; testado em 28-29/09/2026). CNJ e CNMP
responderiam, mas ficam aqui junto para ser um comando só.

Cada tribunal é conferido separadamente: se um falhar (site fora do ar,
bloqueio, página que mudou de formato), os outros continuam e o que deu
certo é gravado; no fim aparece ERRO para o que falhou.

Como cada um é conferido:
  STF   número seguinte ao último registrado: página HTML oficial da edição
        (data no cabeçalho "Brasília, 21 de setembro de 2026") ou o PDF.
  STJ   número seguinte: página da edição em processo.stj.jus.br (título
        "Informativo de Jurisprudência n. 902 - 22 de setembro de 2026");
        o link gravado é o PDF (scon.stj.jus.br/SCON/GetPDFINFJ?edicao=0902).
  TSE   páginas de listagem do Informativo TSE; o endereço de cada edição
        traz número e período ("...-no-12-ano-28-de-16-a-31-de-agosto-de-2026";
        data = fim do período).
  CNJ   tabela de atos.cnj.jus.br/jurisprudencia (tipo, número, data, PDF).
  TST   busca no JusLaboris por "Informativo TST: n. 315 (… 2026)"
        (data = fim do período do título; não inclui o "TST Execução").
  CNMP  lista "Boletim de Sessão - 11ª Sessão Ordinária 06/08/2026 - Edição
        nº 11/2026" (sessões canceladas ficam de fora, como no Diário).

STJ e TSE recusam (403) qualquer programa, mesmo do Brasil; para eles a
página é aberta pelo Google Chrome do Mac, em modo invisível.

Para STF e STJ, antes de procurar edições novas o robô abre a última já
registrada, que com certeza existe: se nem ela abrir, é bloqueio, não
"nada novo". Para os que usam listagem, a listagem precisa trazer edições
reconhecíveis, senão é ERRO ("a página mudou").

Cada edição nova entra no topo da lista do tribunal com "sumula: null"
("a confirmar" — conferido à mão depois).

Uso:  python3 scripts/atualizar_informativos.py
Sai com código 0 (tudo certo, com ou sem novidade) ou 1 (algum tribunal
falhou).
"""
import html
import re
import socket
import ssl
import shutil
import subprocess
import sys
import tempfile
import unicodedata
import urllib.error
import urllib.parse
import urllib.request
import zlib
from datetime import datetime, timedelta, timezone
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
ARQUIVO = RAIZ / "diario-data.js"
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/128.0 Safari/537.36")
MESES = ["jan", "fev", "mar", "abr", "mai", "jun",
         "jul", "ago", "set", "out", "nov", "dez"]


class Falha(Exception):
    """Erro de um tribunal: os outros continuam."""


# ================================================================ HTTPS
#
# Alguns servidores (o do STF, pelo menos) mandam o certificado HTTPS sem o
# intermediário da cadeia. Navegadores completam sozinhos; o Python não. Se
# a verificação falhar, baixamos o intermediário do endereço indicado no
# próprio certificado (AIA) e tentamos de novo — a verificação continua
# valendo (o intermediário precisa ser assinado por uma raiz confiável).

def _contexto_padrao():
    ctx = ssl.create_default_context()
    try:  # Python do python.org no Mac às vezes vem sem as raízes do sistema
        import certifi
        ctx.load_verify_locations(certifi.where())
    except ImportError:
        pass
    return ctx


def _contexto_com_intermediario(host):
    cert = ssl.get_server_certificate((host, 443), timeout=30)
    texto = subprocess.run(["openssl", "x509", "-noout", "-text"], input=cert,
                           capture_output=True, text=True, timeout=30).stdout
    m = re.search(r"CA Issuers - URI:(\S+)", texto)
    if not m:
        raise Falha(f"certificado de {host} incompleto e sem endereço do intermediário")
    print(f"  (completando a cadeia de certificados de {host})")
    with urllib.request.urlopen(m.group(1), timeout=30) as r:
        dados = r.read()
    pem = (dados.decode("ascii") if dados.startswith(b"-----BEGIN")
           else ssl.DER_cert_to_PEM_cert(dados))
    ctx = _contexto_padrao()
    ctx.load_verify_locations(cadata=pem)
    return ctx


_contextos = {}


def buscar(url):
    """Devolve (status, content-type, corpo em bytes). Erro de rede → Falha."""
    host = urllib.parse.urlsplit(url).hostname
    if host not in _contextos:
        _contextos[host] = _contexto_padrao()
    req = urllib.request.Request(url, headers={
        "User-Agent": UA,
        "Accept": "text/html,application/pdf,*/*;q=0.8",
        "Accept-Language": "pt-BR,pt;q=0.9",
    })
    completou = False
    for tentativa in (1, 2, 3):
        try:
            with urllib.request.urlopen(req, context=_contextos[host], timeout=60) as r:
                return r.status, r.headers.get("Content-Type", ""), r.read()
        except urllib.error.HTTPError as e:
            if e.code >= 500 and tentativa < 3:
                continue
            return e.code, e.headers.get("Content-Type", ""), b""
        except urllib.error.URLError as e:
            if isinstance(e.reason, ssl.SSLCertVerificationError) and not completou:
                _contextos[host] = _contexto_com_intermediario(host)
                completou = True
                continue
            if tentativa == 3:
                raise Falha(f"{url} → sem resposta ({e.reason})")
        except (socket.timeout, TimeoutError) as e:
            if tentativa == 3:
                raise Falha(f"{url} → sem resposta ({e})")
    raise Falha(f"{url} → sem resposta")


# Alguns sites (STJ e TSE) têm proteção anti-robô: recusam (403) qualquer
# programa, mesmo do Brasil, mas aceitam um navegador de verdade. Para esses,
# quando vier 403, a página é aberta pelo Google Chrome do Mac, em modo
# invisível (headless), com um perfil temporário — não mexe no Chrome aberto.
CHROMES = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
]
_via_navegador = set()  # hosts que já recusaram o acesso direto nesta rodada
_chrome = {}


def _achar_chrome():
    if "caminho" not in _chrome:
        caminho = next((c for c in CHROMES if Path(c).exists()), None)
        caminho = caminho or shutil.which("google-chrome") or shutil.which("chromium")
        ua = UA
        if caminho:
            try:
                v = subprocess.run([caminho, "--version"], capture_output=True,
                                   text=True, timeout=30).stdout
                m = re.search(r"(\d+)\.\d+\.\d+\.\d+", v)
                if m:  # User-Agent igual ao do Chrome normal (sem "Headless")
                    ua = re.sub(r"Chrome/[\d.]+", f"Chrome/{m.group(1)}.0.0.0", UA)
            except Exception:
                pass
        _chrome.update(caminho=caminho, ua=ua)
    return _chrome["caminho"], _chrome["ua"]


def pagina_navegador(url):
    caminho, ua = _achar_chrome()
    if not caminho:
        raise Falha("o site recusou o acesso direto e não achei o Google Chrome "
                    "neste Mac para abrir a página")
    with tempfile.TemporaryDirectory() as perfil:
        try:
            r = subprocess.run(
                [caminho, "--headless=new", "--disable-gpu", "--no-first-run",
                 "--no-default-browser-check", "--disable-extensions",
                 f"--user-data-dir={perfil}", f"--user-agent={ua}", "--lang=pt-BR",
                 "--virtual-time-budget=15000", "--dump-dom", url],
                capture_output=True, text=True, timeout=120)
        except subprocess.TimeoutExpired:
            raise Falha(f"{url} → o Chrome não terminou de abrir a página em 2 minutos")
    texto = r.stdout or ""
    print(f"  {url} → pelo Chrome ({len(texto)} caracteres)")
    if len(texto) < 500 or re.search(r"Access Denied|Request Rejected|acesso negado", texto[:3000], re.I):
        raise Falha(f"{url} → o site recusou até o Chrome")
    return texto


def pagina(url):
    """Texto de uma página HTML; qualquer coisa diferente de 200 → Falha.
    Se o site responder 403, tenta de novo pelo Chrome do Mac."""
    host = urllib.parse.urlsplit(url).hostname
    if host in _via_navegador:
        return pagina_navegador(url)
    status, tipo, corpo = buscar(url)
    print(f"  {url} → HTTP {status}")
    if status == 403:
        _via_navegador.add(host)
        return pagina_navegador(url)
    if status != 200:
        raise Falha(f"{url} → HTTP {status} (o site recusou ou a página mudou)")
    return texto_de(corpo, tipo)


def texto_de(corpo, tipo):
    if re.search(r"charset=(windows-1252|iso-8859-1|latin-?1)", tipo, re.I):
        return corpo.decode("cp1252", "replace")
    try:
        return corpo.decode("utf-8")
    except UnicodeDecodeError:
        return corpo.decode("cp1252", "replace")


def eh_pdf(tipo, corpo):
    return corpo[:5] == b"%PDF-" or (bool(corpo) and "pdf" in tipo.lower())


# ================================================================ datas

def mes_num(nome):
    n = re.sub(r"[^a-z]", "", unicodedata.normalize("NFD", nome.lower()))[:3]
    return MESES.index(n) + 1 if n in MESES else None


def iso(ano, mes, dia):
    return f"{int(ano):04d}-{int(mes):02d}-{int(dia):02d}"


def hoje():
    return (datetime.now(timezone.utc) - timedelta(hours=3)).strftime("%Y-%m-%d")


def data_do_pdf(corpo):
    """Data de criação gravada no PDF (/CreationDate ou XMP), ou None."""
    pedacos = [corpo]
    if not re.search(rb"/CreationDate\s*\(D:\d{8}|CreateDate>\d{4}-", corpo):
        for m in re.finditer(rb"stream\r?\n(.*?)endstream", corpo, re.S):
            try:
                pedacos.append(zlib.decompress(m.group(1)))
            except Exception:
                continue
    for p in pedacos:
        m = re.search(rb"/CreationDate\s*\(D:(\d{4})(\d{2})(\d{2})", p)
        if m:
            return iso(*m.groups())
        m = re.search(rb"CreateDate>(\d{4})-(\d{2})-(\d{2})", p)
        if m:
            return iso(*m.groups())
    return None


# ================================================================ diario-data.js

class Dados:
    def __init__(self, caminho):
        self.caminho = caminho
        self.texto = caminho.read_text(encoding="utf-8")
        self.mudou = False

    def bloco(self, var):
        m = re.search(rf"var\s+{var}\s*=\s*\[\n(.*?)\n\s*\];", self.texto, re.S)
        if not m:
            raise Falha(f'não achei "var {var} = [" em diario-data.js')
        return m.group(1)

    def registradas(self, var):
        """Lista de (edicao, ano, link) na ordem do arquivo (mais nova primeiro)."""
        saida = []
        for linha in self.bloco(var).splitlines():
            e = re.search(r"edicao:\s*(\d+)", linha)
            a = re.search(r"ano:\s*(\d{4})", linha)
            if e and a:
                l = re.search(r'link:\s*"([^"]*)"', linha)
                saida.append((int(e.group(1)), int(a.group(1)), l.group(1) if l else ""))
        return saida

    def inserir(self, var, novas, com_link):
        """novas: lista de dicts {edicao, data, link?}, em qualquer ordem."""
        novas = sorted(novas, key=lambda n: (n["data"], n["edicao"]), reverse=True)
        linhas = ""
        for n in novas:
            extra = f', link: "{n["link"]}"' if com_link else ""
            linhas += (f'    {{ edicao: {n["edicao"]}, ano: {n["data"][:4]}, '
                       f'data: "{n["data"]}", sumula: null{extra} }},\n')
        self.texto, k = re.subn(rf"(var\s+{var}\s*=\s*\[\n)",
                                lambda m: m.group(1) + linhas, self.texto, count=1)
        if not k:
            raise Falha(f'não achei "var {var} = [" em diario-data.js')
        self.mudou = True

    def gravar(self):
        if self.mudou:
            self.caminho.write_text(self.texto, encoding="utf-8")


def filtrar_novas(achadas, registradas):
    """Das edições achadas numa listagem, as que ainda não estão no Diário.

    Numeração que reinicia a cada ano: é nova se (edicao, ano) não está
    registrada E é maior que a maior registrada daquele ano (assim uma
    edição antiga que nunca entrou no Diário não volta sozinha).
    """
    vistas = {(e, a) for e, a, _ in registradas}
    maior = {}
    for e, a, _ in registradas:
        maior[a] = max(maior.get(a, 0), e)
    ultimo_ano = max((a for _, a, _ in registradas), default=0)
    novas, ja = [], set()
    for n in achadas:
        chave = (n["edicao"], int(n["data"][:4]))
        if chave in vistas or chave in ja:
            continue
        ano = chave[1]
        if ano < ultimo_ano or n["edicao"] <= maior.get(ano, 0):
            continue
        ja.add(chave)
        novas.append(n)
    return novas


# ================================================================ tribunais

def stf(dados):
    var = "STF_DATA"
    ultimo = dados.registradas(var)[0][0]

    def conferir(n):
        url = f"https://www.stf.jus.br/arquivo/informativo/documento/informativo{n}.htm"
        status, tipo, corpo = buscar(url)
        print(f"  HTML nº {n} → HTTP {status}")
        if status == 200:
            t = texto_de(corpo, tipo)
            if re.search(rf"N\S{{0,2}}\s*{n}\b", t):
                m = re.search(r"Bras\S{0,3}lia,?\s*(\d{1,2})\s+de\s+(\S+)\s+de\s+(\d{4})", t, re.I)
                if m and mes_num(m.group(2)):
                    return {"edicao": n, "data": iso(m.group(3), mes_num(m.group(2)), m.group(1))}
                return {"edicao": n, "data": None}
        url = (f"https://www.stf.jus.br/arquivo/cms/informativoSTF/anexo/"
               f"Informativo_PDF/Informativo_stf_{n}.pdf")
        status, tipo, corpo = buscar(url)
        print(f"  PDF  nº {n} → HTTP {status}")
        if status == 200 and eh_pdf(tipo, corpo):
            return {"edicao": n, "data": data_do_pdf(corpo)}
        return None

    return por_numero(dados, var, ultimo, conferir, com_link=False)


def stj(dados):
    var = "STJ_DATA"
    ultimo = dados.registradas(var)[0][0]

    def conferir(n):
        # Página da edição: o título traz "Informativo de Jurisprudência
        # n. 902 - 22 de setembro de 2026". O link gravado é o PDF oficial.
        url = ("https://processo.stj.jus.br/jurisprudencia/externo/informativo/"
               f"?acao=pesquisarumaedicao&livre={n:04d}.cod.")
        t = re.sub(r"<[^>]+>|\s+", " ", html.unescape(pagina(url)))
        m = re.search(rf"Informativo de Jurisprud\S*\s+n\.?\s*0*{n}\s*[-–—]\s*"
                      r"(\d{1,2})[º°o]?\s+de\s+(\S+)\s+de\s+(\d{4})", t, re.I)
        if not m:
            print(f"  nº {n}: não está na página")
            return None
        mes = mes_num(m.group(2))
        return {"edicao": n, "data": iso(m.group(3), mes, m.group(1)) if mes else None,
                "link": f"https://scon.stj.jus.br/SCON/GetPDFINFJ?edicao={n:04d}"}

    return por_numero(dados, var, ultimo, conferir, com_link=True)


def por_numero(dados, var, ultimo, conferir, com_link):
    print(f"  último registrado: nº {ultimo}; conferindo o acesso com ele:")
    if not conferir(ultimo):
        raise Falha(f"nem a edição nº {ultimo}, que já saiu, abriu — o site "
                    "está recusando o acesso (veja os códigos HTTP acima)")
    novas = []
    for n in range(ultimo + 1, ultimo + 21):  # no máximo 20 de uma vez
        achou = conferir(n)
        if not achou:
            break
        if not achou["data"]:
            achou["data"] = hoje()
            print(f"  (nº {n}: data não encontrada; usando a de hoje)")
        novas.append(achou)
    if novas:
        dados.inserir(var, novas, com_link)
    return novas


def tse(dados):
    var = "TSE_DATA"
    base = "https://www.tse.jus.br/jurisprudencia/informativo-tse"
    ano = int(hoje()[:4])
    urls = [base, f"{base}/arquivos/{ano}", f"{base}/arquivos"]
    achadas, erros = {}, []
    for url in urls:
        try:
            t = pagina(url)
        except Falha as e:
            erros.append(str(e))
            continue
        for href in re.findall(r'href="([^"]*informativo-tse-no-\d+[^"]*)"', t):
            href = html.unescape(href).split("?")[0].split("#")[0]
            href = re.sub(r"/(view|@@\w+|at_download/file)$", "", href)
            link = urllib.parse.urljoin(url + "/", href)
            slug = link.rstrip("/").rsplit("/", 1)[-1]
            m = re.match(r"(?:tse-)?informativo-tse-no-(\d+)-ano-\d+-(.*)$", slug)
            d = re.search(r"-(\d{1,2})o?-de-([a-z\u00e7]+)-de-(\d{4})$", slug)
            if not (m and d and mes_num(d.group(2))):
                continue
            n = int(m.group(1))
            data = iso(d.group(3), mes_num(d.group(2)), d.group(1))
            achadas.setdefault((n, data[:4]), {"edicao": n, "data": data, "link": link})
    if not achadas:
        raise Falha("não achei nenhuma edição nas páginas do TSE"
                    + (f" ({'; '.join(erros)})" if erros else " — a página mudou?"))
    novas = filtrar_novas(list(achadas.values()), dados.registradas(var))
    if novas:
        dados.inserir(var, novas, com_link=True)
    return novas


def cnj(dados):
    var = "CNJ_DATA"
    url = "https://atos.cnj.jus.br/jurisprudencia"
    t = pagina(url)
    achadas = []
    for linha in re.findall(r"<tr[^>]*>(.*?)</tr>", t, re.S | re.I):
        celulas = [re.sub(r"<[^>]+>|\s+", " ", c).strip()
                   for c in re.findall(r"<td[^>]*>(.*?)</td>", linha, re.S | re.I)]
        pdf = re.search(r'href="([^"]+\.pdf)"', linha, re.I)
        if len(celulas) < 3 or not pdf or "informativo" not in celulas[0].lower():
            continue
        n = re.search(r"\d+", celulas[1])
        d = re.search(r"(\d{2})/(\d{2})/(\d{4})", celulas[2])
        if n and d:
            achadas.append({"edicao": int(n.group()), "data": iso(d.group(3), d.group(2), d.group(1)),
                            "link": urllib.parse.urljoin(url, html.unescape(pdf.group(1)))})
    if not achadas:
        raise Falha("não achei nenhum Informativo na tabela do CNJ — a página mudou?")
    novas = filtrar_novas(achadas, dados.registradas(var))
    if novas:
        dados.inserir(var, novas, com_link=True)
    return novas


def tst(dados):
    var = "TST_DATA"
    base = "https://juslaboris.tst.jus.br"
    consulta = urllib.parse.quote('"Informativo TST"')
    urls = [f"{base}/discover?query={consulta}&sort_by=dc.date.issued_dt&order=desc&rpp=20",
            f"{base}/discover?query={consulta}&sort_by=dc.date.accessioned_dt&order=desc&rpp=20"]
    achadas, erros = {}, []
    for url in urls:
        try:
            t = pagina(url)
        except Falha as e:
            erros.append(str(e))
            continue
        t = html.unescape(t)
        for m in re.finditer(r'href="(/handle/20\.500\.12178/\d+)[^"]*"', t):
            trecho = re.sub(r"<[^>]+>|\s+", " ", t[m.end():m.end() + 800])
            tit = re.search(r"Informativo TST\s*:\s*n\.\s*(\d+)\s*\(([^)]*?)(\d{1,2})\s+([a-z\u00e7]+)\.?\s+(\d{4})\)",
                            trecho, re.I)
            if not tit or not mes_num(tit.group(4)) or trecho.find(tit.group(0)) > 300:
                continue
            n = int(tit.group(1))
            achadas.setdefault(n, {"edicao": n, "link": base + m.group(1),
                                   "data": iso(tit.group(5), mes_num(tit.group(4)), tit.group(3))})
    if not achadas:
        raise Falha("não achei nenhum Informativo TST na busca do JusLaboris"
                    + (f" ({'; '.join(erros)})" if erros else " — a página mudou?"))
    registradas = dados.registradas(var)
    ultimo = registradas[0][0]  # numeração contínua
    novas = [a for a in achadas.values() if a["edicao"] > ultimo]
    if novas:
        dados.inserir(var, novas, com_link=True)
    return novas


def cnmp(dados):
    var = "CNMP_DATA"
    url = ("https://www.cnmp.mp.br/portal/institucional/comissoes/"
           "comissao-de-acompanhamento-legislativo-e-jurisprudencia/"
           "jurisprudenciacalj/boletim-da-sessao")
    t = pagina(url)
    achadas = []
    for m in re.finditer(r'<a[^>]+href="([^"]+\.pdf)"[^>]*>(.*?)</a>', t, re.S | re.I):
        texto = re.sub(r"<[^>]+>|\s+", " ", html.unescape(m.group(2))).strip()
        if not texto.lower().startswith("boletim de sess"):
            continue
        e = re.search(r"Edi\S*\s*n\S*\s*(\d+)\s*/\s*(\d{4})", texto)
        d = re.search(r"(\d{2})/(\d{2})/(\d{4})", texto)
        if not (e and d) or re.search(r"cancelad", texto, re.I):
            continue
        achadas.append({"edicao": int(e.group(1)), "data": iso(d.group(3), d.group(2), d.group(1)),
                        "link": urllib.parse.urljoin(url, html.unescape(m.group(1)))})
    if not achadas:
        raise Falha("não achei nenhum Boletim de Sessão na página do CNMP — a página mudou?")
    novas = filtrar_novas(achadas, dados.registradas(var))
    if novas:
        dados.inserir(var, novas, com_link=True)
    return novas


TRIBUNAIS = [("STF", stf), ("STJ", stj), ("TSE", tse), ("CNJ", cnj), ("TST", tst), ("CNMP", cnmp)]


def main(so=None):
    dados = Dados(ARQUIVO)
    resumo, falhas = [], []
    for nome, funcao in TRIBUNAIS:
        if so and nome not in so:
            continue
        print(f"\n=== {nome}")
        try:
            novas = funcao(dados)
        except Falha as e:
            print(f"  ERRO: {e}")
            falhas.append(nome)
            resumo.append(f"  {nome}: ERRO — {e}")
            continue
        except Exception as e:  # noqa: BLE001 — um tribunal não derruba os outros
            print(f"  ERRO inesperado: {e!r}")
            falhas.append(nome)
            resumo.append(f"  {nome}: ERRO inesperado — {e!r}")
            continue
        if novas:
            lista = ", ".join(f"nº {n['edicao']} ({n['data']})"
                              for n in sorted(novas, key=lambda n: n["data"]))
            resumo.append(f"  {nome}: {len(novas)} nova(s) — {lista}")
        else:
            resumo.append(f"  {nome}: nada novo")
    dados.gravar()
    print("\n=== Resumo")
    print("\n".join(resumo))
    if dados.mudou:
        print("\nEdições novas gravadas em diario-data.js (súmula: a confirmar).")
    if falhas:
        print(f"\nATENÇÃO: {', '.join(falhas)} falhou(aram) — essa parte ficou como estava.")
        return 1
    return 0


if __name__ == "__main__":
    # Opcional: só alguns tribunais, ex.: python3 scripts/atualizar_informativos.py STJ TSE
    sys.exit(main({a.upper() for a in sys.argv[1:]} or None))
