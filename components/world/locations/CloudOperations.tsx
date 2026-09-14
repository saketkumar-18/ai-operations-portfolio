"use client";

// ============================================================
// components/world/locations/CloudOperations.tsx — CLOUD/MLOPS
// Server racks + data beams connecting deployments.
// ============================================================

import { useMemo } from "react";
import { Platform, ServerRack, DataBeam, TextPlate3D, HoloScreen, MAT } from "../FacilityKit";

const RACKS: [number, number][] = [
  [-8, -8], [-4.5, -8], [-1, -8], [5.5, -8], [9, -8],
  [-8, -12.5], [-4.5, -12.5], [-1, -12.5], [5.5, -12.5], [9, -12.5],
];

export default function CloudOperations() {
  const beams = useMemo(() => {
    // pairs of rack-top → rack-top (visually a mesh network)
    const pairs: { a: [number, number, number]; b: [number, number, number] }[] = [];
    for (let i = 0; i < RACKS.length - 1; i += 2) {
      const [ax, az] = RACKS[i];
      const [bx, bz] = RACKS[i + 1];
      pairs.push({ a: [ax, 2.4, az], b: [bx, 2.4, bz] });
    }
    pairs.push({ a: [-8, 2.4, -8], b: [9, 2.4, -12.5] });
    pairs.push({ a: [9, 2.4, -8], b: [-8, 2.4, -12.5] });
    return pairs;
  }, []);

  return (
    <group position={[-46, 0, -274]}>
      <Platform w={28} d={24} glowColor="#9a8866">
        {/* canopy */}
        <mesh castShadow position={[0, 6.5, -10]}>
          <boxGeometry args={[26, 0.7, 16]} />
          <meshStandardMaterial color={MAT.wall} roughness={0.9} />
        </mesh>
        {/* canopy pillars */}
        {[-11, 11].map((x) => (
          <mesh key={x} castShadow position={[x, 3.2, -3]}>
            <boxGeometry args={[0.6, 6.4, 0.6]} />
            <meshStandardMaterial color={MAT.metal} roughness={0.7} metalness={0.3} />
          </mesh>
        ))}

        {/* racks */}
        {RACKS.map(([x, z], i) => (
          <ServerRack key={i} position={[x, 0, z]} />
        ))}

        {/* animated data beams */}
        {beams.map((p, i) => (
          <DataBeam key={i} from={p.a} to={p.b} />
        ))}

        {/* header */}
        <group position={[0, 7.6, -16.2]}>
          <TextPlate3D
            text="CLOUD OPERATIONS"
            sub="TRAIN → EVALUATE → DEPLOY → MONITOR"
            width={9}
            height={1.4}
            accent="#9a8866"
          />
        </group>

        {/* deployment pipeline holo */}
        <HoloScreen
          position={[0, 3.4, -1]}
          width={6.4}
          height={2.8}
          accent={MAT.green}
          label="DEPLOYMENT PIPELINE"
          lines={[
            "▸ GITHUB ACTIONS — CI",
            "▸ DOCKER — CONTAINERS",
            "▸ VERCEL — 24H CDN EDGE",
            "▸ ONRENDER — 5 SVCS LIVE",
          ]}
        />
      </Platform>
    </group>
  );
}
