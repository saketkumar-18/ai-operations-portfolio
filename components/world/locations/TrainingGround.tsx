"use client";

// ============================================================
// components/world/locations/TrainingGround.tsx — SKILLS
// Open-air training yard with 4 skill stations. Clicking a
// station opens its skill details in the HUD panel.
// ============================================================

import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Platform, HoloScreen, HoloMarker, TextPlate3D, MAT } from "../FacilityKit";
import { skillGroups } from "../../../data/skills";
import { useWorld } from "../../../lib/store";

function Station({
  group,
  position,
  rotationY,
  onSelect,
  active,
}: {
  group: (typeof skillGroups)[number];
  position: [number, number, number];
  rotationY: number;
  onSelect: (id: string) => void;
  active: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const coreRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (coreRef.current) {
      coreRef.current.rotation.y = clock.elapsedTime * 0.6;
      coreRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.4) * 0.3;
      const s = hovered || active ? 1.18 : 1;
      coreRef.current.scale.setScalar(
        THREE.MathUtils.lerp(coreRef.current.scale.x, s, 0.12)
      );
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* station pad */}
      <mesh
        receiveShadow
        position={[0, 0.1, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(group.id);
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <cylinderGeometry args={[3.1, 3.3, 0.18, 8]} />
        <meshStandardMaterial
          color={active || hovered ? "#3c4426" : MAT.wallDark}
          roughness={0.85}
          emissive={active || hovered ? "#2a3318" : "#000000"}
          emissiveIntensity={0.6}
        />
      </mesh>

      {/* station core — differs by icon type */}
      <mesh ref={coreRef} position={[0, 2.1, 0]} castShadow>
        {group.icon === "terminal" && <boxGeometry args={[1.5, 1.05, 0.16]} />}
        {group.icon === "training" && <icosahedronGeometry args={[0.85, 1]} />}
        {group.icon === "neural" && <octahedronGeometry args={[1, 0]} />}
        {group.icon === "cloud" && <boxGeometry args={[1.1, 1.5, 1.1]} />}
        <meshStandardMaterial
          color={group.icon === "neural" ? MAT.cyan : MAT.orange}
          emissive={group.icon === "neural" ? MAT.cyan : MAT.orange}
          emissiveIntensity={hovered || active ? 0.5 : 0.22}
          roughness={0.4}
          wireframe={group.icon === "training"}
        />
      </mesh>

      {/* beam from pad to core */}
      <mesh position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1.6, 6]} />
        <meshBasicMaterial
          color={active || hovered ? MAT.orange : "#8a8f83"}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* label above */}
      <group position={[0, 3.6, 0]}>
        <TextPlate3D
          text={group.label}
          sub={`${group.skills.length} SYSTEMS · ${group.representation}`}
          width={4.6}
          height={0.85}
          small
          accent={active ? MAT.orange : "#b5b3a5"}
        />
      </group>

      {(hovered || active) && (
        <HoloMarker position={[0, 4.4, 0]} scale={0.8} />
      )}
    </group>
  );
}

export default function TrainingGround() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const toast = useWorld((s) => s.toast);

  const positions: { pos: [number, number, number]; rot: number }[] = [
    { pos: [-9, 0, -6], rot: 0.5 },
    { pos: [9, 0, -6], rot: -0.5 },
    { pos: [-9, 0, -14], rot: 0.9 },
    { pos: [9, 0, -14], rot: -0.9 },
  ];

  const active = useMemo(
    () => skillGroups.find((g) => g.id === activeId) ?? null,
    [activeId]
  );

  return (
    <group position={[-46, 0, -88]}>
      {/* yard floor */}
      <Platform w={30} d={26} glowColor={MAT.green}>
        {/* perimeter pylons */}
        {[[-13, -11], [13, -11], [-13, 11], [13, 11]].map(([x, z], i) => (
          <group key={i} position={[x, 0, z]}>
            <mesh castShadow position={[0, 2, 0]}>
              <cylinderGeometry args={[0.18, 0.24, 4, 6]} />
              <meshStandardMaterial color={MAT.metal} roughness={0.6} metalness={0.4} />
            </mesh>
            <mesh position={[0, 4.1, 0]}>
              <sphereGeometry args={[0.14, 8, 8]} />
              <meshBasicMaterial color={MAT.green} />
            </mesh>
            <pointLight position={[0, 4.1, 0]} color="#7fd08a" intensity={5} distance={10} />
          </group>
        ))}

        {skillGroups.map((g, i) => (
          <Station
            key={g.id}
            group={g}
            position={positions[i].pos}
            rotationY={positions[i].rot}
            onSelect={(id) => {
              setActiveId(id === activeId ? null : id);
              toast("TRAINING SYSTEM ONLINE", "info");
            }}
            active={activeId === g.id}
          />
        ))}

        {/* detail screen for the active station */}
        {active && (
          <HoloScreen
            position={[0, 4.4, -12.2]}
            width={7.6}
            height={3.1}
            rotationY={0}
            accent={MAT.green}
            label={active.label}
            lines={active.skills.map((s) => `▸ ${s.name}`).slice(0, 6)}
          />
        )}
      </Platform>
    </group>
  );
}
