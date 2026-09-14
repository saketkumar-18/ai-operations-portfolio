"use client";

// ============================================================
// components/ui/LoadingScreen.tsx — cinematic boot sequence.
// Types system lines, then ENTER THE SYSTEM CTA.
// ============================================================

import { useEffect, useRef, useState } from "react";
import { profile } from "../../data/profile";
import { useWorld } from "../../lib/store";

const SEQ: { text: string; delay: number }[] = [
  { text: "INITIALIZING SAKET.OS", delay: 420 },
  { text: "[ SYSTEM STATUS ]", delay: 360 },
  { text: "AI CORE ........ ONLINE", delay: 340 },
  { text: "NEURAL SYSTEM .. ONLINE", delay: 340 },
  { text: "PROJECT DATA ... LOADED", delay: 340 },
  { text: "MISSION ARCHIVE LOADED", delay: 340 },
  { text: `OPERATOR: ${profile.name}`, delay: 460 },
  { text: "STATUS: ACTIVE", delay: 380 },
  { text: "SYSTEM READY.", delay: 500 },
];

export default function LoadingScreen() {
  const setStarted = useWorld((s) => s.setStarted);
  const toast = useWorld((s) => s.toast);
  const [lines, setLines] = useState<string[]>([]);
  const [done, setDone] = useState(false);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    // schedule every line with its own stable timer — StrictMode-proof
    let acc = 350;
    SEQ.forEach((s, i) => {
      acc += s.delay;
      const t = window.setTimeout(() => {
        setLines((l) => [...l, SEQ[i].text]);
        if (i === SEQ.length - 1) {
          timers.current.push(window.setTimeout(() => setDone(true), 450));
        }
      }, acc);
      timers.current.push(t);
    });
    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
    };
  }, []);

  const enter = (explore: boolean) => {
    timers.current.forEach((t) => window.clearTimeout(t));
    setStarted(true);
    toast(explore ? "OPERATIONS OVERVIEW OPEN" : "WORLD ENTRY CONFIRMED", "nav");
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-tac-bg flex items-center justify-center transition-opacity duration-700"
      role="dialog"
      aria-label="System loading"
    >
      <div className="w-full max-w-md px-6">
        <div className="font-mono-t text-[11px] tracking-[0.3em] text-tac-gray mb-1">
          SECURE CHANNEL // 28.6139°N 77.2090°E
        </div>
        <div className="w-full h-px bg-tac-orange/25 mb-8" />

        <div className="space-y-2 min-h-[280px]" aria-live="polite">
          {lines.map((l, i) => (
            <p
              key={`${i}-${l}`}
              className={`font-mono-t text-[13px] anim-rise ${
                l === "SYSTEM READY."
                  ? "text-tac-green"
                  : l.startsWith("OPERATOR")
                  ? "text-tac-orange"
                  : "text-tac-dim"
              }`}
            >
              {l}
            </p>
          ))}
        </div>

        <div
          className={`transition-all duration-700 ${
            done ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
          }`}
        >
          <div className="w-full h-px bg-tac-orange/25 my-8" />
          <h1 className="font-display font-bold text-4xl md:text-5xl tracking-tight mb-2">
            SAKET <span className="text-tac-orange">KUMAR</span>
          </h1>
          <p className="font-mono-t text-[11px] tracking-[0.28em] text-tac-dim mb-1">
            {profile.roles.join(" · ")}
          </p>
          <p className="text-sm text-tac-gray mb-8 italic">{profile.motto}</p>

          <div className="flex flex-wrap gap-4">
            <button className="btn-tac solid" onClick={() => enter(false)}>
              ENTER THE SYSTEM
            </button>
            <button className="btn-tac ghost" onClick={() => enter(true)}>
              EXPLORE OPERATIONS
            </button>
          </div>
          <p className="font-mono-t text-[10px] tracking-[0.2em] text-tac-gray/70 mt-6">
            SCROLL DRIVES THE CAMERA · MINIMAP JUMPS BETWEEN SECTORS · RECRUITER MODE AVAILABLE
          </p>
        </div>
      </div>
      <div className="absolute inset-0 scanlines pointer-events-none" />
    </div>
  );
}
