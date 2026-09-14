// Check & disable Vercel SSO Protection on the portfolio-ops project.
// Uses the CLI's stored auth token.
import { execSync } from "child_process";
import os from "os";
import fs from "fs";
import path from "path";

// read vercel CLI auth token
const authPath = path.join(os.homedir(), "AppData", "Local", "com.vercel.cli", "auth.json");
const possible = [
  path.join(os.homedir(), "AppData", "Roaming", "xdg.data", "com.vercel.cli", "auth.json"),
  path.join(os.homedir(), "AppData", "Roaming", "com.vercel.cli", "Data", "auth.json"),
  path.join(os.homedir(), "AppData", "Local", "com.vercel.cli", "auth.json"),
  path.join(os.homedir(), ".local", "share", "com.vercel.cli", "auth.json"),
  path.join(os.homedir(), ".vercel", "auth.json"),
];
let token = null;
for (const p of possible) {
  if (fs.existsSync(p)) {
    try { token = JSON.parse(fs.readFileSync(p, "utf8")).token; if (token) break; } catch {}
  }
}
if (!token) {
  // fall back to `vercel whoami --token` style: try env
  console.log("no auth token found in CLI paths");
  process.exit(1);
}
const ORG = "team_WWBWPkPEN5ebUYc8at3BlocE";
const PROJECT = "prj_sfcRaTEKdFSa1yJs5ejTaAAIxAvV";
const H = { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };

async function main() {
  // check current protection config
  const res = await fetch(`https://api.vercel.com/v9/projects/${PROJECT}?teamId=${ORG}`, { headers: H });
  const data = await res.json();
  console.log("project:", data.name);
  console.log("ssProtection:", JSON.stringify(data.ssoProtection ?? null));
  console.log("protection:", JSON.stringify(data.protection ?? null));
}
main().catch(e => { console.error(e.message); process.exit(1); });
