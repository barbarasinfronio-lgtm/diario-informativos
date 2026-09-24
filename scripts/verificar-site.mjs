const ORIGIN = 'https://www.estudamana.com.br';
const pages = (process.env.PAGES || '').split(',').filter(Boolean);
for (const slug of pages) {
  const url = `${ORIGIN}/p/${slug}.html`;
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36', 'Accept-Language': 'pt-BR,pt;q=0.9' } });
  const html = await res.text();
  if (res.status === 429) { await new Promise(r => setTimeout(r, 8000)); continue; }
  console.log('\n==== ' + url + ' status=' + res.status + ' len=' + html.length);
  const marks = ['account-panel', 'cg-box', 'Entrar com Google', 'avatar-toggle', 'avatar-panel',
    'my-prizes', 'list-root', 'org-tabs', 'meus-grupos', 'ContaGoogle', 'ContaEmail',
    'conta-google.js', 'conta-email.js', 'grupos-shared.js', 'editais-shared.js',
    'DIARIO_FIREBASE_CONFIG', 'select-edital', 'grid-leis-federais'];
  for (const m of marks) {
    console.log((html.includes(m) ? 'SIM ' : 'nao ') + m);
  }
}
