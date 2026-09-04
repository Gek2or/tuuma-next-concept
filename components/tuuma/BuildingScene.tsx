"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, OrbitControls } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Group } from "three";
import * as THREE from "three";
import type { ApartmentVariant } from "@/lib/data";

type BuildingSceneProps = { variant?: ApartmentVariant };
type FacadeSpec = { base: string; line: string; accent: string; window: string; roof: string; label: string };

const specs: Record<ApartmentVariant, FacadeSpec> = {
  kalliolinna: { base: "#d9e1e0", line: "#9eb8ba", accent: "#c99951", window: "#345c78", roof: "#1c3d5c", label: "Vaalea kalkkikivi" },
  asemanvalo: { base: "#e3d4c2", line: "#bda48b", accent: "#c86447", window: "#334e66", roof: "#20374f", label: "Lämmin tiili" },
  ruukinranta: { base: "#c5d0bf", line: "#899d85", accent: "#b56f4e", window: "#274b61", roof: "#1f3545", label: "Metsänvihreä" },
  peltokaarre: { base: "#d7e0ea", line: "#9badbf", accent: "#6d90bd", window: "#254667", roof: "#18334f", label: "Pilvensininen" },
  keravanjoen: { base: "#d4cec1", line: "#a99e8d", accent: "#b07d48", window: "#294b60", roof: "#203848", label: "Luonnonmänty" },
};

function makeFacadeTexture(spec: FacadeSpec) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = spec.base;
  ctx.fillRect(0, 0, 256, 256);
  ctx.globalAlpha = 0.2;
  for (let y = 0; y < 256; y += 24) {
    ctx.strokeStyle = spec.line;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(256, y + 0.5);
    ctx.stroke();
  }
  ctx.globalAlpha = 0.14;
  for (let x = 0; x < 256; x += 32) {
    ctx.strokeStyle = spec.accent;
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, 256);
    ctx.stroke();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.6, 2.2);
  texture.anisotropy = 4;
  return texture;
}

function Building({ variant }: { variant: ApartmentVariant }) {
  const ref = useRef<Group>(null);
  const spec = specs[variant] ?? specs.kalliolinna;
  const facade = useMemo(() => makeFacadeTexture(spec), [spec]);
  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = Math.sin(s.clock.elapsedTime * 0.22) * 0.08 - 0.32;
  });
  const floors = [0, 1, 2, 3, 4];
  return (
    <group ref={ref} position={[0, -1.1, 0]}>
      {floors.map((floor) => (
        <group key={floor} position={[0, floor * 0.72, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[3.8, 0.64, 1.75]} />
            <meshStandardMaterial map={facade ?? undefined} color={floor === 4 ? "#f1e9da" : "#ffffff"} roughness={0.66} metalness={0.02} />
          </mesh>
          {[-1.25, -0.42, 0.42, 1.25].map((x, index) => (
            <group key={`${x}-${floor}`} position={[x, 0, 0.884]}>
              <mesh castShadow>
                <boxGeometry args={[0.5, 0.36, 0.035]} />
                <meshStandardMaterial color={index % 2 ? spec.window : "#9fc3cf"} roughness={0.18} metalness={0.18} emissive={spec.window} emissiveIntensity={0.08} />
              </mesh>
              <mesh position={[0, -0.23, 0.01]}>
                <boxGeometry args={[0.56, 0.04, 0.09]} />
                <meshStandardMaterial color={spec.accent} roughness={0.56} />
              </mesh>
            </group>
          ))}
          <mesh position={[0, -0.36, 0.97]} castShadow>
            <boxGeometry args={[4.05, 0.06, 0.18]} />
            <meshStandardMaterial color={spec.line} roughness={0.74} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, -0.23, 0]} receiveShadow>
        <boxGeometry args={[4.5, 0.15, 2.4]} />
        <meshStandardMaterial color="#b9c8c8" roughness={0.9} />
      </mesh>
      <mesh position={[1.2, 0.35, 0.89]} castShadow>
        <boxGeometry args={[0.85, 1.1, 0.04]} />
        <meshStandardMaterial color={spec.roof} roughness={0.35} metalness={0.12} />
      </mesh>
      <mesh position={[-1.3, 3.32, -0.03]} rotation={[0, 0.14, 0]}>
        <boxGeometry args={[1.6, 0.16, 1.95]} />
        <meshStandardMaterial color={spec.roof} roughness={0.52} />
      </mesh>
    </group>
  );
}

const fallbackArt: Record<ApartmentVariant, string> = {
  kalliolinna: "/art/tuusula-editorial-area.webp",
  asemanvalo: "/art/jokela-editorial-area.webp",
  ruukinranta: "/art/kellokoski-editorial-area.webp",
  peltokaarre: "/art/jokela-editorial-area.webp",
  keravanjoen: "/art/kellokoski-editorial-area.webp",
};

export default function BuildingScene({ variant = "kalliolinna" }: BuildingSceneProps) {
  const [webgl, setWebgl] = useState(false);
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const options = { failIfMajorPerformanceCaveat: true };
    const context = canvas.getContext("webgl2", options) || canvas.getContext("webgl", options);
    queueMicrotask(() => setWebgl(Boolean(context && "isContextLost" in context && !context.isContextLost())));
  }, []);
  if (!webgl) {
    return (
      <div className="relative h-full w-full overflow-hidden">
        <img src={fallbackArt[variant]} alt="Moderni suomalainen asuinympäristö, kevyt näkymä" className="h-full w-full object-cover" />
        <span className="absolute bottom-24 right-5 rounded-full bg-white/90 px-3 py-2 text-xs font-bold text-[#31516f]">Kevyt näkymä</span>
      </div>
    );
  }
  return (
    <Canvas dpr={[1, 1.35]} camera={{ position: [5, 3.7, 7], fov: 34 }} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={1.15} />
      <directionalLight position={[4, 8, 5]} intensity={2.3} castShadow shadow-mapSize={[1024, 1024]} />
      <Building variant={variant} />
      <ContactShadows position={[0, -1.36, 0]} opacity={0.22} scale={10} blur={2.5} />
      <Environment preset="city" />
      <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={1.12} maxPolarAngle={1.35} />
    </Canvas>
  );
}

export { specs as buildingMaterialSpecs };
