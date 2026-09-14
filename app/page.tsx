"use client";

// ============================================================
// app/page.tsx — Experience router:
//   boot → (desktop+WebGL) cinematic 3D world
//        → (mobile/no-WebGL) lightweight 2.5D fallback
//        → (toggle) recruiter mode
// The 3D world is dynamically imported and code-split.
// ============================================================

import dynamic from "next/dynamic";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useWorld } from "../lib/store";
import { detectDevice } from "../lib/device";
import LoadingScreen from "../components/ui/LoadingScreen";
import HUD from "../components/ui/HUD";
import Compass from "../components/ui/Compass";
import Minimap from "../components/ui/Minimap";
import RecruiterMode from "../components/ui/RecruiterMode";
import Fallback2D from "../components/ui/Fallback2D";

const World = dynamic(() => import("../components/world/World"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 z-0 bg-tac-bg flex items-center justify-center">
      <p className="font-mono-t text-[11px] tracking-[0.3em] text-tac-gray anim-flicker">
        LOADING WORLD…
      </p>
    </div>
  ),
});

export default function Experience() {
  const mode = useWorld((s) => s.mode);
  const started = useWorld((s) => s.started);
  const [device, setDevice] = useState<ReturnType<typeof detectDevice> | null>(null);

  useEffect(() => {
    setDevice(detectDevice());
  }, []);

  const use3D = useMemo(
    () => !!device && device.webglOK && !device.isMobile && !device.isLowSpec,
    [device]
  );

  // boot → world transition: start on the plane (battle-royale insert)
  const entered = mode === "world" || mode === "recruiter";

  useEffect(() => {
    if (started && mode === "boot") {
      // default: deploy to world (plane). Recruiter mode was set directly in enter().
      useWorld.getState().setMode("world");
      useWorld.getState().setPhase("plane");
      useWorld.getState().toast("CARGO PLANE INBOUND — SPACE / CLICK TO JUMP", "nav");
    }
  }, [started, mode]);

  // keyboard navigation: number keys jump locations (ground phase only)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      const n = parseInt(e.key, 10);
      if (n >= 1 && n <= 6 && useWorld.getState().phase === "ground") {
        const locs = ["command", "training", "archive", "research", "cloud", "comms"];
        useWorld.getState().goto(locs[n - 1] as never);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (mode === "boot") return <LoadingScreen />;

  if (mode === "recruiter") return <RecruiterMode />;

  // no WebGL or mobile → 2.5D cinematic fallback
  if (!use3D) return <Fallback2D />;

  return (
    <>
      {/* 3D world behind everything */}
      <World />

      {/* scroll runway keeps the page scrollable for camera journey */}
      <div style={{ height: 6400 }} aria-hidden />

      {/* HUD overlays */}
      <HUD />
      <Compass />
      <Minimap />

      {/* vignette */}
      <div
        className="fixed inset-0 z-30 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 58%, rgba(5,6,3,0.55) 100%)",
        }}
        aria-hidden
      />
    </>
  );
}
