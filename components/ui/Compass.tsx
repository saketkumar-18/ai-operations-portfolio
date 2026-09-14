"use client";

// ============================================================
// components/ui/Compass.tsx — top compass strip, responds to
// camera yaw. Shows heading letters + Delhi coordinates.
// ============================================================

import { useEffect, useState } from "react";
import { useWorld } from "../../lib/store";
import { COORDS, formatCoord } from "../../lib/utils";

const HEADINGS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

export default function Compass() {
  const journey = useWorld((s) => s.journey);
  const [heading, setHeading] = useState("N");

  // camera always faces -Z into the compound; derive a pseudo-yaw
  // from lateral journey movement for the compass strip.
  useEffect(() => {
    const idx = Math.round((journey * 8) % 8);
    setHeading(HEADINGS[idx]);
  }, [journey]);

  const { latS, lonS } = formatCoord(COORDS.delhi.lat, COORDS.delhi.lon);

  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-40 pointer-events-none select-none"
      aria-hidden="true"
    >
      <div className="tac-panel brackets px-5 py-1.5 flex items-center gap-4">
        <div className="flex items-center gap-2 font-mono-t text-[11px] tracking-[0.25em] text-tac-dim">
          {HEADINGS.map((h) => (
            <span
              key={h}
              className={
                h === heading
                  ? "text-tac-orange"
                  : h.length === 1
                  ? "text-tac-paper/70"
                  : "text-tac-gray/40"
              }
            >
              {h}
            </span>
          ))}
        </div>
        <div className="w-px h-4 bg-tac-orange/30" />
        <div className="font-mono-t text-[10px] tracking-[0.18em] text-tac-gray">
          {latS} · {lonS}
        </div>
      </div>
    </div>
  );
}
