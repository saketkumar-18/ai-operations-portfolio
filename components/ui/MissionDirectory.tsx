"use client";

// ============================================================
// components/ui/MissionDirectory.tsx — quick-browse list of all
// missions + category filter. Non-matching crates dim in 3D.
// ============================================================

import { useState } from "react";
import {
  projects,
  projectFilters,
  CATEGORY_META,
} from "../../data/projects";
import { useWorld } from "../../lib/store";

export default function MissionDirectory() {
  const [open, setOpen] = useState(false);
  const filter = useWorld((s) => s.filter);
  const setFilter = useWorld((s) => s.setFilter);
  const openProject = useWorld((s) => s.openProject);
  const setHighlight = useWorld((s) => s.setHighlightProject);
  const goto = useWorld((s) => s.goto);

  const visible = projects.filter(
    (p) => filter === "ALL" || p.category === filter
  );

  return (
    <>
      {/* trigger */}
      <button
        className="fixed bottom-24 right-4 z-40 btn-tac !px-4 !py-2.5 text-[10px]"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label="Mission directory — browse all projects"
      >
        ▤ MISSION DIRECTORY
      </button>

      {open && (
        <div
          className="fixed inset-x-4 bottom-32 md:inset-x-auto md:right-4 md:w-[560px] z-[70] tac-panel tac-panel-hi brackets p-5 max-h-[62vh] overflow-y-auto anim-rise"
          role="dialog"
          aria-label="Mission directory"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="k-label">MISSION DIRECTORY</p>
              <p className="font-mono-t text-[10px] text-tac-gray mt-1 tracking-[0.18em]">
                {visible.length} / {projects.length} OPERATIONS
              </p>
            </div>
            <button
              className="btn-tac ghost !px-3 !py-1.5 text-[10px]"
              onClick={() => setOpen(false)}
              aria-label="Close directory"
            >
              ✕
            </button>
          </div>

          {/* filters */}
          <div className="flex flex-wrap gap-1.5 mb-4" role="group" aria-label="Filter missions">
            {projectFilters.map((f) => {
              const active = filter === f;
              const label = f === "ALL" ? "ALL" : CATEGORY_META[f]?.short ?? f;
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  aria-pressed={active}
                  className={`font-mono-t text-[10px] tracking-[0.14em] px-3 py-1.5 border transition-colors ${
                    active
                      ? "border-tac-orange text-tac-orange bg-tac-orange/10"
                      : "border-tac-paper/15 text-tac-gray hover:text-tac-dim hover:border-tac-paper/30"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* list */}
          <ul className="divide-y divide-tac-paper/8">
            {visible.map((p) => (
              <li key={p.id}>
                <button
                  className="w-full text-left px-2 py-3 group hover:bg-tac-paper/[0.03] transition-colors"
                  onClick={() => {
                    openProject(p);
                    setOpen(false);
                  }}
                  onMouseEnter={() => setHighlight(p.id)}
                  onMouseLeave={() => setHighlight(null)}
                >
                  <div className="flex items-baseline gap-3">
                    <span className="font-mono-t text-[11px] text-tac-orange/80">
                      M-{p.missionNo}
                    </span>
                    <span className="font-display font-semibold text-[15px] group-hover:text-tac-orange transition-colors">
                      {p.name}
                    </span>
                    <span
                      className="font-mono-t text-[9px] tracking-[0.16em] ml-auto"
                      style={{ color: CATEGORY_META[p.category].accent }}
                    >
                      {CATEGORY_META[p.category].short}
                    </span>
                  </div>
                  <p className="text-[12px] text-tac-gray mt-1 line-clamp-1 pr-4">
                    {p.objective}
                  </p>
                </button>
              </li>
            ))}
          </ul>

          <p className="font-mono-t text-[9px] text-tac-gray/70 tracking-[0.16em] mt-4">
            TIP: HOVER TO PINPOINT IN WORLD · CLICK FOR DOSSIER · FILTERS DIM CRATES IN 3D
          </p>
        </div>
      )}
    </>
  );
}
