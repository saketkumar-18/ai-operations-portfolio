"use client";

// ============================================================
// components/world/locations/CommandCenter.tsx — ABOUT ME
// HQ building: central holo table, operator profile displays.
// ============================================================

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Platform, HoloScreen, MAT } from "../FacilityKit";
import { profile } from "../../../data/profile";

function CentralTable() {
  const ringRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ringRef.current) ringRef.current.rotation.z = clock.elapsedTime * 0.25;
  });
  return (
    <group position={[0, 0, 0]}>
      {/* table base */}
      <mesh castShadow position={[0, 0.9, 0]}>
        <cylinderGeometry args={[2.2, 2.6, 1.7, 8]} />
        <meshStandardMaterial color={MAT.wallDark} roughness={0.8} metalness={0.2} />
      </mesh>
      {/* holo top */}
      <mesh position={[0, 1.78, 0]}>
        <cylinderGeometry args={[2.05, 2.05, 0.06, 32]} />
        <meshBasicMaterial color="#0f2318" transparent opacity={0.9} />
      </mesh>
      <mesh ref={ringRef} position={[0, 1.86, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.7, 0.03, 8, 48, Math.PI * 1.7]} />
        <meshBasicMaterial color={MAT.orange} transparent opacity={0.85} />
      </mesh>
      {/* rotating tactical globe above the table */}
      <TacticalGlobe position={[0, 2.6, 0]} />
      <pointLight position={[0, 2.4, 0]} color="#ffb35c" intensity={10} distance={12} />
    </group>
  );
}

function TacticalGlobe({ position }: { position: [number, number, number] }) {
  const g = useRef<THREE.Group>(null);
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 512; c.height = 256;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "#0c130d";
    ctx.fillRect(0, 0, 512, 256);
    ctx.strokeStyle = "rgba(95,168,106,0.4)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 16; i++) {
      ctx.beginPath(); ctx.moveTo(i * 32, 0); ctx.lineTo(i * 32, 256); ctx.stroke();
    }
    for (let i = 0; i < 9; i++) {
      ctx.beginPath(); ctx.moveTo(0, i * 32); ctx.lineTo(512, i * 32); ctx.stroke();
    }
    // markers: Delhi + Guwahati (real)
    ctx.fillStyle = "#e8a33d";
    const plot = (lon: number, lat: number) => {
        const x = ((lon + 180) / 360) * 512;
        const y = ((90 - lat) / 180) * 256;
        ctx.beginPath(); ctx.arc(x, y, 5, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "rgba(232,163,61,0.5)";
        ctx.beginPath(); ctx.arc(x, y, 11, 0, Math.PI * 2); ctx.stroke();
      };
    plot(77.209, 28.6139);
    plot(91.8457, 26.2442);
    return new THREE.CanvasTexture(c);
  }, []);
  useFrame(({ clock }) => {
    if (g.current) {
      g.current.rotation.y = clock.elapsedTime * 0.22;
      g.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.9) * 0.1;
    }
  });
  return (
    <group ref={g} position={position}>
      <mesh>
        <sphereGeometry args={[0.75, 24, 18]} />
        <meshBasicMaterial map={tex} wireframe />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.72, 24, 18]} />
        <meshBasicMaterial map={tex} transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

export default function CommandCenter() {
  return (
    <group position={[0, 0, -30]}>
      {/* building shell (open-front hangar so camera sees inside) */}
      <mesh castShadow position={[0, 4, -9]}>
        <boxGeometry args={[26, 8, 14]} />
        <meshStandardMaterial color={MAT.wall} roughness={0.9} />
      </mesh>
      {/* roof strip lights */}
      {[-4, 4].map((x) => (
        <mesh key={x} position={[x, 7.6, -4]}>
          <boxGeometry args={[6, 0.15, 0.4]} />
          <meshBasicMaterial color="#c9b98a" />
        </mesh>
      ))}

      <Platform w={24} d={18} glowColor={MAT.orange}>
        <CentralTable />

        {/* side holo displays: operator data */}
        <HoloScreen
          position={[-9.5, 3.1, -3]}
          rotationY={Math.PI / 3.2}
          width={5.2}
          height={2.8}
          accent={MAT.orange}
          label="OPERATOR PROFILE"
          lines={[
            `NAME: ${profile.name}`,
            "ROLE: DATA SCIENTIST / AI / ML",
            "BASE: DELHI, INDIA",
            "STATUS: OPEN TO WORK",
          ]}
        />
        <HoloScreen
          position={[9.5, 3.1, -3]}
          rotationY={-Math.PI / 3.2}
          width={5.2}
          height={2.8}
          accent={MAT.cyan}
          label="SYSTEMS"
          lines={[
            "PROJECTS: 15+ DEPLOYED",
            "FOCUS: LLM / CV / SPEECH",
            "EDU: IIT GUWAHATI (HONS)",
            "MODE: END-TO-END AI",
          ]}
        />
        {/* rear wall big screen */}
        <HoloScreen
          position={[0, 4.6, -7.6]}
          width={9}
          height={3.4}
          accent={MAT.green}
          label="COMMAND CENTER // ABOUT"
          lines={[
            profile.about.split(".")[0] + ".",
            "STRENGTH: MODEL → EVAL → API → UI → PROD",
          ]}
        />
      </Platform>
    </group>
  );
}
