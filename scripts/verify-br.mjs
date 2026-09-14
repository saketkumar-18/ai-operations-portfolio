import puppeteer from 'puppeteer';
const URL = 'http://localhost:3780';
const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
const problems = [];
page.on('console', m => { if (m.type() === 'error') problems.push('CONSOLE: ' + m.text().slice(0, 200)); });
page.on('pageerror', e => problems.push('PAGEERROR: ' + e.message.slice(0, 200)));

await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 });
await new Promise(r => setTimeout(r, 5000));

// 1. boot → deploy
await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('DEPLOY TO WORLD'))?.click());
await new Promise(r => setTimeout(r, 3500));

// 2. should be in plane phase: jump prompt visible
const plane = await page.evaluate(() => ({
  jumpPrompt: document.body.innerText.includes('[ SPACE ] — JUMP'),
  compass: !!document.querySelector('[aria-label="Compass"]'),
  minimap: !!document.querySelector('[aria-label="World minimap navigation"]'),
  planeIcon: document.body.innerText.includes('SECTOR 01'),
}));
console.log('PLANE PHASE:', JSON.stringify(plane));
await page.screenshot({ path: 'shots/BR_plane.png' });

// 3. press SPACE to jump
await page.keyboard.press('Space');
await new Promise(r => setTimeout(r, 2500));
const drop = await page.evaluate(() => ({
  jumpPromptGone: !document.body.innerText.includes('[ SPACE ] — JUMP'),
  healthBar: document.body.innerText.includes('OPERATOR STATUS'),
}));
console.log('DROP STARTED:', JSON.stringify(drop));

// 4. wait for freefall → chute (70m) — sample altitude over time
let sawFreefall = false, sawChute = false;
for (let i = 0; i < 20; i++) {
  await new Promise(r => setTimeout(r, 400));
  const alt = await page.evaluate(() => {
    const m = document.body.innerText.match(/ALT (\d+)M/);
    return m ? parseInt(m[1]) : -1;
  });
  if (alt > 0) sawFreefall = true;
  const chute = await page.evaluate(() => document.body.innerText.includes('CHUTE OPEN'));
  if (chute) sawChute = true;
  if (alt >= 0 && alt < 5) break;
}
console.log('FREEFALL seen:', sawFreefall, '| CHUTE seen:', sawChute);
await page.screenshot({ path: 'shots/BR_freefall.png' });

// 5. wait for landing
await new Promise(r => setTimeout(r, 9000));
const ground = await page.evaluate(() => ({
  landedMsg: document.body.innerText.includes('BOOTS ON THE GROUND') || document.body.innerText.includes('LANDED'),
  onGround: document.body.innerText.includes('ON GROUND'),
  health: document.body.innerText.includes('OPERATOR STATUS'),
  killFeed: document.body.innerText.includes('OPERATOR'),
}));
console.log('GROUND:', JSON.stringify(ground));
await page.screenshot({ path: 'shots/BR_ground.png' });

// 6. after landing: scroll journey still works
await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.5));
await new Promise(r => setTimeout(r, 3000));
const journey = await page.evaluate(() => document.body.innerText.includes('MISSION ARCHIVE'));
console.log('JOURNEY after landing (archive at 50%):', journey);

// 7. recruiter mode still fine
await page.evaluate(() => {
  const r = [...document.querySelectorAll('button')].find(b => b.textContent.includes('RECRUITER MODE'));
  r && r.click();
});
await new Promise(r => setTimeout(r, 1200));
const rec = await page.evaluate(() => document.body.innerText.includes('OPERATOR PROFILE'));
console.log('RECRUITER:', rec);

console.log('=== PROBLEMS ===');
console.log(problems.length ? problems.join('\n') : 'NONE');
await browser.close();
