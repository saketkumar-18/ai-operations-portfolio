// Verify every external link in the portfolio data resolves.
import https from 'https';
import http from 'http';
import fs from 'fs';

const projects = JSON.parse(fs.readFileSync(new URL('../data/links.json', import.meta.url), 'utf8')).links;

function check(u) {
  return new Promise((resolve) => {
    const lib = u.startsWith('https') ? https : http;
    const req = lib.get(u, { headers: { 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128 Safari/537.36' }, timeout: 20000 }, (res) => {
      resolve(res.statusCode);
      req.destroy();
    });
    req.on('error', () => resolve('ERR'));
    req.on('timeout', () => { req.destroy(); resolve('TIMEOUT'); });
  });
}

let bad = 0;
for (const l of projects) {
  const c = await check(l.url);
  const ok = String(c).startsWith('2') || String(c).startsWith('3');
  if (!ok) bad++;
  console.log(ok ? 'OK  ' : 'BAD ', c, l.name, l.url);
  if (!ok) {
    // one retry after pause (github transient 504s)
    await new Promise(r => setTimeout(r, 4000));
    const c2 = await check(l.url);
    const ok2 = String(c2).startsWith('2') || String(c2).startsWith('3');
    if (ok2) { console.log('  retry OK:', c2); bad--; }
    else console.log('  retry still bad:', c2);
  }
  await new Promise(r => setTimeout(r, 600));
}
console.log(bad === 0 ? '\nALL ' + projects.length + ' LINKS VERIFIED ✓' : '\n' + bad + ' BROKEN');
