"use client";

import { useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Html, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { Box, Rotate3D } from "lucide-react";
import { useLanguage, type LocalizedText } from "./LanguageProvider";

type Room = {
  id: string;
  label: string;
  x: number;
  z: number;
  width: number;
  depth: number;
  height: number;
  color: string;
};

const rooms: Room[] = [
  { id: "living", label: "Olohuone", x: -1.2, z: 0.85, width: 3.1, depth: 2.3, height: 0.75, color: "#b9d8f2" },
  { id: "kitchen", label: "Keittiö", x: -1.45, z: -1.2, width: 2.6, depth: 1.45, height: 0.62, color: "#f1d38c" },
  { id: "hall", label: "Eteinen", x: 0.75, z: -1.15, width: 1.55, depth: 1.55, height: 0.55, color: "#dedbd2" },
  { id: "bedroom", label: "Makuuhuone", x: 1.52, z: 0.95, width: 2.05, depth: 2.3, height: 0.72, color: "#bde1d3" },
  { id: "bathroom", label: "Kylpyhuone", x: 1.6, z: -1.2, width: 1.5, depth: 1.45, height: 0.6, color: "#d7caea" },
  { id: "balcony", label: "Parveke", x: -1.28, z: 2.35, width: 2.8, depth: 0.45, height: 0.28, color: "#cbd9df" },
];

const roomCopy: Record<string, LocalizedText> = {
  living: { fi: "Olohuone", en: "Living room", sv: "Vardagsrum" },
  kitchen: { fi: "Keittiö", en: "Kitchen", sv: "Kök" },
  hall: { fi: "Eteinen", en: "Hallway", sv: "Hall" },
  bedroom: { fi: "Makuuhuone", en: "Bedroom", sv: "Sovrum" },
  bathroom: { fi: "Kylpyhuone", en: "Bathroom", sv: "Badrum" },
  balcony: { fi: "Parveke", en: "Balcony", sv: "Balkong" },
};

function RoomBlock({ room, active, onSelect, label }: { room: Room; active: boolean; onSelect: (id: string) => void; label: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <group
      position={[room.x, room.height / 2 + 0.08, room.z]}
      onClick={(event) => { event.stopPropagation(); onSelect(room.id); }}
      onPointerOver={(event) => { event.stopPropagation(); setHovered(true); }}
      onPointerOut={() => setHovered(false)}
    >
      <mesh castShadow receiveShadow>
        <boxGeometry args={[room.width, room.height, room.depth]} />
        <meshStandardMaterial color={active || hovered ? "#0b58a8" : room.color} roughness={0.72} transparent opacity={active ? 0.92 : 0.76} />
      </mesh>
      <mesh position={[0, room.height / 2 + 0.012, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[room.width - 0.12, room.depth - 0.12]} />
        <meshStandardMaterial color={active ? "#eaf3fb" : "#fffdf8"} roughness={0.95} />
      </mesh>
      <Html position={[0, room.height + 0.23, 0]} center distanceFactor={7}>
        <button
          onClick={(event) => { event.stopPropagation(); onSelect(room.id); }}
          className={`whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-black shadow-sm transition ${active ? "border-[#0b58a8] bg-[#0b58a8] text-white" : "border-white/90 bg-white/92 text-[#173655]"}`}
          aria-label={`Valitse tila ${room.label}`}
        >
          {label}
        </button>
      </Html>
    </group>
  );
}

function DollhouseScene({ activeRoom, setActiveRoom, roomLabel }: { activeRoom: string; setActiveRoom: (id: string) => void; roomLabel: (id: string) => string }) {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(6.8, 5.8, 7.4);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  return (
    <>
      <ambientLight intensity={1.15} />
      <directionalLight position={[4, 8, 5]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]} />
      <group rotation={[0, -0.26, 0]}>
        <mesh position={[0, -0.04, 0]} receiveShadow rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[8.4, 7.1]} />
          <meshStandardMaterial color="#f3efe5" roughness={1} />
        </mesh>
        {rooms.map((room) => <RoomBlock key={room.id} room={room} label={roomLabel(room.id)} active={room.id === activeRoom} onSelect={setActiveRoom} />)}
        <mesh position={[0, 2.05, 0]}>
          <boxGeometry args={[7.1, 0.08, 5.55]} />
          <meshStandardMaterial color="#d8e2e7" transparent opacity={0.18} side={THREE.DoubleSide} />
        </mesh>
      </group>
      <ContactShadows position={[0, -0.04, 0]} opacity={0.24} scale={11} blur={2.6} far={8} />
      <Environment preset="city" />
      <OrbitControls enablePan={false} minDistance={5.3} maxDistance={10.5} minPolarAngle={0.62} maxPolarAngle={1.35} target={[0, 0.3, 0]} />
    </>
  );
}

function FallbackDollhouse({ activeRoom, setActiveRoom, roomLabel }: { activeRoom: string; setActiveRoom: (id: string) => void; roomLabel: (id: string) => string }) {
  return (
    <div className="grid h-full min-h-[360px] place-items-center bg-[linear-gradient(145deg,#eff5f7,#dfe9ee)] p-5">
      <div className="grid w-full max-w-sm grid-cols-3 gap-2 rounded-[22px] border-2 border-[#173655] bg-[#fffdf8] p-3 shadow-xl" role="group" aria-label="Asunnon 3D-pohja">
        {rooms.map((room) => <button key={room.id} onClick={() => setActiveRoom(room.id)} className={`min-h-20 rounded-xl border-2 p-2 text-xs font-black ${activeRoom === room.id ? "border-[#0b58a8] bg-[#d9eafa] text-[#0b58a8]" : "border-[#c5d3db] bg-[#f8faf8] text-[#4c667e]"}`}>{roomLabel(room.id)}</button>)}
      </div>
    </div>
  );
}

export default function ApartmentDollhouse() {
  const { text } = useLanguage();
  const [activeRoom, setActiveRoom] = useState("living");
  const [webgl, setWebgl] = useState(true);
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) || canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true });
    queueMicrotask(() => setWebgl(Boolean(context && !context.isContextLost())));
  }, []);
  const selected = rooms.find((room) => room.id === activeRoom) ?? rooms[0];
  const roomLabel = (id: string) => text(roomCopy[id] ?? { fi: id, en: id, sv: id });
  return (
    <section className="overflow-hidden rounded-[28px] border border-[#d8e2e8] bg-[#fffdf8] shadow-[0_18px_50px_rgba(33,56,74,.06)]" aria-labelledby="dollhouse-title">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#e1e7e8] p-5 sm:p-7">
        <div>
          <p className="eyebrow">3D / dollhouse</p>
          <h3 id="dollhouse-title" className="display mt-2 text-3xl text-[#123451] sm:text-4xl">{text({ fi: "Näe koti yhdellä silmäyksellä", en: "See the home at a glance", sv: "Se bostaden med en blick" })}</h3>
          <p className="mt-2 text-sm text-[#64798d]">{text({ fi: "Pyöritä näkymää ja valitse tila. Kevyt fallback toimii myös ilman WebGL:ää.", en: "Rotate the view and select a room. A lightweight fallback works without WebGL.", sv: "Rotera vyn och välj ett rum. En lätt fallback fungerar även utan WebGL." })}</p>
        </div>
          <span className="flex items-center gap-2 rounded-full bg-[#e8f1f5] px-3 py-2 text-xs font-black text-[#315b79]"><Rotate3D size={14} /> {text({ fi: "Interaktiivinen", en: "Interactive", sv: "Interaktiv" })}</span>
      </div>
      <div className="grid lg:grid-cols-[1.3fr_.7fr]">
        <div className="relative h-[390px] bg-[#e7eef1] sm:h-[450px]">
          {webgl ? <Canvas dpr={[1, 1.4]} camera={{ position: [6.8, 5.8, 7.4], fov: 37 }} gl={{ antialias: true, alpha: true }}><DollhouseScene activeRoom={activeRoom} setActiveRoom={setActiveRoom} roomLabel={roomLabel} /></Canvas> : <FallbackDollhouse activeRoom={activeRoom} setActiveRoom={setActiveRoom} roomLabel={roomLabel} />}
          <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-2 rounded-full bg-white/88 px-3 py-2 text-xs font-bold text-[#173655] shadow"><Box size={14} /> {roomLabel(selected.id)}</div>
        </div>
        <div className="p-5 sm:p-7">
          <p className="eyebrow">{text({ fi: "Valittu tila", en: "Selected room", sv: "Valt rum" })}</p>
          <h4 className="mt-3 text-2xl font-black text-[#173655]">{roomLabel(selected.id)}</h4>
          <p className="mt-2 text-sm leading-6 text-[#61758a]">{text({ fi: "3D-esitys auttaa hahmottamaan kulkureitit, luonnonvalon ja tilojen yhteyden ennen näyttöä.", en: "The 3D view helps you understand routes, daylight and how the rooms connect before a viewing.", sv: "3D-vyn hjälper dig förstå flöden, dagsljus och hur rummen hänger ihop före visningen." })}</p>
          <div className="mt-6 grid gap-2">
            {rooms.map((room) => <button key={room.id} onClick={() => setActiveRoom(room.id)} className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm font-bold ${room.id === activeRoom ? "border-[#0b58a8] bg-[#edf5fb] text-[#0b58a8]" : "border-[#dce5e9] bg-white text-[#526b82] hover:border-[#9ebbd2]"}`}><span>{roomLabel(room.id)}</span><span className="text-xs text-[#7890a1]">{room.width > 2.4 ? text({ fi: "tila", en: "space", sv: "utrymme" }) : text({ fi: "palvelu", en: "utility", sv: "service" })}</span></button>)}
          </div>
        </div>
      </div>
    </section>
  );
}
