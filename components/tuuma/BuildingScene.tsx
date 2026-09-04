"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import type { Group } from "three";
function Building() {
  const ref = useRef<Group>(null);
  useFrame((s) => {
    if (ref.current)
      ref.current.rotation.y =
        Math.sin(s.clock.elapsedTime * 0.22) * 0.08 - 0.32;
  });
  const floors = [0, 1, 2, 3, 4];
  return (
    <group ref={ref} position={[0, -1.1, 0]}>
      {floors.map((f) => (
        <group key={f} position={[0, f * 0.72, 0]}>
          <mesh castShadow>
            <boxGeometry args={[3.8, 0.64, 1.75]} />
            <meshStandardMaterial
              color={f === 4 ? "#dcecff" : "#f8fbff"}
              roughness={0.48}
            />
          </mesh>
          {[-1.25, -0.42, 0.42, 1.25].map((x, i) => (
            <mesh key={x} position={[x, 0, 0.884]}>
              <boxGeometry args={[0.48, 0.34, 0.035]} />
              <meshStandardMaterial
                color={i % 2 ? "#4a8fd8" : "#9bd0ff"}
                emissive="#2e75bb"
                emissiveIntensity={0.12}
              />
            </mesh>
          ))}
        </group>
      ))}
      <mesh position={[0, -0.23, 0]}>
        <boxGeometry args={[4.5, 0.15, 2.4]} />
        <meshStandardMaterial color="#d6e0e7" />
      </mesh>
      <mesh position={[1.2, 0.35, 0.89]}>
        <boxGeometry args={[0.85, 1.1, 0.04]} />
        <meshStandardMaterial color="#173c67" />
      </mesh>
    </group>
  );
}
export default function BuildingScene() {
  const [webgl, setWebgl] = useState(false);
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const options = { failIfMajorPerformanceCaveat: true };
    const context =
      canvas.getContext("webgl2", options) || canvas.getContext("webgl", options);
    queueMicrotask(() => setWebgl(Boolean(context && !context.isContextLost())));
  }, []);
  if (!webgl) {
    return (
      <div className="relative h-full w-full overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1400&q=82"
          alt="Moderni vaalea asuinkerrostalo, 3D-näkymän kevyt vaihtoehto"
          className="h-full w-full object-cover"
        />
        <span className="absolute bottom-24 right-5 rounded-full bg-white/90 px-3 py-2 text-xs font-bold text-[#31516f]">
          Kevyt näkymä
        </span>
      </div>
    );
  }
  return (
    <Canvas
      dpr={[1, 1.35]}
      camera={{ position: [5, 3.7, 7], fov: 34 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={1.2} />
      <directionalLight position={[4, 8, 5]} intensity={2.3} castShadow />
      <Building />
      <ContactShadows
        position={[0, -1.36, 0]}
        opacity={0.2}
        scale={10}
        blur={2.5}
      />
      <Environment preset="city" />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={1.12}
        maxPolarAngle={1.35}
      />
    </Canvas>
  );
}
