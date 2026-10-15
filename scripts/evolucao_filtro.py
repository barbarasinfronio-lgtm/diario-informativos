"""Filtro de precisão para os candidatos do minerador: só fica o que AFIRMA uma mudança (e não o que a nega ou cita súmula 691)."""
import re
POS = re.compile(r"modificou (?:o |seu |a )?(?:seu )?(?:entendimento|posicionamento|orienta)|alterou (?:o |seu |a )?(?:seu )?(?:entendimento|posicionamento|orienta|jurisprud)|superou (?:o |seu |a )?(?:seu )?(?:entendimento|posicionamento|orienta|jurisprud|precedente)|mudan[çc]a (?:de|do) (?:posicionamento|entendimento|orienta[çc][ãa]o) (?:desta|da|do|deste)|(?:revis[ãa]o|supera[çc][ãa]o|cancelamento) d[aoe] (?:tema|s[úu]mula|tese|entendimento|jurisprud[êe]ncia|precedente)|passou a (?:entender|adotar|admitir|reconhecer|decidir|exigir)|em adequa[çc][ãa]o (?:ao|à)|adequa[çc][ãa]o (?:ao|da jurisprud|à jurisprud)|virada jurisprudencial|viragem jurisprudencial|overruling|novo entendimento|nova orienta[çc][ãa]o|evolu[çc][ãa]o jurisprudencial|retrata[çc][ãa]o|reviu (?:o |seu )?(?:seu )?entendimento|abandon(?:ou|ando|o) (?:o |seu )?(?:entendimento|posicionamento)", re.I)
NEG = re.compile(r"691|n[ãa]o (?:h[áa]|houve|ocorreu|trouxe|apresentou|trouxeram|demonstr\w+|se justifica|prosperam?)[^.]{0,80}(?:supera|altera|modifica|mudan|revis|overruling)|sem (?:qualquer )?(?:supera|altera|modifica|mudan)|aus[êe]ncia de (?:supera|altera|modifica|mudan|argumento)|n[ãa]o [ée] caso de (?:supera|revis|distin)|inexist[êe]ncia de|argumento id[ôo]neo|n[ãa]o (?:vislumbro|vejo) (?:supera|raz[ãa]o)|reexame|s[úu]mula 7\\b|s[úu]mula 83|supera[çc][ãa]o do (?:óbice|obst[áa]culo)|pretens[ãa]o de (?:supera|revis)|overruling n[ãa]o configurado|rejeit(?:ou|ada) a proposta de (?:cancelamento|revis)", re.I)


def afirma_mudanca(cand):
    t = " ".join(x["trecho"] for x in cand["trechos"][:4])
    return bool(POS.search(t)) and not NEG.search(t)
