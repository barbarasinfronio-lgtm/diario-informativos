#!/usr/bin/env python3
"""
atualizar_informativos_stf.py — verifica e ACRESCENTA os novos Informativos
do STF em diario-data.js (lista STF_DATA).

Roda no Mac, só quando a Barbara abre "Atualizar Informativos STF.command"
(na raiz do repositório), uma vez por semana. NÃO tem agendamento.

Por que no Mac: o site do STF responde 403 (proibido) a qualquer acesso vindo
dos servidores do GitHub, até para edições que existem (testado em
28/09/2026), igual ao TST. Por isso o robô antigo do GitHub nunca achava
nada. Além disso, o servidor do STF manda o certificado HTTPS sem o
intermediário da cadeia; navegadores completam sozinhos, o Python não. Este
script completa a cadeia (baixa o intermediário do endereço indicado no
próprio certificado) e continua verificando tudo normalmente.

Como funciona:
  1. Lê o último número registrado em STF_DATA (o primeiro da lista).
  2. Confere o acesso abrindo essa edição, que com certeza existe. Se nem
     ela abre, para com ERRO (o STF responde 403 também para edição que
     ainda não saiu, então sem esse controle não dá para distinguir
     "não saiu" de "bloqueado").
  3. Confere os números seguintes, um a um, até achar um que não saiu.
     A data vem do cabeçalho da página da edição ("Brasília, 21 de setembro
     de 2026"); se não achar, usa a data de hoje.
  4. Cada edição nova entra como { edicao, ano, data, sumula: null }
     ("sumula: null" = "a confirmar", conferido à mão depois).

Uso:  python3 scripts/atualizar_informativos_stf.py
Sai com código 0 (deu certo, com ou sem novidade) ou 1 (erro).
"""
import os
import re
import socket
import ssl
import subprocess
import sys
import unicodedata
import urllib.error
import urllib.request
from datetime import datetime, timedelta, timezone

RAIZ = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ARQUIVO = os.path.join(RAIZ, "diario-data.js")
HOST = "www.stf.jus.br"
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/128.0 Safari/537.36")
# Intermediário usado pelo STF em 09/2026 (AIA do certificado). Só é usado se
# não der para descobrir o endereço pelo próprio certificado.
INTERMEDIARIO_PADRAO = "http://secure.globalsign.com/cacert/gsgccr6alphasslca2025.crt"
MESES = ["jan", "fev", "mar", "abr", "mai", "jun",
         "jul", "ago", "set", "out", "nov", "dez"]


def url_html(n):
    return f"https://{HOST}/arquivo/informativo/documento/informativo{n}.htm"


def url_pdf(n):
    return (f"https://{HOST}/arquivo/cms/informativoSTF/anexo/Informativo_PDF/"
            f"Informativo_stf_{n}.pdf")


# ---------------------------------------------------------------- HTTPS

def _contexto_padrao():
    ctx = ssl.create_default_context()
    try:  # Python do python.org no Mac às vezes vem sem as raízes do sistema
        import certifi
        ctx.load_verify_locations(certifi.where())
    except ImportError:
        pass
    return ctx


def _endereco_intermediario():
    """Lê o endereço 'CA Issuers' do certificado do STF (via openssl)."""
    try:
        cert = ssl.get_server_certificate((HOST, 443), timeout=30)
        texto = subprocess.run(["openssl", "x509", "-noout", "-text"],
                               input=cert, capture_output=True, text=True,
                               timeout=30).stdout
        m = re.search(r"CA Issuers - URI:(\S+)", texto)
        if m:
            return m.group(1)
    except Exception:
        pass
    return INTERMEDIARIO_PADRAO


def _contexto_com_intermediario():
    endereco = _endereco_intermediario()
    print(f"  (completando a cadeia de certificados do STF com {endereco})")
    with urllib.request.urlopen(endereco, timeout=30) as r:
        dados = r.read()
    pem = (dados.decode("ascii") if dados.startswith(b"-----BEGIN")
           else ssl.DER_cert_to_PEM_cert(dados))
    ctx = _contexto_padrao()
    ctx.load_verify_locations(cadata=pem)
    return ctx


_ctx = None


def buscar(url):
    """Devolve (status, content-type, corpo em bytes)."""
    global _ctx
    if _ctx is None:
        _ctx = _contexto_padrao()
    req = urllib.request.Request(url, headers={
        "User-Agent": UA,
        "Accept": "text/html,application/pdf,*/*;q=0.8",
        "Accept-Language": "pt-BR,pt;q=0.9",
    })
    for tentativa in (1, 2, 3):
        try:
            with urllib.request.urlopen(req, context=_ctx, timeout=60) as r:
                return r.status, r.headers.get("Content-Type", ""), r.read()
        except urllib.error.HTTPError as e:
            if e.code >= 500 and tentativa < 3:
                continue
            return e.code, e.headers.get("Content-Type", ""), b""
        except urllib.error.URLError as e:
            if isinstance(e.reason, ssl.SSLCertVerificationError) and tentativa == 1:
                _ctx = _contexto_com_intermediario()
                continue
            if tentativa == 3:
                raise RuntimeError(f"{url} → sem resposta ({e.reason})")
        except (socket.timeout, TimeoutError) as e:
            if tentativa == 3:
                raise RuntimeError(f"{url} → sem resposta ({e})")


# ---------------------------------------------------------------- edições

def texto_de(corpo, tipo):
    if re.search(r"charset=(windows-1252|iso-8859-1|latin-?1)", tipo, re.I):
        return corpo.decode("cp1252", "replace")
    try:
        return corpo.decode("utf-8")
    except UnicodeDecodeError:
        return corpo.decode("cp1252", "replace")


def data_do_cabecalho(texto):
    """'Brasília, 21 de setembro de 2026' → '2026-09-21'."""
    m = re.search(r"Bras\S{0,3}lia,?\s*(\d{1,2})\s+de\s+(\S+)\s+de\s+(\d{4})", texto, re.I)
    if not m:
        return None
    mes = unicodedata.normalize("NFD", m.group(2).lower())
    mes = re.sub(r"[^a-z]", "", mes)[:3]
    if mes not in MESES:
        return None
    return f"{m.group(3)}-{MESES.index(mes) + 1:02d}-{int(m.group(1)):02d}"


def conferir(numero):
    """{'data': ...} se a edição existe; None se não achou (HTML nem PDF)."""
    url = url_html(numero)
    status, tipo, corpo = buscar(url)
    print(f"  HTML {url} → HTTP {status}")
    if status == 200:
        texto = texto_de(corpo, tipo)
        if re.search(rf"N\S{{0,2}}\s*{numero}\b", texto):
            return {"data": data_do_cabecalho(texto)}
        print(f"  (página sem \"Nº {numero}\")")
    url = url_pdf(numero)
    status, tipo, _ = buscar(url)
    print(f"  PDF  {url} → HTTP {status} ({tipo})")
    if status == 200 and re.search(r"pdf|octet-stream", tipo, re.I):
        return {"data": None}
    return None


def hoje():
    return (datetime.now(timezone.utc) - timedelta(hours=3)).strftime("%Y-%m-%d")


def main():
    with open(ARQUIVO, encoding="utf-8") as f:
        conteudo = f.read()
    m = re.search(r"var\s+STF_DATA\s*=\s*\[\s*\{[^}]*edicao:\s*(\d+)", conteudo)
    if not m:
        print(f"ERRO: não achei STF_DATA em {ARQUIVO}.")
        return 1
    ultimo = int(m.group(1))
    print(f"Último Informativo do STF registrado: nº {ultimo}.")

    print(f"Conferindo o acesso com a edição nº {ultimo} (já registrada):")
    if not conferir(ultimo):
        print(f"\nERRO: nem a edição nº {ultimo}, que já saiu, abriu — o site do "
              "STF está recusando o acesso (veja os códigos HTTP acima). "
              "Nada foi gravado.")
        return 1
    print("  → acesso OK.")

    novas = []
    for numero in range(ultimo + 1, ultimo + 21):  # no máximo 20 de uma vez
        print(f"Edição nº {numero}:")
        achou = conferir(numero)
        if not achou:
            print("  → ainda não publicada.")
            break
        data = achou["data"]
        if not data:
            data = hoje()
            print(f"  (data não encontrada na página; usando a de hoje, {data})")
        print(f"  → publicada em {data}.")
        novas.append((numero, data))

    if not novas:
        print(f"\nNenhum Informativo novo do STF. Último continua sendo o nº {ultimo}.")
        return 0

    linhas = "".join(
        f'    {{ edicao: {n}, ano: {d[:4]}, data: "{d}", sumula: null }},\n'
        for n, d in reversed(novas))
    conteudo, trocas = re.subn(r"(var\s+STF_DATA\s*=\s*\[\n)",
                               lambda mm: mm.group(1) + linhas, conteudo, count=1)
    if not trocas:
        print('ERRO: não achei "var STF_DATA = [" — o arquivo mudou de formato?')
        return 1
    with open(ARQUIVO, "w", encoding="utf-8") as f:
        f.write(conteudo)
    print(f"\n{len(novas)} Informativo(s) novo(s) do STF acrescentado(s): "
          + ", ".join(f"nº {n} ({d})" for n, d in novas)
          + ". Súmula: a confirmar.")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as e:  # noqa: BLE001 — qualquer falha vira mensagem clara
        print(f"\nERRO: {e}\nNada foi gravado.")
        sys.exit(1)
