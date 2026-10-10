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
  STJ   feed oficial (InformativoFeed: número e data de todas as edições);
        se o feed falhar, número seguinte pela página da edição (título
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
from html.parser import HTMLParser
import json
import os
import re
import signal
import socket
import ssl
import shutil
import subprocess
import sys
import tempfile
import time
import unicodedata
import urllib.error
import http.client
import urllib.parse
import urllib.request
import zlib
from datetime import datetime, timedelta, timezone
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
ARQUIVO = RAIZ / "site/decisoes/diario-data.js"
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
    # (o parâmetro timeout só existe no Python 3.10+; o do Mac costuma ser mais antigo)
    _antes = socket.getdefaulttimeout()
    socket.setdefaulttimeout(30)
    try:
        cert = ssl.get_server_certificate((host, 443))
    except OSError as e:
        raise Falha(f"não consegui ler o certificado de {host}: {e}")
    finally:
        socket.setdefaulttimeout(_antes)
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


def _url_segura(url):
    """Escapa espaços e outros caracteres que o urllib recusa (ex.: "/html/MSV 909-2009 VOL A.pdf"),
    sem mexer no que já está escapado."""
    return urllib.parse.quote(url, safe="%/:?&=#+;,@!$'()*~[]-._")


def buscar(url):
    """Devolve (status, content-type, corpo em bytes). Erro de rede → Falha."""
    url = _url_segura(url)
    host = urllib.parse.urlsplit(url).hostname
    if host not in _contextos:
        _contextos[host] = _contexto_padrao()
    req = urllib.request.Request(url, headers={
        "User-Agent": UA,
        "Accept": "text/html,application/pdf,*/*;q=0.8",
        "Accept-Language": "pt-BR,pt;q=0.9",
    })
    completou = False
    saltos = 0
    # Internet lenta ou instável: espera mais pela resposta (120 s) e, se cair, tenta de novo
    # com pausas crescentes (4 s, 10 s, 20 s) em vez de desistir de cara.
    for tentativa in (1, 2, 3, 4):
        if tentativa > 1:
            time.sleep((4, 10, 20)[tentativa - 2])
        try:
            with urllib.request.urlopen(req, context=_contextos[host], timeout=120) as r:
                return r.status, r.headers.get("Content-Type", ""), r.read()
        except urllib.error.HTTPError as e:
            # redirecionamento (o urllib de Python mais antigo não segue o 308)
            destino = e.headers.get("Location") if e.code in (301, 302, 303, 307, 308) else None
            if destino and saltos < 5:
                saltos += 1
                url = _url_segura(urllib.parse.urljoin(url, destino))
                host = urllib.parse.urlsplit(url).hostname
                if host not in _contextos:
                    _contextos[host] = _contexto_padrao()
                req = urllib.request.Request(url, headers=req.headers)
                continue
            if e.code >= 500 and tentativa < 4:
                continue
            return e.code, e.headers.get("Content-Type", ""), b""
        except urllib.error.URLError as e:
            if isinstance(e.reason, ssl.SSLCertVerificationError) and not completou:
                _contextos[host] = _contexto_com_intermediario(host)
                completou = True
                continue
            if tentativa == 4:
                raise Falha(f"{url} → sem resposta ({e.reason})")
        except (socket.timeout, TimeoutError, ConnectionError, http.client.HTTPException) as e:
            if tentativa == 4:
                raise Falha(f"{url} → sem resposta ({type(e).__name__})")
        except (http.client.InvalidURL, ValueError) as e:
            raise Falha(f"{url} → endereço inválido ({e})")
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


_host_recusado = {}  # host → motivo; não insiste depois da 1ª recusa do Chrome
ESPERA_CHROME = 60  # segundos por página


def pagina_navegador(url):
    host = urllib.parse.urlsplit(url).hostname
    if host in _host_recusado:
        raise Falha(_host_recusado[host])
    caminho, ua = _achar_chrome()
    if not caminho:
        raise Falha("o site recusou o acesso direto e não achei o Google Chrome "
                    "neste Mac para abrir a página")
    # O Chrome abre processos auxiliares; se ele passar do tempo, é preciso
    # fechar o grupo inteiro (senão o robô fica esperando para sempre — foi
    # o que travou no TSE em 29/09/2026). A saída vai para um arquivo, não
    # para um "pipe", pelo mesmo motivo.
    with tempfile.TemporaryDirectory() as pasta:
        saida = Path(pasta) / "pagina.html"
        with open(saida, "wb") as f:
            proc = subprocess.Popen(
                [caminho, "--headless=new", "--disable-gpu", "--no-first-run",
                 "--no-default-browser-check", "--disable-extensions",
                 f"--user-data-dir={Path(pasta) / 'perfil'}", f"--user-agent={ua}",
                 "--lang=pt-BR", "--virtual-time-budget=15000",
                 # rastreadores e plugins que só atrasam (e às vezes nunca
                 # terminam de carregar): o Chrome nem tenta abri-los
                 "--host-resolver-rules=" + ", ".join(
                     f"MAP {h} 0.0.0.0" for h in (
                         "*.googletagmanager.com", "*.google-analytics.com",
                         "vlibras.gov.br", "*.vlibras.gov.br",
                         "static.cloudflareinsights.com", "www.google.com",
                         "www.gstatic.com")),
                 f"--timeout={(ESPERA_CHROME - 15) * 1000}", "--dump-dom", url],
                stdout=f, stderr=subprocess.DEVNULL, stdin=subprocess.DEVNULL,
                start_new_session=True)
            try:
                proc.wait(timeout=ESPERA_CHROME)
                estourou = False
            except subprocess.TimeoutExpired:
                estourou = True
            finally:
                try:
                    os.killpg(proc.pid, signal.SIGKILL)
                except (ProcessLookupError, PermissionError):
                    pass
                try:
                    proc.wait(timeout=10)
                except subprocess.TimeoutExpired:
                    pass
        texto = saida.read_bytes().decode("utf-8", "replace")
    print(f"  {url} → pelo Chrome ({len(texto)} caracteres"
          + (", passou do tempo" if estourou else "") + ")")
    if len(texto) < 500 or re.search(r"Access Denied|Request Rejected|acesso negado", texto[:3000], re.I):
        motivo = (f"{host} recusou o acesso até pelo Chrome"
                  + (f" (a página não terminou de abrir em {ESPERA_CHROME} s)" if estourou else ""))
        _host_recusado[host] = motivo
        raise Falha(motivo)
    return texto


# Último recurso: o Google Chrome de verdade da pessoa (com janela), comandado
# por AppleScript. Alguns endereços (scon.stj.jus.br, em 09/2026) barram até o
# Chrome invisível, mas abrem normalmente no Chrome de todo dia. O robô abre
# uma janela, carrega a página, copia o conteúdo e, no fim, fecha a janela.
# Precisa, uma vez só: no Chrome, menu Visualizar > Opções do desenvolvedor >
# "Permitir JavaScript de eventos da Apple"; e, na primeira vez, deixar o
# Terminal controlar o Chrome (o macOS pergunta).
_APPLESCRIPT = r"""
on run argv
  set modo to item 1 of argv
  set u to item 2 of argv
  set wid to item 3 of argv
  tell application "Google Chrome"
    set w to missing value
    if wid is not "" then
      try
        set w to window id (wid as integer)
      end try
    end if
    if w is missing value then set w to make new window
    if modo is "abrir" then
      set URL of active tab of w to u
      delay 1
      set t0 to current date
      repeat while (loading of active tab of w) and ((current date) - t0 < 60)
        delay 0.5
      end repeat
      delay 1
    end if
    if modo is "fechar" then
      close w
      return ""
    end if
    set h to execute active tab of w javascript "document.documentElement.outerHTML"
    return (id of w as text) & linefeed & h
  end tell
end run
"""
_janela_chrome = {"id": ""}


def _osascript(modo, url=""):
    r = subprocess.run(["osascript", "-", modo, url, _janela_chrome["id"]],
                       input=_APPLESCRIPT, capture_output=True, text=True, timeout=120)
    if r.returncode != 0:
        erro = (r.stderr or r.stdout).strip()
        dica = ""
        if "JavaScript" in erro or "Apple" in erro:
            dica = (" — no Chrome, ative: Visualizar > Opções do desenvolvedor > "
                    "Permitir JavaScript de eventos da Apple (vale por perfil do Chrome: "
                    "ative na janela do perfil que o robô abre) e rode de novo")
        elif "-1743" in erro or "autoriz" in erro.lower() or "not allowed" in erro.lower():
            dica = (" — permita que o Terminal controle o Chrome em Ajustes do Sistema > "
                    "Privacidade e Segurança > Automação")
        raise Falha(f"não consegui usar o Chrome desta Mac ({erro[:200]}){dica}")
    if modo == "fechar":
        return ""
    wid, _, htmltxt = r.stdout.partition("\n")
    _janela_chrome["id"] = wid.strip()
    return htmltxt


def _fechar_janela_chrome():
    if _janela_chrome["id"]:
        try:
            _osascript("fechar")
        except Exception:
            pass


import atexit  # noqa: E402
atexit.register(_fechar_janela_chrome)


def pagina_chrome_real(url, valida=None, sem_firefox=False):
    if not sem_firefox and _achar_firefox() and not _ff["indisponivel"]:
        return pagina_firefox(url, valida)   # sem janela; o Chrome só se o Firefox falhar
    if sys.platform != "darwin":
        raise Falha(f"{url} → o site só abre no Chrome do Mac")
    texto = _osascript("abrir", url)
    # Páginas com verificação anti-robô ("Just a moment...") trocam sozinhas
    # depois de alguns segundos: espera até o conteúdo certo aparecer.
    for _ in range(12):
        if not valida or valida(texto):
            break
        time.sleep(2)
        texto = _osascript("ler")
    print(f"  {url} → pelo seu Chrome ({len(texto)} caracteres)")
    return texto


_via_chrome_real = set()


# Firefox invisível (preferido): o robô comanda um Firefox sem janela pelo
# protocolo Marionette (já vem no Firefox; não precisa instalar nada). Ao
# contrário do Chrome "de verdade", não abre janela nem tira o foco do que a
# pessoa está fazendo (ex.: uma aula aberta no navegador). Um único Firefox
# serve a rodada inteira e é fechado no fim.
FIREFOXES = [
    "/Applications/Firefox.app/Contents/MacOS/firefox",
    "/Applications/Firefox Developer Edition.app/Contents/MacOS/firefox",
]
_ff = {"proc": None, "sock": None, "pasta": None, "id": 0, "indisponivel": None}


def _achar_firefox():
    return next((c for c in FIREFOXES if Path(c).exists()), None) or shutil.which("firefox")


def _mn_enviar(nome, params=None):
    s = _ff["sock"]
    _ff["id"] += 1
    corpo = json.dumps([0, _ff["id"], nome, params or {}]).encode()
    s.sendall(str(len(corpo)).encode() + b":" + corpo)
    while True:
        msg = _mn_ler(s)
        if isinstance(msg, list) and len(msg) == 4 and msg[0] == 1 and msg[1] == _ff["id"]:
            if msg[2]:
                raise Falha(f"Firefox: {msg[2].get('message') or msg[2]}")
            return msg[3]


def _mn_ler(s):
    n = b""
    while not n.endswith(b":"):
        c = s.recv(1)
        if not c:
            raise Falha("o Firefox fechou a conexão")
        n += c
    total, buf = int(n[:-1]), b""
    while len(buf) < total:
        c = s.recv(total - len(buf))
        if not c:
            raise Falha("o Firefox fechou a conexão")
        buf += c
    return json.loads(buf.decode("utf-8", "replace"))


def _firefox_fechar():
    p = _ff["proc"]
    if p:
        try:
            os.killpg(p.pid, signal.SIGKILL)
        except (ProcessLookupError, PermissionError):
            pass
    if _ff["sock"]:
        try:
            _ff["sock"].close()
        except OSError:
            pass
    if _ff["pasta"]:
        shutil.rmtree(_ff["pasta"], ignore_errors=True)
    _ff.update(proc=None, sock=None, pasta=None)


def _ff_log_final():
    try:
        linhas = [l for l in Path(_ff["log"]).read_text(errors="replace").splitlines() if l.strip()]
        return " | ".join(linhas[-3:])[:300]
    except Exception:
        return ""


def _firefox_iniciar():
    caminho = _achar_firefox()
    if not caminho:
        raise Falha("não achei o Firefox neste Mac (instale em firefox.com: ele abre as páginas "
                    "sem janela e sem tirar o foco da sua tela)")
    with socket.socket() as t:
        t.bind(("127.0.0.1", 0))
        porta = t.getsockname()[1]
    pasta = tempfile.mkdtemp(prefix="robo-firefox-")
    prefs = {"marionette.port": porta, "browser.shell.checkDefaultBrowser": False,
             "datareporting.policy.dataSubmissionEnabled": False,
             "app.update.auto": False, "app.update.enabled": False,
             "browser.startup.homepage_override.mstone": "ignore",
             "general.useragent.locale": "pt-BR", "intl.accept_languages": "pt-BR,pt",
             "dom.disable_open_during_load": True, "media.autoplay.default": 5,
             "browser.tabs.warnOnClose": False}
    with open(Path(pasta) / "user.js", "w") as f:
        for k, v in prefs.items():
            f.write(f"user_pref({json.dumps(k)}, {json.dumps(v)});\n")
    _ff["pasta"] = pasta
    _ff["log"] = Path(pasta) / "firefox.log"
    _ff["proc"] = subprocess.Popen(
        [caminho, "--headless", "--marionette", "--no-remote", "--profile", pasta],
        stdout=open(_ff["log"], "wb"), stderr=subprocess.STDOUT, stdin=subprocess.DEVNULL,
        start_new_session=True)
    fim = time.time() + 45
    sock = None
    while time.time() < fim:
        try:
            sock = socket.create_connection(("127.0.0.1", porta), timeout=5)
            break
        except OSError:
            if _ff["proc"].poll() is not None:
                break
            time.sleep(0.5)
    if not sock:
        fim_log = _ff_log_final()
        _firefox_fechar()
        raise Falha("o Firefox não respondeu ao robô" + (f" ({fim_log})" if fim_log else ""))
    sock.settimeout(ESPERA_CHROME + 30)
    _ff["sock"] = sock
    try:
        _mn_ler(sock)  # saudação {"applicationType":"gecko",...}
        _mn_enviar("WebDriver:NewSession", {"capabilities": {"acceptInsecureCerts": True}})
        _mn_enviar("WebDriver:SetTimeouts", {"pageLoad": ESPERA_CHROME * 1000, "script": 60000})
    except Exception as e:
        fim_log = _ff_log_final()
        _firefox_fechar()
        raise Falha(f"conversa com o Firefox falhou: {e}" + (f" ({fim_log})" if fim_log else ""))


import atexit  # noqa: E402
atexit.register(_firefox_fechar)


_JS_BAIXAR = """
const url = arguments[0], feito = arguments[arguments.length - 1];
fetch(url, {credentials: 'include'}).then(r => r.arrayBuffer().then(b => {
  const u = new Uint8Array(b); let s = '';
  for (let i = 0; i < u.length; i += 32768) s += String.fromCharCode.apply(null, u.subarray(i, i + 32768));
  feito({status: r.status, b64: btoa(s)});
})).catch(e => feito({status: 0, erro: String(e)}));
"""


def baixar_via_firefox(url, pagina_da_origem, valida=None):
    """Bytes de um arquivo (PDF) que o site só entrega a um navegador de verdade:
    abre uma página do mesmo site (passa a verificação anti-robô) e baixa de dentro dela."""
    import base64
    pagina_firefox(pagina_da_origem, valida)
    for _ in range(6):
        r = _mn_enviar("WebDriver:ExecuteAsyncScript", {"script": _JS_BAIXAR, "args": [url]})
        v = r.get("value") if isinstance(r, dict) else None
        if v and v.get("status") == 200 and v.get("b64"):
            return base64.b64decode(v["b64"])
        if v and v.get("status") not in (0, 403, 503):
            return None
        time.sleep(3)
    return None


def pagina_firefox(url, valida=None, estrito=False):
    """HTML da página já montada (com JavaScript), lido por um Firefox sem janela."""
    if _ff["indisponivel"]:
        raise Falha(_ff["indisponivel"])
    if not _ff["sock"]:
        try:
            _firefox_iniciar()
        except Falha as e:
            _ff["indisponivel"] = str(e)
            raise
    try:
        try:
            _mn_enviar("WebDriver:Navigate", {"url": url})
        except Falha as e:   # "tempo esgotado" ainda deixa ler o que já carregou
            print(f"  (Firefox: {str(e)[:100]})")
        texto = ""
        for _ in range(12):
            r = _mn_enviar("WebDriver:GetPageSource")
            texto = r.get("value", "") if isinstance(r, dict) else str(r or "")
            if not valida or valida(texto):
                break
            time.sleep(2)   # páginas "Just a moment..." trocam sozinhas
        else:
            if valida and estrito:
                raise Falha(f"{url} → o Firefox recebeu outra página (\"{_titulo(texto)}\"), "
                            "provavelmente a verificação anti-robô do site")
    except (Falha, OSError, ValueError) as e:
        _firefox_fechar()   # recomeça limpo na próxima página
        raise Falha(f"{url} → falhou pelo Firefox ({e})")
    print(f"  {url} → pelo Firefox ({len(texto)} caracteres)")
    return texto



def _titulo(texto):
    m = re.search(r"<title[^>]*>(.*?)</title>", texto, re.S | re.I)
    return re.sub(r"\s+", " ", html.unescape(m.group(1))).strip()[:80] if m else "?"


def pagina(url, valida=None):
    """Texto de uma página; qualquer coisa diferente de 200 → Falha.
    Se o site responder 403, tenta pelo Chrome invisível; se esse também for
    barrado (ou trouxer uma página que não é a esperada — "valida" diz o que
    esperar), tenta pelo Chrome de verdade do Mac."""
    host = urllib.parse.urlsplit(url).hostname
    if _achar_firefox() and not _ff["indisponivel"]:
        # Firefox sem janela: não tira a tela da pessoa (o Chrome faria isso)
        if host not in _via_navegador:
            status, tipo, corpo = buscar(url)
            print(f"  {url} → HTTP {status}")
            if status == 200:
                return texto_de(corpo, tipo)
            if status != 403:
                raise Falha(f"{url} → HTTP {status} (o site recusou ou a página mudou)")
            _via_navegador.add(host)
        try:
            return pagina_firefox(url, valida, estrito=True)
        except Falha as e:
            if not _ff["indisponivel"] and "anti-robô" not in str(e):
                raise
            print(f"  (Firefox: {_ff['indisponivel'] or e}; tentando o Chrome)")
            _via_chrome_real.add(host)
            return pagina_chrome_real(url, valida, sem_firefox=True)
    if host in _via_chrome_real:
        return pagina_chrome_real(url, valida)
    if host not in _via_navegador:
        status, tipo, corpo = buscar(url)
        print(f"  {url} → HTTP {status}")
        if status == 200:
            return texto_de(corpo, tipo)
        if status != 403:
            raise Falha(f"{url} → HTTP {status} (o site recusou ou a página mudou)")
        _via_navegador.add(host)
    try:
        texto = pagina_navegador(url)
        if not valida or valida(texto):
            return texto
        print(f"  (o Chrome invisível recebeu outra página: \"{_titulo(texto)}\")")
    except Falha as e:
        if "recusou" not in str(e):
            raise
    _via_chrome_real.add(host)
    return pagina_chrome_real(url, valida)


def texto_de(corpo, tipo):
    # Algumas páginas do Planalto (ex.: Lei Maria da Penha, feita no FrontPage)
    # vêm em UTF-16, com a marca "BOM" no começo.
    if corpo[:2] in (b"\xff\xfe", b"\xfe\xff"):
        return corpo.decode("utf-16", "replace")
    if corpo[:3] == b"\xef\xbb\xbf":
        return corpo[3:].decode("utf-8", "replace")
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
        m = re.search(rf"var\s+{var}\s*=\s*\[(.*?)\];", self.texto, re.S)
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
        novas = sorted(novas, key=lambda n: (str(n.get("ano") or n["data"][:4]), n["data"] or "", n["edicao"]), reverse=True)
        linhas = ""
        for n in novas:
            extra = f', tema: "{n["tema"]}"' if n.get("tema") else ""
            extra += f', link: "{n["link"]}"' if com_link else ""
            ano = n.get("ano") or n["data"][:4]
            data = f'"{n["data"]}"' if n["data"] else "null"
            linhas += (f'    {{ edicao: {n["edicao"]}, ano: {ano}, '
                       f'data: {data}, sumula: null{extra} }},\n')
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


STJ_FEED = "https://processo.stj.jus.br/jurisprudencia/externo/InformativoFeed"


def stj_pelo_feed(ultimo):
    """Edições regulares do feed do STJ (as extraordinárias, "INFJ0033E",
    ficam de fora, como no Diário). None se o feed não abrir ou não trouxer
    nada reconhecível — aí o robô confere página por página."""
    try:
        t = pagina(STJ_FEED, valida=lambda x: "INFJ0" in x)
    except Falha as e:
        print(f"  (feed indisponível: {e}; conferindo página por página)")
        return None
    # Serve tanto para o XML cru quanto para o que o Chrome devolve.
    t = html.unescape(re.sub(r"<[^>]+>", " ", t))
    achadas = {}
    for m in re.finditer(r"INFJ(\d{4})(E?)\b.*?(\d{4})-(\d{2})-(\d{2})T", t, re.S):
        if not m.group(2):
            n = int(m.group(1))
            achadas.setdefault(n, iso(m.group(3), m.group(4), m.group(5)))
    if ultimo not in achadas:
        print(f"  (o feed não trouxe o nº {ultimo}; conferindo página por página)")
        return None
    return [{"edicao": n, "data": d,
             "link": f"https://scon.stj.jus.br/SCON/GetPDFINFJ?edicao={n:04d}"}
            for n, d in sorted(achadas.items()) if n > ultimo]


def stj(dados):
    var = "STJ_DATA"
    ultimo = dados.registradas(var)[0][0]
    novas = stj_pelo_feed(ultimo)
    if novas is not None:
        print(f"  feed lido; último registrado: nº {ultimo}")
        if novas:
            dados.inserir(var, novas, com_link=True)
        return novas

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
            t = pagina(url, valida=lambda x: "informativo-tse-no" in x)
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
                    + (f" ({'; '.join(dict.fromkeys(erros))})" if erros else " — a página mudou?"))
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
                    + (f" ({'; '.join(dict.fromkeys(erros))})" if erros else " — a página mudou?"))
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


# ================================================================ Teses do STJ
#
# Jurisprudência em Teses do STJ → stj/teses.json (Diário das Decisões).
# Cada TESE vira um card, com o texto completo. De onde vem cada coisa:
#   - lista de edições: feed JurisprudenciaEmTesesFeed (número, tema, data);
#   - teses de uma edição: página doc.jsp?livre='285' INPATH(TIT). Cada tese
#     fica num <div class="clsTemasJT redacaoAtual">, com o texto em
#     <div class="clsSubmitPesquisaTema"><a>1) ...</a>, a legislação citada
#     (quando há) num <i> logo depois, e os julgados em "clsJulgadosJT";
#     o ramo do Direito vem em <div class="clsMateriaJT">.
# O arquivo guarda tudo; a cada execução o robô lê as edições novas e, para
# completar o histórico aos poucos, até TESES_POR_VEZ edições antigas ainda
# não lidas (com "--tudo", lê todas de uma vez — demora).

TESES_ARQ = RAIZ / "stj" / "teses.json"
TESES_FEED = "https://scon.stj.jus.br/SCON/JurisprudenciaEmTesesFeed"
TESES_DOC = "https://scon.stj.jus.br/SCON/jt/doc.jsp?livre=%27{n}%27%20INPATH(TIT)"
TESES_POR_VEZ = 30
_MINUSCULAS = {"a", "à", "ao", "aos", "as", "às", "com", "da", "das", "de", "do",
               "dos", "e", "em", "na", "nas", "no", "nos", "o", "os", "ou", "para",
               "pela", "pelo", "por", "sem", "sob", "sobre"}
_SIGLAS = {"ICMS", "IPI", "ISS", "PIS", "COFINS", "DPVAT", "TEA", "OAB", "FGTS",
           "SFH", "ECA", "CPC", "CDC", "CTN", "CLT", "PAD", "IR", "N."}


def texto_limpo(fragmento):
    # Marcação dentro da frase (itálico, negrito...) some sem deixar espaço:
    # "(<i>in re ipsa</i>)" → "(in re ipsa)".
    t = re.sub(r"</?(?:i|b|em|strong|u|span|sup|sub|a)\b[^>]*>", "", fragmento, flags=re.I)
    t = re.sub(r"<[^>]+>", " ", t)
    return re.sub(r"\s+", " ", html.unescape(t)).strip()


def titulo_bonito(t):
    """'DIREITO À EDUCAÇÃO III' → 'Direito à Educação III'."""
    saida = []
    for i, p in enumerate(t.split()):
        base = p.strip("().,:-")
        if p.upper() in ("N.", "Nº"):
            saida.append(p.lower())
        elif re.fullmatch(r"(?=[IVXLC])(X[CL]|L?X{0,3})(I[XV]|V?I{0,3})", base) or base.upper() in _SIGLAS or re.search(r"\d", p):
            saida.append(p)
        elif i and p.lower() in _MINUSCULAS:
            saida.append(p.lower())
        else:  # primeira letra maiúscula, mesmo depois de "(": "(LEI" → "(Lei"
            saida.append(re.sub(r"[^\W\d_]", lambda m: m.group().upper(), p.lower(), count=1))
    return " ".join(saida)


def teses_do_feed():
    """[(edicao, tema, 'aaaa-mm-dd')], da mais nova para a mais antiga."""
    t = pagina(TESES_FEED, valida=lambda x: "JT=" in x)
    # Serve para o XML cru e para o que o Chrome devolve (XML "escapado").
    t = texto_limpo(texto_limpo(t))
    achadas = {}
    for m in re.finditer(r"JT=(\d+)\.\S+ \S+ \d+ [\d:]+ \S+ \d{4} EDI\S* N\.\s*\d+\s*:\s*(.+?)\s+"
                         r"(\d{4})-(\d{2})-(\d{2})T", t):
        achadas.setdefault(int(m.group(1)),
                           (titulo_bonito(m.group(2)), iso(m.group(3), m.group(4), m.group(5))))
    if not achadas:
        raise Falha("não achei nenhuma edição no feed da Jurisprudência em Teses — o feed mudou?")
    return [(n, *achadas[n]) for n in sorted(achadas, reverse=True)]


def _area(materia):
    m = titulo_bonito(materia or "").replace("Tributario", "Tributário") \
        .replace("Previdenciario", "Previdenciário").replace("Crianca", "Criança")
    if m == "Direito Penal e Processual Penal":
        return "Direito Penal"
    return m or "Outros ramos"


def _risco(data_iso, tese):
    idade = (datetime.now(timezone.utc).date()
             - datetime.strptime(data_iso, "%Y-%m-%d").date()).days
    qualificada = re.search(r"\bTema n\.|\bSúmula n\.|rito do art\. (543-C|1\.036)", tese)
    if idade <= 365:
        return "Alta", "edição publicada há menos de um ano (tese recente)"
    if idade <= 3 * 365 or qualificada:
        return "Média", ("tese ligada a repetitivo/súmula" if qualificada and idade > 3 * 365
                         else "edição publicada nos últimos três anos")
    return "Baixa", "edição publicada há mais de três anos"


def teses_da_edicao(n, tema, data_feed):
    url = TESES_DOC.format(n=n)
    t = pagina(url, valida=lambda x: "clsTemasJT" in x or "clsSubmitPesquisaTema" in x)
    materia = re.search(r'class="clsMateriaJT">(.*?)</div>', t, re.S)
    area = _area(texto_limpo(materia.group(1)) if materia else "")
    d = re.search(r"disponibilizada em:\s*<b[^>]*>(\d{2})/(\d{2})/(\d{4})", t)
    data_iso = iso(d.group(3), d.group(2), d.group(1)) if d else data_feed
    data_br = f"{data_iso[8:10]}/{data_iso[5:7]}/{data_iso[:4]}"
    blocos = re.split(r'<div class="clsTemasJT redacaoAtual"', t)[1:]
    itens = []
    for bloco in blocos:
        tese_m = re.search(r'class="clsSubmitPesquisaTema">\s*<a[^>]*>(.*?)</a>', bloco, re.S)
        if not tese_m:
            continue
        tese = texto_limpo(tese_m.group(1))
        num = re.match(r"(\d+)\)\s*", tese)
        if not num:
            continue
        tese = tese[num.end():]
        k = int(num.group(1))
        antes = bloco.split('class="clsBotoesJT', 1)[0]
        nota = re.search(r"</form>\s*</div>\s*(?:<div>\s*<i>(.*?)</i>\s*</div>)", antes, re.S)
        julg = re.search(r'class="link">([^<]+)</a>,\s*Rel\. Min\. ([^,]+),', bloco)
        risco, motivo = _risco(data_iso, tese)
        item = {
            "id": f"stj-jt-{n}-{k}", "tema": f"{n} · tese {k}", "area": area,
            "orgao": "STJ", "tipo": "teses", "precedenteLabel": "Edição",
            "tipoNome": "Jurisprudência em Teses", "titulo": tema, "tese": tese,
            "processo": texto_limpo(julg.group(1)) if julg else "",
            "relator": titulo_bonito(texto_limpo(julg.group(2))) if julg else "",
            "data": data_br, "status": "vigente", "risco": risco,
            "motivo": f"Jurisprudência em Teses do STJ, edição n. {n}: {motivo}.",
            "link": f"{url}#TEMA{k}",
        }
        if nota and texto_limpo(nota.group(1)):
            item["historico"] = texto_limpo(nota.group(1))
        itens.append(item)
    if not itens:
        raise Falha(f"a página da edição n. {n} não trouxe nenhuma tese — a página mudou?")
    print(f"  edição n. {n} ({tema}): {len(itens)} tese(s)")
    return itens


def teses(dados, tudo=False):
    import json
    atual = {"itens": [], "edicoes": []}
    if TESES_ARQ.exists():
        atual = json.loads(TESES_ARQ.read_text(encoding="utf-8"))
    feitas = set(atual.get("edicoes", []))
    edicoes = teses_do_feed()
    novas = [e for e in edicoes if feitas and e[0] > max(feitas)]
    antigas = [e for e in edicoes if e[0] not in feitas and e not in novas]
    fila = novas + (antigas if tudo else antigas[:TESES_POR_VEZ])
    print(f"  {len(edicoes)} edições no feed; {len(feitas)} já no Diário; "
          f"lendo agora {len(fila)} ({len(novas)} nova(s))")
    itens, lidas, erros = list(atual.get("itens", [])), [], []
    for n, tema, data in fila:
        try:
            itens += teses_da_edicao(n, tema, data)
            lidas.append(n)
        except Falha as e:
            erros.append(str(e))
            if "recusou" in str(e):
                break  # site bloqueou: não adianta insistir nas outras
    if lidas:
        itens.sort(key=lambda i: (-int(i["id"].split("-")[2]), int(i["id"].split("-")[3])))
        TESES_ARQ.parent.mkdir(exist_ok=True)
        TESES_ARQ.write_text(json.dumps({
            "fonte": "STJ — Jurisprudência em Teses (scon.stj.jus.br/SCON/jt)",
            "total": len(itens), "edicoes": sorted(feitas | set(lidas), reverse=True),
            "itens": itens}, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
        dados.teses_mudou = True
    faltam = len(edicoes) - len(feitas) - len(lidas)
    if faltam > 0:
        print(f"  (faltam {faltam} edições antigas; entram nas próximas execuções)")
    if erros and not lidas:
        raise Falha("; ".join(dict.fromkeys(erros)))
    for e in dict.fromkeys(erros):
        print(f"  ATENÇÃO: {e}")
    return [{"edicao": n, "data": next(d for m, _, d in edicoes if m == n)} for n in lidas]


# ================================================================ Leis alteradas
#
# Para as leis mais cobradas, confere no texto compilado do Planalto quais
# normas já alteraram cada uma — as notas "(Redação dada pela Lei nº 14.994,
# de 2024)", "(Incluído pela ...)", "(Revogado pela ...)". Quando aparece uma
# alteradora que ainda não estava registrada, grava a mudança com a data em
# que o robô a percebeu, em leis/alteracoes.json. A página "Meu Progresso"
# compara essa data com a data em que a pessoa marcou a lei como lida no
# Diário de Leis e, se a lei mudou depois, mostra um aviso.
# Na primeira vez, o robô só anota o que já existe (sem avisos).
#
# "numero" tem de ser IGUAL ao de leis-data.js (é por ele que a página liga a
# lei lida à lei monitorada). Para monitorar outra lei, acrescente uma linha.

LEIS_ARQ = RAIZ / "leis" / "alteracoes.json"
_P = "https://www.planalto.gov.br/ccivil_03/"
LEIS_MONITORADAS = [
    ("CF/1988", "Constituição Federal", _P + "constituicao/constituicao.htm"),
    ("Decreto-Lei nº 2.848/1940", "Código Penal", _P + "decreto-lei/del2848compilado.htm"),
    ("Decreto-Lei nº 3.689/1941", "Código de Processo Penal", _P + "decreto-lei/del3689compilado.htm"),
    ("Lei nº 10.406/2002", "Código Civil", _P + "leis/2002/l10406compilada.htm"),
    ("Lei nº 13.105/2015", "Código de Processo Civil", _P + "_ato2015-2018/2015/lei/l13105.htm"),
    ("Decreto-Lei nº 5.452/1943", "CLT", _P + "decreto-lei/del5452.htm"),
    ("Lei nº 5.172/1966", "Código Tributário Nacional", _P + "leis/l5172compilado.htm"),
    ("Lei nº 8.078/1990", "Código de Defesa do Consumidor", _P + "leis/l8078compilado.htm"),
    ("Lei nº 8.069/1990", "Estatuto da Criança e do Adolescente", _P + "leis/l8069.htm"),
    ("Lei nº 7.210/1984", "Lei de Execução Penal", _P + "leis/l7210.htm"),
    ("Lei nº 8.112/1990", "Estatuto dos Servidores Públicos Federais", _P + "leis/l8112cons.htm"),
    ("Lei nº 8.429/1992", "Lei de Improbidade Administrativa", _P + "leis/l8429.htm"),
    ("Lei nº 14.133/2021", "Nova Lei de Licitações", _P + "_ato2019-2022/2021/lei/l14133.htm"),
    ("Lei nº 9.784/1999", "Lei do Processo Administrativo Federal", _P + "leis/l9784.htm"),
    ("Decreto-Lei nº 4.657/1942", "LINDB", _P + "decreto-lei/del4657compilado.htm"),
    ("Lei nº 11.343/2006", "Lei de Drogas", _P + "_ato2004-2006/2006/lei/l11343.htm"),
    ("Lei nº 11.340/2006", "Lei Maria da Penha", _P + "_ato2004-2006/2006/lei/l11340.htm"),
    ("Lei nº 8.072/1990", "Lei dos Crimes Hediondos", _P + "leis/l8072.htm"),
    ("Lei Complementar nº 101/2000", "Lei de Responsabilidade Fiscal", _P + "leis/lcp/lcp101.htm"),
    ("Lei nº 9.099/1995", "Lei dos Juizados Especiais", _P + "leis/l9099.htm"),
    ("Lei nº 7.347/1985", "Lei da Ação Civil Pública", _P + "leis/l7347compilada.htm"),
    ("Lei nº 12.016/2009", "Lei do Mandado de Segurança", _P + "_ato2007-2010/2009/lei/l12016.htm"),
    ("Lei nº 13.709/2018", "LGPD", _P + "_ato2015-2018/2018/lei/l13709.htm"),
    ("Lei nº 8.213/1991", "Lei de Benefícios da Previdência Social", _P + "leis/l8213cons.htm"),
    ("Lei nº 6.830/1980", "Lei de Execução Fiscal", _P + "leis/l6830.htm"),
    ("Lei nº 12.850/2013", "Lei das Organizações Criminosas", _P + "_ato2011-2014/2013/lei/l12850.htm"),
]
_TIPOS = [("Emenda Constitucional de Revisão", "ECR"), ("Emenda Constitucional", "EC"),
          ("Lei Complementar", "LC"), ("Medida Provisória", "MP"), ("Decreto-Lei", "DL"), ("Lei", "Lei")]
_RE_ALTERADORA = re.compile(
    r"(?:Reda[çc][ãa]o\s+dada|Inclu[íi]d[oa]s?|Acrescid[oa]s?|Acrescentad[oa]s?|Revogad[oa]s?|"
    r"Renumerad[oa]s?|Alterad[oa]s?|Suprimid[oa]s?|Transformad[oa]s?)\s+(?:pel[oa]s?|por)\s+"
    r"(Emenda\s+Constitucional\s+de\s+Revis[ãa]o|Emenda\s+Constitucional|Lei\s+Complementar|"
    r"Medida\s+Provis[óo]ria|Decreto-Lei|Lei)\s+n[ºo°.]*\s*(\d[\d.]*)"
    r"(?:\s*,\s*de\s+(?:\d{1,2}[º°o]?\s*(?:de\s+)?[a-zç]+\s+de\s+)?(\d{4}))?", re.I)


def _slug(t):
    t = unicodedata.normalize("NFD", t.lower())
    t = "".join(c for c in t if not unicodedata.combining(c))
    return re.sub(r"(^-|-$)", "", re.sub(r"[^a-z0-9]+", "-", t))


def alteradoras(texto):
    """{id: rótulo} das normas que alteraram a lei, a partir das notas do Planalto."""
    t = texto_limpo(texto)
    achadas = {}
    for m in _RE_ALTERADORA.finditer(t):
        tipo = re.sub(r"\s+", " ", m.group(1)).lower()
        sigla = next(s for nome, s in _TIPOS if nome.lower().replace("ã", "a") == tipo.replace("ã", "a"))
        num = m.group(2).replace(".", "").rstrip(".")
        if not num.isdigit():
            continue
        rotulo_tipo = next(nome for nome, s in _TIPOS if s == sigla)
        rotulo = f"{rotulo_tipo} nº {int(num):,}".replace(",", ".") + (f"/{m.group(3)}" if m.group(3) else "")
        chave = f"{sigla} {int(num)}"
        if chave not in achadas or (m.group(3) and "/" not in achadas[chave]):
            achadas[chave] = rotulo
    return achadas


_MESES_NUM = {"janeiro": 1, "fevereiro": 2, "marco": 3, "março": 3, "abril": 4, "maio": 5, "junho": 6,
              "julho": 7, "agosto": 8, "setembro": 9, "outubro": 10, "novembro": 11, "dezembro": 12}
# "(Redação dada pela Lei nº 14.994, de 9.10.2024)" · "(Incluído pela Lei nº 13.964, de 24 de dezembro de 2019)"
_RE_NOTA_DATA = re.compile(
    r"(?:Reda[çc][ãa]o\s+dada|Inclu[íi]d[oa]s?|Acrescid[oa]s?|Acrescentad[oa]s?|Revogad[oa]s?|"
    r"Renumerad[oa]s?|Alterad[oa]s?|Suprimid[oa]s?|Transformad[oa]s?)\s+(?:pel[oa]s?|por)\s+"
    r"(Emenda\s+Constitucional\s+de\s+Revis[ãa]o|Emenda\s+Constitucional|Lei\s+Complementar|"
    r"Medida\s+Provis[óo]ria|Decreto-Lei|Lei)\s+n[ºo°.]*\s*(\d[\d.]*)\s*,\s*de\s+"
    r"(?:(\d{1,2})[º°o]?\s*\.\s*(\d{1,2})\s*\.\s*(\d{4})|"
    r"(\d{1,2})[º°o]?\s+de\s+([a-zç]+)\s+de\s+(\d{4}))", re.I)


def ultima_alteracao(texto):
    """(data ISO, rótulo) da norma mais recente citada nas notas do Planalto
    com data completa; (None, None) se nenhuma nota traz a data inteira."""
    t = texto_limpo(texto)
    melhor = (None, None)
    for m in _RE_NOTA_DATA.finditer(t):
        try:
            if m.group(3):
                d, mo, a = int(m.group(3)), int(m.group(4)), int(m.group(5))
            else:
                d, a = int(m.group(6)), int(m.group(8))
                mo = _MESES_NUM.get(m.group(7).lower())
                if not mo:
                    continue
            if not (1 <= d <= 31 and 1 <= mo <= 12 and 1900 <= a <= 2100):
                continue
        except ValueError:
            continue
        iso_d = f"{a:04d}-{mo:02d}-{d:02d}"
        if melhor[0] is None or iso_d > melhor[0]:
            tipo = re.sub(r"\s+", " ", m.group(1)).title().replace("Dl", "DL")
            num = int(m.group(2).replace(".", "").rstrip(".") or 0)
            melhor = (iso_d, f"{tipo} nº {num:,}".replace(",", ".") + f"/{a}")
    return melhor


def leis_do_acervo():
    """(numero, nome, url) de cada lei do leis-data.js com texto no Planalto."""
    import json as _json
    try:
        t = (RAIZ / "site/leis/leis-data.js").read_text(encoding="utf-8")
    except OSError:
        return []
    out, vistos = [], set()
    for m in re.finditer(r'\{\s*nome:\s*("(?:[^"\\]|\\.)*"),\s*numero:\s*("(?:[^"\\]|\\.)*"),\s*link:\s*"(https://www\.planalto\.gov\.br[^"]*)"', t):
        try:
            nome, numero = _json.loads(m.group(1)), _json.loads(m.group(2))
        except ValueError:
            continue
        if numero not in vistos:
            vistos.add(numero)
            out.append((numero, nome, m.group(3)))
    return out


# tempo máximo (segundos) só para conferir leis nesta rodada; o que sobrar fica
# para a próxima (as mais antigas na fila vão primeiro)
LEIS_ORCAMENTO = 1200


TEXTO_DIR = RAIZ / "leis" / "texto"
# Leis INTEIRAMENTE revogadas: o robô não procura mais o texto delas (nem as tenta de novo). Arquivo
# leis/texto/revogadas.json {link: {"numero","nome","motivo","em","auto"}}. Entra sozinho quando a página
# diz que a lei foi revogada e não traz texto; também pode ser editado à mão (ou me peça).
REVOGADAS_ARQ = TEXTO_DIR / "revogadas.json"


def leis_revogadas():
    import json
    try:
        return json.loads(REVOGADAS_ARQ.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return {}


def marcar_revogada(url, numero, nome, motivo, hoje_iso, auto=True):
    import json
    r = leis_revogadas()
    r[url] = {"numero": numero, "nome": nome, "motivo": motivo, "em": hoje_iso, "auto": auto}
    TEXTO_DIR.mkdir(parents=True, exist_ok=True)
    REVOGADAS_ARQ.write_text(json.dumps(r, ensure_ascii=False, indent=1, sort_keys=True), encoding="utf-8")


RX_TODA_REVOGADA = re.compile(r"(?i)revogad[ao]s?\s+(?:integralmente\s+)?(?:pel[ao]s?|por)\b|situa[çc][ãa]o\s*:?\s*revogad|(?:norma|lei|ato)\s+(?:foi\s+)?(?:integralmente\s+)?revogad[ao]|totalmente\s+revogad")


def pagina_de_lei_revogada(pg, paragrafos):
    """A página diz, no começo, que a lei foi revogada e quase não traz texto da lei (nada de artigos em
    quantidade): é lei inteiramente revogada, não texto incompleto."""
    todo = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", (pg or "")))
    # lei viva traz muitos artigos (e "(Revogado pelo art. X)" em dispositivos soltos): só vale página sem artigos
    return (bool(RX_TODA_REVOGADA.search(todo[:1500])) and len(paragrafos) < 12
            and len(re.findall(r"\bArt(?:igo|\.)\s*\d", todo)) <= 3)


def id_texto(url):
    """Nome do arquivo do texto de uma lei: o caminho do link no Planalto, sem
    "/ccivil_03/" nem ".htm", em minúsculas e com "-" no lugar do resto.
    leis-logic.js calcula o mesmo nome a partir do link do leis-data.js."""
    partes = urllib.parse.urlsplit(url)
    if not (partes.hostname or "").endswith("planalto.gov.br"):
        # outros sites: "<site sem www>/<caminho>?<consulta>"; nome longo vira
        # os 80 primeiros caracteres + um código (o mesmo cálculo está no leis-logic.js)
        s = _slug(re.sub(r"^www\.", "", partes.hostname or "") + partes.path
                  + ("?" + partes.query if partes.query else ""))
        if len(s) > 90:
            h = 0x811c9dc5
            for c in s.encode("ascii", "ignore"):
                h = ((h ^ c) * 0x01000193) & 0xffffffff
            s = s[:80] + "-" + "%08x" % h
        return s
    caminho = re.sub(r"^/ccivil_03/", "", partes.path)
    caminho = re.sub(r"\.html?$", "", caminho, flags=re.I)
    return _slug(caminho)


class _SemRiscado(HTMLParser):
    """Devolve o HTML sem o que está riscado: <strike>/<s>/<del> e qualquer elemento com
    "line-through" no estilo (o Planalto marca assim a redação revogada). Acompanha as tags abertas,
    então vale também quando o elemento riscado engloba vários parágrafos."""

    SEM_FIM = {"br", "hr", "img", "meta", "link", "input", "col", "area", "base"}

    def __init__(self):
        super().__init__(convert_charrefs=False)
        self.saida, self.pilha = [], []     # pilha: [(tag, riscado)]
        self.reabrir = []

    def _riscado_aberto(self):
        return any(r for _, r in self.pilha)

    BLOCOS = {"p", "div", "tr", "li", "table", "blockquote", "h1", "h2", "h3", "h4", "h5", "h6", "td", "th"}

    def handle_starttag(self, tag, attrs):
        if tag in self.SEM_FIM:
            if tag == "br" and not self._riscado_aberto():
                self.saida.append("<br>")
            return
        estilo = " ".join(v or "" for k, v in attrs if k in ("style", "class")).lower()
        self.pilha.append((tag, tag in ("strike", "s", "del") or "line-through" in estilo))
        if tag in self.BLOCOS and self.reabrir:       # riscado que ficou aberto no bloco anterior continua (como no navegador)
            self.pilha.extend(self.reabrir)
            self.reabrir = []

    def handle_startendtag(self, tag, attrs):
        if tag == "br" and not self._riscado_aberto():
            self.saida.append("<br>")

    def handle_endtag(self, tag):
        achou = next((k for k in range(len(self.pilha) - 1, -1, -1) if self.pilha[k][0] == tag), None)
        if achou is not None:
            if tag in self.BLOCOS:
                self.reabrir = [e for e in self.pilha[achou + 1:] if e[1]]
            del self.pilha[achou:]
        if tag in self.BLOCOS:          # o fim do bloco continua separando os parágrafos (mesmo se estava riscado)
            self.saida.append(f"</{tag}>")

    def handle_data(self, d):
        if not self._riscado_aberto():
            self.saida.append(d)

    def handle_entityref(self, name):
        if not self._riscado_aberto():
            self.saida.append(f"&{name};")

    def handle_charref(self, name):
        if not self._riscado_aberto():
            self.saida.append(f"&#{name};")


def sem_riscado(t):
    p = _SemRiscado()
    try:
        p.feed(t)
        p.close()
    except Exception:   # noqa: BLE001 — HTML muito quebrado: volta ao jeito simples
        return re.sub(r"(?is)<(strike|s|del)\b[^>]*>.*?</\1>", " ", t)
    return "".join(p.saida)


_NOVO_PARAGRAFO = re.compile(r"^(Art\.|§|Parágrafo único|[IVXLCDM]+\s*[-–—]|[a-z]\)|\d+\s*[.)-]\s|"
                             r"(PARTE|LIVRO|T[ÍI]TULO|CAP[ÍI]TULO|SE[ÇC][ÃA]O|SUBSE[ÇC][ÃA]O|DISPOSI[ÇC])\b|[A-ZÀ-Ý0-9 ,.\-ªº]{6,}$)")
_ROTULO = re.compile(r"^(Art\.\s*\d+[º°]?(?:-[A-Z]+)?|§\s*\d+[º°]?(?:-[A-Z]+)?|Parágrafo único|[IVXLCDM]+\s*[-–—]|[a-z]\)|\d+\s*[.)-])")


def _palavras(t):
    return {w for w in re.split(r"[^a-zà-ú0-9]+", re.sub(r"\([^)]*\)", " ", t.lower())) if len(w) > 2}


def _semelhantes(a, b):
    A, B = _palavras(a), _palavras(b)
    comum = len(A & B)
    menor = min(len(A), len(B))
    uniao = len(A) + len(B) - comum
    return (menor >= 3 and uniao and comum / uniao >= 0.5) or (menor >= 5 and comum / menor >= 0.75)


def juntar_linhas_da_lei(linhas):
    """As linhas do Planalto vêm quebradas no tamanho da tela de origem: junta as de um mesmo parágrafo
    (artigo, §, inciso, alínea e título começam parágrafo novo), devolve o ordinal "º" (1o → 1º) e tira a
    redação antiga que o Planalto deixa ao lado da nova (dois parágrafos quase iguais, com o mesmo
    rótulo, um depois do outro: o primeiro é a redação revogada). Mesmas regras do leitor (leis-logic.js)."""
    ps = []
    for k, t in enumerate(linhas):
        if t == "Art." and k + 1 < len(linhas):
            continue
        if k and linhas[k - 1] == "Art.":
            t = "Art. " + t
        ps.append(t)
    ps = [re.sub(r"\b([Nn])[o°](?=\s*\d)", r"\1º", re.sub(r"\b(\d{1,3})[o°](?![A-Za-zÀ-ú])", r"\1º", t)) for t in ps]
    juntos = []
    for t in ps:
        if not juntos or _NOVO_PARAGRAFO.match(t):
            juntos.append(t)
        else:
            juntos[-1] += " " + t
    fora = set()
    for i in range(len(juntos) - 1):
        r = _ROTULO.match(juntos[i])
        if not r:
            continue
        rot = re.sub(r"[-–—]$", "-", re.sub(r"\s+", "", r.group(0)))
        for j in range(i + 1, min(i + 3, len(juntos))):
            r2 = _ROTULO.match(juntos[j])
            if r2 and re.sub(r"[-–—]$", "-", re.sub(r"\s+", "", r2.group(0))) == rot and _semelhantes(juntos[i], juntos[j]):
                fora.add(i)
                break
    return [t for k, t in enumerate(juntos) if k not in fora]


def paragrafos_da_lei(t, manter_riscado=False):
    """Texto da lei, parágrafo por parágrafo, a partir da página do Planalto.
    O que está riscado (texto revogado: <strike>/<s>/<del> ou estilo "line-through") fica de fora; as
    notas "(Redação dada pela…)" ficam. As linhas quebradas são juntas em parágrafos e a redação
    antiga repetida sai (juntar_linhas_da_lei)."""
    t = re.sub(r"(?is)<(script|style|head)\b.*?</\1>|<!--.*?-->", " ", t)
    if not manter_riscado:
        t = sem_riscado(t)
    t = re.sub(r"(?i)<br\s*/?>|</(p|div|tr|h[1-6]|li|table|blockquote)>", "\n", t)
    t = re.sub(r"(?i)</t[dh]>", " ", t)
    t = html.unescape(re.sub(r"<[^>]+>", "", t)).replace("\xa0", " ")
    out = []
    for linha in t.split("\n"):
        linha = re.sub(r"\s+", " ", linha).strip()
        if linha:
            out.append(linha)
    # cabeçalho de navegação do Planalto
    while out and out[0] in ("Presidência da República", "Casa Civil",
                             "Subchefia para Assuntos Jurídicos"):
        out.pop(0)
    return juntar_linhas_da_lei(out)


def salvar_texto(url, pagina_html, nome, hoje_iso, extrator=None, numero=None):
    """Grava leis/texto/<id>.json se o texto mudou. True se gravou."""
    import json
    paragrafos = (extrator or paragrafos_da_lei)(pagina_html)
    if not extrator and (len(paragrafos) < 5 or sum(map(len, paragrafos)) < 500):
        # Lei inteira revogada: o Planalto risca o texto todo (ex.: Lei 4.898/1965), então ao tirar
        # o riscado quase nada sobra. Nesse caso guarda o texto riscado mesmo (é a lei, só que revogada).
        todos = paragrafos_da_lei(pagina_html, manter_riscado=True)
        if len(todos) >= 5 and sum(map(len, todos)) >= 500:
            print(f"  (\"{nome}\" está toda riscada/revogada no Planalto; guardei o texto como está)")
            paragrafos = todos
    if extrator:   # leis estaduais: algumas são curtíssimas, mas têm de ter artigos
        curto = len(paragrafos) < 4 or sum(map(len, paragrafos)) < 250 \
            or not any(re.match(r"(?i)^art(igo|\.)", p) for p in paragrafos)
    else:
        curto = len(paragrafos) < 5 or sum(map(len, paragrafos)) < 500
    if curto:
        print(f"  (texto de \"{nome}\" parece incompleto; não gravei)")
        return False
    if numero and not texto_confere(numero, paragrafos, url):
        print(f"  ATENÇÃO: o link de \"{numero}\" abre outra norma (\"{paragrafos[0][:60]}\"); não gravei")
        ERRADOS.append((numero, nome, url, paragrafos[0][:80]))
        return False
    arq = TEXTO_DIR / f"{id_texto(url)}.json"
    if arq.exists():
        try:
            if json.loads(arq.read_text(encoding="utf-8")).get("p") == paragrafos:
                return False
        except ValueError:
            pass
    TEXTO_DIR.mkdir(parents=True, exist_ok=True)
    arq.write_text(json.dumps({"nome": nome, "url": url, "em": hoje_iso, "p": paragrafos},
                              ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    return True


ERRADOS = []   # links que abrem outra norma (nesta rodada)


def texto_confere(numero, paragrafos, url=""):
    """O texto aberto é mesmo da norma esperada? O número ("12.726") tem de
    aparecer nas primeiras linhas. Sem número no nome (ex.: Constituição), vale.
    Vale também quando o próprio link traz número e ano (ex.: lei7031_2007_…pdf, c331996.html),
    para PDFs e páginas cujo topo não repete o título da lei."""
    m = re.search(r"(\d[\d.]*)\s*/\s*(\d{4})", numero or "")
    if not m:
        return True
    n = m.group(1).replace(".", "").lstrip("0") or "0"
    if url and re.search(rf"(?<!\d){n}[-_]?{m.group(2)}(?!\d)", urllib.parse.unquote(url).lower()):
        return True
    topo = re.sub(r"(?<=\d)\.(?=\d)", "", " ".join(paragrafos[:14]))
    return re.search(rf"(?<![\d.]){n}(?![\d])", re.sub(r"(?<=\d)\s+(?=\d{{3}}\b)", "", topo)) is not None


_JXA_PDF = r"""
ObjC.import("PDFKit"); ObjC.import("Foundation");
function run(argv) {
  var d = $.PDFDocument.alloc.initWithURL($.NSURL.fileURLWithPath(argv[0]));
  if (!d) return "";
  var t = d.string;
  return t ? ObjC.unwrap(t) : "";
}
"""


def texto_de_pdf(corpo):
    """Texto de um PDF. No Mac usa o PDFKit (já vem no macOS); se existir, o
    pdftotext. Sem nenhum dos dois: Falha."""
    with tempfile.TemporaryDirectory() as pasta:
        arq = Path(pasta) / "lei.pdf"
        arq.write_bytes(corpo)
        if sys.platform == "darwin":
            js = Path(pasta) / "pdf.js"
            js.write_text(_JXA_PDF, encoding="utf-8")
            r = subprocess.run(["osascript", "-l", "JavaScript", str(js), str(arq)],
                               capture_output=True, text=True, timeout=120)
            if r.returncode == 0 and r.stdout.strip():
                return r.stdout
        for exe in ("pdftotext",):
            if shutil.which(exe):
                r = subprocess.run([exe, "-layout", "-nopgbrk", str(arq), "-"], capture_output=True,
                                   text=True, timeout=120)
                if r.returncode == 0 and r.stdout.strip():
                    return r.stdout
    raise Falha("não consegui ler o texto do PDF (PDF só com imagem, ou sem leitor de PDF neste computador)")


def paragrafos_de_pdf(texto):
    """Junta as linhas do PDF em parágrafos: começa um novo em "Art.", "§",
    incisos, alíneas e títulos; o resto continua o parágrafo anterior."""
    novo = re.compile(r"(?i)^(art(igo|\.)|§|par[áa]grafo|[IVXLC]+\s*[-–.)]|[a-z]\)|\d+\s*[-–.)]\s|cap[íi]tulo|se[çc][ãa]o|t[íi]tulo|lei\b|decreto\b|o governador|a assembl)")
    out = []
    for linha in str(texto).replace("\r", "\n").split("\n"):
        linha = re.sub(r"\s+", " ", linha.replace("\xa0", " ")).strip()
        if not linha or re.fullmatch(r"\d{1,4}", linha):   # linha vazia ou só o número da página
            continue
        if out and not novo.match(linha):
            if out[-1].endswith("-"):
                out[-1] = out[-1][:-1] + linha
            else:
                out[-1] += " " + linha
        else:
            out.append(linha)
    for i, p in enumerate(out[:40]):   # título de verdade: "LEI Nº 7.031, DE ...", "DECRETO Nº ..."
        if re.match(r"(?i)^(lei(\s+(complementar|ordin[áa]ria|estadual))?|decreto|emenda|resolu[çc][ãa]o)\s*(n[ºo°.]|\d)", p) \
                or re.match(r"(?i)^constitui", p):
            return out[i:]
    for i, p in enumerate(out[:40]):
        if re.match(r"(?i)^(lei|decreto|constitui|emenda|resolu)", p):
            return out[i:]
    return out


def paragrafos_do_site(t):
    """Texto de uma lei estadual (páginas de assembleias, casas civis e do Leis
    Estaduais). Cada site é diferente: tira menus/rodapé, testa alguns recipientes
    do texto (article, main, div "conteudo"...) e fica com o que tem mais "Art." """
    t = re.sub(r"(?is)<(script|style|head|nav|header|footer|aside|noscript|svg|select)\b.*?</\1>|<!--.*?-->", " ", t)
    cands = []
    for pat in (r"(?is)<article\b.*?</article>", r"(?is)<main\b.*?</main>",
                r'(?is)<div[^>]+(?:id|class)="[^"]*(?:conteudo|content|texto|norma|ato|lei)[^"]*"[^>]*>.*'):
        m = re.search(pat, t)
        if m:
            cands.append(m.group(0))
    cands.append(t)
    melhor, n_melhor = [], -1
    for c in cands:
        ps = paragrafos_da_lei(c)
        n = sum(1 for p in ps if re.match(r"(?i)^art(igo|\.)", p))
        if n > n_melhor:
            melhor, n_melhor = ps, n
    for i, p in enumerate(melhor[:40]):   # começa no título da norma
        if re.match(r"(?i)^(lei|decreto|constitui|emenda|resolu|o governador|a assembleia)", p):
            return melhor[i:]
    return melhor


ESTADUAIS_HOSTS = ("lex.pge.pa.gov.br", "ba.gov.br", "legislabahia.ba.gov.br", "aacpdappls.net.ms.gov.br", "aleselegis.al.se.leg.br", "sistemas.pa.gov.br", "legisweb.com.br", "leisestaduais.com.br","legisla.casacivil.go.gov.br", "leis.alesc.sc.gov.br",
                   "legislacao.sef.sc.gov.br", "legislacao.pr.gov.br", "al.rs.gov.br", "almg.gov.br",
                   "legislacao.mt.gov.br", "al.mt.gov.br", "al.sp.gov.br", "sinj.df.gov.br",
                   "sapl.al.to.leg.br", "sapl.al.pi.leg.br", "sapl.al.ma.leg.br", "legis.senado.leg.br")
ESTADUAIS_ORCAMENTO = 1100
EXTRATOR_VERSAO = 3   # sobe quando o leitor melhora: as falhas anteriores são tentadas de novo
DEBUG_DIR = RAIZ / "leis" / "texto-debug"


def _numero_ano(numero):
    """"Lei Estadual (PR) nº 12.726/1999" → ("lei", "12726", "1999"); LC → ("lc", ...)."""
    m = re.search(r"n[ºo°]\s*([\d.]+)\s*/\s*(\d{4})", numero or "")
    if not m:
        return None
    tipo = "lc" if re.match(r"(?i)lei complementar", numero) else ("decreto" if re.match(r"(?i)decreto", numero) else "lei")
    return tipo, m.group(1).replace(".", "").lstrip("0") or "0", m.group(2)


def _alternativas(url, pg, numero=""):
    """Outros lugares onde o texto da lei pode estar, quando a página só traz a ficha
    ou é de outra norma: PDF da API do Legisla Goiás, página /html/ da ALESC, busca
    por número no Paraná."""
    out = []
    p = urllib.parse.urlsplit(url)
    na = _numero_ano(numero)
    host = re.sub(r"^www\.", "", p.hostname or "")
    if host.endswith("legisla.casacivil.go.gov.br"):
        m = re.match(r"/pesquisa_legislacao/(\d+)", p.path)
        if m:
            out.append(("pdf", f"https://legisla.casacivil.go.gov.br/api/v2/pesquisa/legislacoes/{m.group(1)}/pdf"))
    if host == "leis.alesc.sc.gov.br" and na and na[0] in ("lei", "lc") and "/html/" not in p.path:
        suf = "lei_complementar" if na[0] == "lc" else "lei"
        out.append(("html", f"https://leis.alesc.sc.gov.br/html/{na[2]}/{na[1]}_{na[2]}_{suf}.html"))
    if host == "legislacao.pr.gov.br" and na and na[0] in ("lei", "lc"):
        for cod in ((1,) if na[0] == "lei" else (2, 3, 4, 5)):   # codTipoAto: 1 = lei ordinária; LC: tenta alguns
            out.append(("html", "https://www.legislacao.pr.gov.br/legislacao/exibirAto.do?action=localizarAto"
                                f"&codTipoAto={cod}&nroAto={na[1]}&tipoVisualizacao=compilado"))
    if (p.hostname or "").startswith("sapl.") and re.fullmatch(r"/norma/\d+/?", p.path):
        out.append(("html", url.rstrip("/") + "/ta"))        # texto compilado do SAPL
    for m in re.finditer(r"(?i)(?:href|src)=[\"']([^\"']+\.pdf(?:\?[^\"']*)?)[\"']", pg or ""):
        out.append(("pdf", urllib.parse.urljoin(url, html.unescape(m.group(1)))))
    if "sinj.df.gov.br" in url:
        m = re.search(r'"ch_norma":"(\d+)".{0,6000}?"ar_atualizado":\{[^}]*?"filename":"([^"]+\.html?)"', pg or "", re.S)
        if m:
            out.append(("html", f"https://www.sinj.df.gov.br/sinj/Norma/{m.group(1)}/{m.group(2)}"))
    vistos, res = set(), []
    for t, u in out:
        if u not in vistos and u != url:
            vistos.add(u)
            res.append((t, u))
    return res[:4]


def leis_estaduais(hoje_iso):
    """Lê o texto das leis estaduais do leis-data.js (sites em HTML). Sites que
    não deram certo: guarda um pedaço da página em leis/texto-debug/<site>.html
    para eu ajustar o leitor. Devolve quantos textos gravou."""
    import json
    import time
    try:
        t = (RAIZ / "site/leis/leis-data.js").read_text(encoding="utf-8")
    except OSError:
        return 0
    lista, vistos = [], set()
    for m in re.finditer(r'\{\s*nome:\s*("(?:[^"\\]|\\.)*"),\s*numero:\s*("(?:[^"\\]|\\.)*"),\s*link:\s*"(https?://[^"]*)"', t):
        url = m.group(3)
        host = re.sub(r"^www\.", "", urllib.parse.urlsplit(url).hostname or "")
        eh_pdf = re.search(r"\.pdf($|\?)|/sdm_downloads/", url, re.I) is not None
        if "planalto.gov.br" in host or url in vistos:
            continue
        # PDFs de qualquer site (o número da lei é conferido antes de gravar)
        if not eh_pdf and not any(host == h or host.endswith("." + h) for h in ESTADUAIS_HOSTS):
            continue
        try:
            nome, numero = json.loads(m.group(1)), json.loads(m.group(2))
        except ValueError:
            continue
        vistos.add(url)
        lista.append((numero, nome, url))
    falhas_arq = DEBUG_DIR / "falhas.json"
    try:
        falhas = json.loads(falhas_arq.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        falhas = {}
    limite = (datetime.now() - timedelta(days=14)).strftime("%Y-%m-%d")
    n_antes = len(lista)
    def em_espera(u):
        f = falhas.get(u) or {}
        return f.get("v") == EXTRATOR_VERSAO and f.get("em", "") >= limite   # falhou há pouco, com este leitor
    revog = leis_revogadas()
    if any(x[2] in revog for x in lista):
        print(f"  (leis estaduais: {sum(1 for x in lista if x[2] in revog)} inteiramente revogada(s); não procuro mais — leis/texto/revogadas.json)")
    lista = [x for x in lista if not em_espera(x[2]) and x[2] not in revog]
    if n_antes != len(lista):
        print(f"  (leis estaduais: {n_antes - len(lista)} com link já conferido e falho; ver leis/texto-debug/links-errados.md)")
    lenta = lambda u: any(h in u for h in ("leisestaduais.com.br", "legisla.casacivil.go.gov.br"))
    lista.sort(key=lambda x: ((TEXTO_DIR / f"{id_texto(x[2])}.json").exists(), lenta(x[2])))
    gravados, inicio, feitas, sem_amostra = 0, time.monotonic(), 0, set()
    chrome_ok = [True]
    for numero, nome, url in lista:
        if feitas and time.monotonic() - inicio > ESTADUAIS_ORCAMENTO:
            print(f"  (leis estaduais: faltam {len(lista) - feitas} para a próxima rodada)")
            break
        feitas += 1
        host = re.sub(r"^www\.", "", urllib.parse.urlsplit(url).hostname or "")
        nao_existe = lambda x: re.search(r"P[áa]gina\s+N[ãa]o\s+Encontrada|ainda n[ãa]o foi disponibilizado", re.sub(r"<[^>]+>", " ", x)) is not None
        if re.search(r"\.pdf($|\?)|/sdm_downloads/", url, re.I):   # PDF (ou link de download de PDF): baixa e lê o texto
            try:
                status, tipo, corpo = buscar(url)
                print(f"  {url} → HTTP {status}")
                if status != 200:
                    raise Falha(f"HTTP {status} (o site recusou ou a página mudou)")
                texto_pdf = texto_de_pdf(corpo)
            except Falha as e:
                print(f"  ATENÇÃO (lei estadual): {nome}: {str(e)[:300]}")
                falhas[url] = {"v": EXTRATOR_VERSAO, "em": hoje_iso, "numero": numero, "nome": nome,
                               "motivo": "erro ao abrir: " + str(e)[:140]}
                continue
            n_err = len(ERRADOS)
            if salvar_texto(url, texto_pdf, nome, hoje_iso, extrator=paragrafos_de_pdf, numero=numero):
                gravados += 1
                falhas.pop(url, None)
            elif len(ERRADOS) > n_err:
                falhas[url] = {"v": EXTRATOR_VERSAO, "em": hoje_iso, "numero": numero, "nome": nome,
                               "motivo": f"abre outra norma (\"{ERRADOS[-1][3]}\")"}
            continue
        if host == "lex.pge.pa.gov.br":   # Lex (PGE-PA): API JSON pública, o link traz o id do ato
            import json as _json
            m_id = re.search(r"/(?:texto-integral|atos(?:/view)?)/(\d+)", url)
            try:
                if not m_id:
                    raise Falha("link do Lex sem o id do ato (use https://lex.pge.pa.gov.br/#/texto-integral/<id>)")
                status, _tipo, corpo = buscar(f"https://lex.pge.pa.gov.br/api/atos/{m_id.group(1)}")
                print(f"  {url} → HTTP {status}")
                if status != 200:
                    raise Falha(f"HTTP {status} (o Lex recusou ou o id não existe)")
                ato = _json.loads(corpo.decode("utf-8", "replace"))
                ps = paragrafos_da_lei(str(ato.get("conteudo") or ""))
                if ato.get("titulo"):
                    ps.insert(0, re.sub(r"\s+", " ", str(ato["titulo"])).strip())
            except (Falha, ValueError) as e:
                print(f"  ATENÇÃO (lei estadual): {nome}: {str(e)[:300]}")
                falhas[url] = {"v": EXTRATOR_VERSAO, "em": hoje_iso, "numero": numero, "nome": nome,
                               "motivo": "erro ao abrir: " + str(e)[:140]}
                continue
            n_err = len(ERRADOS)
            if salvar_texto(url, ps, nome, hoje_iso, extrator=lambda x: x, numero=numero):
                gravados += 1
                falhas.pop(url, None)
            elif len(ERRADOS) > n_err:
                falhas[url] = {"v": EXTRATOR_VERSAO, "em": hoje_iso, "numero": numero, "nome": nome,
                               "motivo": f"abre outra norma (\"{ERRADOS[-1][3]}\")"}
            continue
        tem_lei = lambda x: len(re.findall(r"(?i)\bart(?:igo|\.)", x)) >= 2 or nao_existe(x)
        try:
            try:
                pg = pagina(url, valida=lambda x: len(x) > 1500)
            except Falha as e:
                if "Chrome" in str(e) and "JavaScript" in str(e):
                    chrome_ok[0] = False   # sem o Chrome real: não adianta tentar de novo
                    pg = ""
                elif re.search(r"HTTP (403|500)", str(e)) and sys.platform == "darwin" and chrome_ok[0]:
                    pg = ""   # o site recusa o robô (ex.: ALRS dá 500): tenta pelo seu Chrome
                else:
                    raise
            if not tem_lei(pg) and sys.platform == "darwin" and chrome_ok[0]:
                # site que monta a página com JavaScript ou pede verificação anti-robô
                pg = pagina_chrome_real(url, valida=tem_lei)
            elif not tem_lei(pg):
                raise Falha("a página precisa do Chrome (JavaScript dos eventos da Apple) e ele não está liberado")
        except Falha as e:
            if "JavaScript" in str(e) and "Chrome" in str(e):
                chrome_ok[0] = False
            print(f"  ATENÇÃO (lei estadual): {nome}: {str(e)[:300]}")
            if not ("JavaScript" in str(e) and "Chrome" in str(e)):   # falta de permissão não é culpa do link
                falhas[url] = {"v": EXTRATOR_VERSAO, "em": hoje_iso, "numero": numero, "nome": nome,
                               "motivo": "erro ao abrir: " + re.sub(r"^https?://\S+ → ", "", str(e))[:140]}
            continue
        if nao_existe(pg):
            print(f"  ATENÇÃO: o link de \"{numero}\" não existe no site; não gravei")
            falhas[url] = {"v": EXTRATOR_VERSAO, "em": hoje_iso, "numero": numero, "nome": nome, "motivo": "a página não existe no site"}
            continue
        n_err = len(ERRADOS)
        gravou = False
        try:
            gravou = salvar_texto(url, pg, nome, hoje_iso, extrator=paragrafos_do_site, numero=numero)
            if not gravou and (len(ERRADOS) == n_err or "legislacao.pr.gov.br" in url):
                # a página não traz o texto (ou abre outra norma): tenta o caminho alternativo (SAPL /ta, PDF do site, arquivo do SINJ, API do Legisla GO, página da ALESC, busca do PR)
                for tipo, alt in _alternativas(url, pg, numero):
                    try:
                        if tipo == "pdf":
                            status, _tp, corpo = buscar(alt)
                            if status != 200:
                                continue
                            txt, ext = texto_de_pdf(corpo), paragrafos_de_pdf
                        else:
                            txt, ext = pagina(alt, valida=lambda x: len(x) > 500), paragrafos_do_site
                    except Falha:
                        continue
                    gravou = salvar_texto(url, txt, nome, hoje_iso, extrator=ext, numero=numero)
                    if gravou or (len(ERRADOS) > n_err and "legislacao.pr.gov.br" not in url):
                        break
        except OSError as e:
            print(f"  ATENÇÃO: {e}")
            continue
        if not gravou and len(ERRADOS) == n_err and pg and pagina_de_lei_revogada(pg, paragrafos_do_site(pg)):
            print(f"  {numero}: a página diz que a lei está inteiramente revogada; não procuro mais (leis/texto/revogadas.json)")
            marcar_revogada(url, numero, nome, "a página informa que a lei foi revogada", hoje_iso)
            falhas.pop(url, None)
            continue
        if gravou:
            gravados += 1
            falhas.pop(url, None)
        elif len(ERRADOS) == n_err and (TEXTO_DIR / f"{id_texto(url)}.json").exists():
            falhas.pop(url, None)   # o texto já está salvo e não mudou
        elif len(ERRADOS) > n_err:
            falhas[url] = {"v": EXTRATOR_VERSAO, "em": hoje_iso, "numero": numero, "nome": nome,
                           "motivo": f"abre outra norma (\"{ERRADOS[-1][3]}\")"}
        else:
            falhas[url] = {"v": EXTRATOR_VERSAO, "em": hoje_iso, "numero": numero, "nome": nome,
                           "motivo": ("o site pede verificação anti-robô (Cloudflare): trocar o link por uma fonte oficial"
                                      if re.search(r"Um momento|Just a moment|challenges\.cloudflare", pg or "") else
                                      "a página não traz o texto da lei (texto em outro arquivo, login ou montado por JavaScript)")}
        if not (TEXTO_DIR / f"{id_texto(url)}.json").exists() and host not in sem_amostra:
            sem_amostra.add(host)   # uma amostra por site, para eu ver como a página é
            DEBUG_DIR.mkdir(parents=True, exist_ok=True)
            # amostra curta: começo da página + trechos em volta de "Art. 1" (mostra onde está o texto)
            trechos = [pg[:2500]]
            for m_ in list(re.finditer(r"(?i)art(?:igo|\.)\s*1\s*[ºo°.]", pg))[:2]:
                trechos.append("\n<!-- … -->\n" + pg[max(0, m_.start() - 1500):m_.start() + 2500])
            (DEBUG_DIR / f"{_slug(host)}.html").write_text(
                f"<!-- {url} ({len(pg)} caracteres) -->\n" + "".join(trechos), encoding="utf-8")
    if falhas:
        DEBUG_DIR.mkdir(parents=True, exist_ok=True)
        falhas_arq.write_text(json.dumps(falhas, ensure_ascii=False, indent=1), encoding="utf-8")
        (DEBUG_DIR / "links-errados.md").write_text(
            "# Links que não servem (abrem outra norma ou não existem)\n\n" + "".join(
                f"- {v.get('numero')} — {v.get('nome')}: {u} → {v.get('motivo')}\n"
                for u, v in sorted(falhas.items(), key=lambda kv: kv[1].get("numero", ""))), encoding="utf-8")
    print(f"  Leis estaduais: {gravados} gravada(s) nesta rodada ({feitas} conferidas de {len(lista)}).")
    return gravados


def indice_dos_textos():
    """leis/texto/indice.json: {id: data} dos textos que existem (o site só
    mostra o botão "Leia-me" nas leis que estão aqui)."""
    import json
    ind = {}
    for arq in sorted(TEXTO_DIR.glob("*.json")):
        if arq.name == "indice.json":
            continue
        try:
            ind[arq.stem] = json.loads(arq.read_text(encoding="utf-8")).get("em", "")
        except ValueError:
            continue
    (TEXTO_DIR / "indice.json").write_text(
        json.dumps(ind, ensure_ascii=False, indent=0), encoding="utf-8")
    return len(ind)


def leis(dados, tudo=False):
    import json
    import time
    atual = json.loads(LEIS_ARQ.read_text(encoding="utf-8")) if LEIS_ARQ.exists() else {"leis": {}}
    registro = atual.get("leis", {})
    hoje_iso = hoje()
    mudou, avisos, erros = False, [], []
    # as 26 mais cobradas + todas as leis do acervo com texto no Planalto,
    # as menos recentemente conferidas primeiro
    lista, ja = [], set()
    for numero, nome, url in LEIS_MONITORADAS + leis_do_acervo():
        if numero not in ja:
            ja.add(numero)
            lista.append((numero, nome, url))
    # as sem texto salvo vêm primeiro (a primeira rodada traz os textos todos,
    # aos poucos); depois, as conferidas há mais tempo
    lista.sort(key=lambda x: ((TEXTO_DIR / f"{id_texto(x[2])}.json").exists(),
                              (registro.get(_slug(x[0])) or {}).get("conferidaEm", "")))
    textos_novos, vistos_url = 0, set()
    inicio, conferidas = time.monotonic(), 0
    for numero, nome, url in lista:
        if conferidas and time.monotonic() - inicio > LEIS_ORCAMENTO:
            print(f"  (tempo desta rodada esgotado: faltam {len(lista) - conferidas} leis para a próxima vez)")
            break
        conferidas += 1
        chave = _slug(numero)
        try:
            t = pagina(url, valida=lambda x: "Reda" in x or "Inclu" in x)
            achadas = alteradoras(t)
        except Falha as e:
            erros.append(f"{nome}: {e}")
            continue
        if url not in vistos_url:
            vistos_url.add(url)
            if salvar_texto(url, t, nome, hoje_iso):
                textos_novos += 1
        antigo = registro.get(chave)
        ult_data, ult_norma = ultima_alteracao(t)
        if not achadas:
            # lei sem nenhuma alteração ainda (ou página sem notas): só anota que conferiu
            if antigo is None:
                registro[chave] = {"numero": numero, "nome": nome, "link": url, "alteradoras": [],
                                   "mudancas": [], "desde": hoje_iso, "conferidaEm": hoje_iso}
                mudou = True
            else:
                antigo["conferidaEm"] = hoje_iso
                mudou = True
            continue
        if antigo is None:
            registro[chave] = {"numero": numero, "nome": nome, "link": url,
                               "alteradoras": sorted(achadas), "mudancas": [], "desde": hoje_iso,
                               "conferidaEm": hoje_iso}
            if ult_data:
                registro[chave].update({"ultimaAlteracao": ult_data, "ultimaNorma": ult_norma})
            print(f"  {nome}: {len(achadas)} normas alteradoras anotadas (primeira conferência)")
            mudou = True
            continue
        novas = [k for k in achadas if k not in set(antigo.get("alteradoras", []))]
        antigo.update({"numero": numero, "nome": nome, "link": url, "conferidaEm": hoje_iso})
        if ult_data and (antigo.get("ultimaAlteracao") != ult_data or antigo.get("ultimaNorma") != ult_norma):
            antigo.update({"ultimaAlteracao": ult_data, "ultimaNorma": ult_norma})
            mudou = True
        if novas:
            antigo["alteradoras"] = sorted(set(antigo["alteradoras"]) | set(novas))
            antigo.setdefault("mudancas", []).append(
                {"normas": [achadas[k] for k in sorted(novas)], "detectadoEm": hoje_iso})
            antigo["mudancas"] = antigo["mudancas"][-20:]
            avisos.append(f"{nome}: alterada por " + ", ".join(achadas[k] for k in sorted(novas)))
            print(f"  {nome}: NOVA ALTERAÇÃO — " + ", ".join(achadas[k] for k in sorted(novas)))
            mudou = True
        else:
            print(f"  {nome}: sem alteração nova ({len(achadas)} alteradoras conhecidas)")
            mudou = True   # (a data da conferência mudou)
    if mudou:
        LEIS_ARQ.parent.mkdir(exist_ok=True)
        LEIS_ARQ.write_text(json.dumps({"atualizado": hoje_iso, "leis": registro},
                                       ensure_ascii=False, indent=1), encoding="utf-8")
        dados.leis_mudou = True
    try:   # data de cada alteração (as notas do Planalto quase sempre trazem só o ano)
        import datar_alteracoes
        datar_alteracoes.atualizar(id_texto=id_texto)
    except Exception as e:   # noqa: BLE001 — não derruba a etapa LEIS
        print(f"  (não consegui datar as alterações: {e})")
    textos_novos += leis_estaduais(hoje_iso)
    if textos_novos or not (TEXTO_DIR / "indice.json").exists():
        total = indice_dos_textos()
        print(f"  Textos das leis: {textos_novos} gravado(s) ou atualizado(s); {total} no total (leis/texto/).")
        dados.leis_mudou = True
    for e in erros:
        print(f"  ATENÇÃO: {e}")
    if erros and len(erros) == conferidas:
        raise Falha("não consegui conferir nenhuma lei (" + erros[0] + ")")
    return [{"edicao": a, "data": hoje_iso} for a in avisos]


def stj_extra(dados):
    """Edições extraordinárias do Informativo do STJ ("33E"). Na primeira vez
    completa o histórico (da nº 1 em diante); depois só procura as novas."""
    var = "STJX_DATA"
    vistas = {e for e, _, _ in dados.registradas(var)}
    ultimo = max(vistas, default=0)

    def conferir(n):
        url = ("https://processo.stj.jus.br/jurisprudencia/externo/informativo/"
               f"?acao=pesquisarumaedicao&livre=%27{n:04d}E%27.cod.")
        t = re.sub(r"<[^>]+>|\s+", " ", html.unescape(
            pagina(url, valida=lambda x: "Informativo" in x)))
        m = re.search(rf"Extraordin\S*\s+n[º°.]*\s*0*{n}\b\s*[-–—]?\s*(.{{0,160}}?)\s*[-–—]?\s*"
                      r"(\d{1,2})[º°o]?\s+de\s+([a-zç]+)\s+de\s+(\d{4})", t, re.I)
        if not m or not mes_num(m.group(3)):
            print(f"  extraordinária nº {n}: não está na página")
            return None
        tema = re.sub(r"\s*[-–—]\s*$", "", m.group(1)).strip().replace('"', "'")
        return {"edicao": n, "data": iso(m.group(4), mes_num(m.group(3)), m.group(2)),
                "tema": tema[:120] or None,
                "link": f"https://processo.stj.jus.br/SCON/GetPDFINFJ?edicao={n:04d}E"}

    if ultimo and not conferir(ultimo):
        raise Falha(f"nem a extraordinária nº {ultimo}, que já saiu, abriu — o site está recusando o acesso")
    novas = []
    for n in [n for n in range(1, ultimo) if n not in vistas][:40]:  # histórico que falta
        achou = conferir(n)
        if achou:
            novas.append(achou)
    for n in range(ultimo + 1, ultimo + 11):
        achou = conferir(n)
        if not achou:
            break
        novas.append(achou)
    if novas:
        dados.inserir(var, novas, com_link=True)
    return novas


STJ_BOLETIM = "https://processo.stj.jus.br/processo/precedentes"


def stj_boletim(dados):
    """Boletim de Precedentes do STJ: a própria página traz todas as edições
    (uma lista por ano, com número, data e PDF); registra as que ainda não
    estão no Diário (na primeira vez, todas)."""
    var = "STJBP_DATA"
    t = pagina(STJ_BOLETIM, valida=lambda x: "boletim_precedentes_stj" in x)
    vistas = {e for e, _, _ in dados.registradas(var)}
    achadas = {}
    for m in re.finditer(
            r'<option value="(https://www\.stj\.jus\.br/docs_internet/processo/precedentes/+(\d{4})/(\d+)_boletim_precedentes_stj_(\d{8})\.pdf)">'
            r'[^<]*?n\.\s*(\d+)\s*-\s*(\d{2})/(\d{2})/(\d{4})', t):
        link, ano, n1, dt, n2, d, mo, y = m.groups()
        if int(n1) != int(n2) or dt != y + mo + d:
            continue
        achadas[int(n1)] = {"edicao": int(n1), "ano": int(ano), "data": f"{y}-{mo}-{d}",
                            "link": link.replace("precedentes//", "precedentes/")}
    if not achadas:
        raise Falha("não achei nenhuma edição do Boletim de Precedentes na página — a página mudou?")
    novas = [v for k, v in achadas.items() if k not in vistas]
    if novas:
        dados.inserir(var, novas, com_link=True)
    return novas


STF_PV = "https://portal.stf.jus.br/textos/verTexto.asp?servico=codi&pagina=Plenario_Virtual"
_RE_PV = re.compile(r"(?:PVE|PV_?em_?Evid[a-zê]*)_?0*(\d{1,2})_(\d{4})", re.I)


def stf_pv(dados):
    """Plenário Virtual em Evidência (STF): lê a página da série e registra os
    PDFs que ainda não estão no Diário (na primeira vez, todos)."""
    var = "STFPV_DATA"
    t = pagina(STF_PV, valida=lambda x: re.search(r"PV_?EM_?EVID|PVE\d", x, re.I))
    vistas = {(e, a) for e, a, _ in dados.registradas(var)}
    achadas, sem_numero = {}, []
    for m in re.finditer(r'<a\b[^>]*href="([^"]+?\.pdf)[^"]*"[^>]*>(.*?)</a>', t, re.S | re.I):
        href = html.unescape(m.group(1))
        if not re.search(r"EVID|PVE", href, re.I):
            continue
        nome = href.rsplit("/", 1)[-1]
        # Os nomes variam muito (PVE04_2026.2.pdf, PVE_29_20262.pdf,
        # 19_PV_em_Evidencia_19_20241.pdf, PVemEvidncia16_2026.pdf...):
        # primeiro o padrão conhecido; se não der, o último "número_ano".
        f = _RE_PV.search(nome)
        if f:
            n, ano = int(f.group(1)), int(f.group(2)[:4])
        else:
            pares = re.findall(r"(?<!\d)(\d{1,2})[_\-. ]+(20\d\d)", nome)
            if not pares:
                sem_numero.append(nome)
                continue
            n, ano = int(pares[-1][0]), int(pares[-1][1])
        if not (1 <= n <= 60) or (n, ano) in vistas or (n, ano) in achadas:
            continue
        d = None
        for trecho in (m.group(2), t[m.end():m.end() + 120]):  # texto do link; senão, logo depois
            d = re.search(r"(\d{1,2})[./](\d{1,2})[./](\d{4})",
                          html.unescape(re.sub(r"<[^>]+>", " ", trecho)))
            if d:
                break
        data = iso(d.group(3), d.group(2), d.group(1)) if d else None
        achadas[(n, ano)] = {"edicao": n, "ano": ano, "data": data,
                             "link": urllib.parse.urljoin(STF_PV, href)}
    if sem_numero:
        print(f"  (PDFs sem número reconhecível, ficaram de fora: {', '.join(sem_numero[:10])})")
    if not achadas and not vistas:
        raise Falha("não achei nenhuma edição na página do Plenário Virtual em Evidência — a página mudou?")
    for a in achadas.values():
        if not a["data"]:
            try:
                status, tipo, corpo = buscar(a["link"])
                if status == 200 and eh_pdf(tipo, corpo):
                    a["data"] = data_do_pdf(corpo)
            except Exception:
                pass
    novas = list(achadas.values())
    if novas:
        dados.inserir(var, novas, com_link=True)
    return novas


# ================================================================ cards dos informativos
# Depois que STF e STJ registram uma edição nova em diario-data.js, esta etapa
# lê o PDF da edição, separa os julgados (scripts/informativos_extrair.py) e
# põe os cards no Diário das Decisões (informativos/). Se o PDF não abrir pelo
# robô (o STJ às vezes recusa), vale um PDF colocado à mão em informativos/pdf/
# (nomes: Informativo_stf_1227.pdf, GetPDFINFJ0902.pdf).
PASTA_INF = RAIZ / "informativos"
EDICOES_POR_VEZ = 12
JANELA_EDICOES = 40


def _pdf_do_informativo(org, n, link):
    manual = PASTA_INF / "pdf"
    nomes = ([f"Informativo_stf_{n}.pdf"] if org == "STF"
             else [f"GetPDFINFJ{n:04d}.pdf", f"GetPDFINFJ{n}.pdf", f"GetPDFINFJ{n:04d} (1).pdf"])
    for nome in nomes:
        if (manual / nome).exists():
            print(f"  nº {n}: usando o PDF de informativos/pdf/{nome}")
            return (manual / nome).read_bytes()
    url = (f"https://www.stf.jus.br/arquivo/cms/informativoSTF/anexo/Informativo_PDF/Informativo_stf_{n}.pdf"
           if org == "STF" else link or f"https://scon.stj.jus.br/SCON/GetPDFINFJ?edicao={n:04d}")
    status, tipo, corpo = buscar(url)
    print(f"  {org} nº {n}: PDF → HTTP {status}")
    if status == 200 and eh_pdf(tipo, corpo):
        return corpo
    if status == 403 and org == "STF" and _achar_firefox() and not _ff["indisponivel"]:
        # (STJ: a verificação anti-robô barra o Firefox sem janela; a página da edição serve)
        host = urllib.parse.urlsplit(url).hostname
        try:
            corpo = baixar_via_firefox(url, f"https://{host}/SCON/JurisprudenciaEmTesesFeed",
                                       valida=lambda x: "Um momento" not in x[:3000])
            print(f"  {org} nº {n}: PDF pelo Firefox → " + (f"{len(corpo)} bytes" if corpo else "não veio"))
            if corpo and eh_pdf("", corpo):
                return corpo
        except Falha as e:
            print(f"  {org} nº {n}: Firefox: {e}")
    return None


def cards_informativos(dados):
    sys.path.insert(0, str(RAIZ / "scripts"))
    import informativos_extrair as ie
    lidas_f = PASTA_INF / "lidas.json"
    lidas = json.loads(lidas_f.read_text(encoding="utf-8")) if lidas_f.exists() else {}
    gravadas = ie.edicoes_gravadas()
    feitas, falhas = [], []
    for org, var in (("STF", "STF_DATA"), ("STJ", "STJ_DATA")):
        registradas = dados.registradas(var)[:JANELA_EDICOES]
        links = {e: l for e, _, l in registradas}
        faltam = [e for e, _, _ in registradas
                  if e not in gravadas.get(org, set()) and str(e) not in lidas.get(org, {})
                  and (org != "STF" or e >= 1000)]
        if not faltam:
            print(f"  {org}: todas as edições recentes já têm cards")
            continue
        print(f"  {org}: edições sem cards: {', '.join(map(str, faltam[:EDICOES_POR_VEZ]))}")
        for n in faltam[:EDICOES_POR_VEZ]:
            chave = f"{org}:{n}"
            try:
                corpo = _pdf_do_informativo(org, n, links.get(n))
                if corpo:
                    blocos = ie.blocos_de_pdf(corpo, texto_de_pdf)
                elif org == "STJ":   # sem o PDF: a página da edição
                    t = pagina("https://processo.stj.jus.br/jurisprudencia/externo/informativo/"
                               f"?acao=pesquisarumaedicao&livre={n:04d}.cod.")
                    blocos = ie.blocos_de_html(t)
                else:
                    raise Falha("o PDF não abriu (ponha o PDF em informativos/pdf/ e rode de novo)")
                itens = ie.extrair(org, n, blocos)
                if not itens:
                    dbg = PASTA_INF / "debug"
                    dbg.mkdir(exist_ok=True)
                    (dbg / f"{org}-{n}.txt").write_text("\n\n".join(blocos)[:60000], encoding="utf-8")
            except (Falha, RuntimeError) as e:
                print(f"  {org} nº {n}: {e}")
                falhas.append(chave)
                continue
            if not itens:
                lidas.setdefault("tentativas", {})[chave] = lidas.get("tentativas", {}).get(chave, 0) + 1
                print(f"  {org} nº {n}: nenhum julgado reconhecido (tentativa {lidas['tentativas'][chave]}/3)")
                if lidas["tentativas"][chave] >= 3:
                    lidas.setdefault(org, {})[str(n)] = 0
                continue
            ids = ie.acrescentar(itens)
            lidas.setdefault(org, {})[str(n)] = len(ids)
            print(f"  {org} nº {n}: {len(itens)} julgado(s) lido(s), {len(ids)} novo(s) no Diário das Decisões")
            feitas.append({"edicao": n, "data": "", "ano": f"{org} · {len(ids)} julgado(s)"})
    lidas_f.write_text(json.dumps(lidas, ensure_ascii=False, indent=1), encoding="utf-8")
    if falhas:
        raise Falha("não consegui ler: " + ", ".join(falhas)
                    + " — o que deu certo foi gravado; para estes, baixe o PDF e ponha em informativos/pdf/")
    return feitas


def cobrancas_informativos(dados):
    """Cruza os julgados novos dos informativos com as provas (scripts/cobrancas_informativos.py).
    Precisa da pasta Provas do Mac: o caminho fica em provas/pasta-das-provas.txt."""
    f = RAIZ / "provas" / "pasta-das-provas.txt"
    pasta = os.environ.get("PROVAS_PASTA") or (f.read_text(encoding="utf-8").strip() if f.exists() else "")
    if not pasta or not os.path.isdir(os.path.expanduser(pasta)):
        print("  (pasta das provas não informada: o cruzamento com as provas fica para depois — "
              "o 'Atualizar Informativos.command' pergunta o caminho na próxima vez)")
        return []
    r = subprocess.run([sys.executable, str(RAIZ / "scripts" / "cobrancas_informativos.py"), os.path.expanduser(pasta)])
    if r.returncode:
        raise Falha("o cruzamento com as provas falhou (veja a mensagem acima)")
    return []


TRIBUNAIS = [("STF", stf), ("STF-PV", stf_pv), ("STJ", stj), ("STJ-EXTRA", stj_extra), ("STJ-BOLETIM", stj_boletim), ("CARDS", cards_informativos), ("COBRANCAS", cobrancas_informativos), ("TSE", tse), ("CNJ", cnj), ("TST", tst), ("CNMP", cnmp),
             ("TESES", teses), ("LEIS", leis)]


# Tempo máximo de cada parte (segundos); Control-C na janela pula só a parte
# que está rodando. Um site pendurado (ex.: JusLaboris
# lento, Chrome esperando uma página que não termina) não trava o resto:
# a parte é interrompida, aparece como ERRO no Resumo e as outras seguem.
LIMITE = {"TESES": 1800, "LEIS": 2400, "CARDS": 1200, "COBRANCAS": 1800}
LIMITE_PADRAO = 300


class Estourou(BaseException):
    """Tempo esgotado. BaseException para não ser engolida por "except Exception"
    ou "except Falha" dentro das funções dos tribunais."""


def _estourou(signum, frame):
    raise Estourou()


def main(so=None, tudo=False):
    dados = Dados(ARQUIVO)
    dados.teses_mudou = False
    dados.leis_mudou = False
    resumo, falhas = [], []
    for nome, funcao in TRIBUNAIS:
        if so and nome not in so:
            continue
        print(f"\n=== {nome}")
        limite = None if (nome == "TESES" and tudo) else LIMITE.get(nome, LIMITE_PADRAO)
        tem_alarme = hasattr(signal, "SIGALRM") and limite
        if tem_alarme:
            signal.signal(signal.SIGALRM, _estourou)
            signal.alarm(limite)
        try:
            novas = funcao(dados, tudo=tudo) if nome == "TESES" else funcao(dados)
        except Estourou:
            msg = (f"passou de {limite // 60} minutos sem terminar — o site deve estar lento "
                   "ou fora do ar; pulei e segui com os outros")
            print(f"  ERRO: {msg}")
            falhas.append(nome)
            resumo.append(f"  {nome}: ERRO — {msg}")
            continue
        except KeyboardInterrupt:
            msg = "interrompido por você (Control-C); pulei e segui com os outros"
            print(f"\n  {msg}")
            falhas.append(nome)
            resumo.append(f"  {nome}: {msg}")
            continue
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
        finally:
            if tem_alarme:
                signal.alarm(0)
        if nome == "LEIS":
            resumo.append("  LEIS: " + ("; ".join(n["edicao"] for n in novas) if novas
                                        else "nenhuma lei monitorada mudou"))
            continue
        if novas and nome == "TESES":
            resumo.append(f"  TESES (STJ): {len(novas)} edição(ões) lida(s) — "
                          + ", ".join(f"n. {n['edicao']}" for n in novas))
        elif novas:
            lista = ", ".join(f"nº {n['edicao']} ({n['data'] or n.get('ano')})"
                              for n in sorted(novas, key=lambda n: (n["data"] or "", n["edicao"])))
            resumo.append(f"  {nome}: {len(novas)} nova(s) — {lista}")
        else:
            resumo.append(f"  {nome}: nada novo")
    dados.gravar()
    print("\n=== Resumo")
    print("\n".join(resumo))
    if dados.mudou:
        print("\nEdições novas gravadas em diario-data.js (súmula: a confirmar).")
    if dados.leis_mudou:
        print("Leis monitoradas: registro gravado em leis/alteracoes.json (avisos no Meu Progresso).")
    if dados.teses_mudou:
        print("Teses do STJ gravadas em stj/teses.json (Diário das Decisões).")
    if falhas:
        print(f"\nATENÇÃO: {', '.join(falhas)} falhou(aram) — essa parte ficou como estava.")
        return 1
    return 0


if __name__ == "__main__":
    # Opcional: só alguns, ex.: python3 scripts/atualizar_informativos.py STJ TESES
    # "--tudo": lê de uma vez todas as edições da Jurisprudência em Teses.
    args = [a for a in sys.argv[1:] if a != "--tudo"]
    sys.exit(main({a.upper() for a in args} or None, tudo="--tudo" in sys.argv[1:]))
