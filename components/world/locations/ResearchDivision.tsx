"use client";

// ============================================================
// components/world/locations/ResearchDivision.tsx — EDUCATION
// Research wing: holographic degree display + focus-area pylons.
// ============================================================

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Platform, HoloScreen, TextPlate3D, MAT } from "../FacilityKit";
import { education } from "../../../data/education";

function FocusPylon({
  label,
  position,
  delay,
}: {
  label: string;
  position: [number, number, number];
  delay: number;
}) {
  const g = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (!g.current) return;
    const t = clock.elapsedTime + delay;
    g.current.children[1].position.y =
      2.6 + Math.sin(t * 1.2) * 0.14;
    (g.current.children[1] as THREE.Mesh).rotation.y = t * 0.7;
  });
  return (
    <group ref={g} position={position}>
      <mesh castShadow position={[0, 1.1, 0]}>
        <cylinderGeometry args={[0.3, 0.42, 2.2, 6]} />
        <meshStandardMaterial color={MAT.wallDark} roughness={0.8} metalness={0.2} />
      </mesh>
      <mesh position={[0, 2.6, 0]}>
        <octahedronGeometry args={[0.4, 0]} />
        <meshBasicMaterial color={MAT.cyan} wireframe />
      </mesh>
      <TextPlate3D
        text={label}
        width={2.6}
        height={0.5}
        small
        accent={MAT.cyan}
      />
      <group position={[0, 0, 0]}>
        <TextPlate3D text="" width={0.01} height={0.01} />
      </group>
    </group>
  );
}

export default function ResearchDivision() {
  return (
    <group position={[46, 0, -212]}>
      {/* research building shell */}
      <mesh castShadow position={[0, 4.5, -10]}>
        <boxGeometry args={[28, 9, 12]} />
        <meshStandardMaterial color={MAT.wall} roughness={0.9} />
      </mesh>

      <Platform w={26} d={22} glowColor={MAT.cyan}>
        {/* central holographic degree */}
        <group position={[0, 4.6, -8]}>
          <HoloScreen
            position={[0, 0, 0]}
            width={9.4}
            height={4}
            accent={MAT.cyan}
            label="RESEARCH DIVISION // EDUCATION"
            lines={[
              education.period,
              education.degree,
              education.institution,
            ]}
          />
        </group>

        {/* focus-area pylons arc */}
        {education.focusAreas.map((f, i) => {
          const ang = Math.PI * (1.15 + (i / (education.focusAreas.length - 1)) * 0.7);
          const r = 9.2;
          const x = Math.cos(ang) * r * -1;
          const z = -2 + Math.sin(ang) * r * -0.8;
          return (
            <FocusPylon
              key={f}
              label={f}
              position={[x, 0, z]}
              delay={i * 0.7}
            />
          );
        })}

        {/* detail screen */}
        <HoloScreen
          position={[-9, 2.8, -1]}
          rotationY={Math.PI / 3}
          width={5}
          height={2.6}
          accent={MAT.green}
          label="PROGRAM BRIEF"
          lines={[
            "CORE: ML · DL · STATISTICS",
            "SYSTEMS: DATA ENG · ALGORITHMS",
            "PLUS: RESEARCH PROJECTS",
            "MODE: COMPETITIVE CODING",
          ]}
        />
      </Platform>
    </group>
  );
}
