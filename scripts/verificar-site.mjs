import { chromium } from 'playwright';
import fs from 'fs';
fs.mkdirSync('prints', { recursive: true });
const ORIGIN = 'https://www.estudamana.com.br';
const feed = await (await fetch(ORIGIN + '/feeds/pages/default?alt=json&max-results=100')).json();
const pages = feed.feed.entry.map(e => e.link.find(l => l.rel === 'alternate').href);
const only = (process.env.PAGES || '').split(',').filter(Boolean);
const lista = only.length ? pages.filter(u => only.some(o => u.includes(o))) : pages;
console.log('PAGINAS', lista.length);
const b = await chromium.launch();
for (const url of lista) {
  const p = await b.newPage({ viewport: { width: 1200, height: 1400 } });
  const errs = [], fails = [];
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text().slice(0, 300)); });
  p.on('response', r => { if (r.status() >= 400) fails.push(r.status() + ' ' + r.url()); });
  try { await p.goto(url, { waitUntil: 'load', timeout: 45000 }); } catch (e) { errs.push('GOTO ' + e.message); }
  await p.waitForTimeout(6000);
  const info = await p.evaluate(() => {
    const txt = document.body.innerText;
    return {
      carregando: (txt.match(/Carregando[^\n]*/g) || []).slice(0, 5),
      header: !!document.querySelector('[data-em-header]'),
      inicio: txt.slice(0, 700).replace(/\s+/g, ' ')
    };
  });
  const slug = url.replace(/^.*\//, '').replace('.html', '');
  await p.screenshot({ path: `prints/${slug}.png`, fullPage: true });
  console.log('\n==== ' + url);
  console.log(JSON.stringify(info, null, 1));
  console.log('ERROS', errs.join('\n  ') || '-');
  console.log('FALHAS', [...new Set(fails)].filter(f => !/google|doubleclick/.test(f)).join('\n  ') || '-');
  await p.close();
  await new Promise(r => setTimeout(r, 30000));
}
await b.close();
