"use client";

// ============================================================
// components/ui/Compass.tsx — PUBG-style top compass strip:
// bearing tape (N…NE…E…) sliding with camera yaw, tick marks,
// current heading readout, drop-target marker during flight.
// ============================================================

import { useEffect, useRef, useState } from "react";
import { useWorld } from "../../lib/store";

// full bearing tape repeated for wrap
const TAPE: { deg: number; label: string; major: boolean }[] = [];
for (let d = 0; d < 360; d += 15) {
  const labels: Record<number, string> = {
    0: "N", 45: "NE", 90: "E", 135: "SE", 180: "S", 225: "SW", 270: "W", 315: "NW",
  };
  TAPE.push({ deg: d, label: labels[d] ?? "", major: d % 45 === 0 });
}

export default function Compass() {
  const phase = useWorld((s) => s.phase);
  const journey = useWorld((s) => s.journey);
  const [heading, setHeading] = useState(180); // plane flies S→N? our world: facing -Z = North(0°)
  const [planeBearing, setPlaneBearing] = useState<number | null>(null);
  const raf = useRef(0);

  // heading from camera each frame (cheap: read camera via world store signals)
  useEffect(() => {
    const tick = () => {
      // during plane/drop phases the camera is driven by PlaneDrop — derive heading
      // from the fixed flight line: from (-620,-560) to (620,200) → bearing
      if (phase === "plane" || phase === "drop") {
        const bearing = Math.round(((Math.atan2(1240, 760) * 180) / Math.PI + 360) % 360);
        setPlaneBearing(bearing);
        setHeading(bearing);
      } else {
        // journey camera faces deeper into the compound; heading = f(journey)
        // lateral swings from the path create natural bearing changes
        const h = Math.round((180 + Math.sin(journey * Math.PI * 2.2) * 40 + 360) % 360);
        setHeading(h);
        setPlaneBearing(null);
      }
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [phase, journey]);

  const pxPerDeg = 3.4;
  const width = 340;

  const ticks = TAPE.concat(TAPE.map((t) => ({ ...t, deg: t.deg + 360 })));

  return (
    <div
      className="fixed top-3 left-1/2 -translate-x-1/2 z-40 pointer-events-none select-none"
      aria-label="Compass"
    >
      <div className="relative" style={{ width, height: 34 }}>
        <div className="absolute inset-0 overflow-hidden bg-black/55 border border-white/15">
          {/* center reticle */}
          <div className="absolute left-1/2 top-0 -translate-x-1/2 w-0.5 h-full bg-tac-orange/90 z-10" />
          {/* bearing tape */}
          <div
            className="absolute top-0 left-0 h-full"
            style={{
              transform: `translateX(${width / 2 - ((heading * pxPerDeg) % (360 * pxPerDeg))}px)`,
              width: 360 * pxPerDeg * 2,
            }}
          >
            {ticks.map((t, i) => {
              const x = t.deg * pxPerDeg;
              return (
                <div key={i} className="absolute top-0" style={{ left: x }}>
                  {t.major ? (
                    <div className="flex flex-col items-center -translate-x-1/2">
                      <span className="text-tac-paper font-mono-t text-[11px] leading-none mt-1.5 tracking-wider">
                        {t.label}
                      </span>
                      <div className="w-px h-2 bg-tac-paper/80 mt-1" />
                    </div>
                  ) : (
                    <div className="w-px h-1.5 bg-white/35 -translate-x-1/2 mt-2" />
                  )}
                </div>
              );
            })}
          </div>
          {/* drop target marker on tape during flight */}
          {planeBearing !== null && (
            <div
              className="absolute top-0 z-10 -translate-x-1/2 flex flex-col items-center"
              style={{
                left: width / 2 + ((planeBearing - heading + 540) % 360 - 180) * pxPerDeg,
              }}
            >
              <span className="text-[10px] leading-none mt-0.5">▼</span>
            </div>
          )}
        </div>
        {/* heading readout */}
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-4 font-mono-t text-[10px] text-tac-orange tracking-[0.2em] bg-black/60 px-2 py-0.5 border border-tac-orange/30">
          {String(Math.round(heading)).padStart(3, "0")}°
        </div>
      </div>
    </div>
  );
}
