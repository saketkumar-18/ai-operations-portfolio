"use client";

// ============================================================
// components/world/Environment.tsx
// Roads, gate, compound wall, fog/haze planes, lighting rig,
// sky dome, dust particles. All procedural — no external assets.
// ============================================================

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Mountains, Trees } from "./Terrain";

/* ---------------- lighting ---------------- */
export function Lighting() {
  const sunRef = useRef<THREE.DirectionalLight>(null);
  const sunPos = useMemo(() => new THREE.Vector3(-140, 120, -220), []);
  return (
    <>
      <hemisphereLight args={["#9aa88f", "#1a1f14", 0.75]} />
      <directionalLight
        ref={sunRef}
        position={sunPos}
        intensity={1.45}
        color="#ffd9a0"
      />
      <directionalLight position={[80, 40, -60]} intensity={0.38} color="#7fa6c9" />
      <ambientLight intensity={0.2} />
    </>
  );
}

/* ---------------- sky dome ---------------- */
export function SkyDome() {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 16; c.height = 256;
    const ctx = c.getContext("2d")!;
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0.0, "#0d120b");   // zenith
    grad.addColorStop(0.45, "#232a1a");  // mid
    grad.addColorStop(0.72, "#585131");  // warm horizon
    grad.addColorStop(0.88, "#8a6a3a");  // dusk orange
    grad.addColorStop(1.0, "#3a2f1c");  // ground haze
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 256);
    return new THREE.CanvasTexture(c);
  }, []);

  return (
    <mesh>
      <sphereGeometry args={[640, 24, 16]} />
      <meshBasicMaterial map={tex} side={THREE.BackSide} fog={false} />
    </mesh>
  );
}

/* ---------------- main road ---------------- */
export function Road() {
  // long road strip down the corridor center + center dashes
  const dashesRef = useRef<THREE.InstancedMesh>(null);
  const COUNT = 130;

  useMemo(() => {
    if (!dashesRef.current) return;
    const d = new THREE.Object3D();
    for (let i = 0; i < COUNT; i++) {
      d.position.set(0, 0.06, 120 - i * 6);
      d.scale.set(0.14, 1, 1.6);
      d.updateMatrix();
      dashesRef.current.setMatrixAt(i, d.matrix);
    }
    dashesRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  return (
    <group>
      {/* asphalt */}
      <mesh position={[0, 0.02, -160]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[11, 980]} />
        <meshStandardMaterial color="#181a15" roughness={0.92} />
      </mesh>
      {/* shoulders */}
      {[-6.4, 6.4].map((x) => (
        <mesh key={x} position={[x, 0.04, -160]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.6, 980]} />
          <meshStandardMaterial color="#2a2f22" roughness={1} />
        </mesh>
      ))}
      {/* edge lines */}
      {[-4.7, 4.7].map((x) => (
        <mesh key={x} position={[x, 0.06, -160]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.18, 980]} />
          <meshBasicMaterial color="#9b9a84" />
        </mesh>
      ))}
      <instancedMesh ref={dashesRef} args={[undefined, undefined, COUNT]}>
        <boxGeometry args={[1, 0.02, 1]} />
        <meshBasicMaterial color="#c9a25a" />
      </instancedMesh>
    </group>
  );
}

/* ---------------- compound perimeter ---------------- */
export function CompoundWall() {
  // large operations compound wall with gate opening at z=-10
  const wallMat = (
    <meshStandardMaterial color="#262c1e" roughness={0.95} />
  );
  return (
    <group>
      {/* left wall */}
      <mesh position={[-52, 2.5, -170]} castShadow>
        <boxGeometry args={[2, 5, 320]} />
        {wallMat}
      </mesh>
      {/* right wall */}
      <mesh position={[52, 2.5, -170]} castShadow>
        <boxGeometry args={[2, 5, 320]} />
        {wallMat}
      </mesh>
      {/* back wall */}
      <mesh position={[0, 2.5, -330]} castShadow>
        <boxGeometry args={[106, 5, 2]} />
        {wallMat}
      </mesh>
      {/* gate segments (opening at center, road passes through) */}
      <mesh position={[-33, 2.6, -10]} castShadow>
        <boxGeometry args={[38, 5.2, 2]} />
        {wallMat}
      </mesh>
      <mesh position={[33, 2.6, -10]} castShadow>
        <boxGeometry args={[38, 5.2, 2]} />
        {wallMat}
      </mesh>
      {/* gate pylons */}
      {[-8, 8].map((x) => (
        <group key={x} position={[x, 0, -10]}>
          <mesh position={[0, 4.4, 0]} castShadow>
            <boxGeometry args={[2.2, 8.8, 2.2]} />
            <meshStandardMaterial color="#2e3524" roughness={0.9} />
          </mesh>
          <mesh position={[0, 9.1, 0]}>
            <boxGeometry args={[2.6, 0.5, 2.6]} />
            <meshStandardMaterial
              color="#e8a33d"
              emissive="#e8a33d"
              emissiveIntensity={0.85}
            />
          </mesh>
          <pointLight position={[0, 8.6, 0]} color="#ffb35c" intensity={18} distance={26} />
        </group>
      ))}
      {/* compound sign above gate */}
      <group position={[0, 7.2, -10]}>
        <mesh castShadow>
          <boxGeometry args={[13, 1.8, 0.6]} />
          <meshStandardMaterial color="#14140f" roughness={0.7} />
        </mesh>
        <TextPlate />
      </group>
    </group>
  );
}

function TextPlate() {
  // "SAKET // AI OPERATIONS" on the gate sign via canvas texture
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 1024; c.height = 160;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#101208";
    ctx.fillRect(0, 0, 1024, 160);
    ctx.strokeStyle = "rgba(232,163,61,0.55)";
    ctx.lineWidth = 4;
    ctx.strokeRect(8, 8, 1008, 144);
    ctx.font = "700 64px 'Space Mono', monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#e8a33d";
    ctx.fillText("SAKET // AI OPERATIONS", 512, 84);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <mesh position={[0, 0, 0.35]}>
      <planeGeometry args={[12.6, 1.7]} />
      <meshBasicMaterial map={tex} transparent />
    </mesh>
  );
}

/* ---------------- dust particles ---------------- */
export function Dust({ lowSpec }: { lowSpec: boolean }) {
  const count = lowSpec ? 260 : 720;
  const ref = useRef<THREE.Points>(null);

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 130;
      pos[i * 3 + 1] = Math.random() * 30;
      pos[i * 3 + 2] = 60 - Math.random() * 440;
      spd[i] = 0.15 + Math.random() * 0.5;
    }
    return [pos, spd];
  }, [count]);

  useFrame((_, dt) => {
    const pts = ref.current;
    if (!pts) return;
    const arr = (pts.geometry.attributes.position as THREE.BufferAttribute).array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += speeds[i] * dt * 0.6;
      if (arr[i * 3 + 1] > 30) arr[i * 3 + 1] = 0.2;
      arr[i * 3] += Math.sin(arr[i * 3 + 1] * 0.1 + i) * 0.002;
    }
    (pts.geometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.14}
        color="#c9b98a"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ---------------- fog volumes (visual layers) ---------------- */
export function HazeLayers() {
  return (
    <>
      <mesh position={[0, 6, 120]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[420, 90]} />
        <meshBasicMaterial color="#5c5a40" transparent opacity={0.1} depthWrite={false} />
      </mesh>
      <mesh position={[0, 7, -330]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[460, 120]} />
        <meshBasicMaterial color="#4c4a35" transparent opacity={0.14} depthWrite={false} />
      </mesh>
    </>
  );
}

/* ---------------- full environment export ---------------- */
export default function Environment({ lowSpec }: { lowSpec: boolean }) {
  const { scene } = useThree();
  useMemo(() => {
    // cinematic fog: warm dusk
    scene.fog = new THREE.FogExp2(0x3a3826, 0.0075);
    scene.background = new THREE.Color(0x11150c);
    return null;
  }, [scene]);

  return (
    <>
      <Lighting />
      <SkyDome />
      <Road />
      <CompoundWall />
      <Dust lowSpec={lowSpec} />
      <HazeLayers />
      <Mountains lowSpec={lowSpec} />
      <Trees lowSpec={lowSpec} />
    </>
  );
}
