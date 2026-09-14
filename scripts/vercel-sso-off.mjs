// Disable Vercel SSO Protection on the portfolio-ops project (make public).
import os from "os";
import fs from "fs";
import path from "path";

const possible = [
  path.join(os.homedir(), "AppData", "Roaming", "xdg.data", "com.vercel.cli", "auth.json"),
];
let token = null;
for (const p of possible) {
  if (fs.existsSync(p)) {
    try { token = JSON.parse(fs.readFileSync(p, "utf8")).token; if (token) break; } catch {}
  }
}
if (!token) { console.log("no token"); process.exit(1); }

const ORG = "team_WWBWPkPEN5ebUYc8at3BlocE";
const PROJECT = "prj_sfcRaTEKdFSa1yJs5ejTaAAIxAvV";
const H = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

const res = await fetch(`https://api.vercel.com/v9/projects/${PROJECT}?teamId=${ORG}`, {
  method: "PATCH",
  headers: H,
  body: JSON.stringify({ ssoProtection: null }),
});
const data = await res.json();
console.log("status:", res.status);
console.log("ssProtection now:", JSON.stringify(data.ssoProtection ?? null));
console.log("link:", JSON.stringify(data.link ?? null));
