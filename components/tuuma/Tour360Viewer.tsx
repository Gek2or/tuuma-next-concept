"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { ArrowRight, Compass, Expand, Hand, Map, RotateCcw, X } from "lucide-react";
import { useLanguage, type LocalizedText } from "./LanguageProvider";

type TourRoom = {
  id: string;
  name: string;
  short: string;
  src: string;
  heading: number;
  hotspot: { left: string; top: string; label: string; target: number };
};

const tourRooms: TourRoom[] = [
  {
    id: "living",
    name: "Olohuone",
    short: "Olo",
    src: "/art/kalliolinna-living-360.webp",
    heading: 0,
    hotspot: { left: "72%", top: "47%", label: "Keittiö", target: 1 },
  },
  {
    id: "kitchen",
    name: "Keittiö",
    short: "Keittiö",
    src: "/art/kalliolinna-living-360.webp",
    heading: -0.95,
    hotspot: { left: "28%", top: "45%", label: "Olohuone", target: 0 },
  },
  {
    id: "bedroom",
    name: "Makuuhuone",
    short: "Makuuhuone",
    src: "/art/kalliolinna-bedroom-360.webp",
    heading: 0.14,
    hotspot: { left: "78%", top: "48%", label: "Kylpyhuone", target: 3 },
  },
  {
    id: "bathroom",
    name: "Kylpyhuone",
    short: "Kylpy",
    src: "/art/kalliolinna-bedroom-360.webp",
    heading: 1.88,
    hotspot: { left: "22%", top: "48%", label: "Makuuhuone", target: 2 },
  },
  {
    id: "balcony",
    name: "Parveke",
    short: "Parveke",
    src: "/art/kalliolinna-living-360.webp",
    heading: -2.12,
    hotspot: { left: "61%", top: "41%", label: "Olohuone", target: 0 },
  },
];

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
  next: { fi: "Seuraava huone", en: "Next room", sv: "Nästa rum" },
  swipe: { fi: "Pyyhkäise nähdäksesi tilan", en: "Swipe to explore the room", sv: "Svep för att utforska rummet" },
  demo: { fi: "Demo-panoraama · esimerkkikuva", en: "Demo panorama · sample image", sv: "Demopanorama · exempelbild" },
  helpTitle: { fi: "Tutki rauhassa", en: "Take your time", sv: "Utforska i lugn och ro" },
  helpBody: { fi: "Vedä näkymää sormella tai hiirellä. Hotspot vie suoraan seuraavaan tilaan.", en: "Drag with your finger or mouse. A hotspot takes you straight to the next room.", sv: "Dra med fingret eller musen. Hotspotten tar dig direkt till nästa rum." },
  loading: { fi: "Ladataan kierrosta…", en: "Loading tour…", sv: "Rundtur laddas…" },
};

function Panorama({ room }: { room: TourRoom }) {
  const texture = useTexture(room.src);
  const panoTexture = useMemo(() => {
    const clonedTexture = texture.clone();
    clonedTexture.colorSpace = THREE.SRGBColorSpace;
    clonedTexture.anisotropy = 4;
    clonedTexture.needsUpdate = true;
    return clonedTexture;
  }, [texture]);

  return (
    <mesh rotation={[0, room.heading, 0]} scale={[-1, 1, 1]}>
      <sphereGeometry args={[10, 64, 40]} />
      <meshBasicMaterial map={panoTexture} side={THREE.BackSide} toneMapped={false} />
    </mesh>
  );
}

function PanoCanvas({ room, loadingLabel }: { room: TourRoom; loadingLabel: string }) {
  return (
    <Canvas
      key={room.id}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 0.01], fov: 72 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
    >
      <Suspense
        fallback={
          <Html center>
            <div className="rounded-full bg-white/90 px-4 py-3 text-sm font-black text-[#183754] shadow-xl">
              {loadingLabel}
            </div>
          </Html>
        }
      >
        <Panorama room={room} />
      </Suspense>
      <OrbitControls
        makeDefault
        enablePan={false}
        enableZoom={false}
        minPolarAngle={1.18}
        maxPolarAngle={1.98}
        rotateSpeed={-0.34}
        dampingFactor={0.08}
        enableDamping
      />
    </Canvas>
  );
}

function PanoramaFallback({ room }: { room: TourRoom }) {
  return (
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(180deg,rgba(5,22,38,.04),rgba(5,22,38,.34)),url(${room.src})`,
      }}
      role="img"
      aria-label={`${room.name} 360° -näkymä`}
    />
  );
}

function useWebgl() {
  const [enabled, setEnabled] = useState(true);
  useEffect(() => {
    const canvas = document.createElement("canvas");
    const context =
      canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true }) ||
      canvas.getContext("webgl", { failIfMajorPerformanceCaveat: true });
    queueMicrotask(() => setEnabled(Boolean(context && !context.isContextLost())));
  }, []);
  return enabled;
}

export default function Tour360Viewer() {
  const { text } = useLanguage();
  const [roomIndex, setRoomIndex] = useState(0);
  const [full, setFull] = useState(false);
  const [help, setHelp] = useState(false);
  const webgl = useWebgl();
  const room = tourRooms[roomIndex];
  const progress = useMemo(() => `${roomIndex + 1} / ${tourRooms.length}`, [roomIndex]);
  const roomLabel = (id: string) => text(roomCopy[id] ?? { fi: id, en: id, sv: id });

  function setRoom(index: number) {
    setRoomIndex((index + tourRooms.length) % tourRooms.length);
  }

  function toggleFullscreen() {
    setFull((value) => !value);
  }

  return (
    <div
      className={`${full ? "fixed inset-0 z-[90] rounded-none" : "relative min-h-[520px] rounded-[30px] sm:min-h-[570px]"} overflow-hidden bg-[#0a223d] shadow-[0_24px_65px_rgba(3,19,35,.24)]`}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") setRoom(roomIndex + 1);
        if (event.key === "ArrowLeft") setRoom(roomIndex - 1);
        if (event.key === "Escape" && full) setFull(false);
      }}
      tabIndex={0}
      aria-label={text(tourCopy.tourLabel)}
    >
      {webgl ? <PanoCanvas room={room} loadingLabel={text(tourCopy.loading)} /> : <PanoramaFallback room={room} />}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,21,38,.32),transparent_26%,transparent_66%,rgba(5,21,38,.68))]" />

      <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-3 sm:inset-x-6 sm:top-6">
        <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-white/92 px-3 py-2 text-xs font-black text-[#183754] shadow-lg backdrop-blur sm:px-4 sm:text-sm">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-[#f0bd58] text-[#173655]">
            <Compass size={15} />
          </span>
          360° · {roomLabel(room.id)}
          <span className="ml-1 font-semibold text-[#6d8193]">{progress}</span>
        </div>
        <div className="pointer-events-auto flex gap-2">
          <button
            onClick={() => setHelp((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded-full bg-white/92 text-[#173655] shadow-lg backdrop-blur"
            aria-label={help ? text(tourCopy.closeHelp) : text(tourCopy.help)}
            aria-pressed={help}
          >
            <Hand size={18} />
          </button>
          <button
            onClick={toggleFullscreen}
            className="grid h-11 w-11 place-items-center rounded-full bg-white/92 text-[#173655] shadow-lg backdrop-blur"
            aria-label={full ? text(tourCopy.exitFullscreen) : text(tourCopy.fullscreen)}
          >
            {full ? <X size={19} /> : <Expand size={18} />}
          </button>
        </div>
      </div>

      {help && (
        <div className="absolute left-4 right-4 top-20 max-w-sm rounded-2xl border border-white/30 bg-[#102e4e]/90 p-4 text-sm leading-6 text-white shadow-xl backdrop-blur sm:left-6 sm:right-auto sm:top-24">
          <b className="block">{text(tourCopy.helpTitle)}</b>
          <p className="mt-1 text-white/75">{text(tourCopy.helpBody)}</p>
        </div>
      )}

      <button
        onClick={() => setRoom(room.hotspot.target)}
        className="absolute grid min-h-11 -translate-x-1/2 -translate-y-1/2 place-items-center gap-2 rounded-full border-2 border-white/80 bg-[#0b58a8]/95 px-3 py-2 text-xs font-black text-white shadow-[0_8px_24px_rgba(4,24,45,.32)] transition hover:scale-105 sm:px-4 sm:text-sm"
        style={{ left: room.hotspot.left, top: room.hotspot.top }}
        aria-label={`${text({ fi: "Siirry tilaan", en: "Go to", sv: "Gå till" })} ${roomLabel(tourRooms[room.hotspot.target].id)}`}
      >
        <span className="grid h-5 w-5 place-items-center rounded-full bg-white text-[#0b58a8]">
          <ArrowRight size={13} />
        </span>
        {roomLabel(tourRooms[room.hotspot.target].id)}
      </button>

      <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5">
        <div className="mx-auto flex max-w-4xl flex-col gap-3 rounded-[22px] border border-white/15 bg-[#092541]/78 p-2 shadow-2xl backdrop-blur-xl sm:flex-row sm:items-center sm:p-3">
          <div className="hidden items-center gap-2 px-3 text-xs font-bold text-white/60 sm:flex">
            <Map size={15} />
            {text(tourCopy.rooms)}
          </div>
          <div className="hide-scrollbar flex min-w-0 gap-1 overflow-x-auto">
            {tourRooms.map((item, index) => (
              <button
                key={item.id}
                onClick={() => setRoom(index)}
                className={`shrink-0 rounded-xl px-3 py-3 text-left text-xs font-black transition sm:px-4 sm:text-sm ${index === roomIndex ? "bg-white text-[#173655] shadow" : "text-white/78 hover:bg-white/10"}`}
                aria-current={index === roomIndex ? "step" : undefined}
              >
                <span className="block sm:hidden">{roomLabel(item.id)}</span>
                <span className="hidden sm:block">{roomLabel(item.id)}</span>
              </button>
            ))}
          </div>
          <button
            onClick={() => setRoom(roomIndex + 1)}
            className="hidden h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#f0bd58] text-[#163553] sm:grid"
            aria-label={text(tourCopy.next)}
          >
            <ArrowRight size={18} />
          </button>
        </div>
        <div className="mx-auto mt-3 flex max-w-4xl items-center justify-between text-[11px] font-semibold text-white/70">
          <span className="flex items-center gap-2"><RotateCcw size={13} /> {text(tourCopy.swipe)}</span>
          <span>{text(tourCopy.demo)}</span>
        </div>
      </div>
    </div>
  );
}

export const Tour360ViewerLazy = dynamic(() => import("./Tour360Viewer"), { ssr: false });
