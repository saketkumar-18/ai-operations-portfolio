"use client";

// ============================================================
// components/three/PlaneDrop.tsx
// Battle-royale insertion: cargo plane flies a line across the
// map (with engine audio thump), visitor presses SPACE / clicks
// JUMP → freefall with wind → parachute deploys at low altitude
// → landing at the compound gate → phase=ground.
// Fully original assets — a stylized cargo plane built from
// primitives (no PUBG material).
// ============================================================

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useWorld } from "../../lib/store";
import { damp, clamp } from "../../lib/utils";

/* ---------- stylized cargo plane (original design) ---------- */
function CargoPlane({ groupRef }: { groupRef: React.RefObject<THREE.Group> }) {
  return (
    <group ref={groupRef}>
      {/* fuselage */}
      <mesh castShadow>
        <capsuleGeometry args={[1.6, 7, 6, 12]} />
        <meshStandardMaterial color="#3d4433" roughness={0.7} metalness={0.3} />
      </mesh>
      {/* nose */}
      <mesh position={[0, -0.1, 5.4]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[1.6, 2.2, 12]} />
        <meshStandardMaterial color="#343b2b" roughness={0.7} metalness={0.3} />
      </mesh>
      {/* cockpit glass */}
      <mesh position={[0, 0.7, 4.4]}>
        <sphereGeometry args={[0.9, 10, 8]} />
        <meshStandardMaterial color="#22281a" roughness={0.2} metalness={0.6} />
      </mesh>
      {/* wings */}
      <mesh position={[0, 0.6, 0.4]} castShadow>
        <boxGeometry args={[22, 0.32, 3.4]} />
        <meshStandardMaterial color="#465040" roughness={0.75} metalness={0.2} />
      </mesh>
      {/* winglets */}
      {[-11, 11].map((x) => (
        <mesh key={x} position={[x, 1.2, 0.4]}>
          <boxGeometry args={[0.3, 1.4, 2.6]} />
          <meshStandardMaterial color="#e8a33d" roughness={0.6} />
        </mesh>
      ))}
      {/* engines */}
      {[-6.5, -3.5, 3.5, 6.5].map((x) => (
        <mesh key={x} position={[x, 0.35, 1.6]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 2.4, 10]} />
          <meshStandardMaterial color="#2c3122" roughness={0.5} metalness={0.5} />
        </mesh>
      ))}
      {/* tail */}
      <mesh position={[0, 2.2, -4.4]} castShadow>
        <boxGeometry args={[0.35, 3.6, 2.6]} />
        <meshStandardMaterial color="#465040" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.8, -5]}>
        <boxGeometry args={[7, 0.3, 1.8]} />
        <meshStandardMaterial color="#465040" roughness={0.75} />
      </mesh>
      {/* orange tail stripe — tactical livery */}
      <mesh position={[0, 3.4, -4.4]}>
        <boxGeometry args={[0.4, 0.9, 2.2]} />
        <meshStandardMaterial color="#e8a33d" emissive="#e8a33d" emissiveIntensity={0.25} />
      </mesh>
    </group>
  );
}

/* ---------- parachute canopy ---------- */
function Parachute() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.elapsedTime;
      ref.current.scale.y = 1 + Math.sin(t * 2.2) * 0.06;
      ref.current.rotation.z = Math.sin(t * 1.1) * 0.08;
    }
  });
  return (
    <group>
      <mesh ref={ref} position={[0, 3.4, 0]}>
        <sphereGeometry args={[2.6, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2.4]} />
        <meshStandardMaterial
          color="#5fa86a"
          roughness={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* canopy stripes */}
      {[-1.2, 0, 1.2].map((x) => (
        <mesh key={x} position={[x * 1.4, 3.0, 0]}>
          <boxGeometry args={[0.24, 1.6, 0.1]} />
          <meshStandardMaterial color="#e8a33d" side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* rigging lines */}
      {[-2.4, -1.2, 1.2, 2.4].map((x) => (
        <mesh key={x} position={[x / 2, 2.0, 0]} rotation={[0, 0, x * 0.3]}>
          <cylinderGeometry args={[0.012, 0.012, 2.6, 3]} />
          <meshBasicMaterial color="#b5b3a5" />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- main controller ---------- */
const PLANE_ALT = 260;
const PLANE_SPEED = 46; // m/s
const DROP_TARGET = new THREE.Vector3(0, 0, 40); // land near gate approach

export default function PlaneDrop() {
  const { camera } = useThree();
  const planeRef = useRef<THREE.Group>(null);
  const stateRef = useRef({
    planeT: 0, // 0..1 along flight line
    velY: 0,
    landed: false,
    chuteOpen: false,
    pos: new THREE.Vector3(0, PLANE_ALT, 0),
    groundPos: new THREE.Vector3(0, 0, 0),
  });
  const jumpPressed = useRef(false);

  // flight path: diagonal line across the map over the compound
  const flight = useMemo(
    () => ({
      from: new THREE.Vector3(-620, PLANE_ALT, -560),
      to: new THREE.Vector3(620, PLANE_ALT, 200),
    }),
    []
  );

  // space/click to jump
  useMemo(() => {
    if (typeof window === "undefined") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === "Space" && useWorld.getState().phase === "plane") {
        jumpPressed.current = true;
      }
    };
    const onClick = () => {
      if (useWorld.getState().phase === "plane") jumpPressed.current = true;
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, []);

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const s = stateRef.current;
    const { phase, setPhase, setAltitude, killFeedPush, toast } = useWorld.getState();

    if (phase === "plane") {
      // advance plane
      s.planeT = clamp(s.planeT + (dt * PLANE_SPEED) / 1200, 0, 1);
      const p = new THREE.Vector3().lerpVectors(flight.from, flight.to, s.planeT);

      if (planeRef.current) {
        planeRef.current.position.copy(p);
        planeRef.current.rotation.y = Math.atan2(
          flight.to.x - flight.from.x,
          flight.to.z - flight.from.z
        );
      }

      // camera trails the plane (slightly above/behind, looking forward-down)
      const trail = p.clone().add(new THREE.Vector3(0, 14, -46));
      camera.position.lerp(trail, 1 - Math.exp(-6 * dt));
      const look = p.clone().add(new THREE.Vector3(0, -8, 60));
      camera.lookAt(look);

      if (jumpPressed.current) {
        jumpPressed.current = false;
        s.pos.copy(p);
        setPhase("drop");
        toast("JUMP CONFIRMED", "nav");
        window.dispatchEvent(new Event("sak-shake"));
        return;
      }

      // auto-jump at 86% of path so nobody is trapped
      if (s.planeT > 0.86) {
        jumpPressed.current = true;
      }
      return;
    }

    if (phase === "drop") {
      // freefall physics
      const terminal = s.chuteOpen ? 12 : 62; // m/s
      s.velY = damp(s.velY, -terminal, s.chuteOpen ? 2.2 : 0.8, dt);

      // steer toward drop target with slight drift
      const horizSpeed = s.chuteOpen ? 14 : 26;
      const toTarget = new THREE.Vector3(
        DROP_TARGET.x - s.pos.x,
        0,
        DROP_TARGET.z - s.pos.z
      );
      const dist = toTarget.length();
      toTarget.normalize();
      if (dist > 2) {
        s.pos.x += toTarget.x * Math.min(horizSpeed * dt, dist);
        s.pos.z += toTarget.z * Math.min(horizSpeed * dt, dist);
      }
      s.pos.y += s.velY * dt;

      // chute auto-deploys at 70m
      if (!s.chuteOpen && s.pos.y <= 70) {
        s.chuteOpen = true;
        killFeedPush("OPERATOR DEPLOYED PARACHUTE");
        window.dispatchEvent(new Event("sak-shake"));
      }

      setAltitude(Math.max(0, s.pos.y));

      // camera: behind and above the operator
      const camTarget = s.pos.clone().add(new THREE.Vector3(0, s.chuteOpen ? 3.4 : 6, s.chuteOpen ? 9 : 14));
      camera.position.lerp(camTarget, 1 - Math.exp(-4 * dt));
      const look = s.pos.clone().add(new THREE.Vector3(0, s.chuteOpen ? 1.5 : -14, 0));
      camera.lookAt(look);

      // landing
      if (s.pos.y <= 1.2) {
        s.pos.y = 1.2;
        s.landed = true;
        setPhase("ground");
        setAltitude(0);
        killFeedPush("OPERATOR SK.18 LANDED — SA SYSTEMS ONLINE");
        toast("BOOTS ON THE GROUND — SCROLL TO MOVE", "nav");
        window.dispatchEvent(new Event("sak-shake"));
        // hand over to journey camera at entry point
        useWorld.getState().setTargetJourney(0);
      }
      return;
    }
  });

  // position operator + chute during drop
  const phase = useWorld((st) => st.phase);
  const altitude = useWorld((st) => st.altitude);

  return (
    <>
      {/* plane visible in plane + early drop phases */}
      {(phase === "plane" || (phase === "drop" && altitude > 120)) && (
        <CargoPlane groupRef={planeRef} />
      )}

      {/* operator + parachute during drop */}
      {phase === "drop" && (
        <group ref={(g) => { if (g) g.position.copy(stateRef.current.pos); }}>
          <Parachute />
          {/* operator body (simple tactical figure) */}
          <mesh position={[0, -0.4, 0]} castShadow>
            <capsuleGeometry args={[0.34, 0.9, 4, 8]} />
            <meshStandardMaterial color="#2c3122" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.24, 8, 8]} />
            <meshStandardMaterial color="#1e2418" roughness={0.8} />
          </mesh>
          {/* backpack */}
          <mesh position={[0, -0.3, 0.34]}>
            <boxGeometry args={[0.44, 0.6, 0.28]} />
            <meshStandardMaterial color="#465040" roughness={0.9} />
          </mesh>
        </group>
      )}
    </>
  );
}
