import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef, useState, useEffect, useMemo } from "react";
import {
  PerspectiveCamera,
  Environment,
  ContactShadows,
  OrbitControls,
} from "@react-three/drei";
import * as THREE from "three";

/* ──────────────────────────────────────────────
   SHARED MATERIALS — cached once, reused everywhere
   ────────────────────────────────────────────── */

function useCarMaterials(bodyColor: string) {
  return useMemo(() => {
    const body = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(bodyColor),
      metalness: 0.95,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      envMapIntensity: 2.5,
      reflectivity: 1,
    });

    const carbonFiber = new THREE.MeshPhysicalMaterial({
      color: "#0a0a0a",
      metalness: 0.3,
      roughness: 0.45,
      clearcoat: 0.8,
      clearcoatRoughness: 0.15,
      envMapIntensity: 1.2,
    });

    const glossBlack = new THREE.MeshPhysicalMaterial({
      color: "#050505",
      metalness: 0.85,
      roughness: 0.05,
      clearcoat: 1.0,
      clearcoatRoughness: 0.02,
      envMapIntensity: 2.0,
    });

    const chrome = new THREE.MeshStandardMaterial({
      color: "#e8e8e8",
      metalness: 1.0,
      roughness: 0.05,
      envMapIntensity: 3.0,
    });

    const glass = new THREE.MeshPhysicalMaterial({
      color: "#111122",
      metalness: 0.1,
      roughness: 0.0,
      transmission: 0.85,
      thickness: 0.5,
      ior: 1.5,
      envMapIntensity: 1.5,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
    });

    const rubber = new THREE.MeshStandardMaterial({
      color: "#1a1a1a",
      metalness: 0.0,
      roughness: 0.92,
      envMapIntensity: 0.3,
    });

    const brakeCaliperMat = new THREE.MeshStandardMaterial({
      color: "#ff1a1a",
      metalness: 0.7,
      roughness: 0.25,
      envMapIntensity: 1.5,
    });

    const brakeDisc = new THREE.MeshStandardMaterial({
      color: "#555555",
      metalness: 0.9,
      roughness: 0.35,
      envMapIntensity: 1.0,
    });

    const leather = new THREE.MeshStandardMaterial({
      color: "#1a1a1a",
      metalness: 0.0,
      roughness: 0.7,
      envMapIntensity: 0.5,
    });

    const dashboard = new THREE.MeshStandardMaterial({
      color: "#0d0d0d",
      metalness: 0.3,
      roughness: 0.4,
    });

    const aluminum = new THREE.MeshStandardMaterial({
      color: "#cccccc",
      metalness: 0.95,
      roughness: 0.2,
      envMapIntensity: 2.0,
    });

    return { body, carbonFiber, glossBlack, chrome, glass, rubber, brakeCaliperMat, brakeDisc, leather, dashboard, aluminum };
  }, [bodyColor]);
}

/* ──────────────────────────────────────────────
   PROCEDURAL SHAPES — helper to build smooth curves
   ────────────────────────────────────────────── */

function createBodyShape(): THREE.Shape {
  const s = new THREE.Shape();
  // Side-profile silhouette (half-width, viewed from X-Z plane, Y is up)
  s.moveTo(-2.55, 0.15); // rear bottom
  s.lineTo(2.55, 0.15);  // front bottom
  s.quadraticCurveTo(2.7, 0.15, 2.7, 0.35); // front lip curve
  s.lineTo(2.55, 0.55);  // front hood line
  s.lineTo(1.9, 0.65);   // hood dip
  s.lineTo(1.2, 0.82);   // windshield base
  s.quadraticCurveTo(0.8, 1.35, 0.4, 1.42); // windshield curve up
  s.lineTo(-0.6, 1.42);  // roof
  s.quadraticCurveTo(-1.1, 1.4, -1.6, 1.15); // rear glass slope (coupe line)
  s.lineTo(-2.1, 0.85);  // trunk area
  s.quadraticCurveTo(-2.55, 0.7, -2.65, 0.45); // rear curve
  s.lineTo(-2.55, 0.15); // close
  return s;
}

/* ──────────────────────────────────────────────
   BODY COMPONENT — main SUV body panels
   ────────────────────────────────────────────── */

function Body({ material }: { material: THREE.Material }) {
  const bodyGeo = useMemo(() => {
    const group = new THREE.Group();
    // We'll compose the body from multiple meshes for realism
    return null; // placeholder – we use JSX below
  }, []);

  return (
    <group>
      {/* ── Main Body Shell ── */}
      {/* Lower body slab — wide, muscular */}
      <mesh castShadow receiveShadow material={material} position={[0, 0.42, 0]}>
        <boxGeometry args={[2.1, 0.55, 5.1]} />
      </mesh>

      {/* Body flare left */}
      <mesh castShadow material={material} position={[-1.08, 0.48, 0]} scale={[1, 1, 1]}>
        <boxGeometry args={[0.12, 0.65, 4.8]} />
      </mesh>
      {/* Body flare right */}
      <mesh castShadow material={material} position={[1.08, 0.48, 0]} scale={[1, 1, 1]}>
        <boxGeometry args={[0.12, 0.65, 4.8]} />
      </mesh>

      {/* Upper body taper */}
      <mesh castShadow receiveShadow material={material} position={[0, 0.78, -0.15]}>
        <boxGeometry args={[2.0, 0.2, 4.6]} />
      </mesh>

      {/* Hood — sculpted with dual power bulges */}
      <mesh castShadow material={material} position={[0, 0.88, 1.4]}>
        <boxGeometry args={[1.95, 0.08, 1.7]} />
      </mesh>
      {/* Hood bulge left */}
      <mesh castShadow material={material} position={[-0.4, 0.94, 1.35]}>
        <boxGeometry args={[0.35, 0.07, 1.2]} />
      </mesh>
      {/* Hood bulge right */}
      <mesh castShadow material={material} position={[0.4, 0.94, 1.35]}>
        <boxGeometry args={[0.35, 0.07, 1.2]} />
      </mesh>

      {/* Hood centre crease */}
      <mesh castShadow material={material} position={[0, 0.92, 1.4]}>
        <boxGeometry args={[0.04, 0.06, 1.6]} />
      </mesh>

      {/* ── Wheel Arches — muscular flares ── */}
      {/* Front left arch */}
      <mesh castShadow material={material} position={[-1.02, 0.38, 1.45]}>
        <boxGeometry args={[0.28, 0.75, 1.05]} />
      </mesh>
      {/* Front right arch */}
      <mesh castShadow material={material} position={[1.02, 0.38, 1.45]}>
        <boxGeometry args={[0.28, 0.75, 1.05]} />
      </mesh>
      {/* Rear left arch */}
      <mesh castShadow material={material} position={[-1.02, 0.38, -1.45]}>
        <boxGeometry args={[0.28, 0.75, 1.15]} />
      </mesh>
      {/* Rear right arch */}
      <mesh castShadow material={material} position={[1.02, 0.38, -1.45]}>
        <boxGeometry args={[0.28, 0.75, 1.15]} />
      </mesh>

      {/* Side character lines — sharp sculpted cuts */}
      <mesh material={material} position={[-1.06, 0.62, 0]} castShadow>
        <boxGeometry args={[0.04, 0.12, 3.8]} />
      </mesh>
      <mesh material={material} position={[1.06, 0.62, 0]} castShadow>
        <boxGeometry args={[0.04, 0.12, 3.8]} />
      </mesh>

      {/* Rocker panels / side skirts */}
      <mesh castShadow position={[-1.05, 0.12, 0]}>
        <boxGeometry args={[0.08, 0.12, 3.6]} />
        <meshPhysicalMaterial color="#0a0a0a" metalness={0.3} roughness={0.45} clearcoat={0.8} clearcoatRoughness={0.15} />
      </mesh>
      <mesh castShadow position={[1.05, 0.12, 0]}>
        <boxGeometry args={[0.08, 0.12, 3.6]} />
        <meshPhysicalMaterial color="#0a0a0a" metalness={0.3} roughness={0.45} clearcoat={0.8} clearcoatRoughness={0.15} />
      </mesh>

      {/* ── Cabin / Greenhouse ── */}
      {/* A-pillar to roof — coupe roofline */}
      <mesh castShadow material={material} position={[0, 1.15, -0.15]}>
        <boxGeometry args={[1.72, 0.5, 2.6]} />
      </mesh>

      {/* Roof panel — slightly narrower */}
      <mesh castShadow material={material} position={[0, 1.42, -0.3]}>
        <boxGeometry args={[1.6, 0.06, 2.1]} />
      </mesh>

      {/* Rear slope — coupe taper */}
      <mesh castShadow material={material} position={[0, 1.1, -1.6]} rotation={[0.35, 0, 0]}>
        <boxGeometry args={[1.7, 0.08, 0.9]} />
      </mesh>

      {/* Rear deck / trunk lid */}
      <mesh castShadow material={material} position={[0, 0.82, -2.15]}>
        <boxGeometry args={[1.9, 0.12, 0.7]} />
      </mesh>

      {/* Rear bumper */}
      <mesh castShadow material={material} position={[0, 0.35, -2.58]}>
        <boxGeometry args={[2.1, 0.5, 0.15]} />
      </mesh>

      {/* Front bumper */}
      <mesh castShadow material={material} position={[0, 0.35, 2.58]}>
        <boxGeometry args={[2.1, 0.5, 0.15]} />
      </mesh>
    </group>
  );
}

/* ──────────────────────────────────────────────
   FRONT FASCIA — grille, intakes, splitter
   ────────────────────────────────────────────── */

function FrontFascia({ glossBlack, carbonFiber }: { glossBlack: THREE.Material; carbonFiber: THREE.Material }) {
  return (
    <group position={[0, 0, 2.55]}>
      {/* Hexagonal grille — gloss black */}
      <mesh material={glossBlack} position={[0, 0.42, 0.12]}>
        <boxGeometry args={[1.3, 0.35, 0.06]} />
      </mesh>
      {/* Grille honeycomb detail bars */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`grill-h-${i}`} material={glossBlack} position={[-0.5 + i * 0.14, 0.42, 0.16]}>
          <boxGeometry args={[0.02, 0.3, 0.02]} />
        </mesh>
      ))}
      {Array.from({ length: 4 }).map((_, i) => (
        <mesh key={`grill-v-${i}`} material={glossBlack} position={[0, 0.32 + i * 0.08, 0.16]}>
          <boxGeometry args={[1.25, 0.015, 0.02]} />
        </mesh>
      ))}

      {/* Lower air intakes — left */}
      <mesh material={glossBlack} position={[-0.65, 0.2, 0.12]}>
        <boxGeometry args={[0.55, 0.2, 0.06]} />
      </mesh>
      {/* Lower air intakes — right */}
      <mesh material={glossBlack} position={[0.65, 0.2, 0.12]}>
        <boxGeometry args={[0.55, 0.2, 0.06]} />
      </mesh>
      {/* Centre lower intake */}
      <mesh material={glossBlack} position={[0, 0.15, 0.12]}>
        <boxGeometry args={[0.45, 0.12, 0.06]} />
      </mesh>

      {/* Carbon fiber front splitter */}
      <mesh material={carbonFiber} position={[0, 0.07, 0.2]} castShadow>
        <boxGeometry args={[2.2, 0.04, 0.25]} />
      </mesh>

      {/* Front lip accent */}
      <mesh position={[0, 0.09, 0.25]}>
        <boxGeometry args={[1.8, 0.015, 0.04]} />
        <meshStandardMaterial color="#333" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}

/* ──────────────────────────────────────────────
   HEADLIGHTS — Y-shaped LED DRL + multi-layer
   ────────────────────────────────────────────── */

function Headlights() {
  return (
    <group>
      {[1, -1].map((side) => (
        <group key={`hl-${side}`} position={[side * 0.78, 0.68, 2.6]}>
          {/* Housing */}
          <mesh>
            <boxGeometry args={[0.42, 0.18, 0.1]} />
            <meshPhysicalMaterial color="#080808" metalness={0.6} roughness={0.1} clearcoat={1} />
          </mesh>
          {/* Inner reflector */}
          <mesh position={[0, 0, -0.02]}>
            <boxGeometry args={[0.36, 0.12, 0.04]} />
            <meshStandardMaterial color="#222" metalness={0.95} roughness={0.05} />
          </mesh>
          {/* Y-shaped DRL — upper arm */}
          <mesh position={[side * 0.08, 0.06, 0.06]}>
            <boxGeometry args={[0.18, 0.02, 0.02]} />
            <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={12} toneMapped={false} />
          </mesh>
          {/* Y-shaped DRL — lower arm */}
          <mesh position={[side * 0.08, -0.04, 0.06]}>
            <boxGeometry args={[0.15, 0.02, 0.02]} />
            <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={12} toneMapped={false} />
          </mesh>
          {/* Y-shaped DRL — stem */}
          <mesh position={[side * -0.05, 0.01, 0.06]}>
            <boxGeometry args={[0.02, 0.12, 0.02]} />
            <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={12} toneMapped={false} />
          </mesh>
          {/* Main LED projector */}
          <mesh position={[0, 0, 0.05]}>
            <sphereGeometry args={[0.04, 16, 16]} />
            <meshStandardMaterial color="#ffffff" emissive="#ddeeff" emissiveIntensity={5} toneMapped={false} />
          </mesh>
          {/* Lens cover (glass) */}
          <mesh position={[0, 0, 0.06]}>
            <boxGeometry args={[0.4, 0.16, 0.01]} />
            <meshPhysicalMaterial color="#111122" metalness={0.1} roughness={0} transmission={0.8} thickness={0.3} transparent opacity={0.3} />
          </mesh>
          {/* Point light for glow */}
          <pointLight position={[0, 0, 0.15]} intensity={15} distance={4} color="#00f2ff" />
        </group>
      ))}
    </group>
  );
}

/* ──────────────────────────────────────────────
   TAILLIGHTS — Y-pattern LED strip
   ────────────────────────────────────────────── */

function Taillights() {
  return (
    <group>
      {/* Full-width light bar */}
      <mesh position={[0, 0.72, -2.6]}>
        <boxGeometry args={[1.8, 0.06, 0.04]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={6} toneMapped={false} />
      </mesh>

      {[1, -1].map((side) => (
        <group key={`tl-${side}`} position={[side * 0.7, 0.72, -2.62]}>
          {/* Housing */}
          <mesh>
            <boxGeometry args={[0.45, 0.14, 0.08]} />
            <meshPhysicalMaterial color="#1a0000" metalness={0.5} roughness={0.1} clearcoat={1} />
          </mesh>
          {/* Y-pattern upper */}
          <mesh position={[side * 0.08, 0.03, 0.05]}>
            <boxGeometry args={[0.14, 0.02, 0.02]} />
            <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={15} toneMapped={false} />
          </mesh>
          {/* Y-pattern lower */}
          <mesh position={[side * 0.08, -0.03, 0.05]}>
            <boxGeometry args={[0.12, 0.02, 0.02]} />
            <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={15} toneMapped={false} />
          </mesh>
          {/* Y-stem */}
          <mesh position={[side * -0.04, 0, 0.05]}>
            <boxGeometry args={[0.02, 0.08, 0.02]} />
            <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={15} toneMapped={false} />
          </mesh>
          {/* Tinted lens */}
          <mesh position={[0, 0, 0.05]}>
            <boxGeometry args={[0.43, 0.12, 0.01]} />
            <meshPhysicalMaterial color="#220000" metalness={0.1} roughness={0} transmission={0.4} thickness={0.3} transparent opacity={0.5} />
          </mesh>
          <pointLight position={[0, 0, -0.1]} intensity={8} distance={3} color="#ff0000" />
        </group>
      ))}
    </group>
  );
}

/* ──────────────────────────────────────────────
   REAR DETAILS — diffuser, exhaust, spoiler
   ────────────────────────────────────────────── */

function RearDetails({ carbonFiber, glossBlack, chrome }: { carbonFiber: THREE.Material; glossBlack: THREE.Material; chrome: THREE.Material }) {
  return (
    <group>
      {/* Rear diffuser */}
      <mesh material={carbonFiber} position={[0, 0.12, -2.65]} castShadow>
        <boxGeometry args={[1.6, 0.18, 0.12]} />
      </mesh>
      {/* Diffuser fins */}
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={`dfin-${i}`} material={glossBlack} position={[-0.55 + i * 0.28, 0.12, -2.7]}>
          <boxGeometry args={[0.03, 0.14, 0.08]} />
        </mesh>
      ))}

      {/* Quad exhaust tips */}
      {[[-0.55, 0.14, -2.72], [-0.32, 0.14, -2.72], [0.32, 0.14, -2.72], [0.55, 0.14, -2.72]].map((pos, i) => (
        <group key={`exh-${i}`} position={pos as [number, number, number]}>
          <mesh material={chrome} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.06, 0.015, 16, 32]} />
          </mesh>
          <mesh position={[0, 0, -0.02]}>
            <cylinderGeometry args={[0.05, 0.05, 0.04, 24]} />
            <meshStandardMaterial color="#111" metalness={0.8} roughness={0.3} />
          </mesh>
        </group>
      ))}

      {/* Integrated rear spoiler */}
      <mesh material={carbonFiber} position={[0, 1.44, -1.3]} castShadow>
        <boxGeometry args={[1.55, 0.03, 0.25]} />
      </mesh>
      {/* Spoiler end plates */}
      <mesh material={carbonFiber} position={[-0.78, 1.42, -1.3]}>
        <boxGeometry args={[0.04, 0.06, 0.22]} />
      </mesh>
      <mesh material={carbonFiber} position={[0.78, 1.42, -1.3]}>
        <boxGeometry args={[0.04, 0.06, 0.22]} />
      </mesh>

      {/* Rear reflectors */}
      <mesh position={[-0.85, 0.25, -2.63]}>
        <boxGeometry args={[0.12, 0.04, 0.02]} />
        <meshStandardMaterial color="#ff3300" emissive="#ff2200" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0.85, 0.25, -2.63]}>
        <boxGeometry args={[0.12, 0.04, 0.02]} />
        <meshStandardMaterial color="#ff3300" emissive="#ff2200" emissiveIntensity={2} />
      </mesh>
    </group>
  );
}

/* ──────────────────────────────────────────────
   WHEEL ASSEMBLY — multi-spoke rims, brakes, tires
   ────────────────────────────────────────────── */

function WheelAssembly({
  position,
  rubber,
  chrome,
  brakeCaliperMat,
  brakeDiscMat,
  side,
}: {
  position: [number, number, number];
  rubber: THREE.Material;
  chrome: THREE.Material;
  brakeCaliperMat: THREE.Material;
  brakeDiscMat: THREE.Material;
  side: "left" | "right";
}) {
  const wheelRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (wheelRef.current) {
      // Subtle idle spin
      wheelRef.current.rotation.x += 0.003;
    }
  });

  const spokeCount = 10;
  const mirrorX = side === "left" ? -1 : 1;

  return (
    <group position={position}>
      {/* Tire — torus for low-profile look */}
      <mesh material={rubber} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.38, 0.12, 24, 48]} />
      </mesh>

      {/* Rim outer ring */}
      <group ref={wheelRef} rotation={[0, 0, Math.PI / 2]}>
        <mesh material={chrome}>
          <torusGeometry args={[0.29, 0.03, 16, 48]} />
        </mesh>
        {/* Multi-spoke design */}
        {Array.from({ length: spokeCount }).map((_, i) => {
          const angle = (i / spokeCount) * Math.PI * 2;
          return (
            <mesh
              key={`spoke-${i}`}
              material={chrome}
              position={[
                Math.cos(angle) * 0.14,
                mirrorX * 0.01,
                Math.sin(angle) * 0.14,
              ]}
              rotation={[0, 0, angle]}
            >
              <boxGeometry args={[0.025, 0.04, 0.26]} />
            </mesh>
          );
        })}

        {/* Centre hub */}
        <mesh material={chrome} position={[0, mirrorX * 0.02, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.04, 24]} />
        </mesh>
        {/* Centre cap */}
        <mesh position={[0, mirrorX * 0.04, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.02, 24]} />
          <meshStandardMaterial color="#111" metalness={0.9} roughness={0.1} />
        </mesh>
      </group>

      {/* Brake disc */}
      <mesh material={brakeDiscMat} rotation={[0, 0, Math.PI / 2]} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.02, 32]} />
      </mesh>
      {/* Brake disc ventilation slots */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        return (
          <mesh
            key={`bslot-${i}`}
            rotation={[0, 0, Math.PI / 2]}
            position={[Math.cos(angle) * 0.15, 0, Math.sin(angle) * 0.15]}
          >
            <boxGeometry args={[0.008, 0.025, 0.04]} />
            <meshStandardMaterial color="#333" metalness={0.8} roughness={0.4} />
          </mesh>
        );
      })}

      {/* Brake caliper */}
      <mesh material={brakeCaliperMat} position={[0, mirrorX * 0.06, 0.15]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.1, 0.08, 0.06]} />
      </mesh>
      {/* Caliper text detail */}
      <mesh position={[0, mirrorX * 0.08, 0.15]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.06, 0.01, 0.04]} />
        <meshStandardMaterial color="#ffffff" metalness={0.3} roughness={0.5} />
      </mesh>
    </group>
  );
}

/* ──────────────────────────────────────────────
   GLASS PANELS — windshield, side windows, rear
   ────────────────────────────────────────────── */

function GlassPanels({ glass }: { glass: THREE.Material }) {
  return (
    <group>
      {/* Windshield */}
      <mesh material={glass} position={[0, 1.12, 0.95]} rotation={[-0.7, 0, 0]} castShadow>
        <planeGeometry args={[1.65, 0.65]} />
      </mesh>

      {/* Rear window */}
      <mesh material={glass} position={[0, 1.15, -1.7]} rotation={[0.5, 0, 0]}>
        <planeGeometry args={[1.55, 0.5]} />
      </mesh>

      {/* Side windows left */}
      <mesh material={glass} position={[-0.87, 1.15, 0.1]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[1.8, 0.42]} />
      </mesh>
      {/* Side windows right */}
      <mesh material={glass} position={[0.87, 1.15, 0.1]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.8, 0.42]} />
      </mesh>

      {/* Quarter window left */}
      <mesh material={glass} position={[-0.86, 1.15, -1.1]} rotation={[0, -Math.PI / 2 - 0.15, 0]}>
        <planeGeometry args={[0.5, 0.35]} />
      </mesh>
      {/* Quarter window right */}
      <mesh material={glass} position={[0.86, 1.15, -1.1]} rotation={[0, Math.PI / 2 + 0.15, 0]}>
        <planeGeometry args={[0.5, 0.35]} />
      </mesh>

      {/* Gloss black window surrounds (frameless look) */}
      {[[-0.87, 1.38, 0.1, 0, -Math.PI / 2, 0, 1.85, 0.04],
        [0.87, 1.38, 0.1, 0, Math.PI / 2, 0, 1.85, 0.04]].map((p, i) => (
        <mesh key={`wsurr-${i}`} position={[p[0], p[1], p[2]]} rotation={[p[3], p[4], p[5]]}>
          <planeGeometry args={[p[6], p[7]]} />
          <meshStandardMaterial color="#050505" metalness={0.85} roughness={0.05} />
        </mesh>
      ))}
    </group>
  );
}

/* ──────────────────────────────────────────────
   SIDE MIRRORS — gloss black
   ────────────────────────────────────────────── */

function SideMirrors({ glossBlack }: { glossBlack: THREE.Material }) {
  return (
    <group>
      {[1, -1].map((side) => (
        <group key={`mir-${side}`} position={[side * 1.12, 1.05, 0.6]}>
          {/* Mirror arm */}
          <mesh material={glossBlack}>
            <boxGeometry args={[0.05, 0.04, 0.12]} />
          </mesh>
          {/* Mirror housing */}
          <mesh material={glossBlack} position={[side * 0.04, 0, 0.08]}>
            <boxGeometry args={[0.04, 0.1, 0.14]} />
          </mesh>
          {/* Mirror surface */}
          <mesh position={[side * 0.065, 0, 0.08]}>
            <planeGeometry args={[0.01, 0.08]} />
            <meshStandardMaterial color="#ccddee" metalness={1} roughness={0} />
          </mesh>
          {/* Turn signal on mirror */}
          <mesh position={[side * 0.04, -0.06, 0.08]}>
            <boxGeometry args={[0.03, 0.01, 0.08]} />
            <meshStandardMaterial color="#ffaa00" emissive="#ffaa00" emissiveIntensity={3} toneMapped={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ──────────────────────────────────────────────
   INTERIOR — visible through windows
   ────────────────────────────────────────────── */

function Interior({ leather, dashboard, aluminum }: { leather: THREE.Material; dashboard: THREE.Material; aluminum: THREE.Material }) {
  return (
    <group position={[0, 0.88, -0.1]}>
      {/* Dashboard */}
      <mesh material={dashboard} position={[0, 0.22, 0.65]}>
        <boxGeometry args={[1.5, 0.15, 0.3]} />
      </mesh>
      {/* Digital screen */}
      <mesh position={[0, 0.3, 0.72]}>
        <planeGeometry args={[0.8, 0.12]} />
        <meshStandardMaterial color="#001133" emissive="#003366" emissiveIntensity={3} toneMapped={false} />
      </mesh>
      {/* Instrument cluster */}
      <mesh position={[0, 0.32, 0.68]} rotation={[-0.3, 0, 0]}>
        <planeGeometry args={[0.5, 0.1]} />
        <meshStandardMaterial color="#000a1a" emissive="#0066ff" emissiveIntensity={2} toneMapped={false} />
      </mesh>

      {/* Steering wheel — flat bottom */}
      <mesh material={leather} position={[0.35, 0.25, 0.5]} rotation={[0.4, 0, 0]}>
        <torusGeometry args={[0.12, 0.015, 12, 24, Math.PI * 1.6]} />
      </mesh>
      {/* Steering wheel bottom */}
      <mesh material={aluminum} position={[0.35, 0.17, 0.5]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.16, 0.015, 0.015]} />
      </mesh>

      {/* Centre console */}
      <mesh material={dashboard} position={[0, 0.05, 0.15]}>
        <boxGeometry args={[0.35, 0.2, 1.0]} />
      </mesh>
      {/* Centre console trim */}
      <mesh material={aluminum} position={[0, 0.16, 0.15]}>
        <boxGeometry args={[0.33, 0.01, 0.95]} />
      </mesh>

      {/* Front seats */}
      {[0.42, -0.42].map((x, i) => (
        <group key={`seat-${i}`} position={[x, 0, -0.1]}>
          {/* Seat base */}
          <mesh material={leather} position={[0, 0.02, 0]}>
            <boxGeometry args={[0.35, 0.1, 0.5]} />
          </mesh>
          {/* Seat back */}
          <mesh material={leather} position={[0, 0.22, -0.2]} rotation={[0.15, 0, 0]}>
            <boxGeometry args={[0.33, 0.35, 0.08]} />
          </mesh>
          {/* Headrest */}
          <mesh material={leather} position={[0, 0.45, -0.22]}>
            <boxGeometry args={[0.18, 0.12, 0.06]} />
          </mesh>
          {/* Side bolster left */}
          <mesh material={leather} position={[-0.16, 0.15, -0.1]}>
            <boxGeometry args={[0.04, 0.25, 0.35]} />
          </mesh>
          {/* Side bolster right */}
          <mesh material={leather} position={[0.16, 0.15, -0.1]}>
            <boxGeometry args={[0.04, 0.25, 0.35]} />
          </mesh>
        </group>
      ))}

      {/* Rear seats (smaller) */}
      {[0.35, -0.35].map((x, i) => (
        <group key={`rseat-${i}`} position={[x, -0.02, -0.85]}>
          <mesh material={leather} position={[0, 0.02, 0]}>
            <boxGeometry args={[0.32, 0.08, 0.4]} />
          </mesh>
          <mesh material={leather} position={[0, 0.18, -0.16]} rotation={[0.2, 0, 0]}>
            <boxGeometry args={[0.3, 0.28, 0.06]} />
          </mesh>
        </group>
      ))}

      {/* Ambient lighting strips */}
      <mesh position={[-0.74, 0.15, 0.1]}>
        <boxGeometry args={[0.01, 0.01, 1.8]} />
        <meshStandardMaterial color="#0066ff" emissive="#0066ff" emissiveIntensity={6} toneMapped={false} />
      </mesh>
      <mesh position={[0.74, 0.15, 0.1]}>
        <boxGeometry args={[0.01, 0.01, 1.8]} />
        <meshStandardMaterial color="#0066ff" emissive="#0066ff" emissiveIntensity={6} toneMapped={false} />
      </mesh>
      {/* Dashboard ambient strip */}
      <mesh position={[0, 0.17, 0.78]}>
        <boxGeometry args={[1.4, 0.005, 0.005]} />
        <meshStandardMaterial color="#0066ff" emissive="#0066ff" emissiveIntensity={8} toneMapped={false} />
      </mesh>

      {/* Floor */}
      <mesh position={[0, -0.08, 0]}>
        <boxGeometry args={[1.5, 0.02, 2.2]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} />
      </mesh>
    </group>
  );
}

/* ──────────────────────────────────────────────
   PANEL GAPS & DETAIL TRIMS
   ────────────────────────────────────────────── */

function PanelDetails({ glossBlack }: { glossBlack: THREE.Material }) {
  return (
    <group>
      {/* Door seam lines */}
      {[0.5, -0.5].map((z, i) => (
        <group key={`door-${i}`}>
          <mesh position={[-1.07, 0.65, z]}>
            <boxGeometry args={[0.005, 0.55, 0.005]} />
            <meshStandardMaterial color="#000" />
          </mesh>
          <mesh position={[1.07, 0.65, z]}>
            <boxGeometry args={[0.005, 0.55, 0.005]} />
            <meshStandardMaterial color="#000" />
          </mesh>
        </group>
      ))}

      {/* Hood gap */}
      <mesh position={[0, 0.89, 0.55]}>
        <boxGeometry args={[1.9, 0.005, 0.005]} />
        <meshStandardMaterial color="#000" />
      </mesh>

      {/* Trunk gap */}
      <mesh position={[0, 0.83, -1.78]}>
        <boxGeometry args={[1.85, 0.005, 0.005]} />
        <meshStandardMaterial color="#000" />
      </mesh>

      {/* B-pillar black trim */}
      <mesh material={glossBlack} position={[-0.86, 1.15, -0.45]}>
        <boxGeometry args={[0.03, 0.45, 0.06]} />
      </mesh>
      <mesh material={glossBlack} position={[0.86, 1.15, -0.45]}>
        <boxGeometry args={[0.03, 0.45, 0.06]} />
      </mesh>

      {/* Front fender vents */}
      {[1, -1].map((side) => (
        <group key={`fvent-${side}`} position={[side * 1.1, 0.55, 0.8]}>
          {Array.from({ length: 3 }).map((_, i) => (
            <mesh key={`fvs-${i}`} position={[0, i * 0.06 - 0.06, 0]}>
              <boxGeometry args={[0.02, 0.02, 0.15]} />
              <meshStandardMaterial color="#222" metalness={0.8} roughness={0.2} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

/* ──────────────────────────────────────────────
   FLOOR / GROUND PLANE
   ────────────────────────────────────────────── */

function GroundPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial
        color="#080808"
        metalness={0.6}
        roughness={0.8}
        envMapIntensity={0.3}
      />
    </mesh>
  );
}

/* ══════════════════════════════════════════════
   MAIN AUREX SUV COMPONENT
   ══════════════════════════════════════════════ */

function AurexSUV({ color = "#1a1a1a" }: { color?: string }) {
  const carRef = useRef<THREE.Group>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      setScrollProgress(Math.min(Math.max(progress, 0), 1));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useFrame((state) => {
    if (!carRef.current) return;
    const offset = scrollProgress;
    const t = state.clock.elapsedTime;

    // Cinematic scroll-driven camera orbit
    carRef.current.rotation.y = THREE.MathUtils.lerp(
      -Math.PI * 0.1,
      Math.PI * 0.65,
      offset
    );
    // Gentle idle float
    carRef.current.position.y = Math.sin(t * 0.8) * 0.015;
  });

  const mats = useCarMaterials(color);

  return (
    <group ref={carRef} dispose={null} position={[0, 0.05, 0]}>
      <Body material={mats.body} />
      <FrontFascia glossBlack={mats.glossBlack} carbonFiber={mats.carbonFiber} />
      <Headlights />
      <Taillights />
      <RearDetails carbonFiber={mats.carbonFiber} glossBlack={mats.glossBlack} chrome={mats.chrome} />

      {/* Wheel assemblies — 22-inch stance */}
      <WheelAssembly position={[-1.0, 0.38, 1.45]} rubber={mats.rubber} chrome={mats.chrome} brakeCaliperMat={mats.brakeCaliperMat} brakeDiscMat={mats.brakeDisc} side="left" />
      <WheelAssembly position={[1.0, 0.38, 1.45]} rubber={mats.rubber} chrome={mats.chrome} brakeCaliperMat={mats.brakeCaliperMat} brakeDiscMat={mats.brakeDisc} side="right" />
      <WheelAssembly position={[-1.0, 0.38, -1.45]} rubber={mats.rubber} chrome={mats.chrome} brakeCaliperMat={mats.brakeCaliperMat} brakeDiscMat={mats.brakeDisc} side="left" />
      <WheelAssembly position={[1.0, 0.38, -1.45]} rubber={mats.rubber} chrome={mats.chrome} brakeCaliperMat={mats.brakeCaliperMat} brakeDiscMat={mats.brakeDisc} side="right" />

      <GlassPanels glass={mats.glass} />
      <SideMirrors glossBlack={mats.glossBlack} />
      <Interior leather={mats.leather} dashboard={mats.dashboard} aluminum={mats.aluminum} />
      <PanelDetails glossBlack={mats.glossBlack} />
    </group>
  );
}

/* ══════════════════════════════════════════════
   SCENE LIGHTING — cinematic studio HDR
   ══════════════════════════════════════════════ */

function StudioLighting() {
  return (
    <>
      {/* Ambient fill */}
      <ambientLight intensity={0.15} color="#b0c4de" />

      {/* Key light — soft overhead */}
      <spotLight
        position={[5, 12, 8]}
        angle={0.25}
        penumbra={1}
        intensity={3000}
        castShadow
        color="#ffffff"
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />

      {/* Fill light — opposite side, cooler */}
      <spotLight
        position={[-8, 8, -5]}
        angle={0.3}
        penumbra={1}
        intensity={1500}
        color="#a0c4ff"
      />

      {/* Rim light — dramatic back edge highlight */}
      <spotLight
        position={[0, 6, -12]}
        angle={0.2}
        penumbra={0.8}
        intensity={2500}
        color="#ffffff"
      />

      {/* Under-car accent */}
      <pointLight position={[0, 0.05, 0]} intensity={8} distance={3} color="#0044ff" />

      {/* Side accent lights for showroom feel */}
      <pointLight position={[-6, 3, 0]} intensity={400} color="#3b82f6" distance={15} />
      <pointLight position={[6, 3, 0]} intensity={400} color="#3b82f6" distance={15} />

      {/* Top rect light for smooth body reflections */}
      <rectAreaLight width={8} height={8} intensity={4} position={[0, 8, 0]} rotation={[-Math.PI / 2, 0, 0]} color="#ffffff" />
      <rectAreaLight width={4} height={2} intensity={3} position={[0, 4, 6]} color="#ffffff" />
    </>
  );
}

/* ══════════════════════════════════════════════
   EXPORTED CANVAS3D COMPONENT
   ══════════════════════════════════════════════ */

interface SceneProps {
  color?: string;
}

export function Canvas3D({ color }: SceneProps) {
  return (
    <Canvas
      shadows
      className="w-full h-full"
      style={{ minHeight: 400 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.3,
      }}
    >
      <PerspectiveCamera makeDefault position={[5.5, 3, 8.5]} fov={30} near={0.1} far={200} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI * 0.25}
        maxPolarAngle={Math.PI * 0.48}
        autoRotate
        autoRotateSpeed={0.4}
        target={[0, 0.6, 0]}
      />

      <Suspense fallback={null}>
        <Environment preset="night" background={false} />
        <StudioLighting />

        <AurexSUV color={color} />

        <ContactShadows
          resolution={512}
          scale={20}
          blur={2.5}
          opacity={0.65}
          far={8}
          color="#000000"
          position={[0, -0.01, 0]}
        />

        <GroundPlane />
      </Suspense>
    </Canvas>
  );
}
