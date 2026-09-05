"use client";
import { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import type { ApartmentVariant } from "@/lib/data";
import { Block, useSurface } from "./ArchitecturalModel";
import { SceneBoundary, useSceneReady } from "./ApartmentDollhouse";
import { useLanguage } from "./LanguageProvider";
export const buildingSpecs: Record<ApartmentVariant, {
    name: string;
    floors: number;
    units: number;
    width: number;
    depth: number;
    surface: "brick" | "timber";
    base: string;
    accent: string;
    roof: string;
    pitched: boolean;
    wing?: boolean;
}> = {
    kalliolinna: { name: "Kalliolinna", floors: 5, units: 3, width: 24, depth: 11, surface: "brick", base: "#ddd8ca", accent: "#b39468", roof: "#626b69", pitched: false },
    asemanvalo: { name: "Asemanvalo", floors: 4, units: 3, width: 21, depth: 10, surface: "brick", base: "#a36145", accent: "#d7c6ab", roof: "#39494d", pitched: false, wing: true },
    ruukinranta: { name: "Ruukinranta", floors: 1, units: 4, width: 24.8, depth: 7.9, surface: "timber", base: "#718374", accent: "#d0b994", roof: "#495452", pitched: true },
    peltokaarre: { name: "Peltokaarre", floors: 3, units: 3, width: 16.5, depth: 8.2, surface: "brick", base: "#ded8c9", accent: "#7e9caa", roof: "#42505a", pitched: true },
    keravanjoen: { name: "Keravanjoen piha", floors: 1, units: 3, width: 23.4, depth: 9.9, surface: "timber", base: "#b8976b", accent: "#758582", roof: "#485557", pitched: true },
};
function Roof({ width, depth, y, color }: {
    width: number;
    depth: number;
    y: number;
    color: string;
}) {
    const geometry = useMemo(() => { const shape = new THREE.Shape(); shape.moveTo(-depth / 2 - .45, 0); shape.lineTo(0, depth * .29); shape.lineTo(depth / 2 + .45, 0); shape.closePath(); return new THREE.ExtrudeGeometry(shape, { depth: width + .6, bevelEnabled: false }); }, [width, depth]);
    return <mesh geometry={geometry} position={[-.3, y, depth / 2]} rotation={[0, Math.PI / 2, 0]} castShadow><meshStandardMaterial color={color} roughness={.75}/></mesh>;
}
function Window({ x, y, z, accent, balcony = false, width = 1.7 }: {
    x: number;
    y: number;
    z: number;
    accent: string;
    balcony?: boolean;
    width?: number;
}) {
    return <group position={[x, y, z]}><Block p={[0, 0, 0]} s={[width + .18, 1.76, .14]} color="#deded6"/><Block p={[0, 0, .08]} s={[width, 1.60, .06]} color="#658797" roughness={.12}/><Block p={[width * .15, 0, .12]} s={[.055, 1.63, .03]} color="#deded6"/><Block p={[0, -.87, .1]} s={[width + .28, .055, .25]} color={accent}/>{balcony && <group position={[0, -1.4, .1]}><Block p={[0, 0, .7]} s={[3.2, .16, 1.7]} color="#c5c4b9"/><Block p={[0, 1.12, 1.5]} s={[3.2, .06, .06]} color="#63787e"/>{[-1.55, 1.55].map(x => <Block key={x} p={[x, .60, 1.5]} s={[.055, 1.1, .055]} color="#63787e"/>)}<mesh position={[0, .62, 1.5]}><boxGeometry args={[3.1, 1.03, .018]}/><meshPhysicalMaterial color="#99b8c0" transparent opacity={.48} roughness={.1} depthWrite={false}/></mesh></group>}</group>;
}
function Building({ variant, floor, onFloorSelect }: {
    variant: ApartmentVariant;
    floor?: number;
    onFloorSelect?: (n: number) => void;
}) {
    const s = buildingSpecs[variant];
    const texture = useSurface(s.surface, s.base);
    const [hover, setHover] = useState<number | null>(null);
    const bay = s.width / s.units;
    return <group position={[-s.width / 2, 0, -s.depth / 2]}>
    <Block p={[s.width / 2, -.15, s.depth / 2]} s={[s.width + .5, .3, s.depth + .5]} color="#b4b6ad"/>
    {Array.from({ length: s.floors }, (_, f) => {
            const setback = variant === "kalliolinna" && f === 4 ? 1 : 0;
            return <group key={f} onPointerOver={e => { e.stopPropagation(); setHover(f + 1); }} onPointerOut={() => setHover(null)} onClick={e => { e.stopPropagation(); onFloorSelect?.(f + 1); }}>
        <Block p={[s.width / 2, f * 3 + 1.5, s.depth / 2]} s={[s.width - setback * 2, 2.97, s.depth - setback * 2]} color={hover === f + 1 ? "#fff2d5" : "#ffffff"} map={texture}/>
        <Block p={[s.width / 2, f * 3 + .04, s.depth + .05 - setback]} s={[s.width - setback * 2, .09, .20]} color={floor === f + 1 ? "#d49b3c" : "#b8b8ab"}/>
        {Array.from({ length: s.units }, (_, i) => <group key={i}><Window x={bay * (i + .5)} y={f * 3 + 1.65} z={s.depth - setback + .08} accent={s.accent} balcony={s.floors > 1 && f > 0} width={s.floors === 1 ? 2.4 : 1.7}/><group position={[bay * (i + .5), f * 3 + 1.65, setback - .08]} rotation={[0, Math.PI, 0]}><Window x={0} y={0} z={0} accent={s.accent} width={1.6}/></group>{s.floors === 1 && <><Block p={[bay * (i + .5), -.01, s.depth + 1.1]} s={[bay - .5, .10, 2.2]} color="#bda685"/><Block p={[bay * (i + .15), 1.05, s.depth + .08]} s={[.98, 2.1, .12]} color={s.accent}/><Block p={[bay * (i + .15), 2.4, s.depth + .45]} s={[1.5, .10, 1.1]} color={s.roof}/><Block p={[bay * (i + 1) - .2, .65, s.depth + 1.1]} s={[.12, 1.3, 2.2]} color={s.accent}/></>}</group>)}
      </group>;
        })}
    {s.pitched ? <Roof width={s.width} depth={s.depth} y={s.floors * 3} color={s.roof}/> : <Block p={[s.width / 2, s.floors * 3 + .08, s.depth / 2]} s={[s.width + .35, .22, s.depth + .35]} color={s.roof}/>}
    {s.wing && <group position={[s.width - 5, 0, -7]}><Block p={[2.5, 6, 3.5]} s={[5, 12, 7]} color="white" map={texture}/><Block p={[2.5, 12.1, 3.5]} s={[5.2, .2, 7.2]} color={s.roof}/>{[0, 1, 2, 3].map(f => <group key={f} position={[5.08, 1.65 + 3 * f, 3.4]} rotation={[0, Math.PI / 2, 0]}><Window x={0} y={0} z={0} accent={s.accent}/></group>)}</group>}
    {s.floors > 1 && <><Block p={[s.width * .48, 1.13, s.depth + .13]} s={[1.7, 2.25, .16]} color="#334b54"/><Block p={[s.width * .48, 2.55, s.depth + .7]} s={[3.3, .13, 1.5]} color={s.roof}/><Block p={[s.width * .48, .05, s.depth + 1.2]} s={[3.4, .12, 2.4]} color="#b8bcb3"/></>}
    {[.2, s.width - .2].map(x => <Block key={x} p={[x, s.floors * 1.5, s.depth + .12]} s={[.09, s.floors * 3, .09]} color={s.roof}/>)}
    <Block p={[s.width / 2, -.20, s.depth + 2.8]} s={[s.width + 3, .08, 1.5]} color="#c8c8ba"/>
    {s.floors === 1 && Array.from({ length: s.units }, (_, i) => <Block key={i} p={[bay * (i + .5), -.18, s.depth + 5.2]} s={[bay - .7, .09, 3.2]} color="#91a084"/>)}
  </group>;
}
export default function BuildingScene({ variant = "kalliolinna", floor, onFloorSelect }: {
    variant?: ApartmentVariant;
    floor?: number;
    onFloorSelect?: (n: number) => void;
}) {
    const { text } = useLanguage(), s = buildingSpecs[variant];
    const { ref, ready, unavailable } = useSceneReady();
    return <div ref={ref} className="h-full w-full"><SceneBoundary fallback={<div className="grid h-full place-items-center bg-[#e5eae6] p-8 text-center text-[#173655]"><div><h3 className="text-2xl">{s.name}</h3><p className="mt-3">{s.floors} {text({ fi: "kerrosta", en: "storeys", sv: "våningar" })} · {s.width} × {s.depth} m</p><p className="mt-3 text-sm">{text({ fi: "3D vaatii WebGL-tuen. Pohjapiirustukset ovat saatavilla.", en: "3D requires WebGL. Floor drawings are available.", sv: "3D kräver WebGL. Planritningar är tillgängliga." })}</p></div></div>}>
    {unavailable && <div className="grid h-full place-items-center p-8 text-center text-[#173655]"><div><h3 className="text-2xl font-semibold">{s.name}</h3><p className="mt-4">{s.floors} {text({ fi: "kerrosta", en: "storeys", sv: "våningar" })} · {s.width} × {s.depth} m</p><p className="mt-4 max-w-xs text-sm leading-6">{text({ fi: "Selaimen 3D-tuki ei ole käytettävissä. Asuntojen piirustukset toimivat normaalisti.", en: "This browser has no available 3D support. Apartment drawings remain available.", sv: "Webbläsarens 3D-stöd är inte tillgängligt. Planritningarna fungerar normalt." })}</p></div></div>}
    {ready && <Canvas key={variant} shadows dpr={[1, 2]} camera={{ position: [s.width * .9, Math.max(s.floors * 3 + 6, 15), s.width * 1.1], fov: 43, near: .1, far: 150 }} gl={{ antialias: true }}><color attach="background" args={["#e4eae7"]}/><hemisphereLight args={["#f5f8ff", "#a6a290", 2]}/><directionalLight position={[-18, 32, 15]} intensity={3} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-24} shadow-camera-right={24} shadow-camera-top={24} shadow-camera-bottom={-24} shadow-bias={-.0002}/><Building variant={variant} floor={floor} onFloorSelect={onFloorSelect}/><ContactShadows position={[0, -.34, 0]} opacity={.4} scale={65} far={20} blur={2.4} frames={1}/><OrbitControls target={[0, s.floors * 1.3, 1]} minDistance={15} maxDistance={65} maxPolarAngle={Math.PI / 2.1} enableDamping/></Canvas>}
  </SceneBoundary></div>;
}
