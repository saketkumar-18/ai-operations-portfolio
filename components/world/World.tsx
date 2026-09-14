"use client";

// ============================================================
// components/world/World.tsx
// Assembles the full 3D world. Loaded dynamically ONLY on
// capable desktop clients (see app/page.tsx).
// ============================================================

import { Canvas } from "@react-three/fiber";
import { Suspense, useMemo } from "react";
import * as THREE from "three";
import Environment from "./Environment";
import CameraController from "../three/CameraController";
import PerformanceManager from "../three/PerformanceManager";
import PlaneDrop from "../three/PlaneDrop";
import CommandCenter from "./locations/CommandCenter";
import TrainingGround from "./locations/TrainingGround";
import MissionArchive from "./locations/MissionArchive";
import ResearchDivision from "./locations/ResearchDivision";
import CloudOperations from "./locations/CloudOperations";
import CommunicationTower from "./locations/CommunicationTower";
import { useWorld } from "../../lib/store";
import { detectDevice } from "../../lib/device";

export default function World() {
  const setWebglOK = useWorld((s) => s.setWebglOK);
  const setLowSpec = useWorld((s) => s.setLowSpec);
  const reduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
  const device = useMemo(() => detectDevice(), []);

  const dpr = device.isLowSpec ? [1, 1.25] : [1, 1.8];

  // journey sync: match world elevation to terrain? keep flat for simplicity.

  return (
    <div className="fixed inset-0 z-0" aria-hidden={true}>
      <Canvas
        shadows={false}
        dpr={dpr as [number, number]}
        gl={{
          antialias: !device.isLowSpec,
          powerPreference: "high-performance",
          alpha: false,
        }}
        camera={{ fov: 55, near: 0.5, far: 900, position: [0, 6.5, 46] }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.28;
          setWebglOK(true);
          setLowSpec(device.isLowSpec);
        }}
      >
        <Suspense fallback={null}>
          <PerformanceManager />
          <PlaneDrop />
          <CameraController reduced={reduced} />
          <Environment lowSpec={device.isLowSpec} />
          <CommandCenter />
          <TrainingGround />
          <MissionArchive />
          <ResearchDivision />
          <CloudOperations />
          <CommunicationTower />
        </Suspense>
      </Canvas>
    </div>
  );
}
