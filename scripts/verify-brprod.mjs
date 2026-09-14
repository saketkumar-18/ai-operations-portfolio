import puppeteer from 'puppeteer';
// Full BR flow E2E on PRODUCTION
const URL = 'https://portfolio-ops-kappa.vercel.app';
const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const problems = [];
page.on('console', m => { if (m.type() === 'error') problems.push('CONSOLE: ' + m.text().slice(0, 200)); });
page.on('pageerror', e => problems.push('PAGEERROR: ' + e.message.slice(0, 200)));

await page.goto(URL, { waitUntil: 'networkidle0', timeout: 90000 });
await new Promise(r => setTimeout(r, 5000));

// boot should offer DEPLOY TO WORLD
const boot = await page.evaluate(() => document.body.innerText.includes('DEPLOY TO WORLD'));
console.log('BOOT offers deploy:', boot);
await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('DEPLOY TO WORLD'))?.click());
await new Promise(r => setTimeout(r, 3500));
const plane = await page.evaluate(() => document.body.innerText.includes('[ SPACE ] — JUMP'));
console.log('PLANE phase:', plane);
await page.keyboard.press('Space');
await new Promise(r => setTimeout(r, 2000));
const drop = await page.evaluate(() => {
  const m = document.body.innerText.match(/ALT (\d+)M/);
  return m ? parseInt(m[1]) : -1;
});
console.log('DROP altitude reading:', drop, drop > 0 ? '✓' : '✗');
await new Promise(r => setTimeout(r, 16000));
const ground = await page.evaluate(() => document.body.innerText.includes('ON GROUND'));
console.log('LANDED:', ground);
await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
await new Promise(r => setTimeout(r, 4000));
const comms = await page.evaluate(() => document.body.innerText.includes('COMMUNICATION TOWER'));
console.log('JOURNEY end (comms):', comms);

console.log('=== PROBLEMS ===');
console.log(problems.length ? problems.join('\n') : 'NONE');
await browser.close();
