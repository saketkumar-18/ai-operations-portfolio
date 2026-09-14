"use client";

// ============================================================
// components/world/locations/MissionArchive.tsx — PROJECTS
// Supply crates arranged in rows. Approach/hover → "MISSION
// DETECTED" → click → dossier. Filter dims non-matching crates.
// ============================================================

import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { Platform, HoloMarker, TextPlate3D, MAT } from "../FacilityKit";
import { projects, CATEGORY_META, type Project } from "../../../data/projects";
import { useWorld } from "../../../lib/store";

function Crate({
  project,
  position,
  rotationY,
  dimmed,
  highlighted,
  onOpen,
  onHover,
}: {
  project: Project;
  position: [number, number, number];
  rotationY: number;
  dimmed: boolean;
  highlighted: boolean;
  onOpen: (p: Project) => void;
  onHover: (p: Project | null) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const lidRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const meta = CATEGORY_META[project.category];

  useFrame(({ clock }, dt) => {
    // lid opens when hovered/highlighted
    if (lidRef.current) {
      const target = hovered || highlighted ? -1.5 : 0;
      lidRef.current.rotation.x = THREE.MathUtils.damp(
        lidRef.current.rotation.x,
        target,
        6,
        Math.min(dt, 0.05)
      );
    }
    // highlighted crates pulse upward glow
    if (groupRef.current && highlighted) {
      groupRef.current.position.y =
        position[1] + Math.abs(Math.sin(clock.elapsedTime * 2.4)) * 0.18;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={[0, rotationY, 0]}
    >
      {/* crate body */}
      <mesh
        castShadow
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onOpen(project);
        }}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          setHovered(true);
          onHover(project);
        }}
        onPointerOut={() => {
          setHovered(false);
          onHover(null);
        }}
      >
        <boxGeometry args={[1.7, 1.5, 1.7]} />
        <meshStandardMaterial
          color={dimmed ? "#20241a" : "#3a4028"}
          roughness={0.85}
          emissive={hovered || highlighted ? meta.accent : "#000000"}
          emissiveIntensity={hovered || highlighted ? 0.28 : 0}
        />
      </mesh>
      {/* lid (pivoted at back edge) */}
      <mesh ref={lidRef} castShadow position={[0, 0.75, -0.85]}>
        <boxGeometry args={[1.7, 0.14, 1.7]} />
        <meshStandardMaterial
          color={dimmed ? "#262a1d" : meta.accent}
          roughness={0.6}
          emissive={hovered ? meta.accent : "#000"}
          emissiveIntensity={hovered ? 0.35 : 0}
        />
      </mesh>
      {/* mission number stencilled on front */}
      <group position={[0, 0.3, 0.87]}>
        <TextPlate3D
          text={`M-${project.missionNo}`}
          sub={dimmed ? "SIGNAL LOST" : project.name}
          width={1.5}
          height={0.55}
          small
          accent={dimmed ? "#5c6055" : meta.accent}
        />
      </group>
      {/* signal marker */}
      {!dimmed && (hovered || highlighted) && (
        <HoloMarker position={[0, 2.6, 0]} color={meta.accent} />
      )}
      {/* hover light */}
      {(hovered || highlighted) && !dimmed && (
        <pointLight position={[0, 1.6, 0]} color={meta.accent} intensity={6} distance={5} />
      )}
      <group
        position={[0, 0, 0]}
        visible={!dimmed}
      >
        <TextPlate3D
          text={""}
          width={0.1}
          height={0.1}
        />
      </group>
    </group>
  );
}

export default function MissionArchive() {
  const filter = useWorld((s) => s.filter);
  const highlight = useWorld((s) => s.highlightProject);
  const openProject = useWorld((s) => s.openProject);
  const toast = useWorld((s) => s.toast);
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);

  // crate layout: 3 rows x 5, spaced like a storage yard
  const layout = useMemo(() => {
    const arr: { pos: [number, number, number]; rot: number }[] = [];
    projects.forEach((_, i) => {
      const row = Math.floor(i / 5);
      const col = i % 5;
      arr.push({
        pos: [(col - 2) * 6.2, 0.75, -6 - row * 7.4],
        rot: ((col * 7 + row * 13) % 5) * 0.12 - 0.24,
      });
    });
    return arr;
  }, []);

  const dimmed = (p: Project) =>
    filter !== "ALL" && p.category !== filter;

  return (
    <group position={[0, 0, -150]}>
      <Platform w={38} d={34} glowColor={MAT.orange}>
        {/* overhead gantry structure */}
        {[-16, 16].map((x) => (
          <mesh key={x} castShadow position={[x, 5.5, -14]}>
            <boxGeometry args={[0.7, 11, 0.7]} />
            <meshStandardMaterial color={MAT.wallDark} roughness={0.9} />
          </mesh>
        ))}
        <mesh castShadow position={[0, 10.8, -14]}>
          <boxGeometry args={[33, 0.8, 0.8]} />
          <meshStandardMaterial color={MAT.metal} roughness={0.6} metalness={0.4} />
        </mesh>

        {/* archive header */}
        <group position={[0, 8.4, -16.6]}>
          <TextPlate3D
            text="MISSION ARCHIVE"
            sub="15 OPERATIONS ON RECORD"
            width={10}
            height={1.6}
          />
        </group>

        {projects.map((p, i) => (
          <Crate
            key={p.id}
            project={p}
            position={layout[i].pos}
            rotationY={layout[i].rot}
            dimmed={dimmed(p)}
            highlighted={highlight === p.id}
            onOpen={(proj) => {
              openProject(proj);
            }}
            onHover={(proj) => {
              setHoveredProject(proj);
              if (proj) toast("MISSION DETECTED", "mission");
            }}
          />
        ))}

        {/* hover readout board */}
        {hoveredProject && (
          <group position={[0, 5.6, 0]}>
            <TextPlate3D
              text={`MISSION ${hoveredProject.missionNo} // ${hoveredProject.name}`}
              sub={`${hoveredProject.category} · STATUS: ${hoveredProject.status} · CLICK TO OPEN`}
              width={11}
              height={1.3}
              accent={CATEGORY_META[hoveredProject.category].accent}
            />
          </group>
        )}
      </Platform>
    </group>
  );
}
