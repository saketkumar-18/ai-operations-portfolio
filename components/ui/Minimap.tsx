"use client";

// ============================================================
// components/ui/Minimap.tsx — tactical minimap, top-right.
// World x/z → minimap px. Active location highlighted, radar
// sweep, camera dot, clickable to navigate.
// ============================================================

import { useMemo } from "react";
import { locations } from "../../data/navigation";
import { useWorld } from "../../lib/store";

// world bounds: x ∈ [-60, 60], z ∈ [50, -350]
const MAP_W = 150;
const MAP_H = 190;
const X_MIN = -60, X_MAX = 60;
const Z_MIN = -350, Z_MAX = 50;

const toMap = (x: number, z: number): { left: number; top: number } => ({
  left: ((x - X_MIN) / (X_MAX - X_MIN)) * MAP_W,
  top: ((Z_MAX - z) / (Z_MAX - Z_MIN)) * MAP_H,
});

export default function Minimap() {
  const activeLocation = useWorld((s) => s.activeLocation);
  const goto = useWorld((s) => s.goto);
  const journey = useWorld((s) => s.journey);

  // camera position along the corridor for the player dot
  const cam = useMemo(() => {
    const z = 46 - journey * 382;
    const x = Math.sin(journey * Math.PI * 3) * 18;
    return toMap(x, z);
  }, [journey]);

  return (
    <nav
      className="fixed top-4 right-4 z-40 select-none"
      aria-label="World minimap navigation"
    >
      <div className="tac-panel brackets p-3 relative">
        <div className="hud-label mb-2 flex justify-between items-center">
          <span>TACTICAL MAP</span>
          <span className="text-tac-orange">SECTOR 01</span>
        </div>

        <div
          className="relative bg-[#0d1109] border border-tac-paper/10 overflow-hidden"
          style={{ width: MAP_W, height: MAP_H }}
        >
          {/* grid */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(rgba(95,168,106,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(95,168,106,0.14) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          {/* radar sweep */}
          <div
            className="absolute w-full h-full"
            style={{
              background:
                "conic-gradient(from 0deg, rgba(232,163,61,0.13), transparent 22%)",
              animation: "sweep 5s linear infinite",
              transformOrigin: "center",
            }}
          />
          {/* road line */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-[3px] bg-tac-gray/40"
            style={{ top: 0, bottom: 0 }}
          />

          {/* camera position dot */}
          <div
            className="absolute z-10 w-2 h-2 bg-tac-cyan rounded-full"
            style={{ left: cam.left - 4, top: cam.top - 4 }}
          />
          <div
            className="absolute z-10 w-2 h-2 bg-tac-cyan rounded-full"
            style={{
              left: cam.left - 4,
              top: cam.top - 4,
              animation: "ping 2.4s cubic-bezier(0,0,0.2,1) infinite",
            }}
          />

          {/* locations */}
          {locations.map((l) => {
            const p = toMap(l.pos[0], l.pos[1]);
            const active = l.id === activeLocation;
            return (
              <button
                key={l.id}
                onClick={() => goto(l.id)}
                title={`${l.name} — ${l.represents}`}
                aria-label={`Go to ${l.name} (${l.represents})`}
                aria-current={active ? "true" : undefined}
                className="absolute z-20 group -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6"
                style={{ left: p.left, top: p.top }}
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    active
                      ? "w-3 h-3 bg-tac-orange"
                      : "w-2 h-2 bg-tac-green/70 group-hover:bg-tac-orange"
                  }`}
                />
                {active && (
                  <span
                    className="absolute inset-0 rounded-full border border-tac-orange/60"
                    style={{ animation: "ping 2s cubic-bezier(0,0,0.2,1) infinite" }}
                  />
                )}
                <span
                  className={`absolute left-1/2 -translate-x-1/2 top-full mt-0.5 font-mono-t text-[7px] tracking-[0.12em] whitespace-nowrap transition-opacity ${
                    active ? "text-tac-orange opacity-100" : "opacity-0 group-hover:opacity-100 text-tac-dim"
                  }`}
                >
                  {l.short}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-2 hud-label flex justify-between">
          <span className="text-tac-dim">
            {locations.find((l) => l.id === activeLocation)?.name}
          </span>
          <span className="text-tac-green">SYS ONLINE</span>
        </div>
      </div>
    </nav>
  );
}
