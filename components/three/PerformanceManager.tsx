"use client";

// ============================================================
// components/three/PerformanceManager.tsx
// Adaptive quality: watches fps, drops dpr / particle counts.
// ============================================================

import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { useWorld } from "../../lib/store";

export default function PerformanceManager() {
  const { gl, invalidate } = useThree();

  useEffect(() => {
    let frames = 0;
    let last = performance.now();
    let lowTicks = 0;
    let raf = 0;

    const tick = () => {
      frames++;
      const now = performance.now();
      if (now - last >= 3000) {
        const fps = frames / ((now - last) / 1000);
        frames = 0;
        last = now;
        if (fps < 34) {
          lowTicks++;
          if (lowTicks === 1) {
            gl.setPixelRatio(Math.max(1, window.devicePixelRatio * 0.66));
          } else if (lowTicks === 2) {
            gl.setPixelRatio(1);
            useWorld.getState().setLowSpec(true);
          }
        } else if (fps > 50) {
          lowTicks = 0;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [gl]);

  return null;
}
