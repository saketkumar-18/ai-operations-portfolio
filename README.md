# SAKET // AI OPERATIONS

**ENTER THE SYSTEM. EXPLORE THE WORK.**

A cinematic, interactive, tactical AI-operations world — the portfolio of
**Saket Kumar** (Data Scientist · AI Engineer · ML Engineer, IIT Guwahati).

Not a scrolling page. A world you enter, explore, and dig deeper into:
World → Operations Compound → Main Facility → Rooms → Interactive Objects → Project Data.

---

## Experience

| Layer | What it is |
|---|---|
| **Boot sequence** | `INITIALIZING SAKET.OS` → SYSTEM READY → ENTER THE SYSTEM |
| **The world** | 900×900m procedural terrain, dusk sky, fog, dust particles, distant mountains, road corridor, gated compound |
| **Camera** | Scroll-driven cinematic dolly through 6 locations; minimap/assistant/number-key jumps fly the camera there |
| **LOCATION 01 — COMMAND CENTER** | About: operator profile holo-table, tactical globe (Delhi + Guwahati), system displays |
| **LOCATION 02 — AI TRAINING GROUND** | Skills as 4 interactive stations: code terminal, training console, neural core, infrastructure tower |
| **LOCATION 03 — MISSION ARCHIVE** | All 15 projects as supply crates. Hover → `MISSION DETECTED`, lid opens, click → full-screen dossier. Category filter dims non-matching crates |
| **LOCATION 04 — RESEARCH DIVISION** | Education: holographic degree display + 6 focus-area pylons |
| **LOCATION 05 — CLOUD OPERATIONS** | Server racks with live lights, animated data beams, deployment pipeline |
| **LOCATION 06 — COMMUNICATION TOWER** | Contact: pulsing antenna tower, channels, resume download |
| **S.A.K.E.T.** | In-world assistant — local intent retrieval over the real portfolio data ("take me to RepoLens" → `NAVIGATION TARGET LOCKED` → dossier). LLM-pluggable via `answerIntent()` |
| **Recruiter Mode** | One click → fast professional 2D view (About/Skills/Projects/Education/Contact) |
| **Audio** | Procedural wind + facility hum + radio blips (Web Audio). Muted by default, toggle in HUD |

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
