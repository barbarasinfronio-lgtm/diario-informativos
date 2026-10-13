#!/usr/bin/env python3
"""Monta o catálogo de provas (magistratura e defensoria, 2016-2026) e cruza com provas/cobrancas.json.

Uso: python3 scripts/catalogo_provas.py <pasta do repositório>
Gera provas/catalogo-provas.json e provas/CATALOGO-PROVAS.md
"""
import json, sys, collections

REPO = sys.argv[1]
db = json.load(open(REPO + '/provas/cobrancas.json'))['provas']
ET = {'objetiva': 'obj', 'discursiva': 'disc', 'sentença': 'sent', 'oral': 'oral'}
have = collections.defaultdict(set)
for p in db:
    have[(p['orgao'], p['ano'])].add(ET.get(p['etapa'], p['etapa']))

CEB = lambda s: 'https://www.cebraspe.org.br/concursos/' + s
FGV = lambda s: 'https://conhecimento.fgv.br/concursos/' + s
FCC = lambda s: 'https://www.concursosfcc.com.br/concursos/%s/index.html' % s
VUN = lambda s: 'https://www.vunesp.com.br/' + s
PCI = lambda s: 'https://www.pciconcursos.com.br/provas/' + s
OD = 'obj,disc'
ODS = 'obj,disc,sent'
E = []


def add(cargo, orgao, conc, banca, years, url, exp, obs=''):
    E.append(dict(cargo=cargo, orgao=orgao, concurso=conc, banca=banca, anos_banco=years, url=url, esperado=exp, obs=obs))


ME, MF, DP = 'Magistratura estadual', 'Magistratura federal', 'Defensoria Pública'

# ---- Magistratura estadual
for n, y, c in [('187º', ['2017'], 'TJSP1702'), ('188º', ['2018'], 'TJSP1801'), ('189º', ['2021'], 'TJSP2102'),
                ('190º', ['2023'], 'TJSP2202'), ('191º', ['2024'], 'TJSP2402'), ('192º', ['2025', '2026'], 'TJSP2502')]:
    add(ME, 'TJSP', n + ' concurso', 'VUNESP', y, VUN(c), ODS, 'Provas na área do candidato (exige login)')
add(ME, 'TJRJ', '48º concurso (2019)', 'VUNESP', ['2019'], VUN('TJRJ1901'), ODS)
add(ME, 'TJRJ', '49º concurso (2022/23)', 'VUNESP', ['2023'], VUN('TJRJ2202'), ODS)
add(ME, 'TJRJ', 'L concurso (2024/25)', 'VUNESP', ['2024', '2025'], VUN('TJRJ2401'), ODS, 'Conferir: o "TJRJ 2026" do banco pode ser este')
add(ME, 'TJRJ', 'LI concurso (2025/26)', 'VUNESP', ['2026'], VUN('TJRJ2503'), ODS)
add(ME, 'TJMT', '2018', 'VUNESP', ['2018'], VUN('TJMT1801'), ODS, 'Há também TJMT1901 (2ª fase)')
add(ME, 'TJMT', '2024', 'FGV', ['2024'], FGV('tjmtjuiz24'), ODS)
add(ME, 'TJAC', '2018/19', 'VUNESP', ['2019'], VUN('TJAC1801'), ODS)
add(ME, 'TJRO', 'XX concurso (2017)', 'VUNESP', ['2017', '2018', '2019'], VUN('TJRO1701'), ODS, 'Conferir se o "TJRO 2019" do banco é este')
add(ME, 'TJRO', '2021 (3ª a 5ª etapas)', 'VUNESP', ['2021', '2022'], VUN('TJRO2105'), 'n/c', 'Conferir se há concurso novo de juiz')
add(ME, 'TJMG', '2021/22', 'FGV', ['2022'], FGV('tjmg21'), ODS)
add(ME, 'TJMG', '2018 (edital 01/2018)', 'CONSULPLAN', ['2018'], '', ODS, 'Página da banca não localizada')
add(ME, 'TJMG', '2026', 'CONSULPLAN', ['2026'], '', 'andamento', 'Obj em 28/06/2026')
add(ME, 'TJPR', '2016/17', 'CEBRASPE', ['2016'], CEB('TJ_PR_16_JUIZ'), ODS)
add(ME, 'TJPR', '2018', 'CEBRASPE', ['2018'], CEB('TJ_PR_18_JUIZ'), ODS)
add(ME, 'TJPR', '2021', 'FGV', ['2021'], '', ODS)
add(ME, 'TJPR', '2023', 'FGV', ['2023'], '', ODS)
add(ME, 'TJPR', '2025/26', 'FGV', ['2025', '2026'], FGV('tjpr25'), ODS)
add(ME, 'TJPE', '2022', 'FGV', ['2022'], FGV('tjpe22'), ODS)
add(ME, 'TJPE', '2024', 'FGV', ['2024'], FGV('tjpe24'), ODS)
add(ME, 'TJPE', '2026', 'FGV', ['2026'], FGV('tjpe26'), 'andamento')
add(ME, 'TJRS', '2015', 'FAURGS', ['2015'], '', ODS)
add(ME, 'TJRS', 'edital 2019 (aplicado 2022)', 'FAURGS', ['2022'], '', ODS)
add(ME, 'TJRS', '2026', 'FGV', ['2026'], FGV('tjrsjuiz26'), 'andamento', 'Obj prevista 13/12/2026')
add(ME, 'TJSC', '2016/17', 'FCC', ['2016', '2017'], FCC('tjusc116'), ODS)
add(ME, 'TJSC', '2019', 'CEBRASPE', ['2019'], CEB('TJ_SC_19_JUIZ'), ODS)
add(ME, 'TJSC', '2022', 'FGV', ['2022'], FGV('tjscjuiz22'), ODS)
add(ME, 'TJSC', '2023', 'FGV', ['2023'], '', ODS)
add(ME, 'TJSC', '2024', 'FGV', ['2024'], FGV('tjscjuiz24'), ODS)
add(ME, 'TJSC', '2025', 'FGV', ['2025'], FGV('tjscjuiz25'), ODS)
add(ME, 'TJMS', 'edital 2018 (aplicado 2019/21)', 'FCC', ['2018', '2019', '2021'], FCC('tjums118'), ODS)
add(ME, 'TJMS', '2023', 'FGV', ['2023'], FGV('tjmsjuiz23'), ODS)
add(ME, 'TJMS', '2025/26 (34º)', 'FGV', ['2025', '2026'], FGV('tjmsjuiz25'), ODS, 'Página já traz prova objetiva, discursiva e sentença')
add(ME, 'TJES', '2023', 'FGV', ['2023'], FGV('tjes23'), ODS)
add(ME, 'TJAL', '2019', 'FCC', ['2019'], FCC('tjual119'), ODS)
add(ME, 'TJSE', '2014/15', 'FCC', ['2015'], FCC('tjuse114'), ODS)
add(ME, 'TJSE', '2024/25', 'FGV', ['2025'], FGV('tjse24'), ODS)
add(ME, 'TJGO', 'edital 2019 (aplicado 2022)', 'FCC', ['2022'], FCC('tjugo119'), ODS, 'Objetiva do banco está com 0 questões lidas')
add(ME, 'TJGO', '2023', 'FGV', ['2023'], '', ODS)
add(ME, 'TJGO', '2026', 'FGV', ['2026'], '', ODS)
add(ME, 'TJAM', '2015/16', 'CEBRASPE', ['2015'], CEB('TJ_AM_15_JUIZ'), ODS, 'Página arquivada (sem lista de provas)')
add(ME, 'TJAM', '2024/25', 'FGV', ['2025'], FGV('tjam24'), ODS, 'Página da FGV não lista caderno da objetiva')
add(ME, 'TJAP', '2021/22', 'FGV', ['2022'], FGV('tjap21'), ODS)
add(ME, 'TJAP', '2026', 'FGV', ['2026'], FGV('tjap26'), 'andamento')
add(ME, 'TJBA', '2018/19', 'CEBRASPE', ['2019'], CEB('TJ_BA_18_JUIZ'), ODS)
add(ME, 'TJBA', '2026', 'FGV', ['2026'], '', ODS)
add(ME, 'TJCE', '2018', 'CEBRASPE', ['2018'], CEB('TJ_CE_18_JUIZ'), ODS)
add(ME, 'TJCE', '2025', 'FGV', ['2025'], FGV('tjce25'), ODS)
add(ME, 'TJDFT', '2015', 'CEBRASPE', ['2015'], CEB('TJDFT_15_JUIZ'), ODS, 'Há duas edições em 2015 (_JUIZ e _JUIZ_2)')
add(ME, 'TJDFT', '2022/23', 'CEBRASPE', ['2023'], CEB('TJDFT_22_JUIZ'), ODS)
add(ME, 'TJMA', '2022', 'CEBRASPE', ['2022'], CEB('TJ_MA_22_JUIZ'), ODS)
add(ME, 'TJPA', '2019/20', 'CEBRASPE', ['2019'], CEB('TJ_PA_19_JUIZ'), ODS)
add(ME, 'TJPA', '2026', 'FGV', ['2026'], '', ODS)
add(ME, 'TJPB', '2015', 'CEBRASPE', ['2015'], CEB('TJ_PB_15_JUIZ'), ODS, 'Página arquivada')
add(ME, 'TJTO', '2025', 'FGV', ['2025'], FGV('tjto25'), ODS)
add(ME, 'TJPI', '2014/16', 'FCC', [], FCC('tjupi114'), 'n/c', 'Conferir se a prova caiu em 2016')
add(ME, 'TJRR', '2014/15', 'FCC', [], FCC('tjurr114'), 'n/c', 'Provável aplicação em 2015 (fora da janela)')

# ---- Magistratura federal
add(MF, 'TRF1', '2015/16', 'CEBRASPE', ['2015', '2016'], CEB('TRF1_15_JUIZ'), ODS, 'Página arquivada')
add(MF, 'TRF1', '2025/26', 'FGV', ['2025'], FGV('trf1juiz25'), ODS, 'PCI também cita TRF1 2023 (FGV): conferir')
add(MF, 'TRF2', '2019', 'IBFC', ['2019'], PCI('trf2'), 'obj', 'Só objetiva citada no PCI')
add(MF, 'TRF2', '2026', 'FGV', ['2026'], '', ODS)
add(MF, 'TRF3', '2025', 'FGV', ['2025'], FGV('trf3juiz'), ODS)
add(MF, 'TRF4', '2016', 'TRF4', ['2016'], PCI('trf-4'), 'obj', 'Só objetiva citada no PCI')
add(MF, 'TRF4', '2022', 'TRF4', ['2022'], '', ODS)
add(MF, 'TRF5', '2017', 'CEBRASPE', ['2017'], CEB('TRF5_17_JUIZ'), OD)
add(MF, 'TRF5', '2025 (XV)', 'FGV', ['2025'], FGV('trf5juiz'), ODS)
add(MF, 'TRF5', '2026 (XVI)', 'FGV', ['2026'], FGV('trf5juiz26'), 'andamento')
add(MF, 'TRF6', '2025/26', 'FGV', ['2025', '2026'], FGV('trf6'), ODS, 'Página já traz discursiva e sentença')

# ---- Defensoria
add(DP, 'DPDF', '2019', 'CEBRASPE', ['2019'], CEB('DP_DF_19_DEFENSOR'), OD, 'Objetiva do banco está com 0 questões lidas')
for o, y, s, a in [('DPE-PI', '2021/22', 'DPE_PI_21', ['2022']), ('DPE-RO', '2022/23', 'DPE_RO_22_DEFENSOR', ['2023']),
                   ('DPE-RS', '2021', 'DPE_RS_21_DEFENSOR', ['2021']), ('DPE-SE', '2021/22', 'DPE_SE_21', ['2022']),
                   ('DPE-TO', '2021/22', 'DPE_TO_21_DEFENSOR', ['2022']), ('DPE-AC', '2024', 'DPE_AC_24_DEFENSOR', ['2024']),
                   ('DPE-AC', '2017', 'DPE_AC_17_DEFENSOR', ['2017']), ('DPE-AL', '2017', 'DPE_AL_17_DEFENSOR', ['2017']),
                   ('DPE-PA', '2021/22', 'DPE_PA_21_DEFENSOR', ['2022']), ('DPE-PE', '2017/18', 'DPE_PE_17_DEFENSOR', ['2017', '2018']),
                   ('DPU', '2017', 'DPU_17_DEFENSOR', ['2017'])]:
    add(DP, o, y, 'CEBRASPE', a, CEB(s), OD)
for o, y, s, a, ex in [('DPE-RJ', '2018', 'dpgerj2018', ['2018'], OD), ('DPE-RJ', '2021', 'dpgerj2021', ['2021'], OD),
                       ('DPE-RJ', '2026', 'dperj2026', ['2026'], 'andamento'), ('DPE-MS', '2021/22', 'dpgems21', ['2021', '2022'], OD),
                       ('DPE-RO', '2025', 'dpero25', ['2025'], OD), ('DPE-PE', '2025', 'dpe-pe', ['2025'], OD)]:
    add(DP, o, y, 'FGV', a, FGV(s), ex)
add(DP, 'DPE-PB', '2025', 'FGV', ['2025'], PCI('dpe-pb'), OD, 'Citado no PCI; página da FGV não localizada')
for o, y, c, a, ex in [('DPE-BA', '2016', 'dpeba116', ['2016'], OD), ('DPE-BA', '2020', 'dpeba120', ['2020'], OD),
                       ('DPE-BA', '2025/26', 'dpeba125', ['2025', '2026'], 'andamento'), ('DPE-PB', '2021', 'dpepb121', ['2021'], OD),
                       ('DPE-PB', '2026', 'dpepb126', ['2026'], 'andamento'), ('DPE-GO', '2019', 'dpego119', ['2019'], OD),
                       ('DPE-MT', '2021', 'dpemt221', ['2021'], OD), ('DPE-MT', '2025/26', 'dpemt125', ['2025', '2026'], 'andamento'),
                       ('DPE-RR', '2019', 'dperr119', ['2019'], OD), ('DPE-SC', '2021', 'dpesc121', ['2021'], OD),
                       ('DPE-SP', '2018 (VIII)', 'dpesp118', ['2018'], OD), ('DPE-SP', '2022 (IX)', 'dpesp222', ['2022'], OD),
                       ('DPE-SP', '2024', 'dpesp124', ['2024'], OD), ('DPE-AP', '2017', 'dpeap117', ['2017'], OD),
                       ('DPE-AP', '2022', 'dpeap122', ['2022'], OD), ('DPE-AM', '2017', 'dpeam217', ['2017'], OD),
                       ('DPE-AM', '2021', 'dpeam121', ['2021'], OD), ('DPE-AM', '2024', 'dpeam224', ['2024'], OD),
                       ('DPE-CE', '2021/22', 'dpece121', ['2021', '2022'], OD), ('DPE-ES', '2021', 'dpees121', ['2021'], OD),
                       ('DPE-MA', '2018', 'dpema118', ['2018'], OD), ('DPE-MA', '2025/26', 'dpema125', ['2025', '2026'], 'andamento'),
                       ('DPE-RS', '2017', 'dpers217', ['2017'], OD), ('DPE-RS', '2024', 'dpers124', ['2024'], OD)]:
    add(DP, o, y, 'FCC', a, FCC(c), ex)
add(DP, 'DPE-SC', '2025/26', 'FUNDATEC', ['2025', '2026'], PCI('dpe-sc'), OD, 'Obj 2026 já temos; demais etapas quando saírem')
add(DP, 'DPE-PR', '2024', 'FUNDATEC', ['2024'], PCI('dpe-pr'), OD, 'Citado no PCI; página da banca não localizada')
add(DP, 'DPE-MG', '2023', 'FUNDEP', ['2023'], PCI('dpe-mg'), OD, 'Citado no PCI; página da banca não localizada')
add(DP, 'DPE-MT', '2016', 'UFMT', ['2016'], PCI('dpe-mt'), OD, 'Citado no PCI; página da banca não localizada')

NAME = {'obj': 'objetiva', 'disc': 'discursiva', 'sent': 'sentença', 'oral': 'oral'}
for e in E:
    got = set()
    for y in e['anos_banco']:
        got |= have.get((e['orgao'], y), set())
    e['temos'] = sorted(got & {'obj', 'disc', 'sent', 'oral'})
    ex = e['esperado']
    if ex == 'n/c':
        e['status'] = 'conferir'
        e['faltam'] = []
    elif ex == 'andamento':
        e['status'] = 'em andamento'
        e['faltam'] = []
    else:
        want = set(ex.split(','))
        miss = sorted(want - got)
        e['faltam'] = miss
        e['status'] = 'completo' if not miss else ('parcial' if got & want else 'ausente')
json.dump(E, open(REPO + '/provas/catalogo-provas.json', 'w'), ensure_ascii=False, indent=1)


def fmt(l):
    return ', '.join(NAME.get(x, x) for x in l) or '—'


c = collections.Counter(e['status'] for e in E)
L = ['# Catálogo de provas de magistratura e defensoria, 2016–2026', '',
     'Gerado em 07/10/2026 a partir das páginas oficiais das bancas (Cebraspe, FGV, FCC, Vunesp), do PCI Concursos e do `provas/cobrancas.json`.',
     'Substitui o `FALTAM-PROVAS.md` (feito antes, sem acesso às páginas das bancas).', '',
     'Como ler: **Temos** = etapas desse concurso que já estão no `cobrancas.json`; **Faltam** = etapas que a banca publicou (ou que a prova normalmente tem) e que ainda não estão lá. '
     '"Página" é a página oficial do concurso, onde ficam os PDFs de prova, gabarito e espelho.', '',
     '**Resumo (%d concursos):** %s' % (len(E), ' · '.join('%s: %d' % (k, v) for k, v in sorted(c.items()))), '']
for cargo in (ME, MF, DP):
    L += ['## ' + cargo, '']
    cur = None
    for e in [x for x in E if x['cargo'] == cargo]:
        if e['orgao'] != cur:
            cur = e['orgao']
            L += ['', '### ' + cur, '', '| Concurso | Banca | Status | Temos | Faltam | Página |', '|---|---|---|---|---|---|']
        pg = '[abrir](%s)' % e['url'] if e['url'] else '—'
        obs = (' — ' + e['obs']) if e['obs'] else ''
        L.append('| %s%s | %s | %s | %s | %s | %s |' % (e['concurso'], obs, e['banca'], e['status'], fmt(e['temos']), fmt(e['faltam']), pg))
    L.append('')
open(REPO + '/provas/CATALOGO-PROVAS.md', 'w').write('\n'.join(L))
print(c)
for k in ('ausente', 'parcial'):
    print(k, [(e['orgao'], e['concurso'], e['faltam']) for e in E if e['status'] == k])
