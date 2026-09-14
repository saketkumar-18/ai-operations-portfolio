"use client";

// ============================================================
// components/world/locations/CommunicationTower.tsx — CONTACT
// Tall antenna tower visible across the world. Beams pulse.
// ============================================================

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Platform, HoloScreen, TextPlate3D, MAT } from "../FacilityKit";
import { profile } from "../../../data/profile";

function AntennaTower() {
  const segRefs = useRef<(THREE.Mesh | null)[]>([]);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    // pulse up the tower lights
    segRefs.current.forEach((m, i) => {
      if (!m) return;
      const mat = m.material as THREE.MeshBasicMaterial;
      const phase = (t * 0.5 - i * 0.18) % 1;
      mat.opacity = phase < 0 ? 0 : Math.max(0, 1 - phase * 2.4) * 0.9;
    });
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.4;
      ringRef.current.position.y = 16 + Math.sin(t * 0.8) * 1.2;
    }
  });

  return (
    <group>
      {/* lattice tower: tapering segments */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const h = 4.4;
        const y = 3 + i * h + h / 2;
        const wTop = 2.4 - i * 0.34;
        const wBot = 2.8 - i * 0.34;
        return (
          <mesh key={i} castShadow position={[0, y, 0]}>
            <cylinderGeometry args={[wTop * 0.42, wBot * 0.42, h, 4, 1, true]} />
            <meshStandardMaterial color={MAT.metal} roughness={0.7} metalness={0.5} flatShading side={THREE.DoubleSide} />
          </mesh>
        );
      })}
      {/* pulsing lights up the tower */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <mesh
          key={`l${i}`}
          ref={(m) => { segRefs.current[i] = m; }}
          position={[0, 5.4 + i * 4.4, 0]}
        >
          <sphereGeometry args={[0.22, 10, 10]} />
          <meshBasicMaterial color={MAT.orange} transparent opacity={0.6} />
        </mesh>
      ))}
      {/* beacon tip */}
      <mesh position={[0, 30, 0]}>
        <sphereGeometry args={[0.4, 12, 12]} />
        <meshBasicMaterial color="#ff6a3d" />
      </mesh>
      <pointLight position={[0, 30, 0]} color="#ffb35c" intensity={30} distance={60} />
      {/* rotating comms ring */}
      <mesh ref={ringRef} position={[0, 16, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3.4, 0.08, 8, 40]} />
        <meshBasicMaterial color={MAT.cyan} transparent opacity={0.7} />
      </mesh>
      {/* dishes */}
      {[
        { x: -1.6, y: 10, rot: 2.2 },
        { x: 1.6, y: 13, rot: -2.2 },
      ].map((d, i) => (
        <group key={i} position={[d.x, d.y, 0]} rotation={[0, d.rot, 0]}>
          <mesh castShadow>
            <sphereGeometry args={[0.9, 12, 8, 0, Math.PI * 2, 0, Math.PI / 3]} />
            <meshStandardMaterial color="#4a5040" roughness={0.5} metalness={0.5} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function CommunicationTower() {
  return (
    <group position={[0, 0, -336]}>
      <Platform w={24} d={20} glowColor={MAT.orange}>
        <AntennaTower />

        {/* contact holo displays around the tower base */}
        <HoloScreen
          position={[-9.5, 3, -2]}
          rotationY={Math.PI / 3.4}
          width={5.4}
          height={2.7}
          accent={MAT.orange}
          label="COMMUNICATION LINK"
          lines={[
            "STATUS: ESTABLISHED",
            "SEEKING: AI/ML INTERNSHIPS",
            "OPEN: RESEARCH COLLAB",
            "OPEN: MEANINGFUL BUILDS",
          ]}
        />
        <HoloScreen
          position={[9.5, 3, -2]}
          rotationY={-Math.PI / 3.4}
          width={5.4}
          height={2.7}
          accent={MAT.cyan}
          label="DIRECT CHANNELS"
          lines={[
            `MAIL-1: ${profile.email}`,
            "MAIL-2: saketanand9693@gmail.com",
            "GITHUB: saketkumar-18",
            "LINKEDIN: iitgsaketkumar",
          ]}
        />

        {/* big message above the tower */}
        <group position={[0, 20.5, 0]}>
          <TextPlate3D
            text="LET'S BUILD THE NEXT INTELLIGENT SYSTEM"
            width={13}
            height={1.5}
          />
        </group>
      </Platform>
    </group>
  );
}
