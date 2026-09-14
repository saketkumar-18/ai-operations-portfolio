"use client";

// ============================================================
// components/three/CameraController.tsx
// Cinematic scroll-journey camera: world entry → gate →
// compound corridor → locations. Damped, subtle handheld sway,
// responds to targetJourney jumps from nav/minimap/assistant.
// ============================================================

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { locations, worldEntry, compoundGate } from "../../data/navigation";
import { useWorld } from "../../lib/store";
import { damp, clamp } from "../../lib/utils";

// Camera path keyframes: journey t → position
interface KeyPoint {
  t: number;
  pos: THREE.Vector3;
  look: THREE.Vector3;
}

export default function CameraController({ reduced }: { reduced: boolean }) {
  const { camera } = useThree();
  const journeyRef = useRef(0);
  const smooth = useRef(new THREE.Vector3(0, 6, 46));
  const lookRef = useRef(new THREE.Vector3(0, 3, 0));
  const shakeT = useRef(0);

  // Build key points from data locations
  const keyPoints = useRef<KeyPoint[]>([]);
  useEffect(() => {
    const pts: KeyPoint[] = [];
    // world entry: distant view of facility from outside
    pts.push({
      t: 0,
      pos: new THREE.Vector3(0, 6.5, 46),
      look: new THREE.Vector3(0, 5, -10),
    });
    // approach gate
    pts.push({
      t: 0.08,
      pos: new THREE.Vector3(0, 4.6, 22),
      look: new THREE.Vector3(0, 4.5, -10),
    });
    // passing through gate (inside compound)
    pts.push({
      t: 0.14,
      pos: new THREE.Vector3(0, 4.2, -12),
      look: new THREE.Vector3(0, 4, -40),
    });
    for (const loc of locations) {
      const [x, z] = loc.pos;
      const cx = x === 0 ? 0.001 : x * 0.35 * (x > 0 ? -1 : 1);
      const approachX = x + (x === 0 ? 9 : x > 0 ? 11 : -11);
      // approach point slightly offset from the location
      pts.push({
        t: loc.journey - 0.02 < 0 ? 0 : loc.journey - 0.02,
        pos: new THREE.Vector3(approachX, loc.cameraY + 1.2, z + 26),
        look: new THREE.Vector3(x, loc.cameraY, z),
      });
      // main stop
      pts.push({
        t: loc.journey,
        pos: new THREE.Vector3(approachX, loc.cameraY + 0.6, z + 15),
        look: new THREE.Vector3(x, loc.cameraY - 0.4, z),
      });
    }
    // ensure sorted
    pts.sort((a, b) => a.t - b.t);
    keyPoints.current = pts;
  }, []);

  // scroll → targetJourney
  useEffect(() => {
    const maxScroll = () =>
      Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const j = clamp(window.scrollY / maxScroll(), 0, 1);
        useWorld.getState().setTargetJourney(j);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useFrame((state, dt) => {
    const { targetJourney, setJourney, activeProject, setActiveLocation, phase } =
      useWorld.getState();

    // plane & freefall own the camera
    if (phase === "plane" || phase === "drop") return;

    // if dossier open, freeze camera
    if (activeProject) return;

    // damp journey toward target (fast catchup on nav clicks, gentle on scroll)
    journeyRef.current = damp(journeyRef.current, targetJourney, 3.2, dt);
    setJourney(journeyRef.current);

    // sample path
    const j = journeyRef.current;
    const pts = keyPoints.current;
    let a = pts[0];
    let b = pts[pts.length - 1];
    for (let i = 0; i < pts.length - 1; i++) {
      if (j >= pts[i].t && j <= pts[i + 1].t) {
        a = pts[i];
        b = pts[i + 1];
        break;
      }
    }
    const span = Math.max(0.0001, b.t - a.t);
    const local = clamp((j - a.t) / span, 0, 1);
    // smootherstep for cinematic ease
    const e = local * local * local * (local * (local * 6 - 15) + 10);

    const px = THREE.MathUtils.lerp(a.pos.x, b.pos.x, e);
    const py = THREE.MathUtils.lerp(a.pos.y, b.pos.y, e);
    const pz = THREE.MathUtils.lerp(a.pos.z, b.pos.z, e);
    const lx = THREE.MathUtils.lerp(a.look.x, b.look.x, e);
    const ly = THREE.MathUtils.lerp(a.look.y, b.look.y, e);
    const lz = THREE.MathUtils.lerp(a.look.z, b.look.z, e);

    // subtle handheld sway (skipped in reduced motion)
    let sx = 0, sy = 0;
    if (!reduced) {
      const t = state.clock.elapsedTime;
      sx = Math.sin(t * 0.42) * 0.14 + Math.sin(t * 0.9) * 0.05;
      sy = Math.sin(t * 0.31) * 0.1;
    }

    smooth.current.set(
      damp(smooth.current.x, px, 4.2, dt),
      damp(smooth.current.y, py + sy, 4.2, dt),
      damp(smooth.current.z, pz, 4.2, dt)
    );
    lookRef.current.set(
      damp(lookRef.current.x, lx, 5, dt),
      damp(lookRef.current.y, ly + sy * 0.4, 5, dt),
      damp(lookRef.current.z, lz, 5, dt)
    );

    camera.position.copy(smooth.current);
    camera.position.x += sx * 0.4;

    // subtle shake decay (set by door/gate events via window event)
    camera.position.x += Math.sin(shakeT.current * 55) * shakeT.current * 0.14;
    camera.position.y += Math.cos(shakeT.current * 47) * shakeT.current * 0.1;
    shakeT.current = Math.max(0, shakeT.current - dt * 0.8);

    camera.lookAt(lookRef.current);

    // determine active location from journey
    let active = locations[0].id;
    let best = Infinity;
    for (const loc of locations) {
      const d = Math.abs(loc.journey - j);
      if (d < best) { best = d; active = loc.id; }
    }
    const prev = useWorld.getState().activeLocation;
    if (active !== prev) setActiveLocation(active, best < 0.08);
  });

  // listen for shake events (gate pass etc.)
  useEffect(() => {
    const onShake = () => { shakeT.current = 0.5; };
    window.addEventListener("sak-shake", onShake);
    return () => window.removeEventListener("sak-shake", onShake);
  }, []);

  return null;
}
