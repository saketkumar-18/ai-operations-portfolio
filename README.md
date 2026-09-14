# SAKET // AI OPERATIONS

**ENTER THE SYSTEM. EXPLORE THE WORK.**

A cinematic, interactive, tactical AI-operations world — the portfolio of
**Saket Kumar** (Data Scientist · AI Engineer · ML Engineer, IIT Guwahati).

Not a scrolling page. A world you enter, explore, and dig deeper into:
World → Operations Compound → Main Facility → Rooms → Interactive Objects → Project Data.

---

## Experience

The full battle-royale insert, from boot to boots-on-the-ground:

| Phase | What happens |
|---|---|
| **Boot** | `INITIALIZING SAKET.OS` → SYSTEM READY → **DEPLOY TO WORLD** |
| **Plane** | Original cargo plane flies a 26s line across the map; camera trails it; **[ SPACE ] — JUMP** (auto-jump at path end so nobody is trapped) |
| **Drop** | Freefall at 62 m/s with steering toward the compound; parachute auto-deploys at 70 m; altitude meter on the right edge |
| **Ground** | `OPERATOR SK.18 LANDED — SA SYSTEMS ONLINE`; scroll drives the cinematic camera through the world |
| **LOCATION 01 — COMMAND CENTER** | About: operator profile holo-table, tactical globe (Delhi + Guwahati), system displays |
| **LOCATION 02 — AI TRAINING GROUND** | Skills as 4 interactive stations: code terminal, training console, neural core, infrastructure tower |
| **LOCATION 03 — MISSION ARCHIVE** | All 15 projects as supply crates. Hover → `MISSION DETECTED`, lid opens, click → full-screen dossier. Category filter dims non-matching crates |
| **LOCATION 04 — RESEARCH DIVISION** | Education: holographic degree display + 6 focus-area pylons |
| **LOCATION 05 — CLOUD OPERATIONS** | Server racks with live lights, animated data beams, deployment pipeline |
| **LOCATION 06 — COMMUNICATION TOWER** | Contact: pulsing antenna tower, channels, resume download |
| **S.A.K.E.T.** | In-world assistant — local intent retrieval over the real portfolio data ("take me to RepoLens" → `NAVIGATION TARGET LOCKED` → dossier). LLM-pluggable via `answerIntent()` |
| **Recruiter Mode** | One click → fast professional 2D view (About/Skills/Projects/Education/Contact) |
| **Battle HUD** | PUBG-style: sliding bearing-tape compass with heading readout, bottom-right minimap with flight line + safe-zone circle + plane icon, segmented health bar, kill feed, altitude meter |
| **Audio** | Procedural wind + facility hum + radio blips (Web Audio). Muted by default, toggle in HUD |

All battle-royale atmosphere, zero copyrighted material: the plane, map, livery and UI are original designs inspired by the genre, not copies of PUBG assets.

## Resilience & performance

- **Mobile / low-spec / no-WebGL** → automatic cinematic 2.5D fallback with parallax (same content, zero WebGL dependency)
- **Reduced motion** respected (`prefers-reduced-motion`)
- **Keyboard**: `1–6` jump locations, Tab navigation, Esc closes dossier
- Adaptive DPR + fps watchdog (`PerformanceManager`), instanced trees/mountains, code-split 3D chunk
- No external 3D assets — everything procedural (zero broken-asset risk, tiny payload)

## Content truth

All content (15 projects, skills, education, contacts, links, metrics) is extracted
from the source portfolio and centralized in `data/` — nothing invented.
- `data/profile.ts` · `data/projects.ts` · `data/skills.ts` · `data/education.ts` · `data/navigation.ts`

## Stack

Next.js 14 · TypeScript · React 18 · React Three Fiber · Three.js · Tailwind CSS · Zustand

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

## Structure

```
app/            layout, page (experience router), design system css
components/
  world/        World, Environment, Terrain, FacilityKit
    locations/  CommandCenter, TrainingGround, MissionArchive,
                ResearchDivision, CloudOperations, CommunicationTower
  three/        CameraController, PerformanceManager
  ui/           HUD, Compass, Minimap, LoadingScreen, MissionDossier,
                MissionDirectory, AIConsole, RecruiterMode, Fallback2D
data/           all portfolio content (source of truth)
lib/            store, device, audio, utils
```

---

Designed & built by Saket Kumar · IIT Guwahati · © 2026
