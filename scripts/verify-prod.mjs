import puppeteer from 'puppeteer';
const URL = 'https://portfolio-ops-sakets-projects-260aa991.vercel.app';
const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const problems = [];
page.on('console', m => { if (m.type() === 'error') problems.push('CONSOLE: ' + m.text().slice(0, 200)); });
page.on('pageerror', e => problems.push('PAGEERROR: ' + e.message.slice(0, 200)));
page.on('requestfailed', r => problems.push('REQFAIL: ' + r.url().split('/').pop()));

await page.goto(URL, { waitUntil: 'networkidle0', timeout: 90000 });
await new Promise(r => setTimeout(r, 5000));

// boot
const boot = await page.evaluate(() => ({
  ready: document.body.innerText.includes('SYSTEM READY'),
  enter: document.body.innerText.includes('ENTER THE SYSTEM'),
}));
console.log('BOOT:', JSON.stringify(boot));

// enter
const btn = await page.evaluateHandle(() => [...document.querySelectorAll('button')].find(x => x.textContent.includes('ENTER THE SYSTEM')));
const el = btn.asElement();
const box = await el.boundingBox();
await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
await new Promise(r => setTimeout(r, 6000));

const world = await page.evaluate(() => ({
  canvas: !!document.querySelector('canvas'),
  hud: document.body.innerText.includes('COMMAND CENTER'),
  minimap: document.body.innerText.includes('TACTICAL MAP'),
}));
console.log('WORLD:', JSON.stringify(world));
await page.screenshot({ path: 'shots/PROD_entry.png' });

// journey to comms
await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
await new Promise(r => setTimeout(r, 5000));
const comms = await page.evaluate(() => ({
  loc: (document.body.innerText.match(/LOCATION\n([^\n]*)/) || [])[1] || 'n/a',
  crashed: document.body.innerText.includes('client-side exception'),
}));
console.log('END OF JOURNEY:', JSON.stringify(comms));
await page.screenshot({ path: 'shots/PROD_comms.png' });

// dossier via directory
await page.evaluate(() => {
  const d = [...document.querySelectorAll('button')].find(b => b.textContent.includes('MISSION DIRECTORY'));
  d && d.click();
});
await new Promise(r => setTimeout(r, 800));
await page.evaluate(() => {
  const row = [...document.querySelectorAll('button')].find(b => b.textContent.includes('YAMUNA'));
  row && row.click();
});
await new Promise(r => setTimeout(r, 1200));
const dossier = await page.evaluate(() => ({
  open: document.body.innerText.includes('OBJECTIVE'),
  demo: !!document.querySelector('[role="dialog"] a[href*="yamuna"]'),
  gh: !!document.querySelector('[role="dialog"] a[href*="github.com/saketkumar-18"]'),
}));
console.log('DOSSIER (Yamuna):', JSON.stringify(dossier));

// verify ALL external links on the page resolve (HEAD)
const links = await page.evaluate(() =>
  [...document.querySelectorAll('a[href^="http"]')].map(a => a.href)
);
const uniq = [...new Set(links)];
let bad = [];
for (const u of uniq) {
  try {
    const res = await page.evaluate(async (url) => {
      const r = await fetch(url, { method: 'HEAD', mode: 'no-cors' });
      return r.status || 200;
    }, u);
  } catch {
    // no-cors HEAD often throws; do GET via node below instead
  }
}
console.log('external links found:', uniq.length);

console.log('=== PROBLEMS ===');
console.log(problems.length ? problems.join('\n') : 'NONE');
await browser.close();

// node-side link check (follow redirects, accept 2xx/3xx)
import https from 'https';
import http from 'http';
for (const u of uniq) {
  const code = await new Promise((resolve) => {
    const lib = u.startsWith('https') ? https : http;
    const req = lib.get(u, { headers: { 'user-agent': 'Mozilla/5.0' }, timeout: 15000 }, (res) => {
      resolve(res.statusCode);
      req.destroy();
    });
    req.on('error', () => resolve('ERR'));
    req.on('timeout', () => { req.destroy(); resolve('TIMEOUT'); });
  });
  if (String(code).startsWith('2') || String(code).startsWith('3')) console.log('OK', code, u);
  else { console.log('BAD', code, u); bad.push(u); }
}
console.log(bad.length === 0 ? 'ALL LINKS OK' : 'BROKEN: ' + bad.join(', '));
