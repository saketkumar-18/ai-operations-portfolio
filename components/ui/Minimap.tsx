"use client";

// ============================================================
// components/ui/Minimap.tsx — PUBG-style bottom-right minimap:
// square map, plane flight line while airborne, white drop
// marker, safe-zone circle, player arrow, location blips.
// ============================================================

import { useMemo, useState } from "react";
import { locations } from "../../data/navigation";
import { useWorld } from "../../lib/store";

const MAP = 230;
const X_MIN = -620, X_MAX = 620; // world x extent (plane path)
const Z_MIN = -560, Z_MAX = 200;

const toMap = (x: number, z: number) => ({
  left: ((x - X_MIN) / (X_MAX - X_MIN)) * MAP,
  top: ((Z_MAX - z) / (Z_MAX - Z_MIN)) * MAP,
});

export default function Minimap() {
  const activeLocation = useWorld((s) => s.activeLocation);
  const goto = useWorld((s) => s.goto);
  const journey = useWorld((s) => s.journey);
  const phase = useWorld((s) => s.phase);
  const altitude = useWorld((s) => s.altitude);
  const [expanded, setExpanded] = useState(false);

  const size = expanded ? 340 : MAP;

  // player position during flight = along flight line at ~86% path when jumping
  const flightLine = useMemo(() => {
    const a = toMap(-620, -560);
    const b = toMap(620, 200);
    return { a, b };
  }, []);

  const planePos = useMemo(() => {
    // plane moves over ~26s; approximate by elapsed phase time
    const t = Math.min(1, (Date.now() % 26000) / 26000);
    return {
      left: flightLine.a.left + (flightLine.b.left - flightLine.a.left) * t,
      top: flightLine.a.top + (flightLine.b.top - flightLine.a.top) * t,
    };
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const cam = useMemo(() => {
    const z = 46 - journey * 382;
    const x = Math.sin(journey * Math.PI * 3) * 18;
    return toMap(x, z);
  }, [journey]);

  // compound zone circle: the operations compound center (0, -170), radius ~180m
  const zone = useMemo(() => {
    const c = toMap(0, -170);
    const r = ((180 / (X_MAX - X_MIN)) * MAP) * (size / MAP);
    return { ...c, r };
  }, [size]);

  return (
    <nav
      className="fixed bottom-4 right-4 z-40 select-none"
      aria-label="World minimap navigation"
    >
      <div
        className="relative border-2 border-black/70 shadow-2xl"
        style={{ width: size, height: size }}
      >
        {/* map surface */}
        <div className="absolute inset-0 bg-[#0d1109] overflow-hidden">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(rgba(95,168,106,0.14) 1px, transparent 1px), linear-gradient(90deg, rgba(95,168,106,0.14) 1px, transparent 1px)",
              backgroundSize: `${size / 6}px ${size / 6}px`,
            }}
          />

          {/* safe zone circle */}
          <div
            className="absolute rounded-full border-2 border-white/70"
            style={{
              left: zone.left * (size / MAP) - zone.r,
              top: zone.top * (size / MAP) - zone.r,
              width: zone.r * 2,
              height: zone.r * 2,
              boxShadow: "inset 0 0 30px rgba(255,255,255,0.08)",
            }}
          />

          {/* road */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-[2.5px] bg-tac-gray/40"
            style={{ top: 0, bottom: 0 }}
          />

          {/* flight line while airborne */}
          {(phase === "plane" || phase === "drop") && (
            <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
              <line
                x1={(flightLine.a.left * size) / MAP}
                y1={(flightLine.a.top * size) / MAP}
                x2={(flightLine.b.left * size) / MAP}
                y2={(flightLine.b.top * size) / MAP}
                stroke="#e8e6da"
                strokeWidth="1.6"
                strokeDasharray="7 5"
                opacity="0.85"
              />
            </svg>
          )}

          {/* plane icon */}
          {phase === "plane" && (
            <div
              className="absolute z-10 -translate-x-1/2 -translate-y-1/2 text-tac-paper text-[15px] font-bold"
              style={{
                left: (planePos.left * size) / MAP,
                top: (planePos.top * size) / MAP,
                transform: "translate(-50%,-50%) rotate(-31deg)",
              }}
              aria-label="Cargo plane position"
            >
              ✈
            </div>
          )}

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
                className="absolute z-20 group -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-7 h-7"
                style={{ left: (p.left * size) / MAP, top: (p.top * size) / MAP }}
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    active
                      ? "w-3.5 h-3.5 bg-tac-orange ring-2 ring-white/70"
                      : "w-2.5 h-2.5 bg-tac-green/80 group-hover:bg-tac-orange"
                  }`}
                />
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

          {/* player arrow (ground) */}
          {phase === "ground" && (
            <div
              className="absolute z-10"
              style={{
                left: (cam.left * size) / MAP - 7,
                top: (cam.top * size) / MAP - 7,
              }}
            >
              <div
                className="w-3.5 h-3.5 border-t-[7px] border-x-[5px] border-b-0 border-t-tac-cyan border-x-transparent"
                style={{ transform: "rotate(180deg)" }}
              />
            </div>
          )}

          {/* freefall player marker */}
          {phase === "drop" && (
            <div
              className="absolute z-10 w-2.5 h-2.5 rounded-full bg-white border-2 border-black/60"
              style={{
                left: (cam.left * size) / MAP - 5,
                top: (cam.top * size) / MAP - 5,
              }}
            />
          )}
        </div>

        {/* top strip: sector + altitude */}
        <div className="absolute top-0 inset-x-0 flex justify-between px-2 py-1 bg-black/70 font-mono-t text-[9px] tracking-[0.15em] text-tac-dim">
          <span>SECTOR 01 · AI OPS</span>
          <span>
            {(phase === "plane" && "ALT 260M") ||
              (phase === "drop" && `ALT ${Math.round(altitude)}M`) ||
              "ON GROUND"}
          </span>
        </div>

        {/* expand toggle */}
        <button
          className="absolute bottom-0 right-0 px-1.5 py-0.5 bg-black/70 text-tac-dim font-mono-t text-[9px] hover:text-tac-orange"
          onClick={() => setExpanded(!expanded)}
          aria-label={expanded ? "Minimize map" : "Expand map"}
        >
          {expanded ? "▾" : "▴"}
        </button>
      </div>
    </nav>
  );
}
