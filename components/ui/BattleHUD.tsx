"use client";

// ============================================================
// components/ui/BattleHUD.tsx — PUBG-style ground HUD:
// bottom-left health bar, kill feed (top-left under id),
// freefall altitude meter (right edge) while dropping.
// ============================================================

import { useWorld } from "../../lib/store";
import { profile } from "../../data/profile";

export default function BattleHUD() {
  const phase = useWorld((s) => s.phase);
  const altitude = useWorld((s) => s.altitude);
  const health = useWorld((s) => s.health);
  const killFeed = useWorld((s) => s.killFeed);

  return (
    <>
      {/* ---------- kill feed (top-left, under operator id) ---------- */}
      <div className="fixed top-16 left-4 z-40 pointer-events-none select-none w-80">
        {killFeed.map((k) => (
          <div
            key={k.id}
            className="anim-rise mb-1 px-2.5 py-1 bg-black/60 border-l-2 border-tac-orange font-mono-t text-[10px] tracking-[0.12em] text-tac-dim"
          >
            {k.text}
          </div>
        ))}
      </div>

      {/* ---------- health bar (bottom-center-left, PUBG layout) ---------- */}
      <div className="fixed bottom-6 left-4 z-40 select-none pointer-events-none">
        <div className="flex items-end gap-3">
          {/* operator badge */}
          <div className="font-mono-t text-[10px] tracking-[0.18em] text-tac-gray bg-black/50 px-2 py-1 border border-white/10">
            {profile.callsign}.18
          </div>
          {/* health */}
          <div className="w-64">
            <div className="h-4 bg-black/70 border border-white/20 relative overflow-hidden">
              <div
                className="h-full transition-all duration-500"
                style={{
                  width: `${health}%`,
                  background:
                    health > 50
                      ? "linear-gradient(90deg,#5fa86a,#7fd08a)"
                      : health > 20
                      ? "#e8a33d"
                      : "#d9534f",
                }}
              />
              {/* segment dividers */}
              <div className="absolute inset-0 flex">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="flex-1 border-r border-black/40 last:border-0" />
                ))}
              </div>
            </div>
            <div className="flex justify-between font-mono-t text-[8px] text-tac-gray tracking-[0.2em] mt-1">
              <span>OPERATOR STATUS</span>
              <span>{health}/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------- freefall altitude meter (right edge) ---------- */}
      {phase === "drop" && (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-40 select-none pointer-events-none">
          <div className="flex flex-col items-center">
            <span className="font-mono-t text-[9px] tracking-[0.2em] text-tac-gray mb-2">
              ALT
            </span>
            <div className="relative w-2 h-64 bg-black/60 border border-white/15">
              <div
                className="absolute left-0 right-0 bg-tac-orange"
                style={{ bottom: 0, height: `${Math.min(100, (altitude / 260) * 100)}%` }}
              />
              {/* chute line at 70m */}
              <div
                className="absolute left-[-4px] right-[-4px] h-px bg-tac-cyan"
                style={{ bottom: `${(70 / 260) * 100}%` }}
              />
            </div>
            <span className="font-mono-t text-[13px] text-tac-orange mt-2 tabular-nums">
              {Math.round(altitude)}
            </span>
            <span className="font-mono-t text-[8px] text-tac-gray tracking-[0.25em]">
              {altitude > 70 ? "FREEFALL" : "CHUTE OPEN"}
            </span>
          </div>
        </div>
      )}

      {/* ---------- jump prompt (plane phase) ---------- */}
      {phase === "plane" && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 text-center pointer-events-none select-none">
          <div className="font-mono-t text-[12px] tracking-[0.3em] text-tac-paper bg-black/65 border border-tac-orange/50 px-6 py-3 anim-flicker">
            [ SPACE ] — JUMP
          </div>
          <p className="font-mono-t text-[9px] text-tac-gray tracking-[0.2em] mt-2">
            AUTO-JUMP AT END OF FLIGHT PATH
          </p>
        </div>
      )}
    </>
  );
}
