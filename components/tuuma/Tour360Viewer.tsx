"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { Compass, Expand, Hand, Map, RotateCcw, X } from "lucide-react";
import { useLanguage, type LocalizedText } from "./LanguageProvider";
import { apartments, type Apartment } from "@/lib/data";

type TourRoom = {
  id: string;
  src: string;
  heading: number;
  hotspot: { left: string; top: string; target: number };
};

const roomCopy: Record<string, LocalizedText> = {
  living: { fi: "Olohuone", en: "Living room", sv: "Vardagsrum" },
  kitchen: { fi: "Keittiö", en: "Kitchen", sv: "Kök" },
  bedroom: { fi: "Makuuhuone", en: "Bedroom", sv: "Sovrum" },
  bathroom: { fi: "Kylpyhuone", en: "Bathroom", sv: "Badrum" },
  balcony: { fi: "Parveke", en: "Balcony", sv: "Balkong" },
};

const tourCopy: Record<string, LocalizedText> = {
  tourLabel: { fi: "360 asteen virtuaalikierros", en: "360-degree virtual tour", sv: "Virtuell rundtur i 360°" },
  help: { fi: "Näytä 360-ohje", en: "Show 360° guidance", sv: "Visa 360°-guide" },
  closeHelp: { fi: "Piilota 360-ohje", en: "Hide 360° guidance", sv: "Dölj 360°-guide" },
  fullscreen: { fi: "Avaa koko näyttö", en: "Open fullscreen", sv: "Öppna helskärm" },
  exitFullscreen: { fi: "Poistu koko näytöstä", en: "Exit fullscreen", sv: "Avsluta helskärm" },
  rooms: { fi: "Huoneet", en: "Rooms", sv: "Rum" },
  miniMap: { fi: "Pohjakartta", en: "Floor plan", sv: "Planritning" },
  next: { fi: "Seuraava huone", en: "Next room", sv: "Nästa rum" },
  swipe: { fi: "Pyyhkäise nähdäksesi tilan", en: "Swipe to explore the room", sv: "Svep för att utforska rummet" },
  demo: { fi: "Demo-panoraama · 2:1 equirectangular", en: "Demo panorama · 2:1 equirectangular", sv: "Demopanorama · 2:1 equirectangular" },
  helpTitle: { fi: "Tutki rauhassa", en: "Take your time", sv: "Utforska i lugn och ro" },
  helpBody: { fi: "Vedä näkymää sormella tai hiirellä. Hotspot vie suoraan seuraavaan tilaan. Nuolinäppäimet toimivat, kun kierros on aktiivinen.", en: "Drag with your finger or mouse. A hotspot takes you straight to the next room. Arrow keys work when the tour is focused.", sv: "Dra med fingret eller musen. Hotspotten tar dig till nästa rum. Piltangenterna fungerar när rundturen är aktiv." },
  loading: { fi: "Ladataan kierrosta…", en: "Loading tour…", sv: "Rundtur laddas…" },
  gyro: { fi: "Liikeohjaus", en: "Motion control", sv: "Rörelsestyrning" },
  gyroOn: { fi: "Liikeohjaus valmis", en: "Motion control ready", sv: "Rörelsestyrning klar" },
};

const miniMapLayout: Record<string, { x: number; y: number; w: number; h: number }> = {
  living: { x: 8, y: 8, w: 76, h: 39 },
  kitchen: { x: 8, y: 47, w: 38, h: 40 },
  hall: { x: 46, y: 47, w: 38, h: 40 },
  bedroom: { x: 84, y: 8, w: 68, h: 39 },
  bathroom: { x: 84, y: 47, w: 34, h: 40 },
  balcony: { x: 118, y: 47, w: 34, h: 40 },
};

function roomsFor(apartment: Apartment): TourRoom[] {
  const base = apartment.tour.startHeading ?? 0;
  return [
    { id: "living", src: apartment.tour.living, heading: base, hotspot: { left: "72%", top: "47%", target: 1 } },
    { id: "kitchen", src: apartment.tour.kitchen, heading: base - 0.72, hotspot: { left: "27%", top: "45%", target: 0 } },
    { id: "bedroom", src: apartment.tour.bedroom, heading: base + 0.14, hotspot: { left: "78%", top: "48%", target: 3 } },
    { id: "bathroom", src: apartment.tour.bedroom, heading: base + 1.62, hotspot: { left: "22%", top: "48%", target: 2 } },
    { id: "balcony", src: apartment.tour.living, heading: base - 1.96, hotspot: { left: "61%", top: "41%", target: 0 } },
  ];
}

function Panorama({ room }: { room: TourRoom }) {
  const texture = useTexture(room.src);
  const panoTexture = useMemo(() => {
    const clonedTexture = texture.clone();
    clonedTexture.colorSpace = THREE.SRGBColorSpace;
    clonedTexture.anisotropy = 4;
    clonedTexture.needsUpdate = true;
    return clonedTexture;
  }, [texture]);
  return <mesh rotation={[0, room.heading, 0]} scale={[-1, 1, 1]}><sphereGeometry args={[10, 64, 40]} /><meshBasicMaterial map={panoTexture} side={THREE.BackSide} toneMapped={false} /></mesh>;
}

function PanoCanvas({ room, loadingLabel }: { room: TourRoom; loadingLabel: string }) {
  return <Canvas key={room.src + room.id} dpr={[1, 1.5]} camera={{ position: [0, 0, 0.01], fov: 72 }} gl={{ antialias: true, powerPreference: "high-performance" }} onCreated={({ gl }) => { gl.outputColorSpace = THREE.SRGBColorSpace; }}><Suspense fallback={<Html center><div className="rounded-full bg-white/90 px-4 py-3 text-sm font-black text-[#183754] shadow-xl">{loadingLabel}</div></Html>}><Panorama room={room} /></Suspense><OrbitControls makeDefault enablePan={false} enableZoom={false} minPolarAngle={1.18} maxPolarAngle={1.98} rotateSpeed={-0.34} dampingFactor={0.08} enableDamping /></Canvas>;
}

function PanoramaFallback({ room }: { room: TourRoom }) {
  return <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(180deg,rgba(5,22,38,.04),rgba(5,22,38,.34)),url(${room.src})` }} role="img" aria-label="360°-näkymä" />;
}

function useWebgl() {
  const [enabled, setEnabled] = useState(true);
  useEffect(() => { const canvas = document.createElement("canvas"); const context = canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) || canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true }); queueMicrotask(() => setEnabled(Boolean(context && !context.isContextLost()))); }, []);
  return enabled;
}

export default function Tour360Viewer({ apartment = apartments[0] }: { apartment?: Apartment }) {
  const { text } = useLanguage();
  const rooms = useMemo(() => roomsFor(apartment), [apartment]);
  const [roomIndex, setRoomIndex] = useState(0);
  const [full, setFull] = useState(false);
  const [help, setHelp] = useState(false);
  const [gyro, setGyro] = useState(false);
  const webgl = useWebgl();
  const room = rooms[roomIndex];
  const roomLabel = (id: string) => text(roomCopy[id] ?? { fi: id, en: id, sv: id });
  function setRoom(index: number) { setRoomIndex((index + rooms.length) % rooms.length); }
  async function enableGyro() {
    const orientation = window.DeviceOrientationEvent as typeof DeviceOrientationEvent & { requestPermission?: () => Promise<"granted" | "denied"> };
    if (orientation.requestPermission) { try { const permission = await orientation.requestPermission(); setGyro(permission === "granted"); } catch { setGyro(false); } } else setGyro(true);
  }
  return <div className={`${full ? "fixed inset-0 z-[90] rounded-none" : "relative min-h-[520px] rounded-[30px] sm:min-h-[570px]"} overflow-hidden bg-[#0a223d] shadow-[0_24px_65px_rgba(3,19,35,.24)]`} onKeyDown={(event) => { if (event.key === "ArrowRight") setRoom(roomIndex + 1); if (event.key === "ArrowLeft") setRoom(roomIndex - 1); if (event.key === "Escape" && full) setFull(false); }} tabIndex={0} aria-label={text(tourCopy.tourLabel)}>
    {webgl ? <PanoCanvas room={room} loadingLabel={text(tourCopy.loading)} /> : <PanoramaFallback room={room} />}
    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,21,38,.32),transparent_26%,transparent_66%,rgba(5,21,38,.68))]" />
    <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-3 sm:inset-x-6 sm:top-6"><div className="pointer-events-auto flex min-w-0 items-center gap-2 rounded-full bg-white/92 px-3 py-2 text-xs font-black text-[#183754] shadow-lg backdrop-blur sm:px-4 sm:text-sm"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#f0bd58] text-[#173655]"><Compass size={15} /></span><span className="truncate">{apartment.id} · {roomLabel(room.id)}</span><span className="ml-1 shrink-0 font-semibold text-[#6d8193]">{roomIndex + 1} / {rooms.length}</span></div><div className="pointer-events-auto flex gap-2"><button onClick={() => setHelp((value) => !value)} className="grid h-11 w-11 place-items-center rounded-full bg-white/92 text-[#173655] shadow-lg backdrop-blur" aria-label={help ? text(tourCopy.closeHelp) : text(tourCopy.help)} aria-pressed={help}><Hand size={18} /></button><button onClick={() => void enableGyro()} className={`hidden h-11 rounded-full px-3 text-xs font-black shadow-lg backdrop-blur sm:inline-flex sm:items-center sm:gap-2 ${gyro ? "bg-[#f0bd58] text-[#173655]" : "bg-white/92 text-[#173655]"}`} aria-pressed={gyro}><Compass size={16} />{gyro ? text(tourCopy.gyroOn) : text(tourCopy.gyro)}</button><button onClick={() => setFull((value) => !value)} className="grid h-11 w-11 place-items-center rounded-full bg-white/92 text-[#173655] shadow-lg backdrop-blur" aria-label={full ? text(tourCopy.exitFullscreen) : text(tourCopy.fullscreen)}>{full ? <X size={19} /> : <Expand size={18} />}</button></div></div>
    {help && <div className="absolute left-4 right-4 top-20 max-w-sm rounded-2xl border border-white/30 bg-[#102e4e]/90 p-4 text-sm leading-6 text-white shadow-xl backdrop-blur sm:left-6 sm:right-auto sm:top-24"><b className="block">{text(tourCopy.helpTitle)}</b><p className="mt-1 text-white/75">{text(tourCopy.helpBody)}</p></div>}
    <div className="absolute right-4 top-20 w-36 rounded-2xl border border-white/20 bg-[#102e4e]/82 p-2.5 shadow-xl backdrop-blur sm:right-6 sm:top-24 sm:w-44" role="group" aria-label={text(tourCopy.miniMap)}>
      <div className="mb-1.5 flex items-center gap-1.5 px-1 text-[10px] font-black uppercase tracking-[.14em] text-white/70"><Map size={12} />{text(tourCopy.miniMap)}</div>
      <svg viewBox="0 0 160 96" className="h-auto w-full" role="group" aria-label={text(tourCopy.miniMap)}>
        <rect x="3" y="3" width="154" height="90" rx="6" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.32)" />
        {rooms.map((item) => {
          const box = miniMapLayout[item.id] ?? miniMapLayout.living;
          const index = rooms.findIndex((roomItem) => roomItem.id === item.id);
          return <g key={item.id} role="button" tabIndex={0} aria-label={roomLabel(item.id)} onClick={() => setRoom(index)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setRoom(index); } }} className="cursor-pointer outline-none"><rect x={box.x} y={box.y} width={box.w} height={box.h} rx="3" fill={index === roomIndex ? "#f0bd58" : "rgba(255,255,255,.2)"} stroke={index === roomIndex ? "#fff" : "rgba(255,255,255,.44)"} strokeWidth={index === roomIndex ? 2 : 1} /><text x={box.x + box.w / 2} y={box.y + box.h / 2 + 2} textAnchor="middle" fontSize="6.5" fontWeight="800" fill={index === roomIndex ? "#173655" : "#fff"}>{roomLabel(item.id)}</text></g>;
        })}
      </svg>
    </div>
    <button onClick={() => setRoom(room.hotspot.target)} className="absolute grid min-h-11 -translate-x-1/2 -translate-y-1/2 place-items-center gap-2 rounded-full border-2 border-white/80 bg-[#0b58a8]/95 px-3 py-2 text-xs font-black text-white shadow-[0_8px_24px_rgba(4,24,45,.32)] transition hover:scale-105" style={{ left: room.hotspot.left, top: room.hotspot.top }} aria-label={`${text({ fi: "Siirry tilaan", en: "Go to", sv: "Gå till" })} ${roomLabel(rooms[room.hotspot.target].id)}`}><span className="h-2 w-2 animate-pulse rounded-full bg-[#f0bd58]" />{roomLabel(rooms[room.hotspot.target].id)}</button>
    <div className="absolute inset-x-4 bottom-4 sm:inset-x-6 sm:bottom-6"><div className="flex items-end justify-between gap-3"><div><p className="mb-2 text-[10px] font-black uppercase tracking-[.16em] text-white/65">{text(tourCopy.rooms)}</p><div className="flex max-w-[78vw] gap-2 overflow-x-auto pb-1 sm:max-w-none">{rooms.map((item, index) => <button key={item.id} onClick={() => setRoom(index)} className={`shrink-0 rounded-full border px-3 py-2 text-xs font-black transition ${index === roomIndex ? "border-[#f0bd58] bg-[#f0bd58] text-[#173655]" : "border-white/30 bg-[#0c2a49]/70 text-white hover:bg-white/15"}`} aria-current={index === roomIndex ? "step" : undefined}>{roomLabel(item.id)}</button>)}</div></div><button onClick={() => setRoom(roomIndex + 1)} className="hidden h-11 shrink-0 items-center gap-2 rounded-full bg-white/12 px-4 text-sm font-black text-white backdrop-blur transition hover:bg-white/20 sm:flex" aria-label={text(tourCopy.next)}>{text(tourCopy.next)} <RotateCcw size={14} /></button></div><div className="mt-3 flex items-center justify-between text-[11px] font-semibold text-white/60"><span className="flex items-center gap-2"><Map size={13} /> {text(tourCopy.swipe)}</span><span>{text(tourCopy.demo)}</span></div></div>
  </div>;
}

export const Tour360ViewerLazy = dynamic(() => import("./Tour360Viewer"), { ssr: false });
