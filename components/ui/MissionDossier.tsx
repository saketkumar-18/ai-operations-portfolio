"use client";

// ============================================================
// components/ui/MissionDossier.tsx — full-screen cinematic
// project dossier overlay.
// ============================================================

import { useEffect } from "react";
import { CATEGORY_META } from "../../data/projects";
import { useWorld } from "../../lib/store";

export default function MissionDossier() {
  const activeProject = useWorld((s) => s.activeProject);
  const openProject = useWorld((s) => s.openProject);
  const toast = useWorld((s) => s.toast);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeProject) openProject(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeProject, openProject]);

  if (!activeProject) return null;
  const p = activeProject;
  const meta = CATEGORY_META[p.category];

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 md:p-10 bg-tac-bg/88 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`Mission dossier: ${p.name}`}
    >
      <div className="relative w-full max-w-2xl max-h-full overflow-y-auto tac-panel tac-panel-hi brackets p-7 md:p-10 anim-rise">
        {/* header */}
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <p className="k-label mb-2">MISSION {p.missionNo}</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl tracking-tight">
              {p.name}
            </h2>
            <div className="font-mono-t text-[11px] tracking-[0.22em] text-tac-dim mt-2">
              {meta.label}
            </div>
          </div>
          <button
            className="btn-tac ghost !px-3 !py-2"
            onClick={() => openProject(null)}
            aria-label="Close dossier"
          >
            ✕ CLOSE
          </button>
        </div>

        {/* status bar */}
        <div className="flex flex-wrap gap-x-8 gap-y-2 border-y border-tac-paper/10 py-3 mb-6">
          <div>
            <span className="hud-label">CATEGORY </span>
            <span className="hud-value" style={{ color: meta.accent }}>
              {meta.short}
            </span>
          </div>
          <div>
            <span className="hud-label">STATUS </span>
            <span className="hud-value text-tac-green">● {p.status}</span>
          </div>
          <div>
            <span className="hud-label">CLEARANCE </span>
            <span className="hud-value text-tac-dim">PUBLIC RELEASE</span>
          </div>
        </div>

        {/* objective */}
        <section className="mb-6">
          <p className="k-label mb-3">OBJECTIVE</p>
          <p className="text-[15px] leading-relaxed text-tac-dim">{p.objective}</p>
        </section>

        {/* technology */}
        <section className="mb-6">
          <p className="k-label mb-3">TECHNOLOGY</p>
          <div className="flex flex-wrap gap-2">
            {p.tech.map((t) => (
              <span
                key={t}
                className="font-mono-t text-[11px] tracking-[0.12em] border border-tac-paper/15 px-3 py-1.5 text-tac-dim"
              >
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* performance */}
        {p.metrics && p.metrics.length > 0 && (
          <section className="mb-8">
            <p className="k-label mb-3">PERFORMANCE</p>
            <div className="grid grid-cols-1 gap-2">
              {p.metrics.map((m) => (
                <div
                  key={m}
                  className="border-l-2 pl-4 py-1 font-mono-t text-[12px] tracking-[0.1em] text-tac-dim"
                  style={{ borderColor: meta.accent }}
                >
                  {m}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* actions */}
        <div className="flex flex-wrap gap-3 border-t border-tac-paper/10 pt-6">
          {p.github ? (
            <a
              className="btn-tac solid"
              href={p.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => toast("SOURCE REPOSITORY CONNECTED", "link")}
            >
              ▣ VIEW GITHUB
            </a>
          ) : (
            <span className="btn-tac ghost pointer-events-none opacity-60" aria-hidden>
              ▣ SOURCE PRIVATE
            </span>
          )}
          {p.demo && (
            <a
              className="btn-tac"
              href={p.demo}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => toast("LIVE DEMO LINK OPEN", "link")}
            >
              ▶ LIVE DEMO
            </a>
          )}
          <button className="btn-tac ghost" onClick={() => openProject(null)}>
            ↩ RETURN TO WORLD
          </button>
        </div>
        {p.note && (
          <p className="font-mono-t text-[10px] tracking-[0.14em] text-tac-gray mt-4">
            NOTE: {p.note.toUpperCase()}
          </p>
        )}
      </div>
    </div>
  );
}
