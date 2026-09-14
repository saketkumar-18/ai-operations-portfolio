// ============================================================
// data/navigation.ts — World locations. Positions in world space
// drive the 3D camera, minimap and scroll journey together.
// ============================================================

export type LocationId =
  | "command"
  | "training"
  | "archive"
  | "research"
  | "cloud"
  | "comms";

export interface WorldLocation {
  id: LocationId;
  no: string; // LOCATION 01 etc.
  name: string;
  short: string; // minimap label
  represents: string;
  // world-space position (x, z): camera flies here; y fixed per location
  pos: [number, number];
  cameraY: number;
  // normalized journey position 0..1 (drives scroll journey)
  journey: number;
  message: string; // micro-interaction message on arrival
  accent: string;
}

export const locations: WorldLocation[] = [
  {
    id: "command",
    no: "01",
    name: "COMMAND CENTER",
    short: "COMMAND",
    represents: "ABOUT ME",
    pos: [0, -30],
    cameraY: 3.2,
    journey: 0.2,
    message: "BASE CAMP REACHED",
    accent: "#e8a33d",
  },
  {
    id: "training",
    no: "02",
    name: "AI TRAINING GROUND",
    short: "TRAINING",
    represents: "SKILLS",
    pos: [-46, -88],
    cameraY: 3.4,
    journey: 0.35,
    message: "TRAINING SYSTEM ONLINE",
    accent: "#5fa86a",
  },
  {
    id: "archive",
    no: "03",
    name: "MISSION ARCHIVE",
    short: "ARCHIVE",
    represents: "PROJECTS",
    pos: [0, -150],
    cameraY: 5.5,
    journey: 0.5,
    message: "MISSION ARCHIVE UNLOCKED",
    accent: "#e8a33d",
  },
  {
    id: "research",
    no: "04",
    name: "RESEARCH DIVISION",
    short: "RESEARCH",
    represents: "EDUCATION + RESEARCH",
    pos: [46, -212],
    cameraY: 3.6,
    journey: 0.7,
    message: "RESEARCH DIVISION ACCESS GRANTED",
    accent: "#4fa3c7",
  },
  {
    id: "cloud",
    no: "05",
    name: "CLOUD OPERATIONS",
    short: "CLOUD OPS",
    represents: "CLOUD + MLOPS + DEPLOYMENT",
    pos: [-46, -274],
    cameraY: 3.4,
    journey: 0.85,
    message: "INFRASTRUCTURE ONLINE",
    accent: "#9a8866",
  },
  {
    id: "comms",
    no: "06",
    name: "COMMUNICATION TOWER",
    short: "COMMS",
    represents: "CONTACT",
    pos: [0, -336],
    cameraY: 8,
    journey: 1.0,
    message: "COMMUNICATION LINK ESTABLISHED",
    accent: "#e8a33d",
  },
];

// Entrance / hero position (world entry before compound gate)
export const worldEntry: [number, number] = [0, 40];

// Compound gate position (camera passes through here)
export const compoundGate: [number, number] = [0, -10];

export const getLocation = (id: LocationId) =>
  locations.find((l) => l.id === id)!;
