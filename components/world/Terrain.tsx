"use client";

// ============================================================
// components/world/Terrain.tsx
// Procedural terrain + distant mountains + roads, instanced.
// ============================================================

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface TerrainProps {
  lowSpec: boolean;
}

// deterministic pseudo-random for stable world
function mulberry(seed: number) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function heightAt(x: number, z: number): number {
  // gentle rolling terrain, flat corridor where the compound sits (|x|<60)
  const ridge = Math.sin(x * 0.015) * Math.cos(z * 0.012) * 3.2;
  const detail = Math.sin(x * 0.05 + z * 0.03) * 0.55;
  const corridorFlat = THREE.MathUtils.smoothstep(Math.abs(x), 34, 90); // 0 near center
  const farLift = THREE.MathUtils.smoothstep(-z, 60, 360) * 4.0; // rises toward the far end
  return (ridge + detail) * corridorFlat + farLift * 0.4;
}

export default function Terrain({ lowSpec }: TerrainProps) {
  const SIZE = 900;
  const SEG = lowSpec ? 56 : 96;

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(SIZE, SIZE * 1.4, SEG, SEG * 2);
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      pos.setZ(i, heightAt(x, y));
    }
    geo.computeVertexNormals();
    return geo;
  }, [SEG]);

  const material = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 256; canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    // base charcoal-olive
    ctx.fillStyle = "#141a10";
    ctx.fillRect(0, 0, 256, 256);
    const rnd = mulberry(1337);
    // patchy olive/charcoal noise
    for (let i = 0; i < 2600; i++) {
      const x = rnd() * 256, y = rnd() * 256, r = rnd() * 14 + 2;
      const g = 18 + Math.floor(rnd() * 16);
      ctx.fillStyle = `rgba(${20 + Math.floor(rnd() * 12)}, ${g + 14}, ${10 + Math.floor(rnd() * 8)}, ${0.08 + rnd() * 0.1})`;
      ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
    }
    // faint grid — tactical survey lines
    ctx.strokeStyle = "rgba(95,168,106,0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 8; i++) {
      ctx.beginPath(); ctx.moveTo(i * 32, 0); ctx.lineTo(i * 32, 256); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * 32); ctx.lineTo(256, i * 32); ctx.stroke();
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(34, 48);
    return new THREE.MeshStandardMaterial({
      map: tex,
      color: 0x8f9687,
      roughness: 0.96,
      metalness: 0.02,
    });
  }, []);

  return (
    <group name="terrain">
      <mesh geometry={geometry} material={material} position={[0, -0.4, -280]} receiveShadow />
    </group>
  );
}

// ------------------------------------------------------------
// Mountains: distant backdrop ring (instanced cones w/ noise)
// ------------------------------------------------------------
export function Mountains({ lowSpec }: { lowSpec: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = lowSpec ? 26 : 44;

  const dummy = useMemo(() => new THREE.Object3D(), []);
  useMemo(() => {
    if (!meshRef.current) return;
    const rnd = mulberry(99);
    for (let i = 0; i < count; i++) {
      const ang = Math.PI * (1.06 + (i / count) * 0.88); // arc facing the approach
      const dist = 340 + rnd() * 120;
      const x = Math.cos(ang) * dist * 1.35;
      const z = -280 + Math.sin(ang) * dist;
      const s = 60 + rnd() * 90;
      dummy.position.set(x, -8, z);
      dummy.scale.set(s * (0.7 + rnd() * 0.6), s, s * (0.7 + rnd() * 0.6));
      dummy.rotation.y = rnd() * Math.PI;
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count, dummy]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow={false}>
      <coneGeometry args={[1, 1.35, 5, 1]} />
      <meshStandardMaterial color="#252b1d" roughness={1} flatShading />
    </instancedMesh>
  );
}

// ------------------------------------------------------------
// Trees: instanced dark pines around the corridor
// ------------------------------------------------------------
export function Trees({ lowSpec }: { lowSpec: boolean }) {
  const trunkRef = useRef<THREE.InstancedMesh>(null);
  const crownRef = useRef<THREE.InstancedMesh>(null);
  const count = lowSpec ? 90 : 220;

  const dummy = useMemo(() => new THREE.Object3D(), []);
  useMemo(() => {
    if (!trunkRef.current || !crownRef.current) return;
    const rnd = mulberry(7);
    let placed = 0;
    let guard = 0;
    while (placed < count && guard < count * 6) {
      guard++;
      const x = (rnd() - 0.5) * 760;
      const z = 130 - rnd() * 760;
      if (Math.abs(x) < 46 && z > -350 && z < 130) continue; // keep corridor clear
      const s = 1.6 + rnd() * 2.4;
      dummy.position.set(x, heightAt(x, z - 280) - 0.35 + s * 0.5, z - 280);
      dummy.scale.set(s * 0.16, s, s * 0.16);
      dummy.rotation.y = rnd() * Math.PI * 2;
      dummy.updateMatrix();
      trunkRef.current.setMatrixAt(placed, dummy.matrix);
      dummy.scale.set(s * 0.42, s * 0.85, s * 0.42);
      dummy.position.y += s * 0.72;
      dummy.updateMatrix();
      crownRef.current.setMatrixAt(placed, dummy.matrix);
      placed++;
    }
    trunkRef.current.count = placed;
    crownRef.current.count = placed;
    trunkRef.current.instanceMatrix.needsUpdate = true;
    crownRef.current.instanceMatrix.needsUpdate = true;
  }, [count, dummy]);

  return (
    <group>
      <instancedMesh ref={trunkRef} args={[undefined, undefined, count]}>
        <cylinderGeometry args={[0.5, 0.7, 1, 5]} />
        <meshStandardMaterial color="#2a2218" roughness={1} />
      </instancedMesh>
      <instancedMesh ref={crownRef} args={[undefined, undefined, count]}>
        <coneGeometry args={[1, 1.6, 6, 1]} />
        <meshStandardMaterial color="#1e2b17" roughness={1} flatShading />
      </instancedMesh>
    </group>
  );
}
