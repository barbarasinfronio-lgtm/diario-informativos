/* =====================================================================
   fontes-pagina.js — página "Fontes e aviso" (/p/fontes-e-aviso.html)
   De onde vêm os dados de cada Diário + aviso de uso. Para mudar o texto,
   edite a lista FONTES abaixo (cada fonte: nome, endereço e o que vem dela).
   No HTML da página do Blogger basta: <div id="estudamana-fontes"></div>
   ===================================================================== */
(function () {
  var raiz = document.getElementById("estudamana-fontes");
  if (!raiz || raiz.getAttribute("data-pronto")) return;
  raiz.setAttribute("data-pronto", "1");

  var FONTES = [
    {
      titulo: "Supremo Tribunal Federal (STF)",
      itens: [
        ["Portal de dados abertos do STF (Transparência)", "https://transparencia.stf.jus.br", "decisões de controle de constitucionalidade (ADI, ADC, ADO, ADPF), reclamações, omissões inconstitucionais, resumos de decisões e decisões sobre a COVID-19"],
        ["Portal do STF", "https://portal.stf.jus.br", "temas de repercussão geral, súmulas e súmulas vinculantes, informativos de jurisprudência e páginas de cada processo"]
      ]
    },
    {
      titulo: "Superior Tribunal de Justiça (STJ)",
      itens: [
        ["Portal de Dados Abertos do STJ", "https://dadosabertos.web.stj.jus.br", "espelhos dos acórdãos das turmas, seções e Corte Especial (grupo \"Acórdãos STJ\")"],
        ["Pesquisa de jurisprudência do STJ (SCON)", "https://scon.stj.jus.br/SCON/", "recursos repetitivos, IAC, Jurisprudência em Teses, súmulas e informativos de jurisprudência"],
        ["Portal do STJ", "https://www.stj.jus.br", "páginas de cada processo e Boletim de Precedentes"]
      ]
    },
    {
      titulo: "Justiça do Trabalho e Ministério Público do Trabalho",
      itens: [
        ["Jurisprudência do TST", "https://jurisprudencia.tst.jus.br", "orientações jurisprudenciais (OJs), precedentes normativos, temas de IRR e súmulas"],
        ["Juslaboris — Biblioteca Digital do TST", "https://juslaboris.tst.jus.br", "informativos do TST e atos do CSJT"],
        ["MPT / CSMPT", "https://mpt.mp.br", "resoluções do Conselho Superior do Ministério Público do Trabalho"]
      ]
    },
    {
      titulo: "Conselhos e Justiça Eleitoral",
      itens: [
        ["CNJ — Atos normativos", "https://atos.cnj.jus.br", "resoluções, recomendações e provimentos do Conselho Nacional de Justiça; informativos do CNJ"],
        ["CNMP", "https://www.cnmp.mp.br", "resoluções e informativos do Conselho Nacional do Ministério Público"],
        ["TSE e Justiça Eleitoral", "https://www.tse.jus.br", "resoluções e informativos do Tribunal Superior Eleitoral"]
      ]
    },
    {
      titulo: "Legislação",
      itens: [
        ["Portal da Legislação do Planalto", "https://www.planalto.gov.br/legislacao", "Constituição, códigos, leis, decretos-leis e decretos federais (Diário de Leis)"],
        ["LexML Brasil", "https://www.lexml.gov.br", "identificação e links de normas federais e estaduais"],
        ["Assembleias legislativas e sites oficiais dos estados", "", "leis estaduais (constituições estaduais, leis orgânicas, estatutos) — cada lei tem o link do site de onde veio; quando o estado não publica a lei consolidada, usamos compilações como LegisWeb e Leis Estaduais"]
      ]
    },
    {
      titulo: "Súmulas dos tribunais estaduais",
      itens: [
        ["Sites oficiais dos Tribunais de Justiça", "", "súmulas e enunciados de cada TJ, com o link para a página oficial"]
      ]
    },
    {
      titulo: "Editais e provas",
      itens: [
        ["Editais oficiais dos concursos", "", "publicados pelos órgãos (TJs, MPs, Defensorias, Polícias Civis, Procuradorias, TRFs) e pelas bancas (Cebraspe, FGV, FCC, Vunesp, Instituto AOCP, Fundatec, IBADE, entre outras) — o conteúdo programático vem do edital, e só entram as leis citadas expressamente"],
        ["Provas objetivas publicadas pelas bancas", "", "usadas para mostrar onde uma súmula ou decisão já foi cobrada (\"Cobrado em…\")"]
      ]
    }
  ];

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function host(u) { try { return new URL(u).host.replace(/^www\./, ""); } catch (e) { return u; } }

  if (!document.getElementById("em-fontes-css")) {
    var st = document.createElement("style");
    st.id = "em-fontes-css";
    st.textContent =
      ".em-fontes{color:var(--ink,#1c2130);font-family:var(--font-sans,sans-serif);line-height:1.6}" +
      ".em-fontes h2{font:700 calc(19px * var(--fs-scale,1))/1.3 var(--font-serif,Georgia,serif);margin:26px 0 10px}" +
      ".em-fontes p,.em-fontes li{font-size:calc(14.5px * var(--fs-scale,1));text-align:justify;hyphens:auto}" +
      ".em-fontes ul{padding-left:20px;margin:0 0 8px}" +
      ".em-fontes li{margin:6px 0}" +
      ".em-fontes .em-fontes-nome{font-weight:600}" +
      ".em-fontes a{color:var(--accent,#1f3a5f);font-weight:600;word-break:break-word}" +
      ".em-fontes .em-fontes-o-que{color:var(--ink-soft,#4a5064)}" +
      ".em-fontes .em-fontes-aviso{background:var(--surface-2,#efeadd);border-left:4px solid var(--accent,#1f3a5f);border-radius:8px;padding:12px 16px;margin:8px 0 20px}" +
      ".em-fontes .em-fontes-aviso p{margin:6px 0}";
    document.head.appendChild(st);
  }

  raiz.className = (raiz.className ? raiz.className + " " : "") + "em-fontes";
  raiz.innerHTML =
    '<div class="em-fontes-aviso">' +
      "<p><strong>O Estuda Mana não é um site oficial</strong> e não tem ligação com nenhum tribunal, conselho, órgão público ou banca de concurso. " +
      "Reunimos aqui informações públicas para facilitar o estudo.</p>" +
      "<p>Fazemos o possível para manter tudo correto e atualizado, mas pode haver erros, atrasos ou textos desatualizados. " +
      "<strong>Antes de usar em prova, peça ou trabalho, confira sempre na fonte oficial</strong> — cada item tem o botão “Abrir” ou “Fonte oficial” que leva até ela.</p>" +
      "<p>O <strong>risco de cobrança</strong> e as ligações “Cobrado em…” são estimativas automáticas, feitas para orientar o estudo — não são previsão nem opinião jurídica.</p>" +
    "</div>" +
    "<h2>De onde vêm os dados</h2>" +
    "<p>Os dados são coletados das fontes abaixo, em grande parte por robôs que rodam automaticamente e atualizam o site várias vezes por semana.</p>" +
    FONTES.map(function (g) {
      return "<h2>" + esc(g.titulo) + "</h2><ul>" + g.itens.map(function (f) {
        return '<li><span class="em-fontes-nome">' + esc(f[0]) + "</span>" +
          (f[1] ? ' — <a href="' + esc(f[1]) + '" target="_blank" rel="noopener">' + esc(host(f[1])) + "</a>" : "") +
          ': <span class="em-fontes-o-que">' + esc(f[2]) + ".</span></li>";
      }).join("") + "</ul>";
    }).join("") +
    "<h2>Como seus dados são salvos</h2>" +
    "<p>O que você marca no site (leis, súmulas e decisões lidas, revisões, cronograma, prêmios e anotações) fica salvo no próprio navegador do seu aparelho. " +
    "Se você entrar com sua conta, essas marcações também são guardadas na nuvem, vinculadas à sua conta, apenas para que apareçam em qualquer aparelho em que você entrar. " +
    "Esses dados servem somente para o funcionamento do site e para o seu estudo: <strong>não são vendidos, não são usados para publicidade nem para qualquer finalidade comercial</strong>, " +
    "e não são entregues a terceiros. Você pode apagar suas marcações quando quiser.</p>" +
    "<h2>Direitos autorais</h2>" +
    "<p>Textos de leis, decisões judiciais e demais atos oficiais não são protegidos por direito autoral (Lei nº 9.610/1998, art. 8º, IV). " +
    "Os resumos, a organização, os filtros e as ferramentas do site são do Estuda Mana.</p>" +
    "<h2>Encontrou um erro?</h2>" +
    "<p>Avise pelos comentários no fim desta página, dizendo em qual Diário e qual item — corrigimos o quanto antes.</p>";
})();
