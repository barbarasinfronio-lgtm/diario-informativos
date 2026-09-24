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
const LOCAL = process.env.LOCAL === '1';
console.log('USANDO ARQUIVOS DO BRANCH:', LOCAL);
for (const url of lista) {
  const p = await b.newPage({ viewport: { width: 1200, height: 1400 } });
  const errs = [], fails = [], scripts = [];
  if (LOCAL) await p.route(/cdn\.jsdelivr\.net\/gh\/barbarasinfronio-lgtm\/diario-informativos@main\//, async route => {
    const file = route.request().url().split('@main/')[1].split('?')[0];
    if (!fs.existsSync(file)) return route.continue();
    await route.fulfill({ status: 200, body: fs.readFileSync(file), contentType: file.endsWith('.css') ? 'text/css; charset=utf-8' : 'application/javascript; charset=utf-8' });
  });
  p.on('pageerror', e => errs.push('PAGEERROR ' + e.message));
  p.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text().slice(0, 300)); });
  p.on('requestfailed', r => fails.push(r.url() + ' ' + (r.failure() || {}).errorText));
  p.on('response', r => { const u = r.url(); if (/jsdelivr|githack|github/.test(u)) scripts.push(r.status() + ' ' + u); if (r.status() >= 400) fails.push(r.status() + ' ' + u); });
  try { await p.goto(url, { waitUntil: 'load', timeout: 45000 }); } catch (e) { errs.push('GOTO ' + e.message); }
  await p.waitForTimeout(6000);
  const info = await p.evaluate(() => {
    const txt = document.body.innerText;
    return {
      carregando: (txt.match(/Carregando[^\n]*/g) || []).slice(0, 5),
      header: !!document.querySelector('[data-em-header]'),
      headerCss: !!document.querySelector('[data-em-header-css]'),
      fontBtns: !!document.querySelector('.em-font'),
      scriptsInline: [...document.scripts].filter(s => !s.src).map(s => s.textContent.slice(0, 200).replace(/\s+/g, ' ')).filter(t => /jsdelivr|fetch|estudamana|leis|diario/i.test(t)).slice(0, 6),
      scriptSrcs: [...document.scripts].map(s => (s.type ? s.type + ' ' : '') + s.src).filter(s => s.trim() && !/blogger|google|gstatic/.test(s)),
      inicio: txt.slice(0, 900).replace(/\s+/g, ' ')
    };
  });
  const slug = url.replace(/^.*\//, '').replace('.html', '');
  await p.screenshot({ path: `prints/${slug}.png`, fullPage: false });
  console.log('\n==== ' + url);
  console.log(JSON.stringify(info, null, 1));
  console.log('RECURSOS', [...new Set(scripts)].join('\n  '));
  console.log('ERROS', errs.join('\n  ') || '-');
  console.log('FALHAS', [...new Set(fails)].filter(f => !/google|doubleclick|blogger\.com\/img/.test(f)).join('\n  ') || '-');
  await p.close();
  await new Promise(r => setTimeout(r, 60000));
}
await b.close();
