import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef, useMemo } from "react";
import { PerspectiveCamera, Environment, ContactShadows, Float, useScroll } from "@react-three/drei";
import * as THREE from "three";

function PlaceholderCar({ color = "#1a1a1a" }: { color?: string }) {
  const carRef = useRef<THREE.Group>(null);
  const scroll = useScroll();

  useFrame((state) => {
    if (!carRef.current) return;
    
    // Get scroll progress (0 to 1)
    const offset = scroll.offset;
    
    // Move from X to Y (-10 to 10 on Z axis for "going places" feel)
    // And slightly side to side
    carRef.current.position.z = THREE.MathUtils.lerp(5, -15, offset);
    carRef.current.position.x = Math.sin(offset * Math.PI) * 2;
    
    // Smooth rotation based on scroll and time
    carRef.current.rotation.y = THREE.MathUtils.lerp(0, Math.PI * 0.5, offset);
    
    // Subtle tilt when "turning"
    carRef.current.rotation.z = Math.sin(offset * Math.PI) * 0.1;
  });

  return (
    <group ref={carRef} dispose={null}>
      {/* Abstract sleek car shape */}
      <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[2, 0.8, 4.5]} />
          <meshStandardMaterial 
            color={color} 
            metalness={0.9} 
            roughness={0.1} 
            envMapIntensity={2}
          />
        </mesh>
        
        {/* Cockpit */}
        <mesh position={[0, 1.0, -0.5]} castShadow>
          <boxGeometry args={[1.6, 0.6, 2]} />
          <meshPhysicalMaterial 
            color="#000000" 
            metalness={1} 
            roughness={0.05} 
            transmission={0.7}
            thickness={1.5}
          />
        </mesh>

        {/* Wheels - simplified */}
        {[[-1.1, 0, 1.5], [1.1, 0, 1.5], [-1.1, 0, -1.5], [1.1, 0, -1.5]].map((pos, i) => (
          <mesh key={i} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.4, 0.4, 0.4, 32]} />
            <meshStandardMaterial color="#050505" metalness={0.8} roughness={0.9} />
            <mesh position={[0, 0.21, 0]}>
              <cylinderGeometry args={[0.25, 0.25, 0.05, 16]} />
              <meshStandardMaterial color="#222" emissive="#333" emissiveIntensity={0.5} />
            </mesh>
          </mesh>
        ))}

        {/* Headlights */}
        <mesh position={[0.6, 0.6, 2.26]}>
          <boxGeometry args={[0.5, 0.1, 0.1]} />
          <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={10} toneMapped={false} />
        </mesh>
        <mesh position={[-0.6, 0.6, 2.26]}>
          <boxGeometry args={[0.5, 0.1, 0.1]} />
          <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={10} toneMapped={false} />
        </mesh>

        {/* Taillights */}
        <mesh position={[0, 0.6, -2.26]}>
          <boxGeometry args={[1.8, 0.05, 0.1]} />
          <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={8} toneMapped={false} />
        </mesh>
      </Float>
    </group>
  );
}

interface SceneProps {
  color?: string;
}

export function Canvas3D({ color }: SceneProps) {
  return (
    <Canvas 
      shadows 
      className="w-full h-full"
      dpr={[1, 2]} // Performance optimization for 60fps
      gl={{ 
        antialias: true,
        powerPreference: "high-performance",
        alpha: true
      }}
    >
      <PerspectiveCamera makeDefault position={[0, 2, 10]} fov={35} />
      
      <Suspense fallback={null}>
        <Environment preset="night" />
        
        <ambientLight intensity={0.2} />
        <spotLight 
          position={[10, 20, 10]} 
          angle={0.15} 
          penumbra={1} 
          intensity={2000} 
          castShadow 
          color="#ffffff"
        />
        <pointLight position={[-10, 5, -10]} intensity={1000} color="#3b82f6" />
        <rectAreaLight
          width={10}
          height={10}
          intensity={5}
          position={[0, 5, 5]}
          color="#ffffff"
        />

        <PlaceholderCar color={color} />
        
        <ContactShadows 
          resolution={512} 
          scale={30} 
          blur={2.5} 
          opacity={0.6} 
          far={10} 
          color="#000000" 
        />
        
        {/* Simple grid floor for depth perception */}
        <gridHelper args={[100, 50, 0x333333, 0x111111]} position={[0, -0.01, 0]} />
      </Suspense>
    </Canvas>
  );
}
