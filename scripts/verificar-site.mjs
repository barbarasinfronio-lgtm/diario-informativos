import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage();
const errs = [];
p.on('pageerror', e => errs.push(e.message));
try {
  const res = await p.goto('https://www4.planalto.gov.br/legislacao/portal-legis/resenha-diaria', { waitUntil: 'load', timeout: 30000 });
  console.log('STATUS', res ? res.status() : 'sem resposta');
} catch (e) {
  console.log('ERRO NAVEGACAO', e.message);
}
await p.waitForTimeout(2000);
const html = await p.content().catch(() => '');
console.log('LEN', html.length);
console.log('--- <link> tags ---');
console.log((html.match(/<link[^>]*>/gi) || []).join('\n'));
console.log('--- mencoes a rss/xml/atom ---');
console.log([...new Set(html.match(/[^"'>]*\.(rss|xml|atom)[^"'<]*/gi) || [])].slice(0, 30).join('\n'));
console.log('--- trecho perto de "resenha" ---');
const idx = html.toLowerCase().indexOf('resenha');
console.log(html.slice(Math.max(0, idx - 200), idx + 3000));
console.log('erros JS', errs);
await b.close();
