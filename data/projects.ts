// ============================================================
// data/projects.ts — All 15 projects, verbatim from source portfolio.
// Categories preserved exactly as on saket18.is-a.dev.
// ============================================================

export type ProjectCategory =
  | "LLM & AGENTIC AI"
  | "COMPUTER VISION & REMOTE SENSING"
  | "SPEECH & AUDIO AI"
  | "FULL-STACK & APPLIED";

export interface Project {
  id: string;
  missionNo: string;
  name: string;
  category: ProjectCategory;
  status: "COMPLETED" | "ACTIVE";
  objective: string;
  tech: string[];
  metrics?: string[];
  demo?: string;
  github?: string;
  note?: string;
}

export const CATEGORY_META: Record<
  ProjectCategory,
  { label: string; short: string; tag: string; count: number; accent: string }
> = {
  "LLM & AGENTIC AI": { label: "LLM & AGENTIC AI", short: "LLM / Agents", tag: "Agents, RAG and evaluation — systems that reason, retrieve and self-correct.", count: 5, accent: "#e8a33d" },
  "COMPUTER VISION & REMOTE SENSING": { label: "COMPUTER VISION & REMOTE SENSING", short: "CV / Remote Sensing", tag: "From deepfake forensics to satellite flood mapping — vision that sees what matters.", count: 2, accent: "#5fa86a" },
  "SPEECH & AUDIO AI": { label: "SPEECH & AUDIO AI", short: "Speech AI", tag: "Emotion, transcription and Indic speech — audio intelligence on-device and in the browser.", count: 3, accent: "#4fa3c7" },
  "FULL-STACK & APPLIED": { label: "FULL-STACK & APPLIED", short: "Full-Stack", tag: "Products people actually use — privacy-first apps, community platforms and dev tools.", count: 5, accent: "#9a8866" },
};

export const projects: Project[] = [
  {
    id: "repolens",
    missionNo: "01",
    name: "REPO LENS",
    category: "LLM & AGENTIC AI",
    status: "COMPLETED",
    objective:
      "LLM code-review agent with repo-level context — reads a PR diff plus the whole repository via BM25 + reference-graph retrieval, then posts line-level review comments to GitHub. 65 tests, CI green.",
    tech: ["Python", "LLM Agent", "RAG", "GitHub Actions"],
    metrics: ["65 tests · CI green", "Line-level review comments"],
    demo: "https://repolens-az7g.onrender.com",
    github: "https://github.com/saketkumar-18/repolens",
  },
  {
    id: "faithguard",
    missionNo: "02",
    name: "FAITHGUARD",
    category: "LLM & AGENTIC AI",
    status: "COMPLETED",
    objective:
      "Hallucination detection & mitigation for RAG — claim-level NLI checks whether each answer is supported by its retrieved context, then auto-corrects via re-retrieval. F1 = 0.887 on SQuAD-based eval.",
    tech: ["Python", "NLI", "RAG", "LLM Eval"],
    metrics: ["F1 = 0.887 (SQuAD-based eval)"],
    demo: "https://faithguard.onrender.com/docs",
    github: "https://github.com/saketkumar-18/faithguard",
  },
  {
    id: "docvqa",
    missionNo: "03",
    name: "DOCVQA",
    category: "LLM & AGENTIC AI",
    status: "COMPLETED",
    objective:
      "Visual question answering over documents — OCR + layout analysis + BM25 retrieval, answered by a grounded LLM. Scores ANLS 1.000 on a 27-question eval, deployed serverless.",
    tech: ["Python", "OCR", "Retrieval", "FastAPI"],
    metrics: ["ANLS 1.000 on 27-question eval", "Deployed serverless"],
    demo: "https://docvqa.vercel.app",
    github: "https://github.com/saketkumar-18/docvqa",
  },
  {
    id: "research-copilot",
    missionNo: "04",
    name: "MULTI-AGENT RESEARCH COPILOT",
    category: "LLM & AGENTIC AI",
    status: "COMPLETED",
    objective:
      "A team of cooperating AI agents — planner → searcher → writer → critic — that research, cross-verify and synthesize complex topics into cited survey reports with quality evaluation.",
    tech: ["Python", "Agentic AI", "Orchestration", "LLMs"],
    demo: "https://research-copilot-2bj2.onrender.com",
    github: "https://github.com/saketkumar-18/research-copilot",
  },
  {
    id: "medical-report-summarizer",
    missionNo: "05",
    name: "MEDICAL REPORT SUMMARIZER",
    category: "LLM & AGENTIC AI",
    status: "COMPLETED",
    objective:
      "Clinical NLP that summarizes radiology & pathology reports for patients and flags urgency — deterministic triage core with a safety-gated LLM layer. 100% on a 47-case safety eval, deployed live.",
    tech: ["Clinical NLP", "LLM", "Safety Eval"],
    metrics: ["100% on 47-case safety eval", "Deployed live"],
    demo: "https://medical-report-summarizer-phi.vercel.app",
    github: "https://github.com/saketkumar-18/medical-report-summarizer",
  },
  {
    id: "deepfake-detection",
    missionNo: "06",
    name: "DEEPFAKE DETECTION",
    category: "COMPUTER VISION & REMOTE SENSING",
    status: "COMPLETED",
    objective:
      "Spatial-temporal CNN/Transformer that flags manipulated video — analyzing which artifacts generalize across generators. Research-grade benchmarking on FF++ and Celeb-DF v2.",
    tech: ["CNN", "Transformer", "Forensics", "PyTorch"],
    metrics: ["Benchmarked on FF++ and Celeb-DF v2"],
    github: "https://github.com/saketkumar-18/deepfake-detection",
  },
  {
    id: "yamuna-flood-mapper",
    missionNo: "07",
    name: "YAMUNA FLOOD MAPPER",
    category: "COMPUTER VISION & REMOTE SENSING",
    status: "COMPLETED",
    objective:
      "Sentinel-1 SAR satellite flood mapping for the Yamuna corridor, Delhi — free satellite data and free hosting turned into an early-warning flood layer for the city I live in.",
    tech: ["Sentinel-1", "Remote Sensing", "GIS"],
    demo: "https://yamuna-flood-mapper.vercel.app",
    github: "https://github.com/saketkumar-18/yamuna-flood-mapper",
  },
  {
    id: "svara",
    missionNo: "08",
    name: "SVARA",
    category: "SPEECH & AUDIO AI",
    status: "COMPLETED",
    objective:
      "Privacy-first on-device voice emotion screener — 6-class speech emotion recognition (CREMA-D) running a 287K-param int8 CNN fully in-browser via WebAssembly. No audio ever leaves the device.",
    tech: ["ONNX", "WASM", "SER", "On-device"],
    metrics: ["287K-param int8 CNN", "6-class SER (CREMA-D)", "Fully in-browser"],
    demo: "https://svara-emotion.vercel.app",
    github: "https://github.com/saketkumar-18/svara",
  },
  {
    id: "meeting-intelligence",
    missionNo: "09",
    name: "MEETING INTELLIGENCE",
    category: "SPEECH & AUDIO AI",
    status: "COMPLETED",
    objective:
      "Speaker diarization → transcription → auto summary + action items + who-owns-what. In-browser ML with sherpa-onnx WASM + Whisper; WER 7.8%, action-item F1 0.947.",
    tech: ["Diarization", "Whisper", "NLP", "FastAPI"],
    metrics: ["WER 7.8%", "Action-item F1 0.947"],
    demo: "https://meeting-intelligence-lime.vercel.app",
    github: "https://github.com/saketkumar-18/meeting-intelligence",
  },
  {
    id: "hinglish-asr",
    missionNo: "10",
    name: "HINGLISH ASR",
    category: "SPEECH & AUDIO AI",
    status: "COMPLETED",
    objective:
      "Speech recognition tuned for code-switched Hindi-English speech — the way India actually talks. Built for the low-resource, high real-world demand setting.",
    tech: ["ASR", "Hinglish", "Low-Resource"],
    demo: "https://hinglish-asr.vercel.app",
    github: "https://github.com/saketkumar-18/hinglish-asr",
  },
  {
    id: "vriddhi",
    missionNo: "11",
    name: "VRIDDHI",
    category: "FULL-STACK & APPLIED",
    status: "COMPLETED",
    objective:
      "Self-improving AI trading agent — a Hedge meta-allocator over 7 decorrelated strategies, walk-forward ML with a validation gate, and an adaptive risk overlay. Paper-trading research artifact.",
    tech: ["Python", "GBM", "Walk-Forward", "Risk"],
    demo: "https://vriddhi-trading-agent.vercel.app",
    github: "https://github.com/saketkumar-18/vriddhi",
  },
  {
    id: "persona",
    missionNo: "12",
    name: "PERSONA",
    category: "FULL-STACK & APPLIED",
    status: "COMPLETED",
    objective:
      "Privacy-first social discovery & real-time chat — no accounts: ephemeral JWT sessions, E2E-encrypted self-destructing rooms, on-device location coarsening, QR/invite pairing.",
    tech: ["React", "Node.js", "WebSockets"],
    demo: "https://persona-chat.vercel.app",
    note: "Source repository is private.",
  },
  {
    id: "lost-found-network",
    missionNo: "13",
    name: "LOST & FOUND NETWORK",
    category: "FULL-STACK & APPLIED",
    status: "COMPLETED",
    objective:
      "Privacy-first community platform for lost & found items — smart matching engine, map view, anonymous chat.",
    tech: ["Next.js", "PostgreSQL", "Leaflet"],
    demo: "https://lost-found-network-ummz.onrender.com",
    github: "https://github.com/saketkumar-18/lost-found-network",
  },
  {
    id: "mindvault",
    missionNo: "14",
    name: "MINDVAULT",
    category: "FULL-STACK & APPLIED",
    status: "COMPLETED",
    objective:
      "Local-first private AI knowledge assistant — semantic search & chat with your docs. No telemetry; cloud-LLM option for demos.",
    tech: ["Python", "Local LLMs", "RAG"],
    demo: "https://mindvault-l60k.onrender.com",
    github: "https://github.com/saketkumar-18/mindvault",
  },
  {
    id: "lan-file-share",
    missionNo: "15",
    name: "LAN FILE SHARE",
    category: "FULL-STACK & APPLIED",
    status: "COMPLETED",
    objective:
      "Zero-config LAN file sharing — upload, download & delete via web UI, with a QR code page for phone access. Single-file FastAPI.",
    tech: ["FastAPI", "Python", "Networking"],
    demo: "https://lan-file-share.onrender.com",
    github: "https://github.com/saketkumar-18/lan-file-share",
  },
];

export const projectFilters = [
  "ALL",
  "LLM & AGENTIC AI",
  "COMPUTER VISION & REMOTE SENSING",
  "SPEECH & AUDIO AI",
  "FULL-STACK & APPLIED",
] as const;
