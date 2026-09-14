// ============================================================
// data/skills.ts — Skill categories, exactly as listed on the
// source portfolio (saket18.is-a.dev). Nothing added.
// ============================================================

export interface SkillGroup {
  id: string;
  label: string;
  icon: string;
  representation: string; // visual station in the 3D world
  skills: { name: string; note?: string }[];
}

export const skillGroups: SkillGroup[] = [
  {
    id: "languages",
    label: "LANGUAGES",
    icon: "terminal",
    representation: "CODE TERMINAL",
    skills: [
      { name: "Python" },
      { name: "TypeScript" },
      { name: "JavaScript" },
      { name: "SQL" },
      { name: "R" },
      { name: "C" },
    ],
  },
  {
    id: "ml",
    label: "ML & DEEP LEARNING",
    icon: "training",
    representation: "TRAINING CONSOLE",
    skills: [
      { name: "PyTorch" },
      { name: "Scikit-learn" },
      { name: "XGBoost" },
      { name: "OpenCV" },
      { name: "ONNX Runtime" },
      { name: "WebAssembly" },
    ],
  },
  {
    id: "genai",
    label: "GENERATIVE AI & LLMS",
    icon: "neural",
    representation: "NEURAL CORE",
    skills: [
      { name: "HuggingFace" },
      { name: "RAG" },
      { name: "BM25 Retrieval" },
      { name: "NLI" },
      { name: "Whisper" },
      { name: "sherpa-onnx" },
    ],
  },
  {
    id: "fullstack",
    label: "FULL-STACK & CLOUD",
    icon: "cloud",
    representation: "INFRASTRUCTURE TOWER",
    skills: [
      { name: "React" },
      { name: "Next.js" },
      { name: "FastAPI" },
      { name: "Three.js" },
      { name: "Node.js" },
      { name: "GitHub Actions" },
      { name: "Vercel" },
      { name: "Docker" },
    ],
  },
];
