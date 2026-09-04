"use client";

import { useEffect, useMemo, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { BedDouble, Box, LampDesk, Palette, Rotate3D, Sofa } from "lucide-react";
import { useLanguage, type LocalizedText } from "./LanguageProvider";
import type { Apartment, ApartmentVariant } from "@/lib/data";

type Room = {
  id: string;
  label: string;
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  kind: "living" | "kitchen" | "hall" | "bedroom" | "bathroom" | "balcony";
};

type InteriorMode = "empty" | "furnished";
type InteriorStyle = "nordic" | "clay" | "forest";

const rooms: Room[] = [
  { id: "living", label: "Olohuone", x: -1.2, z: 0.85, width: 3.1, depth: 2.3, height: 0.78, kind: "living" },
  { id: "kitchen", label: "Keittiö", x: -1.45, z: -1.2, width: 2.6, depth: 1.45, height: 0.62, kind: "kitchen" },
  { id: "hall", label: "Eteinen", x: 0.75, z: -1.15, width: 1.55, depth: 1.55, height: 0.55, kind: "hall" },
  { id: "bedroom", label: "Makuuhuone", x: 1.52, z: 0.95, width: 2.05, depth: 2.3, height: 0.72, kind: "bedroom" },
  { id: "bathroom", label: "Kylpyhuone", x: 1.6, z: -1.2, width: 1.5, depth: 1.45, height: 0.6, kind: "bathroom" },
  { id: "balcony", label: "Parveke", x: -1.28, z: 2.35, width: 2.8, depth: 0.45, height: 0.28, kind: "balcony" },
];

const roomCopy: Record<string, LocalizedText> = {
  living: { fi: "Olohuone", en: "Living room", sv: "Vardagsrum" },
  kitchen: { fi: "Keittiö", en: "Kitchen", sv: "Kök" },
  hall: { fi: "Eteinen", en: "Hallway", sv: "Hall" },
  bedroom: { fi: "Makuuhuone", en: "Bedroom", sv: "Sovrum" },
  bathroom: { fi: "Kylpyhuone", en: "Bathroom", sv: "Badrum" },
  balcony: { fi: "Parveke", en: "Balcony", sv: "Balkong" },
};

const styleCopy: Record<InteriorStyle, LocalizedText> = {
  nordic: { fi: "Vaalea nordic", en: "Light Nordic", sv: "Ljus nordisk" },
  clay: { fi: "Savi & pellava", en: "Clay & linen", sv: "Lera & linne" },
  forest: { fi: "Metsän sävy", en: "Forest tone", sv: "Skogston" },
};

const materialPalettes: Record<ApartmentVariant, { floor: string; wall: string; accent: string; fabric: string }> = {
  kalliolinna: { floor: "#c7a77d", wall: "#d8e2e2", accent: "#355d78", fabric: "#7690a3" },
  asemanvalo: { floor: "#c49367", wall: "#e2d4c4", accent: "#bb664d", fabric: "#d08f6b" },
  ruukinranta: { floor: "#b69d76", wall: "#d0dac9", accent: "#51715e", fabric: "#79927a" },
  peltokaarre: { floor: "#c4b188", wall: "#d9e2ec", accent: "#3f6e9b", fabric: "#8eacc5" },
  keravanjoen: { floor: "#ac8866", wall: "#d8d0c0", accent: "#8c6246", fabric: "#988472" },
};

function makeWoodTexture(base: string, line: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 256, 256);
  for (let y = 0; y < 256; y += 34) {
    ctx.strokeStyle = line;
    ctx.globalAlpha = 0.32;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(256, y + 0.5);
    ctx.stroke();
    ctx.globalAlpha = 0.18;
    for (let x = (y % 2) * 38 - 20; x < 256; x += 76) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + 18, y + 34);
      ctx.stroke();
    }
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2.8, 2.8);
  texture.anisotropy = 4;
  return texture;
}

function makeTileTexture(base: string, grout: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 192;
  canvas.height = 192;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, 192, 192);
  ctx.strokeStyle = grout;
  ctx.globalAlpha = 0.38;
  ctx.lineWidth = 3;
  for (let x = 0; x <= 192; x += 32) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 192); ctx.stroke(); }
  for (let y = 0; y <= 192; y += 32) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(192, y); ctx.stroke(); }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  texture.anisotropy = 4;
  return texture;
}

function Furniture({ room, palette, style }: { room: Room; palette: { floor: string; wall: string; accent: string; fabric: string }; style: InteriorStyle }) {
  const accent = style === "clay" ? "#b36f52" : style === "forest" ? "#476b57" : palette.accent;
  const fabric = style === "clay" ? "#c99077" : style === "forest" ? "#6e8a78" : palette.fabric;
  if (room.kind === "living") return <group position={[room.x - 0.18, room.height + 0.06, room.z]}><mesh position={[0, 0.22, 0.18]} castShadow><boxGeometry args={[1.45, 0.42, 0.72]} /><meshStandardMaterial color={fabric} roughness={0.9} /></mesh><mesh position={[0, 0.48, 0.18]}><boxGeometry args={[1.34, 0.08, 0.62]} /><meshStandardMaterial color={fabric} roughness={1} /></mesh><mesh position={[0.85, 0.16, -0.32]} castShadow><boxGeometry args={[0.8, 0.06, 0.52]} /><meshStandardMaterial color={accent} roughness={0.72} /></mesh><mesh position={[0.85, 0.22, -0.32]}><cylinderGeometry args={[0.05, 0.05, 0.16, 16]} /><meshStandardMaterial color="#6d513d" /></mesh><mesh position={[-0.8, 0.32, -0.34]}><cylinderGeometry args={[0.22, 0.16, 0.08, 24]} /><meshStandardMaterial color="#d2a96b" roughness={0.92} /></mesh></group>;
  if (room.kind === "kitchen") return <group position={[room.x, room.height + 0.08, room.z]}><mesh position={[0, 0.2, -0.3]} castShadow><boxGeometry args={[2.2, 0.38, 0.34]} /><meshStandardMaterial color={accent} roughness={0.55} /></mesh><mesh position={[0, 0.43, -0.3]}><boxGeometry args={[2.28, 0.06, 0.38]} /><meshStandardMaterial color="#d7d2c7" roughness={0.34} metalness={0.14} /></mesh><mesh position={[-0.62, 0.48, -0.3]}><cylinderGeometry args={[0.05, 0.05, 0.1, 16]} /><meshStandardMaterial color="#6c7e82" /></mesh><mesh position={[0.72, 0.5, -0.3]}><cylinderGeometry args={[0.18, 0.18, 0.035, 24]} /><meshStandardMaterial color="#1c354c" roughness={0.2} /></mesh><mesh position={[0.2, 0.18, 0.28]} castShadow><boxGeometry args={[0.72, 0.36, 0.5]} /><meshStandardMaterial color="#d3a76b" roughness={0.88} /></mesh></group>;
  if (room.kind === "bedroom") return <group position={[room.x, room.height + 0.08, room.z]}><mesh position={[0, 0.22, 0.15]} castShadow><boxGeometry args={[1.25, 0.25, 1.26]} /><meshStandardMaterial color="#bc9a77" roughness={0.8} /></mesh><mesh position={[0, 0.41, 0.15]}><boxGeometry args={[1.16, 0.12, 1.16]} /><meshStandardMaterial color={style === "forest" ? "#c4d2c5" : "#f0e9df"} roughness={1} /></mesh><mesh position={[0, 0.52, -0.32]}><boxGeometry args={[1.05, 0.08, 0.28]} /><meshStandardMaterial color={fabric} roughness={1} /></mesh><mesh position={[-0.87, 0.22, -0.22]} castShadow><boxGeometry args={[0.32, 0.45, 0.34]} /><meshStandardMaterial color={accent} roughness={0.62} /></mesh></group>;
  if (room.kind === "hall") return <group position={[room.x, room.height + 0.08, room.z]}><mesh position={[0, 0.28, 0]} castShadow><boxGeometry args={[0.3, 0.55, 0.65]} /><meshStandardMaterial color="#9e765a" roughness={0.86} /></mesh><mesh position={[0, 0.58, 0]}><boxGeometry args={[0.34, 0.035, 0.7]} /><meshStandardMaterial color="#d7c1a0" /></mesh></group>;
  if (room.kind === "bathroom") return <group position={[room.x, room.height + 0.08, room.z]}><mesh position={[-0.25, 0.16, 0]}><boxGeometry args={[0.75, 0.18, 0.48]} /><meshStandardMaterial color="#f8f8f5" roughness={0.28} /></mesh><mesh position={[0.42, 0.26, 0]}><cylinderGeometry args={[0.16, 0.16, 0.36, 20]} /><meshStandardMaterial color="#d7e2e4" roughness={0.22} metalness={0.06} /></mesh></group>;
  return <group position={[room.x, room.height + 0.08, room.z]}><mesh position={[0, 0.03, 0]}><boxGeometry args={[room.width - 0.18, 0.04, room.depth - 0.1]} /><meshStandardMaterial color="#c6d0ca" roughness={0.98} /></mesh><mesh position={[0, 0.28, 0]}><cylinderGeometry args={[0.08, 0.08, 0.44, 16]} /><meshStandardMaterial color="#7b8d8d" roughness={0.45} /></mesh></group>;
}

function RoomBlock({ room, active, onSelect, label, palette, mode, style, floorTexture, tileTexture }: { room: Room; active: boolean; onSelect: (id: string) => void; label: string; palette: { floor: string; wall: string; accent: string; fabric: string }; mode: InteriorMode; style: InteriorStyle; floorTexture: THREE.Texture | null; tileTexture: THREE.Texture | null }) {
  const [hovered, setHovered] = useState(false);
  const isWet = room.kind === "bathroom" || room.kind === "balcony";
  return (
    <group position={[room.x, room.height / 2 + 0.08, room.z]} onClick={(event) => { event.stopPropagation(); onSelect(room.id); }} onPointerOver={(event) => { event.stopPropagation(); setHovered(true); }} onPointerOut={() => setHovered(false)}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[room.width, room.height, room.depth]} />
        <meshStandardMaterial color={active || hovered ? "#0b58a8" : palette.wall} roughness={0.72} transparent opacity={active ? 0.9 : 0.7} />
      </mesh>
      <mesh position={[0, room.height / 2 + 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[room.width - 0.12, room.depth - 0.12]} />
        <meshStandardMaterial map={isWet ? tileTexture ?? undefined : floorTexture ?? undefined} color={active ? "#eaf3fb" : "#ffffff"} roughness={isWet ? 0.42 : 0.84} />
      </mesh>
      {mode === "furnished" && <Furniture room={room} palette={palette} style={style} />}
      <Html position={[0, room.height + 0.23, 0]} center distanceFactor={7}>
        <button onClick={(event) => { event.stopPropagation(); onSelect(room.id); }} className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-black shadow-sm transition ${active ? "border-[#0b58a8] bg-[#0b58a8] text-white" : "border-white/90 bg-white/92 text-[#173655]"}`} aria-label={`Valitse tila ${label}`}>{label}</button>
      </Html>
    </group>
  );
}

function DollhouseScene({ activeRoom, setActiveRoom, roomLabel, apartment, mode, style }: { activeRoom: string; setActiveRoom: (id: string) => void; roomLabel: (id: string) => string; apartment: Apartment; mode: InteriorMode; style: InteriorStyle }) {
  const { camera } = useThree();
  const palette = materialPalettes[apartment.variant] ?? materialPalettes.kalliolinna;
  const floorTexture = useMemo(() => makeWoodTexture(palette.floor, palette.accent), [palette]);
  const tileTexture = useMemo(() => makeTileTexture("#e7e8e3", "#aab9bb"), []);
  useEffect(() => { camera.position.set(6.8, 5.8, 7.4); camera.lookAt(0, 0, 0); }, [camera]);
  return <><ambientLight intensity={1.1} /><directionalLight position={[4, 8, 5]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]} /><group rotation={[0, -0.26, 0]}><mesh position={[0, -0.04, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[8.4, 7.1]} /><meshStandardMaterial color="#f3efe5" roughness={1} /></mesh>{rooms.map((room) => <RoomBlock key={room.id} room={room} label={roomLabel(room.id)} active={room.id === activeRoom} onSelect={setActiveRoom} palette={palette} mode={mode} style={style} floorTexture={floorTexture} tileTexture={tileTexture} />)}<mesh position={[0, 2.05, 0]}><boxGeometry args={[7.1, 0.08, 5.55]} /><meshStandardMaterial color="#d8e2e7" transparent opacity={0.16} side={THREE.DoubleSide} /></mesh></group><ContactShadows position={[0, -0.04, 0]} opacity={0.24} scale={11} blur={2.6} far={8} /><Environment preset="city" /><OrbitControls enablePan={false} minDistance={5.3} maxDistance={10.5} minPolarAngle={0.62} maxPolarAngle={1.35} target={[0, 0.3, 0]} /> </>;
}

function FallbackDollhouse({ activeRoom, setActiveRoom, roomLabel, mode }: { activeRoom: string; setActiveRoom: (id: string) => void; roomLabel: (id: string) => string; mode: InteriorMode }) {
  return <div className="grid h-full min-h-[360px] place-items-center bg-[linear-gradient(145deg,#eff5f7,#dfe9ee)] p-5"><div className="grid w-full max-w-sm grid-cols-3 gap-2 rounded-[22px] border-2 border-[#173655] bg-[#fffdf8] p-3 shadow-xl" role="group" aria-label="Asunnon 3D-pohja"><div className="col-span-full rounded-xl bg-[#eef3f1] px-3 py-2 text-center text-xs font-black text-[#587087]">{mode === "furnished" ? "Kalustettu" : "Tyhjä pohja"}</div>{rooms.map((room) => <button key={room.id} onClick={() => setActiveRoom(room.id)} className={`min-h-20 rounded-xl border-2 p-2 text-xs font-black ${activeRoom === room.id ? "border-[#0b58a8] bg-[#d9eafa] text-[#0b58a8]" : "border-[#c5d3db] bg-[#f8faf8] text-[#4c667e]"}`}>{roomLabel(room.id)}</button>)}</div></div>;
}

export default function ApartmentDollhouse({ apartment }: { apartment: Apartment }) {
  const { text } = useLanguage();
  const [activeRoom, setActiveRoom] = useState("living");
  const [mode, setMode] = useState<InteriorMode>("furnished");
  const [style, setStyle] = useState<InteriorStyle>("nordic");
  const [webgl, setWebgl] = useState(true);
  const selected = rooms.find((room) => room.id === activeRoom) ?? rooms[0];
  const roomLabel = (id: string) => text(roomCopy[id] ?? { fi: id, en: id, sv: id });
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) || canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true });
    queueMicrotask(() => setWebgl(Boolean(context && !context.isContextLost())));
  }, []);
  return <section className="overflow-hidden rounded-[28px] border border-[#d8e2e8] bg-[#fffdf8] shadow-[0_18px_50px_rgba(33,56,74,.06)]" aria-labelledby="dollhouse-title"><div className="border-b border-[#e1e7e8] p-5 sm:p-7"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="eyebrow">3D / material study · {apartment.id}</p><h3 id="dollhouse-title" className="display mt-2 text-3xl text-[#123451] sm:text-4xl">{text({ fi: "Tyhjästä kodiksi", en: "From shell to home", sv: "Från tomt till hem" })}</h3><p className="mt-2 max-w-2xl text-sm text-[#64798d]">{text({ fi: "Tutki rakennetta, materiaaleja ja kalustusta samassa kevyessä mallissa. Jokaisella kohteella on oma sävymaailma.", en: "Explore structure, materials and furnishing in one lightweight model. Each property has its own palette.", sv: "Utforska struktur, material och möblering i samma lätta modell. Varje objekt har sin egen palett." })}</p></div><span className="flex items-center gap-2 rounded-full bg-[#e8f1f5] px-3 py-2 text-xs font-black text-[#315b79]"><Rotate3D size={14} /> {text({ fi: "Teksturoitu", en: "Textured", sv: "Texturerad" })}</span></div><div className="mt-6 flex flex-wrap items-center gap-2"><div className="flex rounded-full bg-[#eef3f2] p-1" role="group" aria-label={text({ fi: "Kalustus", en: "Furnishing", sv: "Möblering" })}><button onClick={() => setMode("empty")} className={`min-h-10 rounded-full px-4 text-sm font-black ${mode === "empty" ? "bg-white text-[#0b58a8] shadow-sm" : "text-[#60758a]"}`}><Box size={15} className="mr-2 inline" />{text({ fi: "Tyhjä", en: "Empty", sv: "Tom" })}</button><button onClick={() => setMode("furnished")} className={`min-h-10 rounded-full px-4 text-sm font-black ${mode === "furnished" ? "bg-white text-[#0b58a8] shadow-sm" : "text-[#60758a]"}`}><Sofa size={15} className="mr-2 inline" />{text({ fi: "Kalustettu", en: "Furnished", sv: "Möblerad" })}</button></div><label className="flex min-h-10 items-center gap-2 rounded-full border border-[#d6e0e3] bg-white px-3 text-sm font-black text-[#526b83]"><Palette size={15} className="text-[#0b58a8]" /><span className="sr-only">{text({ fi: "Sisustustyyli", en: "Interior style", sv: "Inredningsstil" })}</span><select value={style} onChange={(event) => setStyle(event.target.value as InteriorStyle)} className="bg-transparent text-sm font-black outline-none"><option value="nordic">{text(styleCopy.nordic)}</option><option value="clay">{text(styleCopy.clay)}</option><option value="forest">{text(styleCopy.forest)}</option></select></label><span className="ml-auto flex items-center gap-2 text-xs font-bold text-[#7890a1]"><LampDesk size={14} /> {text({ fi: "Materiaalit vaihtuvat tyylin mukaan", en: "Materials adapt to the style", sv: "Materialen följer stilen" })}</span></div></div><div className="grid lg:grid-cols-[1.3fr_.7fr]"><div className="relative h-[390px] bg-[#e7eef1] sm:h-[450px]">{webgl ? <Canvas dpr={[1, 1.4]} camera={{ position: [6.8, 5.8, 7.4], fov: 37 }} gl={{ antialias: true, alpha: true }}><DollhouseScene activeRoom={activeRoom} setActiveRoom={setActiveRoom} roomLabel={roomLabel} apartment={apartment} mode={mode} style={style} /></Canvas> : <FallbackDollhouse activeRoom={activeRoom} setActiveRoom={setActiveRoom} roomLabel={roomLabel} mode={mode} />}<div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/88 px-3 py-2 text-xs font-bold text-[#173655] shadow"><BedDouble size={14} /> {roomLabel(selected.id)}</div></div><div className="p-5 sm:p-7"><p className="eyebrow">{text({ fi: "Valittu tila", en: "Selected room", sv: "Valt rum" })}</p><h4 className="mt-3 text-2xl font-black text-[#173655]">{roomLabel(selected.id)}</h4><p className="mt-2 text-sm leading-6 text-[#61758a]">{text({ fi: "Teksturoidut lattiat, seinät ja kalusteet auttavat hahmottamaan mittakaavan ennen näyttöä.", en: "Textured floors, walls and furniture make scale easier to understand before a viewing.", sv: "Texturerade golv, väggar och möbler gör skalan lättare att förstå före visningen." })}</p><div className="mt-6 grid gap-2">{rooms.map((room) => <button key={room.id} onClick={() => setActiveRoom(room.id)} className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-bold ${room.id === activeRoom ? "border-[#0b58a8] bg-[#edf5fb] text-[#0b58a8]" : "border-[#dce5e9] bg-white text-[#526b82] hover:border-[#9ebbd2]"}`}><span>{roomLabel(room.id)}</span><span className="text-xs text-[#7890a1]">{room.width > 2.4 ? text({ fi: "tila", en: "space", sv: "utrymme" }) : text({ fi: "palvelu", en: "utility", sv: "service" })}</span></button>)}</div></div></div></section>;
}
