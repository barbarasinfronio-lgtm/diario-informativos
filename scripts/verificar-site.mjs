const ORIGIN = 'https://www.estudamana.com.br';
const pages = (process.env.PAGES || '').split(',').filter(Boolean);
for (const slug of pages) {
  const url = `${ORIGIN}/p/${slug}.html`;
  const res = await fetch(url);
  const html = await res.text();
  console.log('\n==== ' + url + ' status=' + res.status + ' len=' + html.length);
  const marks = ['account-panel', 'cg-box', 'Entrar com Google', 'avatar-toggle', 'avatar-panel',
    'my-prizes', 'list-root', 'org-tabs', 'meus-grupos', 'ContaGoogle', 'ContaEmail',
    'conta-google.js', 'conta-email.js', 'grupos-shared.js', 'editais-shared.js',
    'DIARIO_FIREBASE_CONFIG', 'select-edital', 'grid-leis-federais'];
  for (const m of marks) {
    console.log((html.includes(m) ? 'SIM ' : 'nao ') + m);
  }
}
