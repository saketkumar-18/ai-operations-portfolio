"use client";

// ============================================================
// components/world/FacilityKit.tsx
// Shared procedural facility primitives: walls, floors, holo
// screens, consoles, crates, towers. Reused across locations.
// ============================================================

import { useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export const MAT = {
  wall: "#2c3122",
  wallDark: "#1e2418",
  metal: "#3a3f30",
  floor: "#191d13",
  green: "#5fa86a",
  orange: "#e8a33d",
  cyan: "#4fa3c7",
  paper: "#e8e6da",
};

/* Canvas-texture text plate — used everywhere for labels */
export function TextPlate3D({
  text,
  width = 6,
  height = 1,
  sub,
  accent = MAT.orange,
  align = "center",
  small = false,
}: {
  text: string;
  width?: number;
  height?: number;
  sub?: string;
  accent?: string;
  align?: "center" | "left";
  small?: boolean;
}) {
  const tex = useMemo(() => {
    const scale = 4;
    const c = document.createElement("canvas");
    c.width = Math.round(width * 64 * scale * 0.25 * 4);
    c.height = Math.round(height * 64 * scale * 0.25 * 4);
    const ctx = c.getContext("2d")!;
    const W = c.width, H = c.height;
    ctx.fillStyle = "rgba(10,12,8,0.88)";
    ctx.fillRect(0, 0, W, H);
    // frame
    ctx.strokeStyle = "rgba(232,163,61,0.35)";
    ctx.lineWidth = 3;
    ctx.strokeRect(4, 4, W - 8, H - 8);
    const mainSize = small ? H * 0.34 : H * 0.42;
    ctx.font = `700 ${mainSize}px 'Space Mono', monospace`;
    ctx.textAlign = align === "center" ? "center" : "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = accent;
    const tx = align === "center" ? W / 2 : W * 0.05;
    ctx.fillText(text, tx, sub ? H * 0.36 : H * 0.52);
    if (sub) {
      ctx.font = `400 ${H * 0.2}px 'Space Mono', monospace`;
      ctx.fillStyle = "rgba(232,230,218,0.75)";
      ctx.fillText(sub, tx, H * 0.74);
    }
    return new THREE.CanvasTexture(c);
  }, [text, sub, width, height, accent, align, small]);

  return (
    <mesh>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={tex} transparent toneMapped={false} />
    </mesh>
  );
}

/* Holographic screen with animated scanline */
export function HoloScreen({
  position,
  rotationY = 0,
  width = 5,
  height = 2.6,
  accent = MAT.cyan,
  lines,
  label,
}: {
  position: [number, number, number];
  rotationY?: number;
  width?: number;
  height?: number;
  accent?: string;
  lines: string[];
  label?: string;
}) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512; c.height = Math.round(512 * (height / width));
    const ctx = c.getContext("2d")!;
    const W = c.width, H = c.height;
    ctx.fillStyle = "rgba(8,12,10,0.94)";
    ctx.fillRect(0, 0, W, H);
    // grid
    ctx.strokeStyle = "rgba(79,163,199,0.09)";
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      ctx.moveTo(0, (i / 12) * H);
      ctx.lineTo(W, (i / 12) * H);
      ctx.stroke();
    }
    // waveform — "signal"
    ctx.strokeStyle = accent;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x <= W; x += 6) {
      const y =
        H * 0.32 +
        Math.sin(x * 0.045) * H * 0.055 * Math.sin(x * 0.008) +
        Math.sin(x * 0.12) * H * 0.014;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
    // text lines
    ctx.font = "700 26px 'Space Mono', monospace";
    ctx.fillStyle = accent;
    if (label) {
      ctx.fillText(label.toUpperCase(), 22, 46);
      ctx.strokeStyle = "rgba(232,230,218,0.25)";
      ctx.beginPath(); ctx.moveTo(22, 60); ctx.lineTo(W - 22, 60); ctx.stroke();
    }
    ctx.font = "400 22px 'Space Mono', monospace";
    ctx.fillStyle = "rgba(232,230,218,0.85)";
    lines.forEach((ln, i) => {
      ctx.fillText(ln, 22, 96 + i * 34);
    });
    return new THREE.CanvasTexture(c);
  }, [lines, label, accent, width, height]);

  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(({ clock }) => {
    if (matRef.current) {
      const t = clock.elapsedTime;
      matRef.current.opacity = 0.82 + Math.sin(t * 1.7) * 0.06;
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial
          ref={matRef}
          map={tex}
          transparent
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* projector beam base */}
      <mesh position={[0, -height / 2 - 0.08, 0]}>
        <boxGeometry args={[width * 0.9, 0.1, 0.34]} />
        <meshStandardMaterial color={MAT.metal} roughness={0.6} metalness={0.4} />
      </mesh>
      <pointLight color={accent} intensity={4} distance={9} position={[0, 0, 0.6]} />
    </group>
  );
}

/* Floor platform for rooms */
export function Platform({
  w = 24,
  d = 20,
  position = [0, 0, 0],
  children,
  glowColor,
}: {
  w?: number;
  d?: number;
  position?: [number, number, number];
  children?: ReactNode;
  glowColor?: string;
}) {
  return (
    <group position={position}>
      <mesh receiveShadow position={[0, 0.05, 0]}>
        <boxGeometry args={[w, 0.12, d]} />
        <meshStandardMaterial color={MAT.floor} roughness={0.85} />
      </mesh>
      {/* perimeter glow strip */}
      {glowColor && (
        <mesh position={[0, 0.12, d / 2 - 0.18]}>
          <boxGeometry args={[w * 0.96, 0.04, 0.06]} />
          <meshBasicMaterial color={glowColor} />
        </mesh>
      )}
      {children}
    </group>
  );
}

/* Server rack */
export function ServerRack({
  position,
  rotationY = 0,
}: {
  position: [number, number, number];
  rotationY?: number;
}) {
  const lightsRef = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (lightsRef.current) {
      lightsRef.current.children.forEach((c, i) => {
        const m = (c as THREE.Mesh).material as THREE.MeshBasicMaterial;
        m.opacity = 0.35 + ((Math.sin(clock.elapsedTime * (2 + i * 0.7) + i) + 1) / 2) * 0.65;
      });
    }
  });
  const units = useMemo(() => [0, 1, 2, 3, 4, 5, 6], []);
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      <mesh castShadow position={[0, 1.1, 0]}>
        <boxGeometry args={[1.1, 2.2, 0.9]} />
        <meshStandardMaterial color="#22271b" roughness={0.7} metalness={0.3} />
      </mesh>
      <group ref={lightsRef}>
        {units.map((u) => (
          <mesh key={u} position={[0.56, 0.35 + u * 0.27, 0]}>
            <boxGeometry args={[0.03, 0.07, 0.5]} />
            <meshBasicMaterial
              color={u % 3 === 0 ? "#5fa86a" : "#4fa3c7"}
              transparent
              opacity={0.6}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* Rotating hologram marker (used on crates & points of interest) */
export function HoloMarker({
  position,
  color = MAT.orange,
  scale = 1,
}: {
  position: [number, number, number];
  color?: string;
  scale?: number;
}) {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!g.current) return;
    g.current.rotation.y = clock.elapsedTime * 0.8;
    g.current.position.y = position[1] + Math.sin(clock.elapsedTime * 1.6) * 0.16;
  });
  return (
    <group ref={g} position={position} scale={scale}>
      <mesh>
        <octahedronGeometry args={[0.32]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.9} />
      </mesh>
      <mesh>
        <octahedronGeometry args={[0.2]} />
        <meshBasicMaterial color={color} transparent opacity={0.28} />
      </mesh>
    </group>
  );
}

/* Data beam between two points (cloud ops) */
export function DataBeam({
  from,
  to,
  color = MAT.cyan,
}: {
  from: [number, number, number];
  to: [number, number, number];
  color?: string;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const { mid, len, quat } = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const m = a.clone().add(b).multiplyScalar(0.5);
    const l = a.distanceTo(b);
    const dir = b.clone().sub(a).normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      dir
    );
    return { mid: m, len: l, quat: q };
  }, [from, to]);

  useFrame(({ clock }) => {
    if (ref.current) {
      const m = ref.current.material as THREE.MeshBasicMaterial;
      m.opacity = 0.25 + Math.abs(Math.sin(clock.elapsedTime * 2)) * 0.35;
    }
  });

  return (
    <mesh
      ref={ref}
      position={mid}
      quaternion={quat}
    >
      <cylinderGeometry args={[0.03, 0.03, len, 6]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} />
    </mesh>
  );
}
