"use client";

// ============================================================
// components/ui/AIConsole.tsx — S.A.K.E.T. assistant.
// Local intelligent retrieval over portfolio data (no API).
// Architecture: intents → handlers; an LLM can be plugged into
// answerIntent() later without touching the UI.
// ============================================================

import { useEffect, useRef, useState } from "react";
import { projects, CATEGORY_META } from "../../data/projects";
import { profile } from "../../data/profile";
import { skillGroups } from "../../data/skills";
import { education } from "../../data/education";
import { locations } from "../../data/navigation";
import { useWorld } from "../../lib/store";

// ---------- retrieval layer (LLM-pluggable) ----------
interface Answer {
  text: string;
  action?: { type: "goto"; location: string } | { type: "openProject"; id: string };
}

function answerIntent(qRaw: string): Answer {
  const q = qRaw.toLowerCase();
  const has = (...ws: string[]) => ws.some((w) => q.includes(w));

  // best/flagship project
  if (has("best", "flagship", "favorite", "proud")) {
    const repo = projects.find((p) => p.id === "repolens")!;
    return {
      text: `Flagship operation: ${repo.name} — ${repo.objective} Metrics: ${repo.metrics?.join("; ")}.`,
      action: { type: "openProject", id: repo.id },
    };
  }

  // category queries
  const catMatch = projects.find((p) =>
    q.includes(p.name.toLowerCase().replace(/[^a-z]/g, "").slice(0, 8)) ||
    q.includes(p.name.toLowerCase().split(" ")[0])
  );
  if (catMatch && has("show", "open", "take", "go", "tell", "about", "what")) {
    return {
      text: `MISSION ${catMatch.missionNo} — ${catMatch.name}. ${catMatch.objective}`,
      action: { type: "openProject", id: catMatch.id },
    };
  }

  // computer vision
  if (has("vision", "cv", "deepfake", "satellite", "flood", "image")) {
    const cv = projects.filter((p) => p.category.includes("COMPUTER VISION"));
    return {
      text: `Computer-vision operations: ${cv.map((p) => p.name).join(", ")}. ${cv[0].objective}`,
      action: { type: "openProject", id: cv[0].id },
    };
  }

  // speech
  if (has("speech", "audio", "asr", "voice", "whisper", "emotion", "transcri")) {
    const sp = projects.filter((p) => p.category.includes("SPEECH"));
    return {
      text: `Speech & audio operations: ${sp.map((p) => p.name).join(", ")}. Notable: Meeting Intelligence — WER 7.8%, action-item F1 0.947.`,
      action: { type: "openProject", id: "meeting-intelligence" },
    };
  }

  // llm/agents/rag
  if (has("llm", "agent", "rag", "retrieval", "hallucin", "prompt")) {
    const llm = projects.filter((p) => p.category.includes("LLM"));
    return {
      text: `LLM & agentic operations: ${llm.map((p) => p.name).join(", ")}. FaithGuard hit F1 0.887 on hallucination detection; RepoLens ships 65 tests with CI green.`,
      action: { type: "openProject", id: "faithguard" },
    };
  }

  // metrics
  if (has("metric", "evaluat", "f1", "score", "wer", "anls", "performance")) {
    const withM = projects.filter((p) => p.metrics && p.metrics.length);
    return {
      text: `Measured operations: ${withM
        .map((p) => `${p.name} (${p.metrics![0]})`)
        .join("; ")}.`,
      };
  }

  // skills
  if (has("skill", "stack", "tech", "know", "language", "framework")) {
    return {
      text: `Skill systems: ${skillGroups
        .map((g) => `${g.label} (${g.skills.map((s) => s.name).join(", ")})`)
        .join(" · ")}.`,
      action: { type: "goto", location: "training" },
    };
  }

  // education
  if (has("education", "degree", "study", "college", "iit", "university", "school")) {
    return {
      text: `${education.period} — ${education.degree} at ${education.institution}. ${education.detail}`,
      action: { type: "goto", location: "research" },
    };
  }

  // experience / about
  if (has("about", "experience", "who", "background", "yourself", "intern")) {
    return {
      text: `${profile.about} ${profile.aboutLong} Status: ${profile.status}.`,
      action: { type: "goto", location: "command" },
    };
  }

  // contact
  if (has("contact", "email", "mail", "reach", "hire", "linkedin", "github link")) {
    return {
      text: `Channels: ${profile.email} / saketanand9693@gmail.com · GitHub saketkumar-18 · LinkedIn iitgsaketkumar. Looking for AI/ML internships, data science roles and research collaboration.`,
      action: { type: "goto", location: "comms" },
    };
  }

  // navigation
  const nav = locations.find((l) => q.includes(l.name.toLowerCase()) || q.includes(l.short.toLowerCase()));
  if (nav && has("go", "take", "navigate", "show", "open")) {
    return {
      text: `NAVIGATION TARGET LOCKED — ${nav.name}. Moving.`,
      action: { type: "goto", location: nav.id },
    };
  }

  // project count / general
  if (has("project", "work", "built", "portfolio", "many")) {
    return {
      text: `15 operations on record across ${Object.keys(CATEGORY_META).length} divisions: LLM & Agentic AI (5), Computer Vision & Remote Sensing (2), Speech & Audio (3), Full-Stack & Applied (5). Ask about any category, or say "take me to RepoLens".`,
    };
  }

  return {
    text: `I can brief you on: projects ("best LLM project", "computer vision work"), skills, education, metrics, or navigation ("take me to the archive", "open RepoLens"). Ask anything.`,
  };
}

// ---------- UI ----------
export default function AIConsole() {
  const showAssistant = useWorld((s) => s.showAssistant);
  const setShowAssistant = useWorld((s) => s.setShowAssistant);
  const openProjectById = useWorld((s) => s.openProject);
  const goto = useWorld((s) => s.goto);
  const toast = useWorld((s) => s.toast);
  const [msgs, setMsgs] = useState<{ from: "user" | "sak"; text: string }[]>([
    {
      from: "sak",
      text: "S.A.K.E.T. ONLINE — System Assistant for Knowledge, Exploration & Technology. Ask me about missions, skills or navigation.",
    },
  ]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [msgs, thinking]);

  const ask = () => {
    const q = input.trim();
    if (!q) return;
    setMsgs((m) => [...m, { from: "user", text: q }]);
    setInput("");
    setThinking(true);
    setTimeout(() => {
      const ans = answerIntent(q);
      setMsgs((m) => [...m, { from: "sak", text: ans.text }]);
      setThinking(false);
      if (ans.action) {
        if (ans.action.type === "openProject") {
          const p = projects.find((x) => x.id === (ans.action as { id: string }).id);
          if (p) openProjectById(p);
        } else if (ans.action.type === "goto") {
          toast("NAVIGATION TARGET LOCKED", "nav");
          goto(ans.action.location as never);
        }
      }
    }, 480);
  };

  if (!showAssistant) return null;

  return (
    <div
      className="fixed z-[80] bottom-16 right-4 w-[min(94vw,400px)] tac-panel tac-panel-hi brackets anim-rise flex flex-col"
      role="dialog"
      aria-label="S.A.K.E.T. assistant"
    >
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-tac-paper/10">
        <div>
          <p className="font-mono-t text-[11px] tracking-[0.2em] text-tac-cyan">
            S.A.K.E.T.
          </p>
          <p className="hud-label mt-0.5 !text-[8px]">
            SYSTEM ASSISTANT · KNOWLEDGE · EXPLORATION · TECHNOLOGY
          </p>
        </div>
        <button
          className="btn-tac ghost !px-2.5 !py-1.5 text-[10px]"
          onClick={() => setShowAssistant(false)}
          aria-label="Close assistant"
        >
          ✕
        </button>
      </div>

      <div ref={listRef} className="flex-1 overflow-y-auto px-4 py-3 max-h-64 space-y-3">
        {msgs.map((m, i) => (
          <div key={i} className={m.from === "user" ? "text-right" : ""}>
            <p
              className={`inline-block max-w-[92%] text-left text-[12.5px] leading-relaxed px-3 py-2 ${
                m.from === "user"
                  ? "bg-tac-paper/10 text-tac-dim"
                  : "border-l-2 border-tac-cyan/60 text-tac-dim"
              }`}
            >
              {m.text}
            </p>
          </div>
        ))}
        {thinking && (
          <p className="font-mono-t text-[10px] text-tac-gray tracking-[0.2em]">
            RETRIEVING…
          </p>
        )}
      </div>

      <form
        className="flex gap-2 p-3 border-t border-tac-paper/10"
        onSubmit={(e) => {
          e.preventDefault();
          ask();
        }}
      >
        <input
          className="flex-1 bg-transparent border border-tac-paper/15 px-3 py-2 font-mono-t text-[12px] text-tac-paper placeholder:text-tac-gray/60 focus:border-tac-orange/60 outline-none"
          placeholder="ASK ABOUT MISSIONS, SKILLS, NAVIGATION…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          aria-label="Ask S.A.K.E.T."
        />
        <button className="btn-tac !px-4 !py-2 text-[10px]" type="submit">
          SEND
        </button>
      </form>
    </div>
  );
}
