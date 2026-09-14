import puppeteer from 'puppeteer';
// FPS during each BR phase + full journey stress
const URL = 'http://localhost:3780';
const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage();
await page.setViewport({ width: 1600, height: 900 });
await page.goto(URL, { waitUntil: 'networkidle0', timeout: 60000 });
await new Promise(r => setTimeout(r, 5000));
await page.evaluate(() => [...document.querySelectorAll('button')].find(b => b.textContent.includes('DEPLOY TO WORLD'))?.click());
await new Promise(r => setTimeout(r, 3000));

const fps = () => page.evaluate(() => new Promise(res => {
  let frames = 0;
  const t0 = performance.now();
  const loop = () => { frames++; if (performance.now() - t0 < 4000) requestAnimationFrame(loop); else res((frames / 4).toFixed(0)); };
  requestAnimationFrame(loop);
}));

console.log('FPS plane:', await fps());
await page.keyboard.press('Space');
await new Promise(r => setTimeout(r, 2000));
console.log('FPS freefall:', await fps());
await new Promise(r => setTimeout(r, 14000)); // land
console.log('FPS ground:', await fps());
await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight * 0.5));
await new Promise(r => setTimeout(r, 2500));
console.log('FPS archive:', await fps());
await browser.close();
