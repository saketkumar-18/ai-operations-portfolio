// List where vercel CLI actually stores its token on this setup
const { execSync } = require("child_process");
const os = require("os");
const fs = require("fs");
const path = require("path");

const home = os.homedir();
const candidates = [];
function walk(dir, depth) {
  if (depth > 4 || !fs.existsSync(dir)) return;
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (/vercel/i.test(e.name)) walk(p, depth + 1);
      else if (depth < 2) walk(p, depth + 1);
    } else if (/vercel/i.test(e.name) || e.name === "auth.json") {
      candidates.push(p);
    }
  }
}
walk(path.join(home, "AppData"), 0);
walk(path.join(home, ".config"), 0);
walk(home, 1);
console.log(candidates.join("\n") || "none");
