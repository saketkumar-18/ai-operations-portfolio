// ============================================================
// data/profile.ts — SOURCE OF TRUTH: https://saket18.is-a.dev/
// All content below is extracted verbatim from the existing
// portfolio. Nothing invented. No fake experience/companies.
// ============================================================

export const profile = {
  name: "SAKET KUMAR",
  callsign: "SK",
  operator: "SAKET KUMAR",
  roles: ["DATA SCIENTIST", "AI ENGINEER", "ML ENGINEER"],
  tagline: "ENTER THE SYSTEM. EXPLORE THE WORK.",
  motto: "Turning Data into Intelligence. Building AI for Real-World Impact.",
  about: `I'm Saket Kumar — a Data Scientist & AI Engineer pursuing my BSc (Hons.) in Data Science & AI at IIT Guwahati. I build AI that ships — not just demos, but systems that are trained, tested and deployed live.`,
  aboutLong: `My playground spans LLM agents & RAG, computer vision, on-device speech models and satellite imagery. My strength is going end-to-end: model → evaluation → API → UI → production, with measurable results — F1, ANLS, WER — backing every claim.`,
  location: "Delhi, India",
  email: "k.saket@op.iitg.ac.in",
  emailAlt: "saketanand9693@gmail.com",
  github: "https://github.com/saketkumar-18",
  linkedin: "https://www.linkedin.com/in/iitgsaketkumar",
  resume: "/resume.pdf",
  photo: "/profile.jpg",
  status: "OPEN TO INTERNSHIPS · AI/ML OPPORTUNITIES · RESEARCH COLLABORATION",
  statusShort: "OPEN TO WORK",
  quickStats: [
    { value: "15+", label: "PROJECTS BUILT" },
    { value: "BSc", label: "DS & AI (HONS.) · IIT GUWAHATI" },
  ],
  quickChips: [
    "AI / DEEP LEARNING",
    "IIT GUWAHATI",
    "DELHI, INDIA",
    "OPEN TO WORK",
  ],
  // Boot / loading screen lines
  bootLines: [
    "INITIALIZING SAKET.OS",
    "AI CORE ........ ONLINE",
    "NEURAL SYSTEM .. ONLINE",
    "PROJECT DATA ... LOADED",
    "MISSION ARCHIVE  LOADED",
    "OPERATOR: SAKET KUMAR",
    "STATUS: ACTIVE",
    "SYSTEM READY.",
  ],
} as const;

export type Profile = typeof profile;
